import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { SharedButton } from "../../shared/SharedButton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useState } from "react";
import ActionModal from "@/components/features/action_modal"; 

interface CreateNewSubmissionBinProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: { name: string; fileFormat: string; fileName: string }) => void;
}

export default function CreateNewSubmissionBinModal({
    open,
    onClose,
    onSave,
}: CreateNewSubmissionBinProps) {
    const [name, setName] = useState("");
    const [fileFormat, setFileFormat] = useState("");       // e.g. "Google Docs"
    const [fileName, setFileName] = useState(""); // e.g. "ACC_LR_AUGUST"

    const [confirmOpen, setConfirmOpen] = useState(false);

    function handleSaveClick() {
       if (!name || !fileFormat || !fileName) return;
        setConfirmOpen(true);
    }

    function confirmSave() {
        onSave({
            name: name.trim(),
            fileFormat: fileFormat.trim(),
            fileName: fileName.trim(),
        });

        resetForm();
        setConfirmOpen(false);
        onClose();
    }

    function resetForm() {
        setName("");
        setFileFormat("");
        setFileName("");
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
                    className="w-full !max-w-[1200px] max-h-full overflow-y-auto rounded-xl p-10 text-white border border-white/10 [&>button]:hidden"
                    style={{
                        background: "linear-gradient(225deg, #6C7178 0%, #373C44 100%)",
                    }}
                >
                    {/* HEADER */}
                    <DialogHeader>
                    <div className="mt-3 flex items-center gap-3">
                        <Plus className="w-7 h-7 md:w-11 md:h-11" />
                        <DialogTitle className="text-4xl md:text-5xl font-bebas-neue font-medium tracking-wide">
                            CREATE NEW SUBMISSION BIN
                        </DialogTitle>
                    </div>
                    </DialogHeader>

                    {/* FORM */}
                    <div className="mt-2 md:mt-8 space-y-6 pb-10 lg:pb-0">
                        {/* NAME */}
                        <div
                        className="
                            rounded-2xl p-6 
                            shadow-[0px_20px_60px_-20px_rgba(0,0,0,0.35)]
                            flex flex-col gap-3
                        "
                        style={{
                            background: "linear-gradient(90deg, rgba(120,125,133,0.65), rgba(55,60,68,0.90))",
                        }}
                        >
                        <label className="text-white text-base md:text-xl font-medium">Submission Bin Name</label>

                        <Input
                            placeholder="Add Submission Bin Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="
                            bg-[#E6E9EE] 
                            text-gray-700 text-xs sm:text-sm md:text-xl 
                            placeholder:text-gray-500 
                            rounded-xl 
                            h-12
                            border border-white/20
                            px-4
                            "
                        />
                        </div>

                        {/* INSTRUCTIONS GROUP (Raw File Format + Raw File Name Example) */}
                        <div
                            className="
                                rounded-2xl p-6
                                shadow-[0px_20px_60px_-20px_rgba(0,0,0,0.35)]
                                flex flex-col gap-6
                            "
                            style={{
                                background:
                                "linear-gradient(90deg, rgba(120,125,133,0.65), rgba(55,60,68,0.90))",
                            }}
                        >
                            <label className="text-white text-base md:text-xl font-medium">Instructions</label>

                            {/* RAW FILE FORMAT */}
                            <div className="flex flex-col gap-2">
                                <label className="text-white text-base md:text-xl font-medium">File Format</label>
                                <Select value={fileFormat} onValueChange={setFileFormat}>
                                    <SelectTrigger className="w-full py-6 bg-[#E6E9EE] text-gray-700 text-xs sm:text-sm md:text-xl placeholder:text-gray-500 rounded-xl h-12 border border-white/20 px-4">
                                        <SelectValue placeholder="Select file format" />
                                    </SelectTrigger>
                                    <SelectContent className="text-gray-700 text-xs sm:text-sm md:text-xl">
                                        <SelectItem value="Google Docs (.docx)">Google Docs (.docx)</SelectItem>
                                        <SelectItem value="PDF File (.pdf)">PDF File (.pdf)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* RAW FILE NAME EXAMPLE */}
                            <div className="flex flex-col gap-2">
                                <label className="text-white text-base md:text-xl font-medium">
                                    Raw File Name Example
                                </label>
                                <Input
                                    placeholder="CLUSTER_LR_MONTH (e.g. ACC_LR_AUGUST)"
                                    value={fileName}
                                    onChange={(e) => setFileName(e.target.value)}
                                    className="
                                        bg-[#E6E9EE] 
                                        text-gray-700 text-xs sm:text-sm md:text-xl 
                                        placeholder:text-gray-500 
                                        rounded-xl 
                                        h-12
                                        border border-white/20
                                        px-4
                                    "
                                />
                            </div>
                        </div>
                    </div>

                    {/* FOOTER BUTTONS */}
                    <DialogFooter className="mt-1 md:mt-8 flex flex-row justify-end gap-4">
                        <SharedButton
                            onClick={handleSaveClick}
                            size="lg"
                            rounded="lg"
                            tone="glass"
                            disabled={!name || !fileFormat || !fileName}
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
                title="SAVE NEW SUBMISSION BIN?"
                description="Are you sure you want to save the new submission bin? Information will be saved."
                confirmText="Save"
                cancelText="Go Back"
                onConfirm={confirmSave}
                onCancel={() => setConfirmOpen(false)}
            />
        </>
    )
}