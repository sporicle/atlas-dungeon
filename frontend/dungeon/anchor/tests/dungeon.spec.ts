import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Dungeon} from '../target/types/dungeon'

describe('dungeon', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Dungeon as Program<Dungeon>

  const dungeonKeypair = Keypair.generate()

  it('Initialize Dungeon', async () => {
    await program.methods
      .initialize()
      .accounts({
        dungeon: dungeonKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([dungeonKeypair])
      .rpc()

    const currentCount = await program.account.dungeon.fetch(dungeonKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Dungeon', async () => {
    await program.methods.increment().accounts({ dungeon: dungeonKeypair.publicKey }).rpc()

    const currentCount = await program.account.dungeon.fetch(dungeonKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Dungeon Again', async () => {
    await program.methods.increment().accounts({ dungeon: dungeonKeypair.publicKey }).rpc()

    const currentCount = await program.account.dungeon.fetch(dungeonKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Dungeon', async () => {
    await program.methods.decrement().accounts({ dungeon: dungeonKeypair.publicKey }).rpc()

    const currentCount = await program.account.dungeon.fetch(dungeonKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set dungeon value', async () => {
    await program.methods.set(42).accounts({ dungeon: dungeonKeypair.publicKey }).rpc()

    const currentCount = await program.account.dungeon.fetch(dungeonKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the dungeon account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        dungeon: dungeonKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.dungeon.fetchNullable(dungeonKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
