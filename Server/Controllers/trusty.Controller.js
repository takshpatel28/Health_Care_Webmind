const supabase = require("../Supabase/supabaseServer");

module.exports.GETDOCTORS = async (req, res) => {
    const { specialization } = req.query;
    try {
        let query = supabase.from('healthcare').select('*');

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
}

// module.exports.InsertDoctor = async (req, res) => {
//     const doctorData = req.body;

//     if (!doctorData || Object.keys(doctorData).length === 0) {
//         return res.status(400).json({ message: "Please provide Doctor data!" });
//     }

//     try {
//         const { data, error } = await supabase
//             .from('healthcare')
//             .insert([doctorData])
//             .select();

//         if (error) {
//             console.log(error)
//             return res.status(500).json({ message: "Database error", error: error.message });
//         }

//         return res.status(201).json({ message: "Doctor inserted successfully!", data });
//     } catch (err) {
//         return res.status(500).json({ message: "Internal server error", error: err.message });
//     }
// };

module.exports.UpdateDoctors = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    if (!id) {
        return res.status(400).json({ message: "Please provide an ID!!" });
    }

    try {
        const { data, error } = await supabase
            .from('healthcare')
            .update(updateData)
            .eq('id', id)
            .select();

        if (error) {
            return res.status(500).json({ message: "Database error", error: error.message });
        }
        return res.status(200).json({ message: "Doctor updated successfully", updatedData: data });
    } catch (error) {
        return res.status(400).json({ message: "Internal server error", error: error.message });
    }
};
module.exports.DeleteDoctors = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Please provide a doctor ID to delete!" });
    }

    try {
        const { error } = await supabase
            .from('healthcare')
            .delete()
            .eq('id', id);

        if (error) {
            return res.status(500).json({ message: "Database error", error: error.message });
        }

        return res.status(200).json({ message: "Doctor deleted successfully!" });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};