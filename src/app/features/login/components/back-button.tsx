import { Link } from '@heroui/link';

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
