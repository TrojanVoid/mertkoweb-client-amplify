import axios from "axios";

const {TITLE_TAGS, Logger} = require("../util/Logger");
const apiConfig = require("../config/ApiConfig");
const envMode = process.env.NODE_ENV;
const baseUrl = (envMode == "development" || envMode == "production") 
  ? apiConfig[envMode]["apiUrl"] 
  : apiConfig["production"]["apiUrl"];

export const types = {
  deleteBlog: "deleteBlog",
  updateBlog: "updateBlog",
  uploadBlogImage: "uploadBlogImage",
  deleteBlogImages: "deleteBlogImages",
  createBlog: "createBlog",
  getBlog: "getBlog",
  getBlogs: "getBlogs",
}

export const urls = {
  deleteBlog: `${baseUrl}/delete-blog`,
  updateBlog: `${baseUrl}/update-blog`,
  uploadBlogImage: `${baseUrl}/upload-blog-image`,
  deleteBlogImages: `${baseUrl}/delete-blog-images`,
  createBlog: `${baseUrl}/create-blog`,
  getBlog: `${baseUrl}/get-blog`,
  getBlogs: `${baseUrl}/get-blogs`,
}

export const requestByType = async (blogRequestType, property=null) => {
  Logger.info(`Fetching ${blogRequestType} with property: ${property}`, TITLE_TAGS.BLOG_API);
  const url = urls[blogRequestType];
  let response = null;
  try { 
    switch (blogRequestType) {
      case "deleteBlog":
        response = await axios.delete(`${url}/${property}`);
        break;
      case "updateBlog":
        response = await axios.put(`${url}/${property.id}`, property);
        break;
      case "uploadBlogImage":
        if(!property || !property.image || !property.id) {
          Logger.error("Invalid property for uploadBlogImage. 'image' and 'id' are required.", TITLE_TAGS.BLOG_API);
          return;
        }
        const formData = new FormData();
        formData.append("image", property.image);
        formData.append("blogId", property.id);
        response = await axios.post(`${url}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        break;
      case "deleteBlogImages":
        response = await axios.delete(`${url}`, {
          data: {
            blogId: property,
          },
        });
        break;
      case "createBlog":
        response = await axios.post(url, property);
        break;
      case "getBlog":
        response = await axios.get(`${url}?id=${property}`);
        break;
      case "getBlogs":
        response = await axios.get(url);
        break;
      default:
        Logger.error(`Invalid blog request type: ${blogRequestType}`, TITLE_TAGS.BLOG_API);
        break;
    }
    return response;
  } catch (error) { 
    Logger.error(`Error fetching ${blogRequestType}: ERROR MESSAGE:\n${error}`, TITLE_TAGS.BLOG_API);
    return [];  
  }
  
}