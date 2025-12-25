import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "@/utils/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TaskData {
  _id: string;
  title: string;
  status: string;
  assignedTo: { name: string; email: string };
  milestoneId: {
    _id: string;
    title: string;
    progress: number;
    assignedTo: { name: string; email: string };
    projectId: {
      _id: string;
      name: string;
      description: string;
      createdBy: string;
      orgId: {
        _id: string;
        name: string;
        admin: string;
      };
    };
  };
}

export default function TaskDetails() {
  const { taskId } = useParams<{ taskId: string }>();
  const [task, setTask] = useState<TaskData | null>(null);

  const raw = JSON.parse(localStorage.getItem("user")!);
  const role = raw?.role || raw?.user?.role;

  const fetchTask = async () => {
    try {
      const res = await API.get(`/tasks/details/${taskId}`);
      console.log("DETAILS RESPONSE:", res.data); // check this
      setTask(res.data.task);
    } catch (err) {
      console.error("Error loading task", err);
    }
  };

  // ACTIONS
  const complete = async () => {
    await API.post(`/tasks/complete/${taskId}`);
    fetchTask();
  };

  const verify = async () => {
    await API.post(`/tasks/verify/${taskId}`);
    fetchTask();
  };

  const unverify = async () => {
    await API.post(`/tasks/unverify/${taskId}`);
    fetchTask();
  };

  const undoComplete = async () => {
    await API.post(`/tasks/undo-complete/${taskId}`);
    fetchTask();
  };

  useEffect(() => {
    fetchTask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!task) return <p className="p-8 text-gray-500 text-xl">Loading...</p>;

  return (
    <div className="p-8 space-y-8">
      {/* ORGANIZATION */}
      <Card>
        <CardContent className="space-y-2">
          <h2 className="font-bold text-xl">Organization</h2>
          <p>ID: {task.milestoneId.projectId.orgId._id}</p>
        </CardContent>
      </Card>

      {/* PROJECT */}
      <Card>
        <CardContent className="space-y-2">
          <h2 className="font-bold text-xl">Project</h2>
          <p>{task.milestoneId.projectId.name}</p>
          <p>{task.milestoneId.projectId.description}</p>
          <p>ID: {task.milestoneId.projectId._id}</p>
        </CardContent>
      </Card>

      {/* MILESTONE */}
      <Card>
        <CardContent className="space-y-2">
          <h2 className="font-bold text-xl">Milestone</h2>
          <p>{task.milestoneId.title}</p>
          <p>Progress: {task.milestoneId.progress}%</p>
        </CardContent>
      </Card>

      {/* TASK */}
      <Card>
        <CardContent className="space-y-2">
          <h2 className="font-bold text-xl">Task</h2>
          <p>Name: {task.title}</p>
          <p>Status: {task.status}</p>
          <p>Assigned to: {task.assignedTo?.email}</p>
          <p>ID: {task._id}</p>

          {/* ACTIONS */}
          <div className="flex gap-3 pt-3">
            {role === "teammate" && task.status === "pending" && (
              <Button onClick={complete}>Mark Complete</Button>
            )}

            {role === "teammate" && task.status === "completed" && (
              <Button variant="destructive" onClick={undoComplete}>
                Undo
              </Button>
            )}

            {role !== "teammate" && task.status === "completed" && (
              <Button className="bg-green-600" onClick={verify}>
                Verify
              </Button>
            )}

            {role !== "teammate" && task.status === "verified" && (
              <Button variant="secondary" onClick={unverify}>
                Unverify
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
