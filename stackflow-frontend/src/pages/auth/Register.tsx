import { useState } from "react";
import API from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"admin" | "techlead" | "teammate">(
    "teammate"
  );
  const [error, setError] = useState("");
  const [orgName, setOrgName] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (role === "admin" && !orgName.trim()) {
      setError("Organization name is required for admin");
      return;
    }

    if (role !== "admin" && !inviteCode.trim()) {
      setError("Invite code is required to join an organization");
      return;
    }

    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
        role,
        // send for future backend upgrade
        orgName: role === "admin" ? orgName.trim().toLowerCase() : undefined,
        inviteCode: role !== "admin" ? inviteCode.trim() : undefined,
      });

      navigate("/");
    } catch (err) {
      setError("Registration failed: " + err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-96">
        <CardContent className="space-y-4">
          <h1 className="text-2xl font-bold">Register</h1>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <form onSubmit={submit} className="space-y-3">
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {/* ROLE SELECTION */}
            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value as "admin" | "techlead" | "teammate")
              }
              className="w-full border rounded-md px-3 py-2 text-sm"
            >
              <option value="admin">Admin</option>
              <option value="techlead">Tech Lead</option>
              <option value="teammate">Teammate</option>
            </select>

            {role === "admin" && (
              <Input
                placeholder="Organization Name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
              />
            )}

            {role !== "admin" && (
              <Input
                placeholder="Invite Code"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
              />
            )}

            <Button className="w-full">Register</Button>
            <p className="text-sm text-center">
              Already have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Sign in
              </span>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
