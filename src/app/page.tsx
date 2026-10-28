import { ChooseResidence } from "@/components/home/ChooseResidence";
import { Culture } from "@/components/home/Culture";
import Faq from "@/components/home/Faq";
import { Locations } from "@/components/home/Locations";
import { RealLife } from "@/components/home/RealLife";
import Story from "@/components/home/Story";
import { Footer } from "@/components/layout/Footer";
import { Journey } from "@/components/ui/Journey";
import { Testimonial } from "@/components/ui/Testimonial";

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
      <Footer />

    </main>
  )
}