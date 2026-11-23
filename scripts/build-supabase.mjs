import {build} from 'esbuild';
import {resolve} from 'node:path';
await build({entryPoints:[resolve(import.meta.dirname,'../supabase/edge-entry.mjs')],bundle:true,format:'esm',platform:'neutral',outfile:resolve(import.meta.dirname,'../supabase/functions/game/index.ts')});
console.log('Built Supabase Edge Function');
