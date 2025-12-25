import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import API from "@/utils/api";

interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
  milestoneId: string;
  onAdded: () => void;
}

export default function CreateTaskModal({
  open,
  onClose,
  milestoneId,
  onAdded,
}: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [assignedEmail, setAssignedEmail] = useState("");

  const createTask = async () => {
    if (!title.trim()) return alert("Task title required");
    if (!assignedEmail.trim()) return alert("Assigned teammate email required");

    try {
      await API.post(`/tasks/create/${milestoneId}`, {
        title,
        assignedToEmail: assignedEmail, // <- FRONTEND SENDS EMAIL
      });

      onAdded();
      onClose();
      setTitle("");
      setAssignedEmail("");
    } catch (err) {
      alert("Failed to create task: " + err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            placeholder="Assign to teammate email"
            value={assignedEmail}
            onChange={(e) => setAssignedEmail(e.target.value)}
          />

          <Button className="w-full mt-3" onClick={createTask}>
            Create Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
