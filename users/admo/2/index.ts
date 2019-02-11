import * as functions from 'firebase-functions'
import * as admin from "firebase-admin";

admin.initializeApp()
admin.firestore().settings({ timestampsInSnapshots: true });

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
