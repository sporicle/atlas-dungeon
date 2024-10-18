import { UiLayout } from '@/components/ui/ui-layout'
import { lazy } from 'react'
import { Navigate, RouteObject, useRoutes } from 'react-router-dom'

const DashboardFeature = lazy(() => import('../components/dashboard/dashboard-feature'))

const routes: RouteObject[] = [
  { path: '/dashboard', element: <DashboardFeature /> },
]

export function AppRoutes() {
  const router = useRoutes([
    { index: true, element: <Navigate to={'/dashboard'} replace={true} /> },
    ...routes,
    { path: '*', element: <Navigate to={'/dashboard'} replace={true} /> },
  ])
  return <UiLayout>{router}</UiLayout>
}
