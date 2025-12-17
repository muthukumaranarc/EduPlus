import { useEffect } from "react";
import ImageContext from "./ImageContext";

export function ImageProvider({ children }) {

  const images = {
    plan: "/action/study_plan.webp",
    communication: "/action/communication_improver.webp",
    progress: "/action/study_progress.webp",
    fitness: "/action/fitness_tracker.webp",
    assistant: "/action/personal_assistant.webp",
  };

  useEffect(() => {
    Object.values(images).forEach(src => {
      const img = new Image();
      img.src = src;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ImageContext.Provider value={images}>
      {children}
    </ImageContext.Provider>
  );
}
