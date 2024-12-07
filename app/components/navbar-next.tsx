'use client';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { Address, Avatar, Identity, Name } from '@coinbase/onchainkit/identity';
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
import {
    GoogleLogin,
    googleLogout,
} from "@react-oauth/google";
import { Badge, CircleDollarSign, HelpCircle, LogOutIcon, MoveUpRight, MoveUpRightIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
    const { toast } = useToast()
    const pathname = usePathname();

    console.log(pathname)

    const [userData, setUserData] = useState<GoogleUserData | null>(null);

    const [recipientAddress, setRecipientAddress] = useState('');
    const [amount, setAmount] = useState('');

    // Mock balance (in a real app, this would come from wallet connection)
    const tokenBalance = 1234.56;
    const tokenSymbol = 'ETH';

    const handleTransfer = () => {
        // Implement transfer logic here
        toast({
            title: "Transfer Initiated",
            description: "Friday, February 10, 2023 at 5:57 PM",
          })
        console.log('Transfer initiated', { recipientAddress, amount });
    };

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
        <Navbar isBordered className="py-1">
            <NavbarBrand>
                <AcmeLogo />
                <a href="/">
                    <p className="font-bold text-inherit tracking-wider">REVERS</p>
                </a>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem isActive={pathname === '/dao'}>
                    <Link 
                        href="/dao" 
                        color={pathname === '/dao' ? "success" : "foreground"}
                        className={pathname === '/dao' ? "font-extrabold" : ""}
                    >
                            DAO
                    </Link>
                </NavbarItem>
                <NavbarItem isActive={pathname === '/profile'}>
                    <Link 
                        href="/profile" 
                        color={pathname === '/profile' ? "success" : "foreground"}
                        className={pathname === '/profile' ? "font-bold" : ""}
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
                                    <Identity
                                        address="0x7f8B35D47AaCf62ed934327AA0A42Eb6C08C2E67"
                                        className="py-2 rounded-lg"
                                    >
                                        <Avatar />
                                        <Name className="font-bold" />
                                    </Identity>
                                </DrawerTrigger>
                                <DrawerContent>
                                    <div className="mx-auto w-full max-w-sm">
                                        <DrawerHeader>
                                            <DrawerTitle>Wallet Details</DrawerTitle>
                                            <DrawerDescription>Your personalized wallet summary.</DrawerDescription>
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
                                                        <div className="text-2xl font-bold">1,000 NR</div>
                                                    </CardContent>
                                                </Card>
                                                <Card className="flex-1 w-1/2">
                                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                        <CardTitle className="text-base font-medium">
                                                            R Balance
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="text-2xl font-bold">500 R</div>
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
                                                            <Label htmlFor="recipient" className="text-sm font-medium text-gray-500">
                                                                Recipient Wallet Address
                                                            </Label>
                                                            <Input
                                                                id="recipient"
                                                                placeholder="Enter wallet address"
                                                                value={recipientAddress}
                                                                onChange={(e) => setRecipientAddress(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="amount" className="text-sm font-medium text-gray-500">
                                                                Amount
                                                            </Label>
                                                            <div className="relative">
                                                                <Input
                                                                    id="amount"
                                                                    type="number"
                                                                    placeholder="Enter amount"
                                                                    value={amount}
                                                                    onChange={(e) => setAmount(e.target.value)}
                                                                    className="pr-12"
                                                                />
                                                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                                    <CircleDollarSign className="text-gray-500" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm text-gray-600">
                                                                Balance: <span className="font-semibold">1,000 NR</span>
                                                            </span>
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger>
                                                                        <HelpCircle className="w-5 h-5 text-gray-500" />
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p className="text-xs">
                                                                            Only non-reversible balance is transferrable.
                                                                        </p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        </div>
                                                        <Button
                                                            onClick={handleTransfer}
                                                            className="w-full bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 transition-all duration-300 text-white font-bold py-3 rounded-lg"
                                                            disabled={!recipientAddress || !amount}
                                                        >
                                                            Transfer
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                        <DrawerFooter>
                                            <Button>
                                                <a href="/contract-link" className="flex items-center gap-2">
                                                    View Smart Contract <MoveUpRight />
                                                </a>
                                            </Button>
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
                        promptMomentNotification={(notification) => console.log("Prompt moment notification:", notification)}
                    />
                )}
            </NavbarContent>
        </Navbar>
    );
}