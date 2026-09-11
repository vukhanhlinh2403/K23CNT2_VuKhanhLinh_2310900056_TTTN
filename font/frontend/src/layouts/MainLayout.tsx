import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({
  children,
}: MainLayoutProps) => {
  const { user, logoutUser } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between">

            <Link
              to="/"
              className="text-xl font-bold text-blue-600"
            >
              Admission AI
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600"
              >
                Trang chủ
              </Link>

              <Link
                to="/admission"
                className="text-gray-700 hover:text-blue-600"
              >
                Tuyển sinh
              </Link>

              <Link
                to="/majors"
                className="text-gray-700 hover:text-blue-600"
              >
                Ngành học
              </Link>

              <Link
                to="/chatbot"
                className="text-gray-700 hover:text-blue-600"
              >
                Chatbot AI
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <span className="text-sm text-gray-600">
                    {user.name}
                  </span>

                  <button
                    onClick={logoutUser}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-blue-600"
                  >
                    Đăng nhập
                  </Link>

                  <Link
                    to="/register"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>

          </div>
        </div>
      </header>

      <main>
        {children}
      </main>

      <footer className="bg-slate-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-center">
            © 2026 Admission AI
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;