import { DatabaseError } from "../../../../utils/errors/DatabaseError";
import { AssessmentBlockEntity } from "../../domain/entities/AssessmentBlockEntity";
import { ContentBlockEntity } from "../../domain/entities/ContentBlockEntity";
import { InteractiveBlockEntity } from "../../domain/entities/InteractiveBlockEntity";
import type { LessonBlockEntity } from "../../domain/entities/LessonBlockEntity";
import type { ContentBlockData } from "../../domain/types/LessionEngine.type";
import {
	isLessonBlockType,
	type LessonBlockInsert,
	type LessonBlockJson,
	type LessonBlockRow,
	type LessonBlockUpdate,
} from "../types/lessonBlockDatabase.types";

export class LessonBlockMapper {
	static toDomain(row: LessonBlockRow): LessonBlockEntity {
		if (!isLessonBlockType(row.type)) {
			throw new DatabaseError(`Unsupported lesson block type: ${row.type}`);
		}

		const baseBlock = {
			id: row.id,
			lessonId: row.lesson_id,
			position: row.position,
		};

		switch (row.type) {
			case "content":
				return ContentBlockEntity.fromPrimitives({
					...baseBlock,
					type: "content",
					data: row.data as ContentBlockData,
				});

			case "interactive":
				if (!row.engine) {
					throw new DatabaseError("Interactive lesson block is missing engine");
				}
				return InteractiveBlockEntity.fromPrimitives({
					...baseBlock,
					type: "interactive",
					engine: row.engine,
					data: row.data as Record<string, unknown>,
				});

			case "assessment":
				if (!row.engine) {
					throw new DatabaseError("Assessment lesson block is missing engine");
				}
				return AssessmentBlockEntity.fromPrimitives({
					...baseBlock,
					type: "assessment",
					engine: row.engine,
					data: row.data as Record<string, unknown>,
				});

			default:
				throw new DatabaseError(`Unsupported lesson block type: ${row.type}`);
		}
	}

	static toInsert(block: LessonBlockEntity): LessonBlockInsert {
		const primitive = block.toPrimitives();

		return {
			id: primitive.id,
			lesson_id: primitive.lessonId,
			type: primitive.type,
			engine: "engine" in primitive ? primitive.engine : null,
			data: primitive.data as LessonBlockJson,
			position: primitive.position,
		};
	}

	static toUpdate(block: LessonBlockEntity): LessonBlockUpdate {
		const primitive = block.toPrimitives();

		return {
			lesson_id: primitive.lessonId,
			type: primitive.type,
			engine: "engine" in primitive ? primitive.engine : null,
			data: primitive.data as LessonBlockJson,
			position: primitive.position,
			updated_at: new Date().toISOString(),
		};
	}
}

export function mapRowToEntity(row: LessonBlockRow): LessonBlockEntity {
	return LessonBlockMapper.toDomain(row);
}
