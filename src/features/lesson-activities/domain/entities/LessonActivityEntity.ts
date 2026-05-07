import type { ActivityType, LessonActivity } from "../types/LessonActivity.type.ts";

export class LessonActivityEntity {
	public readonly id: string;
	public readonly lessonId: string;
	public readonly lessonBlockId: string | null;
	public readonly type: ActivityType;
	public readonly title: string;
	public readonly weight: number;
	public readonly required: boolean;
	public position: number;

	constructor(params: {
		id?: string;
		lessonId: string;
		lessonBlockId?: string | null;
		type: ActivityType;
		title: string;
		weight: number;
		required: boolean;
		position: number;
	}) {
		if (!params.lessonId.trim()) {
			throw new Error("LessonActivity must belong to a lesson");
		}
		if (!params.title.trim()) {
			throw new Error("LessonActivity title is required");
		}
		if (params.weight < 0) {
			throw new Error("LessonActivity weight must be non-negative");
		}
		if (!Number.isInteger(params.position) || params.position < 0) {
			throw new Error("Invalid LessonActivity position");
		}

		this.id = params.id ?? crypto.randomUUID();
		this.lessonId = params.lessonId.trim();
		this.lessonBlockId = params.lessonBlockId ?? null;
		this.type = params.type;
		this.title = params.title.trim();
		this.weight = params.weight;
		this.required = params.required;
		this.position = params.position;
	}

	moveTo(position: number) {
		if (!Number.isInteger(position) || position < 0) {
			throw new Error("Invalid LessonActivity position");
		}
		this.position = position;
	}

	toPrimitives(): LessonActivity {
		return {
			id: this.id,
			lessonId: this.lessonId,
			lessonBlockId: this.lessonBlockId,
			type: this.type,
			title: this.title,
			weight: this.weight,
			required: this.required,
			position: this.position,
		};
	}

	static fromPrimitives(params: LessonActivity): LessonActivityEntity {
		return new LessonActivityEntity(params);
	}
}
