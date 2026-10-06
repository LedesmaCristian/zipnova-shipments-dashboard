import { createEntityAdapter, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { STATUSES_REQUIRING_ASSIGNMENT } from './constants'
import type { AssignmentPayload, Shipment, StatusChangePayload } from './types'
import {
  canAssign,
  canCancel,
  canTransition,
  canUnassign,
  hasAssignment,
} from './utils/shipmentRules'

export const shipmentsAdapter = createEntityAdapter<Shipment>()

export interface ShipmentsState extends ReturnType<typeof shipmentsAdapter.getInitialState> {
  selectedId: string | null
  /**
   * Se incrementa en cada "Ubicar en el mapa". El mapa lo usa para volver a enfocar
   * aunque el envío ya estuviera seleccionado (y el usuario hubiera movido el mapa).
   */
  locateRequest: number
}

export function createShipmentsState(shipments: readonly Shipment[] = []): ShipmentsState {
  return shipmentsAdapter.setAll(
    shipmentsAdapter.getInitialState({ selectedId: null, locateRequest: 0 }),
    shipments,
  )
}

/**
 * Los reducers validan las reglas de negocio y descartan acciones inválidas,
 * así el estado nunca queda inconsistente aunque la UI falle en bloquearlas.
 */
const shipmentsSlice = createSlice({
  name: 'shipments',
  initialState: createShipmentsState(),
  reducers: {
    shipmentSelected(state, action: PayloadAction<string | null>) {
      state.selectedId = action.payload
    },
    shipmentLocated(state, action: PayloadAction<string>) {
      state.selectedId = action.payload
      state.locateRequest += 1
    },
    shipmentAssigned(state, action: PayloadAction<AssignmentPayload>) {
      const { shipmentId, driverId, vehicleId } = action.payload
      const shipment = state.entities[shipmentId]
      if (!shipment || !canAssign(shipment)) return
      shipment.driverId = driverId
      shipment.vehicleId = vehicleId
      shipment.status = 'assigned'
    },
    shipmentUnassigned(state, action: PayloadAction<string>) {
      const shipment = state.entities[action.payload]
      if (!shipment || !canUnassign(shipment)) return
      delete shipment.driverId
      delete shipment.vehicleId
      shipment.status = 'pending'
    },
    shipmentStatusChanged(state, action: PayloadAction<StatusChangePayload>) {
      const { shipmentId, status } = action.payload
      const shipment = state.entities[shipmentId]
      if (!shipment || !canTransition(shipment.status, status)) return
      if (STATUSES_REQUIRING_ASSIGNMENT.includes(status) && !hasAssignment(shipment)) return
      shipment.status = status
    },
    shipmentCancelled(state, action: PayloadAction<string>) {
      const shipment = state.entities[action.payload]
      if (!shipment || !canCancel(shipment)) return
      shipment.status = 'cancelled'
    },
  },
})

export const {
  shipmentSelected,
  shipmentLocated,
  shipmentAssigned,
  shipmentUnassigned,
  shipmentStatusChanged,
  shipmentCancelled,
} = shipmentsSlice.actions

export const shipmentsReducer = shipmentsSlice.reducer
