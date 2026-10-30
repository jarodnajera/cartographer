import type { Access, AccountGateway } from './types'

export function createAccountService(gateway: AccountGateway) {
  let recoveryOwner: string | null = null
  async function action(work: () => Promise<void>, message: string) {
    try {
      await work()
      return { ok: true, message }
    } catch {
      return { ok: false, message: 'That request couldn’t be completed. Please try again.' }
    }
  }
  async function access(): Promise<Access> {
    try {
      const user = await gateway.currentUser()
      if (!user) return { status: 'anonymous' }
      if (!user.verified) return { status: 'verification-required' }
      const workspace = await gateway.workspace()
      if (!workspace || workspace.ownerId !== user.id || workspace.status !== 'active') {
        return { status: 'access-denied' }
      }
      return { status: 'ready', user, workspace }
    } catch {
      return { status: 'unavailable' }
    }
  }
  return {
    access,
    signUp: (email: string, password: string) => action(
      () => gateway.signUp(email.trim().toLowerCase(), password),
      'Check your email to verify your account. Private testing is limited to approved addresses.',
    ),
    signOut: () => action(() => gateway.signOut(), 'You have signed out.'),
    requestRecovery: (email: string, redirectTo: string) => action(
      () => gateway.requestRecovery(email.trim().toLowerCase(), redirectTo),
      'If an account exists for that address, a recovery link will be sent.',
    ),
    resendVerification: (email: string, redirectTo: string) => action(
      () => gateway.resendVerification(email.trim().toLowerCase(), redirectTo),
      'If verification is needed, a new verification email will be sent.',
    ),
    async signIn(email: string, password: string): Promise<Access> {
      try {
        await gateway.signIn(email.trim().toLowerCase(), password)
        return access()
      } catch (error) {
        if (typeof error === 'object' && error && 'code' in error && error.code === 'email_not_confirmed') {
          return { status: 'verification-required' }
        }
        return { status: 'unavailable' }
      }
    },
    async finishCallback(code: string) {
      recoveryOwner = null
      const kind = await gateway.finishCallback(code)
      if (kind === 'recovery') {
        const user = await gateway.currentUser()
        recoveryOwner = user?.verified ? user.id : null
      }
      return kind
    },
    async completeRecovery(password: string) {
      if (!recoveryOwner) return { ok: false, message: 'Request a new recovery link before changing your password.' }
      const user = await gateway.currentUser()
      if (!user?.verified || user.id !== recoveryOwner) return { ok: false, message: 'Request a new recovery link before changing your password.' }
      await gateway.updatePassword(password)
      recoveryOwner = null
      return { ok: true, message: 'Your password has been updated.' }
    },
  }
}
