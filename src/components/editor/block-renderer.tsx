"use client";

import type { BaseBlock } from "@/types";

import HeadingBlock from "@/components/blocks/text/heading-block";
import RichTextBlock from "@/components/blocks/text/rich-text-block";
import CalloutBlock from "@/components/blocks/text/callout-block";
import DividerBlock from "@/components/blocks/text/divider-block";
import AccordionBlock from "@/components/blocks/text/accordion-block";
import ImageBlock from "@/components/blocks/media/image-block";
import VideoBlock from "@/components/blocks/media/video-block";
import MultipleChoiceBlock from "@/components/blocks/quiz/multiple-choice-block";
import TrueFalseBlock from "@/components/blocks/quiz/true-false-block";
import FinancialCalculatorBlock from "@/components/blocks/finance/financial-calculator-block";
import InteractiveExampleBlock from "@/components/blocks/finance/interactive-example-block";
import ProgressTrackerBlock from "@/components/blocks/learning/progress-tracker-block";
import AchievementBadgeBlock from "@/components/blocks/learning/achievement-badge-block";
import ConceptExplainerBlock from "@/components/blocks/learning/concept-explainer-block";

interface BlockRendererProps {
  block: BaseBlock;
}

export default function BlockRenderer({ block }: BlockRendererProps) {
  if (!block.visible) return null;

  switch (block.type) {
    case "heading":
      return <HeadingBlock block={block} />;

    case "rich-text":
      return <RichTextBlock block={block} />;

    case "callout":
      return <CalloutBlock block={block} />;

    case "divider":
      return <DividerBlock />;

    case "accordion":
      return <AccordionBlock block={block} />;

    case "image":
      return <ImageBlock block={block} />;

    case "video":
      return <VideoBlock block={block} />;

    case "multiple-choice":
      return <MultipleChoiceBlock block={block} />;

    case "true-false":
      return <TrueFalseBlock block={block} />;

    case "financial-calculator":
      return <FinancialCalculatorBlock block={block} />;

    case "interactive-example":
      return <InteractiveExampleBlock block={block} />;

    case "progress-tracker":
      return <ProgressTrackerBlock block={block} />;

    case "achievement-badge":
      return <AchievementBadgeBlock block={block} />;

    case "concept-explainer":
      return <ConceptExplainerBlock block={block} />;

    default:
      return (
        <div className="rounded-xl border border-dashed border-slate-700 p-5 text-sm text-slate-400">
          {block.title} — Component coming soon.
        </div>
      );
  }
}
