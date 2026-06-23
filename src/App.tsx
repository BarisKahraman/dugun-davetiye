import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { WeddingPage } from "./pages/WeddingPage";

const AdminPage = lazy(() => import("./admin/AdminPage"));

export function App() {
  return (
    <Routes>
      <Route path="/" element={<WeddingPage />} />
      <Route
        path="/yonetim"
        element={
          <Suspense fallback={<main className="page-shell loading">Yönetim ekranı yükleniyor.</main>}>
            <AdminPage />
          </Suspense>
        }
      />
    </Routes>
  );
}
