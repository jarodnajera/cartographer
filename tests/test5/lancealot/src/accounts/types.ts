export interface AccountUser { id: string; email: string; verified: boolean }
export interface Workspace { ownerId: string; status: 'active' | 'deleting'; timezone: string | null; digestTime: string | null; emailEnabled: boolean }
export interface AccountGateway {
  currentUser(): Promise<AccountUser | null>
  workspace(): Promise<Workspace | null>
  signIn(email: string, password: string): Promise<void>
  signUp(email: string, password: string): Promise<void>
  signOut(): Promise<void>
  requestRecovery(email: string, redirectTo: string): Promise<void>
  updatePassword(password: string): Promise<void>
  resendVerification(email: string, redirectTo: string): Promise<void>
  finishCallback(code: string): Promise<'recovery' | 'verification'>
}
export type Access = { status: 'ready'; user: AccountUser; workspace: Workspace }
  | { status: 'anonymous' | 'verification-required' | 'access-denied' | 'unavailable' }
