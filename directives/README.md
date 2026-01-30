# Directives (Layer 1)

> Standard Operating Procedures (SOPs) written in Markdown

## Purpose

Directives define **what to do**. They are natural language instructions that specify:

- **Goals**: What outcome we're trying to achieve
- **Inputs**: What data/parameters the process needs
- **Tools/Scripts**: Which execution scripts to use
- **Outputs**: What the process should produce
- **Edge Cases**: Known issues and how to handle them

## Format

Each directive follows this template:

```markdown
# [Directive Name]

## Goal
[What this process achieves]

## Inputs
- [Required input 1]
- [Required input 2]

## Execution Script
`execution/[script_name].py`

## Steps
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Expected Output
[Description of what gets produced]

## Edge Cases & Learnings
- [Known issue 1]: [How to handle]
- [Known issue 2]: [How to handle]
```

## Rules

1. **Living Documents**: Update directives when you discover API constraints, better approaches, common errors, or timing expectations
2. **Preserve Intent**: Don't overwrite directives without asking unless explicitly told to
3. **Be Specific**: Write directives like you'd give instructions to a mid-level employee
4. **Reference Scripts**: Always point to execution scripts, don't embed code logic in directives

## Current Directives

| Directive | Description | Script |
|-----------|-------------|--------|
| *None yet* | *Add your first directive* | - |
