'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, History, CircleAlert, CircleCheck, CircleHelp, Undo2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useRouter } from 'next/navigation';
import { Toaster } from "@/components/ui/toaster";
import { useToast } from '@/hooks/use-toast';

// Type definitions for our data structures
interface UserData {
  email: string;
  walletAddress: string;
  nrBalance: number;
  rBalance: number;
}

interface Transaction {
  id: number;
  created_at: string;
  from_wallet: string;
  to_wallet: string;
  amount: number;
  state: string;
  index: string;
}

interface Dispute {
  id: number;
  created_at: string;
  updated_at: string;
  to_wallet: string;
  proof_title: string;
  transactionId: number;
  verdict: boolean;
  proof_content: string;
  dispute_count: string;
}

const STATUS_CONFIGS = {
  completed: { color: 'bg-green-100 text-green-800 border-green-200', icon: <CircleCheck className="w-4 h-4 text-green-600" /> },
  pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <CircleHelp className="w-4 h-4 text-yellow-600" /> },
  disputed: { color: 'bg-red-100 text-red-800 border-red-200', icon: <CircleAlert className="w-4 h-4 text-red-600" /> },
  reversed: { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: <Undo2 className="w-4 h-4 text-gray-600" /> },
};

export default function ProfilePage() {
  const { toast } = useToast()
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'sent' | 'received' | 'issues'>('sent');
  
  // State for dynamic data
  const [userData, setUserData] = useState<UserData | null>(null);
  const [sentTransferHistory, setSentTransferHistory] = useState<Transaction[]>([]);
  const [receivedTransferHistory, setReceivedTransferHistory] = useState<Transaction[]>([]);
  const [userDisputes, setUserDisputes] = useState<Dispute[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Retrieve wallet address from local storage
    const storedWalletData = localStorage.getItem('walletData');
    
    if (storedWalletData) {
      try {
        const parsedWalletData = JSON.parse(storedWalletData);
        const walletAddress = parsedWalletData.address_id;

        // Fetch all required data
        Promise.all([
          fetchWalletBalances(walletAddress),
          fetchSentTransactionHistory(walletAddress),
          fetchReceivedTransactionHistory(walletAddress),
          fetchUserDisputes(walletAddress)
        ]).finally(() => setIsLoading(false));
      } catch (error) {
        console.error('Error parsing wallet data:', error);
        toast({
          title: "Error",
          description: "Could not retrieve wallet information",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    } else {
      toast({
        title: "Error",
        description: "No wallet data found. Please log in.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  }, []);

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
        const userBalanceData = responseData.data[0];
        
        setUserData({
          email: userBalanceData.email,
          walletAddress: userBalanceData.wallet_address,
          nrBalance: userBalanceData.nrb_value,
          rBalance: userBalanceData.rb_value
        });
      }
    } catch (error) {
      console.error("Error fetching wallet balances:", error);
      toast({
        title: "Error",
        description: "Could not fetch wallet balances",
        variant: "destructive"
      });
    }
  };

  const fetchSentTransactionHistory = async (walletAddress: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users/get-user-sent-transactions/${walletAddress}`,
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
      
      if (responseData.status === "success") {
        setSentTransferHistory(responseData.data);
      }
    } catch (error) {
      console.error("Error fetching sent transaction history:", error);
      toast({
        title: "Error",
        description: "Could not fetch sent transaction history",
        variant: "destructive"
      });
    }
  };

  const fetchReceivedTransactionHistory = async (walletAddress: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users/get-user-received-transactions/${walletAddress}`,
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
      
      if (responseData.status === "success") {
        setReceivedTransferHistory(responseData.data);
      }
    } catch (error) {
      console.error("Error fetching received transaction history:", error);
      toast({
        title: "Error",
        description: "Could not fetch received transaction history",
        variant: "destructive"
      });
    }
  };

  const fetchUserDisputes = async (walletAddress: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users/get-user-disputes/${walletAddress}`,
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
      
      if (responseData.status === "success") {
        setUserDisputes(responseData.data);
      }
    } catch (error) {
      console.error("Error fetching user disputes:", error);
      toast({
        title: "Error",
        description: "Could not fetch user disputes",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDispute = (transactionId: number) => {
    router.push(`/request?transactionId=${transactionId}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-red-500">
        Unable to load user data. Please log in again.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-lg font-semibold bg-gradient-to-r from-emerald-400 to-green-500 text-white py-2 rounded-md">
            User Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* User Info */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Email</p>
              <div className="flex items-center space-x-2">
                <Wallet className="w-5 h-5 text-gray-600" />
                <span>{userData.email}</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Wallet Address</p>
              <div className="flex items-center space-x-2">
                <Wallet className="w-5 h-5 text-gray-600" />
                <span className="truncate">{userData.walletAddress}</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">NR Balance</p>
              <span className="font-semibold text-blue-600">{userData.nrBalance.toFixed(2)} NR</span>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">R Balance</p>
              <span className="font-semibold text-green-600">{userData.rBalance.toFixed(2)} R</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex justify-center space-x-4 mb-8">
            <Button
              variant={activeTab === 'sent' ? 'default' : 'outline'}
              onClick={() => setActiveTab('sent')}
              className={`bg-gradient-to-r ${activeTab === 'sent' ? 'from-emerald-400 to-green-500 text-white' : ''}`}
            >
              <History className="w-4 h-4" />
              <span>Sent Transfers</span>
            </Button>
            <Button
              variant={activeTab === 'received' ? 'default' : 'outline'}
              onClick={() => setActiveTab('received')}
              className={`bg-gradient-to-r ${activeTab === 'received' ? 'from-blue-400 to-blue-500 text-white' : ''}`}
            >
              <History className="w-4 h-4" />
              <span>Received Transfers</span>
            </Button>
            <Button
              variant={activeTab === 'issues' ? 'default' : 'outline'}
              onClick={() => setActiveTab('issues')}
              className={`bg-gradient-to-r ${activeTab === 'issues' ? 'from-red-400 to-red-500 text-white' : ''}`}
            >
              <CircleAlert className="w-4 h-4" />
              <span>Issues Submitted</span>
            </Button>
          </div>

          {/* Content */}
          {activeTab === 'sent' && (
            <div className="space-y-6">
              {sentTransferHistory.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No sent transfers found.
                </div>
              ) : (
                sentTransferHistory.map((transfer) => (
                  <Card key={transfer.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{transfer.amount} NR</p>
                        <Badge
                          variant="outline"
                          className={`${STATUS_CONFIGS[transfer.state]?.color || ''} capitalize`}
                        >
                          {transfer.state}
                        </Badge>
                        <p className="text-sm text-gray-500 mt-1">
                          To: {transfer.to_wallet}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDate(transfer.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        {transfer.state === 'pending' && (
                          <Button 
                            className="bg-red-500 text-white hover:bg-red-600" 
                            onClick={() => handleDispute(transfer.id)}
                          >
                            Reverse
                          </Button>
                        )}
                        {STATUS_CONFIGS[transfer.state]?.icon}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {activeTab === 'received' && (
            <div className="space-y-6">
              {receivedTransferHistory.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No received transfers found.
                </div>
              ) : (
                receivedTransferHistory.map((transfer) => (
                  <Card key={transfer.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{transfer.amount} NR</p>
                        <Badge
                          variant="outline"
                          className={`${STATUS_CONFIGS[transfer.state]?.color || ''} capitalize`}
                        >
                          {transfer.state}
                        </Badge>
                        <p className="text-sm text-gray-500 mt-1">
                          From: {transfer.from_wallet}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDate(transfer.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        {transfer.state === 'pending' && (
                          <Button 
                          className="bg-red-500 text-white hover:bg-red-600" 
                          onClick={() => handleDispute(transfer.id)}
                        >
                          Reverse
                        </Button>
                      )}
                      {STATUS_CONFIGS[transfer.state]?.icon}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

{activeTab === 'issues' && (
            <div className="space-y-6">
              {userDisputes.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No issues submitted yet.
                </div>
              ) : (
                userDisputes.map((dispute) => (
                  <Card key={dispute.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 flex justify-between items-center">
                      <div>
                        <p className="font-semibold">Transaction ID: {dispute.transactionId}</p>
                        <Badge
                          variant="outline"
                          className={`${dispute.verdict ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} capitalize`}
                        >
                          {dispute.verdict ? 'Resolved' : 'Pending'}
                        </Badge>
                        <p className="text-sm text-gray-500 mt-1">
                          To Wallet: {dispute.to_wallet}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDate(dispute.created_at)}
                        </p>
                      </div>
                      <div>
                        <Badge variant="secondary">
                          Disputes: {dispute.dispute_count}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}