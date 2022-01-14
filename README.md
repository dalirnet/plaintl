# PlainTL

A **plain** **t**elegram **l**istener based on [GramJS](https://github.com/gram-js/gramjs)

### Installation

```bash
# npm
npm i plaintl

# yarn
yarn add plaintl
```

```javascript
// esm
import { start, eventEmitter } from "plaintl"

// cjs
const { start, eventEmitter } = require("plaintl")
```

### Preparation

Rename `.sample.env` to `.env` and then set your environment values.

```bash
API_ID="YOUR_API_ID"
API_HASH="YOUR_API_HASH"
```

Obtain `API_ID` and `API_HASH` from [here](https://my.telegram.org/auth).

### Usage

Listen to `Requires` events and then submit your values with emitter functions. _(only for the first session)_

```javascript
eventEmitter
    .on("RequiresPhoneNumber", (phoneNumberEmitter) => {
        phoneNumberEmitter("+989990009999")
    })
    .on("RequiresPhoneCode", (phoneCodeEmitter) => {
        phoneCodeEmitter("550055")
    })
    .on("RequiresPassword", (passwordEmitter) => {
        passwordEmitter("my-password")
    })
```

Start `PlainTL` session.

```javascript
// async
const listener = await start()

// sync
start().then((listener) => {})
```

Listen to `Telegram` [Update](#update-events) events.

```javascript
listener.on("UpdateShortMessage", (event) => {
    console.log(event)
})
```

### Cli

```bash
# npm
npx plaintl

# github
npx github:dalirnet/plaintl
```

---

#### Update events

-   UpdateWebPage
-   UpdateUserTyping
-   UpdateUserStatus
-   UpdateUserPhoto
-   UpdateUserPhone
-   UpdateUserName
-   UpdateTheme
-   UpdatesTooLong
-   UpdateStickerSetsOrder
-   UpdateStickerSets
-   UpdateShortSentMessage
-   UpdateShortMessage
-   UpdateShortChatMessage
-   UpdateShort
-   UpdateServiceNotification
-   UpdatesCombined
-   UpdateSavedGifs
-   Updates
-   UpdateRecentStickers
-   UpdateReadMessagesContents
-   UpdateReadHistoryOutbox
-   UpdateReadHistoryInbox
-   UpdateReadFeaturedStickers
-   UpdateReadChannelOutbox
-   UpdateReadChannelInbox
-   UpdateReadChannelDiscussionOutbox
-   UpdateReadChannelDiscussionInbox
-   UpdatePtsChanged
-   UpdatePrivacy
-   UpdatePinnedMessages
-   UpdatePinnedDialogs
-   UpdatePinnedChannelMessages
-   UpdatePhoneCallSignalingData
-   UpdatePhoneCall
-   UpdatePendingJoinRequests
-   UpdatePeerSettings
-   UpdatePeerLocated
-   UpdatePeerHistoryTTL
-   UpdatePeerBlocked
-   UpdateNotifySettings
-   UpdateNewStickerSet
-   UpdateNewScheduledMessage
-   UpdateNewMessage
-   UpdateNewEncryptedMessage
-   UpdateNewChannelMessage
-   UpdateMessageReactions
-   UpdateMessagePollVote
-   UpdateMessagePoll
-   UpdateMessageID
-   UpdateLoginToken
-   UpdateLangPackTooLong
-   UpdateLangPack
-   UpdateInlineBotCallbackQuery
-   UpdateGroupCallParticipants
-   UpdateGroupCallConnection
-   UpdateGroupCall
-   UpdateGeoLiveViewed
-   UpdateFolderPeers
-   UpdateFavedStickers
-   UpdateEncryption
-   UpdateEncryptedMessagesRead
-   UpdateEncryptedChatTyping
-   UpdateEditMessage
-   UpdateEditChannelMessage
-   UpdateDraftMessage
-   UpdateDialogUnreadMark
-   UpdateDialogPinned
-   UpdateDialogFilters
-   UpdateDialogFilterOrder
-   UpdateDialogFilter
-   UpdateDeleteScheduledMessages
-   UpdateDeleteMessages
-   UpdateDeleteChannelMessages
-   UpdateDcOptions
-   UpdateContactsReset
-   UpdateConfig
-   UpdateChatUserTyping
-   UpdateChatParticipants
-   UpdateChatParticipantDelete
-   UpdateChatParticipantAdmin
-   UpdateChatParticipantAdd
-   UpdateChatParticipant
-   UpdateChatDefaultBannedRights
-   UpdateChat
-   UpdateChannelWebPage
-   UpdateChannelUserTyping
-   UpdateChannelTooLong
-   UpdateChannelReadMessagesContents
-   UpdateChannelParticipant
-   UpdateChannelMessageViews
-   UpdateChannelMessageForwards
-   UpdateChannelAvailableMessages
-   UpdateChannel
-   UpdateBotWebhookJSONQuery
-   UpdateBotWebhookJSON
-   UpdateBotStopped
-   UpdateBotShippingQuery
-   UpdateBotPrecheckoutQuery
-   UpdateBotInlineSend
-   UpdateBotInlineQuery
-   UpdateBotCommands
-   UpdateBotChatInviteRequester
-   UpdateBotCallbackQuery
