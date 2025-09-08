import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App'
import AuthPage from './pages/AuthPage'
import GroupsPage from './pages/GroupsPage'
import GroupDashboard from './pages/GroupDashboard'
import PayRequestPage from './pages/PayRequestPage'
import RequireAuth from './shared/RequireAuth'
import JoinConfirmPage from './pages/JoinConfirmPage'

const router = createBrowserRouter([
  { path: '/', element: <App />, children: [
    { index: true, element: <AuthPage /> },
    { path: 'groups', element: <RequireAuth><GroupsPage /></RequireAuth> },
    { path: 'groups/:groupId/*', element: <RequireAuth><GroupDashboard /></RequireAuth> },
    { path: 'pay/:token', element: <PayRequestPage /> },
    { path: 'join/:token', element: <JoinConfirmPage /> },
  ]}
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
