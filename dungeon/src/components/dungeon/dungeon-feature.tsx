import { useWallet } from '@solana/wallet-adapter-react'
import { ExplorerLink } from '../cluster/cluster-ui'
import { WalletButton } from '../solana/solana-provider'
import { AppHero, ellipsify } from '../ui/ui-layout'
import { useAtlasDungeonProgram } from './dungeon-data-access'
import { AtlasDungeonCreate, AtlasDungeonList } from './dungeon-ui'
import { TransactionSidebar } from './transaction-sidebar'

export default function AtlasDungeonFeature() {
  const { publicKey } = useWallet()
  const { programId } = useAtlasDungeonProgram()

  return publicKey ? (
    <div className="flex">
      <div className="flex-grow">
        <AppHero
          title="Atlas Dungeon"
          subtitle={
            'Create a new player by clicking the "Create Player" button. Click to earn coins and compete with other players!'
          }
        >
          <p className="mb-6">
            <ExplorerLink path={`account/${programId}`} label={ellipsify(programId.toString())} />
          </p>
          <AtlasDungeonCreate />
        </AppHero>
        <AtlasDungeonList />
      </div>
      <TransactionSidebar />
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton />
        </div>
      </div>
    </div>
  )
}
