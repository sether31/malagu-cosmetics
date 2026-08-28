import type { SliderItem } from "../components/InfiniteSlider";
import CrueltyFree from "../assets/landing-page/landing-slider/crueltyfree.webp"
import LongLasting from "../assets/landing-page/landing-slider/long-lasting.webp"
import MultiUse from "../assets/landing-page/landing-slider/multi-use.webp"
import Vegan from "../assets/landing-page/landing-slider/vegan.webp"

export const landingSliderData: SliderItem[] = [
  { 
    id: 1, 
    text: "Long wearing", 
    imageSrc: LongLasting,
    imageAlt: "Long Lasting Image"
  },
  { 
    id: 2, 
    text: "Cruelty-free", 
    imageSrc: CrueltyFree,
    imageAlt: "Cruelty Free Image"
  },
  { 
    id: 3, 
    text: "Multi-use",
    imageSrc: MultiUse,
    imageAlt: "Long Lasting Image"
  },
  { 
    id: 4, 
    text: "Vegan",
    imageSrc: Vegan,
    imageAlt: "Vegan Image"
  }
];