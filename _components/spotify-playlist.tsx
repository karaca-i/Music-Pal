import Link from 'next/link';

const colors = [
    '#233142', '#455d7a', '#f95959', '#e3e3e3', 
    '#00204a', '#005792', '#00bbf0', '#fdb44b', 
    '#42b883', '#347474', '#35495e', '#ff7e67'
];


export function SpotifyPlaylist({playlistNo, playlistName,playlistId, images,href_=`/analyze/${playlistId}`} :{
    playlistNo: number,
    playlistName: string,
    playlistId: string,
    images: Array<{url: string}>,
    href_?:string,
}){

    const colorIndex = playlistNo % colors.length;
    const backgroundColor = colors[colorIndex];

    return (
        <Link className='playlist-link' href={href_} passHref>
            <div className="playlist-div">
                <div className="playlist-no-div" style={{backgroundColor}}>
                    <span className="playlist-no">
                        {playlistNo+1}
                    </span>
                </div>
                
                <div className="playlist-name-div">
                    <p className="playlist-name">
                        {playlistName}
                    </p>
                </div>

 
            </div>

            <div className='playlist-img-div'>
                    {
                        <img className='playlist-img' src={images[0].url} alt={playlistName} />
                    }      
            </div>
        </Link>

    )
}