// Isolated PostgreSQL stress test; never touches the hosted database.
import {PGlite} from '@electric-sql/pglite';
import {readFile,readdir,writeFile,mkdir} from 'node:fs/promises';
import {create,check,solution,GAME_VERSION,day} from '../public/order.mjs';
import {performance} from 'node:perf_hooks';
await mkdir('.local/load-test',{recursive:true});
const db=new PGlite();await db.exec('create role anon;create role authenticated;create role service_role bypassrls');
for(const f of (await readdir('supabase/migrations')).filter(f=>f.endsWith('.sql')).sort())await db.exec(await readFile('supabase/migrations/'+f,'utf8'));
const players=500,times=[],start=performance.now();let index=0;
const rpc=async(name,body)=>{const e=Object.entries(body),s=performance.now();const r=await db.query(`select public.${name}(${e.map(([k],i)=>k+' => $'+(i+1)).join(',')}) as data`,e.map(([,v])=>typeof v==='object'?JSON.stringify(v):v));times.push(performance.now()-s);return r.rows[0].data};
await Promise.all(Array.from({length:50},async()=>{while(index<players){const n=index++,player='00000000-0000-4000-8000-'+String(n).padStart(12,'0'),args={p_game:GAME_VERSION,p_day:day(),p_player:player},state=create();await rpc('ooo_resume_v2',{...args,p_state:state});state.order=solution(state);check(state);const results=await Promise.all([rpc('ooo_check',{...args,p_revision:0,p_state:state}),rpc('ooo_check',{...args,p_revision:0,p_state:state})]);if(results.filter(r=>r.conflict).length!==1)throw Error('Race produced multiple results');await rpc('ooo_stats',args);}}));
const counts=(await db.query("select (select count(*)::int from public.ooo_results) as results,(select bins[1] from public.ooo_totals where game_version=$1 and day=$2) as total",[GAME_VERSION,day()])).rows[0];if(counts.results!==players||Number(counts.total)!==players)throw Error('Aggregate mismatch');
const storage=(await db.query("select avg(pg_column_size(state))::int as avg_state_bytes from public.ooo_sessions")).rows[0];
times.sort((a,b)=>a-b);const result={environment:'local PGlite PostgreSQL, serialized in-process engine; not hosted capacity',players,queuedWorkers:50,sqlCalls:times.length,errors:0,results:counts.results,aggregate:Number(counts.total),elapsedMs:Math.round(performance.now()-start),queuedP95Ms:Math.round(times[Math.floor(times.length*.95)]),...storage};
await writeFile('.local/load-test/local.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));await db.close();
