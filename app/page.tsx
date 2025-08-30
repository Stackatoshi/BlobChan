import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirect to the first board (b) by default
  redirect('/board/b')
}
