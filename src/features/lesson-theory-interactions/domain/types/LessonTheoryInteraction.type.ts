export const THEORY_INTERACTION_COMPONENTS = [
	"predict_prompt",
	"concrete_example",
	"elaboration",
	"interactive_exercise",
	"transfer",
	"recall_1",
	"recall_2",
	"recall_final",
] as const;

export type TheoryInteractionComponentType = (typeof THEORY_INTERACTION_COMPONENTS)[number];

export type TheoryInteractionStatus = "draft" | "approved";

// ── Content is generic JSON — the AI decides the shape based on subject/lessonType.
// Frontend renderers pick up content based on componentType + lesson context.
export type TheoryInteractionContent = Record<string, unknown> | unknown[];

// ── Entity ───────────────────────────────────────────────────────────────────

export type LessonTheoryInteraction = {
	id: string;
	lessonId: string;
	componentType: TheoryInteractionComponentType;
	content: TheoryInteractionContent;
	status: TheoryInteractionStatus;
	version: number;
	createdAt: string;
	updatedAt: string;
	createdBy: string | null;
};

// ── Generic lesson context sent by the frontend when triggering generation ───
// Subjects: "computer-science", "mathematics", "data-structures", etc.
// lessonType: "algorithm", "data-structure", "theorem", "concept", etc.
// mainContent: plain-text summary of the lesson (key idea + explanation)

export type LessonContextForAI = {
	subject: string;
	lessonType: string;
	title: string;
	mainContent: string;
	// Optional structured hints — frontend sends what it has, AI uses what's relevant
	keyPoints?: string[];
	examples?: string[];
};
