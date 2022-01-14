import e from"fs";import s from"lodash";import r from"path";import o from"events";import i from"fs/promises";import{TelegramClient as t}from"telegram";import{parse as n,stringify as m}from"envfile";import{Logger as a}from"telegram/extensions/index.js";import{StringSession as d}from"telegram/sessions/index.js";const p=e=>s.trim(s.toString(e),["'",'"']),f=r.resolve("./.env"),u=n(e.existsSync(f)?e.readFileSync(f):""),c=new d(p(u.SESSION||"")),l=s.toNumber(p(u.API_ID)),h=p(u.API_HASH),P=new o,w=new a,S=()=>new Promise((e=>{s.isEmpty(P.listeners("RequiresPhoneNumber"))&&(w.error("You need to set a listener on 'RequiresPhoneNumber' event"),process.exit(1)),P.emit("RequiresPhoneNumber",(s=>{w.info(`Phone number is '${s}'`),e(s)}))})),v=e=>new Promise((r=>{w.info("You will receive phone code via "+(e?"App":"SMS")),s.isEmpty(P.listeners("RequiresPhoneCode"))&&(w.error("You need to set a listener on 'RequiresPhoneCode' event"),process.exit(1)),P.emit("RequiresPhoneCode",(e=>{w.info(`Phone code is '${e}'`),r(e)}))})),x=e=>new Promise((r=>{w.info(`The hint for your password is '${e}'`),s.isEmpty(P.listeners("RequiresPassword"))&&(w.error("You need to set a listener on 'RequiresPassword' event"),process.exit(1)),P.emit("RequiresPassword",(e=>{w.info(`Phone code is '${e}'`),r(e)}))})),q=()=>new Promise((e=>{s.isEmpty(P.listeners("RequiresFirstAndLastNames"))&&(w.error("You need to set a listener on 'RequiresFirstAndLastNames' event"),process.exit(1)),P.emit("RequiresFirstAndLastNames",(([s,r])=>{w.info(`First name is '${s}'`),w.info(`Last name is '${r}'`),e([s,r])}))})),N=({message:e})=>{w.error(e),process.exit(1)},R=(e=!1)=>{try{const s=new t(c,l,h);return s.start({phoneNumber:S,phoneCode:v,password:x,firstAndLastNames:q,onError:N,forceSMS:e}).then((()=>i.writeFile(f,m({...u,SESSION:s.session.save()})))).then((()=>{w.info("Modified env file for next usage"),w.info("Successfully connected")})).then((()=>{s.addEventHandler((e=>{P.emit(e.className,e)}))})).then((()=>P)).catch((({message:e})=>{w.error(e),process.exit(1)}))}catch({message:e}){w.error(e),process.exit(1)}};export{P as eventEmitter,R as start};