import { Tab, Tabs } from "@nextui-org/react";

export default function SamplesLayout(props:{
	children: React.ReactNode;
	// stats: React.ReactNode;
	// metadata: React.ReactNode;
	// samples: React.ReactNode;
}) {
	const projectid = 10 ;
	return (
		<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
			<div className="inline-block max-w-lg text-center justify-center">
				{props.children}
			</div>
		</section>
	);
}
