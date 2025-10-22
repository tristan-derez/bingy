type GlobalErrorProps = {
	error: unknown;
};

export function GlobalError({ error }: GlobalErrorProps) {
	const message =
		error instanceof Error ? error.message : "Unknown error occurred";

	return (
		<div className="flex flex-col items-center justify-center h-full text-center p-4">
			<h1 className="text-2xl font-semibold text-red-600 mb-2">
				Something went wrong
			</h1>
			<p className="text-gray-700">{message}</p>
		</div>
	);
}
