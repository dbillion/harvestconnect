# Execution (Layer 3)

> Deterministic Python scripts that do the actual work

## Purpose

Execution scripts handle **doing the work**. They are:

- **Deterministic**: Same inputs always produce same outputs
- **Reliable**: Properly handle errors and edge cases
- **Testable**: Can be run independently with test inputs
- **Fast**: Optimized for performance
- **Well-Commented**: Clear documentation of what each part does

## Script Template

```python
#!/usr/bin/env python3
"""
Script Name: [name]
Purpose: [what this script does]
Inputs: [expected inputs]
Outputs: [what it produces]

Usage:
    python execution/[script_name].py [args]

Environment Variables:
    [VAR_NAME]: [description]
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


def main():
    """Main entry point."""
    # Your logic here
    pass


if __name__ == "__main__":
    main()
```

## Guidelines

1. **Check Existing Scripts First**: Before creating a new script, check if one already exists
2. **Use Environment Variables**: Store API keys and secrets in `.env`
3. **Handle Errors Gracefully**: Catch exceptions and provide useful error messages
4. **Log Progress**: Use logging for long-running operations
5. **Return Proper Exit Codes**: 0 for success, non-zero for failure

## Current Scripts

| Script | Purpose | Directive |
|--------|---------|-----------|
| *None yet* | *Add your first script* | - |
