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
  featuredProducts: "featuredProducts",
  newReleases: "newReleases",
  bestSellers: "bestSellers",
  createProduct: "createProduct",
  updateProduct: "updateProduct",
  deleteProductImage: "deleteProductImage",
  deleteProduct: "deleteProduct",
  repositionProductImage: "repositionProductImage",
  uploadProductImage: "uploadProductImage",
  getProductCategories: "getProductCategories",
  updateProductCategories: "updateProductCategories",
}

export const urls = {
  allProducts: `${baseUrl}/all-products`,
  productsByType: `${baseUrl}/products?category=`,
  singleProduct: `${baseUrl}/get-product`,
  carouselImages: `${baseUrl}/carousel-images`,
  productImages: `${baseUrl}/product-images`,
  conceptProducts: `${baseUrl}/concept-products`,
  featuredProducts: `${baseUrl}/featured-products`,
  newReleases: `${baseUrl}/new-products`,
  bestSellers: `${baseUrl}/best-seller-products`,
  createProduct: `${baseUrl}/create-product`,
  updateProduct: `${baseUrl}/update-product`,
  deleteProductImage: `${baseUrl}/delete-product-image`,
  deleteProduct: `${baseUrl}/delete-product`,
  repositionProductImage: `${baseUrl}/reposition-product-image`,
  uploadProductImage: `${baseUrl}/upload-product-image`,
  getProductCategories: `${baseUrl}/product-categories`,
  updateProductCategories: `${baseUrl}/update-product-categories`,
}

export const requestByType = async (productRequestType, property=null) => {
  Logger.info(`Fetching ${productRequestType} with property: ${property}`, TITLE_TAGS.PRODUCT_API);
  const url = urls[productRequestType];
  let response = null;
  try { 
    switch (productRequestType) {
      case 'allProducts':
        response = await axios.get(url);
        break;
      case "productsByType":
        if(property === 'plastik-siseler') property = 'sise';
        if(property === 'plastik-kavanozlar') property = 'kavanoz';
        if(property === 'konsept-urunler') property = "konsept";
        if(property === "hemen") property = "hemen";
        response = await axios.get(`${url}${property}`);
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
      case "featuredProducts":
        response = await axios.get(url);
        break;
      case "newReleases":
        response = await axios.get(url);
        break;
      case "bestSellers":
        response = await axios.get(url);
        break;
      case "createProduct":
        response = await axios.post(url, {
          headers: {
            'Content-Type': 'application/json',
          },
          data: property
        });
        break;
      case "updateProduct":
        response = await axios.put(`${url}?id=${property.id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          data: property
        });
        break;
      case "deleteProduct":
        response = await axios.delete(`${url}?id=${property}`);
        break;
      case "deleteProductImage":
        response = await axios.delete(`${url}?productId=${property.productId}&imageDriveId=${property.imageDriveId}`);
        break;
      case "repositionProductImage":
        response = await axios.put(`${url}?productId=${property.productId}&imageDriveId=${property.imageDriveId}&newIndex=${property.newIndex}`);
        break;
      case "uploadProductImage":
        response = await axios.post(url, property);
        break;
      case "getProductCategories":
        response = await axios.get(url);
        break;
      case "updateProductCategories":
        response = await axios.put(url, {
          headers: {
            'Content-Type': 'application/json',
          },
          data: property
        });
        break;
      default:
        Logger.error(`Invalid product request type: ${productRequestType}`, TITLE_TAGS.PRODUCT_API);
        break;
    }
    return response;
  } catch (error) {
    Logger.error(`Error fetching ${productRequestType}: ERROR MESSAGE:\n${error}`, TITLE_TAGS.PRODUCT_API);
    return [];  
  }
  
}
