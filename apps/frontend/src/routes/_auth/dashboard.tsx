import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/dashboard")({
	head: () => ({
		meta: [
			{
				title: "Bingy - Dashboard",
			},
		],
	}),
	component: RouteComponent,
});

function RouteComponent() {
	const sections = Array.from({ length: 20 }, () => ({
		id: crypto.randomUUID(),
	}));

	return (
		<div>
			<div className="max-w-2xl w-full space-y-4">
				<h1 className="text-3xl font-bold mb-4">Dashboard Overview</h1>

				{sections.map((section, index) => (
					<div key={section.id} className="space-y-3">
						<h2 className="text-xl font-semibold">Section {index + 1}</h2>
						<p className="text-base leading-normal">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
							eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
							enim ad minim veniam, quis nostrud exercitation ullamco laboris
							nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
							reprehenderit in voluptate velit esse cillum dolore eu fugiat
							nulla pariatur. Excepteur sint occaecat cupidatat non proident.
						</p>
						<p className="text-base leading-normal">
							Sed ut perspiciatis unde omnis iste natus error sit voluptatem
							accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
							quae ab illo inventore veritatis et quasi architecto beatae vitae
							dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
							aspernatur aut odit aut fugit.
						</p>
						{index % 3 === 0 && (
							<p className="text-base leading-normal">
								Additional content for variety. At vero eos et accusamus et
								iusto odio dignissimos ducimus qui blanditiis praesentium
								voluptatum deleniti atque corrupti quos dolores et quas
								molestias excepturi sint occaecati.
							</p>
						)}
						{index % 5 === 0 && (
							<div className="bg-gray-100 p-3 rounded mt-2">
								<p className="text-sm text-foreground-autofilled">
									Note: This is an important note in section {index + 1}. It
									provides additional context or highlights key information
									relevant to this section.
								</p>
							</div>
						)}
					</div>
				))}

				<div className="mt-6 p-4 bg-blue-50 rounded-lg text-foreground-autofilled">
					<h2 className="text-2xl font-bold mb-3">Summary</h2>
					<p className="text-base leading-normal">
						In total, this dashboard contains extensive content spanning
						multiple sections and topics. Each section provides detailed
						information and context to ensure comprehensive understanding of the
						subject matter.
					</p>
				</div>
			</div>
		</div>
	)
}
