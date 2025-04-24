import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/">
          <span className="text-2xl font-bold text-orange-500 cursor-pointer">
            Reddit Clone 🔥
          </span>
        </Link>
        <nav className="space-x-4">
          {user ? (
            <>
              <span>Bienvenue, {user.username}</span>
              <Link href="/create-post">
                <span className="hover:underline cursor-pointer text-orange-500">
                  Créer un post
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:underline"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <Link href="/login">
              <span className="hover:underline cursor-pointer">Connexion</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
