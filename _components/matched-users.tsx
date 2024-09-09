'use client';


const sim_bg_color = [
    '#FF0000', // red
    '#FF1A00',
    '#FF3300',
    '#FF4D00',
    '#FF6600',
    '#FF8000',
    '#FF9900',
    '#FFB300',
    '#FFCC00',
    '#FFE600',
    '#FFFF00', // yellow
    '#E6FF00',
    '#CCFF00',
    '#B3FF00',
    '#99FF00',
    '#80FF00',
    '#66FF00',
    '#4DFF00',
    '#33FF00',
    '#00FF00',
    '#00FF00'
  ];
  

export default function MatchedUsers({data}:{data: any}){

    

    

    return (
        <div className="matched-users-div" >
            <div className="top-div flex-row-ja-c-c">
                <h1>
                   Matched Users 
                </h1>
            </div>

            <div className="users-div">
                {
                    data &&
                    data.map((item:any) => {
                        return (
                            <div key={item.id} className="user-design-div flex-row-ja-c-c" 
                            style={{ '--sim-bg-color': sim_bg_color[Math.floor((item.Similarity / 5) % 21)] } as React.CSSProperties}>
                                <div className="similarity-div flex-row-ja-c-c">
                                    <p>{item.Similarity}%</p>
                                </div>

                                <div className="name-div">
                                    <p>{item.Name}</p>
                                </div>
                                
                                
                                <img className="status-img" src="/red-dot.png"></img>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}