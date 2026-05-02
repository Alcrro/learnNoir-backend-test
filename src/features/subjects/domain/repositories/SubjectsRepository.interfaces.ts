import { SubjectEntity } from "../entities/SubjectEntity";

export interface SubjectsRepository {
	create(data: SubjectEntity): Promise<SubjectEntity>;
	update(id: string, data: SubjectEntity): Promise<SubjectEntity>;
	delete(id: string): Promise<void>;

	findById(id: string): Promise<SubjectEntity | null>;
	findBySlug(slug: string): Promise<SubjectEntity | null>;

	findAll(): Promise<SubjectEntity[]>;
}
