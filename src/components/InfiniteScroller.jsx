import React, { useState, useEffect, useRef } from "react";
import FadeIn from "./FadeIn";

const InfiniteScroller = ({
  items,
  itemsPerLoad = 20,
  deviceItemsPerLoad = {},
  promptType = "click",
  loadMoreButton,
  scrollThreshold = 0.8,
  children,
}) => {
  const [batchSize, setBatchSize] = useState(itemsPerLoad);
  const [loadedCount, setLoadedCount] = useState(0);
  const sentinelRef = useRef(null);

  const updateBatchSize = () => {
    const width = window.innerWidth;
    let size = itemsPerLoad;

    if (deviceItemsPerLoad.mobile != null && width < 768) {
      size = deviceItemsPerLoad.mobile;
    } else if (
      deviceItemsPerLoad.tablet != null &&
      width >= 768 &&
      width < 1024
    ) {
      size = deviceItemsPerLoad.tablet;
    } else if (deviceItemsPerLoad.desktop != null && width >= 1024) {
      size = deviceItemsPerLoad.desktop;
    }

    setBatchSize(size);
  };

  useEffect(() => {
    updateBatchSize();
    window.addEventListener("resize", updateBatchSize);
    return () => window.removeEventListener("resize", updateBatchSize);
  }, [itemsPerLoad, deviceItemsPerLoad]);

  useEffect(() => {
    setLoadedCount(batchSize);
  }, [batchSize, items]);

  useEffect(() => {
    if (promptType !== "scroll") return;

    const onScroll = () => {
      if (loadedCount >= items.length) return;
      if (!sentinelRef.current) return;

      const { top } = sentinelRef.current.getBoundingClientRect();
      if (top <= window.innerHeight * scrollThreshold) {
        setLoadedCount((prev) => Math.min(prev + batchSize, items.length));
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [promptType, batchSize, loadedCount, items.length, scrollThreshold]);

  const loadMore = () => {
    setLoadedCount((prev) => Math.min(prev + batchSize, items.length));
  };

  const displayItems = items.slice(0, loadedCount);

  return (
    <>
      {children(displayItems)}

      {promptType === "click" && loadedCount < items.length && (
        <FadeIn delay={500}>
          <div
            onClick={loadMore}
            style={{ cursor: "pointer", textAlign: "center", margin: "1rem 0" }}
          >
            {loadMoreButton || <button type="button">Load More</button>}
          </div>
        </FadeIn>
      )}

      {promptType === "scroll" && <div ref={sentinelRef} />}
    </>
  );
};

export default InfiniteScroller;
