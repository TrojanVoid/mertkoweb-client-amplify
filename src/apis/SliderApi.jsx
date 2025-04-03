import axios from "axios";

const {TITLE_TAGS, Logger} = require("../util/Logger");
const apiConfig = require("../config/ApiConfig");
const envMode = process.env.NODE_ENV;
const baseUrl = (envMode == "development" || envMode == "production") 
  ? apiConfig[envMode]["apiUrl"] 
  : apiConfig["production"]["apiUrl"];

export const types = {
  getSlider: "sliderData",
  uploadSlide: "uploadSlide",
  updateSlideTitle: "updateSlideTitle",
  repositionSlide: "repositionSlide",
  deleteSlide: "deleteSlide",
}

const urls = {
  getSlider: `${baseUrl}/carousel-images`,
  uploadSlide: `${baseUrl}/upload-carousel-image`,
  updateSlideTitle: `${baseUrl}/update-carousel-title`,
  repositionSlide: `${baseUrl}/reposition-carousel-entity`,
  deleteSlide: `${baseUrl}/delete-carousel-entity`,
}

export const requestByType = async (type, property=null) => {
  Logger.info("Fetching slider data", TITLE_TAGS.SLIDER_API);
  if(!type){
    Logger.error("Invalid slider request type", TITLE_TAGS.SLIDER_API);
    return [];
  }
  let response = null;
  try {
    switch(type){
      case types.uploadSlide:
        if(!property){
          Logger.error("Invalid slider data", TITLE_TAGS.SLIDER_API);
          return [];
        }
        response = await axios.put(`${urls.uploadSlide}`, property);
        break;
      case types.getSlider:
        response = await axios.get(urls.getSlider);
        break;
      case types.updateSlideTitle:
        if(!property){
          Logger.error("Invalid slider data", TITLE_TAGS.SLIDER_API);
          return [];
        }
        response = await axios.post(`${urls.updateSlideTitle}`, 
          {
            headers: {
              'Content-Type': 'application/json',
            }, 
            data: property
          },
        );
        break;
      case types.repositionSlide:
        if(!property){
          Logger.error("Invalid slider data", TITLE_TAGS.SLIDER_API);
          return [];
        }
        response = await axios.put(`${urls.repositionSlide}`, property);
        break;
      case types.deleteSlide:
        response = await axios.delete(`${urls.deleteSlide}`, {data: property});
        break;
      default:
        Logger.error(`Invalid slider request type: ${type}`, TITLE_TAGS.SLIDER_API);
        break;
    }
    return response;
  } catch (error) {
    Logger.error(`Error fetching slider data: ERROR MESSAGE:\n${error}`, TITLE_TAGS.SLIDER_API);
    return [];
  }
} 