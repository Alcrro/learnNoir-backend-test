export const bubbleSortDocumentation = {
	id: "bubble-sort",
	idea: {
		title: "Ideea centrală",
		principle: {
			label: "UN SINGUR PRINCIPIU",
			text:
				'Bubble Sort face un singur lucru repetat: compară doi vecini și îi interschimbă dacă sunt în ordinea greșită. Elementele mari "urcă" spre dreapta ca niște bule — de unde vine numele.',
		},
		analogy: {
			label: "ANALOGIE — CUM SĂ ÎȚI AMINTEȘTI",
			text:
				"Imaginează-ți cărți de joc pe masă. Treci cu degetul de la stânga la dreapta și de fiecare dată când găsești o carte mare lângă una mică, le schimbi. Faci asta de mai multe ori până nu mai ai nimic de schimbat.",
		},
	},
	howItWorks: {
		title: "Cum funcționează",
		meta: {
			stepsCount: 4,
		},
		steps: [
			{
				id: 1,
				title: "Pornești din stânga",
				text:
					"Compari elementele de la pozițiile i și i+1 unul câte unul, de la capătul stâng spre dreapta.",
				inlineCode: ["i", "i+1"],
			},
			{
				id: 2,
				title: "Interschimbi dacă e nevoie",
				text:
					"Dacă arr[i] > arr[i+1], le schimbi locul. Dacă nu, mergi mai departe fără să faci nimic.",
				inlineCode: ["arr[i] > arr[i+1]"],
			},
			{
				id: 3,
				title: 'La fiecare trecere, un element se "așează"',
				text:
					"După prima trecere, cel mai mare element e garantat la capătul drept. După a doua, al doilea cel mai mare — și tot așa.",
				example: {
					initial: [5, 8, 3, 1, 4],
					states: [
						{
							array: [5, 8, 3, 1, 4],
							action: "comparare 5 vs 8",
							highlights: {
								compare: [0, 1],
							},
						},
						{
							array: [5, 3, 8, 1, 4],
							action: "8 > 3 → interschimbare",
							highlights: {
								swap: [1, 2],
							},
						},
						{
							array: [5, 3, 1, 4, 8],
							action: "8 ajunge la final",
							highlights: {
								sorted: [4],
							},
						},
					],
					legend: {
						compare: "comparare",
						swap: "interschimbare",
						sorted: "sortat",
					},
				},
			},
			{
				id: 4,
				title: "Optimizare: dacă n-ai schimbat nimic, te oprești",
				text:
					"Dacă o trecere completă nu produce nicio interschimbare, array-ul e deja sortat. Aceasta reduce cazul optim la O(n) în loc de O(n²).",
				inlineCode: ["O(n)", "O(n²)"],
			},
		],
	},
	complexity: {
		title: "Complexitate",
		meta: "timp + spațiu",
		cases: [
			{
				type: "worst",
				label: "Cazul cel mai rău",
				time: "O(n²)",
				description: "Array sortat invers — fiecare element trebuie mutat",
			},
			{
				type: "average",
				label: "Cazul mediu",
				time: "O(n²)",
				description: "Date aleatoare — în medie tot pătratic",
			},
			{
				type: "best",
				label: "Cazul optim",
				time: "O(n)",
				description: "Array deja sortat + optimizarea cu flag",
			},
		],
		space: "O(1)",
	},
} as const;
