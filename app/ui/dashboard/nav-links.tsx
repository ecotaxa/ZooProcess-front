// 'use client';
 
// import {
//   UserGroupIcon,
//   HomeIcon,
//   DocumentDuplicateIcon,
// } from '@heroicons/react/24/outline';
// // import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import clsx from 'clsx';
// import { DetailedHTMLProps, HTMLAttributes, Key } from 'react';
// import { Url } from 'next/dist/shared/lib/router/router';
// import Link from 'next/link';
// import { Icon } from 'next/dist/lib/metadata/types/metadata-types';
// // import { Link } from '@heroui/link';

// // export type NLink = {
// //     icon: React.ReactElement // String,
// //     name: React.ReactElement //  Key | null | String | DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>,
// //     href: Url
// // }

// // ...
// //const links : Array<Link> = [] 


// export default function NavLinks() {
//   const pathname = usePathname();
 
//   return (
//     <>
//       {links.map((link) => {
//         const LinkIcon = link.icon;
//         return (
//           <Link
//             key={link.name}
//             href={link.href}
//             className={clsx(
//               'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
//               {
//                 'bg-sky-100 text-blue-600': pathname === link.href,
//               },
//             )}
//           >
//             <LinkIcon className="w-6" />
//             <p className="hidden md:block">{link.name}</p>
//           </Link>
//         );
//       })}
//     </>
//   );
// }