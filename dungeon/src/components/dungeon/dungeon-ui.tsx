import { Keypair, PublicKey } from '@solana/web3.js'
import { useMemo } from 'react'
import { ExplorerLink } from '../cluster/cluster-ui'
import { ellipsify } from '../ui/ui-layout'
import { useAtlasDungeonProgram, useAtlasDungeonProgramAccount } from './dungeon-data-access'
import class0 from '../../assets/chars/class-0.gif'
import class1 from '../../assets/chars/class-1.gif'
import class2 from '../../assets/chars/class-2.gif'
import class3 from '../../assets/chars/class-3.gif'
import class0Attack from '../../assets/chars/class-0-attack.gif'
import class1Attack from '../../assets/chars/class-1-attack.gif'
import class2Attack from '../../assets/chars/class-2-attack.gif'
import class3Attack from '../../assets/chars/class-3-attack.gif'
import monster0 from '../../assets/mons/mon-0.gif'
import monster1 from '../../assets/mons/mon-1.gif'
import monster2 from '../../assets/mons/mon-2.gif'
import monster3 from '../../assets/mons/mon-2.gif'
import bgImage from '../../assets/bg.png';

const classImages = [class0, class1, class2, class3]
const monsterImages = [monster0,monster1, monster2, monster3]
const classAttackImages = [class0Attack, class1Attack, class2Attack, class3Attack]

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
    <div className="flex">
      <div className="w-1/2 pr-4">
        <div className="grid grid-cols-2 gap-4">
          {accounts.isLoading ? (
            <span className="loading loading-spinner loading-lg"></span>
          ) : accounts.data?.length ? (
            accounts.data?.map((account) => (
              <AtlasDungeonCard key={account.publicKey.toString()} account={account.publicKey} />
            ))
          ) : (
            <div className="col-span-2 text-center">
              <h2 className="text-2xl">No players</h2>
              No players found. Create one above to get started.
            </div>
          )}
        </div>
      </div>
      <div className="w-1/2">
        <BattleArea accounts={accounts.data?.map((account) => account.publicKey) || []} />
      </div>
    </div>
  )
}

function getClassImage(classNumber: number) {
  return <img src={classImages[classNumber]} alt={`Class ${classNumber}`} className="w-24 h-24" />
}

function getClassAttackImage(classNumber: number) {
  return <img src={classAttackImages[classNumber]} alt={`Class ${classNumber}`} className="w-24 h-24" />
}

function getMonsterImage(classNumber: number) {
  return <img src={monsterImages[classNumber]} alt={`Class ${classNumber}`} className="w-24 h-24" />
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
  const { accountQuery, clickMutation, staticWallet } = useAtlasDungeonProgramAccount({
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

function BattleArea({ accounts }: { accounts: PublicKey[] }) {
  const uniqueClasses = new Set<number>()
  const playerCharacters: PublicKey[] = []
  const monsterCharacters: PublicKey[] = []

  // Try to select 3 unique classes for players
  for (const account of accounts) {
    if (playerCharacters.length < 3) {
      const { accountQuery } = useAtlasDungeonProgramAccount({ account })
      const playerClass = Number(accountQuery.data?.class ?? 0)
      playerCharacters.push(account)
      uniqueClasses.add(playerClass)
      if (uniqueClasses.size === 3) break
    }
  }

  // Fill remaining slots if needed
  while (playerCharacters.length < 3 && accounts.length > playerCharacters.length) {
    playerCharacters.push(accounts[playerCharacters.length])
  }

  // Select monsters (can be the same as players for now)
  monsterCharacters.push(...playerCharacters.slice(0, 3))

  return (
    <div 
      className="battle-area" 
      style={{ 
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '600px', 
        height: '300px', 
        position: 'relative',
      }}
    >
      <div className="absolute left-0 bottom-0 w-2/5 h-full flex items-end justify-around">
        {playerCharacters.map((publicKey, index) => (
          <CharacterSprite key={index} account={{ publicKey }} />
        ))}
      </div>
      <div className="absolute right-0 bottom-0 w-2/5 h-full flex items-end justify-around">
        {monsterCharacters.map((publicKey, index) => (
          <CharacterSprite key={index} account={{ publicKey }} isMonster={true} />
        ))}
      </div>
    </div>
  )
}

function CharacterSprite({ account, isMonster = false }: { account: { publicKey: PublicKey }, isMonster?: boolean }) {
  const { accountQuery } = useAtlasDungeonProgramAccount({ account: account.publicKey })
  const playerClass = useMemo(() => accountQuery.data?.class ?? 0, [accountQuery.data?.class])

  return (
    <div className={`w-24 h-24 ${isMonster ? 'transform scale-x-[-1]' : ''}`}>
      {isMonster ? getMonsterImage(parseInt(playerClass.toString())) : getClassAttackImage(parseInt(playerClass.toString()))}
    </div>
  )
}
