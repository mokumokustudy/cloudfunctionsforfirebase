"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
admin.firestore().settings({ timestampsInSnapshots: true });
exports.getBostonWeather = functions.https.onRequest((request, response) => {
    //  const settings = {/* your settings... */ timestampsInSnapshots: true}
    admin.firestore().doc('citi-weather/bostom-ma-us').get()
        //admin.firestore.settings(settings)
        .then(snapshot => {
        const data = snapshot.data();
        response.send(data);
    })
        .catch(error => {
        // Handle the error
        console.log(error);
        response.status(500).send(error);
    });
});
//# sourceMappingURL=index.js.map
