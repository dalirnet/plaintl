#!/usr/bin/env node

const _ = require("lodash")
const input = require("input")
const dotenv = require("dotenv")
const { Api, startSession, eventEmitter } = require("./dist/index.cjs")

dotenv.config()

/**
 * Setting fallback API_ID and API_HASH from public data on github
 * https://github.com/zhukov/webogram/blob/master/app/js/lib/config.js
 */
const API_ID = _.toNumber(process.env.API_ID || 2496)
const API_HASH = _.toString(process.env.API_HASH || "8da85b0d5bfe62527e5b244c209159c3")

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
    .on("RequiresFirstAndLastNames", async (firstAndLastNamesEmitter) => {
        const firstName = await input.text("Enter first name :")
        const lastName = await input.text("Enter last name :")
        firstAndLastNamesEmitter(firstName, lastName)
    })

startSession({ apiId: API_ID, apiHash: API_HASH })
    .then((client) => {
        return client.invoke(new Api.users.GetUsers({ id: [new Api.InputUserSelf()] }))
    })
    .then(([{ firstName }]) => {
        console.log("🖐️  Hi", firstName)
        console.log("Currently, you are listening to 'UpdateShortMessage' events ...")
    })
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
