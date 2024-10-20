#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("EsQ7uzLEkipUf8eWCshSGnVHnNZnwF3pJ4eBf1ziSvJm");

#[program]
pub mod atlas_dungeon {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, class: u64, strength: u64, intelligence: u64, dexterity: u64, luck: u64) -> Result<()> {
        let player_state = &mut ctx.accounts.player_state;
        player_state.player = ctx.accounts.user.key();
        player_state.coins = 0;
        player_state.workers = 0;
        player_state.class = class;
        player_state.experience = 0;
        player_state.strength = strength;
        player_state.intelligence = intelligence;
        player_state.dexterity = dexterity;
        player_state.luck = luck;
        player_state.last_click_time = 0;
        msg!("Player Account Created");
        msg!("Class: {}", player_state.class);
        msg!("Strength: {}", player_state.strength);
        msg!("Intelligence: {}", player_state.intelligence);
        msg!("Dexterity: {}", player_state.dexterity);
        msg!("Luck: {}", player_state.luck);
        Ok(())
    }

    pub fn click(ctx: Context<Click>) -> Result<()> {
        let player_state = &mut ctx.accounts.player_state;
        player_state.experience = player_state.experience.checked_add(1).unwrap();
        player_state.last_click_time = Clock::get()?.unix_timestamp;
        msg!("Clicked! Current experience: {}", player_state.experience);
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
    pub class: u64,
    pub experience: u64,
    pub strength: u64,
    pub intelligence: u64,
    pub dexterity: u64,
    pub luck: u64,
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
