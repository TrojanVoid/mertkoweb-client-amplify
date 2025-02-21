import axios from "axios";

const {TITLE_TAGS, Logger} = require("../util/Logger");
const apiConfig = require("../config/ApiConfig");
const envMode = process.env.NODE_ENV;
const baseUrl = (envMode == "development" || envMode == "production") 
  ? apiConfig[envMode]["apiUrl"] 
  : apiConfig["production"]["apiUrl"];

export const types = {
  allProducts: "allProducts",
  singleProduct: "singleProduct",
  carouselImages: "carouselImages",
  productImages: "productImages",
  conceptProducts: "conceptProducts",
}

export const urls = {
  allProducts: `${baseUrl}/products`,
  singleProduct: `${baseUrl}/get-product`,
  carouselImages: `${baseUrl}/carousel-images`,
  productImages: `${baseUrl}/product-images`,
  conceptProducts: `${baseUrl}/concept-products`,
}

export const requestByType = async (productRequestType, property=null) => {
  Logger.log(`Fetching ${productRequestType} with property: ${property}`, TITLE_TAGS.PRODUCT_API);
  const url = urls[productRequestType];
  let response = null;
  try { 
    switch (productRequestType) {
      case "allProducts":
        response = await axios.get(url);
        break;
      case "singleProduct":
        response = await axios.get(`${url}/${property}`);
        break;
      case "carouselImages":
        response = await axios.get(url);
        break;
      case "productImages":
        response = await axios.get(`${url}/${property}`);
        break;
      case "conceptProducts":
        response = await axios.get(url);
        break;
      default:
        Logger.error(`Invalid product request type: ${productRequestType}`, TITLE_TAGS.PRODUCT_API);
        break;
    }
    return response;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];  
  }
  
}
