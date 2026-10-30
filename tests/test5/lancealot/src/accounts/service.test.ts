import { describe, expect, it } from 'vitest'
import { createAccountService } from './service'
import type { AccountGateway } from './types'

function gateway(overrides: Partial<AccountGateway> = {}): AccountGateway {
  return {
    currentUser: async () => ({ id: 'owner-a', email: 'alex@example.test', verified: false }),
    workspace: async () => ({ ownerId: 'owner-a', status: 'active', timezone: null, digestTime: null, emailEnabled: false }),
    signIn: async () => {}, signUp: async () => {}, signOut: async () => {},
    requestRecovery: async () => {}, updatePassword: async () => {},
    resendVerification: async () => {}, finishCallback: async () => 'verification',
    ...overrides,
  }
}

describe('private account access', () => {
  it('keeps an unverified account out of its workspace', async () => {
    const accounts = createAccountService(gateway())
    expect(await accounts.access()).toEqual({ status: 'verification-required' })
  })

  it('opens a verified owner’s active workspace', async () => {
    const accounts = createAccountService(gateway({
      currentUser: async () => ({ id: 'owner-a', email: 'alex@example.test', verified: true }),
    }))
    expect(await accounts.access()).toEqual({
      status: 'ready',
      user: { id: 'owner-a', email: 'alex@example.test', verified: true },
      workspace: { ownerId: 'owner-a', status: 'active', timezone: null, digestTime: null, emailEnabled: false },
    })
  })

  it.each([
    { ownerId: 'owner-b', status: 'active' as const },
    { ownerId: 'owner-a', status: 'deleting' as const },
  ])('denies unavailable ownership or deletion state: $ownerId / $status', async (workspace) => {
    const accounts = createAccountService(gateway({
      currentUser: async () => ({ id: 'owner-a', email: 'alex@example.test', verified: true }),
      workspace: async () => ({ ...workspace, timezone: null, digestTime: null, emailEnabled: false }),
    }))
    expect(await accounts.access()).toEqual({ status: 'access-denied' })
  })

  it('does not turn a failed identity check into an authenticated workspace', async () => {
    const accounts = createAccountService(gateway({ currentUser: async () => { throw new Error('network unavailable') } }))
    expect(await accounts.access()).toEqual({ status: 'unavailable' })
  })

  it('checks verified access after password sign-in instead of trusting the sign-in response', async () => {
    const accounts = createAccountService(gateway())
    expect(await accounts.signIn('alex@example.test', 'fictional-password')).toEqual({ status: 'verification-required' })
  })

  it('requires a valid recovery callback before changing a password', async () => {
    const accounts = createAccountService(gateway())
    expect(await accounts.completeRecovery('new-fictional-password')).toEqual({
      ok: false, message: 'Request a new recovery link before changing your password.',
    })
  })

  it('accepts a recovery callback once and lets its verified account update the password', async () => {
    const accounts = createAccountService(gateway({
      currentUser: async () => ({ id: 'owner-a', email: 'alex@example.test', verified: true }),
      finishCallback: async () => 'recovery',
    }))
    expect(await accounts.finishCallback('fixture-auth-code')).toBe('recovery')
    expect(await accounts.completeRecovery('new-fictional-password')).toEqual({ ok: true, message: 'Your password has been updated.' })
    expect(await accounts.completeRecovery('another-password')).toEqual({ ok: false, message: 'Request a new recovery link before changing your password.' })
  })

  it('does not authorize recovery from an ordinary verification link', async () => {
    const accounts = createAccountService(gateway())
    await accounts.finishCallback('ordinary-verification-code')
    expect((await accounts.completeRecovery('new-password')).ok).toBe(false)
  })

  it('fails closed when password sign-in itself fails', async () => {
    const accounts = createAccountService(gateway({ signIn: async () => { throw new Error('provider unavailable') } }))
    expect(await accounts.signIn('alex@example.test', 'fictional-password')).toEqual({ status: 'unavailable' })
  })

  it('does not carry a recovery permission into a different signed-in account', async () => {
    let owner = 'owner-a'
    const accounts = createAccountService(gateway({
      currentUser: async () => ({ id: owner, email: 'alex@example.test', verified: true }),
      finishCallback: async () => 'recovery',
    }))
    await accounts.finishCallback('fixture-recovery-code')
    owner = 'owner-b'
    expect((await accounts.completeRecovery('different-account-password')).ok).toBe(false)
  })
})
