// import { Link } from "@nextui-org/link";

import Custom404 from "@/app/pages/404";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { useRouter } from "next/navigation";
// import Link from "next/link";

export default function NotFound() {

    // const router = useRouter();

    // const back = () => {
    //     router.back();
    // }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <img src="static/images/404.jpg" alt="404 error" />
            <div className="text-center">
                <h1>404 - Page not found</h1>
                {/* <p>Could not find requested resource</p> */}
                {/* arg la page n'est pas chargé après le link */}
                <Link href="/">Return Home</Link>
                {/* <Link href="/#home?toto">Return Home</Link> */}
                {/* <Link href="/projects">Return Home</Link> */}
                {/* <Button onClick={back}>Go back</Button> */}
                {/* <Button onClick={() => {
                        router.back();
                    }}>Go back</Button> */}
            </div>
        </div>
        // <Custom404/>
    )
}
