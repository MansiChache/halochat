
// BottomBar.jsx
"use client";

import { Logout } from "@mui/icons-material";
import { account } from "@/lib/appwrite";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

const BottomBar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      router.push('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div className="bottom-bar">
      {/* Similar to MongoDB version */}
      <Logout
        sx={{ color: "#737373", cursor: "pointer" }}
        onClick={handleLogout}
      />
    </div>
  );
};

export default BottomBar;