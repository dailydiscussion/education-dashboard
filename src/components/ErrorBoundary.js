// src/components/ErrorBoundary.js
import React from 'react';

// ErrorBoundary component to catch rendering errors (kept as class component)
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center h-screen bg-red-100 text-red-800 p-4 rounded-lg shadow-md">
                    <h1 className="text-xl font-bold mb-2">Oops! Something went wrong.</h1>
                    <p className="text-sm text-center mb-4">
                        We're sorry for the inconvenience. Please try refreshing the page.
                    </p>
                    {this.state.error && (
                        <details className="mt-4 p-2 bg-red-200 rounded-md text-xs text-red-900 overflow-auto max-h-40">
                            <summary>Error Details</summary>
                            <pre>{this.state.error.toString()}</pre>
                            <pre>{this.state.errorInfo.componentStack}</pre>
                        </details>
                    )}
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;