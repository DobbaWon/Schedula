import styles from "./Login.module.css";

import { handleGoogleLogin, handleMicrosoftLogin } from "../../api/auth/auth";

export default function Login() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Sign in</h1>
        <p className={styles.subtitle}>
          Access your organisation dashboard
        </p>

        <button className={`${styles.button} ${styles.google}`} onClick={handleGoogleLogin}>
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className={styles.icon}
          />
          Sign in with Google
        </button>

        <button className={`${styles.button} ${styles.microsoft}`} onClick={handleMicrosoftLogin}>
          <img
            src="https://www.svgrepo.com/show/452062/microsoft.svg"
            alt="Microsoft"
            className={styles.icon}
          />
          Sign in with Microsoft
        </button>

        <div className={styles.footer}>
          <p>© {new Date().getFullYear()} Schedula</p>
          <p><strong>This page will be updated later to include marketing for the product.</strong></p>
        </div>
      </div>
    </div>
  );
}
