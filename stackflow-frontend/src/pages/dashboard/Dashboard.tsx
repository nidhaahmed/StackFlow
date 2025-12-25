import { useEffect, useState } from "react";
import API from "@/utils/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";

interface Member {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "techlead" | "teammate";
}

interface OrgResponse {
  _id: string;
  name: string;
  inviteCode?: string;
  members: Member[];
}

export default function Dashboard() {
  const [org, setOrg] = useState<OrgResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // remove dialog
  const [removeUserId, setRemoveUserId] = useState<string | null>(null);
  const [removeUserEmail, setRemoveUserEmail] = useState<string>("");

  // UI dropdown open states
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const [inviteInput, setInviteInput] = useState("");

  const fetchOrg = async () => {
    try {
      const res = await API.get("/org/me");
      setOrg(res.data.org);
    } catch {
      setOrg(null);
    } finally {
      setLoading(false);
    }
  };

  const joinOrg = async () => {
    if (!inviteInput.trim()) return alert("Enter invite code first");

    try {
      const res = await API.post("/org/join", {
        inviteCode: inviteInput.trim(),
      });

      // store session same as login/register
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // force axios to use new token
      API.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${res.data.accessToken}`;

      window.location.reload(); // now /org/me will load without 403
    } catch (err) {
      alert("Join failed: invalid invite code: " + err);
    }
  };

  useEffect(() => {
    fetchOrg();
  }, []);

  const leaveOrg = async () => {
    await API.post("/org/leave");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    window.location.reload();
  };

  const copyInvite = () => {
    if (!org?.inviteCode) return;
    navigator.clipboard.writeText(org.inviteCode);
    alert("Invite code copied!");
  };

  const triggerRemove = (id: string, email: string) => {
    setRemoveUserId(id);
    setRemoveUserEmail(email);
  };

  const removeUser = async () => {
    if (!removeUserId) return;

    await API.post("/org/remove-user", { userId: removeUserId });
    setRemoveUserId(null);
    setRemoveUserEmail("");
    fetchOrg();
  };

  if (loading) return <p>Loading...</p>;

  if (!org)
    return (
      <div className="p-10 max-w-md mx-auto space-y-5 bg-white shadow rounded text-center mt-10">
        <h2 className="text-2xl font-bold">Join an Organization</h2>

        <input
          type="text"
          placeholder="Enter Invite Code"
          onChange={(e) => setInviteInput(e.target.value)}
          className="border p-2 w-full rounded"
        />

        <Button onClick={joinOrg} className="w-full">
          Join Organization
        </Button>

        <p className="text-gray-500 text-sm">
          Ask your admin/techlead for the invite code to join.
        </p>
      </div>
    );

  const techleads = org.members.filter((m) => m.role === "techlead");
  const teammates = org.members.filter((m) => m.role === "teammate");

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button variant="destructive" onClick={leaveOrg}>
          Leave Org
        </Button>
      </div>

      {/* ORG HEADER */}
      <Card>
        <CardContent className="p-4">
          <p className="text-xl font-semibold">{org.name}</p>
          {org.inviteCode && (
            <Button className="mt-3" onClick={copyInvite}>
              Copy Invite Code
            </Button>
          )}
        </CardContent>
      </Card>

      {/* MEMBER LIST SECTIONS */}
      <div className="grid grid-cols-2 gap-6">
        {/* TECHLEADS */}
        <Card>
          <CardContent className="p-4 space-y-2">
            <h2 className="text-lg font-semibold mb-2">Tech Leads</h2>

            {techleads.map((u) => (
              <div
                key={u._id}
                className="flex justify-between items-center bg-gray-50 p-2 rounded"
              >
                <div>
                  <p className="font-medium">{u.name}</p>
                  <p className="text-sm text-gray-600">{u.email}</p>
                </div>

                <div className="relative">
                  <MoreVertical
                    className="cursor-pointer"
                    onClick={() =>
                      setOpenMenu(openMenu === u._id ? null : u._id)
                    }
                  />
                  {openMenu === u._id && (
                    <div className="absolute right-0 top-6 bg-white shadow rounded p-2 z-10">
                      <button
                        onClick={() => triggerRemove(u._id, u.email)}
                        className="text-red-600 text-sm"
                      >
                        Remove from Org
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* TEAMMATES */}
        <Card>
          <CardContent className="p-4 space-y-2">
            <h2 className="text-lg font-semibold mb-2">Teammates</h2>

            {teammates.map((u) => (
              <div
                key={u._id}
                className="flex justify-between items-center bg-gray-50 p-2 rounded"
              >
                <div>
                  <p className="font-medium">{u.name}</p>
                  <p className="text-sm text-gray-600">{u.email}</p>
                </div>

                <div className="relative">
                  <MoreVertical
                    className="cursor-pointer"
                    onClick={() =>
                      setOpenMenu(openMenu === u._id ? null : u._id)
                    }
                  />
                  {openMenu === u._id && (
                    <div className="absolute right-0 top-6 bg-white shadow rounded p-2 z-10">
                      <button
                        onClick={() => triggerRemove(u._id, u.email)}
                        className="text-red-600 text-sm"
                      >
                        Remove from Org
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* CONFIRM REMOVE MODAL */}
      {removeUserId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-[350px] space-y-4">
            <p className="text-lg font-semibold">Remove {removeUserEmail}?</p>
            <p className="text-gray-600 text-sm">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <Button onClick={() => setRemoveUserId(null)} variant="secondary">
                Cancel
              </Button>
              <Button onClick={removeUser} variant="destructive">
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
