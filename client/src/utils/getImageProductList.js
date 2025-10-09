import * as _ from "lodash";
// funtion filter for take only image key
const isProductImage = (obj) => {
  // return _.findKey(obj, (value, key) => key === "images") !== undefined;
  return _.get(obj, "images", "not picture");
};

// module.exports = { isProductImage }; // Attention syntaxe export CommonJS
export { isProductImage }; //Syntaxe export ES6 à utiliser dans React
