#### ❌ NU crea array nou

1. `const newArray=[]`
2. `return arr.reverse();` // uneori acceptat, dar aici trișezi ideea
   3

### ✅ Modifici in-place

`arr[0] ↔ arr[n-1]`

### Nu e in place

````const result = [];
for (let i = arr.length - 1; i >= 0; i--) {
  result.push(arr[i]);
}
```

### ⏱ Complexitate dorită: O(n)

Algoritmul trebuie să parcurgă array-ul o singură dată

💾 Spațiu: O(1)
````
