-- One indexed lookup per table; do not fetch totals before a player finishes.
create or replace function public.ooo_read(p_game text,p_day date,p_player uuid) returns jsonb
language sql security invoker set search_path='' as $$
 select jsonb_build_object('state',s.state,'revision',coalesce(s.revision,0),
 'result',case when r.player is not null then jsonb_build_object('attempts',r.attempts,'solved',r.solved,'correct',r.correct) end,
 'bins',coalesce(to_jsonb(t.bins),'[0,0,0,0]'::jsonb),
 'first',coalesce(to_jsonb(t.first_correct),'[0,0,0,0,0]'::jsonb))
 from (values(1)) seed(n)
 left join public.ooo_sessions s on s.game_version=p_game and s.day=p_day and s.player=p_player
 left join public.ooo_results r on r.game_version=p_game and r.day=p_day and r.player=p_player
 left join public.ooo_totals t on r.player is not null and t.game_version=p_game and t.day=p_day
$$;

-- Combine throttling and reading in a single database round trip.
create function public.ooo_load(p_game text,p_day date,p_player uuid) returns jsonb
language plpgsql security invoker set search_path='' as $$
begin
 if not public.ooo_allow(p_player) then return '{"rate_limited":true}'::jsonb; end if;
 return public.ooo_read(p_game,p_day,p_player);
end $$;

create function public.ooo_resume_v2(p_game text,p_day date,p_player uuid,p_state jsonb) returns jsonb
language plpgsql security invoker set search_path='' as $$
begin
 if not public.ooo_allow(p_player) then return '{"rate_limited":true}'::jsonb; end if;
 return public.ooo_resume(p_game,p_day,p_player,p_state);
end $$;

-- Percentage refreshes never return a player's full attempt history.
create function public.ooo_stats(p_game text,p_day date,p_player uuid) returns jsonb
language plpgsql security invoker set search_path='' as $$
begin
 if not public.ooo_allow(p_player) then return '{"rate_limited":true}'::jsonb; end if;
 return (
 select jsonb_build_object(
 'result',case when r.player is not null then jsonb_build_object('attempts',r.attempts,'solved',r.solved,'correct',r.correct) end,
 'bins',coalesce(to_jsonb(t.bins),'[0,0,0,0]'::jsonb),
 'first',coalesce(to_jsonb(t.first_correct),'[0,0,0,0,0]'::jsonb))
 from (values(1)) seed(n)
 left join public.ooo_results r on r.game_version=p_game and r.day=p_day and r.player=p_player
 left join public.ooo_totals t on t.game_version=p_game and t.day=p_day);
end $$;
revoke all on function public.ooo_load(text,date,uuid),public.ooo_resume_v2(text,date,uuid,jsonb),public.ooo_stats(text,date,uuid) from public,anon,authenticated;
grant execute on function public.ooo_load(text,date,uuid),public.ooo_resume_v2(text,date,uuid,jsonb),public.ooo_stats(text,date,uuid) to service_role;
