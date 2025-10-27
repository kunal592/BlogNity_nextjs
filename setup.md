# Local Development Setup for BlogNity

This guide provides step-by-step instructions to set up and run the BlogNity project on your local machine using Visual Studio Code.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (Version 20.x or higher is recommended)
- [Git](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [PostgreSQL](https://www.postgresql.org/download/): A running PostgreSQL server is required for the database.

---

## Step-by-Step Instructions

### 1. Clone the Repository

First, clone the project repository to your local machine. Open your terminal and run:

```bash
git clone <YOUR_REPOSITORY_URL>
cd <PROJECT_DIRECTORY_NAME>
```

### 2. Install Project Dependencies

Once you are inside the project directory, install all the necessary dependencies defined in `package.json` using npm.

```bash
npm install
```

### 3. Set Up Environment Variables

The project uses a `.env` file to manage environment variables for the database connection, authentication, and payment services.

- In the root of the project, create a new file named `.env`.
- Copy the template below into your new file.

```env
# ------------------
# DATABASE (PostgreSQL)
# ------------------
# Replace with your actual PostgreSQL connection string.
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL="postgresql://postgres:password@localhost:5432/blognity"

# ------------------
# AUTHENTICATION (NextAuth.js)
# ------------------
# A secret key for signing tokens. Generate a secure one using: openssl rand -base64 32
NEXTAUTH_SECRET="YOUR_GENERATED_NEXTAUTH_SECRET"
NEXTAUTH_URL="http://localhost:9002"

# ------------------
# GOOGLE AI (Optional)
# ------------------
# Required for AI-powered features. Get your key from Google AI Studio.
GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY"

# ------------------
# PAYMENTS (Razorpay)
# ------------------
RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
```

**Actions Required:**
1.  **Update `DATABASE_URL`**: Change the connection string to match your local PostgreSQL configuration (username, password, port, and database name).
2.  **Generate `NEXTAUTH_SECRET`**: Run `openssl rand -base64 32` in your terminal and paste the output.
3.  **Add Razorpay Keys**: If you will be testing payments, replace the placeholder values with your actual Razorpay Key ID and Key Secret.

### 4. Set Up the Database

This project uses Prisma as its ORM. The following command reads the `schema.prisma` file and applies the schema to your PostgreSQL database.

```bash
npx prisma migrate dev
```
When prompted, provide a name for the migration (e.g., `initial_setup`). This will create all the necessary tables.

### 5. Generate the Prisma Client

After the database schema is in place, you must generate the Prisma Client. This is a type-safe library tailored specifically to your database models.

```bash
npx prisma generate
```
> **Important:** You must re-run this command every time you make changes to the `schema.prisma` file to update the client.

### 6. Run the Development Server

You are now ready to start the application. The following command starts the local development server.

```bash
npm run dev
```

The application will start on port `9002`. You can access it by opening your browser to:
**[http://localhost:9002](http://localhost:9002)**

---

## VS Code Integration

### Recommended Extensions

- **[Prisma](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma)**: For syntax highlighting and autocompletion.
- **[ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)**: For code linting.
- **[Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)**: For code formatting.

### Using the Integrated Terminal

You can run all the commands listed above directly within VS Code's integrated terminal (`Ctrl+\``).

---

## Quick Command Summary

```bash
# 1. Install dependencies
npm install

# 2. Apply database migrations
npx prisma migrate dev

# 3. Generate Prisma Client
npx prisma generate

# 4. Start the development server
npm run dev
```
