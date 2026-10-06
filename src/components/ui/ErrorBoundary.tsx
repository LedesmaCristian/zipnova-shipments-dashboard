import { Component, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  fallback: ReactNode
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

/**
 * Aísla una sección que puede fallar (ej. el chunk del mapa no carga): el resto de la app
 * sigue funcionando. React todavía no tiene un equivalente con hooks, por eso es una clase.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.error(error)
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}
