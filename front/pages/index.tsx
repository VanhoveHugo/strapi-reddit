// pages/index.tsx
import Layout from "@/components/Layout";
import { GetServerSideProps } from "next";
import axios from "axios";
import qs from "qs";
import Image from "next/image";

type Post = {
  id: number;
  title: string;
  slug: string;
  publishedAt: string;
  content: string;
  coverImage: {
    ext: string;
    url: string;
  };
  author: {
    data: {
      attributes: {
        username: string;
      };
    };
  };
};

export default function Home({ posts }: { posts: Post[] }) {
  console.log(posts);

  return (
    <Layout title="Accueil - Reddit Clone">
      <div className="grid gap-6 max-w-lg mx-auto">
        {(!posts || posts.length === 0) && <p>Aucun post trouvé.</p>}
        {posts.map((post) => (
          <a
            href={`/post/${post.slug}`}
            key={post.id}
            className="bg-white p-4 rounded shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-sm text-gray-500">
              Publié le {new Date(post.publishedAt).toLocaleDateString("fr-FR")}
            </p>
            {post.coverImage?.ext ? (
              // Si image ou vidéo, on affiche le média
              post.coverImage.ext === ".mp4" ? (
                <video
                  controls
                  className="mt-2 rounded"
                  src={`http://localhost:1337${post.coverImage.url}`}
                />
              ) : (
                <Image
                  src={`http://localhost:1337${post.coverImage.url}`}
                  alt={post.title}
                  width={500}
                  height={300}
                  className="mt-2 rounded"
                />
              )
            ) : (
              // Sinon, on affiche le content
              <p className="mt-2 text-gray-700 line-clamp-3">{post.content}</p>
            )}
          </a>
        ))}
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const query = qs.stringify(
    {
      filters: {
        statusPost: { $eq: "published" },
      },
      populate: ["coverImage", "author"],
    },
    { encodeValuesOnly: true }
  );

  const res = await axios.get(`http://localhost:1337/api/posts?${query}`);

  return {
    props: {
      posts: res.data.data,
    },
  };
};
