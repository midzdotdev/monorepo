output "turbo_env" {
  value = join("\n", [for key, value in {
    "TURBO_API"   = cloudflare_workers_domain.turborepo_remote_cache.hostname
    "TURBO_TEAM"  = "team_foo"
    "TURBO_TOKEN" = var.turbo_token
  } : "${key}=${value}"])
  sensitive = true
}