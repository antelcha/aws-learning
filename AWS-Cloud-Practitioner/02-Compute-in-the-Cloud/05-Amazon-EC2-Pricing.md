# Amazon EC2 Pricing

**Course:** AWS Cloud Practitioner — Compute in the Cloud  
**Progress:** Fifth lesson completed

## Learning Record

The lesson was completed. Mustafa provided the transcript but no explanation in his own words yet.

## Course Content (paraphrased)

| Option | How it works | Discount vs. On-Demand (course maximum) | Best for |
| --- | --- | --- | --- |
| On-Demand | Pay per hour or per second, depending on instance type and OS; no commitment or upfront payment | — | Getting started, testing, finding a usage baseline |
| Savings Plans | Commit to a consistent amount of usage in dollars per hour for 1 or 3 years | Up to 72% | Consistent usage that may change instance family, size, OS, tenancy, or Region; also covers AWS Fargate and AWS Lambda |
| Reserved Instances | Commit to a 1- or 3-year term; pay all upfront, partial upfront, or no upfront | Up to 75% | Steady-state, predictable workloads |
| Spot Instances | Use spare EC2 capacity; AWS can reclaim it at any time with a two-minute warning | Up to 90% | Workloads that tolerate interruption |
| Dedicated Hosts | An entire physical server for exclusive use, with control over instance placement and resource allocation | — | Security, compliance, or licensing requirements (for example, Windows or SQL Server licenses) |

- **Typical path:** start On-Demand, measure a baseline, then commit (Savings Plans or Reserved Instances) for the steady part.
- **Dedicated Instances vs. Dedicated Hosts:** both isolate you from other AWS accounts' hardware. Dedicated Instances do so without letting you choose or control the physical server; Dedicated Hosts give you the whole server and placement control.
- The page also mentions Capacity Reservations and Reserved Instance flexibility; their details were not captured.

**Exam traps:**

- "Can tolerate interruptions" + "lowest cost" → Spot. "Unknown usage, no commitment" → On-Demand.
- "Complete control over the physical server" or "server-bound licensing" → Dedicated Hosts, not Dedicated Instances.
- Savings Plans vs. Reserved Instances: Savings Plans stay flexible across instance family, size, OS, tenancy, and Region.

**Course practice questions** (answers not recorded):

- Sensitive, regulated workloads needing full control over the physical server → which option?
- Interruption-tolerant batch processing, maximum savings → which option?
- New application with unknown usage, no long-term commitment → which option?

## Pending Coverage

- Mustafa's explanation of when to use each pricing option
- Recall check
- Capacity Reservations and Reserved Instance flexibility
