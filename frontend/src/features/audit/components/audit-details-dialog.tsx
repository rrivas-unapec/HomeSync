import { ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogBody, DialogContent } from '@/components/ui/dialog'
import { AUDIT_ACTION_LABELS } from '@/lib/domain'
import { formatTimestamp } from '@/lib/format'
import { MESSAGES } from '@/lib/messages'
import { parseAuditDetails } from '../lib/audit-details'
import { actionTone, type AuditEntry } from '../types/audit'

interface AuditDetailsDialogProps {
  entry: AuditEntry | null
  onClose: () => void
}

export function AuditDetailsDialog({ entry, onClose }: AuditDetailsDialogProps) {
  const fields = entry === null ? [] : parseAuditDetails(entry.detallesCambio)

  return (
    <Dialog
      open={entry !== null}
      onOpenChange={(next) => {
        if (!next) onClose()
      }}
    >
      {entry !== null && (
        <DialogContent
          title={MESSAGES.adminAudit.detailsTitle}
          description={
            entry.propiedadTitulo ??
            `${MESSAGES.adminAudit.deletedProperty} #${String(entry.propiedadId)}`
          }
          className="max-w-xl"
        >
          <DialogBody className="gap-6">
            <dl className="grid grid-cols-1 gap-4 border-b border-border pb-6 sm:grid-cols-3">
              <div>
                <dt className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                  {MESSAGES.table.action}
                </dt>
                <dd className="mt-1.5">
                  <Badge tone={actionTone(entry.accion)}>{AUDIT_ACTION_LABELS[entry.accion]}</Badge>
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                  {MESSAGES.adminAudit.performedBy}
                </dt>
                <dd className="mt-1.5 text-sm text-foreground">
                  {entry.usuarioNombre ?? MESSAGES.adminAudit.systemUser}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                  {MESSAGES.adminAudit.performedOn}
                </dt>
                <dd className="mt-1.5 text-sm tabular-nums text-foreground">
                  {formatTimestamp(entry.fechaOperacion)}
                </dd>
              </div>
            </dl>

            {fields.length === 0 ? (
              <p className="text-sm text-muted-foreground">{MESSAGES.adminAudit.detailsEmpty}</p>
            ) : (
              <dl className="divide-y divide-border">
                {fields.map((field) => (
                  <div
                    key={field.key}
                    className="grid grid-cols-1 gap-1 py-3 first:pt-0 last:pb-0 sm:grid-cols-[10rem_1fr] sm:gap-4"
                  >
                    <dt className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground sm:pt-0.5">
                      {field.label}
                    </dt>
                    <dd
                      className={
                        field.isEmpty
                          ? 'text-sm italic text-muted-foreground'
                          : 'min-w-0 text-sm text-foreground text-pretty'
                      }
                    >
                      {field.isLink ? (
                        <a
                          href={field.value}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex items-center gap-1.5 break-all font-medium text-foreground underline underline-offset-2 transition-opacity duration-150 ease-out hover:opacity-60 motion-reduce:transition-none"
                        >
                          {MESSAGES.adminAudit.openPhoto}
                          <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                        </a>
                      ) : (
                        <span className={field.key === 'Precio' ? 'tabular-nums' : undefined}>
                          {field.value}
                        </span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </DialogBody>
        </DialogContent>
      )}
    </Dialog>
  )
}
