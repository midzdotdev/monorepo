resource "cloudflare_r2_bucket" "turborepo_remote_cache" {
  account_id = cloudflare_account.account.id
  name       = "turborepo-cache"
}

resource "cloudflare_workers_domain" "turborepo_remote_cache" {
  account_id = cloudflare_account.account.id
  zone_id = cloudflare_zone.zone["midz.dev"].id
  hostname = "turbo-cache.midz.dev"
  service = var.turbo_cache_worker_name
}
