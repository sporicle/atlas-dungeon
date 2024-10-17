#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("645Q1RQFEc9JaBpk5zGrjuqNr9P452azRmuxe5YLKhdR");

#[program]
pub mod dungeon {
    use super::*;

  pub fn close(_ctx: Context<CloseDungeon>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.dungeon.count = ctx.accounts.dungeon.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.dungeon.count = ctx.accounts.dungeon.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeDungeon>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.dungeon.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeDungeon<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Dungeon::INIT_SPACE,
  payer = payer
  )]
  pub dungeon: Account<'info, Dungeon>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseDungeon<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub dungeon: Account<'info, Dungeon>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub dungeon: Account<'info, Dungeon>,
}

#[account]
#[derive(InitSpace)]
pub struct Dungeon {
  count: u8,
}
