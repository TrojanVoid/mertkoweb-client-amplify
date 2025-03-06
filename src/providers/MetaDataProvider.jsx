import React from "react";
import { Helmet } from "react-helmet-async";
import useMetaData from "../hooks/useMetaData";

const {toCamelCase} = require("../util/StringUtility");

// Default metadata values
const defaultAuthor = "CBS Software";
const defaultImage = "/resources/images/mertko_logo-300x117.png"; 

const withMetaData = (Component) => {
  const pageKey = toCamelCase(Component.name);

  return function WrappedComponent(props) {
    const { title, description } = useMetaData(pageKey);

    // Full image path (absolute path for use in meta tags)
    const imageUrl = `${window.location.origin}${defaultImage}`;

    return (
      <>
        <Helmet>
          <title>{title || "Loading..."}</title>
          <meta property="og:title" content={title || "Loading..."} />
          <meta name="title" content={title || "Loading..."} />
          <meta name="twitter:title" content={title || "Loading..."} />
          
          <meta property="og:description" content={description || "Loading..."} />
          <meta name="twitter:description" content={description || "Loading..."} />
          <meta name="description" content={description || "Loading..."} />
          <meta name="author" content={defaultAuthor} />

          <meta property="og:image" content={imageUrl} />
          <meta name="twitter:image" content={imageUrl} />
          
          {/* JSON-LD for SEO - Structured data to enhance SEO */}
          <script type="application/ld+json">
            {`
              {
                "@context": "https://schema.org",
                "@type": "WebPage",
                "name": "${title || "Loading..."}",
                "description": "${description || "Loading..."}",
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
