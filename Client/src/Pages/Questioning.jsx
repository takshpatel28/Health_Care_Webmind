import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../AllContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../helper/supabaseClient";

const Questioning = () => {
  let role = localStorage.getItem("role")

  const navigate = useNavigate();

  const doctorQuestions = [
    { label: "Specialization", name: "specialization" },
    { label: "Bio", name: "bio", type: "textarea" },
    { label: "Experience Years", name: "experienceyears", type: "number" },
  ];

  const hodDepartments = {
    "Medical Departments": [
      "General Medicine",
      "General Surgery",
      "Cardiology",
      "Neurology",
      "Nephrology",
      "Gastroenterology",
      "Pulmonology",
      "Endocrinology",
      "Hematology",
      "Oncology",
      "Dermatology",
      "Psychiatry",
      "Rheumatology",
      "Infectious Diseases",
      "Geriatrics",
      "Pediatrics",
    ],
    "Surgical Departments": [
      "Orthopedics",
      "Neurosurgery",
      "Cardiothoracic Surgery",
      "Plastic & Reconstructive Surgery",
      "ENT (Otolaryngology)",
      "Ophthalmology",
      "Urology",
      "Gynecology & Obstetrics",
      "Anesthesiology",
      "Transplant Surgery",
    ],
    "Diagnostic & Laboratory Departments": [
      "Radiology & Imaging",
      "Pathology & Laboratory Medicine",
      "Microbiology",
      "Biochemistry",
      "Genetics",
    ],
    "Emergency & Critical Care": [
      "Emergency Medicine",
      "Critical Care & ICU",
      "Trauma & Burn Unit",
    ],
    "Specialized & Support Departments": [
      "Physiotherapy & Rehabilitation",
      "Nuclear Medicine",
      "Pain Management",
      "Palliative Care",
      "Sports Medicine",
      "Medical Education & Research",
      "Infection Control",
      "Public Health & Community Medicine",
    ],
    "Administrative & Non-Clinical Departments": [
      "Hospital Administration",
      "Medical Records & IT",
      "Pharmacy",
      "Nursing",
      "Diet & Nutrition",
      "Biomedical Engineering",
      "Facility & Infrastructure Management",
      "Finance & HR",
      "Security & Patient Relations",
    ],
  };

  const trusteeQuestions = [
    { label: "Area of Oversight", name: "oversight" },
    { label: "Contribution to Institution", name: "contribution", type: "textarea" },
    { label: "Years Associated", name: "yearsassociated", type: "number" },
  ];

  const questions =
    role === "doctor"
      ? doctorQuestions
      : role === "trustee"
        ? trusteeQuestions
        : [];

  const [formData, setFormData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure departmentCategory is stored
    const updatedFormData = {
      ...formData,
      departmentCategory: selectedCategory, // ✅ Ensure category is included
    };

    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) {
      console.error("Error fetching session:", error);
      return;
    }

    const userID = data.session.user.id;
    try {
      const { error } = await supabase
        .from("doctors") // Adjust table name if needed
        .update(updatedFormData)
        .eq("id", userID);

      if (error) {
        console.error("Error updating data:", error);
      } else {
        localStorage.removeItem('role');
        navigate("/login");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "16px",
          maxWidth: "600px",
          width: "100%",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ textAlign: "center", fontSize: "28px", marginBottom: "20px" }}>
          Answer The Questions as a {role}
        </h1>

        <form onSubmit={handleSubmit}>
          {role === "HOD" && (
            <>
              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  Select Department Category
                </label>
                <select
                  name="departmentCategory"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      departmentCategory: e.target.value, // ✅ Save department category
                    }));
                  }}
                  required
                >
                  <option value="">Select Category</option>
                  {Object.keys(hodDepartments).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

              </div>

              {selectedCategory && (
                <div style={{ marginBottom: "15px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontWeight: "bold",
                      color: "#333",
                    }}
                  >
                    Select Department
                  </label>
                  <select
                    name="department"
                    value={formData.department || ""}
                    onChange={handleChange} // ✅ This now updates `formData.department`
                    required
                  >
                    <option value="">Select Department</option>
                    {selectedCategory &&
                      hodDepartments[selectedCategory].map((dep) => (
                        <option key={dep} value={dep}>
                          {dep}
                        </option>
                      ))}
                  </select>

                </div>
              )}

              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  Leadership Experience (in years)
                </label>
                <input
                  type="number"
                  name="experienceyears"
                  value={formData.experienceyears || ""}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
            </>
          )}

          {role !== "HOD" &&
            questions.map(({ label, name, type, options }) => (
              <div key={name} style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  {label}
                </label>
                {type === "textarea" ? (
                  <textarea
                    name={name}
                    value={formData[name] || ""}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      resize: "vertical",
                    }}
                  />
                ) : (
                  <input
                    type={type || "text"}
                    name={name}
                    value={formData[name] || ""}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                    }}
                  />
                )}
              </div>
            ))}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#4f46e5",
              color: "#fff",
              fontWeight: "bold",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#4338ca")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#4f46e5")}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Questioning;