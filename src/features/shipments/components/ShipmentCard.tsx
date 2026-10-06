import { useId } from 'react'
import assignIcon from '@/assets/icons/assign.svg'
import boxSeamSmallIcon from '@/assets/icons/box-seam-sm.svg'
import boxSeamIcon from '@/assets/icons/box-seam.svg'
import cashCoinIcon from '@/assets/icons/cash-coin.svg'
import chevronIcon from '@/assets/icons/chevron-down-card.svg'
import locateIcon from '@/assets/icons/locate-fixed.svg'
import volumeIcon from '@/assets/icons/volume.svg'
import weightIcon from '@/assets/icons/weight.svg'
import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { cn } from '@/lib/cn'
import { formatCompactCurrency, formatDateTime, formatVolume, formatWeight } from '@/lib/format'
import { PRIORITY_BG_CLASSES } from '../constants'
import type { ShipmentDetails, ShipmentPackage } from '../types'
import { SHIPMENT_ACTION_LABELS, type ShipmentAction } from '../utils/shipmentActions'
import { formatAssignment, formatPriorityAndStatus } from '../utils/shipmentLabels'
import { getShipmentMetrics } from '../utils/shipmentMetrics'

interface ShipmentCardProps {
  details: ShipmentDetails
  isExpanded: boolean
  onToggle: () => void
  onLocate: () => void
  /** Solo se pasa si el envío se puede (re)asignar: la card no conoce las reglas de negocio. */
  onAssign?: () => void
  /** Acciones de estado disponibles, al pie del detalle. */
  actions: readonly ShipmentAction[]
  onAction: (action: ShipmentAction) => void
}

/**
 * Card de envío del UI Kit: colapsada (número + ubicar) y expandida (métricas, paquetes,
 * asignación y acciones). Es presentacional: recibe datos y callbacks.
 */
export function ShipmentCard({
  details,
  isExpanded,
  onToggle,
  onLocate,
  onAssign,
  actions,
  onAction,
}: ShipmentCardProps) {
  const { shipment, driver, vehicle, metrics } = details
  const bodyId = useId()

  return (
    <article
      aria-label={`Entrega ${shipment.id}`}
      className={cn('overflow-hidden rounded-m bg-surface-02', isExpanded && 'ring-1 ring-brand')}
    >
      <header className="flex items-center justify-between gap-3 p-3">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isExpanded}
          aria-controls={isExpanded ? bodyId : undefined}
          className="flex min-w-0 flex-1 flex-col items-start gap-1 text-left focus-ring"
        >
          <span className="text-small font-semibold">Entrega {shipment.id}</span>
          <span className="text-tiny">{shipment.trackingCode}</span>
          <span className="flex items-center gap-1.5 text-tiny text-text-secondary">
            <span
              aria-hidden="true"
              className={cn('size-2 shrink-0 rounded-full', PRIORITY_BG_CLASSES[shipment.priority])}
            />
            {formatPriorityAndStatus(shipment)} · ETA {formatDateTime(shipment.estimatedDelivery)}
          </span>
        </button>
        <div className="flex shrink-0 items-center gap-4">
          <IconButton
            icon={locateIcon}
            iconSize={20}
            label="Ubicar en el mapa"
            onClick={onLocate}
          />
          <IconButton
            icon={chevronIcon}
            iconSize={20}
            label={isExpanded ? 'Contraer detalle' : 'Expandir detalle'}
            onClick={onToggle}
            iconClassName={cn('transition-transform', isExpanded && 'rotate-180')}
          />
        </div>
      </header>

      {isExpanded && (
        <div id={bodyId} className="flex flex-col gap-2 bg-input px-3 pt-2 pb-3">
          <p className="flex flex-col text-tiny">
            <span className="font-normal">{shipment.customer}</span>
            <span className="text-text-secondary">{shipment.destination.address}</span>
          </p>
          <dl className="flex items-center justify-between py-1 text-tiny">
            <Metric icon={weightIcon} label="Peso" value={formatWeight(metrics.totalWeightKg)} />
            <Metric icon={volumeIcon} label="Volumen" value={formatVolume(metrics.totalVolumeM3)} />
            <Metric icon={boxSeamSmallIcon} label="Bultos" value={String(metrics.totalPackages)} />
            <Metric
              icon={cashCoinIcon}
              label="Valor declarado"
              value={formatCompactCurrency(metrics.totalValue)}
            />
          </dl>

          <ul className="flex flex-col gap-3 border-t border-border pt-2">
            {shipment.packages.map((pkg, index) => (
              <PackageItem key={pkg.id} pkg={pkg} position={index + 1} />
            ))}
          </ul>

          <footer className="flex items-center justify-between text-tiny">
            <span>{formatAssignment(driver, vehicle)}</span>
            {onAssign && (
              <IconButton
                icon={assignIcon}
                iconSize={12}
                label={driver ? 'Reasignar conductor y vehículo' : 'Asignar conductor y vehículo'}
                onClick={onAssign}
              />
            )}
          </footer>
          {actions.length > 0 && (
            <div className="flex flex-wrap justify-end gap-2 border-t border-border pt-3">
              {actions.map((action) => (
                <Button
                  key={action}
                  variant={action === 'cancel' ? 'danger' : 'secondary'}
                  onClick={() => onAction(action)}
                >
                  {SHIPMENT_ACTION_LABELS[action]}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  )
}

function Metric({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex flex-1 items-center gap-1 first:justify-start [&:not(:first-child)]:justify-center">
      <dt>
        <img src={icon} alt={label} title={label} width={8} height={8} />
      </dt>
      <dd>{value}</dd>
    </div>
  )
}

function PackageItem({ pkg, position }: { pkg: ShipmentPackage; position: number }) {
  const { totalWeightKg, totalVolumeM3 } = getShipmentMetrics([pkg])

  return (
    <li className="flex flex-col gap-2 border-border not-last:border-b not-last:pb-3">
      <p className="flex items-center gap-2 text-small font-semibold">
        <img src={boxSeamIcon} alt="" width={12} height={12} />
        Paquete {position}
        <span className="text-tiny font-light text-text-secondary">
          {pkg.description} × {pkg.quantity}
        </span>
      </p>
      <div className="flex items-center justify-between rounded-md bg-surface-02 p-2 text-tiny">
        <span>{pkg.id}</span>
        <span className="flex items-center gap-1">
          {formatWeight(totalWeightKg)}
          <span aria-hidden="true">⸱</span>
          {formatVolume(totalVolumeM3)}
        </span>
      </div>
    </li>
  )
}
