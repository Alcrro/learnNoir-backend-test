export type LessonContentNode =
	| ConceptBlock
	| StepsBlock
	| ExampleBlock
	| ComplexityBlock
	| FormulaBlock
	| ProofBlock
	| TheoremBlock;

type FormulaBlock = {
	type: "formula";
	latex: string;
	description?: string;
};
type ProofBlock = {
	type: "proof";
	steps: {
		text: string;
		latex?: string;
	}[];
};

type TheoremBlock = {
	type: "theorem";
	title: string;
	statement: string;
};

type ConceptBlock = {
	type: "concept";
	title: string;

	sections: {
		label: string;
		text: string;
	}[];
};

type StepsBlock = {
	type: "steps";
	steps: {
		title: string;
		content: TextBlock["content"];
		example?: ExampleBlock;
	}[];
};

type ExampleBlock = {
	type: "example";
	initial: number[];
	states: {
		array: number[];
		action: string;
		highlights?: {
			compare?: number[];
			swap?: number[];
			sorted?: number[];
		};
	}[];
};

type TextBlock = {
	type: "text";
	content: Array<
		| { type: "paragraph"; text: string }
		| { type: "inlineCode"; code: string }
		| { type: "label"; text: string }
	>;
};

type ComplexityBlock = {
	type: "complexity";
	cases: {
		type: "best" | "average" | "worst";
		time: string;
		description: string;
	}[];
	space: string;
};
