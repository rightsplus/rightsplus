import type { SendPDFMailProps } from "~/server/api/types";

// Helper function to recursively append nested properties
const appendNested = (formData: FormData, obj: any, parentKey = "") => {
	try {
		if (obj instanceof Blob) {
			formData.append(parentKey, obj);
			return
		}
		for (const [key, value] of Object.entries(obj)) {
			const formKey = parentKey ? `${parentKey}[${key}]` : key;
			if (value instanceof Blob) {
				// Append blobs directly
				formData.append(formKey, value);
			} else if (Array.isArray(value)) {
				// Append array elements
				value.forEach((val, index) => appendNested(formData, val, `${formKey}[${index}]`));
			} else if (value !== null && typeof value === "object") {
				// Recursively flatten nested objects
				appendNested(formData, value, formKey);
			} else if (value != null) {
				// Append primitive values
				formData.append(formKey, value as string);
			}
		}
	} catch (e) {
		console.error(e)
	}
};

export default () => {
	const send = async (props: SendPDFMailProps) => {
		// Construct FormData
		const formData = new FormData();

		// Append props and attachments
		appendNested(formData, props);

		// Send FormData
		const response = await fetch("/api/mail", {
			method: "POST",
			headers: useRequestHeaders(["cookie"]),
			body: formData,
		});

		return response;
	};

	return { send };
};
