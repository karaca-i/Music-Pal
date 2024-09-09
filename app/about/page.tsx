import { Topbar } from "@/_components/topbar";
import { AboutText } from "@/_components/text-about";

export default async function AboutPage() {

    return (
        <div className= "analyze-wrapper">
            <Topbar></Topbar>
            <div className="about-me-text-div flex-row-ja-c-c">
                <AboutText></AboutText>
            </div>
        </div>
    )
}

