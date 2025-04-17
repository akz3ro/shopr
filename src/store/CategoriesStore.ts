import { create } from "zustand";

interface CategoryState {
  category: string | "all";
  updateCategory: (category: string | "all") => void;
}

const useCategoryStore = create<CategoryState>((set) => ({
  category: "",
  updateCategory: (category) => set({ category: category }),
}));
export default useCategoryStore;
export type CategoriesStore = typeof useCategoryStore;
