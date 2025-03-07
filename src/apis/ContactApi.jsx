import axios from "axios";

const {TITLE_TAGS, Logger} = require("../util/Logger");
const apiConfig = require("../config/ApiConfig");
const envMode = process.env.NODE_ENV;
const baseUrl = (envMode == "development" || envMode == "production") 
  ? apiConfig[envMode]["apiUrl"] 
  : apiConfig["production"]["apiUrl"];

export const types = {
  getContact: "contactData",
  updateContact: "updateContact",
}

const urls = {
  getContact: `${baseUrl}/contact-data`,
  updateContact: `${baseUrl}/update-contact-data`,
}

export const requestByType = async (type, property=null) => {
  Logger.log("Fetching contact data", TITLE_TAGS.CONTACT_API);
  if(!type){
    Logger.error("Invalid contact request type", TITLE_TAGS.CONTACT_API);
    return [];
  }
  let response = null;
  try {
    switch(type){
      case types.updateContact:
        if(!property){
          Logger.error("Invalid contact data", TITLE_TAGS.CONTACT_API);
          return [];
        }
        response = await axios.put(`${urls.updateContact}`, 
          {
            headers: {
              'Content-Type': 'application/json',
            }, 
            data: property
          },
        );
        break;
      case types.getContact:
        response = await axios.get(urls.getContact);
        break;
      default:
        Logger.error(`Invalid contact request type: ${type}`, TITLE_TAGS.CONTACT_API);
        break;
    }
    return response;
  } catch (error) {
    Logger.error(`Error fetching contact data: ERROR MESSAGE:\n${error}`, TITLE_TAGS.CONTACT_API);
    return [];
  }
}