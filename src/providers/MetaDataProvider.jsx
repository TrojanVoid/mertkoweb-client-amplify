import React from "react";
import { Helmet } from "react-helmet-async";
import useMetaData from "../hooks/useMetaData";

const {toCamelCase} = require("../util/StringUtility");

// Default metadata values
const defaultAuthor = "CBS Software";
const defaultImage = "/resources/images/mertko_logo-300x117.png"; 

const withMetaData = (Component, productCategoryKey=null) => {
  const pageKey = toCamelCase(Component.name);
  console.log(`properties given to meta data provider: page key: ${pageKey}, product category: ${productCategoryKey}`);

  return function WrappedComponent(props) {
    const { title, description } = useMetaData(pageKey, productCategoryKey);

    // Full image path (absolute path for use in meta tags)
    const imageUrl = `${window.location.origin}${defaultImage}`;

    return (
      <>
        <Helmet>
          <title>{title || "Mertko Plastik Ürünleri A.Ş"}</title>
          <meta property="og:title" content={title || "Mertko Plastik Ürünleri A.Ş"} />
          <meta name="title" content={title || "Mertko Plastik Ürünleri A.Ş"} />
          <meta name="twitter:title" content={title || "Mertko Plastik Ürünleri A.Ş"} />
          
          <meta property="og:description" content={description || "Mertko Plastik Ürünleri A.Ş"} />
          <meta name="twitter:description" content={description || "Mertko Plastik Ürünleri A.Ş"} />
          <meta name="description" content={description || "Mertko Plastik Ürünleri A.Ş"} />
          
          <meta name="author" content={defaultAuthor} />

          <meta property="og:image" content={imageUrl} />
          <meta name="twitter:image" content={imageUrl} />
          
          {/* JSON-LD for SEO - Structured data to enhance SEO */}
          <script type="application/ld+json">
            {`
              {
                "@context": "https://schema.org",
                "@type": "WebPage",
                "name": "${title || "Mertko Plastik Ürünleri A.Ş"}",
                "description": "${description || "Mertko Plastik Ürünleri A.Ş"}",
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
