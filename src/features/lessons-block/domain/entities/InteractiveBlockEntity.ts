import type {
	InteractiveBlockDataMap,
	InteractiveEngine,
	InteractiveLessonBlock,
} from "../types/LessionEngine.type";
import { BaseBlockEntity } from "./BaseBlockEntity";

export class InteractiveBlockEntity<
	T extends InteractiveEngine,
> extends BaseBlockEntity {
	public readonly type = "interactive";
	private engine: T;
	private data: InteractiveBlockDataMap[T];

	constructor(params: {
		id?: string;
		lessonId: string;
		position: number;
		engine: T;
		data: InteractiveBlockDataMap[T];
	}) {
		super(params);

		this.engine = params.engine;
		this.data = params.data;
	}

	update(engine: T, data: InteractiveBlockDataMap[T]) {
		this.engine = engine;
		this.data = data;
	}

	toPrimitives(): InteractiveLessonBlock<T> {
		return {
			id: this.id,
			lessonId: this.lessonId,
			type: "interactive",
			position: this.position,
			engine: this.engine,
			data: this.data,
		};
	}

	getEngine(): T {
		return this.engine;
	}

	getData(): InteractiveBlockDataMap[T] {
		return this.data;
	}

	static fromPrimitives<T extends InteractiveEngine>(
		params: InteractiveLessonBlock<T>,
	): InteractiveBlockEntity<T> {
		return new InteractiveBlockEntity({
			id: params.id,
			lessonId: params.lessonId,
			position: params.position,
			engine: params.engine,
			data: params.data,
		});
	}
}
