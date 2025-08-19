import SearchEngine from '@/components/SearchEngine'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: () => <SearchEngine />
})