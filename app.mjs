import dotenv from "dotenv"
dotenv.config()

const authToken = process.env.AUTHORIZATION
// // content.js

// let chatIds = []

// // Capture chat IDs as they appear on the page
// function captureChatIds() {
// 	document.querySelectorAll('a[href^="/c/"]').forEach(link => {
// 		const chatId = link.getAttribute("href").split("/c/")[1]
// 		if (chatId && !chatIds.includes(chatId)) {
// 			chatIds.push(chatId)
// 		}
// 	})
// }

// Search through each chat by navigating to its URL and retrieving content
async function searchInPage(keyword, pageId) {
	const chatUrl = `https://chatgpt.com/backend-api/conversation/${pageId}`
	const options = {
		headers: {
			accept: "*/*",
			"accept-language": "en-US,en;q=0.9",
			authorization: authToken,

			priority: "u=1, i",
			"sec-ch-ua":
				'"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": '"Windows"',
			"sec-fetch-dest": "empty",
			"sec-fetch-mode": "cors",
			"sec-fetch-site": "same-origin",
			Referer: `https://chatgpt.com/c/${pageId}`,
			"Referrer-Policy": "strict-origin-when-cross-origin",
		},
		body: null,
		method: "GET",
	}
	const matches = []

	// Programmatically navigate to each chat
	const data = await fetch(chatUrl, options)
	const page = await data.json()
	const chats = page.mapping

	for (const [key, chat] of Object.entries(chats)) {
		if (chat.message && chat.message.content && chat.message.content.parts) {
			const content = chat.message.content.parts
			if (content.some(part => part.includes(keyword))) {
				matches.push({
					chatId: key,
					content: chat.message.content.parts[0],
				})
			}
		}
	}

	return matches
}
const res = await searchInPage(
	"highlight",
	"892c0061-ef9b-4de0-b902-0119428ee55a",
)
console.log(JSON.stringify(res))
