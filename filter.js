import { fetchTMDBData } from './tmdb';
// get all ids of current films
// 'data-film-id' will get me the id
// currently on the page. Though that means
// that it'll only work on the page currently loaded.
// A way to get the other films? Could be the Letterboxd API,
// though that would require them giving me access.
// jquery a lil selector for the lists, have language sent off then chosen.
// Possibly load when the page is loaded, though that's going to have issues
// with the loading of the pages, ergo a page of nearly all English would become
// a page with 3 films on it. To get around this I'd have to take-over the entire
// pagination. Possible?
let movieIds = [];
let menuElement;
