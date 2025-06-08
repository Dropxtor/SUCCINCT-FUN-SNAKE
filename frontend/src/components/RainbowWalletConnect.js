import React, { useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';
import { FuturisticCard } from './FuturisticUI';
import SuccinctLogoNew from './SuccinctLogoNew';

const RainbowWalletConnect = ({ onWalletConnected, onWalletDisconnected }) => {
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (isConnected && address) {
      onWalletConnected && onWalletConnected(address);
    } else {
      onWalletDisconnected && onWalletDisconnected();
    }
  }, [isConnected, address, onWalletConnected, onWalletDisconnected]);

  const CustomConnectButton = () => {
    return (
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          const ready = mounted && authenticationStatus !== 'loading';
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus || authenticationStatus === 'authenticated');

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                'style': {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <FuturisticCard className="p-6 max-w-md mx-auto" glowing animated>
                      <div className="text-center">
                        <div className="mb-6">
                          {/* Succinct Logo Animation */}
                          <div className="inline-block relative">
                            <SuccinctLogoNew size="large" animated={true} className="mx-auto mb-4" />
                          </div>
                        </div>
                        
                        <div className="text-gray-300 mb-6">
                          <p className="font-bold text-xl succinct-font mb-2">Wallet Required</p>
                          <p className="text-sm">Connect to play Succinct Snake</p>
                          <p className="text-xs text-purple-300 mt-2">Powered by Monad Network</p>
                        </div>
                        
                        <button
                          onClick={openConnectModal}
                          className="w-full px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 succinct-button"
                        >
                          <div className="flex items-center justify-center space-x-3">
                            <span>🔗</span>
                            <span>CONNECT WALLET</span>
                          </div>
                        </button>
                        
                        <div className="mt-4 text-xs text-gray-400">
                          <p>🔒 Supports all major wallets</p>
                          <p className="mt-1">
                            Need MON tokens? Visit{' '}
                            <a 
                              href="https://testnet.monad.xyz" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-cyan-400 hover:text-cyan-300 underline animate-pulse"
                            >
                              Monad Faucet
                            </a>
                            {' '}just for fun! 🚀
                          </p>
                        </div>
                      </div>
                    </FuturisticCard>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <FuturisticCard className="p-4" glowing>
                      <div className="text-center">
                        <p className="text-red-400 font-bold mb-4">Wrong Network</p>
                        <button
                          onClick={openChainModal}
                          className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
                        >
                          Switch Network
                        </button>
                      </div>
                    </FuturisticCard>
                  );
                }

                return (
                  <FuturisticCard glowing animated>
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center space-x-4">
                        <SuccinctLogoNew size="medium" animated={true} />
                        <div>
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                              <div className="absolute inset-0 w-4 h-4 bg-green-400 rounded-full animate-ping opacity-50"></div>
                            </div>
                            <span className="text-cyan-400 font-bold text-lg succinct-font">CONNECTED</span>
                          </div>
                          <button
                            onClick={openAccountModal}
                            className="text-white font-mono text-sm mt-1 hover:text-cyan-400 transition-colors"
                          >
                            {account.displayName}
                          </button>
                          <div className="text-gray-300 text-xs mt-1">
                            Balance: {account.displayBalance || '0'} {chain.nativeCurrency?.symbol || 'ETH'}
                          </div>
                          <button
                            onClick={openChainModal}
                            className="text-purple-300 text-xs hover:text-purple-200 transition-colors"
                          >
                            {chain.name}
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={openChainModal}
                          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-all duration-300"
                        >
                          Network
                        </button>
                        <button
                          onClick={() => disconnect()}
                          className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25"
                        >
                          Disconnect
                        </button>
                      </div>
                    </div>
                  </FuturisticCard>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    );
  };

  return <CustomConnectButton />;
};

export default RainbowWalletConnect;