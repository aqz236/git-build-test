/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { Route as rootRouteImport } from './app/routes/__root'
import { Route as IndexRouteImport } from './app/routes/index'
import { Route as GithubManagerIndexRouteImport } from './app/routes/github-manager.index'

const IndexRoute = IndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport,
} as any)
const GithubManagerIndexRoute = GithubManagerIndexRouteImport.update({
  id: '/github-manager/',
  path: '/github-manager/',
  getParentRoute: () => rootRouteImport,
} as any)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/github-manager': typeof GithubManagerIndexRoute
}
export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/github-manager': typeof GithubManagerIndexRoute
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/': typeof IndexRoute
  '/github-manager/': typeof GithubManagerIndexRoute
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/github-manager'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/github-manager'
  id: '__root__' | '/' | '/github-manager/'
  fileRoutesById: FileRoutesById
}
export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  GithubManagerIndexRoute: typeof GithubManagerIndexRoute
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/github-manager/': {
      id: '/github-manager/'
      path: '/github-manager'
      fullPath: '/github-manager'
      preLoaderRoute: typeof GithubManagerIndexRouteImport
      parentRoute: typeof rootRouteImport
    }
  }
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  GithubManagerIndexRoute: GithubManagerIndexRoute,
}
export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()
