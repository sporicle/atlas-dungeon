import { getAtlasDungeonProgram, getAtlasDungeonProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'

import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function useAtlasDungeonProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getAtlasDungeonProgramId(cluster.network as Cluster), [cluster])
  const program = getAtlasDungeonProgram(provider)

  const accounts = useQuery({
    queryKey: ['atlas-dungeon', 'all', { cluster }],
    queryFn: () => program.account.playerState.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['atlas-dungeon', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ playerState: keypair.publicKey, user: provider.wallet.publicKey }).signers([keypair]).rpc(),
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

  const accountQuery = useQuery({
    queryKey: ['atlas-dungeon', 'fetch', { cluster, account }],
    queryFn: () => program.account.playerState.fetch(account),
  })

  const clickMutation = useMutation({
    mutationKey: ['atlas-dungeon', 'click', { cluster, account }],
    mutationFn: () => program.methods.click().accounts({ playerState: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    clickMutation,
  }
}
