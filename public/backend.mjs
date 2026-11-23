import {backend} from './backend-config.mjs';
let clientPromise;
let signingIn;
async function client() {
 if (!clientPromise) clientPromise = import('./supabase-client.mjs').then(({createClient}) => createClient(backend.url, backend.publishableKey, {auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false,storageKey:'out-of-order.supabase.auth'}}));
 return clientPromise;
}
export async function apiFetch(path, options = {}) {
 if (!backend) return fetch(path, options);
 const supabase = await client();
 const {data:{session},error:sessionError} = await supabase.auth.getSession();
 if (sessionError) throw Error('Could not restore your player session. Try again.');
 let current = session;
 if (!current) {
  const signIn=async()=>{
   const {data:{session:existing}}=await supabase.auth.getSession();if(existing)return existing;
   const {data,error}=await supabase.auth.signInAnonymously();
   if(error)throw Error('Could not start your daily session. Try again shortly.');
   return data.session;
  };
  if(!signingIn)signingIn=(navigator.locks?navigator.locks.request('out-of-order-player',signIn):signIn()).finally(()=>{signingIn=null});
  current=await signingIn;
 }
 const headers = new Headers(options.headers);
 headers.set('authorization', 'Bearer '+current.access_token);
 headers.set('apikey', backend.publishableKey);
 const route = path.replace(/^\/api\//, '');
 // Completion is already committed by the server's final check.
 if(route.startsWith('daily?'))options={...options,method:'GET',body:undefined};
 return fetch(backend.url+'/functions/v1/game/'+route, {...options, credentials:'omit', headers});
}
