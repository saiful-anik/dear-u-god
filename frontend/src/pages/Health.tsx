import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { checkNotesConnection } from "@/lib/notes";
import { toast } from "sonner";

const Health = () => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(false);
  const [lastStatus, setLastStatus] = useState<"success" | "error" | null>(null);

  const handleCheck = async () => {
    try {
      setIsChecking(true);
      await checkNotesConnection();
      setLastStatus("success");
      toast.success("Supabase connection is healthy.");
    } catch (error) {
      setLastStatus("error");
      toast.error(error instanceof Error ? error.message : "Supabase connection failed.");
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
          Use this page to verify Supabase connectivity for the notes table.
        </p>

        <Button className="mt-6 w-full gap-2" variant="hero" onClick={handleCheck} disabled={isChecking}>
          <Activity className="h-4 w-4" />
          {isChecking ? "Checking..." : "Test Supabase Connection"}
        </Button>

        {lastStatus && (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Last check: {lastStatus === "success" ? "success" : "failed"}
          </p>
        )}
      </div>
    </div>
  );
};

export default Health;
