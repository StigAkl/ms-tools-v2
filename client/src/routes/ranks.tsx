import UserRanks from '@/pages/user-ranks'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/ranks')({
  component: () => <UserRanks />
})