'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function Modal() {
  const [tokenAmount, setTokenAmount] = useState("");

  const handleMint = async () => {
    try {
      // Get wallet data from local storage
      const walletData = localStorage.getItem("walletData");
      if (!walletData) {
        throw new Error("Wallet data not found in localStorage");
      }

      const parsedWalletData = JSON.parse(walletData);

      // Prepare API request payload
      const payload = {
        wallet: {
          address_id: parsedWalletData.address_id,
          wallet_id: parsedWalletData.wallet_id,
          network_id: parsedWalletData.network_id,
        },
        request: {
          amount: tokenAmount,
        },
      };

      // Call the API
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/deposit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to mint tokens. Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Mint Response:", responseData);

      // Optionally, show success feedback to the user
      alert("Tokens minted successfully!");
    } catch (error) {
      console.error("Error minting tokens:", error);
      alert("Failed to mint tokens. Please try again.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-black">Mint Reversible Tokens</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Mint Reversible Tokens</DialogTitle>
          <DialogDescription>
            Anyone can mint these reversible tokens to their wallet address.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Input
              id="tokenAmount"
              placeholder="Token amount (ex - 1)"
              value={tokenAmount}
              onChange={(e) => setTokenAmount(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <DialogClose asChild>
            <Button type="button" variant="destructive">
              Close
            </Button>
          </DialogClose>
          <Button type="button" variant="secondary" onClick={handleMint}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
