export type ModuleCardDTO = {
	id: string;
	name: string;
	slug: string;
	position: number;
	lessonCount: number;
	estimatedHours: number;
	importance: "essential" | "normal" | "optional";
};

export type CategoryWithModulesDTO = {
	id: string;
	name: string;
	slug: string;
	position: number;
	modules: ModuleCardDTO[];
	totalLessons: number;
};

export type CategoryWithModulesDTOOutput = CategoryWithModulesDTO[];
