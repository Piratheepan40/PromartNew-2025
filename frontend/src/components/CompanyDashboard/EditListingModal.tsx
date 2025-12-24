import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, File, Image as ImageIcon, Plus, Wand2, Loader2 } from "lucide-react";
import axios from "axios";

import { useToast } from "@/hooks/use-toast";
import { updateListing } from "@/services/listingService";

const EditListingModal = ({ open, onOpenChange, listing, onUpdated }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    website: "",
    keyFeatures: [] as string[],
  });

  const [featureInput, setFeatureInput] = useState("");
  const [existingDocs, setExistingDocs] = useState<any[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [newDocs, setNewDocs] = useState<File[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";


  // ✅ Pre-fill when editing
  useEffect(() => {
    if (listing) {
      let parsedFeatures: string[] = [];

      try {
        // if it's ["[...actual array...]"]
        if (
          Array.isArray(listing.keyFeatures) &&
          listing.keyFeatures.length > 0 &&
          typeof listing.keyFeatures[0] === "string"
        ) {
          parsedFeatures = JSON.parse(listing.keyFeatures[0]);
        }
        // normal case (array)
        else if (Array.isArray(listing.keyFeatures)) {
          parsedFeatures = listing.keyFeatures;
        }
        // if it's plain string
        else if (typeof listing.keyFeatures === "string") {
          parsedFeatures = JSON.parse(listing.keyFeatures);
        }
      } catch (err) {
        console.error("Error parsing keyFeatures:", err);
        parsedFeatures = [];
      }
      setFormData({
        title: listing.title || "",
        description: listing.description || "",
        category: listing.category || "",
        location: listing.location || "",
        website: listing.website || "",
        keyFeatures: parsedFeatures,
      });

      // ✅ Preserve all metadata for existing files
      setExistingDocs(
        listing.verificationDocuments?.map((doc) => ({
          name: doc.name || `Document`,
          url: doc.url,
          type: doc.type || "application/octet-stream",
          size: doc.size || 0,
          uploadedAt: doc.uploadedAt || new Date().toISOString(),
        })) || []
      );

      setExistingImages(
        listing.attachments?.map((img) => ({
          name: img.name || `Image`,
          url: img.url,
          type: img.type || "image/jpeg",
          size: img.size || 0,
          uploadedAt: img.uploadedAt || new Date().toISOString(),
        })) || []
      );
    }
  }, [listing]);

  // ✅ Add Key Feature
  const addFeature = () => {
    const value = featureInput.trim();
    if (!value) return;
    if (formData.keyFeatures.includes(value)) return; // avoid duplicates
    setFormData((prev) => ({
      ...prev,
      keyFeatures: [...prev.keyFeatures, value],
    }));
    setFeatureInput("");
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      keyFeatures: prev.keyFeatures.filter((_, i) => i !== index),
    }));
  };

  // ✅ Upload Handlers
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []) as File[];
    setNewDocs((prev) => [...prev, ...files]);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []) as File[];
    setNewImages((prev) => [...prev, ...files]);
  };

  const removeExistingDoc = (i: number) =>
    setExistingDocs((prev) => prev.filter((_, index) => index !== i));
  const removeExistingImage = (i: number) =>
    setExistingImages((prev) => prev.filter((_, index) => index !== i));

  const removeNewDoc = (i: number) =>
    setNewDocs((prev: File[]) => prev.filter((_, index) => index !== i));
  const removeNewImage = (i: number) =>
    setNewImages((prev: File[]) => prev.filter((_, index) => index !== i));

  // ✨ AI Optimize Handler
  const handleOptimize = async () => {
    if (!formData.title || !formData.description) {
      toast({
        title: "Missing info",
        description: "Please enter a title and description first.",
        variant: "destructive",
      });
      return;
    }

    setIsOptimizing(true);
    try {
      const { data } = await axios.post(`${API_URL}/ai/optimize`, {
        title: formData.title,
        description: formData.description,
        category: formData.category,
      });

      setFormData((prev) => ({
        ...prev,
        title: data.title || prev.title,
        description: data.description || prev.description,
      }));

      toast({
        title: "Content Optimized!",
        description: "AI has refined your title and description.",
      });
    } catch (error: any) {
      console.error("Optimization error:", error);
      toast({
        title: "Optimization failed",
        description: error.response?.data?.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  // ✅ Submit Edited Listing
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // 🧱 Add text fields
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("website", formData.website);
      formDataToSend.append("status", "pending");

      // 🧩 Handle key features as JSON string
      formDataToSend.append(
        "keyFeatures",
        JSON.stringify(formData.keyFeatures)
      );

      // ✅ Preserve ALL metadata for existing files
      formDataToSend.append(
        "existingAttachments",
        JSON.stringify(
          existingImages.map((img) => ({
            name: img.name,
            url: img.url,
            type: img.type,
            size: img.size,
            uploadedAt: img.uploadedAt,
          }))
        )
      );

      formDataToSend.append(
        "existingVerificationDocuments",
        JSON.stringify(
          existingDocs.map((doc) => ({
            name: doc.name,
            url: doc.url,
            type: doc.type,
            size: doc.size,
            uploadedAt: doc.uploadedAt,
          }))
        )
      );

      // 📂 Add new documents
      newDocs.forEach((file) => {
        formDataToSend.append("verificationDocuments", file);
      });

      // 🖼️ Add new images
      newImages.forEach((file) => {
        formDataToSend.append("attachments", file);
      });

      // ✅ Call the API
      await updateListing(listing._id, formDataToSend);

      toast({
        title: "Listing updated!",
        description: "Your changes are pending admin approval.",
      });

      onOpenChange(false);
      if (typeof onUpdated === "function") onUpdated();
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to update listing",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Listing</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* 🏷️ Basic Info */}
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Input
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              required
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center justify-between">
              <Label>Description</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleOptimize}
                disabled={isOptimizing || !formData.title || !formData.description}
                className="h-8 text-primary gap-1.5 hover:text-primary hover:bg-primary/10"
              >
                {isOptimizing ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Wand2 size={14} />
                )}
                <span className="text-xs font-semibold">Optimize with AI</span>
              </Button>
            </div>

            <Textarea
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Website</Label>
            <Input
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              required
            />
          </div>

          {/* 🌟 Key Features */}
          <div className="md:col-span-2 space-y-2">
            <Label>Key Features</Label>

            <div className="flex gap-2">
              <Input
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addFeature();
                  }
                }}
                placeholder="Type a feature and press Enter"
              />
              <Button type="button" onClick={addFeature}>
                <Plus className="h-4 w-4" /> Add
              </Button>
            </div>

            {/* 🔥 Stylish badges for each feature */}
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.keyFeatures.length > 0 ? (
                formData.keyFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-primary hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No features added yet.
                </p>
              )}
            </div>
          </div>

          {/* 📂 Documents & Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
            {/* Documents */}
            <div className="space-y-3">
              <Label>Verification Documents</Label>
              <Input
                id="verificationDocs"
                type="file"
                multiple
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />

              {/* Existing Docs */}
              {existingDocs.length > 0 && (
                <div className="space-y-2">
                  {existingDocs.map((doc, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between border p-2 rounded-md"
                    >
                      <a
                        href={doc.url || doc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-blue-600 underline"
                      >
                        <File className="h-4 w-4" />{" "}
                        {doc.name || `Document ${i + 1}`}
                      </a>
                      <X
                        className="h-4 w-4 cursor-pointer"
                        onClick={() => removeExistingDoc(i)}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* New Docs */}
              {newDocs.length > 0 && (
                <div className="space-y-2">
                  {newDocs.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between border p-2 rounded-md"
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <File className="h-4 w-4" /> {file.name}
                      </div>
                      <X
                        className="h-4 w-4 cursor-pointer"
                        onClick={() => removeNewDoc(i)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Images */}
            <div className="space-y-3">
              <Label>Company Images</Label>
              <Input
                id="companyImages"
                type="file"
                multiple
                onChange={handleImageUpload}
                accept="image/*"
              />

              {/* Existing Images */}
              <div className="grid grid-cols-2 gap-2">
                {existingImages.map((img, i) => (
                  <div key={i} className="relative rounded-lg border">
                    <img
                      src={
                        img?.url?.startsWith("http")
                          ? img.url
                          : `http://localhost:5000${img.url}`
                      }
                      alt={`Existing ${img.name || i}`}
                      className="object-cover w-full h-24 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(i)}
                      className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* New Images */}
              <div className="grid grid-cols-2 gap-2">
                {newImages.map((file, i) => (
                  <div key={i} className="relative rounded-lg border">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="object-cover w-full h-24 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(i)}
                      className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ✅ Submit */}
          <div className="md:col-span-2 flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditListingModal;
