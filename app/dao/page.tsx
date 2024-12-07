'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Filter, 
  Search 
} from 'lucide-react';
import { Label } from "@/components/ui/label";

const mockDisputes = [
  {
    id: '1',
    walletAddress: '0x1234...5678',
    status: 'active',
    title: 'Funding Allocation Dispute',
    description: 'Disagreement over the proposed funding allocation for the new community project. The current proposal seems to disproportionately benefit a small group of stakeholders.',
    endsAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    walletAddress: '0x8765...4321',
    status: 'closed',
    title: 'Governance Model Review',
    description: 'Proposal to review and potentially modify the current governance model to improve decentralization and community participation.',
    endsAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    walletAddress: '0x2468...1357',
    status: 'active',
    title: 'Smart Contract Upgrade',
    description: 'Detailed proposal for upgrading the main smart contract to improve security and add new features requested by the community.',
    endsAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
  }
];

export default function DAODisputesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilters, setStatusFilters] = useState<string[]>([]);

  const calculateTimeLeft = (endsAt: Date) => {
    const now = new Date();
    const difference = endsAt.getTime() - now.getTime();
    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      return days > 0 ? `Ends in ${days} day${days !== 1 ? 's' : ''}` : `Ends in ${hours}:${minutes} hrs`;
    }
    return 'Ended';
  };

  const filteredDisputes = useMemo(() => {
    return mockDisputes.filter(dispute => {
      const matchesSearch = dispute.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilters.length === 0 || statusFilters.includes(dispute.status);
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilters]);

  const truncateDescription = (description: string, maxLength = 200) => {
    return description.length > maxLength ? `${description.slice(0, maxLength)}...` : description;
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-emerald-400 to-green-500 text-white py-2 px-4 rounded-md">
          DAO Disputes
        </h1>
        <Popover>
          <PopoverTrigger asChild>
            <Button className="bg-gradient-to-r from-emerald-400 to-green-500 text-white">
              <Filter className="w-5 h-5 mr-2" />
              Filter
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <h4 className="font-medium mb-4">Filter Disputes</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="active-status"
                  checked={statusFilters.includes('active')}
                  onCheckedChange={(checked) => {
                    setStatusFilters(prev => 
                      checked ? [...prev, 'active'] : prev.filter(status => status !== 'active')
                    );
                  }}
                />
                <Label htmlFor="active-status">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="closed-status"
                  checked={statusFilters.includes('closed')}
                  onCheckedChange={(checked) => {
                    setStatusFilters(prev => 
                      checked ? [...prev, 'closed'] : prev.filter(status => status !== 'closed')
                    );
                  }}
                />
                <Label htmlFor="closed-status">Closed</Label>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input 
          placeholder="Search disputes..." 
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredDisputes.map((dispute) => (
          <Card key={dispute.id} className="transition mx-auto max-w-4xl">
            <CardContent>
              <h3 className="font-semibold text-lg mb-2 py-2">{dispute.title}</h3>
              <p className="text-gray-600">{truncateDescription(dispute.description)}</p>
              <div className="flex justify-between items-center mt-4">
                <Badge className={`capitalize pointer-events-none ${dispute.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {dispute.status}
                </Badge>
                <span className="text-sm text-gray-500">{calculateTimeLeft(dispute.endsAt)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDisputes.length === 0 && (
        <p className="text-center text-gray-500 mt-12">No disputes found.</p>
      )}
    </div>
  );
}
