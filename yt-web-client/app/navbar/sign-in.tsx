'use client';
import { Fragment } from "react";
import styles from './sign-in.module.css';
import { signInWithGoogle, signOut } from "../firebase/firebase";
import { User } from "firebase/auth";

interface SignInProps{
    user: User | null;
}

//we want to render this component differently based on the state of our application
export default function SignIn({ user } : SignInProps) {
    return (
		<Fragment>
			{user ? (
				<button className={styles.signin} onClick={signOut}>
					Sign Out
				</button>
			) : (
				<button className={styles.signin} onClick={signInWithGoogle}>
					Sign In
				</button>
			)}
		</Fragment>
	);
}