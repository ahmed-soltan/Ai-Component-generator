import { PiCursorClickDuotone } from "react-icons/pi";

import { PeopleCard } from "@/components/people-card";

import { useDots } from "@/hooks/use-dots";

export const UserBenefits = () => {
  const { dotContainerRef: dotContainerRef2 } = useDots();

  return (
    <div className="flex items-center justify-center flex-col text-center gap-5 my-12">
      <div className="relative bg-dots h-[150px] w-full max-w-[700px] rounded-full">
        <div
          ref={dotContainerRef2}
          className="absolute inset-0 w-full max-w-[400px] m-auto"
        ></div>
        <div
          className="gr-bg rounded-md size-12 flex items-center justify-center text-center
     absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2"
        >
          <PiCursorClickDuotone className="size-6 text-gray-200" />
        </div>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
        Who Can Benefit From Our Tools?
      </h1>
      <p className="text-lg text-gray-500 font-bold text-center">
        Developers, designers, and product teams streamline their workflow.{" "}
        <br />
        From rapid prototyping to seamless collaboration, our tools empower
        innovation.
      </p>{" "}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 my-8">
        <PeopleCard
          title="Frontend Developers"
          description="Quickly generate reusable UI components to speed up development and maintain design consistency across projects."
        />
        <PeopleCard
          title="UI/UX Designers"
          description="Transform design ideas into working UI components, ensuring a smooth handoff to developers with ready-to-use code."
        />
        <PeopleCard
          title="Product Designers"
          description="Create interactive components that align with design systems and streamline product development workflows."
        />
        <PeopleCard
          title="Startup Founders"
          description="Accelerate MVP development by using AI-generated UI components, reducing the need for extensive front-end work."
        />
        <PeopleCard
          title="Full-Stack Developers"
          description="Integrate AI-generated UI elements seamlessly with back-end systems, reducing front-end workload and improving efficiency."
        />
        <PeopleCard
          title="Design System Engineers"
          description="Standardize UI components across teams and projects, ensuring a unified design language with AI-assisted generation."
        />
      </div>
    </div>
  );
};
