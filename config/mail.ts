export default {
	message: {
		to: 'info@rightsplus.de',
	},
	smtp: {
		service: 'gmail',
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS,
		},
	},
}