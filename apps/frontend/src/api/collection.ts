import { apiFetch } from "./fetcher";

export type CollectionParams = {
	language: string;
};

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
