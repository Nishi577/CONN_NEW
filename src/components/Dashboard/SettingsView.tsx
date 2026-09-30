import React, { useState } from 'react';
import { ConnProfile } from '../../types';
import { SAMPLE_PROFILES } from '../../data/mockData';
import {
  Settings,
  Download,
  Upload,
  RotateCcw,
  Shield,
  Key,
  Globe,
  Trash2,
  Check,
  AlertTriangle,
} from 'lucide-react';

interface SettingsViewProps {
  profile: ConnProfile;
  onChangeProfile: (updated: ConnProfile) => void;
  onShowToast: (msg: string) => void;
  onLogout: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  onChangeProfile,
  onShowToast,
  onLogout,
}) => {
  const [isPublic, setIsPublic] = useState(profile.isPublic);
  const [passwordProtected, setPasswordProtected] = useState(profile.isPasswordProtected || false);

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `conn-profile-${profile.username}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onShowToast('Exported profile backup JSON');
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (imported && imported.username && Array.isArray(imported.links)) {
          onChangeProfile(imported);
          onShowToast(`Successfully imported profile @${imported.username}`);
        } else {
          onShowToast('Invalid profile JSON structure');
        }
      } catch (err) {
        onShowToast('Failed to parse JSON file');
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefaults = () => {
    if (confirm('Reset profile to default sample data (Elena Rostova)?')) {
      onChangeProfile(SAMPLE_PROFILES[0]);
      onShowToast('Reset to default sample profile');
    }
  };

  return (
    <div className="space-y-8 font-sans-ui text-[#1C1B18]">
      <div className="pb-4 border-b border-[#E8E4D9]">
        <h2 className="font-serif-display text-2xl font-normal text-[#1C1B18]">Workspace & Account Settings</h2>
        <p className="text-xs text-[#6B665E]">Manage profile visibility, security, and data portability.</p>
      </div>

      {/* VISIBILITY & PRIVACY */}
      <div className="p-6 bg-white border border-[#E8E4D9] rounded-2xl space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#1C1B18]">
          Visibility & Indexing
        </h3>

        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-sm font-medium text-[#1C1B18]">Public Profile Visibility</span>
              <p className="text-xs text-[#6B665E]">
                When disabled, your Conn profile will not be accessible to public visitors.
              </p>
            </div>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => {
                setIsPublic(e.target.checked);
                onChangeProfile({ ...profile, isPublic: e.target.checked });
                onShowToast(e.target.checked ? 'Profile published publicly' : 'Profile hidden from public');
              }}
              className="w-4 h-4 rounded text-[#1C1B18]"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer pt-3 border-t border-[#E8E4D9]">
            <div>
              <span className="text-sm font-medium text-[#1C1B18]">Password Protection Mode</span>
              <p className="text-xs text-[#6B665E]">
                Require a passcode before visitors can view your link collection.
              </p>
            </div>
            <input
              type="checkbox"
              checked={passwordProtected}
              onChange={(e) => {
                setPasswordProtected(e.target.checked);
                onChangeProfile({ ...profile, isPasswordProtected: e.target.checked });
                onShowToast(e.target.checked ? 'Enabled passcode protection' : 'Disabled passcode protection');
              }}
              className="w-4 h-4 rounded text-[#1C1B18]"
            />
          </label>
        </div>
      </div>

      {/* DATA PORTABILITY (EXPORT & IMPORT) */}
      <div className="p-6 bg-white border border-[#E8E4D9] rounded-2xl space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#1C1B18]">
          Data Portability & Backup
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleExportData}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[#E8E4D9] hover:border-[#1C1B18] text-xs font-medium rounded-xl text-[#1C1B18] transition-all"
          >
            <Download className="w-4 h-4" /> Export Backup JSON
          </button>

          <label className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[#E8E4D9] hover:border-[#1C1B18] text-xs font-medium rounded-xl text-[#1C1B18] transition-all cursor-pointer">
            <Upload className="w-4 h-4" /> Import JSON Profile
            <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
          </label>

          <button
            onClick={handleResetDefaults}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[#E8E4D9] hover:border-[#1C1B18] text-xs font-medium rounded-xl text-[#6B665E] hover:text-[#1C1B18] transition-all"
          >
            <RotateCcw className="w-4 h-4" /> Reset Sample Data
          </button>
        </div>
      </div>

      {/* DANGER ZONE */}
      <div className="p-6 border border-red-200 bg-red-50/40 rounded-2xl space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-700">
          <AlertTriangle className="w-4 h-4" /> Danger Zone
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-sm font-medium text-[#1C1B18]">Sign Out of Session</span>
            <p className="text-xs text-[#6B665E]">Ends your active creator session on this device.</p>
          </div>

          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-xl transition-colors shrink-0"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};
