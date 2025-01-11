variable "cloudflare_api_token" {
  type        = string
  sensitive   = true
  description = "Cloudflare API token to authenticate the provider."
}

variable "account_name" {
  type        = string
  description = "Name of the Cloudflare account."
}

variable "turbo_cache_worker_name" {
  type        = string
  description = "Name of the Turborepo cache worker."
  default     = "turborepo-cache"
}

variable "turbo_token" {
  type        = string
  sensitive   = true
  description = "Turborepo token to authenticate the provider."
}
