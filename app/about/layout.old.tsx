export default function AboutLayout({
	children,
	// dashboard,
}: {
	children: React.ReactNode;
	// dashboard: React.ReactNode;
}) {
	return (
		<section className="flex items-center justify-center bg-indigo-500" >
		 {/* flex-row items-center justify-center gap-4 py-8 md:py-10"> */}
			<div className="inline-block text-center justify-center">
				{children}
				{/* Dashbord try ...<br/> */}
				{/* {dashboard} */}
				{/* Layout */}
			</div>
		</section>
	);
}
