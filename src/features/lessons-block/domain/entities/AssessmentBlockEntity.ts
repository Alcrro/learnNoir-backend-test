import type {
	AssessmentLessonBlock,
	BlockPayload,
} from "../types/LessionEngine.type";
import { BaseBlockEntity } from "./BaseBlockEntity";

export class AssessmentBlockEntity extends BaseBlockEntity {
	public readonly type = "assessment";
	private engine: string;
	private data: BlockPayload;

	constructor(params: {
		id?: string;
		lessonId: string;
		position: number;
		engine: string;
		data: BlockPayload;
	}) {
		super(params);

		if (!params.engine || !params.engine.trim()) {
			throw new Error("Assessment block requires an engine");
		}

		this.engine = params.engine;
		this.data = params.data;
	}

	update(engine: string, data: BlockPayload) {
		this.engine = engine;
		this.data = data;
	}

	toPrimitives(): AssessmentLessonBlock {
		return {
			id: this.id,
			lessonId: this.lessonId,
			type: "assessment",
			engine: this.engine,
			data: this.data,
			position: this.position,
		};
	}

	getEngine(): string {
		return this.engine;
	}

	getData(): BlockPayload {
		return this.data;
	}

	static fromPrimitives(params: AssessmentLessonBlock): AssessmentBlockEntity {
		return new AssessmentBlockEntity({
			id: params.id,
			lessonId: params.lessonId,
			position: params.position,
			engine: params.engine,
			data: params.data,
		});
	}
}
