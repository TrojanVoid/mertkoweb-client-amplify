import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import useMetaData from "../hooks/useMetaData";

const { toCamelCase } = require("../util/StringUtility");
const { Logger } = require("../util/Logger");

const envMode = process.env.NODE_ENV;
// Default metadata values
const defaultAuthor = "CBS Software";
const defaultImage = "/resources/images/mertko_logo-300x117.png"; 

const withMetaData = (Component, productCategoryKey = null) => {
  

  return function WrappedComponent(props) {
    const pageKey = toCamelCase(Component.displayName || props.pageKey || "home");

    const logMetaData = (message) => {
      Logger.info(`[MetaDataProvider] ${message}`);
    };

    logMetaData(`Injecting into page with key: ${pageKey}, product category: ${productCategoryKey || "none"}`);
    const { title, description, loading, error } = useMetaData(pageKey, productCategoryKey);

    const [isMetaReady, setIsMetaReady] = useState(false);

    useEffect(() => {
      if (!loading && !error) {
        setIsMetaReady(true);
        logMetaData(`Metadata loaded successfully for page: ${pageKey}`);
      }
      if (error) {
        logMetaData(`Error fetching metadata for page: ${pageKey}: ${error}`);
      }
    }, [loading, error, pageKey]);

    // Full image path (absolute path for use in meta tags)
    const imageUrl = `${window.location.origin}${defaultImage}`;
    const fallbackTitle = "Mertko Plastik Ürünleri A.Ş";
    const fallbackDescription = "Mertko Plastik Ürünleri A.Ş";

    // Default values to fall back to if metadata isn't loaded yet
    const metaTitle = title || fallbackTitle;
    const metaDescription = description || fallbackDescription;

    if (loading || !isMetaReady) {
      logMetaData(`Waiting for metadata for page: ${pageKey}`);
    }

    return (
      <>
        <Helmet>
          <title>{metaTitle}</title>
          <meta property="og:title" content={metaTitle} />
          <meta name="title" content={metaTitle} />
          <meta name="twitter:title" content={metaTitle} />

          <meta property="og:description" content={metaDescription} />
          <meta name="twitter:description" content={metaDescription} />
          <meta name="description" content={metaDescription} />

          <meta name="author" content={defaultAuthor} />

          <meta property="og:image" content={imageUrl} />
          <meta name="twitter:image" content={imageUrl} />

          {/* JSON-LD for SEO - Structured data to enhance SEO */}
          <script type="application/ld+json">
            {`
              {
                "@context": "https://schema.org",
                "@type": "WebPage",
                "name": "${metaTitle}",
                "description": "${metaDescription}",
                "author": {
                  "@type": "Organization",
                  "name": "${defaultAuthor}"
                },
                "image": "${imageUrl}"
              }
            `}
          </script>
        </Helmet>

        <Component {...props} />
      </>
    );
  };
};

export default withMetaData;
