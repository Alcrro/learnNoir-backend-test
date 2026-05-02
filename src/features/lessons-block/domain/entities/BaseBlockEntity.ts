export abstract class BaseBlockEntity {
	public readonly id: string;
	public readonly lessonId: string;
	public position: number;

	constructor(params: { id?: string; lessonId: string; position: number }) {
		const lessonId = params.lessonId.trim();

		if (!lessonId) {
			throw new Error("Lesson block must belong to a lesson");
		}

		this.validatePosition(params.position);

		this.id = params.id ?? crypto.randomUUID();
		this.lessonId = lessonId;
		this.position = params.position;
	}

	moveTo(position: number) {
		this.validatePosition(position);
		this.position = position;
	}

	private validatePosition(position: number) {
		if (!Number.isInteger(position) || position < 0) {
			throw new Error("Invalid lesson block position");
		}
	}
}
