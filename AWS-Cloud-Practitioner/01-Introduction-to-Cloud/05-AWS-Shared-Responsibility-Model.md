# The AWS Shared Responsibility Model

**Course:** AWS Cloud Practitioner — Introduction to Cloud  
**Progress:** Fifth video completed

## Mustafa's Understanding

The customer is responsible for **security in the cloud**, while AWS is responsible for **security of the cloud**.

## Responsibility Split

| AWS — security **of** the cloud | Customer — security **in** the cloud |
| --- | --- |
| Physical security of data centers | Customer data and its classification |
| Hardware and physical infrastructure | Identities, permissions, and access management |
| Networking and facilities supporting AWS services | Service, network, and firewall configuration |
| Virtualization infrastructure | Application security and code |
| Infrastructure software for managed services | Guest operating system and application patching when the customer controls them |

## Responsibility Changes by Service

AWS manages more of the stack as a service becomes more managed:

- **Amazon EC2:** The customer manages the guest operating system, patches, applications, security groups, identities, and data. AWS manages the underlying physical and virtualization infrastructure.
- **Amazon RDS:** AWS manages more of the database infrastructure and maintenance. The customer still manages data, database access, and relevant configuration choices.
- **Amazon S3:** AWS operates the storage infrastructure. The customer controls the stored data, permissions, bucket configuration, and access policies.

Using a managed service reduces operational responsibility, but it does not remove the customer's responsibility for data, access, and secure configuration.

**Official reference:** [AWS Shared Responsibility Model](https://aws.amazon.com/compliance/shared-responsibility-model/)

## English Note #english

Use **“is responsible for”** rather than **“belongs to”** when describing duties:

> “The customer is responsible for security in the cloud, while AWS is responsible for security of the cloud.”

AWS is a company name, so it normally does not take **“the”**: use **“AWS”**, not **“the AWS.”**
