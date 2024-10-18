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

  const exp = useMemo(() => accountQuery.data?.experience ?? 0, [accountQuery.data?.experience])
  const strength = useMemo(() => accountQuery.data?.strength ?? 0, [accountQuery.data?.strength])
  const intelligence = useMemo(() => accountQuery.data?.intelligence ?? 0, [accountQuery.data?.intelligence])
  const dexterity = useMemo(() => accountQuery.data?.dexterity ?? 0, [accountQuery.data?.dexterity])
  const luck = useMemo(() => accountQuery.data?.luck ?? 0, [accountQuery.data?.luck])
  const playerClass = useMemo(() => accountQuery.data?.class ?? 0, [accountQuery.data?.class])
console.log(accountQuery.data)
  return accountQuery.isLoading ? (
    <span className="loading loading-spinner loading-lg"></span>
  ) : (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body p-6">
        <div className="flex flex-col items-center space-y-4">
          <h2 className="card-title text-2xl font-bold">
            Class {playerClass.toString()}
          </h2>
          <p className="text-xl font-semibold">{exp.toString()} EXP</p>
          
          <div className="flex justify-between w-full text-center">
            <div>
              <p className="text-sm font-medium">STR</p>
              <p className="text-lg font-bold">{strength.toString()}</p>
            </div>  
            <div>
              <p className="text-sm font-medium">INT</p>
              <p className="text-lg font-bold">{intelligence.toString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium">DEX</p>
              <p className="text-lg font-bold">{dexterity.toString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium">LCK</p>
              <p className="text-lg font-bold">{luck.toString()}</p>
            </div>
          </div>

          <button
            className="btn btn-primary w-full"
            onClick={() => clickMutation.mutateAsync()}
            disabled={clickMutation.isPending}
          >
            Click {clickMutation.isPending && '...'}
          </button>

          <p className="text-sm">
            <ExplorerLink path={`account/${account}`} label={ellipsify(account.toString())} />
          </p>
        </div>
      </div>
    </div>
  )
}

export { AtlasDungeonCard }
