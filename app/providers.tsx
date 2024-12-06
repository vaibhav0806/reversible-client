'use client';

import type { ReactNode } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { baseSepolia } from 'wagmi/chains'; // add baseSepolia for testing

export function Providers(props: { children: ReactNode }) {
  return (
      <OnchainKitProvider
        apiKey="KCsHBC7t7mrCsssaILQJZBA1JXxZRzu7"
        chain={baseSepolia} // add baseSepolia for testing
      >
        {props.children}
      </OnchainKitProvider>
  );
}