import { 
  API_URL,
  debounce,
  setAttributesForElement,
  SEARCH_DEBOUNCE_DELAY,
  DEFAULT_SECONDARY_COLOR,
  ICON_HIGHLIGHT_COLOR,
  FAVORITE_BTN_NAME,
  MAIN_FOOD_BTN_NAME,
  SAMPLE_IMAGE_APIS,
  Category,
  Recipe
} from './core.js';
import "../styles/scss/style.scss";
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
const favoritesLoadingElement = document.getElementById('favorites-loader');
const foodItemsLoadingElement = document.getElementById('food-items-loader');
const categoriesLoadingElement = document.getElementById('categories-loader');


// State management; resusable variables
let categories = []; // stores list of categories
let recipes = []; // stores list of all food items
let favorites = []; // stores favorite food items list
let cartItemsCount = 0; // store global bag items count
let activeCategoryIndex = -1; // stores active category index, default is -1


let selectedFoodItem; // stores selected food item object
let selectedFoodItemDetailsElement; // stores selected food item DOM Node for reference in page 2

/**
 * Function to fetch the inital data from API 
 * and render them in the DOM
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

/**
 * Function to increase the global bag count
 */
const incrementGlobalCartCount = () => {
  cartItemsCount += 1;
  updateBagCountElement();
}

/**
 * Function to decrease the global bag count
 */
const decrementGlobalCartCount = () => {
  if (cartItemsCount > 0) {
    cartItemsCount -= 1;
  }
  updateBagCountElement();
}

/**
 * Function to change the view when the bag count
 * transitions from non-zero integer to zero and vice-versa
 */
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

/**
 * Function to filter out the favorite items
 * from main food item list
 * using the flag `isFavourite`
 * NOTE: As it is not mentioned in the question, I deepcloned
 * the objects so that references are not carried from the main list
 * As a result, 'adding an item' to cart from main list won't reflect in 
 * the favourites list
 */
const getFavorites = () => {
  favorites = JSON.parse(JSON.stringify(recipes.filter(recipe => recipe.isFavourite)));
  favorites.forEach((favoriteItem, index) => {
    const elementItem = renderFoodItem(favoriteItem, index);
    favoritesContainer.appendChild(elementItem);
  });
  favoritesLoadingElement.style.display = "none";
}

/**
 * Function to render the DOM element for a category item
 * @param {Category} categoryItem 
 * @param {number} index 
 * @returns {HTMLElement}
 */
const renderCategoryItem = (categoryItem, index) => {
  // Main category card
  const elementItem = document.createElement('div');
  elementItem.classList.add('categories-item');
  // Image Wrapper
  const figureElement = document.createElement('figure');
  figureElement.classList.add('categories-item-icon');
  // Image element
  const imageElement = document.createElement('img');
  setAttributesForElement(imageElement, {
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

/**
 * Function render the DOM elements for all categories in the category list
 * Remove the loader once done
 */
const getCategories = () => {
  categories.forEach((categoryItem, index) => {
    const elementItem = renderCategoryItem(categoryItem, index);
    categoriesContainer.appendChild(elementItem);
  });
  categoriesLoadingElement.style.display = "none";
}

/**
 * Function to set the food item details in the 2nd page
 * on clicking the image on any food item in the 1st page
 */
const setFoodPageDetails = () => {
  mainContainerTempalte.hidden = true;
  foodPageContainerElement.classList.remove('hidden');
  navigateElement.classList.remove('hidden');

  // set dom details
  const pageViewFoodImageEl = document.getElementById('selected-food-image');
  setAttributesForElement(pageViewFoodImageEl, {
    src: selectedFoodItem.image,
    alt: selectedFoodItem.name,
    title: selectedFoodItem.name
  })
  const pageViewFoodNameEl = document.getElementById('selected-food-name');
  const pageViewFoodPriceEl = document.getElementById('selected-food-price');
  const pageViewFoodCountContainerEl = document.getElementById('selected-food-update-item');
  const pageViewFoodCountEl = document.getElementById('selected-food-count');
  const pageViewFoodCategoryEl = document.getElementById('selected-food-category');
  const pageViewFoodRatingsEl = document.getElementById('selected-food-ratings');
  const pageViewFoodDetailsEl = document.getElementById('selected-food-details');

  pageViewFoodNameEl.textContent = selectedFoodItem.name; // set name
  pageViewFoodPriceEl.textContent = `₹${selectedFoodItem.price}`; // set price
  pageViewFoodCartBtnElement.textContent = selectedFoodItem.isFavourite ? FAVORITE_BTN_NAME : MAIN_FOOD_BTN_NAME; // set button name
  pageViewFoodCategoryEl.textContent = `Category: ${selectedFoodItem.category}`; // set category
  const roundedRating = selectedFoodItem.rating.toFixed(1);
  pageViewFoodRatingsEl.textContent = `${roundedRating} Rating, (${selectedFoodItem.reviews} Reviews)`; // set ratings
  pageViewFoodDetailsEl.textContent = selectedFoodItem.details; // set details
  
  // If item count for the selected food is 0 or undefined, then show the 
  // usual button
  if (selectedFoodItem.itemCount && selectedFoodItem.itemCount > 0) {
    pageViewFoodCartBtnElement.hidden = true;
    if (pageViewFoodCountContainerEl.classList.contains('hidden')) {
      pageViewFoodCountContainerEl.classList.remove('hidden');
    }
    pageViewFoodCountEl.textContent = selectedFoodItem.itemCount;
  } else {
    pageViewFoodCartBtnElement.hidden = false;
    if (!pageViewFoodCountContainerEl.classList.contains('hidden')) {
      pageViewFoodCountContainerEl.classList.add('hidden');
    }
    pageViewFoodCountEl.textContent = 1;
  }

}

/**
 * An important method.
 * When the food item count is updated (by 'adding to cart')
 * in the second page, the same should be reflected in the food item card details
 * in the list in 1st page.
 * This function uses the stored element references, gets the element by query selecting
 * and updates the values accordingly
 */
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

/**
 * Function to decrease the food item count on clicking '-'
 * on any food item element's button
 * @param {Recipe} foodItem 
 * @param {HTMLElement} addToCartElement 
 * @param {HTMLElement} foodItemCountContainerElement 
 * @param {HTMLElement} foodItemCountElement 
 */
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

/**
 * Function to increase the food item count
 * whenever 'ADD TO BAG' or 'REORDER' is clicked
 * on any food item element
 * @param {Recipe} foodItem 
 * @param {HTMLElement} addToCartElement 
 * @param {HTMLElement} foodItemCountContainerElement 
 */
const addFoodItemToCart = (foodItem, addToCartElement, foodItemCountContainerElement) => {
  if (foodItem.itemCount == null) {
    foodItem.itemCount = 0;
  }
  foodItem.itemCount = 1;
  addToCartElement.hidden = true;
  foodItemCountContainerElement.classList.remove('hidden');
  incrementGlobalCartCount();
}

/**
 * Function to increase the food item count on clicking '+'
 * on any food item element's button
 * @param {Recipe} foodItem
 * @param {HTMLElement} foodItemCountElement 
 */
const incrementFoodItemCount = (foodItem, foodItemCountElement) => {
  foodItem.itemCount += 1;
  foodItemCountElement.textContent = foodItem.itemCount;
  incrementGlobalCartCount();
}

/**
 * Function to draw the food item element
 * for any food item object passed to the function
 * @param {Recipe} foodItem 
 * @param {number} index
 * @returns {HTMLElement}
 */
const renderFoodItem = (foodItem, index) => {
  // Main container item element
  // As FOOD IMAGES are not present, manually setting them here
  foodItem.image = SAMPLE_IMAGE_APIS[index];
  const element = foodItemTemplate.content.cloneNode(true);
  const imageElement = element.querySelector('.item .image img');
  setAttributesForElement(imageElement, {
    src: foodItem.image,
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
  addToCartElement.textContent = foodItem.isFavourite ? FAVORITE_BTN_NAME : MAIN_FOOD_BTN_NAME;

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

/**
 * Function to clear the food items DOM elements
 * whenever a filter is applied
 * Notice all the elements are not cleared.
 * The 1st child is actually the loader element, and we need it to show
 * latency whenever any filter is in process (assuming it done server-side)
 * @param {HTMLElement[]} foodItemElements 
 */
const clearCurrentFoodItemsDOM = (foodItemElements = []) => {
  for (let i = foodItemElements.length - 1; i > 0; i--) {
    foodItemsContainer.removeChild(foodItemElements[i]);
  }
}

/**
 * Function to get a list of filtered or original 
 * food items list and render the DOM elements for each food item
 * Before starting the rendering, toggle the loader element display
 * After the rendering, hide the loader again
 * @param {Recipe[]} filteredArray 
 */
const getFoodItems = (filteredArray) => {
  const foodItemElements = foodItemsContainer.children;
  if (foodItemElements && foodItemElements.length > 1) {
    clearCurrentFoodItemsDOM(foodItemElements);
  }
  foodItemsLoadingElement.style.display = "inherit";
  const itemsArray = filteredArray || recipes;
  itemsArray.forEach((foodItem, index) => {
    const element = renderFoodItem(foodItem, index);
    foodItemsContainer.appendChild(element);
  });
  foodItemsLoadingElement.style.display = "none";
  
}

/**
 * Global filter function applicable when either
 * 1. a search input is provided
 * 2. a category is chosen or removed
 * If the filtered items list is empty, then show
 * 'no-dish' element
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
    if (filteredItems && !filteredItems.length) {
      noDishFoundElement.hidden = false;
    } else {
      noDishFoundElement.hidden = true;
    }
    getFoodItems(filteredItems);
  } catch (error) {
    console.log(error);
  }
}

/**
 * Function to trim down input search value
 * to prevent prefixed and suffixed spaces
 * Accordingly, ecide whether to show remove icon or not
 * Also on pressing enter, the filter method is invoked
 * @param {KeyboardEvent} event 
 */
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

// Debounced function created by using debounce from core.js ad custom callback declared above
const debouncedFunction = debounce(searchInputFunction, SEARCH_DEBOUNCE_DELAY);



// ----------------------EVENT LISTENERS----------------------------//

// Search input text box event listener for keyup events
searchInputElement.addEventListener('keyup', debouncedFunction);

// Search icon event listener
searchIconElement.addEventListener('click', () => {
  const searchQuery = searchInputElement.value;
  // Only search if there's some value in the text box
  if (searchQuery && searchQuery.length) {
    filterFoodItems();
  }
});

// Remove search text icon event listner
removeIconElement.addEventListener('click', () => {
  searchInputElement.value = null;
  removeIconElement.hidden = true;
  filterFoodItems();
});

// 2nd page decrement count button
// Clicking decrement button should keep decreasing item count
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

// 2nd page increment count button
// Clicking incremement button should keep increasing item count
pageViewFoodCartCountIncrementElement.addEventListener('click', () => {
  incrementFoodItemCount(
    selectedFoodItem,
    document.getElementById('selected-food-count')
  );
  recheckBaseSelectedFoodItemCount();
});

// 2nd page add to cart / reorder button
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

// Event listener for navigating back to 1st page
navigateElement.addEventListener('click', () => {
  mainContainerTempalte.hidden = false;
  foodPageContainerElement.classList.add('hidden');
  navigateElement.classList.add('hidden');
})

// Init function, fetch all data
getData();