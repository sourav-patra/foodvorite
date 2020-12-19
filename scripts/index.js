import { API_URL, debouncedFunction, SEARCH_DEBOUNCE_DELAY  } from '../scripts/core.js';

const favoritesContainer = document.getElementById('favorites-container');
const favoriteItemTemplate = document.getElementById('favorites-template');
const bagCountElement = document.getElementById('bag-count');
const searchInputElement = document.getElementById('search-text');
const searchIconElement = document.getElementById('search');
const removeIconElement = document.getElementById('remove');

const categoriesElement = document.getElementById('categories');
const navigateElement = document.getElementById('navigate-back');

let categories = [];
let recipes = [];
let favorites = [];
let cartItemsCount = 0;
let activeCategoryIndex = -1;

/**
 * Get foodfavorites data
 */
const getData = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    categories = data.categories || [];
    recipes = data.recipes || [];
    getFavorites();
    getCategories();
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

const renderFavoriteFoodItem = (favoriteItem) => {
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
      foodItemCountElement.textContent = favoriteItem.itemCount;
    }
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
  favorites.forEach(favoriteItem => {
    const elementItem = renderFavoriteFoodItem(favoriteItem);
    favoritesContainer.appendChild(elementItem);
  });
}

const renderCategoryItem = (categoryItem, index) => {
  // Main category card
  const elementItem = document.createElement('div');
  elementItem.classList.add('categories-item');
  // Image Wrapper
  const figureElement = document.createElement('figure');
  figureElement.classList.add('categories-item-icon');
  // Image element
  const imageElement = document.createElement('img');
  setAttributesForGivenElement(imageElement, {
    src: categoryItem.image,
    alt: categoryItem.name,
    title: categoryItem.name
  })
  figureElement.appendChild(imageElement);
  // Name of the category
  const imageSpanElement = document.createElement('span');
  imageSpanElement.classList.add('categories-item-name');
  imageSpanElement.textContent = categoryItem.name;
  // Add the children to the parent item element
  elementItem.appendChild(figureElement);
  elementItem.appendChild(imageSpanElement);

  elementItem.addEventListener('click', () => {
    // If there's no previously active index, then set new
    if (activeCategoryIndex === -1) {
      activeCategoryIndex = index;
      elementItem.classList.add('active');
      // if the same item was selected as active earlier
      // then deselect it
    } else if (activeCategoryIndex === index) {
      activeCategoryIndex = -1;
      elementItem.classList.remove('active');
    } else {
      // if some other category was active
      // then deselect it
      const previouslyActiveCategoryElement = categoriesElement.children[activeCategoryIndex];
      previouslyActiveCategoryElement.classList.remove('active');
      // and set this one as active
      activeCategoryIndex = index;
      elementItem.classList.add('active');
    }
    // redraw items after this
  })
  return elementItem;
}

const getCategories = () => {
  categories.forEach((categoryItem, index) => {
    const elementItem = renderCategoryItem(categoryItem, index);
    categoriesElement.appendChild(elementItem);
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