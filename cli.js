#!/usr/bin/env node

const fs = require("fs")
const _ = require("lodash")
const path = require("path")
const input = require("input")
const { startSession, eventEmitter } = require("./dist/cjs/index.cjs")

/**
 * Setting default env from public data on github
 * https://github.com/zhukov/webogram/blob/master/app/js/lib/config.js
 */
if (!fs.existsSync(path.resolve(__dirname, "./.env"))) {
    let envTemplate = _.toString(fs.readFileSync(path.resolve(__dirname, "./.sample.env")))
    fs.writeFileSync(
        path.resolve(__dirname, "./.env"),
        envTemplate.replace("YOUR_API_ID", "2496").replace("YOUR_API_HASH", "8da85b0d5bfe62527e5b244c209159c3")
    )
}

startSession().then((listener) => {
    listener.on("UpdateShortMessage", (event) => {
        console.log(event)
    })
})

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
