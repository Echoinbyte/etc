import Herosection from "@/components/landing/Herosection";
import HowItWorks from "@/components/landing/Howitworks";
import Navbar from "@/components/navigation/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <Herosection />
      <HowItWorks />
    </>
  );
}
