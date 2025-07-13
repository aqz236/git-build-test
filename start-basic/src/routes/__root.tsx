/// <reference types="vite/client" />
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  HeadContent,
  Link,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Github, Home as HomeIcon, Settings } from "lucide-react";
import * as React from "react";
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary";
import { NotFound } from "~/components/NotFound";
import appCss from "~/styles/app.css?url";
import { seo } from "~/utils/seo";

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
      { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
      { rel: "icon", href: "/favicon.ico" },
    ],
    scripts: [
      {
        src: "/customScript.js",
        type: "text/javascript",
      },
    ],
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body className="bg-gray-50">
        <QueryClientProvider client={queryClient}>
          {/* Modern Navigation Bar */}
          <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="container mx-auto px-6">
              <div className="flex items-center justify-between h-16">
                {/* Logo and Brand */}
                <Link
                  to="/"
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">
                      DevTools
                    </h1>
                    <p className="text-xs text-gray-500">开发者工具平台</p>
                  </div>
                </Link>

                {/* Navigation Links */}
                <div className="flex items-center gap-1">
                  <Link
                    to="/"
                    activeOptions={{ exact: true }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100"
                    activeProps={{
                      className: "bg-blue-50 text-blue-600 hover:bg-blue-100",
                    }}
                    inactiveProps={{
                      className: "text-gray-600",
                    }}
                  >
                    <HomeIcon className="w-4 h-4" />
                    首页
                  </Link>
                  <Link
                    to="/github"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100"
                    activeProps={{
                      className: "bg-blue-50 text-blue-600 hover:bg-blue-100",
                    }}
                    inactiveProps={{
                      className: "text-gray-600",
                    }}
                  >
                    <Github className="w-4 h-4" />
                    GitHub管理器
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>

          <TanStackRouterDevtools position="bottom-right" />
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}
