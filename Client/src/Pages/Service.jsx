import React from 'react';
import { FaUserMd, FaHeartbeat, FaStethoscope, FaClipboardCheck, FaUserTie, FaUsers, FaCalendarAlt, FaPhone } from 'react-icons/fa';

const Services = () => {
  const services = {
    doctor: [
      {
        title: "Clinical Consultations",
        description: "Expert medical evaluations and evidence-based treatment plans.",
        icon: <FaUserMd className="text-4xl text-blue-600" />,
        details: [
          "Comprehensive patient assessments",
          "Differential diagnosis",
          "Treatment plan development",
          "Follow-up care coordination"
        ],
        image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80"
      },
      {
        title: "Medical Procedures",
        description: "Specialized in-office diagnostic and therapeutic procedures.",
        icon: <FaStethoscope className="text-4xl text-blue-600" />,
        details: [
          "Minor surgical procedures",
          "Diagnostic testing",
          "Therapeutic injections",
          "Clinical interventions"
        ],
        image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80"
      }
    ],
    hod: [
      {
        title: "Department Leadership",
        description: "Strategic direction and management of clinical departments.",
        icon: <FaUserTie className="text-4xl text-blue-600" />,
        details: [
          "Staff supervision & development",
          "Quality assurance programs",
          "Clinical protocol development",
          "Resource allocation"
        ],
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80"
      },
      {
        title: "Academic Oversight",
        description: "Medical education and training program supervision.",
        icon: <FaClipboardCheck className="text-4xl text-blue-600" />,
        details: [
          "Residency program direction",
          "Continuing medical education",
          "Research supervision",
          "Academic performance evaluation"
        ],
        image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80"
      }
    ],
    trustee: [
      {
        title: "Governance Services",
        description: "Strategic oversight and institutional governance.",
        icon: <FaUsers className="text-4xl text-blue-600" />,
        details: [
          "Policy development",
          "Financial oversight",
          "Strategic planning",
          "Compliance monitoring"
        ],
        image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80"
      },
      {
        title: "Institutional Leadership",
        description: "High-level decision making and direction setting.",
        icon: <FaHeartbeat className="text-4xl text-blue-600" />,
        details: [
          "Executive committee participation",
          "Long-term vision development",
          "Stakeholder engagement",
          "Reputation management"
        ],
        image: "https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80"
      }
    ]
  };

  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Professional Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
            Services Portal
          </h1>
          <p className="max-w-3xl mx-auto text-xl text-gray-600">
            Comprehensive services for physicians, department heads, and trustees
          </p>
        </div>

        {/* Doctor Services Section */}
        <section className="mb-20">
          <div className="flex items-center mb-8">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <FaUserMd className="text-2xl text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Physician Services</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {services.doctor.map((service, index) => (
              <ServiceCard key={`doctor-${index}`} service={service} />
            ))}
          </div>
        </section>

        {/* HOD Services Section */}
        <section className="mb-20">
          <div className="flex items-center mb-8">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <FaUserTie className="text-2xl text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Department Leadership Services</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {services.hod.map((service, index) => (
              <ServiceCard key={`hod-${index}`} service={service} />
            ))}
          </div>
        </section>

        {/* Trustee Services Section */}
        <section className="mb-20">
          <div className="flex items-center mb-8">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <FaUsers className="text-2xl text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Trustee Services</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {services.trustee.map((service, index) => (
              <ServiceCard key={`trustee-${index}`} service={service} />
            ))}
          </div>
        </section>

        {/* Professional Contact Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 bg-blue-700 p-10 text-white">
              <h2 className="text-3xl font-bold mb-6">Professional Contact</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-600 p-3 rounded-lg mr-4">
                    <FaPhone className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Executive Line</h3>
                    <p className="text-blue-100">(555) 789-0123</p>
                    <p className="text-sm text-blue-200">Available 8:00 AM - 6:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-600 p-3 rounded-lg mr-4">
                    <FaCalendarAlt className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Executive Assistant</h3>
                    <p className="text-blue-100">assistant@medicalinstitution.org</p>
                    <p className="text-sm text-blue-200">For scheduling and coordination</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 p-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Request Meeting</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Role</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Select your position</option>
                    <option>Physician</option>
                    <option>Department Head</option>
                    <option>Trustee</option>
                    <option>Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Select meeting purpose</option>
                    <option>Clinical Matter</option>
                    <option>Departmental Issue</option>
                    <option>Governance Discussion</option>
                    <option>Strategic Planning</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-300"
                >
                  Submit Request
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Service Card Component
const ServiceCard = ({ service }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100">
      <div className="h-48 overflow-hidden relative">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        <div className="absolute bottom-4 left-4">
          <h3 className="text-xl font-bold text-white">{service.title}</h3>
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-center mb-4">
          {service.icon}
        </div>
        <p className="text-gray-600 mb-4">{service.description}</p>
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">Key Responsibilities:</h4>
          <ul className="space-y-2">
            {service.details.map((detail, i) => (
              <li key={i} className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span className="text-gray-700">{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Services;
