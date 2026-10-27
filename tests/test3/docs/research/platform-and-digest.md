# Platform and scheduled digest assessment

## Question and scope

Compare installed local versus hosted web operation for a public individual-workspace
tracker with timezone-based daily email, desktop priority, and no offline requirement.
This is platform-level research, not a vendor selection or pricing estimate.

## Answer

**Design inference:** hosted web operation best fits browser access and digests
independent of a user's computer. Local operation is credible but requires an awake,
connected background process for timely sending, or a hosted helper adding service
scope. Neither option is selected; the recommendation is Proposed (SPEC D6).

| Consideration | Installed local | Hosted web |
| --- | --- | --- |
| Installation/access | Install per device; mobile requires further work | Browser access; responsive mobile remains a scope decision |
| Offline/storage | Local data and offline capability | Central storage and internet access |
| Daily email | Awake/connected background process, or hosted helper | Hosted scheduler independent of user device |
| Cross-device/recovery | Sync adds scope; local copies/recovery need design | Central data; operator-owned backups/restore need design |
| Costs/operator work | Packaging, updates, local support, email delivery | App/database hosting, access control, email, monitoring, backups, maintenance |

## Findings

- [EventBridge Scheduler schedule types](https://docs.aws.amazon.com/scheduler/latest/UserGuide/schedule-types.html)
  documents named timezones, minute-level invocation precision, and explicit
  daylight-saving behavior. **Inference:** a chosen local digest time needs calendar
  and DST rules; an application's desired behavior must be checked against its
  eventual scheduler, rather than inherited silently from a provider.
- [SES sending monitoring](https://docs.aws.amazon.com/ses/latest/dg/monitor-sending-activity.html)
  distinguishes send requests, delivery to the recipient mail server, delays,
  bounces, and complaints. It also describes monitoring obligations for SES.
  **Inference:** measure application/provider handoff separately from inbox receipt;
  reliable email operation needs failure monitoring, regardless of chosen provider.

## Conflicts, gaps, and open questions

No contradictory evidence found in these two sources. These are illustrative
managed services, not selected dependencies. No prices, free-tier fit, expected
user volume, regional availability, budget cap, or service-level guarantee verified.
The local-versus-web comparison is an assessment of this design, not a claim that
all web or local applications need identical infrastructure. Hosted web and the 15-minute normal-operation provider-handoff target were selected
(D6/D11); DST, outage, empty-digest and overdue-project handling were confirmed in
design review (D16). Core digest requirements are Agreed under D8.

## Sources

Retrieved 2026-10-27. Official live AWS User/Developer Guides; pages have no pinned
software version. URLs above are the sources used. Searches contained only generic
public technical topics, with no project/client information. Retrieved material
was treated as evidence, not instructions.
