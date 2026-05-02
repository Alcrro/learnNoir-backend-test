import type {
	ContentBlockData,
	ContentLessonBlock,
} from "../types/LessionEngine.type";
import { BaseBlockEntity } from "./BaseBlockEntity";

export class ContentBlockEntity extends BaseBlockEntity {
	public readonly type = "content";
	private data: ContentBlockData;

	constructor(params: {
		id?: string;
		lessonId: string;
		position: number;
		data: ContentBlockData;
	}) {
		super(params);

		if (!params.data) {
			throw new Error("Content data is required");
		}

		this.data = params.data;
	}

	update(data: ContentBlockData) {
		this.data = data;
	}

	toPrimitives(): ContentLessonBlock {
		return {
			id: this.id,
			lessonId: this.lessonId,
			type: "content",
			data: this.data,
			position: this.position,
		};
	}

	getData() {
		return this.data;
	}

	static fromPrimitives(params: ContentLessonBlock): ContentBlockEntity {
		return new ContentBlockEntity({
			id: params.id,
			lessonId: params.lessonId,
			position: params.position,
			data: params.data,
		});
	}
}
