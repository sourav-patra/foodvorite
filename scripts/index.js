import { API_URL, debouncedFunction, SEARCH_DEBOUNCE_DELAY, DEFAULT_SECONDARY_COLOR, ICON_HIGHLIGHT_COLOR  } from '../scripts/core.js';

const favoritesContainer = document.getElementById('favorites-container');
const foodItemTemplate = document.getElementById('food-item-template');
const bagCountElement = document.getElementById('bag-count');
const countIconSVGElement = document.querySelector('.cart svg path');
const searchInputElement = document.getElementById('search-text');
const searchIconElement = document.getElementById('search');
const removeIconElement = document.getElementById('remove');

const categoriesContainer = document.getElementById('categories');

const foodItemsContainer = document.getElementById('food-items-container');
const navigateElement = document.getElementById('navigate-back');

let categories = [];
let recipes = [];
let favorites = [];
let cartItemsCount = 0;
let activeCategoryIndex = -1;

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
    // render highlighted state;
  } else {
    bagCountElement.textContent = 0;
    bagCountElement.hidden = true;
    countIconSVGElement.setAttribute('fill', DEFAULT_SECONDARY_COLOR);
    // render default state
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
    renderFilteredItemsBasedOnCategory();
  })
  return elementItem;
}

const getCategories = () => {
  categories.forEach((categoryItem, index) => {
    const elementItem = renderCategoryItem(categoryItem, index);
    categoriesContainer.appendChild(elementItem);
  });
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
  }

  // Clicking incremement button should keep decreasing item count
  // If it reaches 1, then hide this containe and show reorder button
  decrementBtn.addEventListener('click', () => {
    if (foodItem.itemCount === 1) {
      foodItem.itemCount = 0;
      updateItemContainer.classList.add('hidden');
      addToCartElement.hidden = false;
    } else {
      foodItem.itemCount -= 1;
      foodItemCountElement.textContent = foodItem.itemCount;
    }
    decrementGlobalCartCount();
  });

  // Clicking incremement button should keep increasing item count
  incrementBtn.addEventListener('click', () => {
    foodItem.itemCount += 1;
    foodItemCountElement.textContent = foodItem.itemCount;
    incrementGlobalCartCount();
  })
  // Clicking reorder button should hide the Reorder button
  // and start the increment counter
  addToCartElement.addEventListener('click', () => {
    if (foodItem.itemCount == null) {
      foodItem.itemCount = 0;
    }
    foodItem.itemCount += 1;
    addToCartElement .hidden = true;
    updateItemContainer.classList.remove('hidden');
    incrementGlobalCartCount();
  });
  return element.querySelector('.item');
}

const clearCurrentFoodItemsDOM = () => {
  const foodItemElements = foodItemsContainer.children;
  for (let i = foodItemElements.length - 1; i >= 0; i--) {
    foodItemsContainer.removeChild(foodItemElements[i]);
  }
}

const renderFilteredItemsBasedOnCategory = () => {
  const selectedCategory = categories[activeCategoryIndex];
  let filteredItems;
  if (selectedCategory) {
    filteredItems = recipes.filter(recipe => recipe.category === selectedCategory.name);
  }
  getFoodItems(filteredItems);
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

const searchQueryFunction = (event, textFromClick) => {
  try {
    let query = textFromClick || (event ? event.target.value: null);
    query = query.trim().toLowerCase();
    let filteredItems;
    if (query.length) {
      removeIconElement.hidden = false;
      filteredItems = recipes.filter(recipe => recipe.name.toLowerCase().includes(query));
    } else {
      removeIconElement.hidden = true;
    }
    getFoodItems(filteredItems);
  } catch (error) {
    console.log(error);
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
  removeIconElement.hidden = true;
  getFoodItems();
});

const debouncedSearch = debouncedFunction(searchQueryFunction, SEARCH_DEBOUNCE_DELAY);
searchInputElement.addEventListener('input', debouncedSearch)

getData();