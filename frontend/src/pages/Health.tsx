import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { checkDatabaseHealth, checkHealth } from "@/lib/notes";
import { toast } from "sonner";

type CheckStatus = "idle" | "success" | "error";

const Health = () => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(false);
  const [apiStatus, setApiStatus] = useState<CheckStatus>("idle");
  const [dbStatus, setDbStatus] = useState<CheckStatus>("idle");

  const handleCheck = async () => {
    let apiCheckPassed = false;

    try {
      setIsChecking(true);
      setApiStatus("idle");
      setDbStatus("idle");

      await checkHealth();
      apiCheckPassed = true;
      setApiStatus("success");

      await checkDatabaseHealth();
      setDbStatus("success");

      toast.success("API and database health checks passed.");
    } catch (error) {
      if (apiCheckPassed) {
        setDbStatus("error");
      } else {
        setApiStatus("error");
      }

      toast.error(error instanceof Error ? error.message : "Health check failed.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-card p-8 shadow-card">
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <h1 className="font-display text-3xl font-bold">Health Check</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Use this page to verify the Worker API at <code>/health</code> and the database check at <code>/health/db</code>.
        </p>

        <Button className="mt-6 w-full gap-2" variant="hero" onClick={handleCheck} disabled={isChecking}>
          <Activity className="h-4 w-4" />
          {isChecking ? "Checking..." : "Test API Health"}
        </Button>

        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          <p>API status: {apiStatus === "idle" ? "not checked" : apiStatus}</p>
          <p>DB status: {dbStatus === "idle" ? "not checked" : dbStatus}</p>
        </div>
      </div>
    </div>
  );
};

export default Health;
