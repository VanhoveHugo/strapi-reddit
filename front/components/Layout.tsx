// components/Layout.tsx
import Header from "./Header";
import Footer from "./Footer";
import Head from "next/head";

type Props = {
  children: React.ReactNode;
  title?: string;
};

export default function Layout({ children, title = "Reddit Clone" }: Props) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900">
        <Header />
        <main className="flex-1 container mx-auto p-4">{children}</main>
        <Footer />
      </div>
    </>
  );
}
