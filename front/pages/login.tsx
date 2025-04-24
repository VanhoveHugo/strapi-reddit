import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:1337/api/auth/local", {
        identifier: email,
        password: password,
      });

      const { jwt, user } = res.data;

      // Stockage du token
      localStorage.setItem("token", jwt);
      localStorage.setItem("user", JSON.stringify(user));

      router.push("/"); // Redirection après login
    } catch (err) {
      console.log(err);
      setError("Email ou mot de passe incorrect");
    }
  };

  return (
    <Layout title="Connexion">
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Connexion</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600"
          >
            Se connecter
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          Pas encore de compte ?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Inscris-toi ici
          </a>
        </p>
      </div>
    </Layout>
  );
}
