import { motion } from "framer-motion";
import { Heart, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import FloatingHearts from "@/components/FloatingHearts";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
      <FloatingHearts />
      <motion.div
        className="relative z-10 flex max-w-xl flex-col items-center text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <motion.div
          className="mb-6 flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Heart className="h-4 w-4 text-primary" fill="currentColor" />
          <span className="text-sm font-medium text-primary">DearU</span>
        </motion.div>

        <h1 className="font-display text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
          Write it. Link it.{" "}
          <span className="text-gradient">Make them blush.</span>
        </h1>

        <p className="mt-5 max-w-md text-lg text-muted-foreground">
          Turn your feelings into a note and share it with a link made just for them.
        </p>

        <motion.div
          className="mt-8 flex gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button variant="hero" size="lg" onClick={() => navigate("/compose")} className="gap-2">
            <Send className="h-4 w-4" />
            Write a Note
          </Button>
        </motion.div>

        <p className="mt-12 text-xs text-muted-foreground/60">
          No sign-up needed · Free forever · Made with love
        </p>
      </motion.div>
    </div>
  );
};

export default Index;
