# Directing Traffic with Elastic Load Balancing

**Course:** AWS Cloud Practitioner — Compute in the Cloud  
**Progress:** Seventh lesson completed

## Learning Record

The lesson was completed. Mustafa provided the transcript and page text but had no notes of his own.

## Course Content (paraphrased)

**The problem:** Auto Scaling adds instances, but traffic does not spread itself evenly. Some instances sit idle while others are overloaded. In the coffee shop analogy, a **host** at the entrance watches the lines and sends each customer to the shortest one.

**Load balancer:** takes in requests and routes them to instances. You can run any off-the-shelf load balancer on AWS, but then you manage, patch, upgrade, fail over, and maintain it yourself. **Elastic Load Balancing (ELB)** is the managed option: AWS handles that work, and you configure it.

- **Elastic:** it scales with traffic on its own.
- Handles both **external** (internet) and **internal** traffic.
- **Regional:** a single endpoint in front of instances across AZs.
- **Decoupling tiers:** without a load balancer, every front-end instance must know every back-end instance, which breaks down at hundreds or thousands of instances. With ELB, the front end uses one URL; new back-end instances register with the load balancer when ready and start receiving traffic. Each tier scales independently.

**ELB + Auto Scaling:** separate services that work together. The load balancer is the single point of contact for traffic to an Auto Scaling group; Auto Scaling changes the number of instances, and ELB spreads requests across whatever instances are currently available.

| Service | Job |
| --- | --- |
| Amazon EC2 Auto Scaling | Adds and removes instances to match demand |
| Elastic Load Balancing | Distributes incoming traffic across the available instances |

**Benefits (course flashcards):** efficient traffic distribution, automatic scaling, simplified management.

**Routing methods named on the page:** Round Robin (cycle through servers evenly), Least Connections (fewest active connections), IP Hash (same client IP to the same server), Least Response Time (fastest-responding server).

**Exam traps:**

- "Distributes a workload across several instances" → ELB. "Adds or removes instances to match demand" → Auto Scaling.
- ELB does not create instances or make them larger.

**Course practice questions** (answers not recorded):

- How does ELB improve scalability?
- Which task does ELB perform?

## Additional Context (not from the course)

- The page's routing list is generic load-balancing terminology. Actual ELB configuration differs: an Application Load Balancer offers round robin, least outstanding requests (the method the video's back-end example describes), and weighted random. For the exam, know the course's list and the ELB vs. Auto Scaling split.
- ELB is not free: it is billed per hour plus usage-based capacity units, so cost grows with traffic. Verify current pricing before a hands-on project.

## Pending Coverage

- Mustafa's explanation of ELB and how it works with Auto Scaling
- Recall check (question asked: hardcoded back-end IPs with an Auto Scaling group; not yet answered)
