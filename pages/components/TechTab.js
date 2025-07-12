/**
 * TechTab组件 - 技术栈标签页内容
 * @returns {React.ReactElement}
 */
function TechTab() {
  /** @type {import('./types.js').TechStack[]} */
  const techStacks = [
    { name: "Bun", icon: "fas fa-bolt", color: "bg-yellow-500" },
    { name: "ElysiaJS", icon: "fas fa-server", color: "bg-blue-500" },
    { name: "Drizzle ORM", icon: "fas fa-database", color: "bg-green-500" },
    { name: "PostgreSQL", icon: "fas fa-elephant", color: "bg-blue-600" },
    { name: "DDD + CQRS", icon: "fas fa-sitemap", color: "bg-purple-500" },
    { name: "GitHub Actions", icon: "fab fa-github", color: "bg-gray-800" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <i className="fas fa-cogs mr-3 text-purple-500"></i>
        技术栈
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {techStacks.map((tech, index) => (
          <div
            key={index}
            className="text-center p-4 rounded-lg border border-gray-200 card-hover"
          >
            <div
              className={`w-12 h-12 ${tech.color} rounded-full flex items-center justify-center mx-auto mb-3`}
            >
              <i className={`${tech.icon} text-white text-xl`}></i>
            </div>
            <h3 className="font-semibold text-gray-800">{tech.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

// 暴露到全局作用域
window.TechTab = TechTab;
