import PopulateClientComponent from "./client-component";



export default function PopulatePage2({ params ,searchParams}: { params: { playlistId: string }, searchParams: {limit?: string}}) {
  /*

  */

  const { playlistId } = params;
  const limit = searchParams.limit ? parseInt(searchParams.limit) : 10;

  return (
    <>
      <PopulateClientComponent playlistId={playlistId} limit={limit}></PopulateClientComponent>
    </>
  );
}
