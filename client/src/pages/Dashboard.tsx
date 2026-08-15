import { useAuth } from "../context/AuthContext";

export const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Welcome back, {user?.name}</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-sm text-slate-500">Problems Solved</p>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-sm text-slate-500">Submissions</p>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-sm text-slate-500">Current Streak</p>
          <p className="text-2xl font-bold">0</p>
        </div>
      </div>

      <p className="text-slate-500">
        Code Lab and DSA problems coming in the next steps.
      </p>
    </div>
  );
};