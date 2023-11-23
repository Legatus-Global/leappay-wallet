import toast, { Toaster } from "react-hot-toast";

export const handleCopyClick = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  } catch (err) {
    toast.error("Failed to copy text!");
  }
};
