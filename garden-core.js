(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ValeGardenCore=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const T=(ru,sr,en)=>({ru,sr,en});
const CATALOG=[
 ['fern','Папоротник','Папрат','Fern'],['daisy','Ромашка','Бела рада','Daisy'],['tulip','Тюльпан','Лала','Tulip'],['succulent','Суккулент','Сукулент','Succulent'],['sunflower','Подсолнух','Сунцокрет','Sunflower'],['monstera','Монстера','Монстера','Monstera'],['lavender','Лаванда','Лаванда','Lavender'],['cactus','Кактус','Кактус','Cactus'],['bellflower','Колокольчики','Звончићи','Bluebells'],['rose','Роза','Ружа','Rose'],['strawberry','Земляника','Јагода','Strawberry'],['butterfly','Бабочка','Лептир','Butterfly'],['lantern','Фонарик','Фењер','Lantern'],['orchid','Орхидея','Орхидеја','Orchid'],['hydrangea','Гортензия','Хортензија','Hydrangea'],['lemon','Лимонное дерево','Дрво лимуна','Lemon tree'],['birdhouse','Домик для птиц','Кућица за птице','Birdhouse'],['pinwheel','Вертушка','Ветрењача','Pinwheel'],['rainbow','Радуга','Дуга','Rainbow']
].map(([id,ru,sr,en],unlock)=>({id,name:T(ru,sr,en),unlock,pot:!['butterfly','lantern','birdhouse','pinwheel','rainbow'].includes(id)}));
const COLORS=['#75b8fa','#52cad1','#f3a7c4','#f4c982','#80bca2','#b6a3dd','#fff9ed','#ef9776'];
const COLOR_NAMES=[T('Голубой','Плава','Blue'),T('Бирюзовый','Тиркизна','Turquoise'),T('Розовый','Ружичаста','Pink'),T('Жёлтый','Жута','Yellow'),T('Зелёный','Зелена','Green'),T('Сиреневый','Љубичаста','Lilac'),T('Кремовый','Крем','Cream'),T('Коралловый','Корална','Coral')];
const PATTERNS=['plain','stripes','dots','custom'];
const design=()=>({base:0,pattern:'plain',pixels:Array(36).fill(-1)});
const fresh=()=>({schemaVersion:1,placements:[{id:'fern',slot:4}],designs:{}});
const item=id=>CATALOG.find(x=>x.id===id);
const count=n=>Number.isInteger(n)&&n>=0?Math.min(18,n):0;
const available=(id,crystals)=>!!item(id)&&item(id).unlock<=count(crystals);
function validDesign(d){return d&&Number.isInteger(d.base)&&d.base>=0&&d.base<COLORS.length&&PATTERNS.includes(d.pattern)&&Array.isArray(d.pixels)&&d.pixels.length===36&&d.pixels.every(p=>Number.isInteger(p)&&p>=-1&&p<COLORS.length);}
function normalise(input,crystals=0){
 if(!input||input.schemaVersion!==1)return fresh();
 const out={schemaVersion:1,placements:[],designs:{}};
 if(Array.isArray(input.placements))for(const p of input.placements.slice(0,50)){
  if(p&&available(p.id,crystals)&&Number.isInteger(p.slot)&&p.slot>=0&&p.slot<9&&!out.placements.some(x=>x.slot===p.slot||x.id===p.id))out.placements.push({id:p.id,slot:p.slot});
 }
 for(const it of CATALOG)if(it.pot&&available(it.id,crystals)&&validDesign(input.designs?.[it.id])){const d=input.designs[it.id];out.designs[it.id]={base:d.base,pattern:d.pattern,pixels:[...d.pixels]};}
 return out;
}
function place(state,id,slot,crystals){
 if(!available(id,crystals)||!Number.isInteger(slot)||slot<0||slot>8)return null;
 const own=state.placements.find(p=>p.id===id),other=state.placements.find(p=>p.slot===slot&&p.id!==id);
 const placements=state.placements.filter(p=>p.id!==id&&p.slot!==slot).map(p=>({...p}));
 if(other&&own)placements.push({id:other.id,slot:own.slot});
 placements.push({id,slot});return {...state,placements};
}
function remove(state,id){if(!state.placements.some(p=>p.id===id))return null;return {...state,placements:state.placements.filter(p=>p.id!==id)};}
function decorate(state,id,d,crystals){if(!item(id)?.pot||!available(id,crystals)||!validDesign(d))return null;return {...state,designs:{...state.designs,[id]:{base:d.base,pattern:d.pattern,pixels:[...d.pixels]}}};}
return {CATALOG,COLORS,COLOR_NAMES,PATTERNS,design,fresh,item,available,validDesign,normalise,place,remove,decorate};
});
