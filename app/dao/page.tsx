'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

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

export default function DAODisputesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const response = await fetch('https://xerothermic-arlina-abhishek740-454a2f98.koyeb.app/disputes/get-disputes');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.status === 'success') {
          setDisputes(data.data);
        }
      } catch (error) {
        console.error('Error fetching disputes:', error);
        toast({
          title: "Error",
          description: "Could not fetch disputes",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDisputes();
  }, []);

  const calculateTimeLeft = (createdAt: string) => {
    const endDate = new Date(new Date(createdAt).getTime() + 24 * 60 * 60 * 1000);
    const now = new Date();
    const difference = endDate.getTime() - now.getTime();
    if (difference > 0) {
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}:${minutes.toString().padStart(2, '0')} hrs left`;
    }
    return 'Ended';
  };

  const filteredDisputes = useMemo(() => {
    return disputes.filter((dispute) => {
      const matchesSearch = dispute.proof_title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilters.length === 0 || statusFilters.includes(dispute.verdict ? 'resolved' : 'active');
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilters, disputes]);

  const truncateDescription = (description: string, maxLength = 200) => {
    return description.length > maxLength ? `${description.slice(0, maxLength)}...` : description;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

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
                    setStatusFilters((prev) =>
                      checked ? [...prev, 'active'] : prev.filter((status) => status !== 'active')
                    );
                  }}
                />
                <Label htmlFor="active-status">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="resolved-status"
                  checked={statusFilters.includes('resolved')}
                  onCheckedChange={(checked) => {
                    setStatusFilters((prev) =>
                      checked ? [...prev, 'resolved'] : prev.filter((status) => status !== 'resolved')
                    );
                  }}
                />
                <Label htmlFor="resolved-status">Resolved</Label>
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
              <h3 className="font-semibold text-lg mb-2 py-2">{dispute.proof_title}</h3>
              <p className="text-gray-600">{truncateDescription(dispute.proof_content)}</p>
              <div className="flex justify-between items-center mt-4">
                <Badge
                  className={`capitalize pointer-events-none ${
                    dispute.verdict ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {dispute.verdict ? 'Resolved' : 'Active'}
                </Badge>
                <span className="text-sm text-gray-500">{calculateTimeLeft(dispute.created_at)}</span>
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