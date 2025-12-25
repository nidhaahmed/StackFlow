import { useEffect, useState } from "react";
import API from "@/utils/api";

interface Organization {
  _id: string;
  name: string;
  inviteCode?: string;
}

export default function Dashboard() {
  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrg = async () => {
      try {
        const res = await API.get("/org/me");
        setOrg(res.data.org);
      } catch (err) {
        setError("You are not part of any organization yet: " + err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrg();
  }, []);

  if (loading) {
    return <p className="text-gray-600">Loading dashboard...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* ORGANIZATION CARD */}
      {org ? (
        <div className="p-6 mb-6 bg-white shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-1">Organization</h2>
          <p className="text-gray-700">{org.name}</p>

          {org.inviteCode && (
            <button
              className="mt-2 text-sm text-blue-600 underline"
              onClick={() =>
                navigator.clipboard.writeText(org.inviteCode as string)
              }
            >
              Copy Invite Code
            </button>
          )}
        </div>
      ) : (
        <div className="p-6 mb-6 bg-yellow-50 border border-yellow-300 rounded-lg">
          <p className="text-yellow-700">{error}</p>
        </div>
      )}

      {/* PLACEHOLDER CARDS */}
      <div className="grid grid-cols-3 gap-6">
        <div className="p-6 bg-white shadow rounded-lg">
          <h2 className="text-xl font-semibold">Projects</h2>
          <p className="text-gray-600">Coming soon...</p>
        </div>

        <div className="p-6 bg-white shadow rounded-lg">
          <h2 className="text-xl font-semibold">Milestones</h2>
          <p className="text-gray-600">Coming soon...</p>
        </div>

        <div className="p-6 bg-white shadow rounded-lg">
          <h2 className="text-xl font-semibold">Tasks</h2>
          <p className="text-gray-600">Coming soon...</p>
        </div>
      </div>
    </div>
  );
}
