import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { CapacitorUpdater } from '@capgo/capacitor-updater';
window.VALE_NATIVE = Capacitor.isNativePlatform();
const UPDATE_ROUTE='vale-study-update-route';
if(window.VALE_NATIVE){
  try{const route=sessionStorage.getItem(UPDATE_ROUTE);if(route&&/^#[a-z0-9/._-]*$/i.test(route))location.hash=route;sessionStorage.removeItem(UPDATE_ROUTE);}catch{}
}
window.ValeNative = {
  platform: Capacitor.getPlatform(),
  async ready(){if(window.VALE_NATIVE)await CapacitorUpdater.notifyAppReady();},
  async updateInfo(){const info=await App.getInfo();return {nativeVersion:info.version,runtime:1};},
  async downloadUpdate(manifest,onProgress){
    const handle=await CapacitorUpdater.addListener('download',event=>{if(event.bundle?.version===manifest.version)onProgress(event.percent);});
    try{return await CapacitorUpdater.download({version:manifest.version,url:manifest.bundle.url,checksum:manifest.bundle.sha256});}
    finally{await handle.remove();}
  },
  async applyUpdate(id){
    try{sessionStorage.setItem(UPDATE_ROUTE,location.hash);}catch{}
    await CapacitorUpdater.set({id});
  },
  async exportJSON(data) {
    const saved = await Filesystem.writeFile({path:'Vale_Study_progress.json', data,
      directory:Directory.Cache, encoding:Encoding.UTF8});
    await Share.share({title:'Vale Study', files:[saved.uri], dialogTitle:'Vale Study'});
  }
};
if (window.VALE_NATIVE) {
  App.addListener('backButton', () => {
    if (document.querySelector('dialog[open]')) document.querySelector('dialog[open]').close();
    else if (!location.hash || location.hash === '#home') App.minimizeApp();
    else location.hash = '#home';
  });
}
