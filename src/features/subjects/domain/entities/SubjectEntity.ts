import type { Subject } from "../types/Subjects.types";

export class SubjectEntity {
	private props: Subject;

	constructor(subject: Subject) {
		this.validate(subject);
		this.props = subject;
	}

	private validate(subject: Subject) {
		if (!subject.name || subject.name.trim().length < 2) {
			throw new Error("Invalid subject name");
		}

		if (!subject.slug) {
			throw new Error("Slug is required");
		}
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

	get description() {
		return this.props.description ?? null;
	}

	get position() {
		return this.props.position;
	}

	get created_at() {
		return this.props.created_at;
	}

	get updated_at() {
		return this.props.updated_at;
	}
}
