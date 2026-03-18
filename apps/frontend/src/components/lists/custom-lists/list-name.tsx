interface ListNameProps {
	listName: string;
}

export function ListName({ listName }: ListNameProps) {
	return (
		<h1
			className="text-xl lg:text-2xl font-bold truncate w-full"
			title={listName}
		>
			{listName}
		</h1>
	);
}
