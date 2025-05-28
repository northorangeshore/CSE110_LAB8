// main.js

// CONSTANTS
const RECIPE_URLS = [
    'https://adarsh249.github.io/Lab8-Starter/recipes/1_50-thanksgiving-side-dishes.json',
    'https://adarsh249.github.io/Lab8-Starter/recipes/2_roasting-turkey-breast-with-stuffing.json',
    'https://adarsh249.github.io/Lab8-Starter/recipes/3_moms-cornbread-stuffing.json',
    'https://adarsh249.github.io/Lab8-Starter/recipes/4_50-indulgent-thanksgiving-side-dishes-for-any-holiday-gathering.json',
    'https://adarsh249.github.io/Lab8-Starter/recipes/5_healthy-thanksgiving-recipe-crockpot-turkey-breast.json',
    'https://adarsh249.github.io/Lab8-Starter/recipes/6_one-pot-thanksgiving-dinner.json',
];

// Run the init() function when the page has loaded
window.addEventListener('DOMContentLoaded', init);

// Starts the program, all function calls trace back here
async function init() {
  // initialize ServiceWorker
  initializeServiceWorker();
  // Get the recipes from localStorage
  let recipes;
  try {
    recipes = await getRecipes();
  } catch (err) {
    console.error(err);
  }
  // Add each recipe to the <main> element
  addRecipesToDocument(recipes);
}

/**
 * Detects if there's a service worker, then loads it and begins the process
 * of installing it and getting it running
 */
function initializeServiceWorker() {
  // B1. Check if service workers are supported
  if ('serviceWorker' in navigator) {
    // B2. Listen for the window's 'load' event
    window.addEventListener('load', () => {
      // B3. Register the service worker
      navigator.serviceWorker.register('./sw.js')
        .then((registration) => {
          // B4. Successfully registered
          console.log('Service Worker registered successfully:', registration);
        })
        .catch((error) => {
          // B5. Failed to register
          console.error('Service Worker registration failed:', error);
        });
    });
  } else {
    console.warn('Service Workers are not supported in this browser.');
  }
}

/**
 * Reads 'recipes' from localStorage and returns an array of
 * all of the recipes found (parsed, not in string form). If
 * nothing is found in localStorage, network requests are made to all
 * of the URLs in RECIPE_URLs, an array is made from those recipes, that
 * array is saved to localStorage, and then the array is returned.
 * @returns {Array<Object>} An array of recipes found in localStorage
 */
// Assume RECIPE_URLS is defined globally, like:
// const RECIPE_URLS = ['https://example.com/recipe1.json', 'https://example.com/recipe2.json'];

async function getRecipes() {
  // A1. Check local storage for existing recipes
  const localData = localStorage.getItem('recipes');
  if (localData) {
    return JSON.parse(localData);
  }

  // A2. Create an empty array to hold the fetched recipes
  const recipes = [];

  // A3. Return a new Promise
  return new Promise(async (resolve, reject) => {
    // A4. Loop through each URL in RECIPE_URLS
    for (let i = 0; i < RECIPE_URLS.length; i++) {
      const url = RECIPE_URLS[i];
      try {
        // A6. Fetch the URL
        const response = await fetch(url);

        // A7. Retrieve the JSON
        const recipe = await response.json();

        // A8. Add the recipe to the array
        recipes.push(recipe);

        // A9. Check if we've fetched all recipes
        if (recipes.length === RECIPE_URLS.length) {
          // Save to localStorage
          localStorage.setItem('recipes', JSON.stringify(recipes));
          // Resolve the promise
          resolve(recipes);
        }
      } catch (error) {
        // A10. Log any errors
        console.error('Failed to fetch recipe:', error);
        // A11. Reject the promise
        reject(error);
        break; // exit the loop if one fails
      }
    }
  });
}

/**
 * Takes in an array of recipes, converts it to a string, and then
 * saves that string to 'recipes' in localStorage
 * @param {Array<Object>} recipes An array of recipes
 */
function saveRecipesToStorage(recipes) {
  localStorage.setItem('recipes', JSON.stringify(recipes));
}

/**
 * Takes in an array of recipes and for each recipe creates a
 * new <recipe-card> element, adds the recipe data to that card
 * using element.data = {...}, and then appends that new recipe
 * to <main>
 * @param {Array<Object>} recipes An array of recipes
 */
function addRecipesToDocument(recipes) {
  if (!recipes) return;
  let main = document.querySelector('main');
  recipes.forEach((recipe) => {
    let recipeCard = document.createElement('recipe-card');
    recipeCard.data = recipe;
    main.append(recipeCard);
  });
}