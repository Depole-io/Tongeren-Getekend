import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

const container = document.getElementById('root')
const root = createRoot(container)

if('serviceWorker' in navigator){
  navigator.serviceWorker.register('/dist/sw.js')
  .then((reg) => console.log('Service Worker Registered', reg))
  .catch((err) => console.log('Error in Registering Service Worker', err))
}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-900 text-white rounded-md">
          <h2 className="font-bold text-lg mb-2">Something went wrong.</h2>
          <details className="whitespace-pre-wrap">
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo?.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
root.render(
  <ErrorBoundary>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </ErrorBoundary>
)