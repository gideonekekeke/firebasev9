import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const app = initializeApp({
	apiKey: "AIzaSyBT0iGd7smuMo10LPbJ5jk6--jU790U_lE",
	authDomain: "instagram-9bd52.firebaseapp.com",
	projectId: "instagram-9bd52",
	storageBucket: "instagram-9bd52.appspot.com",
	messagingSenderId: "486806877251",
	appId: "1:486806877251:web:acb1b955cba5c72bbc50f6",
});

const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

export { auth, storage, db };
