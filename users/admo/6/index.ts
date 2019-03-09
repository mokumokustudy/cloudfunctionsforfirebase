import * as functions from 'firebase-functions'
import * as admin from "firebase-admin";

admin.initializeApp()
admin.firestore().settings({ timestampsInSnapshots: true });

export const onBostonWeatherUpdate = functions.firestore.document('citi-weather/bostom-ma-us').onUpdate(change => {
	const after = change.after.data()
	const payload = {
		data: {
			temp: String(after.temp),
			conditions: after.conditions
		}		
	}
    return admin.messaging().sendToTopic("weather_boston-ma-us", payload)
    .then(function(response) {
        console.log("Successfully sent message:", response)
      })
      .catch(function(error) {
        console.log("Error sending message:", error)
      });
});

export const getBostonAreaWeather = 
functions.https.onRequest( async (request, response) => {
    try {
    const areaSnapshot = await admin.firestore().doc("areas/greater-boston").get()
    const cities = areaSnapshot.data().cities
    //console.log(cities)
    const promises  =  []
	Object.keys(cities).forEach(function (key) {
            const p = admin.firestore().doc(`citi-weather/${key}`).get()
            promises.push(p)
        });
    const snapshots = await Promise.all(promises)
        const results = []
        snapshots.forEach(citySnap => {
            const data = citySnap.data()
            data.city = citySnap.id
            results.push(data)
        })
    response.send(results)
    }
    catch (error) {
console.log(error)
response.status(500).send(error)
}
});

export const getBostonWeather = 
functions.https.onRequest(async (request, response) => {
    try {
	const snapshot = await admin.firestore().doc('citi-weather/somerville-ma-us').get()
	const data = snapshot.data()
	response.send(data)
    }
    catch (error) {
	console.log(error)
	response.status(500).send(error)
    }    
})
