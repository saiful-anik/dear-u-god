import { useParams, useNavigate } from "react-router-dom";
import { getNote } from "@/lib/notes";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import FloatingHearts from "@/components/FloatingHearts";
import { useEffect, useState } from "react";

const ViewNote = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [note, setNote] = useState<Awaited<ReturnType<typeof getNote>>>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadNote = async () => {
      if (!id) {
        if (isMounted) {
          setNote(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        const fetchedNote = await getNote(id);
        if (isMounted) {
          setNote(fetchedNote);
        }
      } catch {
        if (isMounted) {
          setNote(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadNote();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <h1 className="font-display text-3xl font-bold">Loading note...</h1>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <h1 className="font-display text-3xl font-bold">Note not found</h1>
        <p className="mt-2 text-muted-foreground">This note may have been removed or the link is incorrect.</p>
        <Button variant="hero" className="mt-6" onClick={() => navigate("/")}>
          Go Home
        </Button>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4">
      <FloatingHearts />
      <motion.div
        className="relative z-10 flex w-full max-w-lg flex-col items-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className="mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Heart className="h-8 w-8 text-primary" fill="currentColor" />
          </div>
        </motion.div>

        <motion.p
          className="text-sm font-medium text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          A note for you, <strong className="text-foreground">{note.to}</strong>
        </motion.p>

        <motion.div
          className="mt-6 w-full rounded-2xl bg-card p-8 shadow-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <p className="whitespace-pre-wrap font-display text-lg leading-relaxed text-card-foreground">
            {note.message}
          </p>
          <div className="mt-8 border-t pt-4">
            <p className="text-sm text-muted-foreground">
              With love, <span className="font-semibold text-foreground">{note.from}</span>
            </p>
          </div>
        </motion.div>

        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Button variant="hero" onClick={() => navigate("/compose")} className="gap-2">
            <Heart className="h-4 w-4" /> Write your own note
          </Button>
        </motion.div>

        <p className="mt-6 text-xs text-muted-foreground/50">
          Sent with DearU 💌
        </p>
      </motion.div>
    </div>
  );
};

export default ViewNote;
