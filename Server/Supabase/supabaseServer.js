const { createClient } = require("@supabase/supabase-js");
require("dotenv").config()

const Project_URL = process.env.PROJECT_URL;
const Api_Key = process.env.API_KEY;

const supabase = createClient(Project_URL,Api_Key,{ 
    auth: { autoRefreshToken: false, persistSession: false } 
});
module.exports = supabase;