# Scaling Amazon EC2

**Course:** AWS Cloud Practitioner — Compute in the Cloud  
**Progress:** Sixth lesson completed

## Learning Record

The lesson was completed. Mustafa provided the transcript and page text but had no notes of his own.

## Course Content (paraphrased)

**The problem:** Demand varies: busy and quiet seasons, short peaks, and unknown peaks for a new business. Buying for the peak wastes money; buying for the average risks turning customers away. The cloud answer is to match capacity to demand as it changes.

**Redundancy first (coffee shop analogy):** If the only order-taking instance fails, the business stops. Launch a second copy the same programmatic way as the first, and do the same for the back-end processing instances. Spreading redundant instances across **multiple Availability Zones** in a Region removes the single point of failure: if one AZ has issues, instances in another AZ keep serving.

| Concept | Meaning |
| --- | --- |
| **Scalability** | The ability to handle more load by adding resources; long-term capacity planning so the system can grow |
| **Scale up** (vertical) | Add more power to an existing machine, such as a larger instance size |
| **Scale out** (horizontal) | Add more machines, such as more instances |
| **Elasticity** | Automatically adjusting resources out and in with real-time demand; cost-efficient at any moment |

Scalability is a system's *potential* to grow over time; elasticity is the *dynamic, automatic* adjustment.

**Amazon EC2 Auto Scaling** adjusts the number of EC2 instances to match demand:

- **Dynamic scaling:** reacts in real time to changes in demand.
- **Predictive scaling:** schedules the right number of instances ahead of anticipated demand.
- An **Auto Scaling group** is a collection of instances that scales out and in, configured with a **minimum**, **desired**, and **maximum** capacity.
- **Minimum capacity:** the fewest instances the application needs; the group never goes below it, and it is the number launched when the group is created.
- You pay only for the instances running, when they run.

**Exam traps:**

- Multi-AZ deployment is about **high availability**, not instance speed or lower cost.
- Scaling in response to demand is **elasticity**; the exam's "without over-provisioning" answer is automatic scaling, not buying excess capacity in advance.

**Course practice questions** (answers not recorded):

- Primary benefit of scalability and elasticity?
- Main reason to deploy EC2 instances across multiple AZs?
- How AWS meets fluctuating demand without over-provisioning?

## Pending Coverage

- Mustafa's explanation of scalability vs. elasticity and of Auto Scaling
- Recall check (question asked: single-AZ ticket site with a Friday 10x spike; not yet answered)
- The course's explanation of desired and maximum capacity; their page details were not captured
