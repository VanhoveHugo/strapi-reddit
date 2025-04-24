import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Layout from "@/components/Layout";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) router.push("/login");
    else setToken(storedToken);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let mediaId = null;
    const generateSlug = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    try {
      // 1️⃣ Upload du fichier si présent
      if (file) {
        const formData = new FormData();
        formData.append("files", file);

        const uploadRes = await axios.post(
          "http://localhost:1337/api/upload",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        mediaId = uploadRes.data[0].id;
      }

      await axios.post(
        "http://localhost:1337/api/posts",
        {
          data: {
            title,
            content,
            statusPost: "published",
            coverImage: mediaId,
            slug: generateSlug,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      router.push("/");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la création du post.");
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Créer un nouveau Post</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <textarea
            placeholder="Contenu"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border p-2 rounded h-40"
            required
          />
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            className="w-full"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600"
          >
            Publier
          </button>
        </form>
      </div>
    </Layout>
  );
}
