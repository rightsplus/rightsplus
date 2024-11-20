import { defineNuxtPlugin } from "#app";
import useCreatePdf from "./pdfmake/useCreatePdf";

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.provide('createPdf', useCreatePdf)
});