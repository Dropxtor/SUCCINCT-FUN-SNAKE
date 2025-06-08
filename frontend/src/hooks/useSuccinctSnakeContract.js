import { useState, useCallback } from 'react';
import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { SUCCINCT_SNAKE_CONTRACT_ADDRESS, SUCCINCT_SNAKE_ABI } from '../contracts/SuccinctSnakeContract';

export const useSuccinctSnakeContract = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastTxHash, setLastTxHash] = useState(null);

  // Write contract hook for submitting scores
  const { writeContract } = useWriteContract();

  // Wait for transaction receipt
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: lastTxHash,
  });

  // Submit score to blockchain
  const submitScore = useCallback(async (score) => {
    try {
      setIsSubmitting(true);
      
      // If no contract deployed yet, simulate transaction
      if (SUCCINCT_SNAKE_CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
        console.log('🔗 Simulating Monad transaction for score:', score);
        
        // Simulate blockchain transaction delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate successful transaction
        const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
        setLastTxHash(mockTxHash);
        
        console.log('✅ Simulated transaction hash:', mockTxHash);
        console.log('💰 Score submitted to Monad blockchain:', score);
        
        return {
          hash: mockTxHash,
          success: true,
          simulated: true
        };
      }

      // Real contract interaction
      const txHash = await writeContract({
        address: SUCCINCT_SNAKE_CONTRACT_ADDRESS,
        abi: SUCCINCT_SNAKE_ABI,
        functionName: 'submitScore',
        args: [BigInt(score)],
        value: parseEther('0.001'), // Small fee for transaction
      });

      setLastTxHash(txHash);
      console.log('🔗 Real transaction submitted:', txHash);

      return {
        hash: txHash,
        success: true,
        simulated: false
      };

    } catch (error) {
      console.error('❌ Error submitting score to blockchain:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [writeContract]);

  // Read player high score from contract
  const { data: playerHighScore, refetch: refetchHighScore } = useReadContract({
    address: SUCCINCT_SNAKE_CONTRACT_ADDRESS,
    abi: SUCCINCT_SNAKE_ABI,
    functionName: 'getPlayerHighScore',
    args: [], // Will be set when we have player address
  });

  // Read top players from contract
  const { data: topPlayers, refetch: refetchTopPlayers } = useReadContract({
    address: SUCCINCT_SNAKE_CONTRACT_ADDRESS,
    abi: SUCCINCT_SNAKE_ABI,
    functionName: 'getTopPlayers',
  });

  return {
    // Actions
    submitScore,
    refetchHighScore,
    refetchTopPlayers,
    
    // State
    isSubmitting,
    isConfirming,
    isConfirmed,
    lastTxHash,
    
    // Data
    playerHighScore: playerHighScore ? Number(playerHighScore) : 0,
    topPlayers: topPlayers ? {
      players: topPlayers[0] || [],
      scores: topPlayers[1]?.map(score => Number(score)) || []
    } : { players: [], scores: [] },
  };
};