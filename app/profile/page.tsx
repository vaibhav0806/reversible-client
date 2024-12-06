'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, History, CircleAlert, CircleCheck, CircleHelp, Undo2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useRouter } from 'next/navigation';

const mockTransferHistory = [
  {
    id: '1',
    amount: 100.50,
    receiverAddress: '0x1234...5678',
    timestamp: '2024-03-15T10:30:00Z',
    status: 'completed',
  },
  {
    id: '2',
    amount: 250.75,
    receiverAddress: '0x8765...4321',
    timestamp: '2024-03-14T15:45:00Z',
    status: 'pending',
  },
  {
    id: '3',
    amount: 50.25,
    receiverAddress: '0x2468...1357',
    timestamp: '2024-03-13T09:15:00Z',
    status: 'disputed',
  },
  {
    id: '4',
    amount: 75.00,
    receiverAddress: '0x3690...1245',
    timestamp: '2024-03-12T14:20:00Z',
    status: 'reversed',
  },
];

const STATUS_CONFIGS = {
  completed: { color: 'bg-green-100 text-green-800 border-green-200', icon: <CircleCheck className="w-4 h-4 text-green-600" /> },
  pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <CircleHelp className="w-4 h-4 text-yellow-600" /> },
  disputed: { color: 'bg-red-100 text-red-800 border-red-200', icon: <CircleAlert className="w-4 h-4 text-red-600" /> },
  reversed: { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: <Undo2 className="w-4 h-4 text-gray-600" /> },
};

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'transfers' | 'issues'>('transfers');
  const [transferHistory] = useState(mockTransferHistory);

  const userData = {
    email: 'user@example.com',
    walletAddress: '0x1A2B3C4D5E6F7G8H9I0J',
    nrBalance: 500.00,
    rBalance: 250.75,
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

  const handleDispute = (transferId: string) => {
    router.push(`/request`);
  };

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
              <span className="font-semibold text-blue-600">{userData.nrBalance} NR</span>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">R Balance</p>
              <span className="font-semibold text-green-600">{userData.rBalance} R</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex justify-center space-x-4 mb-8">
            <Button
              variant={activeTab === 'transfers' ? 'default' : 'outline'}
              onClick={() => setActiveTab('transfers')}
              className={`bg-gradient-to-r ${activeTab === 'transfers' ? 'from-emerald-400 to-green-500 text-white' : ''}`}
            >
              <History className="w-4 h-4" />
              <span>Transfer History</span>
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
          {activeTab === 'transfers' && (
            <div className="space-y-6">
              {transferHistory.map((transfer) => (
                <Card key={transfer.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{transfer.amount} NR</p>
                      <Badge
                        variant="outline"
                        className={`${STATUS_CONFIGS[transfer.status].color} capitalize`}
                      >
                        {transfer.status}
                      </Badge>
                      <p className="text-sm text-gray-500 mt-1">To: {transfer.receiverAddress}</p>
                      <p className="text-xs text-gray-400">{formatDate(transfer.timestamp)}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                    {transfer.status === 'pending' && (
                        <Button 
                          className="bg-red-500 text-white hover:bg-red-600" 
                          onClick={() => handleDispute(transfer.id)}
                        >
                          Reverse
                        </Button>
                      )}
                      {STATUS_CONFIGS[transfer.status].icon}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'issues' && (
            <div className="text-center py-12 text-gray-500">
              No issues submitted yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
