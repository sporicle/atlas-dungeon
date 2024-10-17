import { ExplorerLink } from '../cluster/cluster-ui'
import { useTransactionContext } from './transaction-context'

export function TransactionSidebar() {
  const { transactions } = useTransactionContext()

  return (
    <div className="fixed right-4 top-20 bottom-4 w-64 bg-base-200 p-4 overflow-y-auto rounded-lg shadow-xl">
      <h2 className="text-xl font-bold mb-4 sticky top-0 bg-base-200 py-2">Recent Transactions</h2>
      <div className="space-y-4">
        {transactions.map((tx) => (
          <div
            key={tx.signature}
            className={`card ${
              tx.status === 'pending' ? 'bg-yellow-100' : 
              tx.status === 'confirmed' ? 'bg-blue-100' :
              tx.status === 'finalized' ? 'bg-green-100' : 'bg-red-100'
            } shadow-md transition-all duration-300 hover:shadow-lg`}
          >
            <div className="card-body p-3">
              <h3 className="card-title text-sm">
                {tx.status === 'pending' ? 'Pending' : 
                 tx.status === 'confirmed' ? 'Confirmed' :
                 tx.status === 'finalized' ? 'Finalized' : 'Failed'}
              </h3>
              <p className="text-xs">
                <ExplorerLink
                  path={`tx/${tx.signature}`}
                  label={`${tx.signature.slice(0, 8)}...`}
                />
              </p>
              <p className="text-xs">{new Date(tx.timestamp).toLocaleTimeString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
