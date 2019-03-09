import * as functions from 'firebase-functions'
import * as admin from "firebase-admin";

admin.initializeApp()
//admin.firestore().settings({ timestampsInSnapshots: true });

export const onBostonWeatherUpdate = functions.firestore.document("cities-weather/boston-ma-us").onUpdate(change => {
  console.log("call onBostonWeatherUpdate")
  const after = change.after.data()
  const payload = {
    data: {
      temp: String(after.temp),
      conditions: after.conditions
    }
  }
  return admin.messaging().sendToTopic("weather_boston-ma-us", payload)
})

export const getBostonWeather = functions.https.onRequest(async (request, response) => {
  try {
    const snapshot = await admin.firestore().doc('cities-weather/boston-ma-us').get()
    const data = snapshot.data()
    response.send(data)
  } catch (error) {
    // Handle the error
    console.log(error)
    response.status(500).send(error)
  }
});

export const getBostonArea = functions.https.onRequest(async (request, response) => {
  try {
    const snapshot = await admin.firestore().doc('areas/greater-boston').get()
    const data = snapshot.data()
    response.send(data)
  } catch (error) {
    // Handle the error
    console.log(error)
    response.status(500).send(error)
  }
});

export const getBostonAreaWeather = functions.https.onRequest(async (request, response) => {
  try {
    const snapshot = await admin.firestore().doc('areas/greater-boston').get()
    const cities = snapshot.data()
    const promises = []
    for (const city in cities) {
      const p = admin.firestore().doc(`cities-weather/${city}`).get()
      promises.push(p)
    }
    const citySnapShots = await Promise.all(promises)
    const results = []
    citySnapShots.forEach(citySnap => {
      const data = citySnap.data()
      results.push(data)
    })
    response.send(results)
  } catch (error) {
    // Handle the error
    console.log(error)
    response.status(500).send(error)
  }
})
