import type { LucideIcon } from "lucide-react";
import {
  Layers,
  ListChecks,
  MessagesSquare,
  Route,
  Sparkles,
} from "lucide-react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { StudyPanel, StudyPanelEmpty } from "@/components/common/StudyPanel";
import { FlashcardSection } from "@/features/flashcard/components/FlashcardSection";
import { QuizSection } from "@/features/quiz/components/QuizSection";
import { SummarySection } from "@/features/summary/components/SummarySection";
import { ConversationSection } from "@/features/conversation/components/ConversationSection";
import { Document } from "@/types/api/document.types";

interface Props {
  document: Document;
}

function TabLabel({
  icon: Icon,
  label,
  ready,
}: {
  icon: LucideIcon;
  label: string;
  ready?: boolean;
}) {
  return (
    <>
      <Icon />
      {label}

      {/* A quiet dot marks tabs that already have generated content. */}
      {ready ? (
        <span
          aria-label="Generated"
          className="ml-0.5 size-1.5 rounded-full bg-primary"
        />
      ) : null}
    </>
  );
}

export function DocumentTabs({ document: doc }: Props) {
  const ai = doc.ai;

  return (
    <Tabs defaultValue="summary" className="gap-0">
      {/*
        Horizontal scroll keeps all five tabs reachable on a phone.
        The border lives on this wrapper, not the TabsList: the list has a
        fixed h-8 and the active underline is absolutely positioned just past
        its bottom edge, so anchoring the rule here lets the two sit flush.
      */}
      <div className="scrollbar-none -mx-1 overflow-x-auto border-b border-border px-1">
        <TabsList variant="line" className="w-max gap-4">
          <TabsTrigger value="summary">
            <TabLabel
              icon={Sparkles}
              label="Summary"
              ready={ai?.summaryGenerated}
            />
          </TabsTrigger>

          <TabsTrigger value="flashcards">
            <TabLabel
              icon={Layers}
              label="Flashcards"
              ready={ai?.flashcardsGenerated}
            />
          </TabsTrigger>

          <TabsTrigger value="quiz">
            <TabLabel
              icon={ListChecks}
              label="Quiz"
              ready={ai?.quizGenerated}
            />
          </TabsTrigger>

          <TabsTrigger value="roadmap">
            <TabLabel
              icon={Route}
              label="Roadmap"
              ready={ai?.roadmapGenerated}
            />
          </TabsTrigger>

          <TabsTrigger value="chat">
            <TabLabel icon={MessagesSquare} label="Chat" ready={ai?.chatEnabled} />
          </TabsTrigger>
        </TabsList>
      </div>

      <div className="pt-6">
        <TabsContent value="summary">
          <SummarySection documentId={doc.id} />
        </TabsContent>

        <TabsContent value="flashcards">
          <FlashcardSection documentId={doc.id} />
        </TabsContent>

        <TabsContent value="quiz">
          <QuizSection documentId={doc.id} />
        </TabsContent>

        <TabsContent value="roadmap">
          <StudyPanel
            icon={Route}
            title="Learning roadmap"
            description="A guided path through this material"
          >
            <StudyPanelEmpty
              icon={Route}
              title="Roadmap is coming soon"
              description="We're building a step-by-step study plan that sequences this document into manageable sessions."
            />
          </StudyPanel>
        </TabsContent>

        <TabsContent value="chat">
          <ConversationSection documentId={doc.id} />
        </TabsContent>
      </div>
    </Tabs>
  );
}
