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
  id: string,
  title: string,
  time: number
): Promise<Records[]> => {
  const { data, error } = await supabase
    .from("study-record")
    .insert({ id: id, title: title, time: time });
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

export const updateRecords = async (
  id: string,
  title: string,
  time: number
) => {
  const { error } = await supabase
    .from("study-record")
    .update({ title: title, time: time })
    .eq("id", id);
  if (error) {
    console.error("Error updating record:", error);
  }
};