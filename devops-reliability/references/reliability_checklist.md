# Reliability & DevOps Best Practices Checklist

## GitHub Actions Security & Stability
- [ ] **Pin Actions by SHA**: Never use mutable tags like `@v2` or `@latest` for third-party actions. Use the full commit hash to prevent supply chain attacks.
- [ ] **Least Privilege**: Configure `permissions: {}` at the top level and define specific permissions at the job level.
- [ ] **Secret Management**: Audit usage of `${{ secrets }}`. Ensure no secrets are printed to logs.
- [ ] **Timeout**: Set `timeout-minutes` on every job to prevent stuck runners from consuming minutes.

## Kubernetes & Deployment
- [ ] **Liveness & Readiness Probes**: Ensure every pod has properly configured probes to detect failures and facilitate self-healing.
- [ ] **Resource Limits**: Every container MUST have `resources.requests` and `resources.limits` defined to prevent noisy neighbor issues.
- [ ] **Pod Disruption Budgets**: Define PDBs to ensure availability during voluntary disruptions (e.g., node upgrades).
- [ ] **Graceful Shutdown**: Ensure applications handle `SIGTERM` correctly and finish in-flight requests before exiting.

## Chaos Engineering
- [ ] **Dependency Failure**: Test behavior when databases or external APIs are unreachable (verify timeouts and retries).
- [ ] **Pod Killing**: Randomly kill pods in staging to verify the replicaset handles recovery without downtime.
- [ ] **Latency Injection**: Introduce network latency to spot bottlenecks.

## 100% Uptime Principles
- [ ] **Blue/Green or Rolling Updates**: Ensure the deployment strategy allows for zero downtime.
- [ ] **Rollback Strategy**: automatic rollback triggers on health check failures during deployment.
- [ ] **Database Migrations**: Separate migrations from code deployment. Use backward-compatible schema changes.
