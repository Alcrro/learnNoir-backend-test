// Max lengths prevent prompt injection via oversized inputs
const MAX_TOPIC = 200;
const MAX_TEXT = 4000;
const MAX_CONTENT = 8000;

const cap = (s: string, max: number) => s.slice(0, max);

// Structured XML delimiters isolate user input from instructions,
// making instruction injection significantly harder.
export const lessonPrompts = {
	title: (topic: string) =>
		`Write a concise, descriptive lesson title (max 70 characters) for the topic below. Return only the title, no quotes.\n\n<topic>${cap(topic, MAX_TOPIC)}</topic>`,

	description: (topic: string) =>
		`Write a 2–3 sentence lesson description for the topic below. Explain what the student will learn and why it matters. Be specific and engaging. Return only the description.\n\n<topic>${cap(topic, MAX_TOPIC)}</topic>`,

	content: (topic: string) =>
		`Write the main theory content for a lesson about the topic below. Use clear headings and structured explanations covering: what it is, how it works, key properties, and real-world relevance. Target an intermediate-level CS student. Max 600 words.\n\n<topic>${cap(topic, MAX_TOPIC)}</topic>`,

	structuredBlocks: (topic: string, lessonContext?: { title?: string; description?: string }) => {
		const contextBlock = lessonContext
			? `\n\n<lesson_title>${cap(lessonContext.title ?? "", MAX_TOPIC)}</lesson_title>${lessonContext.description ? `\n<lesson_description>${cap(lessonContext.description, MAX_TEXT)}</lesson_description>` : ""}`
			: "";
		return `Generate a complete structured lesson block strictly about the topic and lesson context below. Do not introduce unrelated concepts. Cover: the concept definition, step-by-step explanation, and time/space complexity if applicable.${contextBlock}\n\n<topic>${cap(topic, MAX_TEXT)}</topic>`;
	},

	improveText: (text: string, context?: string) =>
		context
			? `<context>${cap(context, MAX_TEXT)}</context>\n\n<text_to_improve>${cap(text, MAX_TEXT)}</text_to_improve>`
			: `<text_to_improve>${cap(text, MAX_TEXT)}</text_to_improve>`,

	reviewLesson: (lesson: { title: string; description: string; content: string }) =>
		`Review this lesson:\n\n<title>${cap(lesson.title, MAX_TOPIC)}</title>\n<description>${cap(lesson.description, MAX_TEXT)}</description>\n<content>${cap(lesson.content, MAX_CONTENT)}</content>`,

	generateMetadata: (title: string, moduleName: string) =>
		`<lesson_title>${cap(title, MAX_TOPIC)}</lesson_title>\n<module>${cap(moduleName, MAX_TOPIC)}</module>\n\nReturn JSON: { "description": "...", "durationMinutes": <integer> }`,

	generateQuizQuestions: (content: string, count: number) =>
		`Generate ${count} multiple-choice questions for the lesson content below.\n\n<content>${cap(content, MAX_CONTENT)}</content>`,
};
