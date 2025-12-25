import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CreateTaskModal from "./components/CreateTaskModal";
import { useNavigate } from "react-router-dom";

interface Task {
  _id: string;
  title: string;
  status: "pending" | "completed" | "verified";
}

export default function Tasks() {
  const { milestoneId } = useParams<{ milestoneId: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Get user role from localStorage
  const user = JSON.parse(localStorage.getItem("user")!);
  const role = user?.user?.role || user?.role;

  const fetchTasks = async () => {
    try {
      const res = await API.get(`/tasks/${milestoneId}`);
      setTasks(res.data.tasks);
    } catch (err) {
      console.error("Failed to load tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [milestoneId]);

  // teammate marks complete
  const completeTask = async (taskId: string) => {
    await API.post(`/tasks/complete/${taskId}`);
    fetchTasks();
  };

  // teammate undo completion
  const undoCompleteTask = async (taskId: string) => {
    await API.post(`/tasks/undo-complete/${taskId}`);
    fetchTasks();
  };

  // techlead verifies
  const verifyTask = async (taskId: string) => {
    await API.post(`/tasks/verify/${taskId}`);
    fetchTasks();
  };

  // techlead unverify
  const unverifyTask = async (taskId: string) => {
    await API.post(`/tasks/unverify/${taskId}`);
    fetchTasks();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <Button onClick={() => setOpen(true)}>Add Task</Button>
      </div>

      <div className="space-y-4">
        {tasks.length === 0 && (
          <p className="text-gray-500">No tasks yet. Create one.</p>
        )}

        {tasks.map((t) => (
          <Card
            key={t._id}
            className="shadow cursor-pointer hover:scale-[1.01] transition-all"
            onClick={() => navigate(`/tasks/details/${t._id}`)}
          >
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-semibold">{t.title}</p>
                <p className="text-sm text-gray-500 capitalize">{t.status}</p>
              </div>

              <div className="flex gap-2">
                {/* Teammate Actions */}
                {role === "teammate" && t.status === "pending" && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      completeTask(t._id);
                    }}
                  >
                    Mark Complete
                  </Button>
                )}

                {role === "teammate" && t.status === "completed" && (
                  <Button
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      undoCompleteTask(t._id);
                    }}
                  >
                    Undo Completion
                  </Button>
                )}

                {/* Techlead/Admin Actions */}
                {role !== "teammate" && t.status === "completed" && (
                  <Button
                    className="bg-green-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      verifyTask(t._id);
                    }}
                  >
                    Verify
                  </Button>
                )}

                {role !== "teammate" && t.status === "verified" && (
                  <Button
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      unverifyTask(t._id);
                    }}
                  >
                    Unverify
                  </Button>
                )}

                {t.status === "verified" && (
                  <p className="text-green-600 font-semibold text-sm">
                    Verified
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CreateTaskModal
        open={open}
        onClose={() => setOpen(false)}
        milestoneId={milestoneId!}
        onAdded={fetchTasks}
      />
    </div>
  );
}
