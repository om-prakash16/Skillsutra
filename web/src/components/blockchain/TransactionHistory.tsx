"use client";

import { useEffect, useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { StatusIndicator } from "./StatusIndicator";
import { ExternalLink, Info, Search } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Transaction {
  id: string;
  user_wallet: string;
  transaction_hash: string;
  transaction_type: string;
  status: "pending" | "confirmed" | "failed" | "finalized";
  timestamp: string;
  explorer_url: string;
}

export function TransactionHistory({ 
  initialData = [], 
  wallet 
}: { 
  initialData?: Transaction[]; 
  wallet?: string;
}) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialData);
  const [filter, setFilter] = useState("");

  const filteredTransactions = transactions.filter((tx) =>
    tx.transaction_hash.toLowerCase().includes(filter.toLowerCase()) ||
    tx.transaction_type.toLowerCase().includes(filter.toLowerCase()) ||
    tx.user_wallet.toLowerCase().includes(filter.toLowerCase())
  );

  const getTypeText = (type: string) => {
    return type.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by hash, type or wallet..." 
            className="pl-9 bg-background/50 border-white/10"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-white/5 border-white/10 uppercase tracking-wider text-[10px]">
                {filteredTransactions.length} Transactions
            </Badge>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-muted-foreground font-semibold">Type</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Initiator (Wallet)</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Status</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Time</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((tx) => (
                <TableRow key={tx.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                  <TableCell className="font-medium">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm">{getTypeText(tx.transaction_type)}</span>
                      <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[120px]">
                        {tx.transaction_hash.slice(0, 12)}...
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-mono text-muted-foreground">
                      {tx.user_wallet.slice(0, 4)}...{tx.user_wallet.slice(-4)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusIndicator status={tx.status} />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(tx.timestamp), { addSuffix: true })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 cursor-pointer" onClick={() => window.open(tx.explorer_url, '_blank')}>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 cursor-pointer">
                        <Info className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
