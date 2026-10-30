# Gate account access and reminders before resumable deletion

Status: Accepted — 2026-10-30; separately authorized by the user with final plan/design acceptance.

Lancealot must close an individual workspace without leaving access or reminders active when identity/data cleanup fails partway through. After fresh password verification and explicit irreversible confirmation, persist deletion intent, block subsequent workspace access/mutation/export and new digest dispatch, then perform idempotent resumable cleanup across records and the auth identity. Preserve enough durable intent to resume even after identity removal; this trades additional coordination for safe interruption handling compared with relying on one auth-delete/cascade operation or browser sign-out.

Previously issued tokens and privileged functions require real access-gate checks; the UI receipt alone proves nothing. Distinguish request accepted, incomplete cleanup and completed active-data removal; do not promise backup expiry or recall of email already dispatched/accepted. No cancellable grace period is introduced.

The accepted [export/deletion plan](../plans/export-and-account-deletion.md) and [digest plan](../plans/today-and-daily-digest.md) define the interfaces, races and verification seams. D16 retains numeric retention/recovery/deletion/retry targets, provider plans/region, capacity, costs and operator/support ownership as gates before real-data public beta. This decision authorizes no provisioning, production code or immediate execution of deletion.
