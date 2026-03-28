import type { Schemas } from "shared";
import { m } from "@/paraglide/messages";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CastList } from "./cast-list";
import { CrewList } from "./crew-list";

interface CastCrewTabsProps {
	cast: Array<Schemas.CastMember & { characters?: string[] }> | [];
	crew: Array<Schemas.CrewMember & { jobs?: string[] }> | [];
}

export function CastCrewTabs({ cast, crew }: CastCrewTabsProps) {
	return (
		<Tabs defaultValue="cast" className="w-full">
			<TabsList>
				<TabsTrigger value="cast">{m.cast_text()}</TabsTrigger>
				<TabsTrigger value="crew">{m.crew_text()}</TabsTrigger>
			</TabsList>
			<TabsContent value="cast">
				<CastList people={cast} />
			</TabsContent>
			<TabsContent value="crew">
				<CrewList people={crew} />
			</TabsContent>
		</Tabs>
	);
}
