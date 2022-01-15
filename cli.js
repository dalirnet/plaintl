#!/usr/bin/env node

const input = require("input")
const { startSession, eventEmitter } = require("./dist/cjs/index.cjs")

/**
 * Setting default API_ID and API_HASH from public data on github
 * https://github.com/zhukov/webogram/blob/master/app/js/lib/config.js
 */
const API_ID = 2496
const API_HASH = "8da85b0d5bfe62527e5b244c209159c3"

eventEmitter
    .on("RequiresPhoneNumber", (phoneNumberEmitter) => {
        input.text("Enter phone number :").then((phoneNumber) => {
            phoneNumberEmitter(phoneNumber)
        })
    })
    .on("RequiresPhoneCode", (phoneCodeEmitter) => {
        input.text("Enter phone code :").then((phoneCode) => {
            phoneCodeEmitter(phoneCode)
        })
    })
    .on("RequiresPassword", (passwordEmitter) => {
        input.password("Enter password :").then((password) => {
            passwordEmitter(password)
        })
    })

startSession({ apiId: API_ID, apiHash: API_HASH }).then((listener) => {
    listener.on("UpdateShortMessage", (event) => {
        console.log(event)
    })
})
