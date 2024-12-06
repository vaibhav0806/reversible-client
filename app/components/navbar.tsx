"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import { Address, Avatar, Identity, Name } from '@coinbase/onchainkit/identity';
import {
  GoogleLogin,
  GoogleOAuthProvider,
  googleLogout,
} from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import { Badge, LogOutIcon } from "lucide-react";

interface GoogleUserData {
  email: string;
  name: string;
  picture: string;
  sub: string;
}

export function Navbar() {
  const [userData, setUserData] = useState<GoogleUserData | null>(null);

  // Load user data from local storage on component mount
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
      }
    }
  }, []);

  const handleGoogleLogin = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      try {
        const decodedCredential = jwtDecode<GoogleUserData>(credentialResponse.credential);

        // Store user data in local storage
        localStorage.setItem('userData', JSON.stringify(decodedCredential));

        setUserData(decodedCredential);
        console.log("User Details:", decodedCredential);
      } catch (error) {
        console.error("Error decoding Google credential:", error);
      }
    }
  };

  const handleLogout = () => {
    // Remove user data from local storage
    localStorage.removeItem('userData');

    setUserData(null);
    googleLogout();
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gradient-to-r from-emerald-400 to-green-500 text-white shadow-md">
      <div className="flex items-center space-x-4 hover:text-bl">
        <a href="/" style={{ textDecoration: "no-underline" }}>
          <h1 className="text-xl font-bold">Reversible POC</h1>
        </a>
        <Link href="/dao">
          <Button variant="ghost" className="text-white hover:text-black">
            DAO
          </Button>
        </Link>
        <Link href="/transfer">
          <Button variant="ghost" className="text-white hover:text-black">
            Transfer
          </Button>
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        {userData ? (
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <Identity
                address="0x7f8B35D47AaCf62ed934327AA0A42Eb6C08C2E67"
                className="py-2 rounded-lg"
              >
                <Avatar />
                {/* <Name>
                  <Badge />
                </Name> */}
                <Address className="font-bold"/>
              </Identity>
              <button
                onClick={handleLogout}
                className="hover:shadow-xl hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg"
              >
                <LogOutIcon />
              </button>
            </div>
          </div>
        ) : (
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={(error: any) => {
              console.log("Login Failed", error);
            }}
            useOneTap
            promptMomentNotification={(notification) => console.log("Prompt moment notification:", notification)}
          />
        )}
      </div>
    </nav>
  );
}