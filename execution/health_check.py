#!/usr/bin/env python3
"""
Script Name: health_check.py
Purpose: Check the health of HarvestConnect services (backend and frontend)
Inputs: None (uses environment variables for URLs)
Outputs: Health status report

Usage:
    python execution/health_check.py

Environment Variables:
    BACKEND_URL: Backend API URL (default: http://localhost:8000)
    FRONTEND_URL: Frontend URL (default: http://localhost:3001)
"""

import os
import sys
import json
import urllib.request
import urllib.error
from datetime import datetime

# Try to load dotenv if available
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass


def check_url(url: str, name: str) -> dict:
    """Check if a URL is accessible and return status."""
    result = {
        "name": name,
        "url": url,
        "status": "unknown",
        "response_time_ms": None,
        "error": None,
        "timestamp": datetime.now().isoformat()
    }
    
    try:
        start_time = datetime.now()
        request = urllib.request.Request(url, method='GET')
        request.add_header('User-Agent', 'HarvestConnect-HealthCheck/1.0')
        
        with urllib.request.urlopen(request, timeout=10) as response:
            end_time = datetime.now()
            result["status"] = "healthy" if response.status == 200 else f"warning ({response.status})"
            result["response_time_ms"] = round((end_time - start_time).total_seconds() * 1000, 2)
            
    except urllib.error.HTTPError as e:
        result["status"] = "unhealthy"
        result["error"] = f"HTTP {e.code}: {e.reason}"
    except urllib.error.URLError as e:
        result["status"] = "unreachable"
        result["error"] = str(e.reason)
    except Exception as e:
        result["status"] = "error"
        result["error"] = str(e)
    
    return result


def main():
    """Main entry point."""
    # Get URLs from environment or use defaults
    backend_url = os.getenv("BACKEND_URL", "http://localhost:8000")
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3001")
    
    print("=" * 60)
    print("HarvestConnect Health Check")
    print("=" * 60)
    print(f"Timestamp: {datetime.now().isoformat()}")
    print()
    
    # Check backend
    print("Checking Backend...")
    backend_result = check_url(f"{backend_url}/api/", "Backend API")
    print_result(backend_result)
    
    # Check frontend
    print("\nChecking Frontend...")
    frontend_result = check_url(frontend_url, "Frontend")
    print_result(frontend_result)
    
    # Summary
    print("\n" + "=" * 60)
    print("Summary")
    print("=" * 60)
    
    all_healthy = all(r["status"] == "healthy" for r in [backend_result, frontend_result])
    
    if all_healthy:
        print("✅ All services are healthy!")
        return 0
    else:
        print("⚠️  Some services have issues:")
        for result in [backend_result, frontend_result]:
            if result["status"] != "healthy":
                print(f"  - {result['name']}: {result['status']}")
                if result["error"]:
                    print(f"    Error: {result['error']}")
        return 1


def print_result(result: dict):
    """Pretty print a health check result."""
    status_icon = {
        "healthy": "✅",
        "unhealthy": "❌",
        "unreachable": "🔌",
        "error": "💥",
        "unknown": "❓"
    }.get(result["status"], "❓")
    
    print(f"  {status_icon} {result['name']}")
    print(f"     URL: {result['url']}")
    print(f"     Status: {result['status']}")
    if result["response_time_ms"]:
        print(f"     Response Time: {result['response_time_ms']}ms")
    if result["error"]:
        print(f"     Error: {result['error']}")


if __name__ == "__main__":
    sys.exit(main())
