import type {
	LessonTheoryInteraction,
	TheoryInteractionComponentType,
	TheoryInteractionContent,
	LessonContextForAI,
} from "../../domain/types/LessonTheoryInteraction.type.ts";

export type GenerateInteractionDTO = {
	lessonId: string;
	componentType: TheoryInteractionComponentType;
	lessonContext: LessonContextForAI;
	userId: string | null;
};

export type ApproveInteractionDTO = {
	interactionId: string;
};

export type UpdateInteractionDTO = {
	interactionId: string;
	content: TheoryInteractionContent;
};

export type InteractionResponseDTO = {
	id: string;
	lessonId: string;
	componentType: TheoryInteractionComponentType;
	content: TheoryInteractionContent;
	status: LessonTheoryInteraction["status"];
	version: number;
	createdAt: string;
	updatedAt: string;
};

export function toResponseDTO(i: LessonTheoryInteraction): InteractionResponseDTO {
	return {
		id: i.id,
		lessonId: i.lessonId,
		componentType: i.componentType,
		content: i.content,
		status: i.status,
		version: i.version,
		createdAt: i.createdAt,
		updatedAt: i.updatedAt,
	};
}

export type { LessonContextForAI };
