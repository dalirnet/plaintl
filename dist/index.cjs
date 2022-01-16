"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("fs"),s=require("lodash"),r=require("path"),t=require("dotenv"),n=require("events"),i=require("telegram"),o=require("telegram/extensions/index.js"),a=require("telegram/sessions/index.js");function u(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var d=u(e),l=u(s),m=u(r),f=u(t),c=u(n);f.default.config();const p=new c.default,v=new o.Logger,q=(e,s)=>{v.error(s),e(new Error(s))};exports.eventEmitter=p,exports.startSession=({apiId:e,apiHash:s,apiForceSMS:r=!1,loggerLevel:t="info"}={})=>{o.Logger.setLevel(t);const n=m.default.resolve(".ptl.session");return new Promise(((t,o)=>{try{const u=new a.StringSession(d.default.existsSync(n)?d.default.readFileSync(n,"utf8"):process.env.API_SESSION||""),m=new i.TelegramClient(u,l.default.toNumber(e||process.env.API_ID),l.default.toString(s||process.env.API_HASH));return m.start({phoneNumber:()=>(e=>new Promise((s=>{l.default.isEmpty(p.listeners("RequiresPhoneNumber"))&&q(e,"You need to set a listener on 'RequiresPhoneNumber' event"),p.emit("RequiresPhoneNumber",(e=>{s(e)}))})))(o),phoneCode:e=>((e,s)=>new Promise((r=>{l.default.isEmpty(p.listeners("RequiresPhoneCode"))&&q(e,"You need to set a listener on 'RequiresPhoneCode' event"),v.info("You will receive phone code via "+(s?"App":"SMS")),p.emit("RequiresPhoneCode",(e=>{r(e)}))})))(o,e),password:e=>((e,s)=>new Promise((r=>{l.default.isEmpty(p.listeners("RequiresPassword"))&&q(e,"You need to set a listener on 'RequiresPassword' event"),v.info(`The hint for your password is '${s}'`),p.emit("RequiresPassword",(e=>{r(e)}))})))(o,e),firstAndLastNames:()=>(e=>new Promise((s=>{l.default.isEmpty(p.listeners("RequiresFirstAndLastNames"))&&q(e,"You need to set a listener on 'RequiresFirstAndLastNames' event"),p.emit("RequiresFirstAndLastNames",((e,r=null)=>{s([e,r])}))})))(o),onError:({message:e})=>{q(o,e)},forceSMS:r}).then((()=>d.default.promises.writeFile(n,m.session.save()))).then((()=>{v.info("Successfully connected and save session"),m.addEventHandler((e=>{p.emit(e.className,e)})),t(m)})).catch((({message:e})=>{q(o,e)}))}catch({message:e}){q(o,e)}}))};