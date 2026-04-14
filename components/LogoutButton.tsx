"use client";

import { logoutAction } from "@/app/actions/auth";

export default function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button className="btn" type="submit" style={{ width: "100%" }}>
        Logout
      </button>
    </form>
  );
}