import { useEffect, useRef } from "react";

export const useDots = () => {
  const dotContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dotContainer = dotContainerRef.current;
    if (!dotContainer) return;

    dotContainer.innerHTML = "";

    const numberOfDots = 200;

    for (let i = 0; i < numberOfDots; i++) {
      const dot = document.createElement("div");
      dot.classList.add("dot");
      dot.style.position = "absolute"; 
      dot.style.width = "2px"; 
      dot.style.height = "2px";
      dot.style.backgroundColor = "black";
      dot.style.borderRadius = "50%";
      dot.style.top = `${Math.random() * 100}%`;
      dot.style.left = `${Math.random() * 100}%`;
      dotContainer.appendChild(dot);
    }
  }, []);

  return { dotContainerRef };
};
