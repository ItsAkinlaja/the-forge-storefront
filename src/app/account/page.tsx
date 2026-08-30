"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { updateProfile, changePassword, getOrders } from "@/lib/auth/service";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type Tab = "profile" | "orders" | "security";

interface Order {
  id: number | string;
  number?: string;
  date_created?: string;
  status?: string;
  total?: string;
  currency_symbol?: string;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

function StatusBadge({ status }: { status?: string }) {
  const s = (status || "pending").toLowerCase();
  const classes: Record<string, string> = {
    pending:
      "border border-[#C6A15B] text-[#C6A15B] bg-transparent",
    processing:
      "bg-[#050505] dark:bg-[#FFFFFF] text-white dark:text-[#050505]",
    completed:
      "bg-white dark:bg-[#050505] text-[#050505] dark:text-white border border-[#050505] dark:border-[#FFFFFF]",
    cancelled:
      "text-[#888888] dark:text-[#555555] border border-[#E5E5E5] dark:border-[#262626]",
  };
  const cls = classes[s] ?? classes.pending;
  return (
    <span
      className={`inline-block text-[9px] tracking-[0.2em] uppercase font-sans font-semibold px-2.5 py-1 ${cls}`}
    >
      {status || "Pending"}
    </span>
  );
}

export default function AccountPage() {
  const { user, isLoading, isAuthenticated, logout, refreshUser } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  // Profile tab state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Orders tab state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  // Security tab state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [securitySaving, setSecuritySaving] = useState(false);
  const [securityMsg, setSecurityMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Populate profile form when user loads
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  // Load orders when tab switches
  useEffect(() => {
    if (activeTab !== "orders") return;
    setOrdersLoading(true);
    setOrdersError("");
    getOrders()
      .then((data) => {
        setOrders((data as Order[]) || []);
      })
      .catch((err: unknown) => {
        setOrdersError(
          err instanceof Error ? err.message : "Failed to load orders."
        );
      })
      .finally(() => setOrdersLoading(false));
  }, [activeTab]);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileMsg(null);
    setProfileSaving(true);
    try {
      await updateProfile({ firstName, lastName, phone: phone || undefined });
      await refreshUser();
      setProfileMsg({ type: "success", text: "Profile updated successfully." });
    } catch (err: unknown) {
      setProfileMsg({
        type: "error",
        text: err instanceof Error ? err.message : "Update failed.",
      });
    } finally {
      setProfileSaving(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setSecurityMsg(null);
    if (newPassword !== confirmNewPassword) {
      setSecurityMsg({ type: "error", text: "New passwords do not match." });
      return;
    }
    if (newPassword.length < 8) {
      setSecurityMsg({ type: "error", text: "New password must be at least 8 characters." });
      return;
    }
    setSecuritySaving(true);
    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setSecurityMsg({ type: "success", text: "Password changed successfully." });
    } catch (err: unknown) {
      setSecurityMsg({
        type: "error",
        text: err instanceof Error ? err.message : "Password change failed.",
      });
    } finally {
      setSecuritySaving(false);
    }
  }

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  // Loading state
  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-[#050505]">
        <Navbar />
        <main className="flex-1">
          <Container className="py-16 space-y-6">
            <div className="h-4 bg-[#F0F0F0] dark:bg-[#1A1A1A] w-48" />
            <div className="h-3 bg-[#F0F0F0] dark:bg-[#1A1A1A] w-72" />
            <div className="h-px bg-[#EBEBEB] dark:bg-[#181818] my-8" />
            <div className="flex gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-3 bg-[#F0F0F0] dark:bg-[#1A1A1A] w-20" />
              ))}
            </div>
            <div className="space-y-4 pt-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-[#F0F0F0] dark:bg-[#1A1A1A]" />
              ))}
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "profile", label: "Profile" },
    { key: "orders", label: "Orders" },
    { key: "security", label: "Security" },
  ];

  const memberSince = user.createdAt ? formatDate(user.createdAt) : "—";

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#050505] text-[#050505] dark:text-white">
      <Navbar />
      <main className="flex-1">
        {/* Header band */}
        <div className="border-b border-[#EBEBEB] dark:border-[#181818] bg-[#FAFAFA] dark:bg-[#0A0A0A]">
          <Container className="py-10 sm:py-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-[10px] tracking-[0.35em] uppercase text-[#C6A15B] font-sans mb-2">
                Atelier Account
              </p>
              <h1 className="font-editorial text-3xl sm:text-4xl text-[#050505] dark:text-white font-light">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-xs text-[#888888] dark:text-[#555555] font-sans mt-1.5 tracking-wide">
                {user.email} &nbsp;·&nbsp; Member since {memberSince}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="text-[11px] tracking-[0.2em] uppercase text-[#888888] dark:text-[#555555] hover:text-[#050505] dark:hover:text-white transition-colors font-sans self-start sm:self-auto"
            >
              Sign Out
            </button>
          </Container>
        </div>

        <Container className="py-12">
          {/* Tabs */}
          <div className="flex gap-0 border-b border-[#EBEBEB] dark:border-[#181818] mb-10">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-3 text-[11px] tracking-[0.2em] uppercase font-sans font-semibold transition-colors border-b-[2px] -mb-px ${
                  activeTab === tab.key
                    ? "border-[#050505] dark:border-white text-[#050505] dark:text-white"
                    : "border-transparent text-[#888888] dark:text-[#555555] hover:text-[#050505] dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="max-w-md">
              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    id="acc-firstName"
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                  <Input
                    id="acc-lastName"
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
                <Input
                  id="acc-email"
                  type="email"
                  label="Email Address"
                  value={user.email}
                  readOnly
                  className="opacity-50 cursor-not-allowed"
                />
                <Input
                  id="acc-phone"
                  type="tel"
                  label="Phone Number"
                  placeholder="+1 000 000 0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                {profileMsg && (
                  <p
                    className={`text-[12px] font-sans px-4 py-3 border ${
                      profileMsg.type === "success"
                        ? "text-[#C6A15B] border-[#C6A15B]/30 bg-[#C6A15B]/5"
                        : "text-red-500 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20"
                    }`}
                  >
                    {profileMsg.text}
                  </p>
                )}
                <Button
                  type="submit"
                  variant="primary"
                  disabled={profileSaving}
                  className="mt-2"
                >
                  {profileSaving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div>
              {ordersLoading && (
                <div className="space-y-4 max-w-2xl">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-16 bg-[#F0F0F0] dark:bg-[#1A1A1A] animate-pulse"
                    />
                  ))}
                </div>
              )}

              {ordersError && (
                <p className="text-[12px] text-red-500 font-sans">{ordersError}</p>
              )}

              {!ordersLoading && !ordersError && orders.length === 0 && (
                <div className="py-16 max-w-md">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[#C6A15B] font-sans mb-4">
                    Order History
                  </p>
                  <p className="font-editorial text-2xl text-[#050505] dark:text-white font-light mb-3">
                    No orders yet.
                  </p>
                  <p className="text-sm text-[#555555] dark:text-[#888888] font-sans leading-relaxed">
                    Your bespoke journey begins with your first selection.
                  </p>
                  <div className="mt-8">
                    <Button variant="outline" onClick={() => router.push("/the-men-forge")}>
                      Explore Collections
                    </Button>
                  </div>
                </div>
              )}

              {!ordersLoading && orders.length > 0 && (
                <div className="max-w-2xl space-y-0 border border-[#EBEBEB] dark:border-[#181818]">
                  {/* Table header */}
                  <div className="hidden sm:grid grid-cols-4 gap-4 px-6 py-3 bg-[#FAFAFA] dark:bg-[#0A0A0A] border-b border-[#EBEBEB] dark:border-[#181818]">
                    {["Order", "Date", "Status", "Total"].map((h) => (
                      <span
                        key={h}
                        className="text-[9px] tracking-[0.25em] uppercase text-[#888888] dark:text-[#555555] font-sans font-semibold"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-6 py-4 border-b border-[#EBEBEB] dark:border-[#181818] last:border-b-0 items-center"
                    >
                      <span className="text-sm font-sans text-[#050505] dark:text-white font-semibold">
                        #{order.number || order.id}
                      </span>
                      <span className="text-xs font-sans text-[#888888] dark:text-[#555555]">
                        {formatDate(order.date_created)}
                      </span>
                      <StatusBadge status={order.status} />
                      <span className="text-sm font-sans text-[#050505] dark:text-white">
                        {order.currency_symbol || "$"}
                        {order.total || "—"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="max-w-md">
              <form onSubmit={handleChangePassword} className="space-y-5">
                <Input
                  id="currentPassword"
                  type="password"
                  label="Current Password"
                  placeholder="Your current password"
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <Input
                  id="newPassword"
                  type="password"
                  label="New Password"
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <Input
                  id="confirmNewPassword"
                  type="password"
                  label="Confirm New Password"
                  placeholder="Repeat new password"
                  autoComplete="new-password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />
                {securityMsg && (
                  <p
                    className={`text-[12px] font-sans px-4 py-3 border ${
                      securityMsg.type === "success"
                        ? "text-[#C6A15B] border-[#C6A15B]/30 bg-[#C6A15B]/5"
                        : "text-red-500 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20"
                    }`}
                  >
                    {securityMsg.text}
                  </p>
                )}
                <Button
                  type="submit"
                  variant="primary"
                  disabled={securitySaving}
                  className="mt-2"
                >
                  {securitySaving ? "Updating..." : "Change Password"}
                </Button>
              </form>
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </div>
  );
}
