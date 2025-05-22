# Health Flow App
![Screenshot from 2025-05-22 11-31-46](https://github.com/user-attachments/assets/f38c813a-163f-4545-ad3f-ca4134e45f72)
![Screenshot from 2025-05-22 11-32-38](https://github.com/user-attachments/assets/bf95dc33-4429-489c-9bfc-a812101e1f99)
Patient registration application built with Next.js and PgLite for local data storage.


## Features Implemented

- Patient registration and management
- Persist data during page reloads
- Cross-tab synchronization

## Tech Stack Used

- **Frontend Framework**: Next.js 15.3.2
- **Database**: PgLite (Electric SQL)
- **UI Components**:
  - Shadcn UI
  - Tailwind CSS
- **Form Handling**: React Hook Form with Zod validation
- **Additional Tools**:
  - ESLint
  - Prettier

## Setting up the project locally

### Prerequisites

- Node.js (Latest LTS version recommended)
- pnpm (Package manager)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/nameerakhter/health-flow-app
cd health-flow-app
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm run dev
```

The application will be available at `http://localhost:3000`

## Development

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm lint` - Run ESLint checks
- `pnpm format` - Format code with Prettier

## Project Structure

```
src/
├── app/          # Next.js app directory
├── components/   # Reusable UI components
└── lib/         # Utility functions
```

## Development Challenges

1. **Data Persistence**

   - PROBLEM: The problem with persisting data across page refreshes when running a database directly in the browser is that traditional browser environments are designed to be stateless. Any data held in memory by JavaScript, including an in-memory database instance, is lost as soon as the page is unloaded or refreshed. This means that if you're building a client-side application with a database like PGlite, users would lose all their changes every time they navigated away or refreshed the page.

   - SOLUTION: PGlite solves this issue by gving us an option to use IndexedDB. So instead of relyingon in-memory storage, PGlite can be configured to store its entire PostgreSQL database within IndexedDB. I was able to initialize PGlite with a dataDir parameter, it helped me serialize the database state and save it in a persistent storage. So when I refreshed the page PGlite re-initialized itself by reading these stored files from IndexedDB.

2. **Cross-tab Synchronization**

   - PROBLEM: The problem with cross-tab synchronization is that each browser tab typically runs in its own isolated JavaScript environment. If multiple tabs open the same application and interact with what they think is the same local database, they would actually be operating on separate, independent instances of that database. This means a change made in one tab would not automatically reflect in another, leading to inconsistent data views and user will have to manually reload the page to see the correct data.

   - SOLUTION: I was able to solve it by using the PGlite Web Worker and using PGlite's built-in live extension. By creating a pglite-worker.js file (placed in the public folder for Next.js) and initializing PGlite within that worker, I ensured that there's only one single instance of the database running across all open tabs of the application.Also, by including the live extension, PGlite provides mechanisms for tabs to subscribe to real-time updates from this central database. When one tab makes a change to the database through the worker, the live extension can automatically notify other connected tabs about the data change, allowing them to update their UI to reflect the latest state.

3. **NEXTJS LOADING WORKER FILE ON SERVER**

   - PROBLEM: The problem with loading worker files in Next.js is that Next.js has both server-side and client-side rendering. If you place a Web Worker file directly in a app directory, Next.js might try to bundle or process it on the server. Web Workers are browser-specific APIs and cannot be used or run in a Node.js environment (where server-side rendering occurs). This leads to errors and application crashes because the server-side build process was attempting to interpret browser-only code.

   - SOLUTION: I solved it by moving the worker file into the public folder of the Next.js project. The public folder in Next.js is specifically designed for serving static assets directly, without any processing by the Next.js build system on either the server or client side. By placing the pglite-worker.js file in the public directory, I was able to ensure that it is treated as a static file. This means the Next.js server doesn't try to process or execute it during server-side rendering, and the browser can fetch it directly via a simple URL (e.g., /pglite-worker.js) when the client-side JavaScript code attempts to initialize the Web Worker.
