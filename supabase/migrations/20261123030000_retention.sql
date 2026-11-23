-- Small BRIN indexes keep age-based cleanup inexpensive as the tables grow.
create index ooo_sessions_retention_day on public.ooo_sessions using brin(day);
create index ooo_results_retention_day on public.ooo_results using brin(day);

create function public.ooo_cleanup() returns jsonb
language plpgsql security invoker set search_path='' as $$
declare sessions_removed integer; results_removed integer; limits_removed integer;
begin
 -- A bounded batch avoids a long transaction during a traffic spike.
 delete from public.ooo_sessions where ctid in (
  select ctid from public.ooo_sessions where day<(now() at time zone 'UTC')::date-7 limit 5000
 );
 get diagnostics sessions_removed=row_count;
 delete from public.ooo_results where ctid in (
  select ctid from public.ooo_results where day<(now() at time zone 'UTC')::date-30 limit 5000
 );
 get diagnostics results_removed=row_count;
 delete from public.ooo_request_limits where ctid in (
  select ctid from public.ooo_request_limits where window_start<now()-interval '1 day' limit 5000
 );
 get diagnostics limits_removed=row_count;
 -- Daily aggregate totals and anonymous Auth identities are intentionally retained.
 return jsonb_build_object('sessions',sessions_removed,'results',results_removed,'limits',limits_removed);
end $$;
revoke all on function public.ooo_cleanup() from public,anon,authenticated;
grant execute on function public.ooo_cleanup() to service_role;

-- Hosted Supabase supports pg_cron; the isolated test engine does not.
do $schedule$
begin
 if exists(select 1 from pg_available_extensions where name='pg_cron') then
  execute 'create extension if not exists pg_cron with schema pg_catalog';
  execute $job$select cron.schedule('out-of-order-retention','17 * * * *','select public.ooo_cleanup();')$job$;
 end if;
end $schedule$;
