// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import AtlasDungeonIDL from '../target/idl/atlas_dungeon.json'
import type { AtlasDungeon } from '../target/types/atlas_dungeon'

// Re-export the generated IDL and type
export { AtlasDungeon, AtlasDungeonIDL }

// The programId is imported from the program IDL.
export const ATLAS_DUNGEON_PROGRAM_ID = new PublicKey(AtlasDungeonIDL.address)

// This is a helper function to get the AtlasDungeon Anchor program.
export function getAtlasDungeonProgram(provider: AnchorProvider) {
  return new Program(AtlasDungeonIDL as AtlasDungeon, provider)
}

// This is a helper function to get the program ID for the AtlasDungeon program depending on the cluster.
export function getAtlasDungeonProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Dungeon program on devnet and testnet.
      return new PublicKey('EioKfWZqL5cnvBCSMnDSdVUhUSG35qDo6M1fb2UTcMqH')
    case 'mainnet-beta':
    default:
      return ATLAS_DUNGEON_PROGRAM_ID
  }
}
