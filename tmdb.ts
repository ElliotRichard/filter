export type Movie = {
  language: string;
  title: string;
  year: number;
};

export const fetchTMDBData = async (id) => {
  const apiKey = '';
  const endpoint = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=insert%20here&page=1&include_adult=false`;
  const data = await (await fetch(endpoint)).json();
  return data.results;
  /* .map((movies) => ({
    return<Movie> {
      language: movies.original_language,
      title: movies.original_title,
      year: movies.release_year, 
    } */
};
// )
// );
// };
