resource "github_repository" "monorepo" {
  name        = "monorepo"
  description = "⭐ Personal monorepo and Turborepo exploration"

  visibility = "public"
  topics     = ["monorepo", "turborepo", "opentofu", "cloudflare"]

  lifecycle {
    prevent_destroy = true
  }
}
