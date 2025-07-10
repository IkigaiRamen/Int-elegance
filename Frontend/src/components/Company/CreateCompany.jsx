import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Company.css";
import {jwtDecode} from "jwt-decode";
import { useAuth } from "../../context/AuthContext";


const CreateCompany = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [logo, setLogo] = useState(null);
  const [creator, setCreator] = useState("");
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();
  const userId = useAuth();


  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setLogo(file);
    
    // Create a preview URL for the logo
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const reader = new FileReader();
    reader.readAsDataURL(logo); // Convert image file to base64
    reader.onloadend = async () => {
      const formData = {
        name: name,
        description: description,
        website: website,
        email: email,
        address: address,
        phoneNumber: phoneNumber,
        creator: userId,
        logo: reader.result, // Base64 encoded image
      };
  
      try {
        const response = await axios.post(
          "http://localhost:5000/api/companies",
          formData, // Sending as JSON, no need for multipart/form-data
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } catch (error) {
        console.error("Error creating company:", error);
      }
    };
  };
  
    
  return (
    <div className="body d-flex py-3">
      <div className="container-xxl">
        {/* Single Row for both sections */}
        <div className="row clearfix g-3 contact-us">
          {/* First Column: Left Side */}
          <div className="col-xl-8 col-lg-12 col-md-12">
            <div className="row g-3">
              {/* First Card: Company Info */}
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                    <h6 className="mb-0 fw-bold">Company Info</h6>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                      <div className="col-sm-12">
                        <input
                          type="text"
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter company name"
                          required
                        />
                      </div>

                      <div className="col-sm-12">
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter company email"
                          required
                        />
                      </div>

                      <div className="col-sm-12">
                        <input
                          type="text"
                          id="phoneNumber"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="Enter phone number"
                        />
                      </div>

                      <div className="col-sm-12">
                        <input
                          type="text"
                          id="address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Enter address"
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              {/* Second Card: Company Details */}
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                    <h6 className="mb-0 fw-bold">Company Details</h6>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                      <div className="col-sm-12">
                        <input
                          type="text"
                          id="website"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          placeholder="Enter website URL"
                        />
                      </div>

                      <div className="col-sm-12">
                        <textarea
                          id="description"
                          rows="4"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Enter company description"
                          required
                        ></textarea>
                      </div>

                      <div className="col-sm-12">
                        <input
                          type="file"
                          id="logo"
                          onChange={handleLogoChange}
                          accept="image/*"
                        />
                      </div>

                      <div className="text-center">
                        <button type="submit" className="btn btn-primary btn-lg">
                          Create Company
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

       {/* Second Column: Right Side (Company Preview) */}
<div className="col-xl-4 col-lg-12 col-md-12">
  <div className="card">
    <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
      <h6 className="mb-0 fw-bold">Company Preview</h6>
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
      <label className="fw-bold">{name || "Company Name"}</label>
      <label className="text-muted">{description || "Company Description"}</label>
      <div>
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
    </div>
  );
};

export default CreateCompany;
