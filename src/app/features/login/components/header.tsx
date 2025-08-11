import { twMergeClsx } from 'app/components/utils.ts';

// const font = Poppins({
//   subsets: ['latin'],
//   weight: ['600'],
// });

interface HeaderProps {
  label: string;
}

export const Header = ({ label }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <h1 className={twMergeClsx('text-3xl font-semibold', 'Poppins')}>🔐 Auth</h1>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
};
