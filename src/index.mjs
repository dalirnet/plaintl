import fs from "fs"
import _ from "lodash"
import path from "path"
import EventEmitter from "events"
import fsPromise from "fs/promises"
import { TelegramClient } from "telegram"
import { parse, stringify } from "envfile"
import { Logger } from "telegram/extensions/index.js"
import { StringSession } from "telegram/sessions/index.js"

/**
 * Trimming `'` and `"` of string.
 * @param {String} value
 * @returns {String}
 */
const trimQuotation = (value) => _.trim(_.toString(value), ["'", '"'])

/**
 * Path of the `.env` file.
 */
const ENV_PATH = path.resolve("./.env")

/**
 * Parsed object of the `.env` file.
 */
const ENV = parse(fs.existsSync(ENV_PATH) ? fs.readFileSync(ENV_PATH) : "")

/**
 * Preparing session of the last session from env object.
 */
const session = new StringSession(trimQuotation(ENV.SESSION || ""))

/**
 * Preparing api id from env object.
 */
const apiId = _.toNumber(trimQuotation(ENV.API_ID))

/**
 * Preparing api hash from env object.
 */
const apiHash = trimQuotation(ENV.API_HASH)

/**
 * Creating instance of event emitter.
 */
const eventEmitter = new EventEmitter()

/**
 * Creating instance of logger.
 */
const logger = new Logger()

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
            logger.info(`Phone code is '${phoneCode}'`)
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
            logger.info(`Phone code is '${password}'`)
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
 * Adding session to modified env object.
 * Saving modified env object to env file for next usage.
 * @param {Boolean} [forceSMS=false] - forcing to receive phone code via SMS.
 * @returns {EventEmitter}
 */
const start = (forceSMS = false) => {
    try {
        const telegramClient = new TelegramClient(session, apiId, apiHash)
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
                return fsPromise.writeFile(
                    ENV_PATH,
                    stringify({
                        ...ENV,
                        SESSION: telegramClient.session.save(),
                    })
                )
            })
            .then(() => {
                logger.info("Modified env file for next usage")
                logger.info("Successfully connected")
            })
            .then(() => {
                telegramClient.addEventHandler((event) => {
                    eventEmitter.emit(event.className, event)
                })
            })
            .then(() => {
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

export { start, eventEmitter }
