import { DatabaseError } from "../../../../utils/errors/DatabaseError.ts";
import { LessonActivityEntity } from "../../domain/entities/LessonActivityEntity.ts";
import {
	isActivityType,
	type LessonActivityInsert,
	type LessonActivityRow,
	type LessonActivityUpdate,
} from "../types/lessonActivityDatabase.types.ts";

export class LessonActivityMapper {
	static toDomain(row: LessonActivityRow): LessonActivityEntity {
		if (!isActivityType(row.type)) {
			throw new DatabaseError(`Unsupported activity type: ${row.type}`);
		}

		return new LessonActivityEntity({
			id: row.id,
			lessonId: row.lesson_id,
			lessonBlockId: row.lesson_block_id ?? null,
			theoryInteractionId: row.theory_interaction_id ?? null,
			type: row.type,
			title: row.title,
			weight: row.weight,
			required: row.required,
			position: row.position,
		});
	}

	static toInsert(activity: LessonActivityEntity): LessonActivityInsert {
		const p = activity.toPrimitives();
		return {
			id: p.id,
			lesson_id: p.lessonId,
			lesson_block_id: p.lessonBlockId ?? null,
			theory_interaction_id: p.theoryInteractionId ?? null,
			type: p.type,
			title: p.title,
			weight: p.weight,
			required: p.required,
			position: p.position,
		};
	}

	static toUpdate(activity: LessonActivityEntity): LessonActivityUpdate {
		const p = activity.toPrimitives();
		return {
			lesson_block_id: p.lessonBlockId ?? null,
			theory_interaction_id: p.theoryInteractionId ?? null,
			type: p.type,
			title: p.title,
			weight: p.weight,
			required: p.required,
			position: p.position,
		};
	}
}
