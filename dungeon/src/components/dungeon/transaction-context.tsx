import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useConnection } from '@solana/wallet-adapter-react'
import { TransactionSignature, Commitment } from '@solana/web3.js'

interface TransactionInfo {
  signature: TransactionSignature
  status: 'pending' | 'confirmed' | 'finalized' | 'failed'
  timestamp: number
}

interface TransactionContextType {
  transactions: TransactionInfo[]
  addTransaction: (signature: TransactionSignature) => void
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined)

export const useTransactionContext = () => {
  const context = useContext(TransactionContext)
  if (!context) {
    throw new Error('useTransactionContext must be used within a TransactionProvider')
  }
  return context
}

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<TransactionInfo[]>([])
  const { connection } = useConnection()

  const addTransaction = useCallback((signature: TransactionSignature) => {
    setTransactions((prev) => [
      { signature, status: 'pending', timestamp: Date.now() },
      ...prev.slice(0, 9), // Keep only the last 10 transactions
    ])
  }, [])

  const updateTransactionStatus = useCallback((signature: TransactionSignature, status: 'confirmed' | 'finalized' | 'failed') => {
    setTransactions((prev) =>
      prev.map((tx) =>
        tx.signature === signature ? { ...tx, status } : tx
      )
    )
  }, [])

  useEffect(() => {
    const checkTransactionStatus = async (signature: TransactionSignature) => {
      try {
        const signatureStatus = await connection.getSignatureStatus(signature, {
          searchTransactionHistory: true,
        })
        
        if (signatureStatus.value !== null) {
          if (signatureStatus.value.err) {
            updateTransactionStatus(signature, 'failed')
          } else if (signatureStatus.value.confirmationStatus === 'finalized') {
            updateTransactionStatus(signature, 'finalized')
          } else if (signatureStatus.value.confirmations !== null && signatureStatus.value.confirmations > 0) {
            updateTransactionStatus(signature, 'confirmed')
          }
        }
      } catch (error) {
        console.error('Error checking transaction status:', error)
      }
    }

    const intervalId = setInterval(() => {
      transactions.forEach((tx) => {
        if (tx.status === 'pending' || tx.status === 'confirmed') {
          checkTransactionStatus(tx.signature)
        }
      })
    }, 1000) // Check every 5 seconds

    return () => clearInterval(intervalId)
  }, [connection, transactions, updateTransactionStatus])

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction }}>
      {children}
    </TransactionContext.Provider>
  )
}
