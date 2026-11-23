import {create,restore,check,day,GAME_VERSION} from '../public/order.mjs';
import {comparison} from '../worker/api.mjs';

export function makeHandler({rpc,user,origins,today=day}) {
 return async request => {
  const origin=request.headers.get('origin'),allowed=!origin||origins.includes(origin);
  const headers={'content-type':'application/json; charset=utf-8','cache-control':'no-store','vary':'Origin'};
  if(origin&&allowed)Object.assign(headers,{'access-control-allow-origin':origin,'access-control-allow-headers':'authorization, apikey, content-type, x-client-info','access-control-allow-methods':'GET, POST, OPTIONS'});
  const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers});
  if(!allowed)return json({error:'This origin is not allowed.'},403);
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
  if(!['GET','POST'].includes(request.method))return json({error:'Method not allowed.'},405);
  try {
   const token=request.headers.get('authorization');
   if(!token?.startsWith('Bearer '))return json({error:'A player session is required.'},401);
   const player=await user(token);if(!player)return json({error:'Your player session expired. Reload to continue.'},401);
   if(!await rpc('ooo_allow',{p_player:player}))return json({error:'Too many requests. Try again in a minute.'},429);
   const url=new URL(request.url),route=url.pathname.split('/').pop(),date=url.searchParams.get('day')||today();
   if(!['session','daily'].includes(route))return json({error:'Not found.'},404);
   if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date||date>today())return json({error:'Invalid puzzle date.'},400);
   const args={p_game:GAME_VERSION,p_day:date,p_player:player};
   if(route==='daily') {
    // Results can only be recorded by a server-validated check, never uploaded by a client.
    if(request.method!=='GET')return json({error:'Finish the daily using Check order.'},405);
    const saved=await rpc('ooo_read',args),rows=saved.bins.map((count,i)=>({count,solved:i<3,attempts:i+1})),positions=Object.fromEntries(saved.first.map((value,i)=>['p'+i,value]));
    return json({day:date,...comparison(rows,saved.result,positions)});
   }
   if(date!==today())return json({error:'A new daily is available. Open the Daily tab.'},400);
   const response=(saved,status=200)=>json({day:date,state:saved.state,revision:saved.revision,completed:!!saved.result||!!saved.state?.done,result:saved.result},status);
   if(request.method==='GET')return response(await rpc('ooo_read',args));
   if(!request.headers.get('content-type')?.startsWith('application/json'))return json({error:'Send a JSON request.'},415);
   if(Number(request.headers.get('content-length')||0)>16000)return json({error:'Request too large.'},413);
   const text=await request.text();if(text.length>16000)return json({error:'Request too large.'},413);
   let body;try{body=JSON.parse(text);if(!body||typeof body!=='object')throw Error()}catch{return json({error:'Invalid request.'},400)}
   if(body.action==='resume')return response(await rpc('ooo_resume',{...args,p_state:create('daily',date)}));
   if(body.action!=='check')return json({error:'Invalid daily action.'},400);
   const saved=await rpc('ooo_read',args);
   if(saved.result||saved.state?.done)return response(saved);
   if(!saved.state||!Number.isInteger(body.revision)||body.revision!==saved.revision)return response(saved,409);
   let next;try{next=restore({...saved.state,order:body.order})}catch{return json({error:'Invalid card order.'},400)}
   check(next);
   const updated=await rpc('ooo_check',{...args,p_revision:saved.revision,p_state:next});
   return response(updated,updated.conflict?409:200);
  }catch(error){console.error('Game backend error:',error.message);return json({error:'The daily is temporarily unavailable. Try again.'},503)}
 };
}
