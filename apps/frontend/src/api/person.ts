import type { Pretty } from "shared";
import { apiFetch } from "./fetcher";

export const fetchPerson = async (id: number, params?: PersonParams) => {
	const res = await apiFetch(`/person/${id}`, {
		method: "GET",
		query: params,
	});
	return res.data;
};

export type PersonParams = Pretty<{
	append_to_response: string;
	language: string;
}>;
