import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirect to the first board (tech) by default
  redirect('/board/tech')
}
