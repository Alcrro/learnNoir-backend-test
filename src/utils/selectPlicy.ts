import { defaultPolicy, mathAlgoPolicy } from "../policy/promptPolicies";
import type { Policy } from "../types";

export function selectPolicy(prompt: string): Policy {
	if (/math|algorithm|sort|graph|complexity/i.test(prompt)) {
		return mathAlgoPolicy;
	}

	return defaultPolicy;
}
