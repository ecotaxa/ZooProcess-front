// import { Link } from "@heroui/link";

import Custom404 from '@/app/pages/404';
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';
// import { clientID } from "./api/_auth/[...nextauth]/options";
// import { Router } from "next/ro";
// import Link from "next/link";

export default function NotFound() {
  const navigate = useNavigate();

  // const back = () => {
  //     router.back();
  // }

  function onClick() {
    router.back();
  }

  return (
    // <Custom404/>
    <div className="flex flex-col items-center justify-center h-screen">
      {/* <img src="static/images/404.jpg" alt="404 error" /> */}
      <img src="/images/404.jpg" alt="404 error" />
      <div className="text-center">
        <h1>404 - Page not found</h1>
        {/* <p>Could not find requested resource</p> */}
        {/* arg la page n'est pas chargé après le link */}
        <Link href="/">Return Home</Link>
        <br />
        <Button onClick={onClick}>go back</Button>
        {/* <Link href="/#home?toto">Return Home</Link> */}
        {/* <Link href="/projects">Return Home</Link> */}
        {/* <Button onClick={back}>Go back</Button> */}
        {/* <Button onClick={() => {
                        router.back();
                    }}>Go back</Button> */}
      </div>
    </div>
  );
}
