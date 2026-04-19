import { useState } from "react";
import { StatusDropdown } from "./StatusDropdown";
import { ApprovalButton } from "./ApprovalButton";

export const TaskCard = ({ task, onStatusChange, onApprove }: any) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-3 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          task.priority === "HIGH" || task.priority === "URGENT" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
        }`}>
          {task.priority}
        </span>
      </div>
      <p className="text-xs text-gray-500 mb-3">{task.description}</p>
      
      <div className="flex justify-between items-center mt-4">
        <StatusDropdown currentStatus={task.currentStatus} taskId={task.id} onChange={onStatusChange} />
        {task.requiresApproval && task.currentStatus !== "COMPLETED" && (
          <ApprovalButton taskId={task.id} onApprove={() => onApprove(task.id)} />
        )}
      </div>
    </div>
  );
};
