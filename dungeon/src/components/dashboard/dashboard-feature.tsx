import { useWallet } from '@solana/wallet-adapter-react'
import { ExplorerLink } from '../cluster/cluster-ui'
import { WalletButton } from '../solana/solana-provider'
import { AppHero, ellipsify } from '../ui/ui-layout'
import { useAtlasDungeonProgram } from '../dungeon/dungeon-data-access'
import { AtlasDungeonCreate, AtlasDungeonList } from '../dungeon/dungeon-ui'
import { TransactionSidebar } from '../dungeon/transaction-sidebar'

export default function DashboardFeature() {
  const { publicKey } = useWallet()
  const { programId } = useAtlasDungeonProgram()

  return publicKey ? (
    <div className="container mx-auto px-4">
      <AppHero
        title="Atlas Dungeon"
        subtitle={''}
      >
        <p className="mb-6">
          <ExplorerLink path={`address/${programId}`} label={ellipsify(programId.toString())} />
        </p>
        <AtlasDungeonCreate />
      </AppHero>
      <AtlasDungeonList />
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
