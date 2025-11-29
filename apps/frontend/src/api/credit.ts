import { apiFetch } from "./fetcher";

export const fetchCredit = async (credit_id: string) => {
	const res = await apiFetch(`/credit/${credit_id}`, {
		method: "GET",
	});
	return res.data;
};
