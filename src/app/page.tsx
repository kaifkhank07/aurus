import { ChooseResidence } from "@/components/home/ChooseResidence";
import Story from "@/components/home/Story";
import { Locations } from "@/components/shared/Locations";
import { RealLife } from "@/components/shared/RealLife";
import { Culture } from "@/components/shared/Culture";
import { Testimonial } from "@/components/shared/Testimonial";
import Faq from "@/components/home/Faq";
import { Journey } from "@/components/shared/Journey";


export default function Home() {
  return (
    <main>
      <ChooseResidence />
      <Story />
      <Locations />
      <RealLife />
      <Culture />
      <Testimonial />
      <Faq />
      <Journey />
    </main>
  )
}