import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { HiUser, HiAcademicCap, HiCheckBadge } from "react-icons/hi2";
import { useNavigate } from "react-router";
import { useLayout } from "../context/LayoutContext";

const Settings = () => {
  const { user, updateAuthProfile } = useAuth();
  const navigate = useNavigate();
  const { updateLayout } = useLayout();
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    ageGroup: user?.ageGroup || "",
    university: user?.university || ""
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    updateLayout({
      title: "Account Settings",
      subtitle: "Customize your sanctuary experience",
      onBack: () => navigate("/dashboard"),
      actions: null
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await updateAuthProfile(formData);
    if (res.success) {
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    }
    setSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Profile Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-white shadow-sm text-center">
            <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center text-4xl font-black mx-auto mb-4 border border-indigo-100">
              {user?.name?.[0] || user?.email?.[0]?.toUpperCase() || "?"}
            </div>
            <h3 className="text-xl font-black text-slate-900">{user?.name || "Member"}</h3>
            <p className="text-sm font-bold text-slate-400 mb-6">{user?.email || "Guest Account"}</p>
            <div className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 rounded-full inline-flex">
              <HiCheckBadge className="w-4 h-4 text-indigo-600" />
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                {user?.isAnonymous ? "Guest Mode" : "Premium Member"}
              </span>
            </div>
          </div>
        </div>

        {/* Settings Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="bg-white p-10 rounded-[3rem] border border-white shadow-sm space-y-8">
            <div className="space-y-6">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                <HiUser className="text-indigo-600" /> Personal Info
              </h3>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Display Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold"
                />
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-slate-50">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                <HiAcademicCap className="text-teal-600" /> Academic Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Age Group</label>
                  <select 
                    value={formData.ageGroup}
                    onChange={(e) => setFormData({...formData, ageGroup: e.target.value})}
                    className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white outline-none transition-all font-bold appearance-none"
                  >
                    <option value="">Select Age</option>
                    <option value="18-21">18-21</option>
                    <option value="22-25">22-25</option>
                    <option value="26-30">26-30</option>
                    <option value="30+">30+</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">University</label>
                  <input 
                    type="text" 
                    value={formData.university}
                    onChange={(e) => setFormData({...formData, university: e.target.value})}
                    className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white outline-none transition-all font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="pt-8 flex items-center justify-between">
              {message && <span className="text-sm font-bold text-green-500">{message}</span>}
              <button 
                type="submit"
                disabled={saving}
                className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 transition-all ml-auto"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
