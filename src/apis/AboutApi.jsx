import axios from "axios";

const {TITLE_TAGS, Logger} = require("../util/Logger");
const apiConfig = require("../config/ApiConfig");
const envMode = process.env.NODE_ENV;
const baseUrl = (envMode == "development" || envMode == "production") 
  ? apiConfig[envMode]["apiUrl"] 
  : apiConfig["production"]["apiUrl"];

export const types = {
  getAbout: "aboutData",
  updateAbout: "updateAbout",
  getAboutImages: "aboutImages",
  uploadAboutImage: "uploadAboutImage",
  deleteAllAboutImages: "deleteAllAboutImages",
}

const urls = {
  getAbout: `${baseUrl}/about-data`,
  updateAbout: `${baseUrl}/update-about-data`,
  getAboutImages: `${baseUrl}/about-images`,
  uploadAboutImage: `${baseUrl}/upload-about-image`,
  deleteAllAboutImages: `${baseUrl}/delete-all-about-images`,
}

export const requestByType = async (type, property=null) => {
  Logger.info("Fetching about data", TITLE_TAGS.ABOUT_API);
  if(!type){
    Logger.error("Invalid about request type", TITLE_TAGS.ABOUT_API);
    return [];
  }
  let response = null;
  try {
    switch(type){
      case types.updateAbout:
        if(!property){
          Logger.error("Invalid about data", TITLE_TAGS.ABOUT_API);
          return [];
        }
        response = await axios.put(`${urls.updateAbout}`, 
          {
            headers: {
              'Content-Type': 'application/json',
            }, 
            data: property
          },
        );
        break;
      case types.getAbout:
        response = await axios.get(urls.getAbout);
        break;
      case types.getAboutImages:
        response = await axios.get(urls.getAboutImages);
        break;
      case types.uploadAboutImage:
        if(!property){
          Logger.error("Invalid image data", TITLE_TAGS.ABOUT_API);
          return [];
        }
        response = await axios.post(urls.uploadAboutImage, property);
        break;
      case types.deleteAllAboutImages:
        response = await axios.delete(urls.deleteAllAboutImages, {data: property});
        break;
      default:
        Logger.error(`Invalid about request type: ${type}`, TITLE_TAGS.ABOUT_API);
        break;
    }
    return response;
  } catch (error) {
    Logger.error(`Error fetching about data: ERROR MESSAGE:\n${error}`, TITLE_TAGS.ABOUT_API);
    return [];
  }
}