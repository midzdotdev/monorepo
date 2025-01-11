terraform {
  required_version = ">= 1.6.0"
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }

  backend "s3" {
    # Intentionally excluded from source control to avoid exposing secrets
    # See: https://opentofu.org/docs/language/settings/backends/configuration/#file

    # Initialise with `tofu init -backend-config=config.s3.tfbackend`
  }
} 