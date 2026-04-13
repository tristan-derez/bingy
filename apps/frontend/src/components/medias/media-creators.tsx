import { Link } from "@tanstack/react-router";

interface CreatorPerson {
	id: number;
	name: string;
	gender: number | null;
}

interface MediaCreatorsProps {
	creators: CreatorPerson[];
	getRoleLabel: (gender: "male" | "female") => string;
}

export function MediaCreators({ creators, getRoleLabel }: MediaCreatorsProps) {
	if (creators.length === 0) return null;

	return (
		<div className="flex flex-wrap gap-x-8 gap-y-4">
			{creators.slice(0, 3).map((person) => (
				<div className="flex flex-col min-w-0" key={person.id}>
					<Link
						to="/person/$personId"
						params={{ personId: person.id.toString() }}
					>
						<h3 className="font-semibold text-base lg:text-lg wrap-break-word">
							{person.name}
						</h3>
					</Link>
					<p className="text-muted-foreground text-sm">
						{getRoleLabel(person.gender === 1 ? "female" : "male")}
					</p>
				</div>
			))}
		</div>
	);
}
