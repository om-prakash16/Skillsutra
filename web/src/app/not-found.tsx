import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground text-center p-4">
      <h1 className="text-8xl font-black text-primary mb-4">404</h1>
      <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        We couldn't find the page you were looking for. It might have been moved, deleted, or perhaps it never existed.
      </p>
      <Link href="/">
        <Button size="lg" variant="premium">
          Return to Dashboard
        </Button>
      </Link>
    </div>
  )
}
