// src/pages/ProfilePage.jsx
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react'; // Don't forget to import useEffect if you use it

const ProfilePage = () => {
  const { user, loading, isAuthenticated } = useAuth(); // Destructure user, loading, isAuthenticated
  
  if (loading) {
    return <div>Loading profile...</div>; // Show loading state
  }

  if (!isAuthenticated) {
    // This case should ideally be handled by PrivateRoute, but good for defensive coding
    return <div>You are not logged in.</div>;
  }

  // Render user data
  return (
    <div className="container mx-auto my-8 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Profile</h1>
      {user ? (
        <div className="space-y-4">

          <p className="text-lg"><strong>Username:</strong> {user.username}</p>
          <p className="text-lg"><strong>Email:</strong> {user.email}</p>
          <p className="text-lg"><strong>Role:</strong> {user.role}</p>
          <img 
          src={user.profileImage} 
          alt="profile" 
          className='w-19 h-19 object-fill rounded-full border-2 border-gray-400'
          />
        </div>
      ) : (
        <p className="text-center text-red-500">No user data available.</p>
      )}
    </div>
  );
};

export default ProfilePage;