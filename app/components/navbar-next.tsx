"use client";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { Address, Avatar, Identity, Name } from "@coinbase/onchainkit/identity";
import { Label } from "@/components/ui/label";
import { Button as ButtonNextUI } from "@nextui-org/button";
import { useToast } from "@/hooks/use-toast";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import {
  Badge,
  CircleDollarSign,
  HelpCircle,
  LogOutIcon,
  MoveUpRight,
  MoveUpRightIcon,
  Loader2,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";

interface GoogleUserData {
  email: string;
  name: string;
  picture: string;
  sub: string;
}

export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export function NavbarN() {
  const router = useRouter();
  const { toast } = useToast();
  const pathname = usePathname();

  const [walletData, setWalletData] = useState<any>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [rbBalance, setRbBalance] = useState<number>(0);
  const [nrbBalance, setNrbBalance] = useState<number>(0);
  const [transferError, setTransferError] = useState<string | null>(null);
  const [isTransferring, setIsTransferring] = useState<boolean>(false);

  const [userData, setUserData] = useState<GoogleUserData | null>(null);

  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");

  const handleGoogleLogin = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      try {
        const decodedCredential = jwtDecode<GoogleUserData>(
          credentialResponse.credential
        );

        // Store user data in local storage
        localStorage.setItem("userData", JSON.stringify(decodedCredential));

        // Set user data to state (assuming setUserData is defined)
        setUserData(decodedCredential);

        console.log("User Details:", decodedCredential);

        // Call the API
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/create-wallet`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ email: decodedCredential.email }),
        });

        if (!response.ok) {
          throw new Error();
        }

        const responseData = await response.json();

        const walletData = {
          address_id: responseData.response.data[0].wallet_address,
          wallet_id: responseData.response.data[0].wallet_id,
          network_id: responseData.response.data[0].network_id,
        };

        setWalletData(walletData);
        localStorage.setItem("walletData", JSON.stringify(walletData));
        setWalletAddress(walletData.address_id);
        console.log("Wallet Data", walletData);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const fetchWalletBalances = async (walletAddress: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users/get-user-balance/${walletAddress}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const responseData = await response.json();
      if (responseData.status === "success" && responseData.data.length > 0) {
        setRbBalance(responseData.data[0].rb_value);
        setNrbBalance(responseData.data[0].nrb_value);
      }
    } catch (error) {
      console.error("Error fetching wallet balances:", error);
    }
  };

  const handleTransfer = async () => {
    // Convert amount to number for comparison
    const transferAmount = parseFloat(amount);

    // Reset previous error
    setTransferError(null);
    setIsTransferring(true);

    if(walletAddress == recipientAddress){
      setTransferError("Recipient address is the same as Your Address");
      setIsTransferring(false);
      return;
    }

    // Validation checks
    if (!recipientAddress) {
      setTransferError("Recipient address is required.");
      setIsTransferring(false);
      return;
    }

    if (isNaN(transferAmount) || transferAmount <= 0) {
      setTransferError("Please enter a valid amount.");
      setIsTransferring(false);
      return;
    }

    if (transferAmount > nrbBalance) {
      setTransferError(
        `Insufficient balance. Maximum transfer is ${nrbBalance} NR.`
      );
      setIsTransferring(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/transactions/transfer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify({
            wallet: walletData,
            transfer: {
              to_wallet: recipientAddress,
              amount: amount,
            },
          }),
        }
      );
      
      console.log(response);
      
      if (response.status == 200) {
        toast({
          title: "Transfer Completed",
          description: `Transfer of ${amount} transferred to ${recipientAddress}`,
        });
        
        // Refresh wallet balances after successful transfer
        await fetchWalletBalances(walletAddress!);
        
        // Reset form
        setRecipientAddress("");
        setAmount("");

        // Navigate to profile page
        router.push('/profile');
        
      } else {
        const errorData = await response.json();
        setTransferError(errorData.message || "Transfer failed");
      }
    } catch (error) {
      console.error("Transfer error:", error);
      setTransferError("An error occurred during transfer");
    } finally {
      setIsTransferring(false);
    }
  };

  useEffect(() => {
    const storedWalletData = localStorage.getItem("walletData");
    const storedUserData = localStorage.getItem("userData");

    if (storedWalletData) {
      try {
        const parsedWalletData = JSON.parse(storedWalletData);
        setWalletData(parsedWalletData);
        setWalletAddress(parsedWalletData.address_id);
        fetchWalletBalances(parsedWalletData.address_id);
      } catch (error) {
        console.error("Error parsing stored wallet data:", error);
      }
    }

    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("walletData");
    setUserData(null);
    googleLogout();
  };

  return (
    <Navbar isBordered className="py-1">
      <NavbarBrand>
        <AcmeLogo />
        <a href="/">
          <p className="font-bold text-inherit tracking-wider">REVERS</p>
        </a>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive={pathname === "/dao"}>
          <Link
            href="/dao"
            color={pathname === "/dao" ? "success" : "foreground"}
            className={pathname === "/dao" ? "font-extrabold" : ""}
          >
            DAO
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname === "/profile"}>
          <Link
            href="/profile"
            color={pathname === "/profile" ? "success" : "foreground"}
            className={pathname === "/profile" ? "font-bold" : ""}
          >
            Profile
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        {userData ? (
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <Drawer>
                <DrawerTrigger>
                  <Identity address={walletAddress} className="py-2 rounded-lg">
                    <Avatar />
                    <Name className="font-bold" />
                  </Identity>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                      <DrawerTitle>Wallet Details</DrawerTitle>
                      <DrawerDescription>
                        Your personalized wallet summary.
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 flex flex-col gap-6">
                      <div className="flex gap-6 w-full">
                        <Card className="flex-1 w-1/2">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-base font-medium">
                              NR Balance
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              {nrbBalance} NR
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="flex-1 w-1/2">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-base font-medium">
                              R Balance
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              {rbBalance} R
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-center text-lg font-semibold">
                            Send Funds
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label
                                htmlFor="recipient"
                                className="text-sm font-medium text-gray-500"
                              >
                                Recipient Wallet Address
                              </Label>
                              <Input
                                id="recipient"
                                placeholder="Enter wallet address"
                                value={recipientAddress}
                                onChange={(e) =>
                                  setRecipientAddress(e.target.value)
                                }
                                disabled={isTransferring}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label
                                htmlFor="amount"
                                className="text-sm font-medium text-gray-500"
                              >
                                Amount
                              </Label>
                              <div className="relative">
                                <Input
                                  id="amount"
                                  type="number"
                                  placeholder="Enter amount"
                                  value={amount}
                                  onChange={(e) => {
                                    setAmount(e.target.value);
                                    // Clear any previous error when user starts typing
                                    setTransferError(null);
                                  }}
                                  className="pr-12"
                                  disabled={isTransferring}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                  <CircleDollarSign className="text-gray-500" />
                                </div>
                              </div>
                            </div>
                            {transferError && (
                              <div className="text-red-500 text-sm">
                                {transferError}
                              </div>
                            )}
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">
                                Balance:{" "}
                                <span className="font-semibold">
                                  {nrbBalance}
                                </span>
                              </span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <HelpCircle className="w-5 h-5 text-gray-500" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">
                                      Only non-reversible balance is
                                      transferrable.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <Button
                              onClick={handleTransfer}
                              className="w-full bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 transition-all duration-300 text-white font-bold py-3 rounded-lg"
                              disabled={!recipientAddress || !amount || isTransferring}
                            >
                              {isTransferring ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Transferring...
                                </>
                              ) : (
                                "Transfer"
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <DrawerFooter>
                      <DrawerClose>
                        <Button variant="outline">Close</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </div>
                </DrawerContent>
              </Drawer>
              <button
                onClick={handleLogout}
                className="font-bold py-2 px-4 rounded-lg"
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
            promptMomentNotification={(notification) =>
              console.log("Prompt moment notification:", notification)
            }
          />
        )}
      </NavbarContent>
    </Navbar>
  );
}
