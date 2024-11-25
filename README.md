**Backend Dev Interview Task (Nest.js) 🌐**

Hey! For this task, you'll be building an order management system for *Sukiya*, a Japanese restaurant made just for introverts. They serve up ramen, donburi (meat or fish on rice), nigiri sushi, and yakiniku (grilled meat or fish), and they want a smooth system to keep orders flowing. Here’s what you'll be building:

1. A guest places an order for their meal(s).
2. The order heads to the kitchen, where it’s prepped.
3. Once ready, the kitchen passes it to the waitstaff so they know it’s time to pick it up and serve.

Here’s what’s required to bring this to life:

### Requirements 📜

**1. REST API Design**
Create clear and functional REST API endpoints to handle this order flow.

**2. Order Status & Flow Management with Queueing**
Use the `BullMQ` queue library to manage each order’s progress. The system should keep everyone in sync on what stage each order is in.

**3. Unit Test**
- Write at least **one unit test** for any part of your code to demonstrate functionality and structure.

**4. Working Environment & Demo**
- Prepare a working environment and show the app in action on our next call.

### Data Structure & API Skeleton 🗂️

Your system should support:

- **Orders**
  - An order can have multiple meals.
  - Each order should have a unique identifier (UUID).
  - Status for each order:
    - `"new"` (just placed),
    - `"in_the_kitchen"` (preparing),
    - `"in_delivery"` (ready for waitstaff to serve),
    - `"done"` (delivered to the guest).
  - A `total price` field (sum of the meal prices in that order).

- **Categories**
  - The restaurant offers two main categories:
    - `ramen`
    - `sushi`

- **Meals**
    - Each meal has a `name`, a `category`, and a `price`.
    - `ramen` category:
      - Spicy Miso Tonkotsu Ramen
      - Shoyu Ramen with Grilled Chicken
    - `sushi` category:
      - Chirashi Sushi
      - Uni and Toro Sushi


### What to Build ⚙️

#### 1. **API Endpoints**

Endpoints should allow:
- **Retrieving available categories**
- **Retrieving available meals**: use query params to filter meals by category
- **Placing an order**: accept a list of meals, including quantity, and calculate the total price.
- **Retrieving orders**: use query params to filter orders by status
- **Retrieving order details** by a specific order ID.

#### 2. **Queue Management with Bull**

Set up the Bull queue(s) to:
- Move orders through each stage of the process (e.g., new → kitchen → delivery → done).
- Allow kitchen and waitstaff to check the queue and see what’s ready for them.

#### 3. **Data Validations**
- Use class-validator
- Ensure valid data format - meal categories, prices, UUIDs etc.


### Tech & Tools 🛠️

Use Nest.js, and Bull for the queue management.

---

That’s it! Keep the API clear, simple, and easy to expand on.