import type { PersonParams } from "@/types/person";
import { apiFetch } from "./fetcher";

export const fetchPerson = async (id: number, params?: PersonParams) => {
	const res = await apiFetch(`/person/${id}`, {
		method: "GET",
		query: params,
	});
	return res.data;
};
