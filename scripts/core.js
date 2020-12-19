/**
 * Function to debounce a given callback function
 * by `delay` milliseconds
 * @param {function} callback Given callback function
 * @param {number} delay Delay in milliseconds
 */
export function debouncedFunction (callback, delay) {
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