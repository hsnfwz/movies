export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;

  const title = searchParams.get('title');
  const page = searchParams.get('page');

  if (!title || title.trim().length === 0 || !page || page === 0)
    return Response.json({ error: 'Please provide title and page.' });

  const response = await fetch(
    `http://www.omdbapi.com/?s=${title.trim()}*&page=${page}&type=movie&apikey=${process.env.OMDB_API_KEY}`
  );
  const { Search: movies } = await response.json();

  return Response.json({ movies: movies || [] });
}
