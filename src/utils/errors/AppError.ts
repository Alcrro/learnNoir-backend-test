export class AppError extends Error {
	public statusCode: number;
	public isOperational: boolean;

	constructor(message: string, statusode = 500) {
		super(message);

		this.statusCode = statusode;
		this.isOperational = true;

		Error.captureStackTrace(this, this.constructor);
	}
}
