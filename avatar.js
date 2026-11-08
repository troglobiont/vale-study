(function(root){
 'use strict';
 const KEY='vale-study-avatar-v1';
 const MAX_FILE_BYTES=20*1024*1024;
 const MAX_STORED_LENGTH=200000;
 const TYPES=new Set(['image/jpeg','image/png','image/webp','image/gif','image/avif','image/heic','image/heif']);
 function validateFile(file){
  if(!file||!Number.isFinite(file.size)||file.size<=0)return 'avatarReadError';
  const type=String(file.type||'').toLowerCase();
  if(type?!TYPES.has(type):!/\.(jpe?g|png|webp|gif|avif|heic|heif)$/i.test(file.name||''))return 'avatarTypeError';
  if(file.size>MAX_FILE_BYTES)return 'avatarSizeError';
  return null;
 }
 function isStored(value){
  return typeof value==='string'&&value.length<=MAX_STORED_LENGTH&&/^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(value);
 }
 function read(storage){
  const value=storage.getItem(KEY);
  return isStored(value)?value:'';
 }
 function save(storage,value){
  if(!isStored(value))throw new Error('avatarReadError');
  storage.setItem(KEY,value);
  return value;
 }
 function remove(storage){storage.removeItem(KEY);}
 function cropRect(width,height){
  if(!Number.isFinite(width)||!Number.isFinite(height)||width<=0||height<=0||width*height>100000000)throw new Error('avatarReadError');
  const side=Math.min(width,height);
  return {x:(width-side)/2,y:(height-side)/2,width:side,height:side};
 }
 function prepare(file){
  const error=validateFile(file);
  if(error)return Promise.reject(new Error(error));
  return new Promise((resolve,reject)=>{
   const image=new root.Image();
   const url=root.URL.createObjectURL(file);
   image.onerror=()=>{root.URL.revokeObjectURL(url);reject(new Error('avatarReadError'));};
   image.onload=()=>{
    try{
     const crop=cropRect(image.naturalWidth,image.naturalHeight);
     const canvas=root.document.createElement('canvas');canvas.width=256;canvas.height=256;
     const context=canvas.getContext('2d');
     if(!context)throw new Error('avatarReadError');
     context.fillStyle='#eef6ff';context.fillRect(0,0,256,256);
     context.drawImage(image,crop.x,crop.y,crop.width,crop.height,0,0,256,256);
     // Re-encode only the rendered pixels; filename and original image metadata are not stored.
     const data=canvas.toDataURL('image/jpeg',0.86);
     if(!isStored(data))throw new Error('avatarReadError');
     resolve(data);
    }catch(error){reject(new Error('avatarReadError'));}
    finally{root.URL.revokeObjectURL(url);}
   };
   image.src=url;
  });
 }
 const api={KEY,MAX_FILE_BYTES,MAX_STORED_LENGTH,validateFile,isStored,read,save,remove,cropRect,prepare};
 root.ValeAvatar=api;
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window==='undefined'?globalThis:window);
