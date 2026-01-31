import subprocess
import os
import sys

# Configuration
BACKEND_DIR = "/home/deeone/Documents/HarvestConnect/backend"
FRONTEND_DIR = "/home/deeone/Documents/HarvestConnect/harvestconnect"

def run_command(command, cwd, description):
    print(f"\\n\\033[1;34m[INFO] Starting {description}...\\033[0m")
    try:
        # Run command and capture output
        result = subprocess.run(
            command,
            cwd=cwd,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        return result
    except Exception as e:
        return f"Error running {description}: {str(e)}"

def main():
    print("═══════════════════════════════════════════════════════════")
    print("  HarvestConnect Fullstack Test Runner")
    print("═══════════════════════════════════════════════════════════")

    # 1. Run Backend Tests
    # We use the existing run_tests.sh if possible, or fall back to direct commands
    backend_cmd = "bash run_tests.sh"
    # Alternatively: "uv run python manage.py test"
    
    backend_result = run_command(backend_cmd, BACKEND_DIR, "Backend Tests (Django)")
    
    # 2. Run Frontend Tests
    # npm test runs vitest. We need to make sure it runs once and exits.
    # usually 'vitest run' or 'npm test -- --run' works.
    frontend_cmd = "npm test -- --run"
    
    frontend_result = run_command(frontend_cmd, FRONTEND_DIR, "Frontend Tests (Next.js/Vitest)")

    # 3. Generate Report
    print("\n\n")
    print("═══════════════════════════════════════════════════════════")
    print("  FINAL TEST REPORT")
    print("═══════════════════════════════════════════════════════════")

    # Analyze Backend
    print(f"\n\\033[1mBACKEND RESULTS:\\033[0m")
    if isinstance(backend_result, subprocess.CompletedProcess):
        if backend_result.returncode == 0:
            print("\\033[1;32m✅ PASSED\\033[0m")
        else:
            print("\\033[1;31m❌ FAILED\\033[0m")
        
        # Print a snippet of the output
        print("-" * 40)
        print("Last 20 lines of output:")
        print("\n".join(backend_result.stdout.splitlines()[-20:]))
        if backend_result.stderr:
             print("\nErrors:")
             print("\n".join(backend_result.stderr.splitlines()[-10:]))
        print("-" * 40)
    else:
        print(f"\\033[1;31m❌ EXECUTION ERROR: {backend_result}\\033[0m")

    # Analyze Frontend
    print(f"\n\\033[1mFRONTEND RESULTS:\\033[0m")
    if isinstance(frontend_result, subprocess.CompletedProcess):
        if frontend_result.returncode == 0:
            print("\\033[1;32m✅ PASSED\\033[0m")
        else:
            print("\\033[1;31m❌ FAILED\\033[0m")
            
        # Print a snippet of the output
        print("-" * 40)
        print("Last 20 lines of output:")
        print("\n".join(frontend_result.stdout.splitlines()[-20:]))
        if frontend_result.stderr:
             print("\nErrors:")
             print("\n".join(frontend_result.stderr.splitlines()[-10:]))
        print("-" * 40)
    else:
        print(f"\\033[1;31m❌ EXECUTION ERROR: {frontend_result}\\033[0m")

    # Overall Status
    success = (isinstance(backend_result, subprocess.CompletedProcess) and backend_result.returncode == 0) and \
              (isinstance(frontend_result, subprocess.CompletedProcess) and frontend_result.returncode == 0)
              
    if success:
        print("\n\\033[1;32m🎉 ALL SYSTEMS GO! Integration ready.\\033[0m")
    else:
        print("\n\\033[1;31m⚠️  ISSUES DETECTED. Please review the logs above.\\033[0m")

if __name__ == "__main__":
    main()
