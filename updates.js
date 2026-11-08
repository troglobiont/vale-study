(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ValeUpdates=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const BASE='https://troglobiont.github.io/vale-study/';
function versionParts(v){if(typeof v!=='string'||!/^\d+\.\d+\.\d+$/.test(v))throw Error('manifest');return v.split('.').map(Number);}
function compare(a,b){const x=versionParts(a),y=versionParts(b);for(let i=0;i<3;i++)if(x[i]!==y[i])return x[i]>y[i]?1:-1;return 0;}
function manifest(raw){
 if(!raw||raw.schemaVersion!==1||raw.appId!=='io.github.troglobiont.valestudy')throw Error('manifest');
 versionParts(raw.version);versionParts(raw.minNativeVersion);
 if(!Number.isInteger(raw.nativeRuntime)||raw.nativeRuntime<1||!raw.bundle||!/^\w{64}$/.test(raw.bundle.sha256)||!/^[a-f\d]{64}$/i.test(raw.bundle.sha256))throw Error('manifest');
 const u=new URL(raw.bundle.url);
 if(u.protocol!=='https:'||u.hostname!=='github.com'||u.username||u.password||u.search||u.hash||u.pathname!==`/troglobiont/vale-study/releases/download/v${raw.version}/Vale-Study-update.zip`)throw Error('manifest');
 return {version:raw.version,minNativeVersion:raw.minNativeVersion,nativeRuntime:raw.nativeRuntime,bundle:{url:u.href,sha256:raw.bundle.sha256.toLowerCase()}};
}
function withTimeout(promise,ms=25000){let timer;return Promise.race([promise,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('timeout')),ms);})]).finally(()=>clearTimeout(timer));}
function waitInstalled(reg,ms=30000){
 if(reg.waiting)return Promise.resolve(reg.waiting);
 return new Promise((resolve,reject)=>{
  let worker=reg.installing,timer;
  const clean=()=>{clearTimeout(timer);reg.removeEventListener('updatefound',found);worker?.removeEventListener('statechange',changed);};
  const changed=()=>{if(reg.waiting||worker?.state==='installed'){const ready=reg.waiting||worker;clean();resolve(ready);}else if(worker?.state==='redundant'){clean();reject(Error('download'));}};
  const found=()=>{worker?.removeEventListener('statechange',changed);worker=reg.installing;worker?.addEventListener('statechange',changed);changed();};
  reg.addEventListener('updatefound',found);worker?.addEventListener('statechange',changed);timer=setTimeout(()=>{clean();reject(Error('timeout'));},ms);changed();
 });
}
function create(options){
 const {version,native=false,bridge,save=()=>true,fetch:fetcher=globalThis.fetch,getRegistration=()=>null,reload=()=>globalThis.location.reload(),online=()=>true,manifestURL=BASE+'version.json',onChange=()=>{}}=options;
 let view={status:'idle',latest:null,progress:0,lastCheck:null,error:null},flight=null;
 const emit=patch=>{view={...view,...patch};onChange({...view});};
 async function readManifest(){
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12000);
  try{const res=await fetcher(manifestURL+'?check='+Date.now(),{cache:'no-store',signal:controller.signal});if(!res.ok)throw Error('network');return manifest(await res.json());}finally{clearTimeout(timer);}
 }
 async function check(){
  if(!online())throw Error('offline');
  const m=await readManifest();emit({latest:m,lastCheck:Date.now()});return m;
 }
 async function run(){
  emit({status:'checking',progress:0,error:null});
  try{
   if(!save())throw Error('save');
   const m=await check();
   if(compare(m.version,version)<=0){emit({status:'current'});return {status:'current'};}
   if(native){
    if(!bridge?.downloadUpdate||!bridge?.applyUpdate)throw Error('native-required');
    const info=await withTimeout(bridge.updateInfo());
    if(m.nativeRuntime!==info.runtime||compare(info.nativeVersion,m.minNativeVersion)<0)throw Error('native-required');
    emit({status:'downloading'});
    const bundle=await withTimeout(bridge.downloadUpdate(m,p=>emit({progress:Math.max(0,Math.min(100,Number(p)||0))})),180000);
    if(!bundle?.id||bundle.version!==m.version||(bundle.checksum&&bundle.checksum.toLowerCase()!==m.bundle.sha256))throw Error('checksum');
    if(!save())throw Error('save');
    emit({status:'applying',progress:100});
    await withTimeout(bridge.applyUpdate(bundle.id),20000);
   }else{
    const reg=await withTimeout(Promise.resolve(getRegistration()));if(!reg)throw Error('unavailable');
    emit({status:'downloading'});await withTimeout(reg.update());
    const worker=await waitInstalled(reg);if(!save())throw Error('save');
    emit({status:'applying',progress:100});
    await new Promise((resolve,reject)=>{
     const sw=options.serviceWorker;let timer;
     const changed=()=>{clearTimeout(timer);sw.removeEventListener('controllerchange',changed);resolve();reload();};
     sw.addEventListener('controllerchange',changed);timer=setTimeout(()=>{sw.removeEventListener('controllerchange',changed);reject(Error('timeout'));},15000);
     worker.postMessage({type:'ACTIVATE'});
    });
   }
   return {status:'applying'};
  }catch(error){const key=['offline','save','native-required','unavailable','checksum','manifest','timeout'].includes(error.message)?error.message:'network';emit({status:'error',error:key});return {status:'error',error:key};}
 }
 function update(){if(!flight)flight=run().finally(()=>{flight=null;});return flight;}
 async function inspect(){if(flight)return;try{const m=await check();if(compare(m.version,version)>0)emit({status:'available'});}catch{/* Background checks never interrupt studying. */}}
 return {state:()=>({...view}),update,inspect};
}
return {BASE,compare,manifest,waitInstalled,create};
});
