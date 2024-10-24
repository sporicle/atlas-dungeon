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
import { useState, useEffect } from 'react'

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

function calculateLevelAndProgress(exp: number): { level: number; progress: number; nextLevelExp: number } {
  const levelThresholds = [0, 5, 10, 20, 40, 100];
  let level = 0;
  let nextLevelExp = levelThresholds[1];

  for (let i = 1; i < levelThresholds.length; i++) {
    if (exp >= levelThresholds[i]) {
      level = i;
    } else {
      nextLevelExp = levelThresholds[i];
      break;
    }
  }

  const currentLevelExp = levelThresholds[level];
  const progress = ((exp - currentLevelExp) / (nextLevelExp - currentLevelExp)) * 100;

  return { level: level + 1, progress, nextLevelExp };
}

function AtlasDungeonCard({ account }: { account: PublicKey }) {
  const { accountQuery, clickMutation, staticWallet } = useAtlasDungeonProgramAccount({
    account,
  })

  const exp = useMemo(() => accountQuery.data?.experience ?? 0, [accountQuery.data?.experience])
  const { level, progress, nextLevelExp } = useMemo(() => calculateLevelAndProgress(Number(exp)), [exp])

  const levelBonus = useMemo(() => (level - 1) * 2, [level]); // 2 points per level, starting from level 2

  const strength = useMemo(() => Number(accountQuery.data?.strength ?? 0) + levelBonus, [accountQuery.data?.strength, levelBonus])
  const intelligence = useMemo(() => Number(accountQuery.data?.intelligence ?? 0) + levelBonus, [accountQuery.data?.intelligence, levelBonus])
  const dexterity = useMemo(() => Number(accountQuery.data?.dexterity ?? 0) + levelBonus, [accountQuery.data?.dexterity, levelBonus])
  const luck = useMemo(() => Number(accountQuery.data?.luck ?? 0) + levelBonus, [accountQuery.data?.luck, levelBonus])
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
        <div className="w-full mt-2 flex items-center">
          <span className="text-sm font-bold mr-2 w-1/5">Lvl {level}</span>
          <div className="w-3/5 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 relative group">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded p-1">
              {Number(exp)}/{nextLevelExp} EXP
            </div>
          </div>
        </div>
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
          <ExplorerLink path={`address/${account}`} label={ellipsify(account.toString())} />
        </p>
      </div>
    </div>
  )
}

export { AtlasDungeonCard }

function GoldInfoCard({ totalGold, goldPerMinute }: { totalGold: number; goldPerMinute: number }) {
  return (
    <div className="card bg-base-200 shadow-xl p-3 w-[750px]">
      <div className="flex flex-col items-center">
        <div className="grid grid-cols-4 gap-x-4 text-sm mt-2 w-full">
          <div className="font-bold">Gold:</div>
          <div>{Math.floor(totalGold)}</div>
          <div className="font-bold">Gold/min:</div>
          <div>{goldPerMinute}</div>
        </div>
        <div className="text-xs mt-2 text-center">
          Gold/minute is calculated based on the stats of your party.
        </div>
      </div>
    </div>
  )
}

function BattleArea({ accounts }: { accounts: PublicKey[] }) {
  const [playerCharacters, setPlayerCharacters] = useState<PublicKey[]>([])
  const [goldPerMinute, setGoldPerMinute] = useState(0)
  const [totalGold, setTotalGold] = useState(0)

  // Use the hook for each account
  const accountData = accounts.map(account => useAtlasDungeonProgramAccount({ account }))

  useEffect(() => {
    const uniqueClasses = new Set<number>()
    const selectedPlayers: PublicKey[] = []

    // Try to select 3 unique classes for players
    for (const account of accounts) {
      if (selectedPlayers.length < 3) {
        selectedPlayers.push(account)
        if (uniqueClasses.size === 3) break
      }
    }

    // Fill remaining slots if needed
    while (selectedPlayers.length < 3 && accounts.length > selectedPlayers.length) {
      selectedPlayers.push(accounts[selectedPlayers.length])
    }

    setPlayerCharacters(selectedPlayers)
  }, [accounts])

  useEffect(() => {
    const calculateGoldPerMinute = () => {
      let totalStats = 0
      for (const { accountQuery } of accountData) {
        if (accountQuery.data) {
          const { level } = calculateLevelAndProgress(Number(accountQuery.data.experience ?? 0));
          const levelBonus = (level - 1) * 2; // 2 points per level, starting from level 2
          
          totalStats += Number(accountQuery.data.strength ?? 0) + levelBonus;
          totalStats += Number(accountQuery.data.intelligence ?? 0) + levelBonus;
          totalStats += Number(accountQuery.data.dexterity ?? 0) + levelBonus;
          totalStats += Number(accountQuery.data.luck ?? 0) + levelBonus;
        }
      }
      setGoldPerMinute(totalStats*6+13)
    }

    calculateGoldPerMinute()
  }, [accountData])

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalGold(prevGold => prevGold + goldPerMinute / (60*10))
    }, 100)

    return () => clearInterval(interval)
  }, [goldPerMinute])

  return (
    <div>
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
          {playerCharacters.map((publicKey, index) => (
            <CharacterSprite key={index} account={{ publicKey }} isMonster={true} />
          ))}
        </div>
      </div>
      <div className="mt-4 flex justify-center">
        <GoldInfoCard totalGold={totalGold} goldPerMinute={goldPerMinute} />
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
