import RederiCalculator from '@/pages/RederiCalculator'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/rederi')({
  component: () => <RederiCalculator />
})