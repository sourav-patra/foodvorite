import { API_URL, debounce, SEARCH_DEBOUNCE_DELAY, DEFAULT_SECONDARY_COLOR, ICON_HIGHLIGHT_COLOR  } from '../scripts/core.js';

const mainContainerTempalte = document.getElementById('main-container');

const favoritesContainer = document.getElementById('favorites-container');
const foodItemTemplate = document.getElementById('food-item-template');
const bagCountElement = document.getElementById('bag-count');
const countIconSVGElement = document.querySelector('.cart svg path');
const searchInputElement = document.getElementById('search-text');
const searchIconElement = document.getElementById('search');
const removeIconElement = document.getElementById('remove');

const categoriesContainer = document.getElementById('categories');

const foodItemsContainer = document.getElementById('food-items-container');
const foodPageContainerElement = document.getElementById('food-page-container-wrapper');
const navigateElement = document.getElementById('navigate-back');

const pageViewFoodCartBtnElement = document.getElementById('selected-food-button');
const pageViewFoodCartCountDecrementElement = document.getElementById('selected-food-count-decrement');
const pageViewFoodCartCountIncrementElement = document.getElementById('selected-food-count-increment');

const noDishFoundElement = document.getElementById('no-dish');

let categories = [];
let recipes = [];
let favorites = [];
let cartItemsCount = 0;
let activeCategoryIndex = -1;


let selectedFoodItem;
let selectedFoodItemDetailsElement;

/**
 * interface for htmlTemplateConfig {
 * itemClass: string
 * itemImageClass: string
 * itemFooterClass
 * }
 */

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
    getFoodItems();
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

const incrementGlobalCartCount = () => {
  cartItemsCount += 1;
  updateBagCountElement();
}

const decrementGlobalCartCount = () => {
  if (cartItemsCount > 0) {
    cartItemsCount -= 1;
  }
  updateBagCountElement();
}

const updateBagCountElement = () => {
  if (cartItemsCount) {
    bagCountElement.textContent = cartItemsCount;
    bagCountElement.hidden = false;
    countIconSVGElement.setAttribute('fill', ICON_HIGHLIGHT_COLOR);
  } else {
    bagCountElement.textContent = 0;
    bagCountElement.hidden = true;
    countIconSVGElement.setAttribute('fill', DEFAULT_SECONDARY_COLOR);
  }
}

const getFavorites = () => {
  favorites = recipes.filter(recipe => recipe.isFavourite);
  favorites.forEach(favoriteItem => {
    const elementItem = renderFoodItem(favoriteItem, 'reorder');
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
      const previouslyActiveCategoryElement = categoriesContainer.children[activeCategoryIndex];
      previouslyActiveCategoryElement.classList.remove('active');
      // and set this one as active
      activeCategoryIndex = index;
      elementItem.classList.add('active');
    }
    // redraw items after this
    filterFoodItems();
  })
  return elementItem;
}

const getCategories = () => {
  categories.forEach((categoryItem, index) => {
    const elementItem = renderCategoryItem(categoryItem, index);
    categoriesContainer.appendChild(elementItem);
  });
}

const setFoodPageDetails = () => {
  mainContainerTempalte.hidden = true;
  foodPageContainerElement.classList.remove('hidden');
  navigateElement.classList.remove('hidden');

  // set dom details
  const pageViewFoodNameEl = document.getElementById('selected-food-name');
  const pageViewFoodPriceEl = document.getElementById('selected-food-price');
  const pageViewFoodCountContainerEl = document.getElementById('selected-food-update-item');
  const pageViewFoodCountCountEl = document.getElementById('selected-food-count');
  const pageViewFoodCategoryEl = document.getElementById('selected-food-category');
  const pageViewFoodRatingsEl = document.getElementById('selected-food-ratings');
  const pageViewFoodDetailsEl = document.getElementById('selected-food-details');

  pageViewFoodNameEl.textContent = selectedFoodItem.name; // set name
  pageViewFoodPriceEl.textContent = `₹${selectedFoodItem.price}`; // set price
  pageViewFoodCartBtnElement.textContent = selectedFoodItem.isFavourite ? 'REORDER' : 'ADD TO BAG'; // set button name
  pageViewFoodCategoryEl.textContent = `Category: ${selectedFoodItem.category}`; // set category
  const roundedRating = selectedFoodItem.rating.toFixed(1);
  pageViewFoodRatingsEl.textContent = `${roundedRating} Rating, (${selectedFoodItem.reviews} Reviews)`; // set ratings
  pageViewFoodDetailsEl.textContent = selectedFoodItem.details; // set details
  
  // If item count for the selected food is 0 or undefined, then show the 
  // usual button
  if (!selectedFoodItem.itemCount) {
    pageViewFoodCartBtnElement.hidden = false;
    if (!pageViewFoodCountContainerEl.classList.contains('hidden')) {
      pageViewFoodCountContainerEl.classList.add('hidden');
    }
  } else {
    pageViewFoodCartBtnElement.hidden = true;
    if (pageViewFoodCountContainerEl.classList.contains('hidden')) {
      pageViewFoodCountContainerEl.classList.remove('hidden');
    }
    pageViewFoodCountCountEl.textContent = selectedFoodItem.itemCount;
  }

}

const recheckBaseSelectedFoodItemCount = () => {
  const refFoodItemCartBtnEl = selectedFoodItemDetailsElement.querySelector('.add-cart');
  const refFoodItemCountContainerEl = selectedFoodItemDetailsElement.querySelector('.update-item');
  const refFoodItemCountEl = selectedFoodItemDetailsElement.querySelector('.update-item .item-count');

  if (selectedFoodItem.itemCount && selectedFoodItem.itemCount > 0) {
    refFoodItemCartBtnEl.hidden = true;
    refFoodItemCountEl.textContent = selectedFoodItem.itemCount;
    refFoodItemCountContainerEl.classList.remove('hidden');
  } else {
    refFoodItemCartBtnEl.hidden = false;
    refFoodItemCountContainerEl.classList.add('hidden');
  }
}

const decreaseFoodItemCount = (foodItem, addToCartElement, foodItemCountContainerElement, foodItemCountElement) => {
  if (foodItem.itemCount === 1) {
    foodItem.itemCount = 0;
    foodItemCountContainerElement.classList.add('hidden');
    addToCartElement.hidden = false;
  } else {
    foodItem.itemCount -= 1;
    foodItemCountElement.textContent = foodItem.itemCount;
  }
  decrementGlobalCartCount();
}

const addFoodItemToCart = (foodItem, addToCartElement, foodItemCountContainerElement) => {
  if (foodItem.itemCount == null) {
    foodItem.itemCount = 0;
  }
  foodItem.itemCount = 1;
  addToCartElement.hidden = true;
  foodItemCountContainerElement.classList.remove('hidden');
  incrementGlobalCartCount();
}

const incrementFoodItemCount = (foodItem, foodItemCountElement) => {
  foodItem.itemCount += 1;
  foodItemCountElement.textContent = foodItem.itemCount;
  incrementGlobalCartCount();
}

const renderFoodItem = (foodItem, btnName) => {
  // Main container item element
  const element = foodItemTemplate.content.cloneNode(true);
  const imageElement = element.querySelector('.item .image img');
  setAttributesForGivenElement(imageElement, {
    src: 'https://images.unsplash.com/photo-1533621426782-ffea2d5a502e?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NXx8YnJlYWtmYXN0JTIwcGxhdHRlcnxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    alt: foodItem.name,
    title: foodItem.name,
    loading: 'lazy'
  });

  const queryStringFooter = '.item .description';
  const baseFoodDetailsElement = element.querySelector(queryStringFooter);
  const spanName = element.querySelector(`${queryStringFooter} .details-name`);
  spanName.textContent = foodItem.name;
  const spanPrice = element.querySelector(`${queryStringFooter} .details-price`);
  spanPrice.textContent = `₹${foodItem.price}`;

  // Button - Reorder / Add to Bag
  const addToCartElement = element.querySelector(`${queryStringFooter} .add-cart`);
  addToCartElement.textContent = btnName;

  const updateItemContainer = element.querySelector(`${queryStringFooter} .update-item`);
  const decrementBtn = element.querySelector(`${queryStringFooter} .update-item .decrement`);
  const incrementBtn = element.querySelector(`${queryStringFooter} .update-item .increment`);
  const foodItemCountElement = element.querySelector(`${queryStringFooter} .update-item .item-count`);

  // Check if already added to bag
  if (foodItem.itemCount && foodItem.itemCount > 0) {
    addToCartElement.hidden = true;
    updateItemContainer.classList.remove('hidden');
    foodItemCountElement.textContent = foodItem.itemCount;
  } else {
    foodItemCountElement.textContent = 1;
  }

  imageElement.addEventListener('click', () => {
    selectedFoodItem = foodItem;
    selectedFoodItemDetailsElement = baseFoodDetailsElement;
    setFoodPageDetails();
  });

  // Clicking incremement button should keep decreasing item count
  // If it reaches 1, then hide this containe and show reorder button
  decrementBtn.addEventListener('click', () => {
    decreaseFoodItemCount(foodItem, addToCartElement, updateItemContainer, foodItemCountElement)
  });

  // Clicking incremement button should keep increasing item count
  incrementBtn.addEventListener('click', () => {
    incrementFoodItemCount(foodItem, foodItemCountElement);
  })
  // Clicking reorder button should hide the Reorder button
  // and start the increment counter
  addToCartElement.addEventListener('click', () => {
    addFoodItemToCart(foodItem, addToCartElement, updateItemContainer)
  });
  return element.querySelector('.item');
}

const clearCurrentFoodItemsDOM = () => {
  const foodItemElements = foodItemsContainer.children;
  for (let i = foodItemElements.length - 1; i >= 0; i--) {
    foodItemsContainer.removeChild(foodItemElements[i]);
  }
}

const getFoodItems = (filteredArray) => {
  if (foodItemsContainer.children.length) {
    clearCurrentFoodItemsDOM();
  }
  const itemsArray = filteredArray || recipes;
  itemsArray.forEach(foodItem => {
    const element = renderFoodItem(foodItem, 'add to bag');
    foodItemsContainer.appendChild(element);
  })
}

/**
 * Globla filter function applicable when either
 * 1. search input is provided
 * 2. a category is chosen or removed
 */
const filterFoodItems = () => {
  try {
    const searchQuery = searchInputElement.value;
    let filteredItems;
    if (searchQuery && searchQuery.length) {
      filteredItems = recipes.filter(recipe => recipe.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (activeCategoryIndex > -1) {
      const newFilteredItems = filteredItems || recipes;
      filteredItems = newFilteredItems.filter(recipe => recipe.category === categories[activeCategoryIndex].name);
    }
    if (filterFoodItems && !filterFoodItems.length) {
      noDishFoundElement.hidden = false;
    } else {
      noDishFoundElement.hidden = true;
    }
    getFoodItems(filteredItems);
  } catch (error) {
    console.log(error);
  }
}

searchIconElement.addEventListener('click', () => {
  const searchQuery = searchInputElement.value;
  // Only search if there's some value in the text box
  if (searchQuery && searchQuery.length) {
    filterFoodItems();
  }
});

const searchInputFunction = (event) => {
  let query = event.target.value;
  query = query ? query.trim() : null;
  if (query) {
    removeIconElement.hidden = false;
  } else {
    removeIconElement.hidden = true;
  }
  searchInputElement.value = query;
  // if Enter key is pressed
  if (event.keyCode === 13) {
    filterFoodItems();
  }
}

// Clicking incremement button should keep decreasing item count
// If it reaches 1, then hide this containe and show reorder button
pageViewFoodCartCountDecrementElement.addEventListener('click', () => {
  decreaseFoodItemCount(
    selectedFoodItem,
    pageViewFoodCartBtnElement,
    document.getElementById('selected-food-update-item'),
    document.getElementById('selected-food-count')
  );
  recheckBaseSelectedFoodItemCount();
});

// Clicking incremement button should keep increasing item count
pageViewFoodCartCountIncrementElement.addEventListener('click', () => {
  incrementFoodItemCount(
    selectedFoodItem,
    document.getElementById('selected-food-count')
  );
  recheckBaseSelectedFoodItemCount();
})
// Clicking reorder button should hide the Reorder button
// and start the increment counter
pageViewFoodCartBtnElement.addEventListener('click', () => {
  addFoodItemToCart(
    selectedFoodItem,
    pageViewFoodCartBtnElement,
    document.getElementById('selected-food-update-item')
  );
  recheckBaseSelectedFoodItemCount();
});

removeIconElement.addEventListener('click', () => {
  searchInputElement.value = null;
  removeIconElement.hidden = true;
  filterFoodItems();
});

const debouncedFunction = debounce(searchInputFunction, SEARCH_DEBOUNCE_DELAY);
searchInputElement.addEventListener('keyup', debouncedFunction);

navigateElement.addEventListener('click', () => {
  mainContainerTempalte.hidden = false;
  foodPageContainerElement.classList.add('hidden');
  navigateElement.classList.add('hidden');
})

getData();