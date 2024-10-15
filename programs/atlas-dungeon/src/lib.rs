use anchor_lang::prelude::*;

declare_id!("EZ3Rap3QF8yrngyfRCZfziNDxb5PkWiQXAMJwS9vcb3t");

#[program]
pub mod atlas_dungeon {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
