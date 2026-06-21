"use client"

import * as React from "react"
import { useForm, UseFormReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Save, Loader2 } from "lucide-react"

export interface DynamicField {
  name: string
  label: string
  type: "text" | "email" | "password" | "number" | "textarea" | "select" | "date"
  description?: string
  placeholder?: string
  required?: boolean
  options?: { label: string; value: string }[]
}

export interface EnterpriseDynamicFormProps {
  fields: DynamicField[]
  defaultValues?: any
  onSubmit: (data: any) => Promise<void>
  isSubmitting?: boolean
  submitLabel?: string
}

export function EnterpriseDynamicForm({
  fields,
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel = "Save Changes"
}: EnterpriseDynamicFormProps) {
  const form = useForm({ defaultValues })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label} {field.required && <span className="text-destructive">*</span>}</FormLabel>
                <FormControl>
                  {field.type === "textarea" ? (
                    <textarea 
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder={field.placeholder} 
                      {...formField} 
                    />
                  ) : field.type === "select" ? (
                    <select 
                      className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                      {...formField}
                    >
                      <option value="">Select...</option>
                      {field.options?.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : (
                    <Input type={field.type} placeholder={field.placeholder} {...formField} />
                  )}
                </FormControl>
                {field.description && <FormDescription>{field.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <div className="flex items-center justify-end gap-4 pt-4 border-t">
          <Button type="button" variant="outline">Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  )
}
