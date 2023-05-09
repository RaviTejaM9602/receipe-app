//https://developer.edamam.com/edamam-docs-recipe-api
const searchForm = document.querySelector('form > button');
const inputValue = document.querySelector('form > input');
const searchResultDiv = document.querySelector('.search-result');
const container = document.querySelector('.container');
let searchQuery = '';
const APP_ID = 'fe917a7d';
const APP_KEY = 'dbbfadc4f4049de4dfb35d6660423d9a';
let isPageLoad = true;
let next;

function generateHTML(results) {
    let generatedHTML = ' ';
    results.map(result => {
           generatedHTML += `<div class="item">
           <img src="${result?.recipe?.image}" alt="receipe" />
           <div class="flex-container">
             <h2 class="item-title">${result?.recipe?.label}</h2>
             <a class="view-button" href="${result?.recipe?.url}" target="_blank">View Receipe</a>
           </div>
           <p class="item-data">Calories: ${result?.recipe?.calories?.toFixed(2)}</p>
           <p class="item-data">Diet Label: ${result?.recipe?.dietLabels.length > 0 ? result?.recipe?.dietLabels: 'No Label Found'}</p>
           <p class="item-data">Cusine Type: ${result?.recipe?.cuisineType[0].charAt(0).toUpperCase()+result?.recipe?.cuisineType[0].slice(1)}</p>
         </div>`
    })
    return searchResultDiv.insertAdjacentHTML("beforeend", generatedHTML);
}


searchForm.addEventListener('click', (e) => {
    e.preventDefault();
    searchQuery = inputValue.value;
    const baseURL= `https://api.edamam.com/api/recipes/v2?type=public&q=${searchQuery}&app_id=${APP_ID}&app_key=${APP_KEY}`;
    loadReceipe(baseURL);
    inputValue.value = '';
})


async function fetchReceipe(baseURL) {  
    const response = await fetch(baseURL);
    const data = await response.json();
    return data;
}


const getLastUseEle = () => {
 return document.querySelector(".search-result > .item:last-child")
};

const loadReceipe = (url) => {
  return new Promise((resolve, reject) => {
    fetchReceipe(url)
      .then((data) => {
        data &&
          data.hits &&
          generateHTML(data.hits);
        if (isPageLoad) {
          next = data?._links?.next?.href;      
          obseveLastUser();
          isPageLoad = false;
        }
        resolve("Completed Rendering");
      })
      .catch((error) => {
        reject(error);
      });
  });
};


const infScrollCallback = (entries, observer) => {
  const entry = entries[0];
  if (!entry.isIntersecting) return;
  loadReceipe(next)
    .then((resp) => {
      obseveLastUser();
    })
    .catch((error) => console.log(error));
  observer.unobserve(entry.target);
};

const infScrollObserver = new IntersectionObserver(infScrollCallback, {});

const obseveLastUser = () => {
  infScrollObserver.observe(getLastUseEle());
};
