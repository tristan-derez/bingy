import type { Pretty } from "shared";
import { apiFetch } from "./fetcher";

export const fetchCredit = async (credit_id: string, params?: CreditParams) => {
	const res = await apiFetch(`/credit/${credit_id}`, {
		method: "GET",
		query: params,
	});
	return res.data;
};

export type CreditParams = Pretty<{
	language?: string;
}>;
