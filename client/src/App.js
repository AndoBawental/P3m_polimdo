import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

import ProtectedRoute from './components/Auth/ProtectedRoute';
import Layout from './components/Layout/Layout';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Profile
import Profile from './pages/Users/Profile';

// Dashboards
import RoleBasedDashboard from './pages/Dashboard/RoleBasedDashboard';

import Settings from './pages/Settings';
import Help from './pages/Help';

// Proposal Pages
import ProposalsPage from './pages/Proposals';
import CreateProposalPage from './pages/Proposals/Create';
import ProposalDetailPage from './pages/Proposals/Detail';
import EditProposalPage from './pages/Proposals/Edit';

// Reviews and Users
import Reviews from './pages/Reviews';
import Users from './pages/Users';

// Skema Pages
import SkemaIndex from './pages/Skema';
import SkemaDetail from './pages/Skema/Detail';
import SkemaCreate from './pages/Skema/Create';
import SkemaEdit from './pages/Skema/Edit';

// Jurusan Pages
import JurusanIndex from './pages/Jurusan';
import JurusanDetail from './pages/Jurusan/Detail';
import JurusanCreate from './pages/Jurusan/Create';
import JurusanEdit from './pages/Jurusan/Edit';

// Prodi Pages
import ProdiIndex from './pages/Prodi';
import ProdiDetail from './pages/Prodi/Detail';
import ProdiCreate from './pages/Prodi/Create';
import ProdiEdit from './pages/Prodi/Edit';

// Styles
import './styles/tailwind.css';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            {/* ✅ Public Routes - Harus didefinisikan PERTAMA dan TERPISAH */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
             <Route path="/settings" element={<Settings />} />
                <Route path="/help" element={<Help />} />
            
            {/* ✅ Protected Routes with Layout - Gunakan path="/*" bukan path="/" */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              {/* Redirect root to dashboard */}
              <Route path="" element={<Navigate to="/dashboard" replace />} />
              
              {/* Dashboard */}
              <Route path="dashboard" element={<RoleBasedDashboard />} />

              {/* Profile */}
              <Route path="profile" element={<Profile />} />

              {/* Mahasiswa Routes */}
              <Route path="mahasiswa">
                <Route
                  path="dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['MAHASISWA']}>
                      <RoleBasedDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="proposals"
                  element={
                    <ProtectedRoute allowedRoles={['MAHASISWA']}>
                      <ProposalsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="proposals/create"
                  element={
                    <ProtectedRoute allowedRoles={['MAHASISWA']}>
                      <CreateProposalPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="skema"
                  element={
                    <ProtectedRoute allowedRoles={['MAHASISWA']}>
                      <SkemaIndex />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* Dosen Routes */}
              <Route path="dosen">
                <Route
                  path="dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['DOSEN']}>
                      <RoleBasedDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="proposals"
                  element={
                    <ProtectedRoute allowedRoles={['DOSEN']}>
                      <ProposalsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="proposals/create"
                  element={
                    <ProtectedRoute allowedRoles={['DOSEN']}>
                      <CreateProposalPage />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* Admin Routes */}
              <Route path="admin">
                <Route
                  path="dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <RoleBasedDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="users/*"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <Users />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="skema"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <SkemaIndex />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="jurusan"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <JurusanIndex />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="prodi"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <ProdiIndex />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* General Skema Routes */}
              <Route
                path="skema/create"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'MAHASISWA']}>
                    <SkemaCreate />
                  </ProtectedRoute>
                }
              />
              <Route
                path="skema/:id"
                element={
                  <ProtectedRoute>
                    <SkemaDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="skema/:id/edit"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'MAHASISWA']}>
                    <SkemaEdit />
                  </ProtectedRoute>
                }
              />

              {/* General Proposals Routes */}
              <Route
                path="proposals"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'DOSEN', 'MAHASISWA']}>
                    <ProposalsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="proposals/create"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'DOSEN', 'MAHASISWA']}>
                    <CreateProposalPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="proposals/:id"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'DOSEN', 'MAHASISWA', 'REVIEWER']}>
                    <ProposalDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="proposals/:id/edit"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'DOSEN', 'MAHASISWA']}>
                    <EditProposalPage />
                  </ProtectedRoute>
                }
              />

              {/* Reviews */}
              <Route
                path="reviews/*"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'REVIEWER', 'DOSEN', 'MAHASISWA']}>
                    <Reviews />
                  </ProtectedRoute>
                }
              />

              {/* Jurusan Routes */}
              <Route
                path="jurusan"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <JurusanIndex />
                  </ProtectedRoute>
                }
              />
              <Route
                path="jurusan/create"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <JurusanCreate />
                  </ProtectedRoute>
                }
              />
              <Route
                path="jurusan/:id"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <JurusanDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="jurusan/:id/edit"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <JurusanEdit />
                  </ProtectedRoute>
                }
              />

              {/* Prodi Routes */}
              <Route
                path="prodi"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <ProdiIndex />
                  </ProtectedRoute>
                }
              />
              <Route
                path="prodi/create"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <ProdiCreate />
                  </ProtectedRoute>
                }
              />
              <Route
                path="prodi/:id"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <ProdiDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="prodi/:id/edit"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <ProdiEdit />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* 404 - Harus di akhir */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;