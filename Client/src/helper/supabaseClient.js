import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ubrsxoodrjfppwaixxvt.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVicnN4b29kcmpmcHB3YWl4eHZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4ODcxMDMsImV4cCI6MjA1ODQ2MzEwM30.IxejmTTfvoiwEZ5ZBWfjEq5TrZ9I1xvuVnDusYO9sUY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);