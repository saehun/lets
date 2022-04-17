# {{project.name}}
This project use `terraform cloud`

### Intialization
Setup environment variables, fill values
```sh
cp .envrc.template .envrc
direnv allow
```

Then you need to upload sample lambda package. assume that the s3 bucket is already provisioned.
```sh
make build && make package && make upload
```

Goto terraform cloud dashboard and create new workspace https://app.terraform.io/app/{{terrform.organization_name}}/workspaces/new

- Set infra/main.ts -> cloud.workspaces.organization to your organization name ({{terrform.organization_name}}).
- Set infra/main.ts -> cloud.workspaces.name to your workspace name.

Setup infra
```sh
cd infra
terraform login # follow login prompt. You can skip if you already have a session.
terraform init
```

goto terraform cloud dashboard and create new workspaces. Ensure execution mode is `Local` (see below)
![execution-mode](https://cdn.saeh.io/terraform/a5500ffa-0b03-424a-8507-ffc04dd38d41.png)

goto `https://app.terraform.io/app/{{terrform.organization_name}}/workspaces/{{project.name}}/settings/general`
