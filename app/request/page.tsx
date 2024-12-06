  "use client";

  import React, { useState } from "react";
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { Button } from "@/components/ui/button";
  import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip";
  import { Info, AlertCircle } from "lucide-react";
  import { CircleHelp } from "lucide-react";

  // Utility function to calculate reversible until date
  const calculateReversibleUntil = (transactionDate: Date): Date => {
    const reversibleUntil = new Date(transactionDate);
    reversibleUntil.setDate(transactionDate.getDate() + 2);
    return reversibleUntil;
  };

  // Format date in a readable way
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const TransactionReversalPage: React.FC = () => {
    // Mock transaction data (in a real app, this would come from props or state)
    const transaction = {
      amount: 1500.5,
      sender: "0x1234567890123456789012345678901234567890",
      receiver: "0x0987654321098765432109876543210987654321",
      timestamp: new Date("2024-02-15T14:30:00Z"),
      status: "Pending",
    };

    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Handle reversal request submission logic
      console.log("Reversal Request Submitted", { title, message });
    };

    const reversibleUntil = calculateReversibleUntil(transaction.timestamp);

    return (
      <div className="min-h-screen from-emerald-50 to-emerald-100 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {/* Transaction Details Card */}
          <Card className="shadow-xl border-none mb-8">
            <CardHeader className="bg-gradient-to-r from-emerald-400 to-green-500 text-white rounded-t-xl">
              <CardTitle className="flex items-center justify-between">
                <span>Transaction Details</span>
                <AlertCircle className="w-6 h-6" />
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-white rounded-b-xl p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Side: Transaction Details */}
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="text-sm text-gray-600 flex items-center">
                    <span className="mr-2">From:</span>
                    <span className="font-mono bg-emerald-50 px-2 py-1 rounded-md text-emerald-800">
                      {transaction.sender.substring(0, 6)}...
                      {transaction.sender.substring(
                        transaction.sender.length - 4
                      )}
                    </span>
                  </div>
                  <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-600">
                    ${transaction.amount.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600 flex items-center">
                    <span className="mr-2">To:</span>
                    <span className="font-mono bg-emerald-50 px-2 py-1 rounded-md text-emerald-800">
                      {transaction.receiver.substring(0, 6)}...
                      {transaction.receiver.substring(
                        transaction.receiver.length - 4
                      )}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    {formatDate(transaction.timestamp)}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="ml-2 w-4 h-4 text-emerald-400 hover:text-emerald-600 transition-colors" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            This transaction can be reversed until{" "}
                            {formatDate(reversibleUntil)}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                {/* Right Side: Transaction Status */}
                <div className="flex items-center justify-center">
                  <div className="text-2xl font-semibold bg-yellow-100 px-4 py-2 rounded-lg border border-yellow-200 text-yellow-800 flex items-center space-x-2">
                    <p>{transaction.status}</p>
                    <CircleHelp className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reversal Request Form */}
          <Card className="shadow-xl border-none">
            <CardHeader className="bg-gradient-to-r from-emerald-400 to-green-500 text-white rounded-t-xl">
              <CardTitle>Reversal Request Form</CardTitle>
            </CardHeader>
            <CardContent className="bg-white rounded-b-xl p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-gray-700 mb-2 block">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Reason for reversal"
                    required
                    className="border-emerald-200 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300"
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="text-gray-700 mb-2 block">
                    Message
                  </Label>
                  <Input
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide additional details"
                    required
                    className="border-emerald-200 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 transition-all duration-300 text-white font-bold py-3 rounded-lg"
                >
                  Submit Reversal Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  export default TransactionReversalPage;