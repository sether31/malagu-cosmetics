import FairImage from "../assets/landing-page/shade-guide/skintone/fair.jpg"
import LightImage from "../assets/landing-page/shade-guide/skintone/light.jpg"
import MediumImage from "../assets/landing-page/shade-guide/skintone/medium.jpg"
import TanImage from "../assets/landing-page/shade-guide/skintone/tan.jpg"
import DeepImage from "../assets/landing-page/shade-guide/skintone/deep.jpg"

export interface GuideItem {
  img?: string,
  title: string;
  description: string;
  bgClass?: string;
  borderClass?: string;
  textClass?: string;
}

export const shadeGuideData: GuideItem[] = [
  { 
    img: FairImage,
    title: "Fair", 
    description: "Porcelain to very light complexions. Skin typically burns very easily and rarely tans in the sun. Look for ivory and porcelain shades.", 
    bgClass: "bg-[#fdf6f0]", 
    borderClass: "border-[#e8d3c1]"
  },
  { 
    img: LightImage,
    title: "Light", 
    description: "Light beige or peach complexions. Skin may burn initially in strong sunlight but can develop a light, subtle tan over time.", 
    bgClass: "bg-[#f5e6d8]", 
    borderClass: "border-[#d8bcab]"
  },
  { 
    img: MediumImage,
    title: "Medium", 
    description: "Honey, wheat, or true olive complexions. Skin tans easily to a golden hue and rarely burns under normal conditions.", 
    bgClass: "bg-[#d9b398]", 
    borderClass: "border-[#bc9375]", 
    textClass: "text-white"
  },
  { 
    img: TanImage,
    title: "Tan", 
    description: "Deep golden or warm caramel complexions. Skin holds a deep tan year-round and practically never burns.", 
    bgClass: "bg-[#a67c5b]", 
    borderClass: "border-[#8c6546]", 
    textClass: "text-white"
  },
  { 
    img: DeepImage,
    title: "Deep", 
    description: "Rich brown to deep espresso complexions. Highly pigmented with deep melanin levels and never burns in direct sunlight.", 
    bgClass: "bg-[#5c3e2e]", 
    borderClass: "border-[#3d271c]", 
    textClass: "text-white"
  },
];


export const undertoneGuideData: GuideItem[] = [
  {
    title: "Cool Undertone",
    description: "If the veins on your wrist look blue or purple, and silver jewelry makes your skin pop and glow, you likely have cool (pink or red) undertones.",
    textClass: "text-purple-900",
    bgClass: "bg-purple-50",
    borderClass: "border-purple-200",
  },
  {
    title: "Warm Undertone",
    description: "If the veins on your wrist look a bit greenish, and gold jewelry looks amazing on you, you likely have warm (golden or yellow) undertones.",
    textClass: "text-emerald-900",
    bgClass: "bg-emerald-50",
    borderClass: "border-emerald-200",
  },
  {
    title: "Neutral Undertone",
    description: "You're lucky to be right in the middle! If your veins look like a mix of blue and green, and both gold and silver jewelry look equally great on you, you're neutral.",
    textClass: "text-zinc-900",
    bgClass: "bg-zinc-100",
    borderClass: "border-zinc-200",
  },
];