# Introduction to AWS Global Infrastructure

**Course:** AWS Cloud Practitioner — Introduction to Cloud  
**Progress:** Fourth video completed

## Mustafa's Understanding

- The main focus is high availability.
- High availability means remaining accessible with minimal downtime.
- Fault tolerance goes one step further and aims to keep the system operating when components fail.
- Regions and Availability Zones help AWS workloads remain available during infrastructure failures.

## High Availability and Fault Tolerance

| Concept | Meaning |
| --- | --- |
| High availability | Minimizes downtime through redundancy, failover, and recovery mechanisms. Brief interruption may still occur. |
| Fault tolerance | Keeps a system operating with little or no interruption when a failure it was designed to tolerate occurs. |

Fault tolerance does not automatically mean that a system survives every combination of multiple failures. Its guarantees depend on the architecture and defined failure scenarios. It is generally a stronger and more expensive requirement than high availability.

## Regions and Availability Zones

- An **AWS Region** is a separate geographic area where AWS operates infrastructure.
- An **Availability Zone (AZ)** is an isolated infrastructure location within a Region.
- Every AWS Region has **at least three Availability Zones**. The exact number varies; some Regions have more than four.
- Deploying across multiple AZs is a common way to protect against data-center-level failures within one Region.
- A multi-Region design can protect against larger regional disruptions but adds cost and operational complexity.
- Regions also support lower latency, regulatory requirements, data residency, and global reach.

**Official reference:** [AWS Availability Zones](https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-availability-zones.html)

## English Note #english

**Power outage:** A temporary loss of electricity.

- “The data center experienced a power outage.”
- “The application remained available despite the power outage.”
- “Multiple Availability Zones can reduce the impact of a local power outage.”

**Natural sentence:** “She also emphasized that you need high availability and fault tolerance.”
