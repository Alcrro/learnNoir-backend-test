export type ProfileDTO = {
	id: string;
	username: string;
	email: string;
	role: role;
	avatarUrl?: string;
};

export type role = "student" | "teacher" | "admin";
