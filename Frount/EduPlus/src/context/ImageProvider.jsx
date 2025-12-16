import { useEffect, useState } from "react";
import { ImageContext } from "./ImageContext";

export function ImageProvider({ children }) {
  const [images, setImages] = useState({});

  useEffect(() => {
    const imageList = {
      plan: "/action/study_plan.webp",
      communication: "/action/communication_improver.webp",
      progress: "/action/study_progress.webp",
      fitness: "/action/fitness_tracker.webp",
      assistant: "/action/personal_assistant.webp",
    };

    const loadedImages = {};
    let loadedCount = 0;
    const total = Object.keys(imageList).length;

    Object.entries(imageList).forEach(([key, path]) => {
      const img = new Image();
      img.src = path;
      img.onload = () => {
        loadedImages[key] = img.src;
        loadedCount++;

        if (loadedCount === total) {
          setImages(loadedImages);
        }
      };
    });
  }, []);

  return (
    <ImageContext.Provider value={images}>
      {children}
    </ImageContext.Provider>
  );
}
