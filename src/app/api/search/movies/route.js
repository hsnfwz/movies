export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const title = searchParams.get('title');
  const page = searchParams.get('page');

  if (!title || title.trim().length === 0 || !page || page === 0)
    return Response.json({ error: 'Please provide title and page.' });

  const movies = [];

  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${title.trim()}&page=${page}&include_adult=false&language=en-US&region=CA`,
    {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_API_READ_ACCESS_TOKEN}`,
      },
    }
  );

  const { results } = await response.json();

  let i = 0;
  while (i < results.length) {
    const result = results[i];

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${results[i].id}/external_ids`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${process.env.TMDB_API_READ_ACCESS_TOKEN}`,
        },
      }
    );

    const { imdb_id } = await response.json();

    movies.push({
      imdb_id,
      tmdb_id: result.id,
      title: result.title,
      year: result.release_date.split('-')[0],
      poster_path: result.poster_path,
    });

    i++;
  }

  return Response.json({ movies });
}
