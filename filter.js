const movieResultObjs = [];
const movieQueryObjs = [];
const listElements = [];
// Add to language options and language map allow them as filters.
const languageOptions = ['English', 'French', 'Japanese'];
const languageMap = { English: 'en', French: 'fr', Japanese: 'ja' };

// Default language
currentlyChosenLanguage = 'none';
// Filtered movies are either shaded or removed from DOM
const filterTypeHide = false;
String.prototype.replaceAtIndex = function (_index, _newValue) {
  return this.substr(0, _index) + _newValue + this.substr(_index + _newValue.length);
};

String.prototype.toTitleCase = function () {
  let firstLetter = this.charAt(0).toUpperCase();
  return this.toLowerCase().replaceAtIndex(0, firstLetter);
};

function Movie(title, year, language, element) {
  this.title = title;
  this.year = year;
  this.language = language;
  this.element = element;
}

// List of languages the client can view
const languageListElement = document.createElement('ul');
const addLanguageOption = (language) => {
  const element = document.createElement('li');
  element.innerText = language.toTitleCase();
  element.style.padding = '5px';
  element.style.minHeight = '10px';
  element.style.cursor = 'pointer';
  element.addEventListener('mouseenter', () => {
    element.style.backgroundColor = 'rgba(0,0,0,0.2)';
    if (element.style.color !== 'red') {
      element.style.color = 'white';
    }
  });
  element.addEventListener('mouseout', () => {
    element.style.backgroundColor = 'rgba(0,0,0,0)';
    if (element.style.color !== 'red') {
      element.style.color = 'rgba(0,0,0,0.9)';
    }
  });
  element.addEventListener('click', () => {
    languageListElement.childNodes.forEach((el) => (el.style.color = 'black'));
    element.style.color = 'red';
    if (currentlyChosenLanguage === languageMap[language]) {
      currentlyChosenLanguage = 'none';
      element.style.color = 'white';
    } else {
      currentlyChosenLanguage = languageMap[language];
    }
    listElements.forEach((listEl) => {
      let movie = movieResultObjs.find(
        (movie) =>
          movie.title.toLowerCase() === listEl.getAttribute('data-film-name').toLowerCase() &&
          movie.year.toLowerCase() === listEl.getAttribute('data-film-release-year')
      );
      if (movie) {
        if (movie.language !== currentlyChosenLanguage && currentlyChosenLanguage !== 'none') {
          listEl.querySelector('img').style.opacity = '0.1';
        } else listEl.querySelector('img').style.opacity = '1';
      }
    });
  });
  if (languageListElement.lastChild) {
    languageListElement.lastChild.style.borderBottom = 'none';
    languageListElement.lastChild.backgroundColor = '#8899aa';
    languageListElement.lastChild.style.marginBottom = '0';
  }
  languageListElement.appendChild(element);
  languageListElement.lastChild.style.marginBottom = '23px';
  languageListElement.lastChild.style.borderBottom = '1px solid rgba(0,0,0,0.3)';
};

// Create 'Language' option in Letterboxd's filter menu
const createLanguageMenuOption = () => {
  const selectionBar = document.querySelector('.sorting-selects');
  const newSelection = document.createElement('section');
  newSelection.classList.add('smenu-wrapper');
  // Clones native styling
  newSelection.innerHTML = `<strong class="smenu-label"></strong> 
                          <div class="smenu"> 
                            <label  id="languageTitle">Language<i id="languageTitleCaret" class="ir s icon"></i></label>
                          </div>`;
  selectionBar.appendChild(newSelection);

  // Creates Language option popup
  const languageListContainer = document.createElement('div');
  languageListContainer.style.display = 'none';
  languageListElement.style.overflow = 'auto';
  languageListElement.classList.add('languageListElement');
  languageListElement.classList.add('smenu-menu');
  languageListElement.style.display = 'none';
  languageListElement.style.borderRadius = '5px';
  languageListElement.style.color = 'black';
  languageListElement.style.position = 'absolute';
  languageListElement.style.boxShadow = '-3px -3px 19px 4px #000000';
  const languageTitle = document.querySelector('#languageTitle');
  languageTitle.style.borderRadius = '2px';
  languageTitle.style.paddingRight = '6px';
  languageListElement.style.width = '90px';
  languageListElement.style.left = 0;
  languageListElement.style.bottom = 0;
  languageListElement.style.marginBottom = '5px';
  languageListElement.style.height = '80px';
  languageListElement.style.zIndex = '-1';
  languageOptions.forEach((language) => {
    addLanguageOption(language);
  });
  languageListContainer.appendChild(languageListElement);
  selectionBar.appendChild(languageListContainer);
  const activateMenu = () => {
    languageListContainer.style.display = 'block';
    languageListElement.style.display = 'flex';
    languageListElement.style.justifyContent = 'left';
    languageListElement.style.alignItems = 'left';
    languageListElement.style.flexDirection = 'column';
    languageTitle.style.color = 'white';
    languageTitle.style.backgroundColor = '#8899aa';
  };
  const deactivateMenu = () => {
    languageListContainer.style.display = 'none';
    languageTitle.style.color = 'inherit';
    languageTitle.style.backgroundColor = 'rgba(0,0,0,0)';
  };
  languageTitle.addEventListener('click', () => {
    let menuDisabled = !(languageListContainer.style.display === 'block');
    if (menuDisabled) {
      activateMenu();
    } else {
      deactivateMenu();
    }
  });
  // Rest of function clones hover style on list
  const list = document.querySelector('.languageListElement');
  let closeMenu = true;
  list.addEventListener('mouseenter', () => {
    closeMenu = true;
    activateMenu();
  });
  list.addEventListener('mouseleave', () => {
    closeMenu = false;
    deactivateMenu();
  });
  languageTitle.addEventListener('mouseenter', () => {
    // If mouse just scrolls on by then menu won't open straight away
    setTimeout(() => {
      if (closeMenu) {
        activateMenu();
        closeMenu = false;
      }
    }, 400);
  });
  languageTitle.addEventListener('mouseleave', () => {
    // Gives time scrolling from title to list
    setTimeout(() => {
      if (!closeMenu) {
        deactivateMenu();
        closeMenu = true;
      }
    }, 750);
  });
};

createLanguageMenuOption();

// Tracks movies that are added to webpage
let newMovieCount = 0;
let newInfo = false;
let observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (!mutation.addedNodes) return;

    newInfo = false;
    for (let i = 0; i < mutation.addedNodes.length; i++) {
      let node = mutation.addedNodes[i];
      if (node.hasAttribute('data-film-release-year')) {
        newMovieCount++;
        newInfo = true;
        let movieQueryObj = {
          title: node.getAttribute('data-film-name'),
          year: node.getAttribute('data-film-release-year'),
        };
        movieQueryObjs.push(movieQueryObj);
        listElements.push(node);
      }
    }
    if (newInfo && newMovieCount >= 2) {
      newMovieCount = 0;
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

// Adds language option from 2-letter code
const addLanguageCode = (languageCode) => {
  fetchLanguageFromCode(languageCode);
};

// Add language function
const fetchLanguageFromCode = async (languageCode) => {
  const endpoint = 'https://language-iso-code-api.herokuapp.com/code/';
  const url = encodeURI(endpoint + languageCode);
  await (await fetch(url)).json().then((result) => {
    if (result.message) {
      console.log('error', result.message, 'for ', languageCode);
    } else {
      const language = result.toTitleCase();
      languageMap[language] = languageCode.toLowerCase();
      if (!languageOptions.includes(language)) {
        languageOptions.push(language);
        addLanguageOption(language);
      }
    }
  });
};

// Using data from "The Movie Database" the movies are filtered based on language
const fetchTMDBData = async (query) => {
  const encodedTitle = encodeURIComponent(query.title);
  const encodedYear = encodeURIComponent(query.year);
  const apiKey = '6b3966c85ef3ac126edf60c04d0f2b22';
  const endpoint = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&&language=en-US&query=${encodedTitle}&year=${encodedYear}&page=1&include_adult=false`;
  const data = await (await fetch(endpoint)).json();
  // Only allows exact title & year match.
  data.results.map((movies) => {
    let releaseYear = 'unknown';
    if (movies.release_date !== undefined) {
      releaseYear = movies.release_date.split('-')[0];
    }
    if (releaseYear === 'unknown') return;
    let element = listElements.find(
      (listEl) => listEl.getAttribute('data-film-name').toLowerCase() === movies.title.toLowerCase()
    );
    if (element) {
      if (!Object.values(languageMap).includes(movies.original_language)) {
        let newCode = movies.original_language;
        if (newCode == 'cn') {
          // TMBD sometimes stores Cantonese but it isn't a ISO-Code code
          newCode = 'zh';
        }
        addLanguageCode(newCode);
      }
      let movie = new Movie(movies.title, releaseYear, movies.original_language, element);
      if (!movieResultObjs.includes(movie)) {
        movieResultObjs.push(movie);
      }
    }
    if (
      movies.original_language !== currentlyChosenLanguage &&
      currentlyChosenLanguage !== 'none'
    ) {
      listElements.forEach((listEl) => {
        if (listEl.getAttribute('data-film-name') === movies.title) {
          listEl.querySelector('img').style.opacity = '0.1';
          if (filterTypeHide) {
            listEl.parentElement.remove();
          }
        }
      });
    }
  });
};
