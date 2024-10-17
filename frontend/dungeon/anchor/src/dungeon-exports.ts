// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import DungeonIDL from '../target/idl/dungeon.json'
import type { Dungeon } from '../target/types/dungeon'

// Re-export the generated IDL and type
export { Dungeon, DungeonIDL }

// The programId is imported from the program IDL.
export const DUNGEON_PROGRAM_ID = new PublicKey(DungeonIDL.address)

// This is a helper function to get the Dungeon Anchor program.
export function getDungeonProgram(provider: AnchorProvider) {
  return new Program(DungeonIDL as Dungeon, provider)
}

// This is a helper function to get the program ID for the Dungeon program depending on the cluster.
export function getDungeonProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Dungeon program on devnet and testnet.
      return new PublicKey('645Q1RQFEc9JaBpk5zGrjuqNr9P452azRmuxe5YLKhdR')
    case 'mainnet-beta':
    default:
      return DUNGEON_PROGRAM_ID
  }
}
