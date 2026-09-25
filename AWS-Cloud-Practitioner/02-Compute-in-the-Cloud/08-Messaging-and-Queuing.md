# Messaging and Queuing

**Course:** AWS Cloud Practitioner — Compute in the Cloud  
**Progress:** Eighth lesson completed

## Learning Record

The lesson was completed. Mustafa provided the transcript and page text but had no notes of his own. He asked for a deeper, visual explanation of microservices: see [Mikroservis Kahvehanesi](visuals/mikroservis-kahvehanesi.html).

## Course Content (paraphrased)

**The problem:** In the coffee shop, the cashier hands each order directly to the barista. If the barista is on break or busy, the cashier is stuck, and orders get dropped. The fix is a buffer: the cashier posts orders to an **order board**, and the barista takes them when ready.

| Architecture | Meaning | When one component fails |
| --- | --- | --- |
| **Tightly coupled** | Components communicate directly and depend on each other | Other components, or the whole system, see errors (cascading failure) |
| **Loosely coupled** | Components communicate through a buffer such as a message queue | The failure stays isolated; messages wait in the queue until processed |

- **Monolithic application:** database logic, web servers, user interface, and business logic are tightly coupled; one failure can bring down the whole application.
- **Microservices:** components are loosely coupled; if one fails, the others keep working. Loose coupling is what AWS architectures aim for.

| Service | Model | Coffee shop | Key point |
| --- | --- | --- | --- |
| **Amazon SQS** (Simple Queue Service) | Message queue | The order board | Sends, stores, and receives messages between components at any volume, without losing messages or requiring consumers to be available. A consumer retrieves a message, processes it, and removes it from the queue. |
| **Amazon SNS** (Simple Notification Service) | Publish-subscribe | The barista calling out "order ready" | Publishers send messages to **topics**; subscribers receive them immediately. Messages are not held for later pickup. Subscribers can be web servers, email addresses, Lambda functions, and other endpoints; SNS can also fan out to users through mobile push, SMS, and email. |
| **Amazon EventBridge** | Serverless event routing | — | Routes events from custom apps, AWS services, and third-party software to other applications; receives, filters, transforms, and delivers events. If a target service fails, the event is stored and delivered when the service is available again. |

- The data inside a message is its **payload**, for example the customer's name, order, and time.
- SQS queues scale automatically, are reliable, and are simple to configure.

**Course examples:**

- **EventBridge:** a food delivery app routes "order placed" and "payment completed" events to payment, restaurant, inventory, and delivery services, each working independently.
- **SNS:** instead of one email with every update, customers subscribe only to the topics they want, such as new products or special offers.

**Exam traps:**

- "A service is temporarily down; the data must not be lost and should be processed later" → SQS.
- "Notify many subscribers at once" or "customers choose which updates to receive" → SNS topics.
- "If one component fails, the others keep working" → loosely coupled.

**Course practice questions** (answers not recorded):

- Key difference between tightly and loosely coupled architectures?
- Main advantage of SQS when a bank's fraud detection service is temporarily down?

## Additional Context (not from the course)

- The course says SNS messages "need a response right now." More precisely, SNS pushes each message to subscribers immediately and does not keep it for later pickup; a common pattern subscribes an SQS queue to an SNS topic, so each consumer gets its own durable copy (fan-out).

## Pending Coverage

- Mustafa's explanation of tight vs. loose coupling and of SQS vs. SNS
