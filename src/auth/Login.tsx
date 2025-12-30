import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  async function handleEmailAuth() {
    setError(null);
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleGoogleLogin() {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div style={{ maxWidth: 320, margin: "4rem auto" }}>
      <h2>{isRegistering ? "Create Account" : "Login"}</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", marginBottom: 8 }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: 8 }}
      />

      <button onClick={handleEmailAuth} style={{ width: "100%" }}>
        {isRegistering ? "Register" : "Login"}
      </button>

      <button
        onClick={handleGoogleLogin}
        style={{ width: "100%", marginTop: 8 }}
      >
        Continue with Google
      </button>

      <p style={{ marginTop: 12 }}>
        {isRegistering ? "Already have an account?" : "Need an account?"}{" "}
        <button
          onClick={() => setIsRegistering(!isRegistering)}
          style={{ textDecoration: "underline", background: "none", border: 0 }}
        >
          {isRegistering ? "Login" : "Register"}
        </button>
      </p>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
