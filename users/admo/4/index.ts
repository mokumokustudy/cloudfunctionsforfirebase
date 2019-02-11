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
functions.https.onRequest((request, response) => {
    admin.firestore().doc("areas/greater-boston").get()
    .then(areaSnapshot => {
        const cities = areaSnapshot.data().cities
        const promises = []
        for (const city in cities) {
            const p = admin.firestore().doc(`citi-weather/${city}`).get()
            promises.push(p)
        }
        return Promise.all(promises)
    })
    .then(citySnapshots => {
        const results = []
        citySnapshots.forEach(citySnap => {
            const data = citySnap.data()
            data.city = citySnap.id
            results.push(data)
        })
        response.send(results)
    })
    .catch(error => {
        console.log(error)
        response.status(500).send(error)
    })
});

export const getBostonWeather = functions.https.onRequest((request, response) => {
  //  const settings = {/* your settings... */ timestampsInSnapshots: true}
    
    admin.firestore().doc('citi-weather/bostom-ma-us').get()
   //admin.firestore.settings(settings)
    .then(snapshot => {
        const data = snapshot.data()
        response.send(data)
    })
    .catch(error => {
        // Handle the error
        console.log(error)
        response.status(500).send(error)
    })
});
