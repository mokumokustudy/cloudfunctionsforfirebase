import * as admin from "firebase-admin";

const serviceAccount = require('../service-account.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://{your project id}firebaseio.com"
});

; (async () => {
  await chat('pizzachat', 'Fear', "What the heck is that")
  await chat('pizzachat', 'Joy', 'hoge')
  await chat('pizzachat', 'piyo', 'pizza pizza')
  await chat('pizzachat', 'やばい人', 'ほげええ sushi pizza')
  process.exit(0)
})()
  .catch(err => { console.log(err) })

async function chat(room: string, name: string, text: string) {
  const messagesRef = admin.database().ref('rooms').child(room).child('messages')
  await messagesRef.push({ name, text })
  console.log(`${name}: ${text}`)
  await sleep(2000)
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
