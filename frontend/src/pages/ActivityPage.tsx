import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getActivityFeed } from "../api/activity.api";
import { Loader } from "../components/Loader";
import { Clock } from "lucide-react";

export const ActivityPage = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!projectId) {
      setError("Project ID is required in URL");
      setLoading(false);
      return;
    }

    getActivityFeed(projectId)
      .then((res) => {
        setActivities(res.data.data || []);
      })
      .catch((err) => {
        setError("Failed to load activity feed");
      })
      .finally(() => setLoading(false));
  }, [projectId]);

  return (
    <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Activity Feed</h1>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <div className="text-red-500 bg-red-50 p-4 rounded-md">{error}</div>
      ) : activities.length === 0 ? (
        <div className="text-gray-500 bg-gray-50 p-8 text-center rounded-lg border border-gray-200">
          No activity found.
        </div>
      ) : (
        <div className="flow-root">
          <ul className="-mb-8">
            {activities.map((activity: any, idx) => (
              <li key={activity.id}>
                <div className="relative pb-8">
                  {idx !== activities.length - 1 ? (
                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center ring-8 ring-white">
                        <Clock className="h-4 w-4 text-indigo-500" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium text-gray-900">{activity.user.name}</span> performed{" "}
                          <span className="font-semibold text-gray-700">{activity.action}</span> on{" "}
                          {activity.entityType}
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
