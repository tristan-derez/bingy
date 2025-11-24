import type { Pretty } from "./generic";

export type ProductionCompany = Pretty<{
	id: number;
	logo_path: string | null;
	name: string;
	origin_country: string;
}>;

export type ProductionCountry = Pretty<{
	iso_3166_1: string;
	name: string;
}>;

export type CompanyDetails = Pretty<{
	description: string;
	headquarters: string;
	homepage: string | null;
	id: number;
	logo_path: string | null;
	name: string;
	origin_country: string;
	parent_company: string;
}>;

export type NetworkDetails = Omit<
	CompanyDetails,
	"description" | "parent_company"
>;

type AlternativeNames = Pretty<{
	name: string;
	type: string;
}>;

export type CompanyAlternativeNames = Pretty<{
	id: number;
	results: AlternativeNames[];
}>;

type Logo = {
	aspect_ratio: number;
	file_path: string;
	height: number;
	id: string;
	file_type: ".svg" | ".png";
	vote_average: number;
	vote_count: number;
	width: number;
};

export type CompanyImages = Pretty<{
	id: number;
	logos: Logo[];
}>;
