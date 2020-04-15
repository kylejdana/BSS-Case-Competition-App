import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const config = {
  apiKey: "AIzaSyDBb6AzY5g9MYDJN9MkK_XYz-ePqPVZquU",
  authDomain: "byu-case-competition-center.firebaseapp.com",
  databaseURL: "https://byu-case-competition-center.firebaseio.com",
  projectId: "byu-case-competition-center",
  storageBucket: "byu-case-competition-center.appspot.com",
  messagingSenderId: "270670612692",
  appId: "1:270670612692:web:4b826b5a1fcf242cedd341",
  measurementId: "G-1YCRV9D1WB"
};

firebase.initializeApp(config);

export const auth = firebase.auth();

export const db = firebase.firestore();

export const storage = firebase.storage();

export function snapshotToArray(snapshot) {
  const updatedArray = [];
  snapshot.forEach(s => {
    const data = s.data();
    data.id = s.id;
    updatedArray.push(data);
  });
  return updatedArray;
}
