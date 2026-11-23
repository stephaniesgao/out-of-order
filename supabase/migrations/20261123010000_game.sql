-- Only the authenticated Edge Function can access these records.
create table public.ooo_sessions (
 game_version text not null, day date not null, player uuid not null,
 state jsonb not null, revision integer not null default 0,
 updated_at timestamptz not null default now(),
 primary key(game_version,day,player)
);
create table public.ooo_results (
 game_version text not null, day date not null, player uuid not null,
 attempts integer not null check(attempts between 1 and 3),
 solved boolean not null, correct integer not null check(correct between 0 and 5),
 created_at timestamptz not null default now(),
 primary key(game_version,day,player)
);
create table public.ooo_totals (
 game_version text not null, day date not null,
 bins bigint[] not null default array[0,0,0,0]::bigint[],
 first_correct bigint[] not null default array[0,0,0,0,0]::bigint[],
 primary key(game_version,day)
);
create table public.ooo_request_limits (
 player uuid primary key, window_start timestamptz not null, requests integer not null
);
alter table public.ooo_sessions enable row level security;
alter table public.ooo_results enable row level security;
alter table public.ooo_totals enable row level security;
alter table public.ooo_request_limits enable row level security;
revoke all on public.ooo_sessions,public.ooo_results,public.ooo_totals,public.ooo_request_limits from anon,authenticated;
grant all on public.ooo_sessions,public.ooo_results,public.ooo_totals,public.ooo_request_limits to service_role;

create function public.ooo_allow(p_player uuid) returns boolean
language plpgsql security invoker set search_path='' as $$
declare n integer;
begin
 insert into public.ooo_request_limits as t values(p_player,date_trunc('minute',now()),1)
 on conflict(player) do update set
 requests=case when t.window_start=date_trunc('minute',now()) then t.requests+1 else 1 end,
 window_start=date_trunc('minute',now()) returning requests into n;
 return n<=60;
end $$;

create function public.ooo_read(p_game text,p_day date,p_player uuid) returns jsonb
language sql security invoker set search_path='' as $$
 select jsonb_build_object(
 'state',(select state from public.ooo_sessions where game_version=p_game and day=p_day and player=p_player),
 'revision',coalesce((select revision from public.ooo_sessions where game_version=p_game and day=p_day and player=p_player),0),
 'result',(select jsonb_build_object('attempts',attempts,'solved',solved,'correct',correct) from public.ooo_results where game_version=p_game and day=p_day and player=p_player),
 'bins',coalesce((select to_jsonb(bins) from public.ooo_totals where game_version=p_game and day=p_day),'[0,0,0,0]'::jsonb),
 'first',coalesce((select to_jsonb(first_correct) from public.ooo_totals where game_version=p_game and day=p_day),'[0,0,0,0,0]'::jsonb))
$$;

create function public.ooo_resume(p_game text,p_day date,p_player uuid,p_state jsonb) returns jsonb
language plpgsql security invoker set search_path='' as $$
begin
 if p_day<>(now() at time zone 'UTC')::date then raise exception 'Invalid daily date'; end if;
 insert into public.ooo_sessions(game_version,day,player,state) values(p_game,p_day,p_player,p_state)
 on conflict do nothing;
 return public.ooo_read(p_game,p_day,p_player);
end $$;

create function public.ooo_check(p_game text,p_day date,p_player uuid,p_revision integer,p_state jsonb) returns jsonb
language plpgsql security invoker set search_path='' as $$
declare s public.ooo_sessions; inserted integer; slot integer; f bigint[]; b bigint[];
begin
 if p_day<>(now() at time zone 'UTC')::date then raise exception 'Invalid daily date'; end if;
 select * into s from public.ooo_sessions where game_version=p_game and day=p_day and player=p_player for update;
 if not found or s.revision<>p_revision then
  return public.ooo_read(p_game,p_day,p_player)||'{"conflict":true}'::jsonb;
 end if;
 if coalesce((s.state->>'done')::boolean,false) then return public.ooo_read(p_game,p_day,p_player); end if;
 update public.ooo_sessions set state=p_state,revision=revision+1,updated_at=now()
 where game_version=p_game and day=p_day and player=p_player;
 if (p_state->>'done')::boolean then
  insert into public.ooo_results(game_version,day,player,attempts,solved,correct)
  values(p_game,p_day,p_player,jsonb_array_length(p_state->'attempts'),(p_state->>'won')::boolean,jsonb_array_length(p_state->'locked'))
  on conflict do nothing;
  get diagnostics inserted=row_count;
  if inserted=1 then
   slot=case when (p_state->>'won')::boolean then jsonb_array_length(p_state->'attempts') else 4 end;
   b=array[0,0,0,0]::bigint[]; b[slot]=1;
   select array_agg(case when value::boolean then 1 else 0 end order by ordinality)::bigint[] into f
   from jsonb_array_elements_text(p_state->'attempts'->0->'matches') with ordinality;
   insert into public.ooo_totals as t values(p_game,p_day,b,f) on conflict(game_version,day) do update set
   bins=array[t.bins[1]+b[1],t.bins[2]+b[2],t.bins[3]+b[3],t.bins[4]+b[4]],
   first_correct=array[t.first_correct[1]+f[1],t.first_correct[2]+f[2],t.first_correct[3]+f[3],t.first_correct[4]+f[4],t.first_correct[5]+f[5]];
  end if;
 end if;
 return public.ooo_read(p_game,p_day,p_player);
end $$;

-- PostgreSQL grants function execution to PUBLIC by default: remove it explicitly.
revoke all on function public.ooo_allow(uuid),public.ooo_read(text,date,uuid),public.ooo_resume(text,date,uuid,jsonb),public.ooo_check(text,date,uuid,integer,jsonb) from public,anon,authenticated;
grant execute on function public.ooo_allow(uuid),public.ooo_read(text,date,uuid),public.ooo_resume(text,date,uuid,jsonb),public.ooo_check(text,date,uuid,integer,jsonb) to service_role;
