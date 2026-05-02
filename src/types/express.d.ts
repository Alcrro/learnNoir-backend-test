// src/types/express.d.ts

import type { role } from "../features/profiles/application/dto/ProfileDTO.type";

declare global {
	namespace Express {
		interface Request {
			user?: {
				userRole: role;
			};
		}
	}
}
