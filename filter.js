const movieQueryObjs = [];
const listElements = [];
// Add to language options and language map allow them as filters.
const languageOptions = ['English', 'French', 'Japanese'];
const languageMap = { English: 'en', French: 'fr', Japanese: 'ja' };
// Default language
let language = 'none';
// Filtered movies are either shaded or removed from DOM
const filterTypeHide = false;

// Observes if films are added to HTML after load, then updates their language
let count = 0;
let newInfo = false;
let observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (!mutation.addedNodes) return;

    newInfo = false;
    for (let i = 0; i < mutation.addedNodes.length; i++) {
      let node = mutation.addedNodes[i];
      if (node.hasAttribute('data-film-release-year')) {
        count++;
        newInfo = true;
        let $movieQueryObj = {
          title: node.getAttribute('data-film-name'),
          year: node.getAttribute('data-film-release-year'),
        };
        movieQueryObjs.push($movieQueryObj);
        listElements.push(node);
      }
    }
    if (language !== 'none' && newInfo && count >= 2) {
      console.log(`count: ${count}`);
      count = 0;
      newInfo = false;
      getMovieLanguages();
    }
  });
});
observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: false,
  characterData: false,
});

// Goes through prepared movies and fetches language data
const getMovieLanguages = () => {
  movieQueryObjs.forEach((movie) => {
    fetchTMDBData(movie);
  });
};

// Using data from the movie database the movies' languages are used to filter
const fetchTMDBData = async (query) => {
  const encodedTitle = encodeURIComponent(query.title);
  const encodedYear = encodeURIComponent(query.year);
  const apiKey = '6b3966c85ef3ac126edf60c04d0f2b22';
  const endpoint = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&&language=en-US&query=${encodedTitle}&year=${encodedYear}&page=1&include_adult=false`;
  // console.log(endpoint);
  const data = await (await fetch(endpoint)).json();
  // Only allows exact title & year match.
  data.results.map((movies) => {
    let date = 'unknown';
    if (movies.release_date !== undefined) {
      date = movies.release_date.split('-')[0];
    }
    if (date === 'unknown') return;
    console.log(JSON.stringify(movies, null, 4));
    if (movies.original_language !== language) {
      listElements.forEach((listEl) => {
        if (listEl.getAttribute('data-film-name') === movies.title) {
          listEl.querySelector('img').style.opacity = '0.1';
          // listEl.style.border = '3px solid red';
          if (filterTypeHide) {
            listEl.parentElement.remove();
          }
        }
      });
    }
    /*     
    return {
      language: movies.original_language,
      title: movies.original_title,
      year: date,
    }; */
  });
};

// Add language function
const addLanguage = (language) => {
  if (languageMap[language] === undefined) {
    const endpoint = 'heroku.app/code/';
    const url = encodeURI(endpoint + language);
    const data = await(await fetch(url)).json();
    const languageListElement = document.querySelector('languageListElement');
    const newOption = document.createElement('li');
    newOption.innerText = data.full_language;
    languageListElement.appendChild(newOption);
  }
};

// Create new option for the native pages filter menu
const selectionBar = document.querySelector('.sorting-selects');
const newSelection = document.createElement('section');
newSelection.classList.add('smenu-wrapper');
// Clones native styling
newSelection.innerHTML = `<strong class="smenu-label"></strong> 
                          <div class="smenu"> 
                            <label  id="languageTitle">Language<i class="ir s icon"></i></label>
                          </div>`;
selectionBar.appendChild(newSelection);

// Creates Language option popup
const languageListContainer = document.createElement('div');
languageListContainer.style.display = 'none';

// Horrible Input Controls
/* const languageFilterOption_highlight = document.createElement('input');
languageFilterOption_highlight.setAttribute('type', 'radio');
const languageFilterOption_hide = document.createElement('input');
languageFilterOption_hide.setAttribute('type', 'radio');
languageFilterOption_highlight.form = 'filterType';
languageFilterOption_hide.form = 'filterType';
languageFilterOption_highlight.addEventListener('click', () => {
  console.log(
    `form value now: ${languageFilterOption_hide.value} ${languageFilterOption_highlight.value} `
  );
});
languageListContainer.firstBefore(languageFilterOption_hide);
languageListContainer.firstBefore(languageFilterOption_highlight); */

const languageListElement = document.createElement('ul');
languageListElement.classList.add('languageListElement');
const languageListOptionsElements = [];
// languageOptions.forEach((lang) => languageListOptionsElements.push(document.createElement('li')));
languageListElement.classList.add('smenu-menu');
languageListElement.style.display = 'none';
languageListElement.style.color = 'black';
languageListElement.style.position = 'absolute';
languageListElement.style.boxShadow = '-3px -3px 19px 4px #000000';
const languageTitle = document.querySelector('#languageTitle');
languageListElement.style.width = '90px';
languageListElement.style.left = 0;
languageListElement.style.bottom = 0;
languageListElement.style.height = '100px';
languageListElement.style.zIndex = '-1';
for (let i = 0; i < languageOptions.length; i++) {
  languageListOptionsElements.push(document.createElement('li'));
  languageListOptionsElements[i].innerText = languageOptions[i];
  languageListElement.appendChild(languageListOptionsElements[i]);
  languageListOptionsElements[i].style.padding = '5px';
  languageListOptionsElements[i].style.cursor = 'pointer';
  languageListOptionsElements[i].addEventListener('mouseenter', () => {
    languageListOptionsElements[i].style.backgroundColor = 'rgba(0,0,0,0.2)';
    if (languageListOptionsElements[i].style.color !== 'red') {
      languageListOptionsElements[i].style.color = 'white';
    }
  });
  languageListOptionsElements[i].addEventListener('mouseout', () => {
    languageListOptionsElements[i].style.backgroundColor = 'rgba(0,0,0,0)';
    if (languageListOptionsElements[i].style.color !== 'red') {
      languageListOptionsElements[i].style.color = 'rgba(0,0,0,0.9)';
    }
  });
  languageListOptionsElements[i].addEventListener('click', () => {
    listElements.forEach((listEl) => {
      listEl.querySelector('img').style.opacity = '1';
    });
    languageListOptionsElements.forEach((el) => (el.style.color = 'black'));
    languageListOptionsElements[i].style.color = 'red';
    if (language === languageMap[languageOptions[i]]) {
      language = 'none';
      languageListOptionsElements[i].style.color = 'white';
    } else {
      language = languageMap[languageOptions[i]];
      getMovieLanguages();
    }
  });
}
languageListOptionsElements[languageListOptionsElements.length - 1].style.borderBottom =
  '1px solid rgba(0,0,0,0.3)';
languageListContainer.appendChild(languageListElement);
selectionBar.appendChild(languageListContainer);
languageTitle.addEventListener('click', () => {
  let menuDisabled = !(languageListContainer.style.display === 'block');
  if (menuDisabled) {
    languageListContainer.style.display = 'block';
    languageListElement.style.display = 'flex';
    languageListElement.style.justifyContent = 'left';
    languageListElement.style.alignItems = 'left';
    languageListElement.style.flexDirection = 'column';
    languageTitle.style.color = 'white';
  } else {
    languageListContainer.style.display = 'none';
    languageTitle.style.color = 'inherit';
  }
});
