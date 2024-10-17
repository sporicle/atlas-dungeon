import { Keypair, PublicKey } from '@solana/web3.js'
import { useMemo } from 'react'
import { ExplorerLink } from '../cluster/cluster-ui'
import { ellipsify } from '../ui/ui-layout'
import { useAtlasDungeonProgram, useAtlasDungeonProgramAccount } from './dungeon-data-access'

export function AtlasDungeonCreate() {
  const { initialize } = useAtlasDungeonProgram()

  return (
    <button
      className="btn btn-xs lg:btn-md btn-primary"
      onClick={() => initialize.mutateAsync(Keypair.generate())}
      disabled={initialize.isPending}
    >
      Create Player {initialize.isPending && '...'}
    </button>
  )
}

export function AtlasDungeonList() {
  const { accounts, getProgramAccount } = useAtlasDungeonProgram()

  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }
  if (!getProgramAccount.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>Program account not found. Make sure you have deployed the program and are on the correct cluster.</span>
      </div>
    )
  }
  return (
    <div className={'space-y-6'}>
      {accounts.isLoading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : accounts.data?.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {accounts.data?.map((account) => (
            <AtlasDungeonCard key={account.publicKey.toString()} account={account.publicKey} />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h2 className={'text-2xl'}>No players</h2>
          No players found. Create one above to get started.
        </div>
      )}
    </div>
  )
}

function AtlasDungeonCard({ account }: { account: PublicKey }) {
  const { accountQuery, clickMutation } = useAtlasDungeonProgramAccount({
    account,
  })

  const coins = useMemo(() => accountQuery.data?.coins ?? 0, [accountQuery.data?.coins])

  return accountQuery.isLoading ? (
    <span className="loading loading-spinner loading-lg"></span>
  ) : (
    <div className="card card-bordered border-base-300 border-4 text-neutral-content">
      <div className="card-body items-center text-center">
        <div className="space-y-6">
          <h2 className="card-title justify-center text-3xl cursor-pointer" onClick={() => accountQuery.refetch()}>
            {coins.toString()} Coins
          </h2>
          <div className="card-actions justify-around">
            <button
              className="btn btn-xs lg:btn-md btn-primary"
              onClick={() => clickMutation.mutateAsync()}
              disabled={clickMutation.isPending}
            >
              Click {clickMutation.isPending && '...'}
            </button>
          </div>
          <div className="text-center space-y-4">
            <p>
              <ExplorerLink path={`account/${account}`} label={ellipsify(account.toString())} />
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export { AtlasDungeonCard }
