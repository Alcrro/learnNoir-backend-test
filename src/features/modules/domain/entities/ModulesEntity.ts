import type { Module } from "../types/modules.type";

export class ModulesEntity {
	id: string;
	name: string;
	slug: string;
	private position: number;
	private categoryId: string;
	created_at: string;

	constructor(modules: Module) {
		this.id = modules.id;
		this.name = modules.name;
		this.slug = modules.slug;
		this.position = modules.position;
		this.categoryId = modules.categoryId;
		this.created_at = modules.created_at;
	}

	getPosition(): number {
		return this.position;
	}

	setPosition(position: number): void {
		this.position = position;
	}

	getCategoryId(): string {
		return this.categoryId;
	}

	setCategoryId(categoryId: string): void {
		this.categoryId = categoryId;
	}
}
