import type { ILesson, LessonAuthor, LessonStatus } from "../types/Lesson.type";

export class LessonEntity {
	public readonly id: string;
	public readonly moduleId: string;
	public gradeLevelId: string | null;
	public title: string;
	public slug: string;
	public description?: string | null;
	public durationSeconds: number;
	public position: number | null;
	public isActive: boolean;
	private status: LessonStatus;
	public authors: LessonAuthor[];

	public readonly createdAt: Date;
	public updatedAt: Date;

	constructor(params: {
		id?: string;
		moduleId: string;
		gradeLevelId?: string | null;
		title: string;
		slug?: string;
		description?: string | null;
		durationSeconds?: number;
		position?: number | null;
		isActive?: boolean;
		status?: LessonStatus;
		authors?: LessonAuthor[];
		createdAt?: Date;
		updatedAt?: Date;
	}) {
		this.validate(params);

		this.id = params.id ?? crypto.randomUUID();
		this.moduleId = params.moduleId;
		this.gradeLevelId = params.gradeLevelId ?? null;
		this.title = params.title;
		this.slug = params.slug ?? createLessonSlug(params.title);
		this.description = params.description ?? null;
		this.durationSeconds = params.durationSeconds ?? 0;
		this.position = params.position === undefined ? 0 : params.position;
		this.isActive = params.isActive ?? true;
		this.status = params.status ?? "draft";
		this.authors = params.authors ?? [];

		this.createdAt = params.createdAt ?? new Date();
		this.updatedAt = params.updatedAt ?? new Date();
	}

	publish() {
		if (this.title.trim().length < 3) {
			throw new Error("Lesson title is too short");
		}

		this.status = "published";
		this.updatedAt = new Date();
	}

	updateTitle(title: string) {
		if (!title || title.length < 3) {
			throw new Error("Title too short");
		}

		this.title = title;
		this.slug = createLessonSlug(title);
		this.updatedAt = new Date();
	}

	review() {
		this.status = "reviewed";
		this.updatedAt = new Date();
	}

	getStatus() {
		return this.status;
	}

	completeLesson(_userId: string) {}
	calculateProgress() {}
	canBeAccessedBy(_user: string) {}

	private validate(params: Partial<ILesson>) {
		if (!params.title || params.title.length < 3) {
			throw new Error("Invalid title");
		}

		if (!params.moduleId) {
			throw new Error("Module is required");
		}

		if (params.durationSeconds !== undefined && params.durationSeconds < 0) {
			throw new Error("Duration must be a positive number");
		}
	}
}

function createLessonSlug(title: string) {
	return title
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

export { LessonEntity as Lesson };
