"use client";

import React, { useState, useEffect } from "react";
import {
  useParams,
  useRouter,
  usePathname,
  useSearchParams,
} from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Interfaces (kept from previous implementation)
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

interface Transaction {
  id: number;
  amount: number;
  from_wallet: string;
  to_wallet: string;
  created_at: string;
  state: string;
}

type Props = {
  params: {
    id: string;
  }
}

const DisputePage = ({ params}: Props) => {
  console.log(params.id);
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [isJudge, setIsJudge] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [votes, setVotes] = useState<any>(null)
  const [senderTransactions, setSenderTransactions] = useState<Transaction[]>(
    []
  );
  const [receiverTransactions, setReceiverTransactions] = useState<
    Transaction[]
  >([]);
  const [voteDecision, setVoteDecision] = useState<"approve" | "reject">(
    "approve"
  );
  const [activeTab, setActiveTab] = useState("sender-history");

  // Voting data (mock for now)
  const [votingData, setVotingData] = useState({
    yes: 65,
    no: 35,
  });

  useEffect(() => {
    const fetchSenderTransactionHistory = async () => {
      const response = await fetch(
        `https://plain-brandy-dhrupad-f7f7afc1.koyeb.app/users/get-user-sent-transactions/${transaction?.from_wallet}`
      );
      const responseWait = await response.json();
      const data = responseWait.data.slice(0, 5)
      setSenderTransactions(data)
      console.log(data)
  
      const response2 = await fetch(
        `https://plain-brandy-dhrupad-f7f7afc1.koyeb.app/users/get-user-received-transactions/${transaction?.from_wallet}`
      );
      const responseWait2 = await response2.json();
      const data2 = responseWait2.data.slice(0, 5);
      console.log(data2)
      setSenderTransactions([...data, data2]);
    }
  
    const fetchReceiverTransactionHistory = async () => {
      const response = await fetch(
        `https://plain-brandy-dhrupad-f7f7afc1.koyeb.app/users/get-user-sent-transactions/${transaction?.to_wallet}`
      );
      const responseWait = await response.json();
      const data = responseWait.data.slice(0, 5)
      console.log(data)
      setReceiverTransactions(data)
  
      const response2 = await fetch(
        `https://plain-brandy-dhrupad-f7f7afc1.koyeb.app/users/get-user-received-transactions/${transaction?.to_wallet}`
      );
      const responseWait2 = await response2.json();
      const data2 = responseWait2.data.slice(0, 5)
      console.log(data2)
      setReceiverTransactions([...data, data2])
    }
    fetchSenderTransactionHistory()
    fetchReceiverTransactionHistory()
  }, [transaction])

  // Function to check if voting period is over
  const isVotingPeriodComplete = (createdAt: string) => {
    const creationDate = new Date(createdAt);
    const oneDayLater = new Date(creationDate.getTime() + 24 * 60 * 60 * 1000);
    return new Date() > oneDayLater;
  };

  // Similar data fetching logic as before (kept for context)
  useEffect(() => {
    const fetchDispute = async () => {
      if (params.id) {
        try {
          console.log("get dispute")
          const response = await fetch(
            `https://plain-brandy-dhrupad-f7f7afc1.koyeb.app/disputes/get-dispute/${params.id}`
          );
          const responseWait = await response.json();
          const data = responseWait.data[0];
          console.log("dispute is : ", data)
  
          if (response.ok) {
            setDispute(data);
            // console.log(data);
          } else {
            console.error("Error fetching dispute:", data);
          }
        } catch (error) {
          console.error("Error fetching dispute data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchDispute();
  }, [, params.id]);

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        console.log("get votes")
        // console.log(dispute)
        const response = await fetch(
          `https://plain-brandy-dhrupad-f7f7afc1.koyeb.app/disputes/getVotes/${dispute?.id}`
        );
        const responseWait = await response.json();
        const data = responseWait.data[0];
        console.log("votes is : ", data)
  
        if (response.ok) {
          setVotes(data);
          // console.log(data);
        } else {
          console.error("Error fetching votes:", data);
        }
      } catch (error) {
        console.error("Error fetching votes data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchVotes()
  }, [dispute])

  const vote = async () => {
    try {
      console.log("get vote")
      const payload = {
        "wallet": {
          "address_id": JSON.parse(localStorage.getItem("walletData")!).address_id,
          "wallet_id": JSON.parse(localStorage.getItem("walletData")!).wallet_id,
          "network_id": JSON.parse(localStorage.getItem("walletData")!).network_id
        },
        "request": {
          "dispute_id": dispute?.id,
          "vote": voteDecision
        }
      } 
      // console.log("payload is : ", payload)
      const response = await fetch(
        `https://plain-brandy-dhrupad-f7f7afc1.koyeb.app/judges/vote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(payload)
        }
      );
      const responseWait = await response.json();
      console.log("vote is :", responseWait);

      if (response.ok) {
        // console.log(responseWait);
      } else {
        console.error("Error fetching vote:", responseWait);
      }
    } catch (error) {
      console.error("Error fetching vote data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        console.log("get transaction")
        // console.log(dispute)
        const response = await fetch(
          `https://plain-brandy-dhrupad-f7f7afc1.koyeb.app/transactions/get-transactions/${dispute?.transactionId}`
        );
        const responseWait = await response.json();
        const data = responseWait.data[0];
        console.log("transaction is : ", data)

        if (response.ok) {
          setTransaction(data);
          // console.log(data);
        } else {
          console.error("Error fetching dispute:", data);
        }
      } catch (error) {
        console.error("Error fetching dispute data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTransaction()
  }, [dispute]);

  useEffect(() => {
    const fetchIsJudge = async () => {
      try {
        console.log("get judge")
        const payload = {
          "address_id": JSON.parse(localStorage.getItem("walletData")!).address_id,
          "wallet_id": JSON.parse(localStorage.getItem("walletData")!).wallet_id,
          "network_id": JSON.parse(localStorage.getItem("walletData")!).network_id
        }
        // console.log("payload is : ", payload)
        const response = await fetch(
          `https://plain-brandy-dhrupad-f7f7afc1.koyeb.app/users/isJudge`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            body: JSON.stringify(payload)
          }
        );
        const responseWait = await response.json();
        console.log("judge is :", responseWait);

        if (response.ok) {
          // console.log(responseWait);
        } else {
          console.error("Error fetching dispute:", responseWait);
        }
      } catch (error) {
        console.error("Error fetching dispute data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchIsJudge()
  }, [transaction])

  const formatWalletAddress = (address: string) => {
    if (address)
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const renderTransactionHistory = (transactions: Transaction[]) => {
    return transactions.map((tx: any) => (
      <Card key={tx.id} className="mb-2">
        <CardContent className="p-4">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium">
                {formatWalletAddress(tx.from_wallet)} →{" "}
                {formatWalletAddress(tx.to_wallet)}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(tx.created_at).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold">${tx.amount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    ));
  };

  if (!dispute) return <div>Loading...</div>;

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="grid grid-cols-2 gap-8">
        {/* Left Side - Previous implementation remains the same */}
        <div className="space-y-4">
          <Badge
            variant={
              !isVotingPeriodComplete(dispute.created_at)
                ? "default"
                : "secondary"
            }
            className="text-sm capitalize"
          >
            {!isVotingPeriodComplete(dispute.created_at) ? "Active" : "Closed"}
          </Badge>

          <h1 className="text-2xl font-bold text-gray-900">
            {dispute.proof_title}
          </h1>

          <p className="text-gray-700 mt-4">{dispute.proof_content}</p>
        </div>

        {/* Right Side - Updated with new voting bars */}
        <div className="space-y-4">
          {/* Transaction Details Card - Unchanged */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction Details</CardTitle>
            </CardHeader>
            <CardContent>
              {transaction ? 
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span>{transaction?.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span>From:</span>
                  <span>{transaction?.from_wallet.slice(0, 6)+'...'+transaction?.from_wallet.slice(transaction?.from_wallet.length-5, transaction?.from_wallet.length)}</span>
                </div>
                <div className="flex justify-between">
                  <span>To:</span>
                  <span>{transaction?.to_wallet.slice(0, 6)+'...'+transaction?.to_wallet.slice(transaction?.to_wallet.length-5, transaction?.to_wallet.length)}</span>
                </div>
              </div>
              :
              <>hello</>
              }
            </CardContent>
          </Card>

          {/* New Voting Bars Section */}
          <Card>
            <CardHeader>
              <CardTitle>Voting Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Yes Votes Bar */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Approve</span>
                    {isVotingPeriodComplete(dispute.created_at) && (
                      <span>{votingData.yes}</span>
                    )}
                  </div>
                  <Progress
                    value={
                      isVotingPeriodComplete(dispute.created_at)
                        ? votingData.yes
                        : 0
                    }
                    className={`h-2 ${
                      !isVotingPeriodComplete(dispute.created_at)
                        ? "bg-gray-300"
                        : ""
                    }`}
                  />
                </div>

                {/* No Votes Bar */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Reject</span>
                    {isVotingPeriodComplete(dispute.created_at) && (
                      <span>{votingData.no}</span>
                    )}
                  </div>
                  <Progress
                    value={
                      isVotingPeriodComplete(dispute.created_at)
                        ? votingData.no
                        : 0
                    }
                    className={`h-2 ${
                      !isVotingPeriodComplete(dispute.created_at)
                        ? "bg-gray-300"
                        : ""
                    }`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Judge Vote Button */}
          {isJudge && !isVotingPeriodComplete(dispute.created_at) && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">Vote on Dispute</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Dispute Resolution</DialogTitle>
                </DialogHeader>

                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="sender-history">
                      Sender History
                    </TabsTrigger>
                    <TabsTrigger value="receiver-history">
                      Receiver History
                    </TabsTrigger>
                    <TabsTrigger value="vote-selection">Vote</TabsTrigger>
                  </TabsList>

                  {/* Sender Transaction History Tab */}
                  {senderTransactions.length > 0 ? 
                  <TabsContent value="sender-history">
                    <div className="max-h-[400px] overflow-y-auto">
                      {renderTransactionHistory(senderTransactions)}
                    </div>
                  </TabsContent>
                  :
                  <></>
                  }

                  {/* Receiver Transaction History Tab */}
                  
                  {receiverTransactions.length > 0 ?
                  <TabsContent value="receiver-history">
                    <div className="max-h-[400px] overflow-y-auto">
                      {renderTransactionHistory(receiverTransactions)}
                    </div>
                  </TabsContent>
                  :
                  <></>
                  }

                  {/* Vote Selection Tab */}
                  <TabsContent value="vote-selection">
                    <div className="space-y-4">
                      <RadioGroup
                        defaultValue="approve"
                        onValueChange={(value) =>
                          setVoteDecision(value as "approve" | "reject")
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="approve" id="approve" />
                          <Label htmlFor="approve">
                            Approve Dispute Reversal
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="reject" id="reject" />
                          <Label htmlFor="reject">
                            Reject Dispute Reversal
                          </Label>
                        </div>
                      </RadioGroup>

                      <Button onClick={vote} className="w-full">
                        Submit Vote
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisputePage;
