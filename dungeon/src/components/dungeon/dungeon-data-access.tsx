import { getAtlasDungeonProgram, getAtlasDungeonProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'

import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { ClusterNetwork, useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'
import { useTransactionContext } from './transaction-context'
import { BN } from '@coral-xyz/anchor'

export function useAtlasDungeonProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getAtlasDungeonProgramId(cluster.network as Cluster), [cluster])
  const program = getAtlasDungeonProgram(provider)
  const { addTransaction } = useTransactionContext()

  const accounts = useQuery({
    queryKey: ['atlas-dungeon', 'all', { cluster }],
    queryFn: async () => {
      if (cluster.network === ClusterNetwork.Atlas) {
        const response = await connection.getProgramAccounts(programId, {
          filters: [
            {
              dataSize: 88,
            },
          ],
        })
        return response.map(({ pubkey, account }) => {
          const decodedData = {
            player: new PublicKey(account.data.slice(8, 40)),
            coins: new BN(account.data.slice(40, 48), 'le'),
            workers: new BN(account.data.slice(48, 56), 'le'),
            lastClickTime: new BN(account.data.slice(56, 64), 'le'),
            class: new BN(account.data.slice(64, 68), 'le'),
            experience: new BN(account.data.slice(68, 72), 'le'),
            strength: new BN(account.data.slice(72, 76), 'le'),
            intelligence: new BN(account.data.slice(76, 80), 'le'),
            dexterity: new BN(account.data.slice(80, 84), 'le'),
            luck: new BN(account.data.slice(84, 88), 'le'),
          }

          return {
            publicKey: pubkey,
            account: decodedData,
          }
        })
      } else {
        return program.account.playerState.all()
      }
    },
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['atlas-dungeon', 'initialize', { cluster }],
    mutationFn: async (keypair: Keypair) => {
      const signature = await program.methods
        .initialize(new BN(Math.floor(Math.random() * 5)), new BN(Math.floor(Math.random() * 5)+5),new BN(Math.floor(Math.random() * 5)+5),new BN(Math.floor(Math.random() * 5)+5),new BN(Math.floor(Math.random() * 5)+5))
        .accounts({ playerState: keypair.publicKey, user: provider.wallet.publicKey })
        .signers([keypair])
        .rpc()
      addTransaction(signature)
      return signature
    },
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useAtlasDungeonProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useAtlasDungeonProgram()
  const { addTransaction } = useTransactionContext()

  const accountQuery = useQuery({
    queryKey: ['atlas-dungeon', 'fetch', { cluster, account }],
    queryFn: () => program.account.playerState.fetch(account),
  })

  const clickMutation = useMutation({
    mutationKey: ['atlas-dungeon', 'click', { cluster, account }],
    mutationFn: async () => {
      const signature = await program.methods.click().accounts({ playerState: account }).rpc()
      addTransaction(signature)
      return signature
    },
    onSuccess: (signature) => {
      transactionToast(signature)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    clickMutation,
  }
}
