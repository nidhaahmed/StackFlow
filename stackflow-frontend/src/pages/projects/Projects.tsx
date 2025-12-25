import { useEffect, useState } from "react";
import API from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CreateProjectModal from "./components/CreateProjectModal";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

interface Project {
  _id: string;
  name: string;
  description: string;
  progress: number;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [open, setOpen] = useState(false);

  const location = useLocation();
  const isProjectsPage = location.pathname === "/projects";

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/projects");
        setProjects(res.data.projects);
      } catch (err) {
        console.error("Failed to fetch projects: ", err);
      }
    };

    load();
  }, []);

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button type="button" onClick={() => setOpen(true)}>
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {projects.map((p) => (
          <Link key={p._id} to={`/projects/${p._id}`}>
            <Card className="cursor-pointer hover:shadow-lg transition">
              <CardContent className="p-4 space-y-2">
                <h2 className="text-xl font-semibold">{p.name}</h2>
                <p className="text-gray-600">{p.description}</p>
                <p className="text-sm text-gray-500">Progress: {p.progress}%</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {isProjectsPage && (
        <CreateProjectModal
          open={open}
          onClose={() => setOpen(false)}
          onCreated={async () => {
            const res = await API.get("/projects");
            setProjects(res.data.projects);
          }}
        />
      )}
    </div>
  );
}
