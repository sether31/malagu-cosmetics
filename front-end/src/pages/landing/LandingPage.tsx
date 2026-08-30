import NavBar from "../../components/NavBar"
import Home from "./sections/Home"
import { landingSliderData } from "../../data/landing-slider-item";
import { InfiniteSlider } from "../../components/InfiniteSlider";
import FruitySection from "./sections/FruitySection";
import JuicyCollection from "./sections/JuicyCollection";

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

      <div className="h-screen bg-red-300"></div>
      <div className="h-screen bg-red-50"></div>
    </div>
  )
}

export default LandingPage
