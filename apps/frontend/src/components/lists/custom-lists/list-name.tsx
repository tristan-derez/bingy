interface ListNameProps {
	listName: string;
}

export function ListName({ listName }: ListNameProps) {
	return (
		<h1
			className="text-lg lg:text-2xl font-bold w-full flex flex-wrap"
			title={listName}
		>
			{listName}
		</h1>
	);
}
