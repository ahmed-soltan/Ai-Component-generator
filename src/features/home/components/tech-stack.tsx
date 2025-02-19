import Image from "next/image";

const technologies = [
  { icon: "/chatgpt.png" },
  { icon: "/monaco-editor.svg" },
  { icon: "/NEXT.png" },
  { icon: "/react-live.png" },
  { icon: "/stripe.png" },
];

export const TechStack = () => {
  return (
    <div className="flex items-center justify-center flex-col w-full gap-10">
      <p className="text-xl text-gray-500 font-medium text-center">
        Powering The World's Best Products Team. <br /> From next-gen Startups
        to established Enterprises{" "}
      </p>
      <div className="flex items-center justify-center flex-wrap w-full max-w-[70%] gap-5">
        {technologies.map((tech, index) => (
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
};
