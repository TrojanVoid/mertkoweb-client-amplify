import { useState, useEffect } from "react";

import { requestByType, types } from "../apis/MetaApi";
import { requestByType as productRequestByType, types as productApiTypes } from "../apis/ProductApi";
const  {Logger, TITLE_TAGS} = require("../util/Logger");

const localLoggerTitle = "useMetaData Hook";

export default function useMetaData(pageKey, productCategoryKey=null) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetaData = async () => {
      try {
        const response = await requestByType(types.getPagesMeta);
        if (response.status === 200 && response.data.pages && response.data.pages[pageKey] && response.data.titlePrefix) {
          setTitle(`${response.data.titlePrefix} ${response.data.pages[pageKey].title}`);
          setDescription(response.data.pages[pageKey].description);
        }
        else{
          Logger.error("Error fetching pages meta data", localLoggerTitle);
        }
      } catch (error) {
        Logger.error(`Pages meta data fetch error: ${error}`, localLoggerTitle);
      } finally {
        setLoading(false);
      }
    };

    fetchMetaData();
  }, [pageKey]);

  useEffect(() => {
    const fetchProductCategoryDescription = async () => {
      try {
        const response = await productRequestByType(productApiTypes.getProductCategories);
        if (response.status === 200 && response?.data) {
          setDescription((prev) =>
            `${prev} ${response.data.filter((item) => item.shortKey === productCategoryKey)[0]?.categoryDescription}`
          );
        }
        else{
          Logger.error("Error fetching product category meta data", localLoggerTitle);
        }
      } catch (error) {
        Logger.error(`Product category meta data fetch error: ${error}`, localLoggerTitle);
      }
    };

    if(productCategoryKey){
      fetchProductCategoryDescription();
    }
  }, [pageKey, productCategoryKey]);

  return { title, description, loading };
}
