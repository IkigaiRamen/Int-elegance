import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCompany, updateCompanyLogo } from "../../services/CompanyService";
import { toast } from "react-toastify";

const FirstTimeCompany = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogoChange = (e) => {
    const logoFile = e.target.files[0];

    if (logoFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const logoBase64 = reader.result.split(",")[1]; // Remove the data prefix
        setLogo(logoBase64); // Save base64-encoded logo
        setPreview(URL.createObjectURL(logoFile)); // Set a preview URL for the image
      };
      reader.readAsDataURL(logoFile); // Read the file as a base64 string
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear any previous error messages
  
    // Collect the company data
    const companyData = {
      name,
      description,
      website,
      email,
      address,
      phoneNumber,
    };
  
    try {
      // Step 1: Create the company
      const response = await createCompany(companyData); // Assume response includes companyId
      if (response && response.company._id) {
        // Step 2: Upload the logo if it exists
        if (logo) {
          await updateCompanyLogo(response.company._id, logo); // Pass the company ID and logo
        }
  
        // Step 3: Navigate to the dashboard on success
        navigate("/profile");
        
        // Toast notification with timeout using setTimeout
        setTimeout(() => {
          toast.success("Company created successfully!");
        }, 1000); // Show success after 1 second delay
      } else {
        setError("Failed to create the company. Please try again.");
        
        // Toast notification with timeout using setTimeout
        setTimeout(() => {
          toast.error("Failed to create the company. Please try again.");
        }, 1000); // Show error after 1 second delay
      }
    } catch (err) {
      setError("An error occurred. Please check your input and try again.");
      console.error("Error creating company:", err);

      // Toast notification with timeout using setTimeout
      setTimeout(() => {
        toast.error("Error creating company.");
      }, 1000); // Show error after 1 second delay
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="role-background">
      <section className="company-creation">
        <div className="container">
          <h2 className="text-center mb-4">Create Your Company</h2>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="row">
            {/* Company Info Form */}
            <div className="col-md-8">
              <div className="card">
                <div className="card-header">
                  <h6>Company Info</h6>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <input
                        type="text"
                        id="name"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter company name"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="email"
                        id="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter company email"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="text"
                        id="phoneNumber"
                        className="form-control"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="text"
                        id="address"
                        className="form-control"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter address"
                      />
                    </div>
                    <div className="mb-3">
                      <textarea
                        id="description"
                        rows="4"
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter company description"
                        required
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <input
                        type="text"
                        id="website"
                        className="form-control"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="Enter website URL"
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="file"
                        id="logo"
                        className="form-control"
                        onChange={handleLogoChange}
                        accept="image/*"
                      />
                    </div>
                    <div className="text-center">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={loading}
                      >
                        {loading ? "Creating..." : "Create Company"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Company Preview */}
            <div className="col-md-4">
              <div className="card">
                <div className="card-header">
                  <h6>Company Preview</h6>
                </div>
                <div className="card-body text-center">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Company Logo Preview"
                      className="img-fluid mb-3"
                    />
                  ) : (
                    <p className="text-muted">Upload a logo to see the preview.</p>
                  )}
                  <div>
                    <strong>{name || "Company Name"}</strong>
                  </div>
                  <div className="text-muted">{description || "Company Description"}</div>
                  <div className="mt-3">
                    <strong>Email:</strong> <span>{email || "N/A"}</span>
                  </div>
                  <div>
                    <strong>Phone:</strong> <span>{phoneNumber || "N/A"}</span>
                  </div>
                  <div>
                    <strong>Website:</strong> <span>{website || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FirstTimeCompany;
