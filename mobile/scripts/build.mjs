import { build } from 'esbuild';
import { cp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const mobile = fileURLToPath(new URL('../', import.meta.url));
const root = path.resolve(mobile, '..');
const out = path.join(mobile, 'www');
await rm(out,{recursive:true,force:true});
await mkdir(out,{recursive:true});
const files=['index.html','style.css','app.js','nature-data.js','nature-core.js','nature-ui.js','math-test-core.js','math-test-ui.js','garden-core.js','garden-ui.js','avatar.js','english-data.js','english-practice.js','english-practice-ui.js','english-core.js','english.js','updates.js','core.js','book.js','book.json',
  'icon.svg','icon-180.png','icon-192.png','icon-512.png','assets'];
for(const file of files) await cp(path.join(root,file),path.join(out,file),{recursive:true});
let html=await readFile(path.join(out,'index.html'),'utf8');
html=html.replace(/\s*<link rel="manifest"[^>]+>/,'')
 .replace('<script src="book.js"','<script src="native.js" defer></script><script src="book.js"');
await writeFile(path.join(out,'index.html'),html);
await build({entryPoints:[path.join(mobile,'native-entry.js')],bundle:true,format:'iife',
 outfile:path.join(out,'native.js'),minify:true,target:['safari15','chrome90']});
console.log('Offline app bundle prepared in mobile/www');
