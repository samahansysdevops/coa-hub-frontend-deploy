import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { SharedButton } from "@/components/shared/SharedButton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import ActionModal from "@/components/features/action_modal";
import { useCategoriesQuery } from "@/lib/api/queries/categoriesQueries";
import InputImage from "@/components/members-page/input-image";
import { Member } from "@/lib/types/entities/member";

interface EditMemberModalProps {
  open: boolean;
  onClose: () => void;
  member: Member | null;
  onSave: (data: { name?: string; position?: string; email?: string; categoryId?: number; image?: File }) => void;
}

export default function EditMemberModal({
  open,
  onClose,
  member,
  onSave,
}: EditMemberModalProps) {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [email, setEmail] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);

  const { data: categories } = useCategoriesQuery();

  // Populate form when member changes
  useEffect(() => {
    if (member) {
      setName(member.name);
      setPosition(member.position);
      setEmail(member.email);
      setCategoryId(String(member.categoryId));
      setImage(null);
    }
  }, [member]);

  function handleSaveClick() {
    if (!name || !position || !email || !categoryId) return;
    setConfirmOpen(true);
  }

  function confirmSave() {
    onSave({
      name: name.trim(),
      position: position.trim(),
      email: email.trim(),
      categoryId: parseInt(categoryId, 10),
      image: image || undefined,
    });

    setConfirmOpen(false);
    onClose();
  }

  function resetForm() {
    setName("");
    setPosition("");
    setEmail("");
    setCategoryId("");
    setImage(null);
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            resetForm();
            onClose();
          }
        }}
      >
        <DialogContent
          className="w-full !max-w-[800px] max-h-full overflow-y-auto rounded-xl p-10 text-white border border-white/10 [&>button]:hidden"
          style={{
            background: "linear-gradient(225deg, #6C7178 0%, #373C44 100%)",
          }}
        >
          <DialogHeader>
            <div className="mt-3 flex items-center gap-3">
              <Pencil className="w-7 h-7 md:w-11 md:h-11" />
              <DialogTitle className="text-4xl md:text-5xl font-bebas-neue font-medium tracking-wide">
                EDIT MEMBER
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="mt-2 md:mt-8 space-y-6 pb-10 lg:pb-0">
            {/* NAME */}
            <div
              className="rounded-2xl p-6 shadow-[0px_20px_60px_-20px_rgba(0,0,0,0.35)] flex flex-col gap-3"
              style={{
                background: "linear-gradient(90deg, rgba(120,125,133,0.65), rgba(55,60,68,0.90))",
              }}
            >
              <label className="text-white text-base md:text-xl font-medium">Name</label>
              <Input
                placeholder="Enter full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#E6E9EE] text-gray-700 text-xs sm:text-sm md:text-xl placeholder:text-gray-500 rounded-xl h-12 border border-white/20 px-4"
              />
            </div>

            {/* POSITION */}
            <div
              className="rounded-2xl p-6 shadow-[0px_20px_60px_-20px_rgba(0,0,0,0.35)] flex flex-col gap-3"
              style={{
                background: "linear-gradient(90deg, rgba(120,125,133,0.65), rgba(55,60,68,0.90))",
              }}
            >
              <label className="text-white text-base md:text-xl font-medium">Position</label>
              <Input
                placeholder="Enter position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="bg-[#E6E9EE] text-gray-700 text-xs sm:text-sm md:text-xl placeholder:text-gray-500 rounded-xl h-12 border border-white/20 px-4"
              />
            </div>

            {/* EMAIL */}
            <div
              className="rounded-2xl p-6 shadow-[0px_20px_60px_-20px_rgba(0,0,0,0.35)] flex flex-col gap-3"
              style={{
                background: "linear-gradient(90deg, rgba(120,125,133,0.65), rgba(55,60,68,0.90))",
              }}
            >
              <label className="text-white text-base md:text-xl font-medium">Email</label>
              <Input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#E6E9EE] text-gray-700 text-xs sm:text-sm md:text-xl placeholder:text-gray-500 rounded-xl h-12 border border-white/20 px-4"
              />
            </div>

            {/* CATEGORY */}
            <div
              className="rounded-2xl p-6 shadow-[0px_20px_60px_-20px_rgba(0,0,0,0.35)] flex flex-col gap-3"
              style={{
                background: "linear-gradient(90deg, rgba(120,125,133,0.65), rgba(55,60,68,0.90))",
              }}
            >
              <label className="text-white text-base md:text-xl font-medium">Category</label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="w-full py-6 bg-[#E6E9EE] text-gray-700 text-xs sm:text-sm md:text-xl placeholder:text-gray-500 rounded-xl h-12 border border-white/20 px-4">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="text-gray-700 text-xs sm:text-sm md:text-xl">
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* PHOTO */}
            <div
              className="rounded-2xl p-6 shadow-[0px_20px_60px_-20px_rgba(0,0,0,0.35)] flex flex-col gap-3"
              style={{
                background: "linear-gradient(90deg, rgba(120,125,133,0.65), rgba(55,60,68,0.90))",
              }}
            >
              <label className="text-white text-base md:text-xl font-medium">Photo (optional - leave empty to keep current)</label>
              <InputImage
                onImageChange={(file) => setImage(file)}
                existingImage={member?.imageUrl}
              />
            </div>
          </div>

          <DialogFooter className="mt-1 md:mt-8 flex flex-row justify-end gap-4">
            <SharedButton
              onClick={handleSaveClick}
              size="lg"
              rounded="lg"
              tone="glass"
              disabled={!name || !position || !email || !categoryId}
              className="h-11 !px-6 !text-sm sm:!px-10 sm:!text-base md:min-w-[130px] md:!text-base"
            >
              Save
            </SharedButton>

            <SharedButton
              onClick={() => {
                resetForm();
                onClose();
              }}
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
        title="UPDATE MEMBER?"
        description="Are you sure you want to update this member? Changes will be saved."
        confirmText="Save"
        cancelText="Go Back"
        onConfirm={confirmSave}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
