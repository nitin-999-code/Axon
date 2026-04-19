import { Link } from "react-router-dom";
import { Folder } from "lucide-react";

export const ProjectCard = ({ project }: { project: any }) => (
  <Link
    to={`/projects/${project.id}`}
    className="block transition transform hover:-translate-y-1 hover:shadow-lg bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200"
  >
    <div className="p-6">
      <div className="flex items-center mb-4">
        <Folder className="h-8 w-8 text-indigo-500 mr-3" />
        <h3 className="text-lg font-semibold text-gray-900 truncate">{project.name}</h3>
      </div>
      <p className="text-sm text-gray-500 line-clamp-2">{project.description || "No description provided."}</p>
      <div className="mt-4 flex justify-between items-center text-xs text-gray-400">
        <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  </Link>
);
