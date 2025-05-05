import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Overview', href: '/' },
  { name: 'My F Points', href: '/my-points' },
  { name: 'Leaderboard', href: '/leaderboard' }
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-16 items-center justify-between'>
        <div className='flex items-center gap-6 md:gap-10'>
          <Link href='/' className='flex items-center space-x-[10px]'>
            <div className='relative h-8 w-8'>
              <Image src='/logo.png' alt='Fragmetric' fill className='object-contain' priority />
            </div>
            <span className='inline-block text-[20px] font-bold'>
              Fragmetric <span className='text-primary'>F Point</span> Checker
            </span>
          </Link>
          <nav className='hidden gap-6 md:flex'>
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  pathname === item.href ? 'text-foreground' : 'text-foreground/60'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className='flex items-center gap-2'>
          <WalletMultiButton />
        </div>
      </div>
    </header>
  )
}
