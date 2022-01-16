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
import { startSession, eventEmitter } from "plaintl"

// cjs
const { startSession, eventEmitter } = require("plaintl")
```

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
        passwordEmitter("password")
    })
    .on("RequiresFirstAndLastNames", (firstAndLastNamesEmitter) => {
        firstAndLastNamesEmitter(["First name", "Last name"])
    })
```

Preparing provider [options](https://github.com/dalirnet/plaintl/blob/main/src/index.mjs#L112-L115).

> Obtain `API_ID` and `API_HASH` from [here](https://my.telegram.org/auth).

```javascript
const providerOptions = {
    apiId: "API_ID",
    apiHash: "API_HASH",
    forceSMS: false,
}
```

Start `PlainTL` session.

```javascript
// async
const listener = await startSession(providerOptions)

// sync
startSession(providerOptions).then((listener) => {})
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

-   [UpdateWebPage](https://core.telegram.org/constructor/UpdateWebPage)
-   [UpdateUserTyping](https://core.telegram.org/constructor/UpdateUserTyping)
-   [UpdateUserStatus](https://core.telegram.org/constructor/UpdateUserStatus)
-   [UpdateUserPhoto](https://core.telegram.org/constructor/UpdateUserPhoto)
-   [UpdateUserPhone](https://core.telegram.org/constructor/UpdateUserPhone)
-   [UpdateUserName](https://core.telegram.org/constructor/UpdateUserName)
-   [UpdateTheme](https://core.telegram.org/constructor/UpdateTheme)
-   [UpdatesTooLong](https://core.telegram.org/constructor/UpdatesTooLong)
-   [UpdateStickerSetsOrder](https://core.telegram.org/constructor/UpdateStickerSetsOrder)
-   [UpdateStickerSets](https://core.telegram.org/constructor/UpdateStickerSets)
-   [UpdateShortSentMessage](https://core.telegram.org/constructor/UpdateShortSentMessage)
-   [UpdateShortMessage](https://core.telegram.org/constructor/UpdateShortMessage)
-   [UpdateShortChatMessage](https://core.telegram.org/constructor/UpdateShortChatMessage)
-   [UpdateShort](https://core.telegram.org/constructor/UpdateShort)
-   [UpdateServiceNotification](https://core.telegram.org/constructor/UpdateServiceNotification)
-   [UpdatesCombined](https://core.telegram.org/constructor/UpdatesCombined)
-   [UpdateSavedGifs](https://core.telegram.org/constructor/UpdateSavedGifs)
-   [Updates](https://core.telegram.org/constructor/Updates)
-   [UpdateRecentStickers](https://core.telegram.org/constructor/UpdateRecentStickers)
-   [UpdateReadMessagesContents](https://core.telegram.org/constructor/UpdateReadMessagesContents)
-   [UpdateReadHistoryOutbox](https://core.telegram.org/constructor/UpdateReadHistoryOutbox)
-   [UpdateReadHistoryInbox](https://core.telegram.org/constructor/UpdateReadHistoryInbox)
-   [UpdateReadFeaturedStickers](https://core.telegram.org/constructor/UpdateReadFeaturedStickers)
-   [UpdateReadChannelOutbox](https://core.telegram.org/constructor/UpdateReadChannelOutbox)
-   [UpdateReadChannelInbox](https://core.telegram.org/constructor/UpdateReadChannelInbox)
-   [UpdateReadChannelDiscussionOutbox](https://core.telegram.org/constructor/UpdateReadChannelDiscussionOutbox)
-   [UpdateReadChannelDiscussionInbox](https://core.telegram.org/constructor/UpdateReadChannelDiscussionInbox)
-   [UpdatePtsChanged](https://core.telegram.org/constructor/UpdatePtsChanged)
-   [UpdatePrivacy](https://core.telegram.org/constructor/UpdatePrivacy)
-   [UpdatePinnedMessages](https://core.telegram.org/constructor/UpdatePinnedMessages)
-   [UpdatePinnedDialogs](https://core.telegram.org/constructor/UpdatePinnedDialogs)
-   [UpdatePinnedChannelMessages](https://core.telegram.org/constructor/UpdatePinnedChannelMessages)
-   [UpdatePhoneCallSignalingData](https://core.telegram.org/constructor/UpdatePhoneCallSignalingData)
-   [UpdatePhoneCall](https://core.telegram.org/constructor/UpdatePhoneCall)
-   [UpdatePendingJoinRequests](https://core.telegram.org/constructor/UpdatePendingJoinRequests)
-   [UpdatePeerSettings](https://core.telegram.org/constructor/UpdatePeerSettings)
-   [UpdatePeerLocated](https://core.telegram.org/constructor/UpdatePeerLocated)
-   [UpdatePeerHistoryTTL](https://core.telegram.org/constructor/UpdatePeerHistoryTTL)
-   [UpdatePeerBlocked](https://core.telegram.org/constructor/UpdatePeerBlocked)
-   [UpdateNotifySettings](https://core.telegram.org/constructor/UpdateNotifySettings)
-   [UpdateNewStickerSet](https://core.telegram.org/constructor/UpdateNewStickerSet)
-   [UpdateNewScheduledMessage](https://core.telegram.org/constructor/UpdateNewScheduledMessage)
-   [UpdateNewMessage](https://core.telegram.org/constructor/UpdateNewMessage)
-   [UpdateNewEncryptedMessage](https://core.telegram.org/constructor/UpdateNewEncryptedMessage)
-   [UpdateNewChannelMessage](https://core.telegram.org/constructor/UpdateNewChannelMessage)
-   [UpdateMessageReactions](https://core.telegram.org/constructor/UpdateMessageReactions)
-   [UpdateMessagePollVote](https://core.telegram.org/constructor/UpdateMessagePollVote)
-   [UpdateMessagePoll](https://core.telegram.org/constructor/UpdateMessagePoll)
-   [UpdateMessageID](https://core.telegram.org/constructor/UpdateMessageID)
-   [UpdateLoginToken](https://core.telegram.org/constructor/UpdateLoginToken)
-   [UpdateLangPackTooLong](https://core.telegram.org/constructor/UpdateLangPackTooLong)
-   [UpdateLangPack](https://core.telegram.org/constructor/UpdateLangPack)
-   [UpdateInlineBotCallbackQuery](https://core.telegram.org/constructor/UpdateInlineBotCallbackQuery)
-   [UpdateGroupCallParticipants](https://core.telegram.org/constructor/UpdateGroupCallParticipants)
-   [UpdateGroupCallConnection](https://core.telegram.org/constructor/UpdateGroupCallConnection)
-   [UpdateGroupCall](https://core.telegram.org/constructor/UpdateGroupCall)
-   [UpdateGeoLiveViewed](https://core.telegram.org/constructor/UpdateGeoLiveViewed)
-   [UpdateFolderPeers](https://core.telegram.org/constructor/UpdateFolderPeers)
-   [UpdateFavedStickers](https://core.telegram.org/constructor/UpdateFavedStickers)
-   [UpdateEncryption](https://core.telegram.org/constructor/UpdateEncryption)
-   [UpdateEncryptedMessagesRead](https://core.telegram.org/constructor/UpdateEncryptedMessagesRead)
-   [UpdateEncryptedChatTyping](https://core.telegram.org/constructor/UpdateEncryptedChatTyping)
-   [UpdateEditMessage](https://core.telegram.org/constructor/UpdateEditMessage)
-   [UpdateEditChannelMessage](https://core.telegram.org/constructor/UpdateEditChannelMessage)
-   [UpdateDraftMessage](https://core.telegram.org/constructor/UpdateDraftMessage)
-   [UpdateDialogUnreadMark](https://core.telegram.org/constructor/UpdateDialogUnreadMark)
-   [UpdateDialogPinned](https://core.telegram.org/constructor/UpdateDialogPinned)
-   [UpdateDialogFilters](https://core.telegram.org/constructor/UpdateDialogFilters)
-   [UpdateDialogFilterOrder](https://core.telegram.org/constructor/UpdateDialogFilterOrder)
-   [UpdateDialogFilter](https://core.telegram.org/constructor/UpdateDialogFilter)
-   [UpdateDeleteScheduledMessages](https://core.telegram.org/constructor/UpdateDeleteScheduledMessages)
-   [UpdateDeleteMessages](https://core.telegram.org/constructor/UpdateDeleteMessages)
-   [UpdateDeleteChannelMessages](https://core.telegram.org/constructor/UpdateDeleteChannelMessages)
-   [UpdateDcOptions](https://core.telegram.org/constructor/UpdateDcOptions)
-   [UpdateContactsReset](https://core.telegram.org/constructor/UpdateContactsReset)
-   [UpdateConfig](https://core.telegram.org/constructor/UpdateConfig)
-   [UpdateChatUserTyping](https://core.telegram.org/constructor/UpdateChatUserTyping)
-   [UpdateChatParticipants](https://core.telegram.org/constructor/UpdateChatParticipants)
-   [UpdateChatParticipantDelete](https://core.telegram.org/constructor/UpdateChatParticipantDelete)
-   [UpdateChatParticipantAdmin](https://core.telegram.org/constructor/UpdateChatParticipantAdmin)
-   [UpdateChatParticipantAdd](https://core.telegram.org/constructor/UpdateChatParticipantAdd)
-   [UpdateChatParticipant](https://core.telegram.org/constructor/UpdateChatParticipant)
-   [UpdateChatDefaultBannedRights](https://core.telegram.org/constructor/UpdateChatDefaultBannedRights)
-   [UpdateChat](https://core.telegram.org/constructor/UpdateChat)
-   [UpdateChannelWebPage](https://core.telegram.org/constructor/UpdateChannelWebPage)
-   [UpdateChannelUserTyping](https://core.telegram.org/constructor/UpdateChannelUserTyping)
-   [UpdateChannelTooLong](https://core.telegram.org/constructor/UpdateChannelTooLong)
-   [UpdateChannelReadMessagesContents](https://core.telegram.org/constructor/UpdateChannelReadMessagesContents)
-   [UpdateChannelParticipant](https://core.telegram.org/constructor/UpdateChannelParticipant)
-   [UpdateChannelMessageViews](https://core.telegram.org/constructor/UpdateChannelMessageViews)
-   [UpdateChannelMessageForwards](https://core.telegram.org/constructor/UpdateChannelMessageForwards)
-   [UpdateChannelAvailableMessages](https://core.telegram.org/constructor/UpdateChannelAvailableMessages)
-   [UpdateChannel](https://core.telegram.org/constructor/UpdateChannel)
-   [UpdateBotWebhookJSONQuery](https://core.telegram.org/constructor/UpdateBotWebhookJSONQuery)
-   [UpdateBotWebhookJSON](https://core.telegram.org/constructor/UpdateBotWebhookJSON)
-   [UpdateBotStopped](https://core.telegram.org/constructor/UpdateBotStopped)
-   [UpdateBotShippingQuery](https://core.telegram.org/constructor/UpdateBotShippingQuery)
-   [UpdateBotPrecheckoutQuery](https://core.telegram.org/constructor/UpdateBotPrecheckoutQuery)
-   [UpdateBotInlineSend](https://core.telegram.org/constructor/UpdateBotInlineSend)
-   [UpdateBotInlineQuery](https://core.telegram.org/constructor/UpdateBotInlineQuery)
-   [UpdateBotCommands](https://core.telegram.org/constructor/UpdateBotCommands)
-   [UpdateBotChatInviteRequester](https://core.telegram.org/constructor/UpdateBotChatInviteRequester)
-   [UpdateBotCallbackQuery](https://core.telegram.org/constructor/UpdateBotCallbackQuery)
