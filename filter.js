// import * as cheerio from 'cheerio';
const cheerio = require('cheerio');
// import { fetchTMDBData } from './tmdb';

function scanApple() {
  const $ = cheerio.load(`<ul id="fruits">
  <li class="apple">Apple</li>
  <li class="orange">Orange</li>
  <li class="pear">Pear</li>
</ul>`);
  let result = $('.apple', '#fruits').text();
  console.log(result);
  return result;
}

console.log('***');
// console.log($('li').attr('data-film-name'));
console.log('###');
// console.log(document.body);
let movieIds = [];

let menuElement;
// Scrape tags
// data-film-name
// data-film-release-year name
