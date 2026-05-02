export type Module = {
	id: string;
	categoryId: string;

	name: string;
	slug: string;

	description?: string;

	position: number;

	// is_published: boolean;

	created_at: string;
};
