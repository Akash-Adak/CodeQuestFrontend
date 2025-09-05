import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  UserIcon,
  MailIcon,
  CalendarIcon,
  LocationMarkerIcon,
  LinkIcon,
  PhotographIcon,
  PencilIcon,
  SaveIcon,
} from "@heroicons/react/outline";

const dummyProfile = {
  name: "",
  email: "emai@example.com",
  dob: "yyyy-mm-dd",
  city: "Unknown",
  gender: "Other",
  linkedin: "https://linkedin.com/in/xxxx",
  github: "https://github.com/xxxx",
  profilePhotoBase64: "",
};

export default function Profile() {
  const [profile, setProfile] = useState(dummyProfile);
  const [editing, setEditing] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState("");
  const userEmail = localStorage.getItem("email");

  useEffect(() => {
    if (!userEmail) {
      console.warn("User email not found, using dummy profile.");
      setProfile(dummyProfile);
      return;
    }

    const cachedProfile = localStorage.getItem("profile");
    if (cachedProfile) {
      const parsed = JSON.parse(cachedProfile);
      setProfile(parsed);
      setPreviewPhoto(parsed.profilePhotoBase64 || "");
    } else {
      axios
        .get(`https://codequestbackend.onrender.com/api/profile?email=${userEmail}`,{
            headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you store it as 'token'
                },
            })
        .then((res) => {
          if (res.data) {
            setProfile(res.data);
            setPreviewPhoto(res.data.profilePhotoBase64 || "");
            localStorage.setItem("profile", JSON.stringify(res.data));
          }
        })
        .catch((err) => console.error("Error fetching profile:", err));
    }
  }, [userEmail]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedProfile = { ...profile, profilePhotoBase64: reader.result };
      setProfile(updatedProfile);
      setPreviewPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const toggleEdit = () => {
    if (editing) {
      axios
        .post("https://codequestbackend.onrender.com/api/profile", profile,{
             headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you store it as 'token'
                },
            })
        .then((res) => {
          setProfile(res.data);
          setPreviewPhoto(res.data.profilePhotoBase64 || "");
          localStorage.setItem("profile", JSON.stringify(res.data));
          setEditing(false);
          alert("Profile updated successfully!");
        })
        .catch((err) => {
          console.error("Failed to update profile", err);
          alert("Failed to save profile.");
        });
    } else {
      setEditing(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
      <h2 className="text-4xl font-bold text-indigo-600 mb-6 text-center">
        Profile Details
      </h2>

      <div className="flex flex-col md:flex-row gap-10 items-start">
        {/* Profile Photo Section */}
        <div className="flex flex-col items-center">
          <div className="w-40 h-40 rounded-full border-4 border-indigo-600 shadow-md overflow-hidden relative group">
            {previewPhoto ? (
              <img
                src={previewPhoto}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                No Photo
              </div>
            )}
          </div>

          {editing && (
            <label className="mt-4 flex items-center gap-2 text-sm text-indigo-600 cursor-pointer">
              <PhotographIcon className="h-5 w-5" />
              <span>Upload Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Form Section */}
        <div className="flex-grow w-full">
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {/* Input Fields */}
            {[
              {
                label: "Name",
                name: "name",
                type: "text",
                icon: <UserIcon className="h-5 w-5 text-gray-400" />,
              },
              {
                label: "Email",
                name: "email",
                type: "email",
                icon: <MailIcon className="h-5 w-5 text-gray-400" />,
              },
              {
                label: "Date of Birth",
                name: "dob",
                type: "date",
                icon: <CalendarIcon className="h-5 w-5 text-gray-400" />,
              },
              {
                label: "City",
                name: "city",
                type: "text",
                icon: <LocationMarkerIcon className="h-5 w-5 text-gray-400" />,
              },
              {
                label: "LinkedIn URL",
                name: "linkedin",
                type: "url",
                icon: <LinkIcon className="h-5 w-5 text-gray-400" />,
              },
              {
                label: "GitHub URL",
                name: "github",
                type: "url",
                icon: <LinkIcon className="h-5 w-5 text-gray-400" />,
              },
            ].map(({ label, name, type, icon }) => (
              <div key={name}>
                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                  {label}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    {icon}
                  </span>
                  <input
                    type={type}
                    name={name}
                    value={profile[name]}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className={`w-full pl-10 pr-3 py-2 rounded-md border focus:outline-none ${
                      editing
                        ? "border-indigo-500 bg-white dark:bg-gray-800"
                        : "bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                    }`}
                  />
                </div>
              </div>
            ))}

            {/* Gender */}
            <div>
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                Gender
              </label>
              <select
                name="gender"
                value={profile.gender}
                onChange={handleInputChange}
                disabled={!editing}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
                  editing
                    ? "border-indigo-500 bg-white dark:bg-gray-800"
                    : "bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                }`}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </form>

          {/* Edit / Save Button */}
          {userEmail && (
            <button
              onClick={toggleEdit}
              className="mt-6 flex items-center justify-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow transition"
            >
              {editing ? (
                <>
                  <SaveIcon className="h-5 w-5" /> Save Changes
                </>
              ) : (
                <>
                  <PencilIcon className="h-5 w-5" /> Edit Profile
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
