import PlaylistsClientComponent from "./client-component";



export default function AnalyzedPage({ params }: { params: { playlistId: string } }) {
    /*
  
    */
  
    const { playlistId } = params;
  
    return (
      <>
        <PlaylistsClientComponent playlistId={playlistId}></PlaylistsClientComponent>
      </>
    );
  }
  