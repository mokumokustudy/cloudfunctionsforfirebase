import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
admin.initializeApp()

export const onBostonWeatherUpdate =
functions.firestore.document('cities-weather/boston-ma-us').onUpdate(change => {
    const after = change.after.data()
    const payload = {
        data: {
            temp: String(after.temp),
            conditions: after.conditions
        }
    }
    return admin.messaging().sendToTopic("wether_boston-ma-us", payload)
})

export const getBostonAreaWeather = 
functions.https.onRequest(async (request, response) => {
    try {
        const areaSnapshot = await admin.firestore().doc(`areas/greater-boston`).get()
        const cities = areaSnapshot.data().cities
        const promises = []
	    Object.keys(cities).forEach(function (city) {
            const p = admin.firestore().doc(`cities-weather/${city}`).get()
            promises.push(p)
        });
        const snapshots = await Promise.all(promises)

        const results = []
        snapshots.forEach(snap => {
            const data = snap.data()
            data.city = snap.id
            results.push(data)
        })
        response.send(results)
    }
    catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

export const getBostWeather =
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
});
