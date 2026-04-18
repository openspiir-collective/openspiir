import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as eks from "@pulumi/eks";

const config = new pulumi.Config();
const clusterName = config.get("clusterName") ?? "openspiir";
const nodeCount = config.getNumber("nodeCount") ?? 2;
const nodeSize = config.get("nodeSize") ?? "t3.medium";
const dbName = config.get("dbName") ?? "openspiir";
const dbUsername = config.get("dbUsername") ?? "openspiir";
const dbPassword = config.requireSecret("dbPassword");
const dbInstanceClass = config.get("dbInstanceClass") ?? "db.t3.micro";

// VPC with public and private subnets across 3 AZs
const vpc = new awsx.ec2.Vpc("openspiir-vpc", {
    numberOfAvailabilityZones: 3,
    subnetSpecs: [
        { type: awsx.ec2.SubnetType.Public },
        { type: awsx.ec2.SubnetType.Private },
    ],
    natGateways: { strategy: awsx.ec2.NatGatewayStrategy.Single },
    tags: { Project: "openspiir" },
});

// EKS cluster in the private subnets
const cluster = new eks.Cluster(clusterName, {
    vpcId: vpc.vpcId,
    publicSubnetIds: vpc.publicSubnetIds,
    privateSubnetIds: vpc.privateSubnetIds,
    nodeAssociatePublicIpAddress: false,
    desiredCapacity: nodeCount,
    minSize: 1,
    maxSize: 5,
    instanceType: nodeSize,
    tags: { Project: "openspiir" },
});

// Security group for RDS — allows PostgreSQL access from EKS nodes only
const dbSecurityGroup = new aws.ec2.SecurityGroup("openspiir-db-sg", {
    vpcId: vpc.vpcId,
    description: "Allow PostgreSQL access from EKS nodes",
    ingress: [{
        protocol: "tcp",
        fromPort: 5432,
        toPort: 5432,
        securityGroups: [cluster.nodeSecurityGroupId],
    }],
    egress: [{
        protocol: "-1",
        fromPort: 0,
        toPort: 0,
        cidrBlocks: ["0.0.0.0/0"],
    }],
    tags: { Project: "openspiir" },
});

// Subnet group spanning all private subnets
const dbSubnetGroup = new aws.rds.SubnetGroup("openspiir-db-subnet-group", {
    subnetIds: vpc.privateSubnetIds,
    tags: { Project: "openspiir" },
});

// PostgreSQL RDS instance
const db = new aws.rds.Instance("openspiir-db", {
    engine: "postgres",
    engineVersion: "16",
    instanceClass: dbInstanceClass,
    allocatedStorage: 20,
    storageType: "gp2",
    dbName: dbName,
    username: dbUsername,
    password: dbPassword,
    dbSubnetGroupName: dbSubnetGroup.name,
    vpcSecurityGroupIds: [dbSecurityGroup.id],
    multiAz: false,
    publiclyAccessible: false,
    skipFinalSnapshot: true,
    deletionProtection: false,
    tags: { Project: "openspiir" },
});

// S3 bucket for Pulumi state storage
const pulumiStateBucket = new aws.s3.Bucket("openspiir-pulumi-state", {
    tags: { Project: "openspiir" },
});

new aws.s3.BucketVersioning("openspiir-pulumi-state-versioning", {
    bucket: pulumiStateBucket.id,
    versioningConfiguration: { status: "Enabled" },
});

new aws.s3.BucketServerSideEncryptionConfiguration("openspiir-pulumi-state-encryption", {
    bucket: pulumiStateBucket.id,
    rules: [{
        applyServerSideEncryptionByDefault: { sseAlgorithm: "AES256" },
    }],
});

new aws.s3.BucketPublicAccessBlock("openspiir-pulumi-state-public-access-block", {
    bucket: pulumiStateBucket.id,
    blockPublicAcls: true,
    blockPublicPolicy: true,
    ignorePublicAcls: true,
    restrictPublicBuckets: true,
});

export const kubeconfig = pulumi.secret(cluster.kubeconfig);
export const clusterEndpoint = cluster.core.endpoint;
export const vpcId = vpc.vpcId;
export const dbEndpoint = db.endpoint;
export const dbPort = db.port;
export const pulumiStateBucketName = pulumiStateBucket.bucket;
