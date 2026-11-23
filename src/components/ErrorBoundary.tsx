import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryState {
  error: Error | null
}

export class ErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught UI error:', error, errorInfo)
  }

  render() {
    if (this.state.error) {
      return (
        <main id="main-content" className="container-peb py-16">
          <div className="rounded-[4px] border border-line bg-surface-2 px-6 py-12 text-center">
            <h1 className="font-serif text-[24px] font-bold text-ink">
              Something went wrong.
            </h1>
            <p className="mt-2 max-w-[440px] text-[13px] text-ink2">
              Please refresh the page and try again.
            </p>
          </div>
        </main>
      )
    }

    return this.props.children
  }
}
