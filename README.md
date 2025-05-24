# Monorepo

Where I build and explore.

## Tooling

### Linting

* __Husky__ is used to run shell scripts on Git hooks
* __Biome__ is used for formatting and linting of application code
  * ✅ Fixes on Git `pre-commit` via Husky
  * ✅ Validates formatting and linting during CI
* __`tofu fmt`__ is used for formatting and linting of OpenTofu IaC
  * ✅ Formats code on Git `pre-commit` via Husky
  * ✅ Validates formatting and linting during CI

### OpenTofu

OpenTofu is an open-source fork of Terraform, used to manage infrastructure through version controlled configs.

The OpenTofu state (backend) is kept within a CloudFlare R2 bucket.

It is currently responsible for managing:
* The GitHub repo and environment variables
* Infra for its own backend
* Infra for the Turborepo Remote Cache

### Turborepo 

Turborepo is present but not yet integrated into `package.json` scripts or GitHub Actions, and I'm yet to properly configure [turbo.json](./turbo.json).

Turborepo has a Remote Cache deployed onto CloudFlare.

The [deploy-turborepo-cache-yml](.github/workflows/deploy-turborepo-cache.yml) workflow can be dispatched to deploy a new version of a custom Turborepo Remote Cache using CloudFlare functions:

https://github.com/AdiRishi/turborepo-remote-cache-cloudflare

OpenTofu outputs the relevant environment variables to be placed in `.env`:

```ini
TURBO_API=
TURBO_TEAM=team_foo
TURBO_TOKEN=
```

