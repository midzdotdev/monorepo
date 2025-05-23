resource "cloudflare_pages_project" "webtools" {
  name              = "webtools"
  account_id        = var.cloudflare_account_id
  production_branch = "main"

  build_config {
    root_dir        = "apps/webtools"
    build_command   = "pnpm run build"
    destination_dir = "dist"
  }

  source {
    type = "github"

    config {
      repo_name         = var.github_repo.name
      owner             = var.github_repo.owner
      production_branch = "main"
    }
  }
}

resource "cloudflare_pages_domain" "frontend" {
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.webtools.name
  domain       = "webtools.${var.domain}"
}
