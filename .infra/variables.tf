variable "cloudflare_api_token" {
  type        = string
  sensitive   = true
  description = "Cloudflare API token to authenticate the provider."
}

variable "account_name" {
  type        = string
  description = "Name of the Cloudflare account."
}
