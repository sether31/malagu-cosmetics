import Home from "./sections/Home"
import { landingSliderData } from "../../data/landing-slider-item";
import { InfiniteSlider } from "../../components/InfiniteSlider";
import FruitySection from "./sections/FruitySection";
import JuicyCollection from "./sections/JuicyCollection";
import Banner from "./sections/Banner";
import Newsletter from "./sections/NewsLetter";

const LandingPage = () => {
  return (
    <div>
      <Home />
      <InfiniteSlider 
        items={landingSliderData} 
        className="container-xl" 
      />
      <FruitySection />
      <JuicyCollection />
      <Banner />
      <Newsletter />
    </div>
  )
}

export default LandingPage
