"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Plus, Type, FileText, Hash, Calendar, Image as ImageIcon, Link2, Settings2, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchWrapper } from "@/lib/fetch";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const FIELD_TYPES = [
  { value: "string", label: "Short Text", icon: <Type className="w-4 h-4" /> },
  { value: "text", label: "Long Text", icon: <FileText className="w-4 h-4" /> },
  { value: "richtext", label: "Rich Text", icon: <FileText className="w-4 h-4 text-emerald-500" /> },
  { value: "number", label: "Number", icon: <Hash className="w-4 h-4" /> },
  { value: "datetime", label: "Date & Time", icon: <Calendar className="w-4 h-4" /> },
  { value: "media", label: "Media (Images/Video)", icon: <ImageIcon className="w-4 h-4 text-blue-500" /> },
  { value: "relation", label: "Relation", icon: <Link2 className="w-4 h-4 text-purple-500" /> },
];

export default function FieldBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const collectionId = params.id as string;

  const [fields, setFields] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // New Field State
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldMachineName, setNewFieldMachineName] = useState("");
  const [newFieldType, setNewFieldType] = useState("string");

  useEffect(() => {
    loadFields();
  }, [collectionId]);

  const loadFields = async () => {
    try {
      setLoading(true);
      const res = await fetchWrapper(`/cms/collections/${collectionId}/fields`);
      if (res.success) {
        setFields(res.data || []);
      }
    } catch (e) {
      toast.error("Failed to load fields");
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNewFieldName(val);
    setNewFieldMachineName(val.toLowerCase().replace(/[^a-z0-9]/g, '_'));
  };

  const addField = async () => {
    try {
      const res = await fetchWrapper(`/cms/collections/${collectionId}/fields`, {
        method: "POST",
        body: JSON.stringify({
          name: newFieldName,
          machine_name: newFieldMachineName,
          field_type: newFieldType,
          is_required: false
        })
      });

      if (res.success) {
        toast.success("Field added successfully");
        setIsDialogOpen(false);
        setNewFieldName("");
        setNewFieldMachineName("");
        loadFields();
      } else {
        toast.error("Failed to add field");
      }
    } catch (e) {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto h-full flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => router.push("/admin/cms/collections")}><ArrowLeft className="w-4 h-4" /></Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Field Builder</h1>
          <p className="text-muted-foreground mt-1">Configure the schema properties for this collection.</p>
        </div>
      </div>

      <div className="flex-1 bg-card border border-border/50 rounded-xl p-6 shadow-sm overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold">Fields ({fields.length})</h3>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="w-4 h-4 mr-2" /> Add new field</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Field</DialogTitle>
                <DialogDescription>Select a type and name for the new field.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Field Type</Label>
                  <Select value={newFieldType} onValueChange={setNewFieldType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select field type" />
                    </SelectTrigger>
                    <SelectContent>
                      {FIELD_TYPES.map(ft => (
                        <SelectItem key={ft.value} value={ft.value}>
                          <div className="flex items-center gap-2">
                            {ft.icon} {ft.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Display Name</Label>
                  <Input placeholder="e.g. Featured Image" value={newFieldName} onChange={handleNameChange} />
                </div>
                <div className="space-y-2">
                  <Label>Machine Name (JSON Key)</Label>
                  <Input placeholder="e.g. featured_image" value={newFieldMachineName} onChange={(e) => setNewFieldMachineName(e.target.value)} className="font-mono text-sm bg-muted" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={addField} disabled={!newFieldName || !newFieldMachineName}>Add Field</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">Loading fields...</div>
        ) : fields.length === 0 ? (
          <div className="flex-1 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground py-20">
            <Settings2 className="w-12 h-12 mb-4 opacity-50" />
            <p>No fields configured yet.</p>
          </div>
        ) : (
          <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
            {fields.map(field => {
              const typeConfig = FIELD_TYPES.find(t => t.value === field.field_type) || FIELD_TYPES[0];
              return (
                <div key={field.id} className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:border-primary/30 hover:bg-muted/10 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center border border-border">
                      {typeConfig.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{field.name}</h4>
                      <p className="font-mono text-[10px] text-muted-foreground mt-0.5">{field.machine_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">{typeConfig.label}</span>
                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><Settings2 className="w-4 h-4" /></Button>
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
