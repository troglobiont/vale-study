import {execFileSync} from 'node:child_process';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const mobile=fileURLToPath(new URL('../',import.meta.url)),root=path.resolve(mobile,'..');
const {version}=JSON.parse(await readFile(path.join(mobile,'package.json'),'utf8'));
const app=await readFile(path.join(mobile,'www/app.js'),'utf8');
if(!app.includes(`APP_VERSION='${version}'`))throw Error('Build the current app before packaging an update');
const dest=path.join(mobile,'update');await mkdir(dest,{recursive:true});
const zip=path.join(dest,'Vale-Study-update.zip');
execFileSync('python3',['-c',`from pathlib import Path
import zipfile,sys
source=Path(sys.argv[1])
with zipfile.ZipFile(sys.argv[2],'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as out:
 for file in sorted(source.rglob('*')):
  if not file.is_file():continue
  info=zipfile.ZipInfo(file.relative_to(source).as_posix(),date_time=(2020,1,1,0,0,0))
  info.compress_type=zipfile.ZIP_DEFLATED;info.create_system=3;info.external_attr=0o100644<<16
  out.writestr(info,file.read_bytes(),compress_type=zipfile.ZIP_DEFLATED,compresslevel=9)
`,path.join(mobile,'www'),zip]);
const bytes=await readFile(zip),sha256=createHash('sha256').update(bytes).digest('hex');
const manifest={schemaVersion:1,appId:'io.github.troglobiont.valestudy',version,nativeRuntime:1,minNativeVersion:'0.7.0',bundle:{url:`https://github.com/troglobiont/vale-study/releases/download/v${version}/Vale-Study-update.zip`,sha256}};
await writeFile(path.join(root,'version.json'),JSON.stringify(manifest,null,2)+'\n');
await writeFile(path.join(dest,'Vale-Study-update.zip.sha256'),sha256+'  Vale-Study-update.zip\n');
console.log(JSON.stringify({version,bytes:bytes.length,sha256,zip,manifest:path.join(root,'version.json')}));
