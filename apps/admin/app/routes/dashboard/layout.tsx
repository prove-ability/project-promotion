import { Outlet, redirect, Link, useNavigate } from "react-router";
import type { Route } from "./+types/layout";
import { getAuth } from "~/lib/auth.server";
import { signOut } from "~/lib/auth.client";

export async function loader({ request, context }: Route.LoaderArgs) {
  const auth = getAuth(context.cloudflare.env);
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    throw redirect("/login");
  }

  return { user: session.user };
}

export default function DashboardLayout({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="text-xl font-bold text-gray-900">
            Promotion Builder
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/dashboard/billing" className="text-sm text-gray-500 hover:text-gray-700">
              요금제
            </Link>
            <span className="text-sm text-gray-600">{user.name ?? user.email}</span>
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
