export type ContentBlockData = {
	content: LessonContentNode;
};

export type InteractiveBlockDataMap = {
	"algorithm:bubble-sort": {
		initialArray: number[];
	};
	"math:formula": {
		formula: string;
	};
};

export type AssessmentBlockDataMap = {
	"quiz:mcq": {
		question: string;
		options: string[];
		correctIndex: number;
	};
	"quiz:input": {
		question: string;
		correctAnswer: string | number;
	};
	"quiz:code": {
		question: string;
		correctCode: string;
	};
};

export type InteractiveEngine = keyof InteractiveBlockDataMap;
export type AssessmentEngine = keyof AssessmentBlockDataMap;

type LessonContentNode =
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
		content: string;
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

type ComplexityBlock = {
	type: "complexity";
	cases: {
		type: "best" | "average" | "worst";
		time: string;
		description: string;
	}[];
	space: string;
};
