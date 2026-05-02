export type CategoryProps = {
	id: string;
	name: string;
	slug: string;
	subjectId: string;
	position: number;
	createdAt: Date;
	updatedAt: Date;
};
export class CategoryEntity {
	private props: CategoryProps;

	private constructor(props: CategoryProps) {
		this.props = props;
	}

	//factory
	static create(input: {
		name: string;
		subjectId: string;
		position?: number;
	}): CategoryEntity {
		if (!input.name || input.name.length < 2) {
			throw new Error("Invalid category name");
		}

		const now = new Date();

		return new CategoryEntity({
			id: crypto.randomUUID(),
			name: input.name,
			slug: CategoryEntity.generateSlug(input.name),
			subjectId: input.subjectId,
			position: input.position ?? 0,
			createdAt: now,
			updatedAt: now,
		});
	}

	updateName(name: string) {
		if (name.length < 2) {
			throw new Error("invalid name");
		}

		this.props.name = name;
		this.props.slug = CategoryEntity.generateSlug(name);
		this.touch();
	}

	updatePosition(position: number) {
		this.props.position = position;
		this.touch();
	}

	private touch() {
		this.props.updatedAt = new Date();
	}
	get id() {
		return this.props.id;
	}

	get name() {
		return this.props.name;
	}

	get slug() {
		return this.props.slug;
	}

	get subjectId() {
		return this.props.subjectId;
	}

	get position() {
		return this.props.position;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	static generateSlug(name: string): string {
		return name
			.toLowerCase()
			.normalize("NFKD")
			.replace(/[\u0300-\u036f]/g, "")
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/(^-|-$)/g, "");
	}
}
