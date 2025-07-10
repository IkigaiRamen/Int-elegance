const express = require('express');
const {
    register,
    login,
    getUserProfile,
    updateUserProfile,
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
    getUserFriends
} = require('../Controllers/userController');
const { authenticateToken } = require('../Middleware/authMiddleware');

const router = express.Router();

// Register
router.post('/register', register);

// Login
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/verify-email', verifyEmail);

// Update user profile
router.put('/update', authenticateToken, updateUserProfile);

router.get('/role', authenticateToken, getRole);
router.get('/profile', authenticateToken, getProfile);
router.get('/invitations', authenticateToken, getUserInvitations);
router.put('/invitation-status', authenticateToken, updateInvitationStatus);

// Search users route
router.get('/search', authenticateToken, searchUsersAndCompanies);

// Friend-related routes
router.post('/friend-request', authenticateToken, sendFriendRequest); // Send friend request
router.get('/friends', authenticateToken, getUserFriends); // Get user friends
router.put('/friend-request/accept', authenticateToken, acceptFriendRequest); // Accept friend request
router.put('/friend-request/decline', authenticateToken, declineFriendRequest); // Decline friend request
router.delete('/friend', authenticateToken, removeFriend); // Remove friend

// Get user by ID (this should be after the friend-related routes)
router.get('/:id', getUserById);

// Update profile and banner pictures
router.put('/profile-picture', authenticateToken, updateProfilePicture);
router.put('/banner-picture', authenticateToken, updateBannerPicture);

// Get all users
router.get('/', authenticateToken, getAllUsers);

module.exports = router;
