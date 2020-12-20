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

export const API_URL = "http://temp.dash.zeta.in/food.php";
export const SEARCH_DEBOUNCE_DELAY = 200;
export const DEFAULT_SECONDARY_COLOR = "#ABABAB";
export const ICON_HIGHLIGHT_COLOR = "#FAA92A";

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