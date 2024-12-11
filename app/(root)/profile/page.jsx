"use client";

import Loader from "@components/Loader";
import { PersonOutline } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { account, databases } from "@/lib/appwrite-config";
import { ID, Query } from "appwrite";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
        
        reset({
          username: currentUser.name,
          profileImage: currentUser.prefs?.profileImage || "",
        });
        
        setLoading(false);
      } catch (error) {
        router.push("/");
      }
    };

    fetchUser();
  }, []);

  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const uploadPhoto = async (event) => {
    const file = event.target.files[0];
    
    if (!file) return;

    try {
      // Use Appwrite Storage to upload the file
      const fileResponse = await account.createOAuth2Session(
        "files",
        file,
        `${ID.unique()}_profile_image`,
        ["image/*"]
      );
      
      // Get the file URL and update form
      const fileUrl = fileResponse.$id; // Adjust based on actual Appwrite storage response
      setValue("profileImage", fileUrl);
      
      toast.success("Profile image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
      console.error(error);
    }
  };

  const updateUser = async (data) => {
    setLoading(true);
    try {
      // Update user preferences
      await account.updatePrefs({
        username: data.username,
        profileImage: data.profileImage
      });

      // Optionally update account name
      await account.updateName(data.username);

      toast.success("Profile updated successfully");
      setLoading(false);
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="profile-page">
      <h1 className="text-heading3-bold">Edit Your Profile</h1>

      <form className="edit-profile" onSubmit={handleSubmit(updateUser)}>
        <div className="input">
          <input
            {...register("username", {
              required: "Username is required",
              validate: (value) => {
                if (value.length < 3) {
                  return "Username must be at least 3 characters";
                }
              },
            })}
            type="text"
            placeholder="Username"
            className="input-field"
          />
          <PersonOutline sx={{ color: "#737373" }} />
        </div>
        {errors.username && (
          <p className="text-red-500">{errors.username.message}</p>
        )}

        <div className="flex items-center justify-between">
          <img
            src={
              watch("profileImage") ||
              user?.prefs?.profileImage ||
              "/assets/person.jpg"
            }
            alt="profile"
            className="w-40 h-40 rounded-full"
          />
          <div>
            <input 
              type="file" 
              accept="image/*"
              onChange={uploadPhoto}
              className="hidden"
              id="profileImageUpload"
            />
            <label 
              htmlFor="profileImageUpload" 
              className="text-body-bold cursor-pointer"
            >
              Upload new photo
            </label>
          </div>
        </div>

        <button className="btn" type="submit">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Profile;