export function Feature(){

    return(
        <section className="feature-div">

            <a type="button" href="/analyze">
                <div className="seperate-div">
                    <div className="seperate-top">
                        <img className="seperate-icon" src="seperate-icon.png" alt="seperate"></img>   
                    </div>
                    <div className="seperate-bot">
                        <p>
                            Analyze your playlist to group the similar musics into new playlists.
                            
                        </p>
                    </div>
                </div>

            </a>

            <a type="button" href="/populate">
                <div className="seperate-div">
                    <div className="seperate-top">
                        <img className="populate-icon" src="populate-icon.png" alt="populate"></img>   
                    </div>
                    <div className="seperate-bot">
                        <p>
                            Populate a few tracks into a playlist that fits in your current mood.
                        </p>
                    </div>
                </div>

            </a>

            <a type="button">
                <div className="seperate-div">
                    <div className="seperate-top">
                        <img className="user-icon" src="user-icon.png" alt="user"></img>   
                    </div>
                    <div className="seperate-bot">
                        <p>
                            Meet with the other users have the same taste of music. 
                            (Soon)
                        </p>
                    </div>
                </div>

            </a>


        </section>
    )
}