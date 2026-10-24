import RealStories from "@/components/stories/RealStories";
import LifeMoments from "@/components/lifeataurus/LifeMoments";
import AurusJournal from "@/components/stories/AurusJournal";

export const metadata = {
    title: "Real Stories, Genuine Experiences | AURUS",
    description:
        "What residents and parents say about living at Aurus — in their words. Explore authentic stories and insights from the Aurus Journal.",
};

export default function StoriesPage() {
    return (
        <main>
            <RealStories />
            <LifeMoments />
            <AurusJournal />
        </main>
    );
}