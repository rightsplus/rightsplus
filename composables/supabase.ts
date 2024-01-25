import { Database } from "~/types";
import { SupabaseClient } from "@supabase/supabase-js";


export const userExists = async ({ email, client }: {
	email: string, client: SupabaseClient
}) => {
	const { data, error } = await client.functions.invoke("user-exists", {
		body: { email },
	})
	if (error) {
		throw error;
	}
	return data as boolean;
}

export const generatePDF = async ({ url, client }: {
	url: string, client: SupabaseClient
}) => {
	const { data, error } = await client.functions.invoke("generate-pdf", {
		body: { url },
	})
	if (error) {
		throw error;
	}
	return data as boolean;
}