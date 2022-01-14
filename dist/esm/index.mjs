import e from"fs";import s from"lodash";import r from"path";import o from"events";import i from"fs/promises";import{TelegramClient as t}from"telegram";import{parse as n,stringify as m}from"envfile";import{Logger as a}from"telegram/extensions/index.js";import{StringSession as p}from"telegram/sessions/index.js";const d=e=>s.trim(s.toString(e),["'",'"']),u=r.resolve("./.env"),f=new o,c=new a,l=()=>new Promise((e=>{s.isEmpty(f.listeners("RequiresPhoneNumber"))&&(c.error("You need to set a listener on 'RequiresPhoneNumber' event"),process.exit(1)),f.emit("RequiresPhoneNumber",(s=>{c.info(`Phone number is '${s}'`),e(s)}))})),h=e=>new Promise((r=>{c.info("You will receive phone code via "+(e?"App":"SMS")),s.isEmpty(f.listeners("RequiresPhoneCode"))&&(c.error("You need to set a listener on 'RequiresPhoneCode' event"),process.exit(1)),f.emit("RequiresPhoneCode",(e=>{r(e)}))})),P=e=>new Promise((r=>{c.info(`The hint for your password is '${e}'`),s.isEmpty(f.listeners("RequiresPassword"))&&(c.error("You need to set a listener on 'RequiresPassword' event"),process.exit(1)),f.emit("RequiresPassword",(e=>{r(e)}))})),w=()=>new Promise((e=>{s.isEmpty(f.listeners("RequiresFirstAndLastNames"))&&(c.error("You need to set a listener on 'RequiresFirstAndLastNames' event"),process.exit(1)),f.emit("RequiresFirstAndLastNames",(([s,r])=>{c.info(`First name is '${s}'`),c.info(`Last name is '${r}'`),e([s,r])}))})),S=({message:e})=>{c.error(e),process.exit(1)},v=(r=!1)=>{try{const o=n(e.existsSync(u)?e.readFileSync(u):""),a=s.toNumber(d(o.API_ID)),v=d(o.API_HASH),x=new p(d(o.SESSION||"")),q=new t(x,a,v);return q.start({phoneNumber:l,phoneCode:h,password:P,firstAndLastNames:w,onError:S,forceSMS:r}).then((()=>i.writeFile(u,m({...o,SESSION:q.session.save()})))).then((()=>{c.info("Modified env file for next usage"),c.info("Successfully connected")})).then((()=>{q.addEventHandler((e=>{f.emit(e.className,e)}))})).then((()=>f)).catch((({message:e})=>{c.error(e),process.exit(1)}))}catch({message:e}){c.error(e),process.exit(1)}};export{f as eventEmitter,v as startSession};