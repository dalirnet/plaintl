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
 * Handling error and then rejecting main thread
 * @param {String} message
 */
const handleErrorAndReject = (reject, message) => {
    logger.error(message)
    reject(new Error(message))
}

/**
 * Preparing phone number.
 * Emitting `RequiresPhoneNumber` event.
 * Waiting for emitting phone number.
 * @returns {Promise}
 */
const initPhoneNumber = (reject) => {
    return new Promise((resolve) => {
        if (_.isEmpty(eventEmitter.listeners("RequiresPhoneNumber"))) {
            handleErrorAndReject(reject, "You need to set a listener on 'RequiresPhoneNumber' event")
        }
        eventEmitter.emit("RequiresPhoneNumber", (phoneNumber) => {
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
const initPhoneCode = (reject, viaApp) => {
    return new Promise((resolve) => {
        logger.info(`You will receive phone code via ${viaApp ? "App" : "SMS"}`)
        if (_.isEmpty(eventEmitter.listeners("RequiresPhoneCode"))) {
            handleErrorAndReject(reject, `You need to set a listener on 'RequiresPhoneCode' event`)
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
const initPassword = (reject, hint) => {
    return new Promise((resolve) => {
        logger.info(`The hint for your password is '${hint}'`)
        if (_.isEmpty(eventEmitter.listeners("RequiresPassword"))) {
            handleErrorAndReject(reject, `You need to set a listener on 'RequiresPassword' event`)
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
const initFirstAndLastNames = (reject) => {
    return new Promise((resolve) => {
        if (_.isEmpty(eventEmitter.listeners("RequiresFirstAndLastNames"))) {
            handleErrorAndReject(reject, `You need to set a listener on 'RequiresFirstAndLastNames' event`)
        }
        eventEmitter.emit("RequiresFirstAndLastNames", ([firstName, lastName]) => {
            logger.info(`First name is '${firstName}'`)
            logger.info(`Last name is '${lastName}'`)
            resolve([firstName, lastName])
        })
    })
}

/**
 * Creating instance of Telegram client to start connection.
 * Starting Telegram client with the last session or creating a new session with authentication parameters.
 * Saving modified env object to env file for next usage.
 * @param {Object} option - Provider options.
 * @param {Number} option.apiId - Telegram api id.
 * @param {String} option.apiHash - Telegram api hsah.
 * @param {Boolean} option.forceSMS - forcing to receive phone code via SMS.
 * @returns {Promise}
 */
const startSession = ({ apiId, apiHash, forceSMS = false } = {}) => {
    return new Promise((resolve, reject) => {
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
                    phoneNumber: () => {
                        return initPhoneNumber(reject)
                    },
                    phoneCode: (viaApp) => {
                        return initPhoneCode(reject, viaApp)
                    },
                    password: (hint) => {
                        return initPassword(reject, hint)
                    },
                    firstAndLastNames: () => {
                        return initFirstAndLastNames(reject)
                    },
                    onError: ({ message }) => {
                        handleErrorAndReject(reject, message)
                    },
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

                    resolve(eventEmitter)
                })
                .catch(({ message }) => {
                    handleErrorAndReject(reject, message)
                })
        } catch ({ message }) {
            handleErrorAndReject(reject, message)
        }
    })
}

export { startSession, eventEmitter }
