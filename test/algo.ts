// Restricții
// ❌ NU crea array nou
// ✅ Modifici in-place
// ⏱ Complexitate dorită: O(n)
// 💾 Spațiu: O(1)

// in variana  cu array -- [array[start], array[end]] = [array[end], array[start]] --
//  se foloseste o variabila temorara ascunsa

function reverse(array: number[]): void {
	let start = 0;
	let end = array.length - 1;

	while (start < end) {
		//crreezi variabila temporara
		// o asignezi primei valori al array ului
		// const temp = array[start];

		// // modifici primul element al array  cu valoarea ultimului element
		// array[start] = array[end];

		// //assignam ultimului element valoarea primului element
		// array[end] = temp;

		[array[start], array[end]] = [array[end], array[start]];

		// Destructuring:
		// 1. Se evaluează partea dreaptă și se creează un array temporar
		// 2. Valorile sunt apoi asignate în ordine la stânga
		// let temp = [valoareaEnd, valoareStart];
		// array[start] = temp[0];
		// array[end] = temp[1];

		start++;
		end--;
	}
}

// const mere = [1, 2, 3, 4, 5];
// reverse(mere);
// console.log(mere);

function reverseRange(array: number[], l: number, r: number) {
	while (l < r) {
		const temp = arr[l];
		array[l] = array[r];
		array[r] = temp;

		l++;
		r--;
	}
}

const arr = [1, 2, 3, 4, 5];
reverseRange(arr, 1, 3);
// console.log(arr); // [1,4,3,2,5]

function isPalindrome(array: number[]) {
	let start = 0;
	let end = array.length - 1;

	while (start < end) {
		if (array[start] !== array[end]) {
			return false;
		}

		start++;
		end--;
	}
	return true;
}

// console.log(isPalindrome([1, 2, 3, 2, 1])); //-> true
// console.log(isPalindrome([1, 2, 3])); //-> false

function reverseString(value: string) {
	return [...value].reverse().join("");
}
// console.log(reverseString("abc")); // -> "cba"

const arrnew = [0, 1, 0, 3, 12];
function controlPointers(arrnew: number[]) {
	let start = 0;
	let end = arrnew.length - 1;

	while (start < end) {
		if (arrnew[start] === 0) {
			[arrnew[start], arrnew[end]] = [arrnew[end], arrnew[start]];
		}

		start++;
		end--;
	}
}

// controlPointers(arrnew);

function twoSum(value: number[], target: number): [number, number] | null {
	let left = 0;
	let right = value.length - 1;
	while (left < right) {
		const sum = value[left] + value[right];

		if (sum === target) {
			return [left, right];
		} else if (sum < target) {
			left++;
		} else {
			right--;
		}
	}
	return null;
}

const arrne = [1, 2, 3, 4, 6];
const target = 6;

console.log(twoSum(arrne, target));
