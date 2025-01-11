resource "github_repository" "monorepo" {
  name        = "monorepo"
  description = "⭐ Personal monorepo and Turborepo exploration"

  visibility = "public"
  topics     = ["monorepo", "turborepo", "opentofu", "cloudflare"]

  lifecycle {
    prevent_destroy = true
  }
}

resource "github_actions_secret" "secret" {
  for_each = {
    "CLOUDFLARE_API_TOKEN" = var.cloudflare_api_token
    "CLOUDFLARE_ACCOUNT_ID" = cloudflare_account.account.id
    "TURBO_TOKEN" = var.turbo_token
  }

  repository      = github_repository.monorepo.name
  secret_name     = each.key
  plaintext_value = each.value
}

resource "github_actions_variable" "variable" {
  for_each = {
    "TURBO_CACHE_WORKER_NAME" = var.turbo_cache_worker_name
  }

  repository      = github_repository.monorepo.name
  variable_name   = each.key
  value           = each.value
}
