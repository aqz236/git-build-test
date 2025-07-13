/// <reference types="vite/client" />
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Github, Home as HomeIcon, Settings } from "lucide-react";
import * as React from "react";
import { DefaultCatchBoundary } from "~/features/github-manager/components/DefaultCatchBoundary";
import { NotFound } from "~/features/github-manager/components/NotFound";
import appCss from "~/styles/app.css?url";
import { seo } from "~/shared/utils/seo";

// 创建 QueryClient 实例
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5分钟
      refetchOnWindowFocus: false,
    },
  },
});

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title: "开发者工具平台 | Developer Tools Platform",
        description:
          "一个集成多种开发者工具的管理平台，包括GitHub仓库管理、CI/CD工具等。",
      }),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
  }),
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gray-50">
          {/* 导航栏 */}
          <nav className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-8">
                  <h1 className="text-xl font-bold text-gray-900">
                    开发者工具平台
                  </h1>
                  <div className="flex space-x-4">
                    <Link
                      to="/"
                      className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors"
                      activeProps={{
                        className:
                          "text-blue-600 bg-blue-50 border-blue-200 border",
                      }}
                    >
                      <HomeIcon className="w-4 h-4 mr-2" />
                      首页
                    </Link>
                    <Link
                      to="/github_releases_tags"
                      className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors"
                      activeProps={{
                        className:
                          "text-blue-600 bg-blue-50 border-blue-200 border",
                      }}
                    >
                      <Github className="w-4 h-4 mr-2" />
                      GitHub 管理器
                    </Link>
                  </div>
                </div>
                <div className="flex items-center">
                  <button className="p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md">
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </nav>

          {/* 主要内容区域 */}
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </QueryClientProvider>
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
        <TanStackRouterDevtools position="bottom-right" />
      </body>
    </html>
  );
}
