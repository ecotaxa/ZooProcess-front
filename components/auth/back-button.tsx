import { Button } from '@heroui/button';
import { Link } from '@heroui/link';
// import Link from "next/link";

// import { Button } from "@/components/ui/button";

interface BackButtonProps {
  href: string;
  label: string;
}

export const BackButton = ({ href, label }: BackButtonProps) => {
  return (
    <Link href={href} size="sm" className="font-normal w-full">
      {label}
    </Link>
  );
};
