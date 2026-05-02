//TODO - Implement algorithm documentation prompt
export const algorithmDocPrompt = (algorithmName: string) => {
	return `Please provide a detailed documentation for the ${algorithmName} algorithm, including its purpose: 
        Tamplete:

        **Algorithm Name**: ${algorithmName}
        
        ** Core Idea**: A brief description of the main concept behind the algorithm.

        ** Mecanism**: A detailed explanation of how the algorithm works

        ** How it works**: A step-by-step breakdown of the algorithm's execution, including any relevant data structures or techniques used.

        ** Complexity**: An analysis of the algorithm's time and space complexity, including best, worst, and average case scenarios.

        ** Weaknesses**: A discussion of any limitations or weaknesses of the algorithm, such as cases where it may perform poorly or fail to produce accurate results.

        ** Compare with better algorithms: A comparison of the algorithm with other similar algorithms, highlighting its advantages and disadvantages in different scenarios.

        ** Exercises: A set of exercises or problems that can be solved using the algorithm, along with their solutions and explanations.
        `;
};
