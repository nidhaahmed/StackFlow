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

interface Props {
  open: boolean;
  onClose: () => void;
  projectId: string;
  onCreated: () => void;
}

export default function CreateMilestoneModal({
  open,
  onClose,
  projectId,
  onCreated,
}: Props) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [assignedEmail, setAssignedEmail] = useState("");

  const createMilestone = async () => {
    if (!title.trim()) return;
    setLoading(true);

    try {
      await API.post(`/milestones/create/${projectId}`, {
        title,
        assignedToEmail: assignedEmail,
      });

      await onCreated();
      onClose();
      setTitle("");
    } catch (err) {
      console.error("Create milestone failed:", err);
      alert("Failed to create milestone: " + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Milestone</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Milestone title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            placeholder="Tech lead email"
            value={assignedEmail}
            onChange={(e) => setAssignedEmail(e.target.value)}
          />

          <Button type="button" onClick={createMilestone} disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
