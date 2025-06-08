import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const WalletConnect = ({ onWalletConnected, onWalletDisconnected }) => {
  const [account, setAccount] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [provider, setProvider] = useState(null);
  const [balance, setBalance] = useState('0');

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(provider);
          setAccount(accounts[0]);
          getBalance(accounts[0], provider);
          onWalletConnected && onWalletConnected(accounts[0]);
        }
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
    }
  };

  const getBalance = async (address, provider) => {
    try {
      const balance = await provider.getBalance(address);
      setBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error("Error getting balance:", error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('MetaMask is not installed. Please install MetaMask to continue.');
        return;
      }

      setIsConnecting(true);

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      // Switch to or add Monad testnet
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x279F' }], // 10143 in hex (Monad testnet)
        });
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x279F', // 10143 in hex
                  chainName: 'Monad Testnet',
                  nativeCurrency: {
                    name: 'Monad',
                    symbol: 'MON',
                    decimals: 18,
                  },
                  rpcUrls: ['https://testnet-rpc.monad.xyz'],
                  blockExplorerUrls: ['https://testnet.monadexplorer.com'],
                },
              ],
            });
          } catch (addError) {
            console.error('Error adding Monad testnet:', addError);
          }
        }
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);
      setAccount(accounts[0]);
      getBalance(accounts[0], provider);
      onWalletConnected && onWalletConnected(accounts[0]);

    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setBalance('0');
    onWalletDisconnected && onWalletDisconnected();
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setAccount(accounts[0]);
          onWalletConnected && onWalletConnected(accounts[0]);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, [onWalletConnected]);

  if (account) {
    return (
      <div className="succinct-wallet-connected">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl border border-cyan-400/50 backdrop-blur-md">
          <div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-4 h-4 bg-green-400 rounded-full animate-ping opacity-50"></div>
              </div>
              <span className="text-cyan-400 font-bold text-lg succinct-font">CONNECTED</span>
            </div>
            <div className="text-white font-mono text-sm mt-1">
              {formatAddress(account)}
            </div>
            <div className="text-gray-300 text-xs mt-1">
              Balance: {parseFloat(balance).toFixed(4)} MON
            </div>
            <div className="text-purple-300 text-xs">Monad Testnet</div>
          </div>
          <button
            onClick={disconnectWallet}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25"
          >
            DISCONNECT
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="succinct-wallet-connect">
      <div className="p-6 bg-gradient-to-r from-gray-900/80 to-black/80 rounded-xl border border-purple-500/50 backdrop-blur-md">
        <div className="text-center">
          <div className="mb-4">
            {/* Succinct Logo Animation */}
            <div className="inline-block relative">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold text-white succinct-logo-pulse">
                S
              </div>
              <div className="absolute inset-0 w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-ping opacity-20"></div>
            </div>
          </div>
          
          <div className="text-gray-300 mb-4">
            <p className="font-bold text-lg succinct-font">Wallet Required</p>
            <p className="text-sm">Connect to play Succinct Snake</p>
            <p className="text-xs text-purple-300 mt-1">Powered by Monad Network</p>
          </div>
          
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className={`px-8 py-4 ${
              isConnecting 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600'
            } text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-lg hover:shadow-purple-500/25 succinct-button`}
          >
            {isConnecting ? (
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>CONNECTING...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>🔗</span>
                <span>CONNECT WALLET</span>
              </div>
            )}
          </button>
          
          <div className="mt-4 text-xs text-gray-400">
            <p>🔒 Supports MetaMask on Monad Testnet</p>
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
      </div>
    </div>
  );
};

export default WalletConnect;