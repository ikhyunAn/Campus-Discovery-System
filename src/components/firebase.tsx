import {initializeApp} from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDFaiOQp5Yyf2f-j1kMaT-6H50Sb9StGDU",
    authDomain: "campus-discovery-system.firebaseapp.com",
    projectId: "campus-discovery-system",
    storageBucket: "campus-discovery-system.appspot.com",
    messagingSenderId: "28796804755",
    appId: "1:28796804755:web:7b52520d84fc724b973766"
  };


  const app = initializeApp(firebaseConfig);

  export var db = getFirestore(app)