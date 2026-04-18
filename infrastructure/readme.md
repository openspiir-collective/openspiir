# Infrastructure

Definitely pulumi.

Probably hosted on aws for now, though I want to move to a european cloud later.

Probably using kubernetes.

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+) and npm
- [Pulumi CLI](https://www.pulumi.com/docs/install/) — `brew install pulumi` or see the docs
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) configured with credentials that have permissions to create VPCs, EKS clusters, and RDS instances
- [kubectl](https://kubernetes.io/docs/tasks/tools/) (optional, for interacting with the cluster after deploy)

### First-time setup

```bash
cd infrastructure
npm install
pulumi stack select dev   # or: pulumi stack init dev
```

Set the required secret (Pulumi will encrypt it):

```bash
pulumi config set --secret dbPassword <your-password>
```

All other config has defaults, but you can override them:

```bash
pulumi config set clusterName openspiir
pulumi config set nodeCount 2
pulumi config set nodeSize t3.medium
pulumi config set dbName openspiir
pulumi config set dbUsername openspiir
pulumi config set dbInstanceClass db.t3.micro
pulumi config set aws:region us-east-1
```

### Deploy

```bash
pulumi preview   # dry-run — review what will be created
pulumi up        # deploy (will prompt for confirmation)
```

After a successful deploy, Pulumi outputs:

| Output | Description |
|--------|-------------|
| `clusterEndpoint` | EKS API server URL |
| `vpcId` | ID of the provisioned VPC |
| `dbEndpoint` | RDS PostgreSQL hostname |
| `dbPort` | RDS port (5432) |
| `kubeconfig` | (secret) Cluster kubeconfig — see below |

To access the cluster:

```bash
pulumi stack output kubeconfig --show-secrets > ~/.kube/openspiir-config
KUBECONFIG=~/.kube/openspiir-config kubectl get nodes
```

### Tear down

```bash
pulumi destroy
```