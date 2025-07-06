"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Pencil } from "lucide-react";
import CategoryForm from "@/components/forms/CategoryForm";
import { Loaderui } from "@/components/ui/loaderui";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import axios from "axios";

interface Category {
  _id: string;
  name: string;
}

export default function CategoriesModule() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState<string>("");
  const BASE_URL = "https://personal-expense-backend.onrender.com/api";

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${BASE_URL}/categories`);
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error("Error fetching categories:", e);
      setError("Failed to load categories. Please try again later.");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (category: { name: string }) => {
    try {
      setError(null);
      await axios.post(`${BASE_URL}/categories`, category);
      fetchCategories();
      setShowForm(false);
    } catch (e) {
      console.error("Error adding category:", e);
      setError("Failed to add category.");
    }
  };

  const updateCategory = async (id: string, name: string) => {
    try {
      await axios.put(`${BASE_URL}/categories/${id}`, { name });
      fetchCategories();
      setEditingCategory(null);
      setEditName("");
    } catch (e) {
      console.error("Error updating category:", e);
      setError("Failed to update category.");
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      setError(null);
      await axios.delete(`${BASE_URL}/categories/${id}`);
      fetchCategories();
    } catch (e) {
      console.error("Error deleting category:", e);
      setError("Failed to delete category.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Categories</CardTitle>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" /> Add Category
            </Button>
          </CardHeader>
          <CardContent>
            {loading && <Loaderui text="Loading categories..." />}
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <Dialog open={showForm} onOpenChange={setShowForm}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Category</DialogTitle>
                </DialogHeader>
                <CategoryForm
                  onSubmit={addCategory}
                  onCancel={() => setShowForm(false)}
                />
              </DialogContent>
            </Dialog>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50"
                >
                  {editingCategory?._id === category._id ? (
                    <div className="flex items-center gap-2 w-full">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        size="sm"
                        onClick={() => updateCategory(category._id, editName)}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingCategory(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <>
                      <p className="font-medium">{category.name}</p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingCategory(category);
                            setEditName(category.name);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteCategory(category._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
