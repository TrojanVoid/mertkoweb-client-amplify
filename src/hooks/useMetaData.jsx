import { useState, useEffect } from "react";
import { requestByType, types } from "../apis/MetaApi";
const  {Logger, TITLE_TAGS} = require("../util/Logger");

const localLoggerTitle = "useMetaData Hook";

export default function useMetaData(pageKey) {
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

  return { title, description, loading };
}
