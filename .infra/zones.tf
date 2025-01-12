resource "cloudflare_zone" "zone" {
  for_each = toset([
    "midz.dev",
  ])
  account_id = cloudflare_account.account.id
  zone = each.value
}
