import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';
import {create,solution,day,GAME_VERSION} from '../public/order.mjs';
import {makeHandler} from '../supabase/game-handler.mjs';
const PLAYER='11111111-1111-4111-8111-111111111111',ORIGIN='https://stephaniesgao.github.io';
async function setup(){
 const db=new PGlite();await db.exec('create role anon; create role authenticated; create role service_role bypassrls;');
 await db.exec(await readFile(new URL('../supabase/migrations/20261123010000_game.sql',import.meta.url),'utf8'));
 const rpc=async(name,body)=>{const entries=Object.entries(body),sql=`select public.${name}(${entries.map(([key],i)=>`${key} => $${i+1}`).join(',')}) as data`;return(await db.query(sql,entries.map(([,value])=>typeof value==='object'?JSON.stringify(value):value))).rows[0].data};
 const handler=makeHandler({rpc,user:async token=>token==='Bearer good'?PLAYER:null,origins:[ORIGIN]});
 const request=async(route,body,extra={})=>{const r=await handler(new Request('https://example.supabase.co/functions/v1/game/'+route,{method:body?'POST':'GET',headers:{origin:ORIGIN,authorization:'Bearer good','content-type':'application/json',...extra},body:body?JSON.stringify(body):undefined}));return{status:r.status,data:await r.json()}};
 return {db,rpc,request};
}
test('Supabase uses authoritative daily checks and commits a result only once',async()=>{
 const {db,request}=await setup();try{
  let r=await request('session',{action:'resume',run:{...create(),done:true}});assert.equal(r.status,200);assert.equal(r.data.state.done,false);
  const truth=solution(r.data.state),wrong=[...truth.slice(1),truth[0]];
  r=await request('session',{action:'check',revision:0,order:wrong});assert.equal(r.data.revision,1);
  r=await request('session',{action:'check',revision:0,order:truth});assert.equal(r.status,409);assert.equal(r.data.state.attempts.length,1);
  r=await request('session',{action:'resume',run:create()});assert.equal(r.data.state.attempts.length,1);
  r=await request('session',{action:'check',revision:1,order:truth});assert.equal(r.data.completed,true);assert.equal(r.data.result.attempts,2);
  await request('session',{action:'check',revision:2,order:wrong});await request('session',{action:'resume'});
  const stats=await request('daily');assert.deepEqual(stats.data.bins,[0,1,0,0]);assert.deepEqual(stats.data.percentages,[0,100,0,0]);assert.equal(stats.data.rank.percentile,null);
  const saved=(await db.query('select count(*)::integer as n from public.ooo_results')).rows[0];assert.equal(saved.n,1);
 }finally{await db.close()}
});
test('database rejects stale writes and browser roles cannot read or forge records',async()=>{
 const {db,rpc}=await setup();try{
  const args={p_game:GAME_VERSION,p_day:day(),p_player:PLAYER};await rpc('ooo_resume',{...args,p_state:create()});
  const next=create();next.order=solution(next);const {check}=await import('../public/order.mjs');check(next);
  await rpc('ooo_check',{...args,p_revision:0,p_state:next});
  const stale=await rpc('ooo_check',{...args,p_revision:0,p_state:create()});assert.equal(stale.conflict,true);assert.equal(stale.state.done,true);
  for(const role of ['anon','authenticated']){
   await db.exec('set role '+role);
   await assert.rejects(db.query('select * from public.ooo_sessions'),/permission denied/);
   await assert.rejects(db.query('select public.ooo_read($1,$2,$3)',[GAME_VERSION,day(),PLAYER]),/permission denied/);
   await assert.rejects(db.query('select public.ooo_check($1,$2,$3,0,$4)',[GAME_VERSION,day(),PLAYER,JSON.stringify(create())]),/permission denied/);
   await db.exec('reset role');
  }
 }finally{await db.close()}
});
test('Supabase rejects invalid identity, origin, card orders, uploads, and excessive requests',async()=>{
 const {db,request}=await setup();try{
  assert.equal((await request('session',null,{authorization:'Bearer fake'})).status,401);
  assert.equal((await request('session',null,{origin:'https://evil.example'})).status,403);
  assert.equal((await request('daily',{run:create()})).status,405);
  await request('session',{action:'resume'});
  assert.equal((await request('session',{action:'check',revision:0,order:Array(5).fill('bad')})).status,400);
  assert.equal((await request('session?day=2020-01-01',{action:'resume'})).status,400);
  for(let i=0;i<60;i++)await request('daily');
  assert.equal((await request('daily')).status,429);
 }finally{await db.close()}
});
