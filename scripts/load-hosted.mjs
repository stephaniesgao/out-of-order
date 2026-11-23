// Bounded production smoke load: four disposable guests, no completed games.
import {performance} from 'node:perf_hooks';
import {writeFile,mkdir} from 'node:fs/promises';
import {createInterface} from 'node:readline/promises';
const URL=process.env.SUPABASE_URL,KEY=process.env.SUPABASE_PUBLISHABLE_KEY,ORIGIN=process.env.GAME_ORIGIN;
if(process.env.LOAD_TEST_CONFIRM!=='out-of-order'||!URL||!KEY||!ORIGIN)throw Error('Set LOAD_TEST_CONFIRM=out-of-order and the public SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, GAME_ORIGIN settings.');
await mkdir('.local/load-test',{recursive:true});
const players=[];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function call(player,route,body){const started=performance.now();const response=await fetch(URL+'/functions/v1/game/'+route,{method:body?'POST':'GET',headers:{apikey:KEY,authorization:'Bearer '+player.token,origin:ORIGIN,...(body?{'content-type':'application/json'}:{})},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(15000)});const text=await response.text();return{status:response.status,ms:performance.now()-started,bytes:Buffer.byteLength(text),data:JSON.parse(text)}}
for(let i=0;i<4;i++){
 const r=await fetch(URL+'/auth/v1/signup',{method:'POST',headers:{apikey:KEY,'content-type':'application/json'},body:'{}',signal:AbortSignal.timeout(15000)}),a=await r.json();if(!r.ok)throw Error('Could not create QA guest: '+r.status);
 players.push({id:a.user.id,token:a.access_token});
 const resumed=await call(players.at(-1),'session',{action:'resume'});if(resumed.status!==200)throw Error('Resume failed');
}
await writeFile('.local/load-test/players.json',JSON.stringify(players.map(p=>p.id)));
console.log('Created four isolated QA guests; their IDs are saved for cleanup. Tokens stay in process memory.');
async function phase(label){const stages=[];for(const concurrency of [1,5,10]){
 const samples=[],count=concurrency===1?10:15;let next=0;
 const started=performance.now();await Promise.all(Array.from({length:concurrency},async()=>{while(next<count){const i=next++;try{const r=await call(players[i%players.length],i%2?'daily':'session');samples.push({status:r.status,ms:r.ms,bytes:r.bytes});}catch{samples.push({status:0,ms:15000,bytes:0})}await sleep(150);}}));
 const times=samples.map(s=>s.ms).sort((a,b)=>a-b);stages.push({concurrency,requests:count,errors:samples.filter(s=>s.status!==200).length,p50Ms:Math.round(times[Math.floor(times.length*.5)]),p95Ms:Math.round(times[Math.min(times.length-1,Math.floor(times.length*.95))]),responseBytes:samples.reduce((n,s)=>n+s.bytes,0),elapsedMs:Math.round(performance.now()-started)});
 }
 const output={label,at:new Date().toISOString(),stages};await writeFile('.local/load-test/'+label+'.json',JSON.stringify(output,null,2));console.log(JSON.stringify(output));
}
await phase('before');console.log('READY_FOR_AFTER');
const rl=createInterface({input:process.stdin,output:process.stdout});await rl.question('Press Enter after optimized backend deployment. ');await phase('after');rl.close();
