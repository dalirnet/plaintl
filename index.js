import _ from 'lodash'
import path from 'path'
import input from 'input'
import fs from 'fs/promises'
import { fileURLToPath } from 'url'
import { parse, stringify } from 'envfile'
import { TelegramClient } from 'telegram'
import { StringSession } from 'telegram/sessions/index.js'

// init path
const basePath = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.resolve(basePath, '.env')

// init env
const env = parse(await fs.readFile(envPath))

// init client
const client = new TelegramClient(
    new StringSession(_.get(env, 'SESSION_STRING', '')),
    _.toNumber(env.API_ID),
    env.API_HASH
)

// start client
await client.start({
    phoneNumber: async () => await input.text('Number'),
    password: async () => await input.text('Password'),
    phoneCode: async () => await input.text('Code'),
})

// save env
await fs.writeFile(
    envPath,
    stringify(_.set(env, 'SESSION_STRING', client.session.save()))
)

// event handler
client.addEventHandler((event) => {
    if (event.className === 'UpdateNewChannelMessage') {
        console.log(event.message)
    }
})
