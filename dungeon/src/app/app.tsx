import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ClusterProvider } from '../components/cluster/cluster-data-access'
import { SolanaProvider } from '../components/solana/solana-provider'
import { TransactionProvider } from '../components/dungeon/transaction-context'
import { AppRoutes } from './app-routes'

const client = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={client}>
      <ClusterProvider>
        <SolanaProvider>
          <TransactionProvider>
            <AppRoutes />
          </TransactionProvider>
        </SolanaProvider>
      </ClusterProvider>
    </QueryClientProvider>
  )
}
