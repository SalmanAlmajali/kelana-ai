import AssistantClient from "./AssistantClient";

export const metadata = {
  title: "Assistant | KelanaAI",
  description: "Ask factual travel questions and get grounded answers with source citations.",
};

export default function AssistantPage() {
  return <AssistantClient />;
}
