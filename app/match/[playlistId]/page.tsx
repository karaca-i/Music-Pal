import MatchedClientComponent from "./client-component";




export default function MatchedPage({ params }: { params: { playlistId: string } }) {
    /*
  
    */
  
    const { playlistId } = params;
  
    return (
      <>
        <MatchedClientComponent playlistId={playlistId}></MatchedClientComponent>
      </>
    );
  }
  