import { Component, type ErrorInfo, type PropsWithChildren } from 'react';

interface ErrorBoundaryProps {
  fallback?: (error: Error) => React.ReactNode;

  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<
  PropsWithChildren<ErrorBoundaryProps>,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError } = this.props;

    onError?.(error, errorInfo);
    console.error(error, errorInfo);
  }

  override render() {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback(error!);
      }

      return <div>Something went wrong.</div>;
    }

    return children;
  }
}
