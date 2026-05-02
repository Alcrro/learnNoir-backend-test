import type {
	AssessmentBlockDataMap,
	AssessmentEngine,
	AssessmentLessonBlock,
} from "../types/LessionEngine.type";
import { BaseBlockEntity } from "./BaseBlockEntity";

export class AssessmentBlockEntity<
	T extends AssessmentEngine,
> extends BaseBlockEntity {
	public readonly type = "assessment";
	private engine: T;
	private data: AssessmentBlockDataMap[T];

	constructor(params: {
		id?: string;
		lessonId: string;
		position: number;
		engine: T;
		data: AssessmentBlockDataMap[T];
	}) {
		super(params);

		this.engine = params.engine;
		this.data = params.data;
	}

	update(engine: T, data: AssessmentBlockDataMap[T]) {
		this.engine = engine;
		this.data = data;
	}

	toPrimitives(): AssessmentLessonBlock<T> {
		return {
			id: this.id,
			lessonId: this.lessonId,
			type: "assessment",
			engine: this.engine,
			data: this.data,
			position: this.position,
		};
	}

	getEngine(): T {
		return this.engine;
	}

	getData(): AssessmentBlockDataMap[T] {
		return this.data;
	}

	static fromPrimitives<T extends AssessmentEngine>(
		params: AssessmentLessonBlock<T>,
	): AssessmentBlockEntity<T> {
		return new AssessmentBlockEntity({
			id: params.id,
			lessonId: params.lessonId,
			position: params.position,
			engine: params.engine,
			data: params.data,
		});
	}
}
