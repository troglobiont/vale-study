const assert=require('node:assert/strict');
const A=require('../avatar.js');
let passed=0;
const test=(name,fn)=>{fn();passed++;};
const jpeg='data:image/jpeg;base64,/9j/2Q==';
function storage(){const data=new Map([['vale-study-book-v02','progress-kept']]);return {data,getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};}
test('common gallery formats and an untyped camera filename are accepted',()=>{
 for(const type of ['image/jpeg','image/png','image/webp','image/gif','image/avif','image/heic','image/heif'])assert.equal(A.validateFile({type,size:100,name:'photo'}),null);
 assert.equal(A.validateFile({type:'',size:100,name:'PHOTO.JPG'}),null);
});
test('documents, SVG and renamed active formats are rejected',()=>{
 for(const f of [{type:'image/svg+xml',name:'photo.jpg'},{type:'text/html',name:'photo.png'},{type:'',name:'picture.svg'},{type:'application/pdf',name:'photo.jpg'}])assert.equal(A.validateFile({...f,size:100}),'avatarTypeError');
});
test('empty, invalid and oversized files are rejected before decoding',()=>{
 for(const f of [null,{size:0,type:'image/jpeg'},{size:NaN,type:'image/jpeg'}])assert.equal(A.validateFile(f),'avatarReadError');
 assert.equal(A.validateFile({size:A.MAX_FILE_BYTES+1,type:'image/jpeg'}),'avatarSizeError');
 assert.equal(A.validateFile({size:A.MAX_FILE_BYTES,type:'image/jpeg'}),null);
});
test('landscape, portrait and square crops preserve the centred square',()=>{
 assert.deepEqual(A.cropRect(1200,800),{x:200,y:0,width:800,height:800});
 assert.deepEqual(A.cropRect(800,1200),{x:0,y:200,width:800,height:800});
 assert.deepEqual(A.cropRect(256,256),{x:0,y:0,width:256,height:256});
});
test('invalid dimensions do not reach canvas',()=>{for(const v of [[0,2],[-1,1],[Infinity,2],[20000,20000]])assert.throws(()=>A.cropRect(...v));});
test('remote URLs, SVG payloads and oversized stored values are not accepted',()=>{
 for(const value of ['https://example.com/photo.jpg','javascript:alert(1)','data:image/svg+xml;base64,AAAA','data:image/jpeg;base64,!!!','data:image/jpeg;base64,'+'A'.repeat(A.MAX_STORED_LENGTH)])assert.equal(A.isStored(value),false);
});
test('avatar save, read and remove never overwrite learning progress',()=>{
 const s=storage();assert.equal(A.read(s),'');A.save(s,jpeg);assert.equal(A.read(s),jpeg);A.remove(s);assert.equal(A.read(s),'');assert.equal(s.getItem('vale-study-book-v02'),'progress-kept');
});
test('a quota failure preserves the old photo and progress',()=>{
 const s=storage();s.setItem(A.KEY,jpeg);s.setItem=()=>{throw Error('quota');};assert.throws(()=>A.save(s,'data:image/jpeg;base64,AAAA'));assert.equal(A.read(s),jpeg);assert.equal(s.getItem('vale-study-book-v02'),'progress-kept');
});
test('corrupt saved avatar is ignored without mutating progress',()=>{
 const s=storage();s.setItem(A.KEY,'broken');assert.equal(A.read(s),'');assert.equal(s.getItem('vale-study-book-v02'),'progress-kept');
});
console.log(JSON.stringify({status:'PASS',avatarTests:passed}));
