import React from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
  connectorsForWallets,
} from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
  walletConnectWallet,
  coinbaseWallet,
  rainbowWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

// Define Monad testnet
const monadTestnet = {
  id: 10143,
  name: 'Monad Testnet',
  network: 'monad-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Monad',
    symbol: 'MON',
  },
  rpcUrls: {
    public: { http: ['https://testnet-rpc.monad.xyz'] },
    default: { http: ['https://testnet-rpc.monad.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Monad Explorer', url: 'https://testnet.monadexplorer.com' },
  },
  testnet: true,
};

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [
        metaMaskWallet,
        walletConnectWallet,
        coinbaseWallet,
        rainbowWallet,
      ],
    },
  ],
  {
    appName: 'Succinct Snake',
    projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || 'succinct-snake-game',
  }
);

const config = getDefaultConfig({
  appName: 'Succinct Snake',
  projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || 'succinct-snake-game',
  chains: [monadTestnet],
  connectors,
  ssr: false,
});

// Custom Succinct theme for RainbowKit
const succinctTheme = darkTheme({
  accentColor: '#8b5cf6',
  accentColorForeground: 'white',
  borderRadius: 'large',
  fontStack: 'system',
  overlayBlur: 'small',
});

// Override specific colors for Succinct branding
succinctTheme.colors.accentColor = '#8b5cf6';
succinctTheme.colors.connectButtonBackground = '#8b5cf6';
succinctTheme.colors.modalBackground = '#0f0f23';
succinctTheme.colors.modalBorder = '#8b5cf6';
succinctTheme.colors.generalBorder = '#8b5cf6';
succinctTheme.colors.actionButtonBorder = '#8b5cf6';
succinctTheme.colors.closeButton = '#ec4899';
succinctTheme.colors.connectionIndicator = '#10b981';
succinctTheme.colors.profileAction = 'rgba(139, 92, 246, 0.1)';
succinctTheme.colors.profileActionHover = 'rgba(139, 92, 246, 0.2)';
succinctTheme.colors.selectedOptionBorder = '#8b5cf6';

const queryClient = new QueryClient();

export function RainbowAppKitProvider({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider 
          theme={succinctTheme}
          modalSize="compact"
          coolMode={true}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default RainbowAppKitProvider;