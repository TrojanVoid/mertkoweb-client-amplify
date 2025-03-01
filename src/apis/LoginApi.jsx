import axios from "axios";
const { Logger, TITLE_TAGS } = require("../util/Logger");
const apiConfig = require("../config/ApiConfig");
const envMode = process.env.NODE_ENV;
const baseUrl =
  envMode === "development" || envMode === "production"
    ? apiConfig[envMode]["apiUrl"]
    : apiConfig["production"]["apiUrl"];

    export const login = async (username, password) => {
        
        const base = baseUrl.replace("/api", ""); 
        const url = `${base}/admin`; 
        Logger.log(`Giriş denemesi: ${username}`, TITLE_TAGS.LOGIN_API);
        try {
          const response = await axios.post(url, { username, password });
          return response;
        } catch (error) {
          Logger.error(`Login hatası: ${error}`, TITLE_TAGS.LOGIN_API);
          throw error;
        }
      };
      
