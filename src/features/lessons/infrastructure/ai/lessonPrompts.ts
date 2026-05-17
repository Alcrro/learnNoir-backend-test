export const lessonPrompts = {
	title: (topic: string) =>
		`Write a concise, descriptive lesson title (max 70 characters) for the topic: "${topic}". Return only the title, no quotes.`,

	description: (topic: string) =>
		`Write a 2–3 sentence lesson description for the topic: "${topic}". Explain what the student will learn and why it matters. Be specific and engaging. Return only the description.`,

	content: (topic: string) =>
		`Write the main theory content for a lesson about "${topic}". Use clear headings and structured explanations covering: what it is, how it works, key properties, and real-world relevance. Target an intermediate-level CS student. Max 600 words.`,

	structuredBlocks: (topic: string) =>
		`Generate a complete structured lesson about "${topic}". Cover: the concept definition, step-by-step explanation, and time/space complexity if applicable.`,

	improveText: (text: string, context?: string) =>
		context ? `Context: ${context}\n\nText to improve:\n${text}` : `Text to improve:\n${text}`,

	reviewLesson: (lesson: { title: string; description: string; content: string }) =>
		`Review this lesson:\n\nTitle: ${lesson.title}\nDescription: ${lesson.description}\n\nContent:\n${lesson.content}`,

	generateMetadata: (title: string, moduleName: string) =>
		`Lesson title: "${title}"\nModule: "${moduleName}"\n\nReturn JSON: { "description": "...", "durationMinutes": <integer> }`,

	generateQuizQuestions: (content: string, count: number) =>
		`Generate ${count} multiple-choice questions for this lesson content:\n\n${content}`,
};
