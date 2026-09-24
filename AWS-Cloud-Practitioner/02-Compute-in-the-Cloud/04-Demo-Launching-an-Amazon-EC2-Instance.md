# Demo: Launching an Amazon EC2 Instance

**Course:** AWS Cloud Practitioner — Compute in the Cloud  
**Progress:** Fourth lesson completed

## Mustafa's Explanation

> ami is a snapshot of a specific operating system, it helps to create the same machine with the same features when auto scaling.

## Corrections

- **More than an operating system:** An AMI (Amazon Machine Image) is a pre-built image containing everything needed to start an instance: the operating system, storage setup, architecture type, launch permissions, and any preinstalled software. "Snapshot" is a useful intuition, since it captures a machine's configured state.
- **Not only for Auto Scaling:** Repeatability applies to every launch. The same AMI gives consistent development, testing, and production environments, which also helps when scaling.

## Course Content (paraphrased)

- **AMI components:** operating system, storage setup, architecture type, launch permissions, and extra installed software. One AMI can launch many instances with the same setup.
- **Three ways to get an AMI:**
  1. **Custom AMI:** build your own with specific configurations and software.
  2. **AWS-provided AMIs:** preconfigured for common operating systems and software.
  3. **AWS Marketplace:** buy AMIs from third-party vendors with specialized software.
- **Repeatability:** identical configurations and automated deployments keep environments consistent, reduce errors, help with scaling, and simplify managing large environments.

**Course practice questions** (answers not recorded):

- Which three configurations are required to launch an EC2 instance for a web server?
- What is an AMI used for when launching an EC2 instance?

## Recall Check

Scenario: web servers launch from an AWS-provided Amazon Linux AMI and install 15 packages at startup (12 minutes); package versions sometimes differ between servers.

- **Which AMI?** Answered correctly — a custom AMI.
- **Why it fixes both problems:** After a hint, answered correctly — the packages are installed once when the AMI is built, and every launch reuses that image. Startup no longer waits for installation, and every instance gets exactly the same package versions.
- **Commercial firewall appliance:** Answered correctly — AWS Marketplace.

## Pending Coverage

- The three ways to get an AMI (custom, AWS-provided, AWS Marketplace), in Mustafa's words
- The key configurations shown in the demo; the demo video transcript was not provided

## English Note #english

**Natural version:** “**An** AMI is a snapshot of a specific operating system. It helps **you create identical machines** with the same **configuration** when auto scaling.”

- Articles again: *ami is* → ***An** AMI is*. It uses *an*, not *a*, because *AMI* starts with a vowel sound (/eɪ/). The same pattern as [the first, the second](https://github.com/antelcha/english/blob/main/notes/P0012-the-first-the-second.md).
- *helps to create the same machine* → *helps you create identical machines*. *Help (someone) do* is common without *to*; plural *machines* because there are many.
- *features* → *configuration* for settings and installed software.
- *custom ami's* → *custom AMIs*: acronym plurals take no apostrophe. *usecase* → *use case*. *they can it from* → *they can **get** it from*. *their usecase is a fit* → *it **fits** their use case*.
- *install it for once* → *install them once*. *For once* is an idiom meaning "this time, unusually" (*For once, the build passed.*). *Them* refers to the packages.
