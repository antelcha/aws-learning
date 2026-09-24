# Amazon EC2 Instance Types

**Course:** AWS Cloud Practitioner — Compute in the Cloud  
**Progress:** Second lesson completed

## Learning Record

The lesson was completed. Mustafa shared no observations, but provided the video transcript. Burstable instances were not covered in the video.

## Course Content (from transcript)

- **Analogy:** Instance types are like different coffee machines — espresso, drip, cold brew. Use the right machine for each order.
- Instance types are grouped into **instance families** with different combinations of CPU, memory, storage, and networking capacity.

| Family | Course description |
| --- | --- |
| General purpose | Balance of compute, memory, and networking; web services, code repositories. A good starting point when workload performance is unknown. |
| Compute optimized | Compute-intensive tasks: gaming servers, high-performance computing, machine learning tasks, scientific modeling. |
| Memory optimized | Fast performance for workloads that process large datasets in memory. |
| Accelerated computing | Floating-point calculations, graphics processing, data pattern matching. Uses hardware accelerators (co-processors) that are more efficient than software on CPUs. |
| Storage optimized | High performance for locally stored data. |

- After choosing a type, choose a **size**. Bigger sizes provide more CPU, memory, and storage but cost more; balance performance with cost.
- Type and size are not permanent. If the first choice does not perform as needed, change it.

**Course practice questions** (answers not recorded):

- Real-time analytics that processes large datasets quickly → which family?
- Analysis of locally stored historical data needing consistent, high disk throughput → which family?

## Recall Check

Scenario: one general purpose instance runs (A) a web app with CPU steady at 95% and memory at 30%, and (B) a nightly job that loads a 400 GB dataset into memory for real-time queries.

- **A → compute optimized.** Mustafa answered correctly ("CPU optimized"). #misconception Terminology: the exam term is *compute optimized*.
- **B → memory optimized.** Answered correctly. Key distinction: processing data *in memory* points to memory optimized; high-throughput access to *locally stored* data points to storage optimized.
- **Why not a bigger general purpose size for A?** After a hint, Mustafa answered that a bigger size also adds memory, which is already underused. Correct: general purpose sizes scale CPU and memory together, so the extra memory would be paid for but idle. A bigger size is still a valid quick fix, just less cost-efficient. #misconception His first answer cited extra storage; most instances use separately billed EBS storage, so size does not generally add storage.

## Additional Context (not from the course)

An **instance type** defines the hardware profile of an EC2 instance: vCPUs, memory, storage, network performance, and optional accelerators such as GPUs. Instance types are grouped into **families** optimized for different workloads.

| Family | Optimized for | Example workloads | Example types |
| --- | --- | --- | --- |
| General purpose | Balanced CPU, memory, and networking | Web servers, code repositories, small databases | `t3`, `m7i`, `m7g` |
| Compute optimized | High CPU performance relative to memory | Batch processing, game servers, scientific modeling, high-traffic web servers | `c7i`, `c7g` |
| Memory optimized | Large amounts of memory | In-memory caches, large relational databases, real-time analytics | `r7i`, `x2idn` |
| Accelerated computing | GPUs or other hardware accelerators | ML training and inference, graphics, video processing | `g6`, `p5`, `inf2` |
| Storage optimized | High, sequential or random, local storage I/O | Data warehouses, distributed file systems, high-throughput OLTP databases | `i4i`, `d3` |

**Reading an instance type name** — example `c7g.xlarge`:

- `c` — family (compute optimized)
- `7` — generation
- `g` — additional capability (here, AWS Graviton processor)
- `xlarge` — size within the family; larger sizes have proportionally more resources and cost more

**Selection criteria:** Identify the workload's bottleneck (CPU, memory, storage I/O, or accelerator), start with the smallest type that fits, measure, and resize. Newer generations usually give better price-performance.

**Burstable instances (`t` family, beyond course scope):** Provide a baseline CPU level and accumulate credits to burst above it. They suit workloads with low average CPU and occasional spikes. In the default **unlimited** mode for `t3` and `t4g`, sustained high CPU can add charges.

**Common mistake:** Choosing a larger or GPU instance "to be safe." Oversizing is a common source of cloud waste, and GPU instances cost far more per hour than general-purpose ones.

**Exam pattern:** Questions often describe a workload and ask for the matching family, for example "in-memory database → memory optimized" or "ML inference → accelerated computing."

## Pending Coverage

- Mustafa's own explanation of instance families and selection
