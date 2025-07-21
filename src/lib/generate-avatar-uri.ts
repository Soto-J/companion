import { createAvatar } from "@dicebear/core";
import { botttsNeutral, initials } from "@dicebear/collection";

interface GenerateAvatarUriProps {
  seed: string;
  varient: "botttsNeutral" | "initials";
}

export const generateAvatarUri = ({
  seed,
  varient,
}: GenerateAvatarUriProps) => {
  const avatar =
    varient === "botttsNeutral"
      ? createAvatar(botttsNeutral, { seed })
      : createAvatar(initials, { seed, fontWeight: 500, fontSize: 42 });

  return avatar.toDataUri();
};
