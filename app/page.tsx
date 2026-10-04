import Header from "./components/Header";
import Hero from "./components/Hero";
import Ritual from "./components/Ritual";
import Science from "./components/Science";
import Products from "./components/Products";
import Reviews from "./components/Reviews";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Ritual />
        <Science />
        <Products />
        <Reviews />
      </main>
      <Footer />
    </>
  );
}
