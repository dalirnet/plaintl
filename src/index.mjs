import fs from "fs"
import _ from "lodash"
import path from "path"
import dotenv from "dotenv"
import EventEmitter from "events"
import { TelegramClient } from "telegram"
import { Logger } from "telegram/extensions/index.js"
import { StringSession } from "telegram/sessions/index.js"

/**
 * Preparing env variables.
 */
dotenv.config()

/**
 * Creating instance of logger.
 */
const logger = new Logger()

/**
 * Creating instance of event emitter.
 */
const eventEmitter = new EventEmitter()

/**
 * Preparing phone number.
 * Emitting `RequiresPhoneNumber` event.
 * Waiting for emitting phone number.
 * @returns {Promise}
 */
const initPhoneNumber = () => {
    return new Promise((resolve) => {
        if (_.isEmpty(eventEmitter.listeners("RequiresPhoneNumber"))) {
            logger.error(`You need to set a listener on 'RequiresPhoneNumber' event`)
            process.exit(1)
        }
        eventEmitter.emit("RequiresPhoneNumber", (phoneNumber) => {
            logger.info(`Phone number is '${phoneNumber}'`)
            resolve(phoneNumber)
        })
    })
}

/**
 * Preparing phone code.
 * Emitting `RequiresPhoneCode` event.
 * Waiting for emitting phone code.
 * @param {Boolean} viaApp
 * @returns {Promise}
 */
const initPhoneCode = (viaApp) => {
    return new Promise((resolve) => {
        logger.info(`You will receive phone code via ${viaApp ? "App" : "SMS"}`)
        if (_.isEmpty(eventEmitter.listeners("RequiresPhoneCode"))) {
            logger.error(`You need to set a listener on 'RequiresPhoneCode' event`)
            process.exit(1)
        }
        eventEmitter.emit("RequiresPhoneCode", (phoneCode) => {
            resolve(phoneCode)
        })
    })
}

/**
 * Preparing password.
 * Emitting `RequiresPassword` event.
 * Waiting for emitting password.
 * @param {String} hint
 * @returns {Promise}
 */
const initPassword = (hint) => {
    return new Promise((resolve) => {
        logger.info(`The hint for your password is '${hint}'`)
        if (_.isEmpty(eventEmitter.listeners("RequiresPassword"))) {
            logger.error(`You need to set a listener on 'RequiresPassword' event`)
            process.exit(1)
        }
        eventEmitter.emit("RequiresPassword", (password) => {
            resolve(password)
        })
    })
}

/**
 * Preparing first and last names.
 * Emitting `RequiresFirstAndLastNames` event.
 * Waiting for emitting first and last names.
 * @param {Promise}
 */
const initFirstAndLastNames = () => {
    return new Promise((resolve) => {
        if (_.isEmpty(eventEmitter.listeners("RequiresFirstAndLastNames"))) {
            logger.error(`You need to set a listener on 'RequiresFirstAndLastNames' event`)
            process.exit(1)
        }
        eventEmitter.emit("RequiresFirstAndLastNames", ([firstName, lastName]) => {
            logger.info(`First name is '${firstName}'`)
            logger.info(`Last name is '${lastName}'`)
            resolve([firstName, lastName])
        })
    })
}

/**
 * Handling errors of authentication of Telegram client.
 * @param {Error}
 */
const initOnError = ({ message }) => {
    logger.error(message)
    process.exit(1)
}

/**
 * Creating instance of Telegram client to start connection.
 * Starting Telegram client with the last session or creating a new session with authentication parameters.
 * Saving modified env object to env file for next usage.
 * @param {Object} option - Provider options.
 * @param {Number} option.apiId - Telegram api id.
 * @param {String} option.apiHash - Telegram api hsah.
 * @param {Boolean} option.forceSMS - forcing to receive phone code via SMS.
 * @returns {EventEmitter}
 */
const startSession = ({ apiId, apiHash, forceSMS = false } = {}) => {
    try {
        /**
         * Path of the `.session` file.
         */
        const sessionPath = path.resolve(".ptl.session")

        /**
         * Preparing api session from the last session.
         */
        const apiSession = new StringSession(
            fs.existsSync(sessionPath) ? fs.readFileSync(sessionPath, "utf8") : process.env.API_SESSION || ""
        )

        /**
         * Creating instance of TelegramClient.
         */
        const telegramClient = new TelegramClient(
            apiSession,
            _.toNumber(apiId || process.env.API_ID),
            _.toString(apiHash || process.env.API_HASH)
        )

        return telegramClient
            .start({
                phoneNumber: initPhoneNumber,
                phoneCode: initPhoneCode,
                password: initPassword,
                firstAndLastNames: initFirstAndLastNames,
                onError: initOnError,
                forceSMS,
            })
            .then(() => {
                return fs.promises.writeFile(sessionPath, telegramClient.session.save())
            })
            .then(() => {
                logger.info("Successfully connected and save session")
                telegramClient.addEventHandler((event) => {
                    eventEmitter.emit(event.className, event)
                })

                return eventEmitter
            })
            .catch(({ message }) => {
                logger.error(message)
                process.exit(1)
            })
    } catch ({ message }) {
        logger.error(message)
        process.exit(1)
    }
}

export { startSession, eventEmitter }
