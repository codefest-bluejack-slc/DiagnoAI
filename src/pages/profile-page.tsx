import { useEffect, useState } from "react";
import useMouseTracking from "../hooks/use-mouse-tracking";
import Navbar from "../components/common/navbar";
import { Camera, Plus, Save, User as UserIcon, X, LogOut } from "lucide-react";
import { User } from "../declarations/user/user.did";
import { useAuth } from "../hooks/use-auth";
import { deserializeImage, serializeImage } from "../utils/image-utils";
import { useService } from "../hooks/use-service";
import { useMutation } from "../hooks/use-mutation";
import { Principal } from "@dfinity/principal";

export default function ProfilePage() {
  const mousePosition = useMouseTracking();
  const { me, logout } = useAuth();
  const { userService } = useService();
  const [particles] = useState(() =>
      Array.from({ length: 50 }, (_, i) => ({
          id: i,
          left: Math.random() * 100,
          top: Math.random() * 100,
          delay: Math.random() * 3,
          duration: 3 + Math.random() * 4,
          size: 0.2 + Math.random() * 0.3,
      })),
  );
  
  const [profileData, setProfileData] = useState<User>(me || {
    id: Principal.anonymous(),
    bio: "",
    email: "",
    name: "",
    profilePicture: []
  } as User);

  const profileMutation = useMutation({
    mutationFn: () => userService.updateUser(profileData),
    onSuccess: (data) => {
      console.log("Profile updated successfully:", data);
    },
    onError: (error) => {
      console.error("Failed to update profile:", error);
    }
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const image = await serializeImage(file);
      setProfileData((prev) => ({
        ...prev,
        profilePicture: image,
      }));
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  useEffect(() => {
    if (me) {
      setProfileData(me);
    }
  }, [me]);
  
  return (
      <div className="diagnostic-container">
        <div className="background-orbs">
          <div className="background-orb-1"></div>
          <div className="background-orb-2"></div>
          <div className="background-orb-3"></div>
        </div>
      
        <div
          className="mouse-glow"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, var(--primary-purple-200) 0%, transparent 50%)`,
          }}
        ></div>
      
        <div className="floating-particles">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="particle"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
                width: `${particle.size}rem`,
                height: `${particle.size}rem`,
              }}
            />
          ))}
        </div>
    
        <Navbar />
      
        <main className="main-content">
        <div className="max-w-7xl mx-auto px-6">
          <div className="symptom-form-card animate-in slide-in-from-top-5 fade-in duration-500">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-white flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-full animate-in zoom-in duration-300 delay-150">
                  <UserIcon className="text-purple-300" size={20} />
                </div>
                <span className="animate-in slide-in-from-left-3 duration-300 delay-200">Edit Profile</span>
              </h3>
            </div>

            <div className="space-y-6 animate-in slide-in-from-bottom-3 duration-400 delay-300">
              <div className="flex flex-col items-center mb-8">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center overflow-hidden backdrop-blur-sm">
                    {profileData.profilePicture?.length > 0 ? (
                      <img
                        src={deserializeImage(profileData.profilePicture) || "/placeholder.svg"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="text-purple-300" size={48} />
                    )}
                  </div>
                  <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                    <Camera className="text-white" size={24} />
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                <p className="text-purple-200 text-sm mt-2">Click to upload profile picture</p>
              </div>

              <div>
                <label className="block text-purple-200 text-sm font-medium mb-3">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-300/50 backdrop-blur-sm transition-all duration-300 focus:scale-[1.01]"
                />
              </div>

              <div>
                <label className="block text-purple-200 text-sm font-medium mb-3">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-300/50 backdrop-blur-sm transition-all duration-300 focus:scale-[1.01]"
                />
              </div>

              <div>
                <label className="block text-purple-200 text-sm font-medium mb-3">Bio</label>
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself..."
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-300/50 backdrop-blur-sm resize-none text-lg leading-relaxed transition-all duration-300 focus:scale-[1.01]"
                  rows={4}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    console.log("Profile saved:", profileData)
                    profileMutation.mutate();
                  }}
                  className="flex-1 py-4 px-6 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-purple-400/50 shadow-lg hover:shadow-purple-500/25"
                >
                  <Save className="text-white transition-transform duration-300" size={20} />
                  <span>Save Profile</span>
                </button>
                <button
                  onClick={() => {
                    logout.mutate();
                  }}
                  className="py-4 px-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-red-400/50 shadow-lg hover:shadow-red-500/25"
                >
                  <LogOut className="text-white transition-transform duration-300" size={20} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      </div>
  );
}
  