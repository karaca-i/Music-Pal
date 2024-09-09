import MatchedClientComponent from "./client-component";




export default function MatchedPage({ params ,searchParams}: { params: { playlistId: string }, searchParams: {id: number}}) {
    /*
  
    */
  
    const { playlistId} = params;
    const id = searchParams.id;

    return (
      <>
        <MatchedClientComponent playlistId={playlistId} user_id={id}></MatchedClientComponent>
      </>
    );
  }
  