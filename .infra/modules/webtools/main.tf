variable "cloudflare_account_id" {
  type = string
}

variable "zone_id" {
  type = string
}

variable "domain" {
  type = string
}

variable "github_repo" {
  type = object({
    owner = string
    name = string
  })
}

output "frontend_hostname" {
  value = cloudflare_pages_project.webtools.subdomain
}
