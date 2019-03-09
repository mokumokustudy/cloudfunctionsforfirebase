import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp()

 // Start writing Firebase Functions
 // https://firebase.google.com/docs/functions/typescript

export const onBostonWeatherUpdate =
functions.firestore.document("cities-weather/boston-ma-us").onUpdate(change => {
    const after = change.after.data()
    change.after
    const payload = {
        data: {
            temp: String(after.temp),
            condition: after.condition
        }
    }
    return admin.messaging().sendToTopic("weather_boston-ma-us", payload)
})

export const getBostonAreaWeather =
functions.https.onRequest(async (request, response) => {
    try {
        const areaSnapshot = await admin.firestore().doc("areas/greater-boston").get()
        const cities = areaSnapshot.data().cities
        const promises = []
        for (const city in cities) {
            const p = admin.firestore().doc(`cities-weather/${city}`).get()
            promises.push(p)
        }
        const snapshots = await Promise.all(promises)
        
        const results = []
        snapshots.forEach(citySnap => {
            const data = citySnap.data()
            results.push(data)
        })
        response.send(results)
    }
    catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

 export const getBostonWeather = 
 functions.https.onRequest(async (request, response) => {
    try {
        const snapshot = await admin.firestore().doc('cities-weather/boston-ma-us').get()
        const data = snapshot.data()
        response.send(data)
    }
    catch (error) {
        console.log(error)
        response.status(500).send(error)        
    }
 })
