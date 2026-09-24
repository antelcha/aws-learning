# How to Provision AWS Resources

**Course:** AWS Cloud Practitioner — Compute in the Cloud  
**Progress:** Third lesson completed

## Mustafa's Explanation

> there are three ways to launch an ec2 instance. first one is to do it manually from the console. but it's prone to error and repetitive. second is by using aws cli, third one is using the sdk with a programming language.

## Corrections

- **Broader than EC2:** The course frames these as the three ways to **call AWS APIs**, not only to launch EC2. In AWS, everything is an API call: the console, CLI, and SDK all call the same APIs behind the scenes.
- **The console is not simply "bad":** It is the recommended place to start learning, and it suits test environments, viewing bills, monitoring, and non-technical tasks. The problem is **repeated manual provisioning** in production-type environments: navigating screens again each time invites mistakes such as a missed checkbox or a typo.

## Course Content (paraphrased)

| Method | How it works | Best for |
| --- | --- | --- |
| AWS Management Console | Browser-based, visual | Learning, test environments, bills, monitoring, non-technical tasks |
| AWS CLI | Text commands in a terminal, such as `aws ec2 run-instances` and `aws ec2 describe-availability-zones` | Scripting and automation |
| AWS SDK | AWS APIs from a programming language, such as Python | Integrating AWS into applications and automation |

- **AWS CloudShell** is a browser-based terminal with the AWS CLI preinstalled.
- Automation makes cloud deployments successful and predictable over time.
- **Shared responsibility for compute:** Amazon EC2 is an **unmanaged** service. The customer configures security, manages the guest operating system, applies updates, and sets up firewalls (security groups). AWS is responsible for the underlying cloud infrastructure. Managed services are covered later in the course.

**Exam trap:** The main advantage of the CLI over the console is automation and scripting, which reduces manual steps and errors — not a visual interface or suitability for one-time tasks.

## Recall Check

Scenario: a team launches 20 identical EC2 instances every Monday through the console; one week, an instance is launched without the correct security group.

- **Root cause:** Answered correctly — manual console launches invite mistakes.
- **Fix:** Answered correctly — write an SDK script once and schedule it with a cron job. The configuration, including the security group, is defined once and every run is identical; the script can be version-controlled and reviewed. A CLI script works equally well.
- **Who patches the guest OS?** Answered correctly — the team, because EC2 is an unmanaged service. AWS patches the physical host and hypervisor; on a managed service such as Amazon RDS, AWS patches the database's operating system.

## Additional Context (not from the course)

- For a software engineer: the CLI and SDKs (for example, `boto3` for Python) are clients over the same AWS HTTP APIs, and every call is authorized by the same IAM permissions regardless of the method.
- Beyond scripts, **Infrastructure as Code** (for example, AWS CloudFormation or Terraform) describes resources declaratively so the same environment can be created and torn down repeatedly.

## Pending Coverage

- Mustafa's explanation of managed vs. unmanaged services (covered later in the course)

## English Note #english

**Natural version:** “There are three ways to launch an EC2 instance. The first is to do it manually from the console, but that is **error-prone** and repetitive. The second is to use the AWS CLI, and the third is to use an SDK with a programming language.”

- Ordinals usually take **the**: *the first one*, *the second*.
- **Error-prone** is the common compound adjective; *prone to errors* (plural) also works, but *prone to error* sounds less natural here.
- Keep parallel forms in a list: *to do… to use… to use…*.
- *launching **by** the console* → *launching **from** (or **through**) the console*.
- *there may be a mistake* → *mistakes can happen* for a general risk.
- *switch **for** SDK* → *switch **to** the SDK*; *create a script **ones*** → ***once***; *everymorning* → *every morning*.
