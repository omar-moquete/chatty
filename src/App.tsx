import React, { useEffect } from "react";
import Card from "./components/UI/Card";
import ChatRoom from "./components/ChatRoom";
import classes from "./App.module.scss";
import SignIn from "./components/SignIn";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./api-config";
import { getAuth, signOut } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const App: React.FC = () => {
  const [user] = useAuthState(auth);

  const signOutHandler = (): void => {
    signOut(auth);
  };

  return (
    <div>
      <header className={classes.header}>
        <h3>chatty</h3>
        {user && <button onClick={signOutHandler}>Sign Out</button>}
      </header>
      <Card className={classes.card}>{user ? <ChatRoom /> : <SignIn />}</Card>
    </div>
  );
};

export default App;
