import React from "react";
import classes from "./SignIn.module.scss";
import SignInWithGoogleButton from "./UI/SignInWithGoogleButton";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../api-config";
import Card from "./UI/Card";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const SignIn: React.FC = () => {
  const signInHandler = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  return (
    <div className={classes.signIn}>
      <Card className={classes.signInWindow}>
        <h2>User Sign In</h2>
        <SignInWithGoogleButton onClick={signInHandler} />
      </Card>
    </div>
  );
};

export default SignIn;
