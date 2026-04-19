export const StatusDropdown = ({ currentStatus, taskId, onChange }: any) => {
  const statuses = ["TODO", "IN_PROGRESS", "IN_REVIEW", "COMPLETED"];

  return (
    <select
      value={currentStatus}
      onChange={(e) => onChange(taskId, e.target.value)}
      className="text-xs border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-1 pl-2 pr-8"
    >
      {statuses.map(status => (
        <option key={status} value={status}>{status.replace("_", " ")}</option>
      ))}
    </select>
  );
};
