import { ExplorerLink } from '../cluster/cluster-ui'
import { useTransactionContext } from './transaction-context'
import { useState } from 'react'
import { IconChevronRight, IconChevronLeft } from '@tabler/icons-react'

export function TransactionSidebar() {
  const { transactions } = useTransactionContext()
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className={`fixed right-0 top-20 bottom-4 bg-base-200 p-4 overflow-y-auto rounded-l-lg shadow-xl transition-all duration-300 ${isExpanded ? 'w-64' : 'w-12'}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute top-2 left-2 btn btn-sm btn-circle"
      >
        {isExpanded ? <IconChevronRight size={16} /> : <IconChevronLeft size={16} />}
      </button>
      {isExpanded && (
        <>
          <h2 className="text-xl font-bold mb-4 sticky top-0 bg-base-200 py-2 mt-4  ">Recent Transactions</h2>
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
        </>
      )}
    </div>
  )
}
