import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
window.VALE_NATIVE = Capacitor.isNativePlatform();
window.ValeNative = {
  platform: Capacitor.getPlatform(),
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
