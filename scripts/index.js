import { API_URL, debouncedFunction, SEARCH_DEBOUNCE_DELAY  } from '../scripts/core.js';

const favoritesContainer = document.getElementById('favorites-container');
const favoriteItemTemplate = document.getElementById('favorites-template');
const bagCountElement = document.getElementById('bag-count');
const searchInputElement = document.getElementById('search-text');
const searchIconElement = document.getElementById('search');
const removeIconElement = document.getElementById('remove');
const navigateElement = document.getElementById('navigate-back');

let categories = [];
let recipes = [];
let favorites = [];
let cartItemsCount = 0;

/**
 * Get foodfavorites data
 */
const getData = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    categories = data.categories || [];
    recipes = data.recipes || [];
    console.log(categories, recipes);
    getFavorites();
  } catch (error) {
    console.log(error);
  }
}

const onImageLoad = (event) => {
  // do something here
}

const setAttributesForGivenElement = (element, attributesObj) => {
  for (const key in attributesObj) {
    element.setAttribute(key, attributesObj[key]);
  }
}

const renderFavoriteFoodItems = (favoriteItem) => {
  // Main container item element
  const element = favoriteItemTemplate.content.cloneNode(true);
  const imageElement = element.querySelector('.item .item-pic img');
  setAttributesForGivenElement(imageElement, {
    src: 'https://images.unsplash.com/photo-1533621426782-ffea2d5a502e?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NXx8YnJlYWtmYXN0JTIwcGxhdHRlcnxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    alt: favoriteItem.name,
    title: favoriteItem.name,
    loading: 'lazy'
  });
  const queryStringFooter = '.item .item-footer';
  const spanName = element.querySelector(`${queryStringFooter} .details-name`);
  spanName.textContent = favoriteItem.name;
  const spanPrice = element.querySelector(`${queryStringFooter} .details-price`);
  spanPrice.textContent = `₹${favoriteItem.price}`;

  // Button - Reorder
  const reorderBtn = element.querySelector(`${queryStringFooter} .reorder`);
  reorderBtn.textContent = 'REORDER';

  const updateItemContainer = element.querySelector(`${queryStringFooter} .update-item`);
  const decrementBtn = element.querySelector(`${queryStringFooter} .update-item .decrement`);
  const incrementBtn = element.querySelector(`${queryStringFooter} .update-item .increment`);
  const foodItemCountElement = element.querySelector(`${queryStringFooter} .update-item .item-count`);

  // Clicking incremement button should keep decreasing item count
  // If it reaches 1, then hide this containe and show reorder button
  decrementBtn.addEventListener('click', () => {
    if (favoriteItem.itemCount === 1) {
      favoriteItem.itemCount = 0;
      updateItemContainer.classList.add('hidden');
      reorderBtn.hidden = false;
    } else {
      favoriteItem.itemCount -= 1;
    }
    foodItemCountElement.textContent = favoriteItem.itemCount;
    decrementGlobalCartCount();
  });

  // Clicking incremement button should keep increasing item count
  incrementBtn.addEventListener('click', () => {
    favoriteItem.itemCount += 1;
    foodItemCountElement.textContent = favoriteItem.itemCount;
    incrementGlobalCartCount();
  })
  // Clicking reorder button should hide the Reorder button
  // and start the increment counter
  reorderBtn.addEventListener('click', () => {
    if (favoriteItem.itemCount == null) {
      favoriteItem.itemCount = 0;
    }
    favoriteItem.itemCount += 1;
    reorderBtn.hidden = true;
    updateItemContainer.classList.remove('hidden');
    incrementGlobalCartCount();
  });
  return element.querySelector('.item');
}

function incrementGlobalCartCount() {
  cartItemsCount += 1;
}

function decrementGlobalCartCount() {
  if (cartItemsCount > 0) {
    cartItemsCount -= 1;
  }
}

const getFavorites = () => {
  favorites = recipes.filter(recipe => recipe.isFavourite);
  console.log(favorites);
  favorites.forEach(favoriteItem => {
    const elementItem = renderFavoriteFoodItems(favoriteItem);
    favoritesContainer.appendChild(elementItem);
  });
}


const clearItemsContainer = () => {

}

const searchQueryFunction = (event, textFromClick) => {
  let query = textFromClick || (event ? event.target.value: null);
  query = query.trim();
  if (query.length) {
    removeIconElement.hidden = false;
    // Clear DOM nodes
    clearItemsContainer();
    const filteredItems = recipes.filter(recipe => recipe.name.includes(query));
    // render filteredItems
    console.log(filteredItems);
  } else {
    removeIconElement.hidden = true;
    // render all items
  }
}

searchIconElement.addEventListener('click', () => {
  const searchQuery = searchInputElement.value;
  if (searchQuery && searchQuery.length) {
    searchQueryFunction(null, searchQuery);
  }
});

removeIconElement.addEventListener('click', () => {
  searchInputElement.value = null;
  // render all items
  removeIconElement.hidden = true;
});

const debouncedSearch = debouncedFunction(searchQueryFunction, SEARCH_DEBOUNCE_DELAY);
searchInputElement.addEventListener('input', debouncedSearch)

getData();