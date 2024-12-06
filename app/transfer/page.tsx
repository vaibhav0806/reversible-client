'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { HelpCircle, CircleDollarSign } from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

export default function TokenTransferPage() {
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  
  // Mock balance (in a real app, this would come from wallet connection)
  const tokenBalance = 1234.56;
  const tokenSymbol = 'ETH';

  const handleTransfer = () => {
    // Implement transfer logic here
    console.log('Transfer initiated', { recipientAddress, amount });
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-lg font-semibold bg-gradient-to-r from-emerald-400 to-green-500 text-white py-2 rounded-md">
            Token Transfer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Recipient Address Input */}
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

            {/* Amount Input with Token Symbol */}
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

            {/* Balance Display with Tooltip */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Balance: <span className="font-semibold">{tokenBalance} {tokenSymbol}</span>
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

            {/* Transfer Button */}
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
  );
}
