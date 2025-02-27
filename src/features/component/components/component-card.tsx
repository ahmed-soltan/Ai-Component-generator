import Link from "next/link";
import { useState } from "react";
import { BiLogoCss3 } from "react-icons/bi";
import { GoLinkExternal } from "react-icons/go";
import { PencilIcon, Trash2 } from "lucide-react";
import { IoLogoJavascript } from "react-icons/io5";
import { MdOutlineDarkMode } from "react-icons/md";

import { formatDistance } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ConfirmModal } from "@/components/confirm-modal";

import { ComponentType } from "../types";
import { useDeleteComponent } from "../api/use-delete-component";

interface ComponentCardProps {
  component: ComponentType;
}

export const ComponentCard = ({ component }: ComponentCardProps) => {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useDeleteComponent({
    componentId: component.$id,
  });

  const handleDelete = () => {
    mutate({});
  };

  return (
    <div className="w-full border border-neutral-800 border-r-0 rounded-xl p-6 flex flex-col items-start gap-5 relative group">
      <ConfirmModal
        open={open}
        setOpen={setOpen}
        title="Are Your Sure?"
        message="This Action Can not Be undone"
        callbackFn={handleDelete}
        variant={"destructive"}
      />
      <div className="w-full max-w-[98%] flex items-center justify-between gap-2 flex-wrap">
        <h1 className="text-2xl text-neutral-50 font-semibold">
          <span className="text-neutral-400">#{component.$id}</span> -{" "}
          {component.name}
        </h1>
        <span className="text-sm text-neutral-400">
          updated {formatDistance(new Date(component.$updatedAt), new Date(), {
            addSuffix: true,
          })}
        </span>
      </div>
      <div className="flex items-center gap-4 capitalize">
        <Badge className="rounded-md w-auto text-sm" variant={"secondary"}>
          <IoLogoJavascript className="size-4 mr-1" />
          {component.jsFramework}
        </Badge>
        <Badge className="rounded-md w-auto text-sm" variant={"secondary"}>
          <BiLogoCss3 className="size-5 mr-1" />
          {component.cssFramework}
        </Badge>
        <Badge className="rounded-md w-auto text-sm" variant={"secondary"}>
          <MdOutlineDarkMode className="size-4 mr-1" />
          {component.theme}
        </Badge>
      </div>
      <Separator />
      <div className="flex items-center justify-center lg:justify-start flex-wrap gap-4">
        <Button
          variant={"secondary"}
          size={"lg"}
          asChild
          className="w-full sm:w-auto md:w-full lg:w-auto"
          disabled={isPending}
        >
          <Link href={`/dashboard/generated-components/${component.$id}`}>
            <PencilIcon className="size-5 mr-2" />
            Edit Component
          </Link>
        </Button>
        <Button
          variant={"destructive"}
          size={"lg"}
          className="w-full sm:w-auto md:w-full lg:w-auto"
          onClick={() => setOpen(true)}
          disabled={isPending}
        >
          <Trash2 className="size-5 mr-2" />
          Delete Component
        </Button>
      </div>
      <Button
        asChild
        variant={"outline"}
        size={"icon"}
        className="absolute top-2 right-3 hidden group-hover:flex"
      >
        <Link href={`/dashboard/generated-components/${component.$id}`}>
          <GoLinkExternal className="size-5" />
        </Link>
      </Button>
    </div>
  );
};
