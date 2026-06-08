import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Heart } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import FloatingHearts from "@/components/FloatingHearts";
import { Button } from "@/components/ui/button";
import { getNote } from "@/lib/notes";

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
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center">
        <FloatingHearts />
        <button
          onClick={() => navigate("/")}
          className="fixed left-4 top-4 z-30 flex items-center gap-1 rounded-full border border-white/60 bg-card/85 px-4 py-2 text-sm text-muted-foreground shadow-soft backdrop-blur-sm transition-colors hover:text-foreground sm:left-6 sm:top-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back home
        </button>
        <motion.div
          className="relative z-10 w-full max-w-md rounded-[2rem] border border-white/60 bg-card/90 p-8 shadow-card backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Heart className="h-8 w-8 text-primary" fill="currentColor" />
          </motion.div>
          <h1 className="mt-5 font-display text-3xl font-bold">Opening your note...</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Give us a second while we bring something lovely onto the page.
          </p>
        </motion.div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center">
        <FloatingHearts />
        <button
          onClick={() => navigate("/")}
          className="fixed left-4 top-4 z-30 flex items-center gap-1 rounded-full border border-white/60 bg-card/85 px-4 py-2 text-sm text-muted-foreground shadow-soft backdrop-blur-sm transition-colors hover:text-foreground sm:left-6 sm:top-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back home
        </button>
        <motion.div
          className="relative z-10 w-full max-w-md rounded-[2rem] border border-white/60 bg-card/90 p-8 shadow-card backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Heart className="h-8 w-8 text-primary" fill="currentColor" />
          </div>
          <h1 className="mt-5 font-display text-3xl font-bold">Note not found</h1>
          <p className="mt-2 text-muted-foreground">
            This note may have been removed, or the link may not be quite right.
          </p>
          <Button variant="hero" className="mt-6" onClick={() => navigate("/")}>
            Go Home
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <FloatingHearts />
      <button
        onClick={() => navigate("/")}
        className="fixed left-4 top-4 z-30 flex items-center gap-1 rounded-full border border-white/60 bg-card/85 px-4 py-2 text-sm text-muted-foreground shadow-soft backdrop-blur-sm transition-colors hover:text-foreground sm:left-6 sm:top-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back home
      </button>
      <motion.div
        className="relative z-10 w-full max-w-3xl"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className="relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-card/95 p-8 shadow-card backdrop-blur-sm sm:p-12"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.45 }}
        >
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />

          <div className="relative text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Heart className="h-8 w-8 text-primary" fill="currentColor" />
            </div>

            <p className="mt-6 font-display text-3xl font-bold text-foreground sm:text-4xl">
              Dear {note.to},
            </p>

            <div className="mt-8 rounded-[2rem] bg-background/75 px-6 py-8 text-left sm:px-10 sm:py-10">
              <p className="whitespace-pre-wrap font-display text-xl leading-9 text-card-foreground sm:text-2xl sm:leading-10">
                {note.message}
              </p>
            </div>

            <div className="mt-8">
              <p className="text-sm text-muted-foreground">With love,</p>
              <p className="mt-2 font-display text-2xl font-semibold text-foreground">{note.from}</p>
            </div>

            <div className="mt-8 flex justify-center">
              <Button variant="hero" onClick={() => navigate("/compose")} className="gap-2">
                <Heart className="h-4 w-4" /> Write your own note
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ViewNote;
