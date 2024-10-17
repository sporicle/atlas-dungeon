#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("EioKfWZqL5cnvBCSMnDSdVUhUSG35qDo6M1fb2UTcMqH");

#[program]
pub mod atlas_dungeon {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let player_state = &mut ctx.accounts.player_state;
        player_state.player = ctx.accounts.user.key();
        player_state.coins = 0;
        player_state.workers = 0;
        player_state.last_click_time = 0;
        msg!("Player Account Created");
        Ok(())
    }

    pub fn click(ctx: Context<Click>) -> Result<()> {
        let player_state = &mut ctx.accounts.player_state;
        player_state.coins = player_state.coins.checked_add(1).unwrap();
        player_state.last_click_time = Clock::get()?.unix_timestamp;
        msg!("Clicked! Current coins: {}", player_state.coins);
        msg!("Last click time: {}", player_state.last_click_time);
        Ok(())
    }
}

#[account]
#[derive(InitSpace)]
pub struct PlayerState {
    pub player: Pubkey,
    pub coins: u64,
    pub workers: u64,
    pub last_click_time: i64,
}

const DISCRIMINATOR: usize = 8;

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init,
        payer = user,
        space = DISCRIMINATOR + PlayerState::INIT_SPACE
    )]
    pub player_state: Account<'info, PlayerState>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Click<'info> {
    #[account(mut)]
    pub player_state: Account<'info, PlayerState>,
    pub clock: Sysvar<'info, Clock>,   
    pub user: Signer<'info>,
}
