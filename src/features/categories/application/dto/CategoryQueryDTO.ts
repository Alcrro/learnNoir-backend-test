export type CategoryQueryDTO = {
	name: string;
	slug: string;
	subjectId: string;
	modulesCount: number;
	lessonsCount: number;
	totalHours: number;
};

export type CategoryQueryDTOOutput = CategoryQueryDTO[];
