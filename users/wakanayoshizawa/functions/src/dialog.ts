import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

var serviceAccount = require("/Users/wakanayoshizawa/Documents/serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://famous-charge-231405.firebaseio.com"
});

export const onMessageCreate = functions.database
.ref('/rooms/{roomId}/messages/{messageId}')
.onCreate((snapshot, context) => {
    const roomId = context.params.roomId
    const messageId = context.params.messageId
    console.log(`New message ${messageId} in room ${roomId}`)

    const massageData = snapshot.val()
    const text = addPizzazz(massageData.text)
    return snapshot.ref.update({ text:text })
})

function addPizzazz(text: string): string {
    return text.replace(/¥bpizza¥b/g, '🍕')
}