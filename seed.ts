import { supabase } from "./src/core/db/supabaseClient.ts";

// ── Data from frontend subjects.data.ts ──────────────────────────────────────

const CATEGORY_META = [
	{ key: "fundamentals", name: "Fundamentals", position: 1 },
	{ key: "algorithms", name: "Algorithms", position: 2 },
	{ key: "datastructures", name: "Data Structures", position: 3 },
	{ key: "systems", name: "Systems", position: 4 },
	{ key: "web", name: "Web Development", position: 5 },
	{ key: "databases", name: "Databases", position: 6 },
	{ key: "theory", name: "CS Theory", position: 7 },
	{ key: "system-design", name: "System Design", position: 8 },
];

const SUBJECTS_RAW = [
	// FUNDAMENTALS
	{ id: "programming-basics", category: "fundamentals", title: "Programming Basics", position: 1 },
	{ id: "oop", category: "fundamentals", title: "Object-Oriented Programming", position: 2 },
	{ id: "functional", category: "fundamentals", title: "Functional Programming", position: 3 },
	{ id: "git", category: "fundamentals", title: "Git & Version Control", position: 4 },
	// ALGORITHMS
	{ id: "sorting-algorithms", category: "algorithms", title: "Sorting Algorithms", position: 1 },
	{ id: "searching-algorithms", category: "algorithms", title: "Searching Algorithms", position: 2 },
	{ id: "dynamic-programming", category: "algorithms", title: "Dynamic Programming", position: 3 },
	{ id: "greedy", category: "algorithms", title: "Greedy Algorithms", position: 4 },
	{ id: "graph-algorithms", category: "algorithms", title: "Graph Algorithms", position: 5 },
	// DATA STRUCTURES
	{ id: "arrays-strings", category: "datastructures", title: "Arrays & Strings", position: 1 },
	{ id: "linked-lists", category: "datastructures", title: "Linked Lists", position: 2 },
	{ id: "stacks-queues", category: "datastructures", title: "Stacks & Queues", position: 3 },
	{ id: "trees", category: "datastructures", title: "Trees", position: 4 },
	{ id: "hash-tables", category: "datastructures", title: "Hash Tables", position: 5 },
	{ id: "graphs", category: "datastructures", title: "Graphs", position: 6 },
	// SYSTEMS
	{ id: "os", category: "systems", title: "Operating Systems", position: 1 },
	{ id: "networking", category: "systems", title: "Computer Networks", position: 2 },
	{ id: "computer-architecture", category: "systems", title: "Computer Architecture", position: 3 },
	// WEB
	{ id: "html-css", category: "web", title: "HTML & CSS", position: 1 },
	{ id: "javascript", category: "web", title: "JavaScript", position: 2 },
	{ id: "react", category: "web", title: "React", position: 3 },
	{ id: "nodejs", category: "web", title: "Node.js & Express", position: 4 },
	// DATABASES
	{ id: "sql", category: "databases", title: "SQL & Relational DBs", position: 1 },
	{ id: "nosql", category: "databases", title: "NoSQL Databases", position: 2 },
	{ id: "db-design", category: "databases", title: "Database Design", position: 3 },
	// THEORY
	{ id: "discrete-math", category: "theory", title: "Discrete Mathematics", position: 1 },
	{ id: "complexity-theory", category: "theory", title: "Complexity Theory", position: 2 },
	// SYSTEM DESIGN
	{ id: "sd-scalability", category: "system-design", title: "Scalability & Performance", position: 1 },
	{ id: "sd-reliability", category: "system-design", title: "Reliability & Availability", position: 2 },
	{ id: "sd-cap-theorem", category: "system-design", title: "CAP Theorem & Consistency", position: 3 },
	{ id: "sd-caching", category: "system-design", title: "Caching Strategies", position: 4 },
	{ id: "sd-load-balancers", category: "system-design", title: "Load Balancers", position: 5 },
	{ id: "sd-message-queues", category: "system-design", title: "Message Queues", position: 6 },
	{ id: "sd-api-design", category: "system-design", title: "API Design", position: 7 },
	{ id: "sd-database-scaling", category: "system-design", title: "Database Scaling", position: 8 },
	{ id: "sd-microservices", category: "system-design", title: "Microservices Architecture", position: 9 },
	{ id: "sd-url-shortener", category: "system-design", title: "Case Study: URL Shortener", position: 10 },
	{ id: "sd-social-feed", category: "system-design", title: "Case Study: Social Media Feed", position: 11 },
	{ id: "sd-video-streaming", category: "system-design", title: "Case Study: Video Streaming", position: 12 },
];

// ── Seed ─────────────────────────────────────────────────────────────────────

async function seed() {
	// 1. Upsert subject "Computer Science"
	console.log("Seeding subject...");
	const { data: subjectData, error: subjectError } = await supabase
		.from("subjects")
		.upsert({ name: "Computer Science", slug: "computer-science", order: 1 }, { onConflict: "slug" })
		.select("id")
		.single();

	if (subjectError || !subjectData) {
		throw new Error(`Subject upsert failed: ${subjectError?.message}`);
	}
	const subjectId = subjectData.id;
	console.log(`  subject id: ${subjectId}`);

	// 2. Ensure all 7 canonical categories exist (insert missing ones)
	console.log("Seeding categories...");
	const { data: existingCategories } = await supabase
		.from("categories")
		.select("id, slug")
		.eq("subject_id", subjectId);

	const existingSlugs = new Set((existingCategories ?? []).map((c) => c.slug));
	const categoriesToInsert = CATEGORY_META.filter((c) => !existingSlugs.has(c.key));

	if (categoriesToInsert.length > 0) {
		const { error } = await supabase.from("categories").insert(
			categoriesToInsert.map((c) => ({
				name: c.name,
				slug: c.key,
				subject_id: subjectId,
				position: c.position,
			})),
		);
		if (error) throw new Error(`Categories insert failed: ${error.message}`);
		console.log(`  inserted ${categoriesToInsert.length} new categories`);
	}

	// Fetch all categories for this subject and build the slug→id map
	const { data: allCategories, error: catFetchError } = await supabase
		.from("categories")
		.select("id, slug")
		.eq("subject_id", subjectId);

	if (catFetchError || !allCategories) {
		throw new Error(`Categories fetch failed: ${catFetchError?.message}`);
	}

	// Keep only the canonical 7; collect IDs of extra/stale categories to remove later
	const canonicalSlugs = new Set(CATEGORY_META.map((c) => c.key));
	const categoryByKey: Record<string, string> = {};
	const staleCategories: string[] = [];

	for (const cat of allCategories) {
		if (canonicalSlugs.has(cat.slug)) {
			categoryByKey[cat.slug] = cat.id;
		} else {
			staleCategories.push(cat.id);
		}
	}
	console.log(`  canonical categories: ${Object.keys(categoryByKey).length}, stale: ${staleCategories.length}`);

	// 3. Ensure each canonical slug has exactly ONE module row — deduplicate
	console.log("Seeding & deduplicating modules...");

	for (const s of SUBJECTS_RAW) {
		const correctCategoryId = categoryByKey[s.category];
		if (!correctCategoryId) {
			console.warn(`  WARN: no category for key "${s.category}"`);
			continue;
		}

		// Fetch all rows with this slug
		const { data: existing } = await supabase
			.from("modules")
			.select("id, category_id")
			.eq("slug", s.id)
			.order("created_at", { ascending: true });

		const rows = existing ?? [];

		if (rows.length === 0) {
			// Insert fresh
			await supabase.from("modules").insert({
				name: s.title,
				slug: s.id,
				category_id: correctCategoryId,
				position: s.position,
			});
			console.log(`  inserted module: ${s.id}`);
		} else {
			// Keep the first row (oldest), point it to the correct category, delete the rest
			const [keep, ...duplicates] = rows;

			if (keep!.category_id !== correctCategoryId) {
				await supabase
					.from("modules")
					.update({ category_id: correctCategoryId, position: s.position })
					.eq("id", keep!.id);
			}

			if (duplicates.length > 0) {
				await supabase
					.from("modules")
					.delete()
					.in("id", duplicates.map((d) => d.id));
				console.log(`  removed ${duplicates.length} duplicate(s) for: ${s.id}`);
			}
		}
	}

	// 4. Remove stale categories (that are not in our 7 canonical ones)
	//    First move any modules pointing to them to the correct category, then delete
	if (staleCategories.length > 0) {
		console.log(`Cleaning up ${staleCategories.length} stale categories...`);

		// Modules pointing to stale categories that match known slugs — re-point them
		const { data: staleMods } = await supabase
			.from("modules")
			.select("id, slug, category_id")
			.in("category_id", staleCategories);

		for (const mod of staleMods ?? []) {
			const subject = SUBJECTS_RAW.find((s) => s.id === mod.slug);
			if (subject && categoryByKey[subject.category]) {
				await supabase
					.from("modules")
					.update({ category_id: categoryByKey[subject.category] })
					.eq("id", mod.id);
			} else {
				// Unknown module slug — detach from stale category
				await supabase
					.from("modules")
					.update({ category_id: null })
					.eq("id", mod.id);
			}
		}

		await supabase.from("categories").delete().in("id", staleCategories);
		console.log(`  deleted ${staleCategories.length} stale categories`);
	}

	// 5. Remove modules with slugs not in our canonical list (orphan/stale modules)
	//    Only safe to remove if they have no lessons
	console.log("Removing orphan modules...");
	const canonicalModuleSlugs = new Set(SUBJECTS_RAW.map((s) => s.id));
	const allCategoryIds = Object.values(categoryByKey);

	const { data: allModulesInOurCats } = await supabase
		.from("modules")
		.select("id, slug, name")
		.in("category_id", allCategoryIds);

	const orphans = (allModulesInOurCats ?? []).filter((m) => !canonicalModuleSlugs.has(m.slug));

	for (const orphan of orphans) {
		// Check for lessons before deleting
		const { data: lessons } = await supabase
			.from("lessons")
			.select("id")
			.eq("module_id", orphan.id)
			.limit(1);

		if (lessons && lessons.length > 0) {
			console.log(`  SKIP orphan "${orphan.slug}" — has lessons`);
			continue;
		}

		await supabase.from("modules").delete().eq("id", orphan.id);
		console.log(`  deleted orphan module: ${orphan.slug}`);
	}

	// Final verification
	const { data: finalCats } = await supabase
		.from("categories")
		.select("slug")
		.eq("subject_id", subjectId);

	const { data: finalMods } = await supabase
		.from("modules")
		.select("id")
		.in("slug", SUBJECTS_RAW.map((s) => s.id));

	console.log(`\nDone — ${finalCats?.length ?? 0} categories, ${finalMods?.length ?? 0} modules`);
}

seed().catch((err) => {
	console.error(err);
	process.exit(1);
});
