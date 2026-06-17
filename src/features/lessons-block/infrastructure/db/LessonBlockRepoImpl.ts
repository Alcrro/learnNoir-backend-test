import type { SupabaseClient } from "@supabase/supabase-js";
import {
	BadRequestError,
	DatabaseError,
	NotFoundError,
} from "../../../../utils/errors/DatabaseError";
import type { LessonBlockEntity } from "../../domain/entities/LessonBlockEntity";
import type { LessonBlockRepository } from "../../domain/repositories/LessonBlockRepository";
import { LessonBlockMapper } from "../mapper/LessonBlock.mapper";
import type { LessonBlockJson } from "../types/lessonBlockDatabase.types";
import type { Database } from "../../../../database.types";

export class LessonBlockRepoImpl implements LessonBlockRepository {
	constructor(private readonly db: SupabaseClient<Database>) {}

	async findById(id: string): Promise<LessonBlockEntity | null> {
		const { data, error } = await this.db
			.from("lesson_blocks")
			.select("*")
			.eq("id", id)
			.maybeSingle();

		if (error) {
			throw new DatabaseError(error.message);
		}

		return data ? LessonBlockMapper.toDomain(data) : null;
	}

	async findByLessonId(lessonId: string): Promise<LessonBlockEntity[]> {
		const { data, error } = await this.db
			.from("lesson_blocks")
			.select("*")
			.eq("lesson_id", lessonId)
			.order("position", { ascending: true });

		if (error) {
			throw new DatabaseError(error.message);
		}

		return (data ?? []).map((row) => LessonBlockMapper.toDomain(row));
	}

	async create(block: LessonBlockEntity): Promise<LessonBlockEntity> {
		const payload = LessonBlockMapper.toInsert(block);
		const { data, error } = await this.db
			.from("lesson_blocks")
			.insert(payload)
			.select("*")
			.single();

		if (error) {
			throw new DatabaseError(error.message);
		}

		return LessonBlockMapper.toDomain(data);
	}

	async update(id: string, block: LessonBlockEntity): Promise<void> {
		const payload = LessonBlockMapper.toUpdate(block);
		const { error, count } = await this.db
			.from("lesson_blocks")
			.update(payload, { count: "exact" })
			.eq("id", id);

		if (error) {
			throw new DatabaseError(error.message);
		}

		if (!count) {
			throw new NotFoundError("Lesson block not found");
		}
	}

	async delete(id: string): Promise<void> {
		const block = await this.findById(id);

		if (!block) {
			throw new NotFoundError("Lesson block not found");
		}

		const { error } = await this.db.from("lesson_blocks").delete().eq("id", id);

		if (error) {
			throw new DatabaseError(error.message);
		}

		const remainingBlocks = await this.findByLessonId(block.lessonId);
		await this.persistOrderedBlocks(remainingBlocks);
	}

	async reorder(
		lessonId: string,
		blockId: string,
		newPosition: number,
	): Promise<void> {
		if (!Number.isInteger(newPosition) || newPosition < 0) {
			throw new BadRequestError("New position must be a non-negative integer");
		}

		const blocks = await this.findByLessonId(lessonId);
		const currentIndex = blocks.findIndex((block) => block.id === blockId);

		if (currentIndex === -1) {
			throw new NotFoundError("Lesson block not found");
		}

		if (newPosition >= blocks.length) {
			throw new BadRequestError("New position is outside lesson block range");
		}

		const [blockToMove] = blocks.splice(currentIndex, 1);

		if (!blockToMove) {
			throw new NotFoundError("Lesson block not found");
		}

		blocks.splice(newPosition, 0, blockToMove);
		await this.persistOrderedBlocks(blocks);
	}

	async updateBlockData(id: string, data: Record<string, unknown>): Promise<void> {
		const { error, count } = await this.db
			.from("lesson_blocks")
			.update({ data: data as LessonBlockJson }, { count: "exact" })
			.eq("id", id);

		if (error) throw new DatabaseError(error.message);
		if (!count) throw new NotFoundError("Lesson block not found");
	}

	private async persistOrderedBlocks(blocks: LessonBlockEntity[]) {
		for (let index = 0; index < blocks.length; index += 1) {
			const block = blocks[index];

			if (!block) {
				continue;
			}

			block.moveTo(index);

			const { error } = await this.db
				.from("lesson_blocks")
				.update({
					position: block.position,
					updated_at: new Date().toISOString(),
				})
				.eq("id", block.id);

			if (error) {
				throw new DatabaseError(error.message);
			}
		}
	}
}
