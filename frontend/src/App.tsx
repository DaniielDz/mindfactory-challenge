import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Feed } from './pages/Feed';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AuthProvider } from './context/AuthProvider';
import { PostDetail } from './pages/PostDetail';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-center" richColors />
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Feed />} />
            <Route path="/post/:id" element={<PostDetail />} />
          </Route>

          {/* Rutas Privadas con Layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route
                path="/profile/:id"
                element={<div>Perfil (Próximamente)</div>}
              />
            </Route>
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
