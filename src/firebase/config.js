import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDM0XdqdVEZ7eM-EUTxa_EaiRx7TiGeIwA",
  authDomain: "mymoney-b5a51.firebaseapp.com",
  projectId: "mymoney-b5a51",
  storageBucket: "mymoney-b5a51.appspot.com",
  messagingSenderId: "309931583902",
  appId: "1:309931583902:web:e1bf1e98fea4621bd74e8f"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// init individual service
const projectFirestore = firebase.firestore()
const projectAuth = firebase.auth()

// TIMESTAMP
const timestamp = firebase.firestore.Timestamp

export{ projectFirestore,projectAuth, timestamp }