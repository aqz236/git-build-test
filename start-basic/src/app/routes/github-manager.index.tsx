import { createFileRoute } from "@tanstack/react-router";
import { GitHubManager } from "~/app/github-manager/components/GitHubManager";

export const Route = createFileRoute("/github-manager/")({
  component: GitHubManagerPage,
});

function GitHubManagerPage() {
  return (
    <div className="bg-gray-50 min-h-full">
      <div className="container mx-auto p-6">
        <GitHubManager />
      </div>
    </div>
  );
}
