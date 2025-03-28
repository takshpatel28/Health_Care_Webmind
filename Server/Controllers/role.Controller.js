const supabase = require("../Supabase/supabaseServer");

module.exports.HOD = async (req, res) => {
    const { specialization } = req.query; 

    try {
        let query = supabase.from('doctor').select('*');

        if (specialization) {
            query = query.eq('specialization', specialization);
        }
        const { data, error } = await query;

        if (error) {
            return res.status(500).json({ error: "Database error", details: error.message });
        }

        return res.status(200).json({ doctorsData: data });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};