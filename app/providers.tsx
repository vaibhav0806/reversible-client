'use client';

import type { ReactNode } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { baseSepolia } from 'wagmi/chains'; // add baseSepolia for testing
import {NextUIProvider} from "@nextui-org/react";
import { State } from 'wagmi';

interface ProvidersProps {
  initialState?: State;
  children: ReactNode;
}

export function Providers({ initialState, children }: ProvidersProps) {
  return (
    <NextUIProvider>
      <OnchainKitProvider
        apiKey="KCsHBC7t7mrCsssaILQJZBA1JXxZRzu7"
        chain={baseSepolia} // add baseSepolia for testing
      >
        {children}
      </OnchainKitProvider>
    </NextUIProvider>
  );
}