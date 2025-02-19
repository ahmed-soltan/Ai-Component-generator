import { Stars } from "lucide-react";

interface PeopleCardProps {
  title: string;
  description: string;
}

export const PeopleCard = ({ title, description }: PeopleCardProps) => {
  return (
    <div className="border shadow-xl p-5 bg-white rounded-xl flex flex-col items-start  gap-5 w-full max-w-[320px]">
      <div className="flex items-center gap-1 card-header-bg-gradient px-2 rounded-md w-full max-w-[230px]">
        <Stars className="size-4 text-[#5333aa]" />
        <h1 className="text-[#5333aa] font-normal text-md">{title}</h1>
      </div>
      <p className="text-md font-medium text-gray-600 max-w-[300px] text-left">{description}</p>
    </div>
  );
};
