import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getTasks, moveTask } from "../api/task.api";
import { getProject } from "../api/project.api";
import { TaskCard } from "../components/TaskCard";
import { Loader } from "../components/Loader";
import { approveTask } from "../api/approval.api";

export const TaskBoardPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    if (!projectId) return;
    try {
      const pRes = await getProject(projectId);
      setProject(pRes.data);
      
      const tRes = await getTasks(projectId);
      setTasks(tRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await moveTask(taskId, newStatus);
      fetchTasks();
    } catch (e) {
      alert("Failed to transition workflow");
    }
  };

  const handleApprove = async (taskId: string) => {
    try {
      await approveTask(taskId);
      alert("Approved successfully");
      fetchTasks();
    } catch (e) {
      alert("Failed to approve. Make sure you are not the requester.");
    }
  };

  const columns = ["TODO", "IN_PROGRESS", "IN_REVIEW", "COMPLETED"];

  if (loading) return <Loader />;

  return (
    <div className="flex flex-col h-full absolute inset-0 pt-20 px-4 sm:px-6 lg:px-8 bg-gray-50 overflow-hidden">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{project?.name} - Task Board</h1>
        </div>
        <Link to={`/activity?projectId=${projectId}`} className="text-sm text-indigo-600 hover:text-indigo-800">
          View Activity Feed &rarr;
        </Link>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4 h-full">
        {columns.map((col) => (
          <div key={col} className="w-80 shrink-0 bg-gray-100 rounded-lg flex flex-col h-full border border-gray-200">
            <div className="p-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center rounded-t-lg">
              <h3 className="font-semibold text-gray-700">{col.replace("_", " ")}</h3>
              <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                {tasks.filter(t => t.currentStatus === col).length}
              </span>
            </div>
            
            <div className="p-3 flex-1 overflow-y-auto">
              {tasks.filter(t => t.currentStatus === col).map((task) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onStatusChange={handleStatusChange}
                  onApprove={handleApprove}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
