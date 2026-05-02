# Bubble Sort

## 1. Core Idea

- Sorting emerges from repeated local corrections.
- Each pass guarantees one element reaches its final position.

---

## 2. Mechanism

- Iterate through the array
- Compare adjacent elements: (i) and (i + 1)
- Swap if they are in the wrong order
- After each full pass:
  - The largest unsorted element moves to the end
- Repeat for n-1 passes or until no swaps occur

---

## 3. Why It Works

- Each swap fixes a local inversion (wrong order pair)
- Repeated local fixes reduce global disorder
- After k passes:
  - The last k elements are guaranteed to be sorted
- Eventually, no inversions remain → array is sorted

---

## 4. Complexity (with reasoning)

- Worst case: O(n²)
  - You compare ~n elements for ~n passes
  - Total ≈ n × n

- Average case: O(n²)
  - Same reasoning as worst (random disorder)

- Best case: O(n)
  - If already sorted and you use a "no swap" optimization
  - Only one pass needed

- Space: O(1)
  - In-place sorting (no extra memory)

---

## 5. Weaknesses

- Extremely inefficient for large datasets
- Moves elements one step at a time → slow convergence
- High number of unnecessary comparisons
- Does not scale

---

## 6. Compare to Better Solutions

### Bubble Sort vs Merge Sort

- Bubble:
  - Local swaps
  - O(n²)
  - Simple but slow

- Merge:
  - Divide & conquer
  - O(n log n)
  - Much faster for large inputs

### Key difference:

- Bubble fixes order **locally**
- Merge enforces order **globally**

---

## 7. Example Walkthrough

Array: [5, 1, 4, 2]

Pass 1:
[5,1,4,2] → [1,5,4,2] → [1,4,5,2] → [1,4,2,5]

Pass 2:
[1,4,2,5] → [1,2,4,5]

Now last 2 elements are sorted.

---

## 8. Active Recall

- Why does Bubble Sort become O(n) in best case?
- After k passes, what is guaranteed to be sorted?
- What causes O(n²)?

---

## 9. Exercises

1. Simulate Bubble Sort on:
   [3, 2, 1]

2. Modify Bubble Sort to stop early if sorted

3. Count number of swaps for:
   [4, 3, 2, 1]

4. Compare number of operations vs Merge Sort for n = 1000
