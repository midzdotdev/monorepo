resource "github_repository" "monorepo" {
  name        = "monorepo"
  description = "⭐ Personal monorepo and Turborepo exploration"

  visibility = "public"

  lifecycle {
    prevent_destroy = true
  }
}
