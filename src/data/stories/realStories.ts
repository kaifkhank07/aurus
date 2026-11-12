export interface StoryStat {
    value: string;
    label: string;
}

export interface realStoriesData {
    titleTop: string;
    titleAccent: string;
    body: string;
    stats: StoryStat[];
}


export const realStoriesData: realStoriesData = {
    titleTop: "REAL STORIES, GENUINE",
    titleAccent: "Experiences",
    body: "What residents and parents say about living at Aurus — in their words.",
    stats: [
        {
            value: "4.9/5",
            label: "AVERAGE RATING",
        },
        {
            value: "5,000+",
            label: "RESIDENTS SO FAR",
        },
        {
            value: "5",
            label: "CITIES ACROSS INDIA",
        },
        {
            value: "9",
            label: "LIVE CHAPTERS",
        },
    ],
}
