import { GitBranch, Tag } from "lucide-react";
import { useGitHubStore } from "~/utils/github-store";

export function TabSwitcher() {
  const { activeTab, setActiveTab } = useGitHubStore();

  const tabs = [
    { id: "releases" as const, label: "Releases", icon: Tag },
    { id: "tags" as const, label: "Tags", icon: GitBranch },
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === id
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
