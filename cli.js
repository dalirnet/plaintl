#!/usr/bin/env node

const _ = require("lodash")
const input = require("input")
const { startSession, eventEmitter } = require("./dist/index.cjs")

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

startSession({ apiId: API_ID, apiHash: API_HASH })
    .then(() => {
        eventEmitter.on("UpdateShortMessage", (event) => {
            console.log(event)
        })
    })
    .catch(({ message }) => {
        if (!_.includes(message, "400")) {
            process.exit(1)
        }
    })
