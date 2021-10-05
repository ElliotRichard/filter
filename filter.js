// const fetchTMDBData = require('./tmdb');
const fetchTMDBData = async (query) => {
  let safeQuery = encodeURIComponent(query);
  const apiKey = '6b3966c85ef3ac126edf60c04d0f2b22';
  const endpoint = `http://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${safeQuery}&page=1&include_adult=false`;
  const data = await (
    await fetch(endpoint, {
      headers: {
        Accept: '*/*',
        Referer: 'https://letterboxd.com',
        Origin: 'https://letterboxd.com',
      },
    })
  ).json();
  return data.results.map((movies) => {
    let thisDate = movies.release_date.split('-')[0];
    console.log(`fetch response: ${movies}`);
    return {
      language: movies.original_language,
      title: movies.original_title,
      year: thisDate,
    };
  });
};

console.log('***');
let moviesStrings = [];
const listElements = document.querySelectorAll('div[data-film-release-year]');
listElements.forEach((listEl) => {
  let year = listEl.getAttribute('data-film-release-year');
  let title = listEl.getAttribute('data-film-name');
  console.log(title, ' ', year);
  let movieString = title + ' ' + year;
  moviesStrings.push(movieString);
});
let movieResponseObjects = [];
// /*
moviesStrings.forEach((movie) => {
  let movieObj = {};
  console.log(`movieString: ${movie}`);
  let result = fetchTMDBData(movie);
  // console.log(`result: ${result}`);
});
// movieResponseObjects.forEach((movieObj) => {
// console.log(`Title: ${movieObj.title} Year: ${movieObj.year} Language: ${movieObj.language}`);
// });
//  */
console.log('###');
