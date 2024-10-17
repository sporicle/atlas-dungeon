import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AtlasDungeon } from "../target/types/atlas_dungeon";
import { expect } from "chai";

describe("atlas-dungeon", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.AtlasDungeon as Program<AtlasDungeon>;
  const playerState = anchor.web3.Keypair.generate();

  it("Is initialized!", async () => {
    const tx = await program.methods
      .initialize()
      .accounts({ playerState: playerState.publicKey })
      .signers([playerState])
      .rpc();

    const account = await program.account.playerState.fetch(playerState.publicKey);
    expect(account.coins.toNumber()).to.equal(0);
    expect(account.workers.toNumber()).to.equal(0);
    expect(account.lastClickTime.toNumber()).to.equal(0);
  });

  it("Clicked", async () => {
    const tx = await program.methods
      .click()
      .accounts({ playerState: playerState.publicKey, user: provider.wallet.publicKey })
      .rpc();

    const account = await program.account.playerState.fetch(playerState.publicKey);
    expect(account.coins.toNumber()).to.equal(1);
    expect(account.lastClickTime).to.not.equal(0);
  });
});
