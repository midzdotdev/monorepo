resource "cloudflare_r2_bucket" "turborepo_cache" {
  account_id = cloudflare_account.account.id
  name       = "turborepo-cache"
}
