import { Records } from "../src/domain/records";
import { supabase } from "./supabase";

export async function getAllRecords():Promise<Records[]> {
  const { data, error } = await supabase.from("study-record").select("*");
  if (error) {
    console.error("Error:", error.message);
  }
  if (!data) {
    return [];
  }

  return data ?? [];
}
