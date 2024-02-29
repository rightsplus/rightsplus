import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";
import nodemailer from 'nodemailer'
import { generatePDF as generate } from "@/pdf/pdfGenerator";
import { useCompiler } from '#vue-email'


export default defineEventHandler(async (event) => {
	try {
		const user = await serverSupabaseUser(event)
		if (!user?.email) throw createError({ statusCode: 401, message: "Unauthorized" })
		const body = JSON.parse(await readBody(event)) as SendPDFMailProps

		return {
			statusCode: 200,
			body: JSON.stringify({ })
		}
	} catch (error) {
		return error
	}
})
