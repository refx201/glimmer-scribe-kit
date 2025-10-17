import { supabase } from "@/lib/supabase";

export interface SqlResult {
  data: any[] | null;
  error: any;
}

// Generic SQL executor using the Postgres function `execute_sql`
// This actually runs the passed SQL and returns a JSON array of rows.
export async function executeSql(query: string): Promise<SqlResult> {
  try {
    console.log("Executing SQL query:", query);

    const { data, error } = await supabase.rpc("execute_sql", { sql_query: query });

    if (error) {
      console.error("SQL execution error:", error);
      return { data: null, error };
    }

    // `execute_sql` returns JSONB which will be parsed as a JS array (or null)
    const rows = (Array.isArray(data) ? data : data ? (data as any) : []) as any[];
    return { data: rows, error: null };
  } catch (error) {
    console.error("SQL execution failed:", error);
    return { data: null, error } as SqlResult;
  }
}
