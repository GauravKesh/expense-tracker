'use client';

import Link from 'next/link';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function Navbar() {
  return (
    <div className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link href="/" className="text-xl font-semibold text-gray-800 hover:text-indigo-600">
          💸 FinTrack
        </Link>

        {/* Settings Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-slate-100 border border-gray-200 shadow-md rounded-md">
            <DropdownMenuItem asChild>
              <Link href="/transactions">Transactions</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings/category">Category</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings/budget">Budget</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default Navbar;
