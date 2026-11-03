import { useEffect, useState } from "react";
import NoProfile from "../../assets/no-profile.png"
import { Button } from "../../components/Button";
import Input from "../../components/Input";
import { useAuthStore } from "../../store/useAuthStore";
import { authService } from "../../services/authService";

interface PersonalInformationType {
  profilePicture: File | string | null;
  email: string;
  name: string;
}

const Account = () => {
  const { user } = useAuthStore();
  const [piForm, setPiForm] = useState<PersonalInformationType>({
    profilePicture: null,
    name: "",
    email: ""
  });

  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if(user) {
      setPiForm({
        profilePicture: user.profile_picture || null,
        name: user.name || "",
        email: user.email || ""
      });

      setPreviewUrl(user.profile_picture || NoProfile);
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === "profilePicture" && files && files[0]) {
      const selectedFile = files[0];
      setPiForm((prev) => ({ ...prev, profilePicture: selectedFile }));
      setPreviewUrl(URL.createObjectURL(selectedFile)); // Local preview
      return;
    }

    setPiForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

  }

  return (
    <div className="flex flex-col max-w-3xl gap-8 px-4 py-10 mx-auto">
      <h1 className="text-2xl font-bold text-primary">Account Settings</h1>

      {/* Section 1: Personal Info */}
      <div className="p-6 border border-gray-300 rounded-md shadow-sm bg-bgColor">
        <h2 className="mb-4 text-lg font-semibold">Personal Information</h2>
        
        <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
          <div className="flex flex-col gap-4">
            <div className="block w-40 h-40 mx-auto overflow-hidden border-3 border-emerald-600 rounded-full">
              <img className="object-cover w-full h-full" src={previewUrl} alt="profile picture" />
            </div>
            <Input
              type="file"
              id="profilePicture"
              name="profilePicture"
              label="Profile Picture"
              accept="image/*"
              onChange={handleChange}
              style="cursor-pointer"
            />
          </div>

          <Input
            id="name"
            name="name"
            label="Name"
            type="text"
            value={piForm.name}
            onChange={handleChange}
          />

          <Input
            id="email"
            name="email"
            label="Email"
            type="email"
            value={piForm.email}
            onChange={handleChange}
          />

          <Button
            type="submit"
            className="py-2"
          >
            Save
          </Button>
        </form>
      </div>

      {/* Section 2: Security */}
      <div className="flex items-center justify-between p-6 border border-gray-300 rounded-md shadow-sm bg-bgColor">
        <div>
          <h2 className="text-lg font-semibold">Password</h2>
          <p className="text-sm text-gray-600">Update your password to keep your account secure.</p>
        </div>
        <button 
          type="button"
          className="px-4 py-2 text-sm text-white rounded-md cursor-pointer bg-primary hover:opacity-90"
          // onClick={() => setIsPasswordModalOpen(true)}
        >
          Change Password
        </button>
      </div>
    </div>
  );
};

export default Account
