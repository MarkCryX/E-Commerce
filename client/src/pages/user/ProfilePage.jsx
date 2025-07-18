// src/pages/ProfilePage.jsx
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react"; // Don't forget to import useEffect if you use it

const ProfilePage = () => {
  const { user, loading } = useAuth(); // Destructure user, loading, isAuthenticated

  if (loading) {
    return <div>Loading profile...</div>; // Show loading state
  }
  // console.log(user);

  // Render user data
  return (
    <div className="my-8 rounded-lg bg-white p-6 shadow-md">
      <h1 className="mb-6 text-center text-3xl font-bold">Your Profile</h1>
      {user ? (
        <div className="space-y-4">
          <p className="text-lg">
            <strong>Username:</strong> {user.username}
          </p>
          <p className="text-lg">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="text-lg">
            <strong>Role:</strong> {user.role}
          </p>
          
          <img
            src={user.profileImage}
            alt="profile"
            className="h-19 w-19 rounded-full border-2 border-gray-400 object-fill"
          />
        </div>
      ) : (
        <p className="text-center text-red-500">No user data available.</p>
      )}
    </div>
  );
};

export default ProfilePage;
