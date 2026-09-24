# Introduction to Amazon EC2

**Course:** AWS Cloud Practitioner — Compute in the Cloud  
**Progress:** First lesson completed

## Lesson Objectives

- Describe how compute resources are provisioned and managed in the cloud.
- Compare the benefits and challenges of using virtual servers to managing physical servers on premises.
- Identify the concept of multi-tenancy in Amazon EC2.

## Learning Record

The lesson was completed. Mustafa shared no observations during the lesson, so this note does not yet contain his explanation. The sections below are additional context aligned with the objectives, not a record of what the video said.

## Additional Context

**Amazon EC2 (Elastic Compute Cloud)** provides virtual servers, called **instances**, that run on AWS hardware. You choose the instance's CPU, memory, storage, network settings, and operating system, then launch it in minutes and pay for it while it is provisioned.

| On-premises physical servers | Amazon EC2 instances |
| --- | --- |
| Buy hardware upfront; delivery and setup can take weeks | Launch in minutes through the console, CLI, SDK, or IaC |
| Capacity must be guessed in advance | Add, resize, or terminate instances as demand changes |
| You operate the data center, power, cooling, and hardware | AWS operates the physical and virtualization layers |
| Unused capacity is a sunk cost | Terminating an instance stops most of its charges |

EC2 still leaves real responsibilities with the customer: the guest operating system, patching, applications, security groups, and data (see [[../01-Introduction-to-Cloud/05-AWS-Shared-Responsibility-Model|Shared Responsibility Model]]). A forgotten running instance is also a common source of unexpected cost.

**Multi-tenancy:** Instances from different AWS customers can run on the same physical host. A **hypervisor** isolates them so one customer cannot access another's instance. AWS is responsible for this isolation. When a workload requires hardware not shared with other customers, AWS offers Dedicated Instances and Dedicated Hosts at a higher cost.

## Pending Coverage

- Mustafa's own explanation of the lesson objectives
