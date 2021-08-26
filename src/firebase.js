// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
      apiKey: "AIzaSyCTsbjakFt9zFsyVnFGmuDggwB2dwdp288",
    authDomain: "instagram-clone-react-bdebe.firebaseapp.com",
    projectId: "instagram-clone-react-bdebe",
    storageBucket: "instagram-clone-react-bdebe.appspot.com",
    messagingSenderId: "133375325151",
    appId: "1:133375325151:web:58eb1243cfcfbbe7aa8a6a",
    measurementId: "G-E9E1BE1V9S"


  
  });
   
  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export { db , auth , storage } ;
