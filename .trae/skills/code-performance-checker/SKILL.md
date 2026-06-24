---
name: "code-performance-checker"
description: "Checks code for performance issues including inefficient algorithms, memory leaks, redundant computations, and optimization opportunities. Invoke when user asks to analyze code performance or optimize slow code."
---

# Code Performance Checker

## Overview

This skill analyzes code to identify performance issues and optimization opportunities. It helps developers improve application performance by detecting common bottlenecks.

## Features

- **Algorithm Complexity Analysis**: Detects O(n²) or higher complexity operations
- **Memory Leak Detection**: Identifies potential memory leaks in JavaScript/Vue applications
- **Redundant Computation Detection**: Finds repeated calculations that can be cached
- **Rendering Performance**: Analyzes Vue component rendering efficiency
- **Bundle Size Analysis**: Checks for large dependencies and unused code

## When to Invoke

1. User reports slow application performance
2. User asks to optimize code
3. Before releasing production code
4. When profiling reveals performance bottlenecks
5. User specifically asks for performance analysis

## Supported Languages

- JavaScript / TypeScript
- Vue.js / React
- Python
- Java / Kotlin

## Performance Checks Performed

### JavaScript/Vue Specific

1. **Reactive Data Misuse**: Detects unnecessary re-renders from reactive data changes
2. **v-for Optimization**: Identifies missing keys or inefficient list rendering
3. **Event Listener Leaks**: Finds unremoved event listeners
4. **Heavy Computed Properties**: Detects computationally expensive computed properties

### General Code Checks

1. **Nested Loops**: Identifies O(n²) patterns that can be optimized
2. **String Concatenation**: Detects inefficient string building in loops
3. **Array Operations**: Finds expensive array methods in hot paths
4. **Global Scope Pollution**: Identifies potential memory leaks
5. **Unoptimized Conditionals**: Detects deeply nested conditionals

## Usage Examples

### Example 1: Analyze a specific file

```
Check performance of src/components/HeavyComponent.vue
```

### Example 2: Analyze multiple files

```
Check performance issues in:
- src/utils/complexAlgorithm.ts
- src/views/Dashboard.vue
```

### Example 3: Full project analysis

```
Run full performance analysis on the entire project
```

## Output Format

The skill provides a structured report with:

1. **Issue Severity**: Critical, Warning, Info
2. **Location**: File path and line number
3. **Description**: What the issue is
4. **Impact**: How it affects performance
5. **Recommendation**: How to fix it

### Example Report

```
┌─────────────────────────────────────────────────────────────┐
│ CODE PERFORMANCE ANALYSIS REPORT                           │
├─────────────────────────────────────────────────────────────┤
│                                                           │
│ [CRITICAL] Nested Loop Detected                            │
│ File: src/utils/dataProcessor.js:45                        │
│ Issue: O(n²) complexity in filterUsers() function          │
│ Impact: Slow performance with large datasets (>1000 items) │
│ Recommendation: Use hash map for O(1) lookups             │
│                                                           │
│ [WARNING] Missing v-for key                                │
│ File: src/components/ItemList.vue:23                       │
│ Issue: v-for without :key attribute                        │
│ Impact: Poor rendering performance, potential bugs         │
│ Recommendation: Add :key="item.id"                         │
│                                                           │
└─────────────────────────────────────────────────────────────┘
```

## Optimization Recommendations

### Quick Wins
1. Use `const` and `let` appropriately to avoid unnecessary reassignments
2. Add keys to v-for loops
3. Debounce expensive event handlers
4. Use memoization for repeated calculations

### Advanced Optimizations
1. Implement virtual scrolling for large lists
2. Use Web Workers for heavy computations
3. Lazy load non-critical components
4. Implement proper caching strategies

## Notes

- This is a static analysis tool and may not catch all runtime issues
- Always combine with runtime profiling for complete picture
- Performance improvements should be measured and validated
