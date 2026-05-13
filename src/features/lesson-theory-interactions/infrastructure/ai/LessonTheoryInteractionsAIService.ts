import OpenAI from "openai";
import { env } from "../../../../config/env.ts";
import type {
	TheoryInteractionComponentType,
	TheoryInteractionContent,
	LessonContextForAI,
} from "../../domain/types/LessonTheoryInteraction.type.ts";

// ── Base system prompt ────────────────────────────────────────────────────────

const BASE = `Ești un expert în scriere de conținut educațional.
Generezi conținut în ROMÂNĂ, adaptat subiectului și tipului lecției primit.
Returnezi NUMAI JSON valid, fără explicații, fără markdown fences.
Conținutul trebuie să fie pedagogic corect, concis și adaptat pentru studenți.`;

// ── Per-component system prompts (generic, not subject-specific) ──────────────

const COMPONENT_POLICIES: Record<TheoryInteractionComponentType, string> = {
	predict_prompt: `${BASE}
Generezi o întrebare de predicție care activează cunoștințele anterioare înainte de a citi teoria.
Întrebarea este concretă, nu are răspuns greșit — scopul e gândirea, nu testarea.
Return: { "question": "<întrebare în română>" }`,

	concrete_example: `${BASE}
Generezi un exemplu concret pas cu pas care trasează execuția / aplicarea conceptului.
Fiecare pas are o descriere clară în română și un label scurt.
Adaptezi formatul la tipul lecției (algoritm, formulă matematică, structură de date etc.).
Return: {
  "title": "<titlu scurt>",
  "steps": [{ "label": "<label>", "description": "<explicație în română>", "state": <orice JSON relevant pentru vizualizare> }]
}`,

	elaboration: `${BASE}
Generezi o întrebare elaborativă "De ce funcționează asta?" + răspuns detaliat care explică logica sau invarianta.
Return: { "question": "<De ce...? în română>", "answer": "<explicație detaliată în română>" }`,

	interactive_exercise: `${BASE}
Generezi un exercițiu interactiv specific tipului de lecție:
- Pentru algoritmi / CS: derivare de complexitate (ghicire → derivare pas cu pas)
- Pentru matematică: demonstrație pas cu pas sau derivare de formulă
- Pentru alte subiecte: exercițiu de aplicare a conceptului
Structura JSON se adaptează la tipul exercițiului — include un câmp "type" pentru a identifica ce randezi.
Return: { "type": "<tip_exercitiu>", "data": { ...structura relevanta... } }`,

	transfer: `${BASE}
Generezi 2-3 scenarii reale unde studentul decide dacă conceptul / algoritmul / metoda este potrivită.
Scenariile sunt concrete, variate, cu feedback clar.
Return: { "scenarios": [{ "id": "s1", "scenario": "<scenariu concret în română>", "answer": "yes" | "no", "explanation": "<de ce, în română>" }] }`,

	recall_1: `${BASE}
Generezi 1 întrebare MCQ despre conceptul sau pașii principali din lecție (nu complexitate sau detalii tehnice avansate).
Testează înțelegerea de bază.
Return: { "questions": [{ "id": "r1", "question": "<întrebare în română>", "options": ["<A>","<B>","<C>","<D>"], "correctIndex": <0-3>, "explanation": "<de ce e corect, în română>" }] }`,

	recall_2: `${BASE}
Generezi 1 întrebare MCQ despre proprietățile tehnice, complexitate sau detalii specifice ale lecției.
Testează înțelegerea mai profundă.
Return: { "questions": [{ "id": "r2", "question": "<întrebare în română>", "options": ["<A>","<B>","<C>","<D>"], "correctIndex": <0-3>, "explanation": "<de ce e corect, în română>" }] }`,

	recall_final: `${BASE}
Generezi 1 întrebare MCQ de sinteză — poate fi o predicție, o comparație, sau o aplicare reală.
Testează înțelegerea holistică.
Return: { "questions": [{ "id": "r3", "question": "<întrebare în română>", "options": ["<A>","<B>","<C>","<D>"], "correctIndex": <0-3>, "explanation": "<de ce e corect, în română>" }] }`,
};

// ── User prompt builder ───────────────────────────────────────────────────────

function buildUserPrompt(component: TheoryInteractionComponentType, ctx: LessonContextForAI): string {
	const keyPointsText = ctx.keyPoints?.length
		? `\nPuncte cheie:\n${ctx.keyPoints.map((p) => `- ${p}`).join("\n")}`
		: "";

	const examplesText = ctx.examples?.length
		? `\nExemple:\n${ctx.examples.map((e) => `- ${e}`).join("\n")}`
		: "";

	const contextBlock = `Subiect: ${ctx.subject}
Tip lecție: ${ctx.lessonType}
Titlu: ${ctx.title}
Conținut principal:
${ctx.mainContent}${keyPointsText}${examplesText}`;

	const componentGoals: Record<TheoryInteractionComponentType, string> = {
		predict_prompt: "Generează o întrebare de predicție pentru această lecție.",
		concrete_example: "Generează un exemplu concret pas cu pas pentru această lecție.",
		elaboration: "Generează o întrebare elaborativă De ce funcționează asta? cu răspuns detaliat.",
		interactive_exercise: "Generează un exercițiu interactiv adecvat acestui tip de lecție.",
		transfer: "Generează 2-3 scenarii de transfer pentru această lecție.",
		recall_1: "Generează 1 întrebare MCQ de bază despre această lecție.",
		recall_2: "Generează 1 întrebare MCQ tehnică / mai detaliată despre această lecție.",
		recall_final: "Generează 1 întrebare MCQ de sinteză pentru această lecție.",
	};

	return `${contextBlock}\n\n${componentGoals[component]}`;
}

// ── Service ───────────────────────────────────────────────────────────────────

export class LessonTheoryInteractionsAIService {
	private openai: OpenAI;

	constructor() {
		this.openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
	}

	async generate(
		component: TheoryInteractionComponentType,
		ctx: LessonContextForAI,
	): Promise<TheoryInteractionContent> {
		const systemPrompt = COMPONENT_POLICIES[component];
		const userPrompt = buildUserPrompt(component, ctx);

		const response = await this.openai.chat.completions.create({
			model: env.OPENAI_CONTENT_MODEL,
			max_completion_tokens: 2000,
			temperature: 0.5,
			response_format: { type: "json_object" },
			messages: [
				{ role: "system", content: systemPrompt },
				{ role: "user", content: userPrompt },
			],
		});

		const raw = response.choices[0]?.message?.content ?? "{}";
		return JSON.parse(raw) as TheoryInteractionContent;
	}
}
