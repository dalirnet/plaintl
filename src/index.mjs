import fs from "fs"
import _ from "lodash"
import path from "path"
import dotenv from "dotenv"
import EventEmitter from "events"
import { TelegramClient, Api, Logger, sessions } from "telegram"

/**
 * Preparing env variables.
 */
dotenv.config()

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
const initPhoneNumber = (reject) => {
    return new Promise((resolve) => {
        if (_.isEmpty(eventEmitter.listeners("RequiresPhoneNumber"))) {
            reject("You need to set a listener on 'RequiresPhoneNumber' event")
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
const initPhoneCode = (reject) => {
    return new Promise((resolve) => {
        if (_.isEmpty(eventEmitter.listeners("RequiresPhoneCode"))) {
            reject("You need to set a listener on 'RequiresPhoneCode' event")
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
const initPassword = (reject) => {
    return new Promise((resolve) => {
        if (_.isEmpty(eventEmitter.listeners("RequiresPassword"))) {
            reject("You need to set a listener on 'RequiresPassword' event")
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
            reject("You need to set a listener on 'RequiresFirstAndLastNames' event")
        }
        eventEmitter.emit("RequiresFirstAndLastNames", (firstName, lastName = null) => {
            resolve([firstName, lastName])
        })
    })
}

/**
 * Creating instance of Telegram client to start connection.
 * Starting Telegram client with the last session or creating a new session with authentication parameters.
 * Saving session for next usage.
 * @param {Object}  parameters - Provider parameterss.
 * @param {Number}  parameters.apiId - Telegram api id.
 * @param {String}  parameters.apiHash - Telegram api hsah.
 * @param {Boolean} parameters.forceSMS - forcing to receive phone code via SMS.
 * @param {String}  parameters.logLevel - Telegram client log level.
 * @returns {Promise}
 */
const startSession = ({ apiId, apiHash, forceSMS = false, logLevel = "info" } = {}) => {
    /**
     * Creating instance of logger.
     */
    const logger = new Logger(logLevel)

    /**
     * Path of the `.ptl.session` file.
     */
    const sessionPath = path.resolve(".ptl.session")

    return new Promise((resolve, reject) => {
        /**
         * Handling error and then rejecting main thread
         * @param {String} message
         */
        const handleErrorAndReject = (message) => {
            logger.error(message)
            reject(new Error(message))
        }
        try {
            /**
             * Preparing api session from the last session.
             */
            const apiSession = new sessions.StringSession(
                fs.existsSync(sessionPath) ? fs.readFileSync(sessionPath, "utf8") : process.env.API_SESSION || ""
            )

            /**
             * Creating instance of TelegramClient.
             */
            const client = new TelegramClient(
                apiSession,
                _.toNumber(apiId || process.env.API_ID),
                _.toString(apiHash || process.env.API_HASH),
                {
                    baseLogger: logger,
                }
            )

            return client
                .start({
                    phoneNumber: () => {
                        return initPhoneNumber(handleErrorAndReject)
                    },
                    phoneCode: (viaApp) => {
                        logger.info(`You will receive phone code via ${viaApp ? "App" : "SMS"}`)
                        return initPhoneCode(handleErrorAndReject)
                    },
                    password: (hint) => {
                        logger.info(`The hint for your password is '${hint}'`)
                        return initPassword(handleErrorAndReject)
                    },
                    firstAndLastNames: () => {
                        return initFirstAndLastNames(handleErrorAndReject)
                    },
                    onError: ({ message }) => {
                        handleErrorAndReject(message)
                    },
                    forceSMS,
                })
                .then(() => {
                    return fs.promises.writeFile(sessionPath, client.session.save())
                })
                .then(() => {
                    logger.info("Successfully connected and save session")

                    client.addEventHandler((event) => {
                        eventEmitter.emit(event.className, event)
                    })

                    resolve(client)
                })
                .catch(({ message }) => {
                    handleErrorAndReject(reject, message)
                })
        } catch ({ message }) {
            handleErrorAndReject(reject, message)
        }
    })
}

export { Api }
export { startSession, eventEmitter }
