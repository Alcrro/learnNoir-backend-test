export type ComponentFeedbackVote = "up" | "down";

export type ComponentFeedbackCounts = {
	upvotes: number;
	downvotes: number;
	myVote: ComponentFeedbackVote | null;
};
