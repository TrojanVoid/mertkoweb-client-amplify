import axios from "axios";

const {TITLE_TAGS, Logger} = require("../util/Logger");
const apiConfig = require("../config/ApiConfig");
const envMode = process.env.NODE_ENV;
const baseUrl = (envMode == "development" || envMode == "production") 
  ? apiConfig[envMode]["apiUrl"] 
  : apiConfig["production"]["apiUrl"];

export const types = {
  updatePagesMeta: "updatePagesMeta",
  getPagesMeta: "getPagesMeta",
}

const urls = {
  updatePagesMeta: `${baseUrl}/update-meta-data`,
  getPagesMeta: `${baseUrl}/get-meta-data`,
}

export const requestByType = async (type, property=null) => {
  Logger.log("Fetching META data", TITLE_TAGS.META_API);
  if(!type){
    Logger.error("Invalid META request type", TITLE_TAGS.META_API);
    return [];
  }
  let response = null;
  try {
    switch(type){
      case types.updatePagesMeta:
        if(!property){
          Logger.error("Invalid META data", TITLE_TAGS.META_API);
          return [];
        }
        response = await axios.put(`${urls.updatePagesMeta}`, 
          {
            headers: {
              'Content-Type': 'application/json',
            }, 
            data: property
          },
        );
        break;
      case types.getPagesMeta:
        response = await axios.get(urls.getPagesMeta);
        break;
      default:
        Logger.error(`Invalid META request type: ${type}`, TITLE_TAGS.META_API);
        break;
    }
    return response;
  } catch (error) {
    Logger.error(`Error fetching META data: ERROR MESSAGE:\n${error}`, TITLE_TAGS.META_API);
    return [];
  }
}