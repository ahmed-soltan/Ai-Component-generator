"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Banner } from "@/components/banner";

const TechStack = [
  { icon: "/chatgpt.png" },
  { icon: "/monaco-editor.svg" },
  { icon: "/NEXT.png" },
  { icon: "/react-live.png" },
  { icon: "/stripe.png" },
];

export default function Home() {
  const dotContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dotContainer = dotContainerRef.current;
    if (!dotContainer) return;

    dotContainer.innerHTML = ""; // Clear existing dots

    const numberOfDots = 200;

    for (let i = 0; i < numberOfDots; i++) {
      const dot = document.createElement("div");
      dot.classList.add("dot");
      dot.style.top = `${Math.random() * 100}%`;
      dot.style.left = `${Math.random() * 100}%`;
      dotContainer.appendChild(dot);
    }
  }, []);

  return (
    <div className="flex flex-col items-center gap-10">
      <Banner />
      <div className="relative bg-dots h-[200px] w-full max-w-[700px] rounded-full">
        <div ref={dotContainerRef} className="absolute inset-0 w-full max-w-[500px] m-auto"></div>
      </div>
      <p className="text-xl text-gray-500 font-medium text-center">
        Powering The World's Best Products Team. <br /> From next-gen Startups to
        established Enterprises{" "}
      </p>
      <div className="flex items-center justify-center flex-wrap w-full max-w-[70%] gap-5">
        {TechStack.map((tech, index) => (
          <div key={index} className="flex items-center gap-4">
            <Image
              src={tech.icon}
              alt={"Tech"}
              width={200}
              height={200}
              className="w-[200px] h-[100px]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
