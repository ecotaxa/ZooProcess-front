import { title } from "@/components/primitives";
import { Timeline_scan } from "@/components/timeline-scan";
import { Link, Spinner } from "@nextui-org/react";

export default function AboutPage() {
	return (

		<div>


		
        <Timeline_scan current={0.5} />

        <Timeline_scan current={1} />
        <Timeline_scan current={1.5} />



		</div>
	);
}


// 	<h1 className={title()}>About</h1>
		// 	<Spinner/>
		// 	<div className="flex flex-col gap-4">
        //     <Link href={"/blog/123"} className="bg-green-400 w-fit rounded-lg p-4">
        //         Single param
        //     </Link>
        //     <Link href={"blog/a/b"} className="bg-blue-400 w-fit rounded-lg p-4">
        //         Multiple Params
        //     </Link>
        //     <Link href={"blog"} className="bg-amber-400 w-fit rounded-lg p-4">
        //         Optional
        //     </Link>
        //  </div>