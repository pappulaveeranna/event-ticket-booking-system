import React, { useState, useEffect } from "react";
import { userAPI } from "../services/api";

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userAPI.getProfile();
        setProfile(response.data);
      } catch (err: any) {
        setError("Failed to load profile. Please login again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="loading">Loading profile...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!profile) return null;

  return (
    <>
      <style>{`
        body {
          margin: 0;
        }

        .profile-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8f9ff, #e0f2ff);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          font-family: Arial, sans-serif;
        }

        .profile-card {
          background: white;
          width: 100%;
          max-width: 500px;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 15px 40px rgba(0,0,0,0.1);
        }

        .avatar {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #ff6a00, #ff9500);
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          font-size: 36px;
          font-weight: bold;
          margin: 0 auto 15px;
        }

        .name {
          text-align: center;
          font-size: 26px;
          font-weight: bold;
        }

        .role {
          text-align: center;
          margin-top: 8px;
          color: #777;
          font-size: 14px;
        }

        .field {
          margin-top: 20px;
          padding: 15px;
          background: #f5f7fb;
          border-radius: 12px;
          display: flex;
          align-items: center;
        }

        .icon {
          font-size: 22px;
          margin-right: 15px;
        }

        .label {
          font-size: 12px;
          color: #666;
        }

        .value {
          font-size: 16px;
          font-weight: 600;
        }

        .loading, .error {
          color: white;
          font-size: 22px;
          text-align: center;
          margin-top: 50px;
        }

        .error {
          color: red;
        }
      `}</style>

      <div className="profile-page">
        <div className="profile-card">
          <div className="avatar">
            {profile.fullName
              ? profile.fullName.charAt(0).toUpperCase()
              : profile.email.charAt(0).toUpperCase()}
          </div>

          <div className="name">{profile.fullName || "User"}</div>
          <div className="role">{profile.role}</div>

          <div className="field">
            <div className="icon">📧</div>
            <div>
              <div className="label">Email</div>
              <div className="value">{profile.email}</div>
            </div>
          </div>

          <div className="field">
            <div className="icon">👤</div>
            <div>
              <div className="label">Full Name</div>
              <div className="value">{profile.fullName || "Not provided"}</div>
            </div>
          </div>

          <div className="field">
            <div className="icon">📱</div>
            <div>
              <div className="label">Phone</div>
              <div className="value">{profile.phoneNumber || "Not provided"}</div>
            </div>
          </div>

          <div className="field">
            <div className="icon">📍</div>
            <div>
              <div className="label">Address</div>
              <div className="value">{profile.address || "Not provided"}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
