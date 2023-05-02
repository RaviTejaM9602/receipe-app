//https://developer.edamam.com/edamam-docs-recipe-api
const searchForm = document.querySelector('form');
const inputValue = document.querySelector('form > input')
const searchResultDiv = document.querySelector('.search-result');
const container = document.querySelector('.container');
let searchQuery = '';
const APP_ID = 'fe917a7d';
const APP_KEY = 'dbbfadc4f4049de4dfb35d6660423d9a';
let prev = 0;

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
    return searchResultDiv.innerHTML = generatedHTML;
}


searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    searchQuery = e.target.querySelector('input').value;
    console.log(searchQuery);
    fetchReceipe(searchQuery);
    e.target.querySelector('input').value = '';
})

async function fetchReceipe(receipe) {
    const baseURL= `https://api.edamam.com/api/recipes/v2?type=public&q=${receipe}&app_id=${APP_ID}&app_key=${APP_KEY}`;
    const response = await fetch(baseURL);
    const data = await response.json();
    console.log(data)
    generateHTML(data.hits);
}


