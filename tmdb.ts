export type Movie = {
  language?: string;
  title: string;
  year: number;
};

export class Date {
  year: number;
  month: number;
  day: number;
  constructor(release_date) {
    let dateParts = release_date.split('-');
    this.year = dateParts[0];
    this.month = dateParts[1];
    this.day = dateParts[2];
  }
}

export type TMDBResponse = {
  poster_path: string;
  adult: boolean;
  overview: string;
  release_date: string;
  genre_ids: number[];
  id: number;
  original_title: string;
  original_language: string;
  title: string;
  backdrop_path: string;
  popularity: number;
  vote_count: number;
  video: boolean;
  vote_average: number;
};

export const fetchTMDBData = async (query) => {
  const apiKey = '';
  const endpoint = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${query}&page=1&include_adult=false`;
  const data = await (await fetch(endpoint)).json();
  return <Movie>data.results.map((movies: TMDBResponse) => {
    let thisDate = new Date(movies.release_date);
    console.log(movies);
    return <Movie>{
      language: movies.original_language,
      title: movies.original_title,
      year: thisDate.year,
    };
  });
};
