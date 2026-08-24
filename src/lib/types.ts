export type MealType = "breakfast" | "lunch" | "dinner";

export interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
  aisle: string;
}

export interface Recipe {
  id: string;
  family_id: string | null;
  created_by: string | null;
  title: string;
  description: string | null;
  image_url: string | null;
  category: string;
  servings: number;
  prep_minutes: number | null;
  cook_minutes: number | null;
  ingredients: Ingredient[];
  instructions: string[];
  created_at: string;
  profiles?: { name: string } | null;
}

export interface Profile {
  id: string;
  family_id: string | null;
  name: string;
  avatar_color: string;
  is_organizer: boolean;
  created_at: string;
}

export interface Family {
  id: string;
  name: string;
  invite_code: string;
  created_by: string | null;
  created_at: string;
}

export interface Suggestion {
  id: string;
  family_id: string;
  week_start: string;
  meal_date: string;
  meal_type: MealType;
  recipe_id: string | null;
  custom_title: string | null;
  suggested_by: string;
  note: string | null;
  created_at: string;
  recipes: Recipe | null;
  profiles: { name: string; avatar_color: string } | null;
  suggestion_votes: { user_id: string }[];
}

export interface PlanEntry {
  id: string;
  family_id: string;
  week_start: string;
  meal_date: string;
  meal_type: MealType;
  recipe_id: string | null;
  custom_title: string | null;
}

export interface GroceryItem {
  id: string;
  family_id: string;
  week_start: string;
  name: string;
  quantity: string | null;
  unit: string | null;
  aisle: string;
  checked: boolean;
}

export const MEAL_TYPES: MealType[] = ["breakfast", "lunch", "dinner"];

export const CATEGORIES = [
  "Breakfast",
  "Pasta",
  "Pizza",
  "Mexican",
  "Asian",
  "Indian",
  "Comfort Food",
  "Healthy",
  "Seafood",
  "Soup",
  "Salad",
  "Dessert",
] as const;

export const AISLES = [
  "Produce",
  "Meat & Seafood",
  "Dairy",
  "Bakery",
  "Pantry",
  "Frozen",
  "Spices",
  "Other",
] as const;

export const AVATAR_COLORS = [
  "#ff5a3c",
  "#e63975",
  "#7c5cff",
  "#3f9142",
  "#ffa62b",
  "#0ea5b5",
  "#d946ef",
  "#f43f5e",
];
