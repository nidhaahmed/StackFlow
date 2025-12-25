import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CreateMilestoneModal from "./components/CreateMilestoneModal";
import { useNavigate } from "react-router-dom";

interface Milestone {
  _id: string;
  title: string;
  progress: number;
}

export default function Milestones() {
  const { projectId } = useParams<{ projectId: string }>();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Safe refetch function (not used directly inside useEffect)
  const refetchMilestones = async () => {
    if (!projectId) return;
    try {
      const res = await API.get(`/milestones/${projectId}`);
      setMilestones(res.data.milestones);
    } catch (err) {
      console.error("Failed to fetch milestones: ", err);
    }
  };

  // Effect owns the side-effect
  useEffect(() => {
    refetchMilestones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Milestones</h1>
        <Button type="button" onClick={() => setOpen(true)}>
          New Milestone
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {milestones.map((m) => (
          <Card
            key={m._id}
            onClick={() => navigate(`/tasks/${m._id}`)}
            className={`cursor-pointer hover:scale-[1.02] transition-all 
  ${m.progress === 100 ? "bg-green-300" : "bg-white"} `}
          >
            <CardContent className="p-4 space-y-2">
              <h2 className="text-lg font-semibold">{m.title}</h2>
              <p className="text-sm text-gray-500">Progress: {m.progress}%</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {projectId && (
        <CreateMilestoneModal
          open={open}
          onClose={() => setOpen(false)}
          projectId={projectId}
          onCreated={refetchMilestones}
        />
      )}
    </div>
  );
}
