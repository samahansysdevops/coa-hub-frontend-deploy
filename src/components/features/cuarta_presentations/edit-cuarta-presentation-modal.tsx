"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { SharedButton } from "@/components/shared/SharedButton";
import { Input } from "@/components/ui/input";
import { Pencil, Presentation } from "lucide-react";
import { useEffect, useState } from "react";
import ActionModal from "@/components/features/action_modal";
import { toastError, toastSuccess } from "@/components/shared/toast";
import { useUpdateCuartaPresentationMutation } from "@/lib/api/mutations/cuarta-presentation.mutation";
import { useCuartaPresentationQuery } from "@/lib/api/queries/use-cuarta-presentation";

interface EditCuartaPresentationModalProps {
  open: boolean;
  onClose: () => void;
}

export default function EditCuartaPresentationModal({
  open,
  onClose,
}: EditCuartaPresentationModalProps) {
  const [gdriveLink, setGDriveLink] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { data: presentation } = useCuartaPresentationQuery();
  const updateMutation = useUpdateCuartaPresentationMutation();

  // Load current link when modal opens
  useEffect(() => {
    if (presentation && open) {
      setGDriveLink(presentation.gdriveLink || "");
    }
  }, [presentation, open]);

  function handleSaveClick() {
    if (!gdriveLink.trim()) {
      toastError({
        title: "Invalid input",
        description: "Google Drive link is required",
      });
      return;
    }

    // Basic URL validation
    try {
      new URL(gdriveLink.trim());
    } catch {
      toastError({
        title: "Invalid URL",
        description: "Please enter a valid Google Drive link",
      });
      return;
    }

    setConfirmOpen(true);
  }

  async function confirmUpdate() {
    try {
      await updateMutation.mutateAsync({
        gdriveLink: gdriveLink.trim(),
        lastModifiedAt: new Date().toISOString(),
      });

      toastSuccess({
        title: "Link updated",
        description: "Cuarta presentations link has been saved.",
      });

      setConfirmOpen(false);
      onClose();
    } catch (err) {
      console.error("Failed to update cuarta presentation:", err);
      toastError({
        title: "Failed to update",
        description: "Please try again.",
      });
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent
          className="w-full !max-w-[800px] max-h-full overflow-y-auto rounded-xl p-10 text-white border border-white/10 [&>button]:hidden"
          style={{
            background: "linear-gradient(225deg, #6C7178 0%, #373C44 100%)",
          }}
        >
          {/* HEADER */}
          <DialogHeader>
            <div className="mt-3 flex items-center gap-3">
              <Presentation className="w-7 h-7 md:w-11 md:h-11" />
              <DialogTitle className="text-5xl font-bebas-neue font-medium tracking-wide">
                EDIT CUARTA PRESENTATIONS LINK
              </DialogTitle>
            </div>
          </DialogHeader>

          {/* FORM CONTENT */}
          <div className="mt-2 md:mt-8 space-y-6 pb-10 lg:pb-0">
            {/* GOOGLE DRIVE LINK */}
            <div
              className="rounded-2xl p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)] flex flex-col gap-3"
              style={{
                background:
                  "linear-gradient(90deg, rgba(120,125,133,0.65), rgba(55,60,68,0.90))",
              }}
            >
              <label className="text-white text-base md:text-xl font-medium">
                Google Drive Link
              </label>

              <Input
                placeholder="Paste Google Drive link"
                value={gdriveLink}
                onChange={(e) => setGDriveLink(e.target.value)}
                className="bg-[#E6E9EE] text-gray-700 text-xs sm:text-sm md:text-xl placeholder:text-gray-500 rounded-xl h-12 border border-white/20 px-4"
              />

              <p className="text-white/60 text-sm">
                This link will be displayed to all members viewing the Cuarta
                Presentations page.
              </p>
            </div>
          </div>

          {/* FOOTER */}
          <DialogFooter className="mt-1 md:mt-8 flex flex-row justify-end gap-4">
            <SharedButton
              onClick={handleSaveClick}
              size="lg"
              rounded="lg"
              tone="glass"
              className="h-11 !px-6 !text-sm sm:!px-10 sm:!text-base md:min-w-[130px] md:!text-base"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Saving..." : "Save"}
            </SharedButton>

            <SharedButton
              onClick={onClose}
              size="lg"
              rounded="lg"
              tone="glass"
              className="h-11 !px-6 !text-sm sm:!px-10 sm:!text-base md:min-w-[130px] md:!text-base"
            >
              Cancel
            </SharedButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ActionModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="UPDATE LINK?"
        description="Are you sure you want to update the Cuarta Presentations link?"
        confirmText="Save"
        cancelText="Go Back"
        onConfirm={confirmUpdate}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
