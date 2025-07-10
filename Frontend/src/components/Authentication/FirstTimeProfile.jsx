import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"; 
import { getCurrentUserProfile, updateProfilePicture, updateUserProfile } from '../../services/UserService';
import './test.css';
import { toast } from 'react-toastify';
import placeholderImage from '../../assets/placeholder.jpg';

const categoryStyles = {
    "UI/UX Design": "light-info-bg",
    "Website Design": "bg-lightgreen",
    "Quality Assurance": "light-success-bg",
    "App Development": "bg-warning",
    "Development": "bg-primary",
    "Backend Development": "bg-secondary",
    "Software Testing": "bg-danger",
    "Marketing": "bg-info",
    "SEO": "bg-dark",
    "Other": "bg-light",
};

const FirstTimeProfile = () => {
    const [firstName, setFirstName] = useState('John');
    const [lastName, setLastName] = useState('Doe');
    const [email, setEmail] = useState('john_doe12@bbb.com');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [country, setCountry] = useState('');
    const [techRole, setTechRole] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [bio, setBio] = useState('This is my bio.');
    const [profilePicture, setProfilePicture] = useState(placeholderImage); // Default profile picture
    const navigate = useNavigate(); 
    const handleSaveProfile = async () => {
        try {
            const updatedProfileData = {
                firstName,
                lastName,
                email,
                phoneNumber,
                address,
                country,
                techRole,
                dateOfBirth,
                bio
            };
    
            // Call the API to update the profile
            const response = await updateUserProfile(updatedProfileData);
    
            // Check if the response contains the updated user object
            if (response) {
                toast.success('Profile updated successfully!');
                setTimeout(() => {
                    if (response.role === 'Company') {
                        navigate('/FirstTimeCompany');  // Navigate to Company page
                    } else {
                        navigate('/profile');  // Navigate to Profile page
                    }
                }, 2000); // Adjust the delay as needed (2 seconds in this case)
            } else {
                console.error('Unexpected response:', response);
                toast.error('Error updating profile.');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Error updating profile.');
        }
    };
    
    
    
    


    const handleProfilePictureChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64Image = reader.result.split(',')[1]; // Remove 'data:image/...;base64,' part
                try {
                    const uploadedImageUrl = await updateProfilePicture(base64Image);
    
                    // Log and update the profile picture
                    console.log('Uploaded Image URL:', uploadedImageUrl);
                    setProfilePicture(uploadedImageUrl.profilePicture); // Update the state to refresh the image
                    toast.success('Profile picture updated!');
                } catch (error) {
                    console.error('Error uploading profile picture:', error);
                    toast.error('Error uploading profile picture.');
                }
            };
            reader.readAsDataURL(file);
        }
    };
    
    const countries = [
        'USA', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 
        'India', 'Japan', 'China', 'Brazil', 'Mexico','Tunisia', 'South Africa'
    ];

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const profileData = await getCurrentUserProfile();
                setFirstName(profileData.firstName || '');
                setLastName(profileData.lastName || '');
                setEmail(profileData.email || '');
                setPhoneNumber(profileData.phoneNumber || '');
                setAddress(profileData.address || '');
                setCountry(countries.includes(profileData.country) ? profileData.country : '');
                setTechRole(profileData.techRole || '');
                setDateOfBirth(profileData.dateOfBirth || '');
                setBio(profileData.bio || '');
                setProfilePicture(profileData.profilePicture || profilePicture);
               
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, [navigate]); // Add navigate to dependency array

    return (
        <div className='role-background'>
            <h2 className="role-instruction section-instruction">
                Let's finish up by filling in your profile
            </h2> 
            <div className="profile-card">
                <div className="container rounded bg-white mt-5">
                    <div className="row">
                        <div className="col-md-4 border-right">
                            <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                                <label htmlFor="profilePictureInput" style={{ cursor: 'pointer' }}>
                                    <img
                                        className="rounded-circle mt-5"
                                        src={profilePicture}
                                        width="90"
                                        alt="Profile"
                                    />
                                </label>
                                <input
                                    type="file"
                                    id="profilePictureInput"
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                    onChange={handleProfilePictureChange}
                                />
                                <span className="font-weight-bold">{`${firstName} ${lastName}`}</span>
                                <span className="text-black-50">{email}</span>
                                <span>{country}</span>
                            </div>
                        </div>
                        <div className="col-md-8">
                            <div className="p-3 py-5">
                                <div className="row mt-2">
                                    <div className="col-md-6">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="First Name"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={lastName}
                                            placeholder="Last Name"
                                            onChange={(e) => setLastName(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-md-6">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Email"
                                            disabled
                                            value={email}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={phoneNumber}
                                            placeholder="Phone Number"
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-md-6">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Address"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <select
                                            className="form-control"
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                        >
                                            <option value="" disabled>Select Country</option>
                                            {countries.map((country) => (
                                                <option key={country} value={country}>{country}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-md-6">
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={dateOfBirth}
                                            onChange={(e) => setDateOfBirth(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <select
                                            className="form-control"
                                            value={techRole}
                                            onChange={(e) => setTechRole(e.target.value)}
                                        >
                                            <option value="" disabled>Select Tech Role</option>
                                            {Object.keys(categoryStyles).map((role) => (
                                                <option key={role} value={role}>{role}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-md-12">
                                        <textarea
                                            className="form-control"
                                            placeholder="Bio"
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            rows="3"
                                        />
                                    </div>
                                </div>
                                <div className="mt-5 text-right">
                                    <button
                                        className="btn btn-primary profile-button"
                                        onClick={handleSaveProfile}
                                    >
                                        Save Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FirstTimeProfile;