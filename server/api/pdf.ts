import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";
import { generatePDF as generate } from "@/pdf/pdfGenerator";
import type { GeneratePDFProps } from "./types";

const generatePDFTemplateLink = (template: string, data?: Record<string, string | undefined>) => {
	const base = process.env.NODE_ENV === 'production' ? 'https://rightsplus.up.railway.app' : 'http://localhost:3000'
	const url = new URL(`${base}/pdf/${template}`)
	Object.entries(data || {}).forEach(([key, value]) => {
		if (value) url.searchParams.append(key, value.toString());
	});
	return url
}

const generatePDF = async ({ data, template }: GeneratePDFProps ) => {
	if (!template) {
		throw new Error('no template name')
	}
	const url = generatePDFTemplateLink(template, data)
	return generate(url.href)
}

export default defineEventHandler(async (event) => {
	try {
		const user = await serverSupabaseUser(event)
		// if (!user?.email) throw createError({ statusCode: 401, message: "Unauthorized" })
		const body = JSON.parse(await readBody(event)) as GeneratePDFProps
		return await generatePDF(body)
	} catch (error) {
		return error
	}
})
