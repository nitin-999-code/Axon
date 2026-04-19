import { useState } from "react";
import { requestApproval } from "../api/approval.api";
import { CheckCircle } from "lucide-react";

export const ApprovalButton = ({ taskId, onApprove }: any) => {
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState(false);

  const handleRequest = async () => {
    setLoading(true);
    try {
      await requestApproval(taskId);
      setRequested(true);
    } catch (e) {
      console.error(e);
      alert("Failed to request approval");
    } finally {
      setLoading(false);
    }
  };

  if (requested) {
    return <span className="text-xs text-yellow-600 flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Pending</span>;
  }

  return (
    <button
      onClick={handleRequest}
      disabled={loading}
      className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700 disabled:opacity-50"
    >
      {loading ? "Requesting..." : "Req Approval"}
    </button>
  );
};
