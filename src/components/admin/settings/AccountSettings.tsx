"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCamera } from "@fortawesome/free-solid-svg-icons";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function AccountSettings() {
  const [user, setUser] = useState<{
    email: string | null;
    name: string | null;
    avatar_url: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      setUser({
        email: authUser?.email || null,
        name: authUser?.user_metadata?.full_name || authUser?.email?.split("@")[0] || null,
        avatar_url: authUser?.user_metadata?.avatar_url || null,
      });
      setFormData({
        name: authUser?.user_metadata?.full_name || authUser?.email?.split("@")[0] || "",
        email: authUser?.email || "",
      });
      setLoading(false);
    };

    getUser();
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      data: { full_name: formData.name },
    });
    setSaving(false);
    if (error) {
      console.error("Error updating profile:", error);
    } else {
      setUser((prev) => (prev ? { ...prev, name: formData.name } : null));
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match");
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password: passwordData.newPassword,
    });
    setSaving(false);
    if (error) {
      console.error("Error updating password:", error);
    } else {
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  const getUserInitials = () => {
    if (!user?.name && !user?.email) return "U";
    const name = user.name || user.email || "";
    const parts = name.split(" ");
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name[0]?.toUpperCase() || "U";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="h-64 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card className="relative overflow-hidden shadow-lg">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-transparent pointer-events-none" />
        {/* Sparkles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="sparkle" style={{ top: "15%", left: "5%", animationDelay: "0s" }} />
          <div className="sparkle" style={{ top: "60%", left: "10%", animationDelay: "3s" }} />
          <div className="sparkle" style={{ top: "35%", right: "8%", animationDelay: "6s" }} />
        </div>

        <CardHeader>
          <CardTitle className="relative">Profile Information</CardTitle>
          <CardDescription className="relative">
            Update your account profile information and avatar.
          </CardDescription>
        </CardHeader>
        <CardContent className="relative space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.avatar_url || ""} alt={user?.name || "User"} />
              <AvatarFallback className="text-lg">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm" className="w-fit">
                <FontAwesomeIcon icon={faCamera} className="h-4 w-4" />
                <span>Change Avatar</span>
              </Button>
              <p className="text-sm text-muted-foreground">
                JPG, GIF or PNG. Max size of 2MB.
              </p>
            </div>
          </div>

          <Separator />

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed. Contact support if you need to update it.
              </p>
            </div>
          </div>

          <Button onClick={handleSaveProfile} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      {/* Password Change */}
      <Card className="relative overflow-hidden shadow-lg">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-transparent pointer-events-none" />
        {/* Sparkles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="sparkle" style={{ top: "20%", left: "7%", animationDelay: "2s" }} />
          <div className="sparkle" style={{ top: "70%", right: "10%", animationDelay: "5s" }} />
        </div>

        <CardHeader>
          <CardTitle className="relative">Change Password</CardTitle>
          <CardDescription className="relative">
            Update your password to keep your account secure.
          </CardDescription>
        </CardHeader>
        <CardContent className="relative space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, currentPassword: e.target.value })
              }
              placeholder="Enter current password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, newPassword: e.target.value })
              }
              placeholder="Enter new password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, confirmPassword: e.target.value })
              }
              placeholder="Confirm new password"
            />
          </div>
          <Button onClick={handleChangePassword} disabled={saving} variant="outline">
            {saving ? "Updating..." : "Update Password"}
          </Button>
        </CardContent>
      </Card>

      {/* Account Deletion */}
      <Card className="relative overflow-hidden border-destructive/50 shadow-lg">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-destructive/[0.02] via-transparent to-transparent pointer-events-none" />

        <CardHeader>
          <CardTitle className="relative text-destructive">Delete Account</CardTitle>
          <CardDescription className="relative">
            Permanently delete your account and all associated data. This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <Button variant="destructive" disabled>
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
