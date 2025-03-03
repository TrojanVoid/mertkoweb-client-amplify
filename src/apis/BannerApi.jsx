import axios from "axios";

const {TITLE_TAGS, Logger} = require("../util/Logger");
const apiConfig = require("../config/ApiConfig");
const envMode = process.env.NODE_ENV;
const baseUrl = (envMode == "development" || envMode == "production") 
  ? apiConfig[envMode]["apiUrl"] 
  : apiConfig["production"]["apiUrl"];

export const types = {
  updateBanner: "updateBanner",
  getBanner: "bannerData",
}

const urls = {
  updateBanner: `${baseUrl}/update-banner-data`,
  getBanner: `${baseUrl}/banner-data`,
}

export const requestByType = async (type, property=null) => {
  Logger.log("Fetching banner data", TITLE_TAGS.BANNER_API);
  if(!type){
    Logger.error("Invalid banner request type", TITLE_TAGS.BANNER_API);
    return [];
  }
  let response = null;
  try {
    switch(type){
      case types.updateBanner:
        if(!property){
          Logger.error("Invalid banner data", TITLE_TAGS.BANNER_API);
          return [];
        }
        response = await axios.put(`${urls.updateBanner}`, 
          {
            headers: {
              'Content-Type': 'application/json',
            }, 
          },
          {
            data: property
          },
        );
        break;
      case types.getBanner:
        response = await axios.get(urls.getBanner);
        break;
      default:
        Logger.error(`Invalid banner request type: ${type}`, TITLE_TAGS.BANNER_API);
        break;
    }
    return response;
  } catch (error) {
    Logger.error(`Error fetching banner data: ERROR MESSAGE:\n${error}`, TITLE_TAGS.BANNER_API);
    return [];
  }
}