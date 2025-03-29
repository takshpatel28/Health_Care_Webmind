const supabase = require("../Supabase/supabaseServer");

module.exports.GETDOCTORS = async (req, res) => {
    const { specialization } = req.query;
    try {
        let query = supabase.from('doctors').select('*').eq('role', 'Doctor')

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

module.exports.UpdateDoctors = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    if (!id) {
        return res.status(400).json({ message: "Please provide an ID!!" });
    }

    try {
        const { data, error } = await supabase
            .from('doctors')
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
        // Delete from "doctors" table
        const { error: doctorError } = await supabase
            .from('doctors')
            .delete()
            .eq('id', id);

        if (doctorError) {
            return res.status(500).json({ message: "Database error while deleting doctor", error: doctorError.message });
        }

        // Delete from Authentication Users
        const { error: authError } = await supabase.auth.admin.deleteUser(id);

        if (authError) {
            return res.status(500).json({ message: "Error deleting user from authentication", error: authError.message });
        }

        return res.status(200).json({ message: "Doctor deleted successfully from tables!" });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};


module.exports.GET_HODS = async (req, res) => {
    const { department } = req.query;
    try {
        let query = supabase.from('doctors').select('*').eq('role', 'HOD');

        if (department) {
            query = query.eq('department', department);
        }
        const { data, error } = await query;

        if (error) {
            return res.status(500).json({ error: "Database error", details: error.message });
        }

        return res.status(200).json({ hodsData: data });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

module.exports.UPDATE_HOD = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
        return res.status(400).json({ message: "Please provide a HOD ID!" });
    }

    try {
        // First verify this is actually an HOD
        const { data: existingHod, error: fetchError } = await supabase
            .from('doctors')
            .select('role')
            .eq('id', id)
            .single();

        if (fetchError) {
            return res.status(500).json({ message: "Database error", error: fetchError.message });
        }

        if (!existingHod || existingHod.role !== 'HOD') {
            return res.status(404).json({ message: "HOD not found with this ID" });
        }

        // Now perform the update
        const { data, error } = await supabase
            .from('doctors')
            .update(updateData)
            .eq('id', id)
            .select();

        if (error) {
            return res.status(500).json({ message: "Database error", error: error.message });
        }

        return res.status(200).json({
            message: "HOD updated successfully",
            updatedHod: data
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

module.exports.DELETE_HOD = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Please provide a HOD ID to delete!" });
    }

    try {
        // First verify this is actually an HOD
        const { data: existingHod, error: fetchError } = await supabase
            .from('doctors')
            .select('role')
            .eq('id', id)
            .single();

        if (fetchError) {
            return res.status(500).json({ message: "Database error", error: fetchError.message });
        }

        if (!existingHod || existingHod.role !== 'HOD') {
            return res.status(404).json({ message: "HOD not found with this ID" });
        }

        // Now perform the deletion
        const { error } = await supabase
            .from('doctors')
            .delete()
            .eq('id', id);

        if (error) {
            return res.status(500).json({ message: "Database error", error: error.message });
        }

        return res.status(200).json({ message: "HOD deleted successfully!" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};