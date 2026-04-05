"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, Sparkles } from "lucide-react";

interface FieldDefinition {
  id: string;
  label: string;
  key: string;
  type: string;
  required: boolean;
  placeholder?: string;
  section_name: string;
}

interface ProfileFormProps {
  fields: FieldDefinition[];
  initialData?: any;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export function ProfileForm({ fields, initialData, onSubmit, isLoading }: ProfileFormProps) {
  // Dynamically build Zod schema based on field definitions
  const schemaShape: any = {};
  fields.forEach((field) => {
    let validator = z.string();
    if (field.required) {
      validator = validator.min(1, { message: `${field.label} is required` });
    } else {
      validator = validator.optional() as any;
    }
    
    if (field.type === "url") {
      validator = validator.url({ message: "Invalid URL" }).or(z.literal("")) as any;
    }
    
    schemaShape[field.key] = validator;
  });

  const formSchema = z.object(schemaShape);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {},
  });

  // Group fields by section
  const sections = Array.from(new Set(fields.map((f) => f.section_name)));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {sections.map((section) => (
          <Card key={section} className="bg-white/5 border-white/10 backdrop-blur-md overflow-hidden">
            <CardHeader className="bg-white/5 border-b border-white/10 px-6 py-4">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                {section}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {fields
                .filter((f) => f.section_name === section)
                .map((field) => (
                  <FormField
                    key={field.key}
                    control={form.control}
                    name={field.key}
                    render={({ field: formField }) => (
                      <FormItem className={field.type === "textarea" ? "md:col-span-2" : ""}>
                        <FormLabel className="text-xs font-bold uppercase tracking-wider">
                          {field.label} {field.required && <span className="text-rose-500">*</span>}
                        </FormLabel>
                        <FormControl>
                           {field.type === "textarea" ? (
                            <Textarea
                              placeholder={field.placeholder}
                              className="bg-transparent border-white/10 focus:border-primary transition-all resize-none h-32"
                              {...formField}
                              value={(formField.value as string) || ""}
                            />
                          ) : (
                            <Input
                              type={field.type === "number" ? "number" : "text"}
                              placeholder={field.placeholder}
                              className="bg-transparent border-white/10 focus:border-primary transition-all pr-12"
                              {...formField}
                              value={(formField.value as string) || ""}
                            />
                          )}
                        </FormControl>
                        <FormMessage className="text-[10px] font-bold uppercase" />
                      </FormItem>
                    )}
                  />
                ))}
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest px-8 py-6 rounded-2xl shadow-lg hover:shadow-primary/20 transition-all group"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
            )}
            Save Profile
          </Button>
        </div>
      </form>
    </Form>
  );
}
