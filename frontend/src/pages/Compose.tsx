import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Copy, Check, Heart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { saveNote, getShareUrl } from "@/lib/notes";
import { toast } from "sonner";
import FloatingHearts from "@/components/FloatingHearts";

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
      toast.success("Your note is ready to share! 💌");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not create note. Please try again.");
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
          className="relative z-10 flex w-full max-w-md flex-col items-center rounded-2xl bg-card p-8 shadow-card"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Heart className="h-7 w-7 text-primary" fill="currentColor" />
          </div>
          <h2 className="font-display text-2xl font-bold">Note Created!</h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Share this link with <strong>{to}</strong> to make their day ✨
          </p>

          <div className="mt-6 flex w-full items-center gap-2 rounded-lg border bg-muted/50 p-3">
            <span className="flex-1 truncate text-sm text-foreground">{shareUrl}</span>
            <Button size="icon" variant="ghost" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          <div className="mt-6 flex w-full gap-3">
            <Button variant="outline" className="flex-1" onClick={handleWriteAnother}>
              Write Another
            </Button>
            <Button variant="hero" className="flex-1 gap-2" onClick={() => window.open(shareUrl, "_blank")}> 
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
      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <h1 className="font-display text-3xl font-bold">
          Write your <span className="text-gradient">note</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Write from the heart. Share it with a beautiful link.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
              placeholder="Your name (optional)"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="bg-card"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Your message</label>
            <Textarea
              placeholder="Dear you..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="resize-none bg-card"
            />
          </div>
          <Button type="submit" variant="hero" size="lg" className="w-full gap-2" disabled={isSaving}>
            <Heart className="h-4 w-4" /> Generate Link
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default Compose;
