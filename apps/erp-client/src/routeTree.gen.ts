/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/~__root'
import { Route as AuthImport } from './routes/~_auth'
import { Route as AppImport } from './routes/~_app'
import { Route as AuthSignUpImport } from './routes/~_auth/~sign-up'
import { Route as AuthSignInImport } from './routes/~_auth/~sign-in'
import { Route as AppSettingsImport } from './routes/~_app/~_settings'
import { Route as AppIndexImport } from './routes/~_app/~index'
import { Route as AppSettingsSettingsGeneralImport } from './routes/~_app/~_settings/~settings.general'

// Create/Update Routes

const AuthRoute = AuthImport.update({
  id: '/_auth',
  getParentRoute: () => rootRoute,
} as any)

const AppRoute = AppImport.update({
  id: '/_app',
  getParentRoute: () => rootRoute,
} as any)

const AuthSignUpRoute = AuthSignUpImport.update({
  path: '/sign-up',
  getParentRoute: () => AuthRoute,
} as any)

const AuthSignInRoute = AuthSignInImport.update({
  path: '/sign-in',
  getParentRoute: () => AuthRoute,
} as any)

const AppSettingsRoute = AppSettingsImport.update({
  id: '/_settings',
  getParentRoute: () => AppRoute,
} as any)

const AppIndexRoute = AppIndexImport.update({
  path: '/',
  getParentRoute: () => AppRoute,
} as any)

const AppSettingsSettingsGeneralRoute = AppSettingsSettingsGeneralImport.update(
  {
    path: '/settings/general',
    getParentRoute: () => AppSettingsRoute,
  } as any,
)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_app': {
      id: '/_app'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AppImport
      parentRoute: typeof rootRoute
    }
    '/_auth': {
      id: '/_auth'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthImport
      parentRoute: typeof rootRoute
    }
    '/_app/': {
      id: '/_app/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof AppIndexImport
      parentRoute: typeof AppImport
    }
    '/_app/_settings': {
      id: '/_app/_settings'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AppSettingsImport
      parentRoute: typeof AppImport
    }
    '/_auth/sign-in': {
      id: '/_auth/sign-in'
      path: '/sign-in'
      fullPath: '/sign-in'
      preLoaderRoute: typeof AuthSignInImport
      parentRoute: typeof AuthImport
    }
    '/_auth/sign-up': {
      id: '/_auth/sign-up'
      path: '/sign-up'
      fullPath: '/sign-up'
      preLoaderRoute: typeof AuthSignUpImport
      parentRoute: typeof AuthImport
    }
    '/_app/_settings/settings/general': {
      id: '/_app/_settings/settings/general'
      path: '/settings/general'
      fullPath: '/settings/general'
      preLoaderRoute: typeof AppSettingsSettingsGeneralImport
      parentRoute: typeof AppSettingsImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  AppRoute: AppRoute.addChildren({
    AppIndexRoute,
    AppSettingsRoute: AppSettingsRoute.addChildren({
      AppSettingsSettingsGeneralRoute,
    }),
  }),
  AuthRoute: AuthRoute.addChildren({ AuthSignInRoute, AuthSignUpRoute }),
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "~__root.tsx",
      "children": [
        "/_app",
        "/_auth"
      ]
    },
    "/_app": {
      "filePath": "~_app.tsx",
      "children": [
        "/_app/",
        "/_app/_settings"
      ]
    },
    "/_auth": {
      "filePath": "~_auth.tsx",
      "children": [
        "/_auth/sign-in",
        "/_auth/sign-up"
      ]
    },
    "/_app/": {
      "filePath": "~_app/~index.tsx",
      "parent": "/_app"
    },
    "/_app/_settings": {
      "filePath": "~_app/~_settings.tsx",
      "parent": "/_app",
      "children": [
        "/_app/_settings/settings/general"
      ]
    },
    "/_auth/sign-in": {
      "filePath": "~_auth/~sign-in.tsx",
      "parent": "/_auth"
    },
    "/_auth/sign-up": {
      "filePath": "~_auth/~sign-up.tsx",
      "parent": "/_auth"
    },
    "/_app/_settings/settings/general": {
      "filePath": "~_app/~_settings/~settings.general.tsx",
      "parent": "/_app/_settings"
    }
  }
}
ROUTE_MANIFEST_END */
