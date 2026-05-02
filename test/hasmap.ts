const nums = [2, 7, 11, 15];
const target = 9;

function twoSumHasMap(nums: number[], target: number) {
	const map = new Map<number, number>();
	for (let i = 0; i < nums.length; i++) {
		const complement = target - nums[i];

		if (map.has(complement)) {
			return [map.get(complement), i];
		}
		map.set(nums[i], i);
	}
}

console.log(twoSumHasMap(nums, target));
