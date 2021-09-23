export const fetchMovieLanguage = async (titles) => {
  const endpoint =
    'https://api.themoviedb.org/3/search/movie?api_key=<<api_key>>&language=en-US&query=insert%20here&page=1&include_adult=false';
  const data = await (await fetch(endpoint)).json();
  return data.results.map((movies) => ({}));
};
