import {cp,mkdir,readFile,rm,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {build} from 'esbuild';
const root=resolve(import.meta.dirname,'..'),out=resolve(root,'pages-dist');
const url=process.env.SUPABASE_URL?.replace(/\/$/,''),publishableKey=process.env.SUPABASE_PUBLISHABLE_KEY;
if(!url||!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url)||!publishableKey)throw Error('Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY to public project settings.');
if(!publishableKey.startsWith('sb_publishable_')) {
 let role;try{role=JSON.parse(Buffer.from(publishableKey.split('.')[1],'base64url')).role}catch{}
 if(role!=='anon')throw Error('Use a publishable or legacy anon key, never a secret/service-role key.');
}
await rm(out,{recursive:true,force:true});await mkdir(out,{recursive:true});await cp(resolve(root,'public'),out,{recursive:true});
await writeFile(resolve(out,'backend-config.mjs'),'export const backend = '+JSON.stringify({url,publishableKey})+';\n');
await build({stdin:{contents:"export {createClient} from '@supabase/supabase-js';",resolveDir:root},bundle:true,format:'esm',platform:'browser',minify:true,outfile:resolve(out,'supabase-client.mjs')});
// Relative font URLs also work beneath /out-of-order/ on GitHub Pages.
for(const file of ['index.html','style.css']){const p=resolve(out,file);await writeFile(p,(await readFile(p,'utf8')).replaceAll('/fonts/','./fonts/'));}
const index=resolve(out,'index.html');await writeFile(index,(await readFile(index,'utf8'))
 .replace('once per signed-in account, or per browser for guests','once per browser player session')
 .replace('A persistent HTTP-only cookie identifies guest browsers. Clearing it can make a guest count as a new player.','Supabase creates an anonymous player session stored in this browser. Clearing browser storage or switching browsers can create a new player.')
 .replace('refreshing or clearing local progress does not restart them','refreshing does not restart them')
 .replace('Personal stats stay in this browser.','Detailed daily attempts are kept for 7 days and individual results for 30 days. Anonymous player identities and daily aggregate percentages are retained. Personal stats stay in this browser.'));
await writeFile(resolve(out,'.nojekyll'),'');console.log('Built GitHub Pages site with Supabase backend');
