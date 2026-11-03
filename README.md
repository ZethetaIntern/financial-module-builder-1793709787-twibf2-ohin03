# FinanceLab — Interactive Financial Education Module Builder

FinanceLab is a block-based financial education module builder designed to help content creators build, organize, preview, and export interactive financial learning modules.

The application provides a visual editing experience with reusable content blocks, drag-and-drop organization, undo/redo history, financial calculations, learner preview, and JSON-based module portability.

## Features

### 1. Module Management

* Create and organize multiple learning modules.
* Edit module titles and descriptions.
* Open existing modules from the dashboard.
* Delete modules with a confirmation dialog.
* Persist module deletion and saved content changes.
* Automatically save module data locally.

### 2. Block-Based Content Builder

* Add, update, delete, and reorder content blocks.
* Control block visibility.
* Organize learning content using reusable blocks.
* Edit rich text content using TipTap.

### 3. 14 Interactive Content Blocks

| Category | Block Types                                            |
| -------- | ------------------------------------------------------ |
| Text     | Heading, Rich Text, Callout, Divider, Accordion        |
| Media    | Image, Video                                           |
| Quiz     | Multiple Choice, True/False                            |
| Finance  | Financial Calculator, Interactive Example              |
| Learning | Progress Tracker, Achievement Badge, Concept Explainer |

### 4. Drag and Drop

* Reorder content blocks using drag-and-drop.
* Support keyboard-accessible drag-and-drop interactions.
* Persist block ordering.
* Keep editing controls separate from learner preview.

### 5. Undo and Redo

* Track editing changes through history.
* Support up to 50 history states.
* Undo and redo editing operations.
* Use keyboard shortcuts for history navigation.

### 6. Financial Calculator

* Perform interactive compound interest calculations.
* Validate calculator inputs.
* Handle invalid and empty inputs safely.
* Update calculations as inputs change.

### 7. Learner Preview

* Switch between editing and learner preview modes.
* View learner-facing module titles and descriptions.
* Display visible content blocks without the editor's drag-and-drop interface.
* Hide blocks marked as invisible.
* Preview layouts using desktop, tablet, and mobile device widths.

### 8. Responsive User Interface

* Responsive dashboard and editor layouts.
* Compact mobile toolbar.
* Desktop toolbar controls.
* Mobile-friendly navigation and editing controls.
* Responsive content and preview layouts.

### 9. JSON Export and Import

* Export complete learning modules as JSON files.
* Import previously exported modules.
* Validate imported data using Zod.
* Check block types, categories, and duplicate IDs.
* Handle malformed JSON and invalid module structures.
* Enforce a 5 MB import file size limit.

## Technology Stack

### Frontend

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS 4

### State Management

* Zustand 5
* Browser Local Storage

### Rich Text Editing

* TipTap 3
* TipTap StarterKit
* TipTap Image Extension
* TipTap Link Extension
* TipTap Underline Extension

### Drag and Drop

* dnd-kit Core
* dnd-kit Sortable
* dnd-kit Utilities

### Validation and Icons

* Zod 4
* Lucide React

### Testing

* Vitest
* Playwright
* React Testing Library
* Testing Library User Event

## Getting Started

### Prerequisites

* Node.js 22 or later
* npm 10 or later
* Git

### Installation

Clone the repository:

```bash
git clone https://github.com/ohin03/financial-module-builder.git
```

Navigate to the project directory:

```bash
cd financial-module-builder
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the application:

```text
http://localhost:3000
```

## Available Scripts

| Command              | Description                          |
| -------------------- | ------------------------------------ |
| `npm run dev`        | Start the Next.js development server |
| `npm run build`      | Build the application for production |
| `npm run start`      | Start the production server          |
| `npm run lint`       | Run ESLint                           |
| `npm run test`       | Run the Vitest test suite            |
| `npm run test:watch` | Run Vitest in watch mode             |

## Project Structure

```text
financial-module-builder/
├── public/
├── src/
│   ├── app/
│   │   ├── editor/
│   │   ├── globals.css
│   │   └── page.tsx
│   ├── components/
│   │   ├── blocks/
│   │   │   ├── finance/
│   │   │   ├── learning/
│   │   │   ├── media/
│   │   │   ├── quiz/
│   │   │   └── text/
│   │   ├── editor/
│   │   ├── layout/
│   │   ├── panels/
│   │   ├── preview/
│   │   └── ui/
│   ├── data/
│   ├── hooks/
│   ├── lib/
│   │   ├── editor/
│   │   ├── finance/
│   │   ├── history/
│   │   ├── utils/
│   │   └── validation/
│   ├── store/
│   └── types/
├── tests/
│   ├── e2e/
│   └── unit/
├── package.json
├── playwright.config.ts
├── vitest.config.ts
└── README.md
```

## Testing

Run unit tests:

```bash
npm run test
```

Run end-to-end tests:

```bash
npx playwright test
```

Run TypeScript validation:

```bash
npx tsc --noEmit
```

Run ESLint:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

## Data Storage

FinanceLab currently uses browser Local Storage for module persistence.

Module information and saved content are maintained locally using dedicated storage keys.

Deleting a module removes its saved module entry and associated content from Local Storage.

JSON export and import allow learning modules to be transferred between compatible FinanceLab environments.

## Project Status

| Day   | Development Phase                     | Status      |
| ----- | ------------------------------------- | ----------- |
| Day 1 | Research and Architecture             | Completed   |
| Day 2 | Core Foundation and 14 Content Blocks | Completed   |
| Day 3 | Drag and Drop and Undo/Redo           | Completed   |
| Day 4 | Financial Interactions and Validation | Completed   |
| Day 5 | Learner Preview System                | Completed   |
| Day 6 | JSON Export/Import                    | Completed   |
| Day 7 | Integration, Testing, and UI Polish   | Completed   |
| Day 8 | Documentation and Final QA            | Completed   |

## Developer

**Nur Foisal Ohin**

* GitHub: [@ohin03](https://github.com/ohin03)
* LinkedIn: [Nur Foisal Ohin](https://www.linkedin.com/in/nur-foisal-ohin/)

---

Built as an interactive financial education module builder project.
