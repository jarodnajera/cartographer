export type Kind = 'client' | 'project' | 'task' | 'invoice'
export type ProjectStatus = 'active' | 'completed' | 'archived'
export interface RecordBase { id: string; owner_id: string; version: number }
export interface Client extends RecordBase { name: string }
export interface Project extends RecordBase { client_id: string; name: string; deadline: string | null; status: ProjectStatus }
export interface Task extends RecordBase { project_id: string; title: string; followup_date: string | null; completed: boolean }
export interface Invoice extends RecordBase { project_id: string; client_id: string; reference: string; amount: string; currency: string; currency_digits: number; due_date: string; paid: boolean }
export interface Settings { owner_id: string; timezone: string | null; digest_time: string | null; email_enabled: boolean; version: number }
export interface Snapshot { clients: Client[]; projects: Project[]; tasks: Task[]; invoices: Invoice[]; settings: Settings }
export interface Attention { kind: 'task' | 'project' | 'invoice'; id: string; title: string; relevant_date: string; project_id: string; project_name: string; client_name: string; project_status: ProjectStatus }
export type Entity = Client | Project | Task | Invoice
export interface Features { digest: boolean; deletion: boolean; status?: {state: string; date: string; attempts: number} | null }
export interface Gateway {
  features(): Promise<Features>
  removeAccount(password: string): Promise<void>
  load(): Promise<Snapshot>
  attention(): Promise<Attention[]>
  save(kind: Kind, data: Record<string, unknown>, id?: string, version?: number): Promise<void>
  remove(kind: Kind, id: string, version: number): Promise<void>
  settings(timezone: string, time: string | null, enabled: boolean, version: number): Promise<void>
  export(): Promise<unknown>
}
