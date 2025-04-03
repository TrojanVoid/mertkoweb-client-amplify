import { useState, useEffect } from "react";
import { requestByType, types } from "../apis/MetaApi";
import { requestByType as productRequestByType, types as productApiTypes } from "../apis/ProductApi";
const { Logger } = require("../util/Logger");

const localLoggerTitle = "useMetaData Hook";

export default function useMetaData(pageKey, productCategoryKey = null) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
    const logData = process.env.NODE_ENV === "development"; 

  useEffect(() => {
    const fetchMetaData = async () => {
      try {
        if (logData) {
          Logger.info(`Fetching metadata for page: ${pageKey}`);
        }

        const response = await requestByType(types.getPagesMeta);
        if (response.status === 200 && response.data.pages && response.data.pages[pageKey]) {
          setTitle(`${response.data.titlePrefix} ${response.data.pages[pageKey].title}`);
          setDescription(response.data.pages[pageKey].description);
          
          if (logData) {
            Logger.info(`Fetched metadata for page ${pageKey}:`, {
              title: `${response.data.titlePrefix} ${response.data.pages[pageKey].title}`,
              description: response.data.pages[pageKey].description,
            });
          }
        } else {
          throw new Error("Metadata not found for the page.");
        }
      } catch (err) {
        Logger.error(`Error fetching pages meta data for ${pageKey}: ${err}`, localLoggerTitle);
        setError(err.message || "Error fetching metadata");
      } finally {
        setLoading(false);
      }
    };

    fetchMetaData();
  }, [pageKey]);

  useEffect(() => {
    const fetchProductCategoryDescription = async () => {
      try {
        if (!productCategoryKey) return;

        if (logData) {
          Logger.info(`Fetching product category metadata for key: ${productCategoryKey}`);
        }

        const response = await productRequestByType(productApiTypes.getProductCategories);
        if (response.status === 200 && response.data) {
          const category = response.data.find(item => item.shortKey === productCategoryKey);
          if (category) {
            setDescription((prev) => `${prev} ${category.categoryDescription}`);
            
            if (logData) {
              Logger.info(`Fetched category description for ${productCategoryKey}: ${category.categoryDescription}`);
            }
          } else {
            throw new Error(`Category not found for key: ${productCategoryKey}`);
          }
        } else {
          throw new Error("Error fetching product category metadata.");
        }
      } catch (err) {
        Logger.error(`Product category meta data fetch error for ${productCategoryKey}: ${err}`, localLoggerTitle);
        setError(err.message || "Error fetching product category metadata");
      }
    };

    fetchProductCategoryDescription();
  }, [pageKey, productCategoryKey]);

  useEffect(() => {
    if (error) {
      if (logData) {
        Logger.info(`[Retry] Attempting to refetch metadata for page: ${pageKey}`);
      }
      const retryTimeout = setTimeout(() => {
        setError(null);
        setLoading(true);
      }, 5000);
      return () => clearTimeout(retryTimeout); 
    }
  }, [error, pageKey]);

  useEffect(() => {
    if (logData) {
      Logger.info(`Metadata for page ${pageKey}:`, { title, description, loading, error });
    }
  }, [title, description, loading, error, pageKey]);

  return { title, description, loading, error };
}
