# Account configuration
resource "cloudflare_account" "account" {
  name = var.account_name
}

# R2 bucket for OpenTofu state
resource "cloudflare_r2_bucket" "backend_state" {
  account_id = cloudflare_account.account.id
  name       = "monorepo-opentofu-state"

  lifecycle {
    prevent_destroy = true
  }
}

# NOTE: Update via CloudFlare UI to create R2 credentials for this OpenTofu state bucket

module "webtools" {
  source = "./modules/webtools"
  cloudflare_account_id = cloudflare_account.account.id
  domain = "midz.dev"
  zone_id = cloudflare_zone.zone["midz.dev"].id
  github_repo = {
    owner = "midzdotdev"
    name = "monorepo"
  }

  providers = {
    cloudflare = cloudflare
  }
}
