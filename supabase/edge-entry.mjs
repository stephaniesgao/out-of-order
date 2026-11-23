import {makeHandler} from './game-handler.mjs';
const url=Deno.env.get('SUPABASE_URL'),key=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const origins=(Deno.env.get('ALLOWED_ORIGINS')||'').split(',').map(s=>s.trim()).filter(Boolean);
const rpc=async(name,body)=>{
 const response=await fetch(url+'/rest/v1/rpc/'+name,{method:'POST',headers:{apikey:key,authorization:'Bearer '+key,'content-type':'application/json'},body:JSON.stringify(body)});
 if(!response.ok)throw Error('Database operation failed: '+name+' '+response.status);
 return response.json();
};
const user=async authorization=>{
 const response=await fetch(url+'/auth/v1/user',{headers:{apikey:key,authorization}});
 if(!response.ok)return null;
 return (await response.json()).id||null;
};
Deno.serve(makeHandler({rpc,user,origins}));
