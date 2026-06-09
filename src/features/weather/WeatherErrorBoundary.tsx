import { Component, type ReactNode } from 'react'
import ApiUnavailableFallback from './ApiUnavailableFallback'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export default class WeatherErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  handleReset = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return <ApiUnavailableFallback onRetry={this.handleReset} />
    }
    return this.props.children
  }
}
