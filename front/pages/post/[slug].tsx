import { GetServerSideProps } from "next";
import axios from "axios";
import qs from "qs";
import Layout from "@/components/Layout";
import { useState } from "react";
import Image from "next/image";

type Comment = {
  id: number;
  content: string;
  authorName: string;
  publishedAt: string;
};

type Post = {
  id: number;
  title: string;
  content: string;
  publishedAt: string;
  coverImage: {
    url: string;
    mime: string;
  };
  comments: Comment[];
};

export default function PostDetail({ post }: { post: Post }) {
  const [comment, setComment] = useState("");
  const [authorName, setAuthorName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post(
      "http://localhost:1337/api/comments",
      {
        data: {
          content: comment,
          authorName,
          post: post.id,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    location.reload(); // Reload pour afficher le commentaire (simple pour l'instant)
  };

  const media = post.coverImage;

  return (
    <Layout title={post.title}>
      <button
        onClick={() => window.history.back()}
        className="mb-4 text-blue-500 hover:underline"
      >
        Retour
      </button>
      <div className="bg-white p-6 rounded shadow max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <p className="text-sm text-gray-500 mb-4">
          Publié le {new Date(post.publishedAt).toLocaleDateString("fr-FR")}
        </p>

        {media && media.mime.startsWith("image") && (
          <Image
            src={`http://localhost:1337${media.url}`}
            alt="Post media"
            className="w-full mb-4 rounded"
            width={500}
            height={300}
          />
        )}

        {media && media.mime.startsWith("video") && (
          <video controls className="w-full mb-4 rounded">
            <source src={`http://localhost:1337${media.url}`} />
          </video>
        )}

        <div className="prose max-w-none mb-6">{post.content}</div>

        <h2 className="text-xl font-semibold mb-2">Commentaires</h2>
        <div className="space-y-4 mb-6">
          {post.comments.map((c) => (
            <div key={c.id} className="border p-3 rounded">
              <p className="text-sm text-gray-700">{c.content}</p>
              <p className="text-xs text-gray-500">
                Par {c.authorName} le{" "}
                {new Date(c.publishedAt).toLocaleDateString("fr-FR")}
              </p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Votre nom"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <textarea
            placeholder="Votre commentaire"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Poster le commentaire
          </button>
        </form>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params!;

  const query = qs.stringify(
    {
      filters: { slug: { $eq: slug } },
      populate: ["coverImage", "comments"],
    },
    { encodeValuesOnly: true }
  );

  const res = await axios.get(`http://localhost:1337/api/posts?${query}`);
  const post = res.data.data[0]; // On récupère le premier match

  if (!post) {
    return { notFound: true };
  }

  return { props: { post } };
};
