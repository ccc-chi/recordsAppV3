import { Records } from "../src/domain/records";
import { supabase } from "./supabase";

export const getAllRecords = async (): Promise<Records[]> => {
  const { data, error } = await supabase.from("study-record").select("*");
  if (error) {
    console.error("Error:", error.message);
  }
  if (!data) {
    return [];
  }

  return data ?? [];
};

export const addRecords = async (
  title: string,
  time: number
): Promise<Records[]> => {
  const { data, error } = await supabase
    .from("study-record")
    .insert({ title: title, time: time });
  if (error) {
    console.error("Error:", error.message);
  }
  if (!data) {
    return [];
  }
  return data;
};

export const deleteRecords = async (id: string) => {
  await supabase.from("study-record").delete().eq("id", id);
};