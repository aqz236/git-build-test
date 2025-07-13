import { GitHubService } from './services/github.service';
import { createApiRoutes } from './routes/api.routes';
import type { BatchDeleteRequest } from '../shared/types';

// 从环境变量获取配置
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'aqz236';
const GITHUB_REPO = process.env.GITHUB_REPO || 'git-build-test';
const PORT = process.env.PORT || 3000;

if (!GITHUB_TOKEN) {
  console.error('GITHUB_TOKEN environment variable is required');
  process.exit(1);
}

// 创建GitHub服务实例
const githubService = new GitHubService(GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO);
const apiRoutes = createApiRoutes(githubService);

const server = Bun.serve({
  port: PORT,
  async fetch(request) {
    const url = new URL(request.url);
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // API Routes
    if (url.pathname.startsWith('/api/')) {
      let response: Response;

      try {
        switch (url.pathname) {
          case '/api/repository':
            if (request.method === 'GET') {
              response = await apiRoutes.getRepository();
            } else {
              response = new Response('Method not allowed', { status: 405 });
            }
            break;

          case '/api/releases':
            if (request.method === 'GET') {
              response = await apiRoutes.getReleases();
            } else {
              response = new Response('Method not allowed', { status: 405 });
            }
            break;

          case '/api/tags':
            if (request.method === 'GET') {
              response = await apiRoutes.getTags();
            } else {
              response = new Response('Method not allowed', { status: 405 });
            }
            break;

          case '/api/releases/batch':
            if (request.method === 'DELETE') {
              const body = await request.json() as BatchDeleteRequest;
              response = await apiRoutes.batchDelete(body);
            } else {
              response = new Response('Method not allowed', { status: 405 });
            }
            break;

          default:
            // Handle dynamic routes
            const releaseMatch = url.pathname.match(/^\/api\/releases\/(\d+)$/);
            const tagMatch = url.pathname.match(/^\/api\/tags\/(.+)$/);
            const commitMatch = url.pathname.match(/^\/api\/commits\/([a-f0-9]+)$/);

            if (releaseMatch && request.method === 'DELETE') {
              const releaseId = parseInt(releaseMatch[1]!);
              response = await apiRoutes.deleteRelease(releaseId);
            } else if (tagMatch && request.method === 'DELETE') {
              const tagName = decodeURIComponent(tagMatch[1]!);
              response = await apiRoutes.deleteTag(tagName);
            } else if (commitMatch && request.method === 'GET') {
              const sha = commitMatch[1]!;
              response = await apiRoutes.getCommit(sha);
            } else {
              response = new Response('Not found', { status: 404 });
            }
        }
      } catch (error) {
        console.error('API Error:', error);
        response = new Response('Internal server error', { status: 500 });
      }

      // Add CORS headers to API responses
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      return response;
    }

    // Serve static files
    if (url.pathname === '/' || url.pathname === '/index.html') {
      const file = Bun.file('./public/index.html');
      return new Response(file);
    }

    // Serve TSX files in development mode  
    if (url.pathname.startsWith('/src/') && url.pathname.endsWith('.tsx')) {
      try {
        // Build the TSX file on-the-fly in development
        const result = await Bun.build({
          entrypoints: [`.${url.pathname}`],
          target: 'browser',
          format: 'esm',
          minify: false,
          sourcemap: 'inline',
        });
        
        if (result.success && result.outputs[0]) {
          const content = await result.outputs[0].text();
          return new Response(content, {
            headers: {
              'Content-Type': 'application/javascript',
              'Cache-Control': 'no-cache',
            },
          });
        }
      } catch (error) {
        console.error('Failed to build TSX file:', error);
        return new Response('Failed to build TSX file', { status: 500 });
      }
    }

    // Serve other static files
    if (url.pathname.startsWith('/')) {
      const file = Bun.file(`./public${url.pathname}`);
      if (await file.exists()) {
        return new Response(file);
      }
    }

    return new Response('Not found', { status: 404 });
  },
});

console.log(`🚀 Server running on http://localhost:${PORT}`);
console.log(`📊 Managing repository: ${GITHUB_OWNER}/${GITHUB_REPO}`);
