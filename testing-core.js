(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ValeTesting=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const IDS=['p16-6','p15-3'];
const copy=v=>JSON.parse(JSON.stringify(v));
const validState=s=>s&&s.schemaVersion===1&&s.records&&typeof s.records==='object'&&!Array.isArray(s.records)&&['ru','sr','en'].includes(s.locale);
function clearedPilot(state,freshExpedition){
 const next=copy(state);next.expedition=copy(freshExpedition);
 if(next.nature){for(const id of IDS)delete next.nature.records[id];if(IDS.includes(next.nature.lastTask))next.nature.lastTask=null;}
 return next;
}
function create(storage,key){
 const sandboxKey=key+'-sandbox-v1',undoKey=key+'-pilot-undo-v1';
 function readEnvelope(){const raw=storage.getItem(sandboxKey);if(!raw)return null;const x=JSON.parse(raw);if(x?.schemaVersion!==1||typeof x.id!=='string'||typeof x.active!=='boolean'||!validState(x.state))throw Error('testing-corrupt');return x;}
 let initial=null,error=null;try{initial=readEnvelope();}catch(e){error=e;}
 let session=initial?.active?initial.id:null;
 const active=()=>!!session;
 function checked(){if(error)throw error;const x=readEnvelope();if((x?.active?x.id:null)!==session)throw Error('testing-mode-changed');return x;}
 function read(){if(error)throw error;return session?JSON.stringify(checked().state):storage.getItem(key);}
 function save(state){if(!validState(state))throw Error('testing-invalid-state');const x=checked();storage.setItem(session?sandboxKey:key,JSON.stringify(session?{...x,state}:state));}
 function begin(state,avatar='',route='home'){
  if(session)throw Error('testing-already-active');checked();if(!validState(state))throw Error('testing-invalid-state');
  const x={schemaVersion:1,id:Date.now().toString(36)+'-'+Math.random().toString(36).slice(2),active:true,state:copy(state),avatar:typeof avatar==='string'?avatar:'',route:String(route),startedAt:Date.now()};
  storage.setItem(sandboxKey,JSON.stringify(x));session=x.id;return x;
 }
 function end(){if(!session)throw Error('testing-not-active');const x=checked();storage.setItem(sandboxKey,JSON.stringify({...x,active:false}));session=null;return {raw:storage.getItem(key),route:x.route};}
 function avatarStorage(avatarKey){return {
  getItem(k){if(k!==avatarKey)return storage.getItem(k);return session?checked().avatar||'':storage.getItem(k);},
  setItem(k,v){if(k!==avatarKey){storage.setItem(k,v);return;}const x=checked();if(session)storage.setItem(sandboxKey,JSON.stringify({...x,avatar:String(v)}));else storage.setItem(k,v);},
  removeItem(k){if(k!==avatarKey){storage.removeItem(k);return;}const x=checked();if(session)storage.setItem(sandboxKey,JSON.stringify({...x,avatar:''}));else storage.removeItem(k);}
 };}
 function backup(state){checked();if(!validState(state))throw Error('testing-invalid-state');const b={schemaVersion:1,session,expedition:state.expedition?copy(state.expedition):null,records:Object.fromEntries(IDS.map(id=>[id,state.nature?.records?.[id]?copy(state.nature.records[id]):null])),lastTask:state.nature?.lastTask||null};storage.setItem(undoKey+(session?'-test':''),JSON.stringify(b));return b;}
 function checkpoint(){checked();const raw=storage.getItem(undoKey+(session?'-test':''));if(!raw)return null;const b=JSON.parse(raw);if(b?.schemaVersion!==1||b.session!==session||!b.records||!Object.prototype.hasOwnProperty.call(b,'expedition'))return null;return b;}
 function undo(state){const b=checkpoint();if(!b)return null;const next=copy(state);if(b.expedition)next.expedition=copy(b.expedition);else delete next.expedition;
  if(next.nature){for(const id of IDS){if(b.records[id])next.nature.records[id]=copy(b.records[id]);else delete next.nature.records[id];}if(!next.nature.lastTask||IDS.includes(next.nature.lastTask))next.nature.lastTask=b.lastTask;}
  return next;
 }
 function clearReal(){checked();if(session)throw Error('testing-active');for(const k of [undoKey,undoKey+'-test',sandboxKey,key])storage.removeItem(k);}
 return {active,read,save,begin,end,backup,checkpoint,undo,avatarStorage,clearReal,keys:{sandboxKey,undoKey}};
}
return {IDS,validState,clearedPilot,create};
});
