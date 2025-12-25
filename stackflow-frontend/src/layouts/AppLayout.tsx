import { Outlet, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function AppLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white p-6 space-y-4">
        <h2 className="text-2xl font-bold">StackFlow</h2>

        <nav className="space-y-2">
          <Link to="/" className="block">
            Dashboard
          </Link>
          <Link to="/projects" className="block">
            Projects
          </Link>
        </nav>

        <Button variant="destructive" onClick={logout}>
          Logout
        </Button>
      </aside>

      <main className="flex-1 p-8 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
