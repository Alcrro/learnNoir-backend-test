import { AppError } from "./AppError";

export class NotFoundError extends AppError {
	constructor(message = "Resource not fund") {
		super(message, 404);
	}
}
export class DatabaseError extends AppError {
	constructor(message = "Database Internal Error") {
		super(message, 500);
	}
}
export class BadRequestError extends AppError {
	constructor(message = "Bad request") {
		super(message, 400);
	}
}
export class ForbiddenError extends AppError {
	constructor(message = "Forbidden") {
		super(message, 403);
	}
}
