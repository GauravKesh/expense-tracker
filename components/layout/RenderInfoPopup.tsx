"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function RenderInfoPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem("seen-render-popup");
    if (!hasSeen) {
      setOpen(true);
      localStorage.setItem("seen-render-popup", "true");
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm bg-white shadow-xl border rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Please wait...
          </h2>
          {/* <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button> */}
        </div>
        <div className="space-y-2 text-sm text-gray-600">
          <p>The backend is hosted on a free Render instance and may take a few seconds to start.</p>
          <p>API connection to fetch data might be delayed for a while.</p>
          <p>Thank you for your patience!</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
