import Image from "next/image";

interface ErrorStateProps {
  title: string;
  description: string;
  image?: string;
}

export const EmptyState = ({
  title,
  description,
  image = "/empty.svg",
}: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Image src={image} alt="Empty" height={240} width={240} className="" />

      <div className="mx-auto flex max-w-md flex-col gap-y-6 text-center">
        <h6 className="text-lg font-medium capitalize">{title}</h6>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
};
