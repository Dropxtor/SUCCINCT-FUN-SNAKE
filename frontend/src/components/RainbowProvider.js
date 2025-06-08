import React from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
  Theme,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { mainnet, sepolia, arbitrum, polygon } from 'wagmi/chains';
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

// Custom Succinct theme for RainbowKit
const succinctTheme = {
  ...darkTheme({
    accentColor: '#8b5cf6',
    accentColorForeground: 'white',
    borderRadius: 'large',
    fontStack: 'system',
    overlayBlur: 'small',
  }),
  colors: {
    ...darkTheme().colors,
    accentColor: '#8b5cf6',
    accentColorForeground: 'white',
    actionButtonBorder: '#8b5cf6',
    actionButtonBorderMobile: '#8b5cf6',
    actionButtonSecondaryBackground: 'rgba(139, 92, 246, 0.1)',
    closeButton: '#ec4899',
    closeButtonBackground: 'rgba(236, 72, 153, 0.1)',
    connectButtonBackground: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
    connectButtonBackgroundError: '#ef4444',
    connectButtonInnerBackground: 'rgba(139, 92, 246, 0.1)',
    connectButtonText: 'white',
    connectButtonTextError: 'white',
    connectionIndicator: '#10b981',
    downloadBottomCardBackground: 'rgba(0, 0, 0, 0.9)',
    downloadTopCardBackground: 'rgba(0, 0, 0, 0.9)',
    error: '#ef4444',
    generalBorder: '#374151',
    generalBorderDim: '#1f2937',
    menuItemBackground: 'rgba(139, 92, 246, 0.1)',
    modalBackdrop: 'rgba(0, 0, 0, 0.8)',
    modalBackground: 'rgba(15, 15, 35, 0.95)',
    modalBorder: '#8b5cf6',
    modalText: 'white',
    modalTextDim: '#9ca3af',
    modalTextSecondary: '#d1d5db',
    profileAction: 'rgba(139, 92, 246, 0.1)',
    profileActionHover: 'rgba(139, 92, 246, 0.2)',
    profileForeground: 'rgba(15, 15, 35, 0.95)',
    selectedOptionBorder: '#8b5cf6',
    standby: '#fbbf24',
  },
  fonts: {
    body: 'Space Grotesk, system-ui, sans-serif',
  },
  radii: {
    actionButton: '12px',
    connectButton: '12px',
    menuButton: '12px',
    modal: '16px',
    modalMobile: '16px',
  },
  shadows: {
    connectButton: '0 0 20px rgba(139, 92, 246, 0.3)',
    dialog: '0 0 50px rgba(139, 92, 246, 0.2)',
    profileDetailsAction: '0 0 10px rgba(139, 92, 246, 0.1)',
    selectedOption: '0 0 20px rgba(139, 92, 246, 0.4)',
    selectedWallet: '0 0 20px rgba(139, 92, 246, 0.4)',
    walletLogo: '0 0 10px rgba(139, 92, 246, 0.2)',
  },
};

const config = getDefaultConfig({
  appName: 'Succinct Snake',
  projectId: 'succinct-snake-game', // You should get a real project ID from WalletConnect
  chains: [monadTestnet, mainnet, sepolia, arbitrum, polygon],
  ssr: false,
});

const queryClient = new QueryClient();

export function RainbowProvider({ children }) {
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

export default RainbowProvider;