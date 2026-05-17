import { VM } from "vm2";
import type { ExerciseTestCase, CodeRunResult, TestRunResult } from "../../domain/types/Exercise.type.ts";

export function runCode(userCode: string, testCases: ExerciseTestCase[]): CodeRunResult {
	const visibleCases = testCases.filter((tc) => !tc.isHidden);
	const results: TestRunResult[] = [];
	let totalTimeMs = 0;

	for (const tc of visibleCases) {
		const start = Date.now();
		try {
			const vm = new VM({ timeout: 2000, allowAsync: false });
			const result = vm.run(
				`${userCode}\nsolve(${JSON.stringify(tc.input)})`,
			);
			const elapsed = Date.now() - start;
			totalTimeMs += elapsed;
			const passed = JSON.stringify(result) === JSON.stringify(tc.expected);
			results.push({
				passed,
				input: tc.input,
				expected: tc.expected,
				actual: result,
				executionTimeMs: elapsed,
			});
		} catch (err) {
			const elapsed = Date.now() - start;
			totalTimeMs += elapsed;
			results.push({
				passed: false,
				input: tc.input,
				expected: tc.expected,
				actual: null,
				error: err instanceof Error ? err.message : String(err),
				executionTimeMs: elapsed,
			});
		}
	}

	const passedCount = results.filter((r) => r.passed).length;
	return { results, passedCount, totalCount: results.length, totalTimeMs };
}
