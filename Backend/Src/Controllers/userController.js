const express = require('express');
const bcrypt = require('bcryptjs');
const { registerUser, loginUser } = require('../Services/authService');
const User = require('../Models/User');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const Company = require('../Models/Company');
const { OAuth2Client } =require ('google-auth-library');
const CLIENT_ID = '956795060962-mi9ksasd1vak12l93siihfspuhusjh2s.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

// Configure Cloudinary
cloudinary.config({ 
    cloud_name: 'drexcmawh', 
    api_key: '749992466314972', 
    api_secret: 'p0Bz1rVzCyVtVWX9ZafYpyl5UgY' // Replace with your actual API secret
});


const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const token = await registerUser(firstName, lastName, email, password);
    res.status(201).json({ token });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: 'An unknown error occurred' });
    }
  }
};

const verifyGoogleToken = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID,
  });

  const payload = ticket.getPayload();
  return payload; // Contains user info like email, name, and picture
};

const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    // Step 1: Verify the Google Token
    const payload = await verifyGoogleToken(token);

    // Step 2: Check if the user exists in the database
    let user = await User.findOne({ email: payload.email });

    if (!user) {
      // Step 3: Create a new user if they don't exist, without setting a role
      user = new User({
        firstName: payload.given_name || "Google User",
        lastName: payload.family_name || "",
        email: payload.email,
        profilePicture: payload.picture,
        isVerified: true, // Google accounts are already verified
        isGoogleUser: true, // Add a flag to distinguish Google users
      });

      await user.save();
    }

    // Step 4: Log the user in by generating a JWT token
    const jwtToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Step 5: Respond with User Details and Token
    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePicture: user.profilePicture,
      },
      token: jwtToken,
    });

  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid Google token' });
  }
};




const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Authenticate the user and generate a token
    const token = await loginUser(email, password);

    // Find the user by email to get additional details
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('User not found'); // This error should rarely occur if loginUser is implemented correctly
    }

    // Respond with the token and user's role
    res.status(200).json({ token, role: user.role });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: 'An unknown error occurred' });
    }
  }
};


const logout = (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          console.error('Error during logout:', err);
          return res.status(500).json({ message: 'Failed to log out' });
      }
      res.clearCookie('connect.sid'); // Clear the session cookie
      return res.status(200).json({ message: 'Logged out successfully' });
  });
};

const getUserById = async (req, res) => {
  const { id } = req.params; // Make sure you're getting the ID from params
  try {
    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProfile = async (req, res) => {
  const userId = req.user._id; 
  console.log(`Received request to get profile for userId: ${userId}`);
  try {
      if (!req.user) {
          return res.status(401).json({ message: 'Unauthorized' });
      }

      const user = await User.findById(userId).select('-password');

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json(user);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
};


const getUserProfile = async (req, res) => {
  const authReq = req;

  if (!authReq.user) {
    return res.status(401).json({ message: 'User not found' });
  }

  res.status(200).json(authReq.user);
};
const getRole = async (req, res) => {
  const userId = req.user._id; 
  
  try {
    // Find the user by ID
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Return the user's role
    res.status(200).json({ role: user.role });
  } catch (error) {
    console.error("Error occurred while fetching user role:", error);
    res.status(500).json({ message: "Error fetching user role" });
  }
};
const updateUserProfile = async (req, res) => {
  console.error('Route hit: updateUserProfile');  // Basic log to verify if the route is being hit

  const updates = req.body; 
  const userId = req.user._id; 

  console.error('User ID:', userId);
  console.error('Updates:', updates);

  try {
    const user = await User.findByIdAndUpdate(userId, updates, { new: true });
    console.error('Updated user:', user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Update failed' });
  }
};


const getCurrentUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedToken.id).lean().exec();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve user', error });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().lean().exec(); // Fetch all users
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProfilePicture = async (req, res) => {
  const userId = req.user._id; // Get the userId from the authenticated user
  const { image } = req.body;

  console.log(`Received request to update profile picture for userId: ${userId}`);

  if (!image) {
      console.warn(`No image provided by userId: ${userId}`);
      return res.status(400).json({ message: 'No image provided' });
  }

  try {
      console.log(`Uploading image to Cloudinary for userId: ${userId}`);

      // Upload the image to Cloudinary using base64 data
      const result = await cloudinary.uploader.upload(`data:image/jpeg;base64,${image}`, {
          folder: 'profile_pictures',
          transformation: [{ width: 300, height: 300, crop: 'fit' }]
      });

      console.log(`Image uploaded to Cloudinary for userId: ${userId}. Secure URL: ${result.secure_url}`);

      // Update user profile picture URL
      const updatedUser = await User.findByIdAndUpdate(userId, { profilePicture: result.secure_url }, { new: true });

      if (!updatedUser) {
          console.warn(`User not found during profile picture update for userId: ${userId}`);
          return res.status(404).json({ message: 'User not found' });
      }

      console.log(`Profile picture updated successfully for userId: ${userId}`);
      res.status(200).json(updatedUser);
  } catch (error) {
      console.error(`Error during profile picture update for userId: ${userId}`, error);
      res.status(500).json({ message: 'Server error' });
  }
};

const updateBannerPicture = async (req, res) => {
  const userId = req.body.userId;
  const { image } = req.body;

  console.log(`Received request to update banner picture for userId: ${userId}`);

  if (!image) {
      console.warn(`No image provided by userId: ${userId}`);
      return res.status(400).json({ message: 'No image provided' });
  }

  try {
      console.log(`Uploading banner image to Cloudinary for userId: ${userId}`);

      // Upload the image to Cloudinary using base64 data
      const result = await cloudinary.uploader.upload(`data:image/jpeg;base64,${image}`, {
          folder: 'banner_pictures',
          transformation: [{ width: 1352, height: 300 }]
      });

      console.log(`Banner image uploaded to Cloudinary for userId: ${userId}. Secure URL: ${result.secure_url}`);

      // Update user banner picture URL
      const updatedUser = await User.findByIdAndUpdate(userId, { bannerPicture: result.secure_url }, { new: true });

      if (!updatedUser) {
          console.warn(`User not found during banner picture update for userId: ${userId}`);
          return res.status(404).json({ message: 'User not found' });
      }

      console.log(`Banner picture updated successfully for userId: ${userId}`);
      res.status(200).json(updatedUser);
  } catch (error) {
      console.error(`Error during banner picture update for userId: ${userId}`, error);
      res.status(500).json({ message: 'Server error' });
  }
};

// In your userController.js

const verifyEmail = async (req, res) => {
  const { token } = req.body; // Extract token from the request body

  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    const user = await User.findOne({ verificationToken: token }); // Assuming verificationToken is used to store the verification token

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Mark the user's email as verified
    user.isVerified = true;
    user.verificationToken = null; // Optional: Remove the token once verified
    await user.save();

    res.status(200).json({ message: 'Email successfully verified!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred during verification' });
  }
};



const searchUsersAndCompanies = async (req, res) => {
  const { query } = req.query; // Extract query from the URL
  console.log('Search query:', query);

  if (!query) {
    console.warn('No search query provided');
    return res.status(400).json({ message: 'Query parameter is required' });
  }

  try {
    console.log('Searching users and companies in the database...');

    // Search for users matching the query
    const users = await User.find({
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { techRole: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    });

    // Search for companies matching the query
    const companies = await Company.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { address: { $regex: query, $options: 'i' } }
      ]
    });

    console.log(`Found ${users.length} user(s) and ${companies.length} company(ies) matching the query: ${query}`);
    
    // Return both users and companies as part of the response
    res.status(200).json({
      users,
      companies
    });
  } catch (error) {
    console.error('Error occurred while searching users and companies:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const getUserInvitations = async (req, res) => {
  const userId = req.user._id; // Extract user ID from authenticated user

  try {
    // Find the user by ID and select invitations
    const user = await User.findById(userId).select("invitations");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ invitations: user.invitations });
  } catch (error) {
    console.error("Error fetching invitations:", error);
    return res.status(500).json({ message: "Failed to fetch invitations", error: error.message });
  }
};
const updateInvitationStatus = async (req, res) => {
  const { invitationId, companyId, action } = req.body.invitationId;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const invitation = user.invitations.find(
      (invitation) => invitation._id.toString() === invitationId
    );

    if (!invitation) return res.status(404).json({ message: "Invitation not found" });

    if (action === "accept") {
      await Company.findByIdAndUpdate(companyId, { $addToSet: { employees: userId } });
    }

    user.invitations = user.invitations.filter(
      (invitation) => invitation._id.toString() !== invitationId
    );

    await user.save();

    return res.status(200).json({ message: `Invitation ${action}ed successfully` });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update invitation", error: error.message });
  }
};





const acceptFriendRequest = async (req, res) => {
  const { requesterId } = req.body;

  try {
    const user = await User.findById(req.user._id);
    const requester = await User.findById(requesterId);

    if (!requester) {
      return res.status(404).json({ message: 'Requester not found.' });
    }

    if (!user.friendRequests.includes(requesterId)) {
      return res.status(400).json({ message: 'No friend request from this user.' });
    }

    // Add each other as friends
    user.friends.push(requesterId);
    requester.friends.push(req.user._id);

    // Remove friend request
    user.friendRequests = user.friendRequests.filter(id => id.toString() !== requesterId);

    await user.save();
    await requester.save();

    res.status(200).json({ message: 'Friend request accepted.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
};

const declineFriendRequest = async (req, res) => {
  const { requesterId } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user.friendRequests.includes(requesterId)) {
      return res.status(400).json({ message: 'No friend request from this user.' });
    }

    // Remove the request
    user.friendRequests = user.friendRequests.filter(id => id.toString() !== requesterId);

    await user.save();

    res.status(200).json({ message: 'Friend request declined.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
};

const removeFriend = async (req, res) => {
  const { friendId } = req.body;

  try {
    const user = await User.findById(req.user._id);
    const friend = await User.findById(friendId);

    if (!friend || !user.friends.includes(friendId)) {
      return res.status(400).json({ message: 'User is not your friend.' });
    }

    // Remove each other from friends
    user.friends = user.friends.filter(id => id.toString() !== friendId);
    friend.friends = friend.friends.filter(id => id.toString() !== req.user._id);

    await user.save();
    await friend.save();

    res.status(200).json({ message: 'Friend removed successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
};

const sendFriendRequest = async (req, res) => {
  const { friendId } = req.body;

  try {
    // Find the user who is sending the request and the recipient
    const user = await User.findById(req.user._id);
    const friend = await User.findById(friendId);

    if (!friend) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if the user is already a friend or a request is already sent
    if (user.friends.includes(friendId) || friend.friendRequests.includes(req.user._id)) {
      return res.status(400).json({ message: 'Friend request already sent or user is already a friend.' });
    }

    // Add the requesting user's ID to the recipient's friendRequests array
    friend.friendRequests.push(req.user._id);

    // Save the recipient's updated document
    await friend.save();

    res.status(200).json({ message: 'Friend request sent successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};


const getUserFriends = async (req, res) => {
  const userId = req.user._id; 

  try {
    // Find the user by ID and populate the 'friends' field with firstName, lastName, and profilePicture
    const user = await User.findById(userId)
      .populate('friends', 'firstName lastName profilePicture bio techRole'); // Populate the friends' data

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the list of friends data
    res.status(200).json({ friends: user.friends });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  logout,
  getUserProfile,
  updateUserProfile,
  getCurrentUser,
  getAllUsers,
  updateProfilePicture,
  getUserById,
  searchUsersAndCompanies,
  updateBannerPicture,
  getProfile,
  verifyEmail,
  getRole,
  updateInvitationStatus,
  getUserInvitations,
  googleLogin,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
  getUserFriends,
};
