


export default function PopulatedText({trackCount}:{trackCount:number}){  

    return (
        <section className="text-analyze-div">
            <h1>
                <span>Done!</span>
            </h1>
            <div className="about-p">
                <p> 
                You can see the recommended tracks to populate your playlist on spotify,  
            fit in your current mood. Hover on tracks to get more detailed info. Also, you can exclude them to be added by clicking, they will turn red.
                </p>
                <p> 
                Here, {trackCount} more tracks:
                </p>

            </div>
        </section>
    )
}