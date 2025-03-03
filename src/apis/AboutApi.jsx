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
}

const urls = {
  getAbout: `${baseUrl}/about-data`,
  updateAbout: `${baseUrl}/update-about-data`,
}

export const requestByType = async (type, property=null) => {
  Logger.log("Fetching about data", TITLE_TAGS.ABOUT_API);
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