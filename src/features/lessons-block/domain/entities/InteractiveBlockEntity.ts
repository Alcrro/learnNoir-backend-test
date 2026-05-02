import type {
	BlockPayload,
	InteractiveLessonBlock,
} from "../types/LessionEngine.type";
import { BaseBlockEntity } from "./BaseBlockEntity";

export class InteractiveBlockEntity extends BaseBlockEntity {
	public readonly type = "interactive";
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
			throw new Error("Interactive block requires an engine");
		}

		this.engine = params.engine;
		this.data = params.data;
	}

	update(engine: string, data: BlockPayload) {
		this.engine = engine;
		this.data = data;
	}

	toPrimitives(): InteractiveLessonBlock {
		return {
			id: this.id,
			lessonId: this.lessonId,
			type: "interactive",
			position: this.position,
			engine: this.engine,
			data: this.data,
		};
	}

	getEngine(): string {
		return this.engine;
	}

	getData(): BlockPayload {
		return this.data;
	}

	static fromPrimitives(params: InteractiveLessonBlock): InteractiveBlockEntity {
		return new InteractiveBlockEntity({
			id: params.id,
			lessonId: params.lessonId,
			position: params.position,
			engine: params.engine,
			data: params.data,
		});
	}
}
