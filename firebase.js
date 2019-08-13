const firebase = require("firebase/app");
require("firebase/database");

firebase.initializeApp({
  apiKey: "AIzaSyCZJ30MqdSEb6bdxOx7cCtDVicl5ZUGubg",
  authDomain: "afterlab-render.firebaseapp.com",
  databaseURL: "https://afterlab-render.firebaseio.com",
  projectId: "afterlab-render",
  storageBucket: "afterlab-render.appspot.com",
  messagingSenderId: "291839964535",
  appId: "1:291839964535:web:423e7a68fccfd88b"
});
const database = firebase.database();

module.exports = { database };
