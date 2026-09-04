"use client";

import {
  CircleAlert,
  FolderPlus,
  LoaderCircle,
  Pencil,
  Plus,
  Tags,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "@/hook/useInventory";

const emptyCategory = { name: "", description: "" };

function CategoryDialog({ category, onClose }) {
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const saving = createCategory.isPending || updateCategory.isPending;
  async function handleSubmit(event) {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.currentTarget));
    try {
      if (category.id)
        await updateCategory.mutateAsync({ id: category.id, ...form });
      else await createCategory.mutateAsync(form);
      toast.success(
        category.id
          ? "Category updated successfully."
          : "Category created successfully.",
      );
      onClose();
    } catch (error) {
      toast.error(error.message);
    }
  }
  return (
    <Dialog
      open={Boolean(category)}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {category?.id ? "Edit category" : "Create category"}
          </DialogTitle>
          <DialogDescription>
            Use categories to organize medicine records and POS filters.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Category name
            </label>
            <Input name="name" defaultValue={category?.name} required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Description
            </label>
            <Textarea
              name="description"
              defaultValue={category?.description}
              placeholder="Optional category description"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" className="cursor-pointer" disabled={saving}>
              {saving && (
                <LoaderCircle
                  className="animate-spin"
                  data-icon="inline-start"
                />
              )}
              {category?.id ? "Save changes" : "Create category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function CategoryWorkspace() {
  const [dialogCategory, setDialogCategory] = useState(null);
  const { data: categories = [], isPending, error } = useCategories();
  const deleteCategory = useDeleteCategory();
  async function remove(category) {
    if (
      !window.confirm(
        `Delete ${category.name}? Categories with medicines cannot be deleted.`,
      )
    )
      return;
    try {
      await deleteCategory.mutateAsync(category.id);
      toast.success("Category deleted successfully.");
    } catch (deleteError) {
      toast.error(deleteError.message);
    }
  }
  return (
    <>
      <Card>
        <CardHeader className="gap-4 sm:flex sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Medicine categories</CardTitle>
            <CardDescription>
              Organize the medicine catalog into clear, reusable groups.
            </CardDescription>
          </div>
          <Button
            className="cursor-pointer"
            onClick={() => setDialogCategory(emptyCategory)}
          >
            <Plus data-icon="inline-start" />
            Add category
          </Button>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }, (_, index) => (
                <Skeleton key={index} className="h-32" />
              ))}
            </div>
          ) : error ? (
            <div className="flex min-h-48 flex-col items-center justify-center text-center">
              <CircleAlert className="size-6 text-destructive" />
              <p className="mt-3 font-medium text-foreground">
                Unable to load categories
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {error.message}
              </p>
            </div>
          ) : categories.length === 0 ? (
            <div className="flex min-h-48 flex-col items-center justify-center text-center">
              <FolderPlus className="size-6 text-muted-foreground" />
              <p className="mt-3 font-medium text-foreground">
                No categories yet
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Create a category before adding medicines.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {categories.map((category) => (
                <article
                  key={category.id}
                  className="flex min-h-32 flex-col justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:bg-accent/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Tags className="size-4" />
                      </span>
                      <div>
                        <p className="truncate font-medium text-foreground">
                          {category.name}
                        </p>
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {category.description || "No description provided."}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        className="cursor-pointer"
                        onClick={() => setDialogCategory(category)}
                        aria-label={`Edit ${category.name}`}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        className="cursor-pointer text-destructive"
                        onClick={() => remove(category)}
                        aria-label={`Delete ${category.name}`}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-muted-foreground">
                    Created{" "}
                    {new Intl.DateTimeFormat("en-US", {
                      dateStyle: "medium",
                    }).format(new Date(category.created_at))}
                  </p>
                </article>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <CategoryDialog
        category={dialogCategory}
        onClose={() => setDialogCategory(null)}
      />
    </>
  );
}
