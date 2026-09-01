import NavBar from "../../components/NavBar"
import Home from "./sections/Home"
import { landingSliderData } from "../../data/landing-slider-item";
import { InfiniteSlider } from "../../components/InfiniteSlider";
import FruitySection from "./sections/FruitySection";
import JuicyCollection from "./sections/JuicyCollection";
import Banner from "./sections/Banner";
import Newsletter from "./sections/NewsLetter";
import Footer from "../../components/Footer";

const LandingPage = () => {
  return (
    <div>
      <NavBar />
      <Home />
      <InfiniteSlider 
        items={landingSliderData} 
        className="container-xl" 
      />
      <FruitySection />
      <JuicyCollection />
      <Banner />
      <Newsletter />
      <Footer />
    </div>
  )
}

export default LandingPage
