import type { CollectionParams } from "@/types/collection";
import { apiFetch } from "./fetcher";

export const fetchCollection = async (
	id: number,
	params?: CollectionParams,
) => {
	const res = await apiFetch(`/collection/${id}`, {
		method: "GET",
		query: params,
	});
	return res.data;
};
