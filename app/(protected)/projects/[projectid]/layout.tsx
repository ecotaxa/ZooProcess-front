import { Tab, Tabs } from "@heroui/react";

export default function SamplesLayout(props:{
	children: React.ReactNode;
	stats: React.ReactNode;
	metadata: React.ReactNode;
	samples: React.ReactNode;
	scans: React.ReactNode;
}) {
	// const projectid = 10 ;

	return (

		<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
			<div className="inline-block  text-center justify-center">
			{/* <Tabs aria-label="Options">
				<Tab key="stats" title="Stats">
					{props.stats}
                </Tab>
                <Tab key="metadata" title="Metadata" href={`/projects/${projectid}/metadata`}>
					{props.metadata}
                </Tab>
                <Tab key="samples" title="Samples">
					{props.samples}
                </Tab>
                <Tab key="scans" title="Scans">
					{props.scans}
                </Tab>
            </Tabs> */}
				{props.children}
			</div>
		</section>
	);
}
