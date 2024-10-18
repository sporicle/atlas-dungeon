import { Keypair, PublicKey } from '@solana/web3.js'
import { useMemo } from 'react'
import { ExplorerLink } from '../cluster/cluster-ui'
import { ellipsify } from '../ui/ui-layout'
import { useAtlasDungeonProgram, useAtlasDungeonProgramAccount } from './dungeon-data-access'
import class0 from '../../assets/class-0.gif'
import class1 from '../../assets/class-1.gif'
import class2 from '../../assets/class-2.gif'
import class3 from '../../assets/class-3.gif'

const classImages = [class0, class1, class2, class3]

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
        <div className="grid md:grid-cols-3 gap-4">
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

function getClassImage(classNumber: number) {
  return <img src={classImages[classNumber]} alt={`Class ${classNumber}`} className="w-24 h-24" />
}

function getClassName(classNumber: number) {
  switch (classNumber) {
    case 0:
      return 'Mage'
    case 1:
      return 'Archer'
    case 2:
      return 'Knight'
    case 3:
      return 'Cleric'
    case 4:
      return 'Axeman'
  }
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

  return accountQuery.isLoading ? (
    <span className="loading loading-spinner loading-lg"></span>
  ) : (
    <div className="card bg-base-200 shadow-xl p-3 w-[200px]">
      <div className="flex flex-col items-center">
        {getClassImage(parseInt(playerClass.toString()))}
        <h2 className="card-title text-lg font-bold mt-2">
          {getClassName(parseInt(playerClass.toString()))}
        </h2>
        <p className="text-sm">{exp.toString()} EXP</p>
        <div className="grid grid-cols-2 gap-x-4 text-sm mt-2">
          <div>STR: {strength.toString()}</div>
          <div>INT: {intelligence.toString()}</div>
          <div>DEX: {dexterity.toString()}</div>
          <div>LCK: {luck.toString()}</div>
        </div>
        <button
          className="btn btn-primary btn-sm mt-3 w-50%"
          onClick={() => clickMutation.mutateAsync()}
          disabled={clickMutation.isPending}
        >
          Train {clickMutation.isPending && '...'}
        </button>
        <p className="text-xs mt-2">
          <ExplorerLink path={`account/${account}`} label={ellipsify(account.toString())} />
        </p>
      </div>
    </div>
  )
}

export { AtlasDungeonCard }
