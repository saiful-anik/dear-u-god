import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  Heart,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import FloatingHearts from "@/components/FloatingHearts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getShareUrl, saveNote } from "@/lib/notes";

const Compose = () => {
  const navigate = useNavigate();
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [message, setMessage] = useState("");
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!to.trim() || !message.trim()) {
      toast.error("Please fill in the recipient and your message.");
      return;
    }

    try {
      setIsSaving(true);
      const id = await saveNote({
        to: to.trim(),
        from: from.trim() || "Someone who cares",
        message: message.trim(),
      });
      setShareUrl(getShareUrl(id));
      toast.success("Your note is ready to share.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not create note. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWriteAnother = () => {
    setTo("");
    setFrom("");
    setMessage("");
    setShareUrl(null);
    setCopied(false);
    setIsSaving(false);
    navigate("/compose");
  };

  if (shareUrl) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center px-4">
        <FloatingHearts />
        <motion.div
          className="relative z-10 flex w-full max-w-md flex-col items-center overflow-hidden rounded-[2rem] border border-white/60 bg-card/95 p-8 shadow-card backdrop-blur"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Heart className="h-7 w-7 text-primary" fill="currentColor" />
          </div>
          <h2 className="font-display text-2xl font-bold">Note Created!</h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Share this link with <strong>{to}</strong> to make their day shine.
          </p>

          <div className="mt-6 flex w-full items-center gap-2 rounded-2xl border border-primary/10 bg-muted/50 p-3">
            <span className="flex-1 truncate text-sm text-foreground">
              {shareUrl}
            </span>
            <Button size="icon" variant="ghost" onClick={handleCopy}>
              {copied ? (
                <Check className="h-4 w-4 text-primary" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="mt-6 flex w-full gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleWriteAnother}
            >
              Write Another
            </Button>
            <Button
              variant="hero"
              className="flex-1 gap-2"
              onClick={() => window.open(shareUrl, "_blank")}
            >
              <ExternalLink className="h-4 w-4" /> Preview
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4">
      <FloatingHearts />

      <button
        onClick={() => navigate("/")}
        className="fixed left-4 top-4 z-30 flex items-center gap-1 rounded-full border border-white/60 bg-card/85 px-4 py-2 text-sm text-muted-foreground shadow-soft backdrop-blur-sm transition-colors hover:text-foreground sm:left-6 sm:top-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <AnimatePresence>
        {isSaving && (
          <motion.div
            className="fixed inset-0 z-20 flex items-center justify-center bg-background/70 px-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-sm overflow-hidden rounded-[2rem] border border-white/60 bg-card/95 p-8 text-center shadow-card"
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.25 }}
            >
              <motion.div
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
                animate={{ scale: [1, 1.08, 1], rotate: [0, -6, 6, 0] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Heart className="h-8 w-8 text-primary" fill="currentColor" />
              </motion.div>

              <div className="mt-5 space-y-2">
                <p className="font-display text-2xl font-semibold">
                  Wrapping it with care
                </p>
                <p className="text-sm leading-6 text-muted-foreground">
                  We are turning your words into a lovely little link for{" "}
                  <strong>{to || "someone special"}</strong>.
                </p>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-primary">
                <Sparkles className="h-4 w-4" />
                <span>Sending some gentle love through the wires...</span>
              </div>

              <div className="mt-6 flex justify-center gap-2">
                {[0, 1, 2].map((dot) => (
                  <motion.span
                    key={dot}
                    className="h-2.5 w-2.5 rounded-full bg-primary/70"
                    animate={{ y: [0, -8, 0], opacity: [0.45, 1, 0.45] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: dot * 0.15,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-display text-3xl font-bold">
          Write your <span className="text-gradient">note</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Write from the heart. We will turn it into a beautiful little moment
          to share.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5 rounded-[2rem] border border-white/60 bg-card/80 p-6 shadow-card backdrop-blur-sm"
        >
          <div className="rounded-2xl bg-primary/5 p-4 text-left">
            <p className="font-display text-lg font-semibold text-foreground">
              A tiny note can mean a lot.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Give them something sweet to open when they need it most.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">To</label>
            <Input
              placeholder="Their name"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="bg-card"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">From</label>
            <Input
              placeholder="Your name (optional, but it adds a nice touch!)"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="bg-card"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Your message
            </label>
            <Textarea
              placeholder="Dear you..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="resize-none bg-card"
            />
          </div>

          <Button
            type="submit"
            variant="hero"
            size="lg"
            className="w-full gap-2"
            disabled={isSaving}
          >
            <Heart className="h-4 w-4" />
            {isSaving ? "Creating your lovely link..." : "Generate Link"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default Compose;
