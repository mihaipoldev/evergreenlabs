"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Camera, Crown, Save, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// FormField component for consistent form styling
function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

export function AccountSettings() {
  const { toast } = useToast();
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
    phone: "",
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
        phone: authUser?.user_metadata?.phone || "",
      });
      setLoading(false);
    };

    getUser();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    
    // Update profile
    const { error: profileError } = await supabase.auth.updateUser({
      data: { 
        full_name: formData.name,
        phone: formData.phone,
      },
    });
    
    setSaving(false);
    
    if (profileError) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating profile:", profileError);
    } else {
      setUser((prev) => (prev ? { ...prev, name: formData.name } : null));
      toast({
        title: "Success",
        description: "Account settings have been saved.",
      });
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password: passwordData.newPassword,
    });
    setSaving(false);
    if (error) {
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating password:", error);
    } else {
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast({
        title: "Success",
        description: "Password has been updated.",
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
      <Card className="relative overflow-hidden shadow-lg border-0 rounded-3xl">
        <div
          className="absolute top-12 right-12 w-1.5 h-1.5 bg-primary/30 rounded-full blur-sm animate-pulse"
          style={{ animationDelay: "300ms" }}
        />

        <CardHeader className="relative">
          <CardTitle className="text-2xl flex items-center gap-2">
            <User className="h-6 w-6 text-primary" />
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 relative">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            <div className="relative flex-shrink-0">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.avatar_url || ""} alt={user?.name || "User"} />
                <AvatarFallback className="text-lg bg-muted">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                size="icon"
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                onClick={() => toast({
                  title: "Coming soon",
                  description: "Avatar upload will be available soon",
                })}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 space-y-4 w-full">
              <FormField label="Display Name">
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your display name"
                  className="shadow-sm"
                />
              </FormField>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <Badge variant="destructive" className="gap-1">
                  <Crown className="h-3 w-3" />
                  User
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Your current role in the organization
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Email">
              <Input
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your.email@example.com"
                disabled
                className="bg-muted shadow-sm"
                autoComplete="email"
              />
            </FormField>

            <FormField label="Phone">
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1234567890"
                className="shadow-sm"
                autoComplete="off"
                type="tel"
              />
            </FormField>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Change Password</h3>
            <FormField label="Current Password">
              <Input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                }
                placeholder="Enter current password"
                className="shadow-sm"
                autoComplete="off"
              />
            </FormField>

            <FormField label="New Password">
              <Input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
                placeholder="Enter new password"
                className="shadow-sm"
                autoComplete="new-password"
              />
            </FormField>

            <FormField label="Confirm New Password">
              <Input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
                placeholder="Confirm new password"
                className="shadow-sm"
                autoComplete="new-password"
              />
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* Save Changes Button - Outside Card */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg" className="gap-2 w-full sm:w-auto shadow-sm">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
