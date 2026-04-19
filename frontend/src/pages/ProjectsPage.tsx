import { useEffect, useState } from "react";
import { getProjects } from "../api/project.api";
import { ProjectCard } from "../components/ProjectCard";
import { Loader } from "../components/Loader";

export const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Using a mock hardcoded workspace ID for simplicity in the minimal UI
  const workspaceId = localStorage.getItem("defaultWorkspaceId") || "w1";

  useEffect(() => {
    getProjects(workspaceId)
      .then((res) => {
        setProjects(res.data);
      })
      .catch((err) => {
        setError("Failed to load projects or no workspace exists");
      })
      .finally(() => setLoading(false));
  }, [workspaceId]);

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Projects</h1>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <div className="text-red-500 bg-red-50 p-4 rounded-md">{error}</div>
      ) : projects.length === 0 ? (
        <div className="text-gray-500 bg-gray-50 p-8 text-center rounded-lg border border-gray-200">
          No projects found in this workspace. Create one via API.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project: any) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};
