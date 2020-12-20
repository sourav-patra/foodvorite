/**
 * Function to debounce a given callback function
 * by `delay` milliseconds
 * @param {function} callback Given callback function
 * @param {number} delay Delay in milliseconds
 */
export function debounce (callback, delay) {
  let timeOut;
  return function() {
    let context = this, args = arguments;
    clearTimeout(timeOut);
    timeOut = setTimeout(() => {
      callback.apply(context, args)
    }, delay)
  }
}

/**
 * Function to set the attributes for any given HTML Element
 * @param {HTMLElement} element 
 * @param {any} attributesObj 
 */
export const setAttributesForElement = (element, attributesObj) => {
  for (const key in attributesObj) {
    element.setAttribute(key, attributesObj[key]);
  }
}

export const API_URL = "http://temp.dash.zeta.in/food.php";
export const SEARCH_DEBOUNCE_DELAY = 200;
export const DEFAULT_SECONDARY_COLOR = "#ABABAB";
export const ICON_HIGHLIGHT_COLOR = "#FAA92A";
export const FAVORITE_BTN_NAME = "REORDER";
export const MAIN_FOOD_BTN_NAME = "ADD TO BAG";

export const SAMPLE_IMAGE_APIS = [
  'https://images.unsplash.com/photo-1512654448383-47b2fe224e44?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
  'https://images.unsplash.com/photo-1559753491-c7db50a61c74?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
  'https://images.unsplash.com/photo-1589942151968-89bfe5d60c61?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
  'https://images.unsplash.com/photo-1562413255-16d008a3532b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
  'https://images.unsplash.com/photo-1512654448383-47b2fe224e44?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
  'https://images.unsplash.com/photo-1559753491-c7db50a61c74?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
  'https://images.unsplash.com/photo-1589942151968-89bfe5d60c61?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
  'https://images.unsplash.com/photo-1562413255-16d008a3532b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
  'https://images.unsplash.com/photo-1512654448383-47b2fe224e44?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
  'https://images.unsplash.com/photo-1559753491-c7db50a61c74?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
  'https://images.unsplash.com/photo-1589942151968-89bfe5d60c61?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
  'https://images.unsplash.com/photo-1562413255-16d008a3532b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
  'https://images.unsplash.com/photo-1512654448383-47b2fe224e44?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
  'https://images.unsplash.com/photo-1559753491-c7db50a61c74?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
  'https://images.unsplash.com/photo-1589942151968-89bfe5d60c61?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
  'https://images.unsplash.com/photo-1562413255-16d008a3532b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
]

export class Category {
  constructor(name, image) {
    this.name = name || null;
    this.image = image || null;
  }
}

export class Recipe extends Category {
  constructor(name, image, price, category, rating, reviews, details, isFavourite, itemCount) {
    super(name, image);
    this.price = price || null;
    this.category = category || null;
    this.rating = rating || null;
    this.reviews = reviews || null;
    this.details = details || null;
    this.isFavourite = isFavourite || false;
    this.itemCount = itemCount || 0
  }
}