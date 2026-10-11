import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="container">
        <div className="empty">
          <h2>Story not found</h2>
          <p>It may have been unpublished. <Link href="/">Go to the front page</Link></p>
        </div>
      </main>
      <Footer />
    </>
  );
}
