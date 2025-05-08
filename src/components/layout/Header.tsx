import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { MenuIcon } from 'lucide-react'
import { useState } from 'react'
import { ModeToggle } from '../ui/mode-toggle'

const navigation = [
  { name: 'Overview', href: '/', disabled: true },
  { name: 'My F Points', href: '/my-points', disabled: false },
  { name: 'Leaderboard', href: '/leaderboard', disabled: true }
]

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-16 items-center justify-between'>
        <div className='flex items-center gap-2 md:gap-6'>
          <Link href='/my-points' className='flex items-center gap-2 md:space-x-[10px]'>
            <div className='relative h-7 w-7 md:h-8 md:w-8'>
              <Image src='/logo.png' alt='Fragmetric' fill className='object-contain' priority />
            </div>
            <span className='hidden text-[16px] font-bold sm:inline-block md:text-[20px]'>
              Fragmetric <span className='text-primary'>F Point</span>
            </span>
          </Link>
          <nav className='hidden gap-6 md:flex'>
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.disabled ? '#' : item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  pathname === item.href ? 'text-foreground' : 'text-foreground/60',
                  item.disabled && 'pointer-events-none cursor-not-allowed opacity-50'
                )}
                onClick={(e) => item.disabled && e.preventDefault()}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className='flex items-center gap-2'>
          <WalletMultiButton />
          <button 
            className='flex md:hidden p-1 rounded-md hover:bg-muted'
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <MenuIcon className='h-5 w-5' />
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className='container md:hidden py-3 border-t border-border/40'>
          <nav className='flex flex-col gap-3'>
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.disabled ? '#' : item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary py-1',
                  pathname === item.href ? 'text-foreground' : 'text-foreground/60',
                  item.disabled && 'pointer-events-none cursor-not-allowed opacity-50'
                )}
                onClick={(e) => {
                  item.disabled && e.preventDefault()
                  setMobileMenuOpen(false)
                }}
              >
                {item.name}
              </Link>
            ))}
            <div className='pt-2'>
              <ModeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
