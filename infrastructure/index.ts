import * as pulumi from "@pulumi/pulumi";
import * as awsx from "@pulumi/awsx";
import * as eks from "@pulumi/eks";

const config = new pulumi.Config();
const clusterName = config.get("clusterName") ?? "openspiir";
const nodeCount = config.getNumber("nodeCount") ?? 2;
const nodeSize = config.get("nodeSize") ?? "t3.medium";

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

export const kubeconfig = pulumi.secret(cluster.kubeconfig);
export const clusterEndpoint = cluster.core.endpoint;
export const vpcId = vpc.vpcId;
