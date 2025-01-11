provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

provider "github" {
  # Authenticate with `gh auth login`
}