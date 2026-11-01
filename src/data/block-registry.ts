import type { BlockDefinition } from "@/types";

export const BLOCK_REGISTRY: BlockDefinition[] = [
  // TEXT BLOCKS
  {
    type: "heading",
    category: "text",
    label: "Heading",
    description: "Add section headings to your learning module.",
    icon: "Heading",
  },
  {
    type: "rich-text",
    category: "text",
    label: "Rich Text",
    description: "Create formatted educational content.",
    icon: "FileText",
  },
  {
    type: "callout",
    category: "text",
    label: "Callout",
    description: "Highlight important information and tips.",
    icon: "MessageSquare",
  },
  {
    type: "divider",
    category: "text",
    label: "Divider",
    description: "Separate different content sections.",
    icon: "Minus",
  },
  {
    type: "accordion",
    category: "text",
    label: "Accordion",
    description: "Organize expandable information sections.",
    icon: "ListCollapse",
  },

  // MEDIA BLOCKS
  {
    type: "image",
    category: "media",
    label: "Image",
    description: "Add images to explain financial concepts.",
    icon: "Image",
  },
  {
    type: "video",
    category: "media",
    label: "Video",
    description: "Embed educational videos.",
    icon: "Video",
  },

  // QUIZ BLOCKS
  {
    type: "multiple-choice",
    category: "quiz",
    label: "Multiple Choice Quiz",
    description: "Create interactive multiple-choice questions.",
    icon: "ListChecks",
  },
  {
    type: "true-false",
    category: "quiz",
    label: "True / False Quiz",
    description: "Test learners with true or false questions.",
    icon: "CircleCheck",
  },

  // FINANCE BLOCKS
  {
    type: "financial-calculator",
    category: "finance",
    label: "Financial Calculator",
    description: "Add interactive financial learning calculators.",
    icon: "Calculator",
  },
  {
    type: "interactive-example",
    category: "finance",
    label: "Interactive Example",
    description: "Demonstrate financial concepts with examples.",
    icon: "ChartNoAxesCombined",
  },

  // LEARNING BLOCKS
  {
    type: "progress-tracker",
    category: "learning",
    label: "Progress Tracker",
    description: "Show learning progress and completion.",
    icon: "ChartNoAxesColumnIncreasing",
  },
  {
    type: "achievement-badge",
    category: "learning",
    label: "Achievement Badge",
    description: "Reward learners for completing activities.",
    icon: "Award",
  },
  {
    type: "concept-explainer",
    category: "learning",
    label: "Concept Explainer",
    description: "Explain concepts through engaging visual content.",
    icon: "Lightbulb",
  },
];

export function getBlockDefinition(type: string) {
  return BLOCK_REGISTRY.find((block) => block.type === type);
}

export function getBlocksByCategory(category: string) {
  return BLOCK_REGISTRY.filter((block) => block.category === category);
}
