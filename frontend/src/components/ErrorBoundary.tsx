import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("LAND STACK ErrorBoundary caught an exception:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="bg-white border border-slate-205 p-8 rounded-2xl text-center space-y-4 font-sans text-xs max-w-lg mx-auto my-12 shadow-sm text-slate-900">
          <div className="w-12 h-12 bg-amber-55 border border-amber-200 text-amber-800 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>

          <div className="space-y-1 font-semibold">
            <h3 className="text-lg font-black text-slate-900">System Component Exception Handled</h3>
            <p className="text-slate-655 font-medium">An isolated component error occurred. System operations and security remain fully intact.</p>
          </div>

          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl transition-colors shadow flex items-center justify-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4 text-blue-200" />
            <span>Recover Component State</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
