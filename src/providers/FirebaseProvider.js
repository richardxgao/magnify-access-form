import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { createContext } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyAgIVZESVFc3I146l-DbqguZefpag5aqb0",
  authDomain: "magnify-access-form.firebaseapp.com",
  projectId: "magnify-access-form",
  storageBucket: "magnify-access-form.appspot.com",
  messagingSenderId: "1034173384070",
  appId: "1:1034173384070:web:98edb6c4b8697dece6d807",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const FirebaseContext = createContext();

const FirebaseProvider = (props) => {
  const theValues = { app, db };
  return <FirebaseContext.Provider value={theValues}>{props.children}</FirebaseContext.Provider>;
};

export default FirebaseProvider;
