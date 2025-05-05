import { Montserrat } from 'next/font/google'
import { ReactNode } from 'react'
import { Header } from './Header'
import { useWalletListener } from '@/lib/hooks/useWalletListener'

const montserrat = Montserrat({
  subsets: ['latin']
})

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  // Hook to sync wallet adapter state with our store
  useWalletListener()

  return (
    <div className={`flex min-h-screen flex-col ${montserrat.className}`}>
      <Header />
      <main className='container flex-1 py-6 md:py-8'>{children}</main>
      <footer className='border-t border-border/40 py-6'>
        <div className='container flex flex-col items-center justify-between gap-4 md:flex-row'>
          <div className='text-sm text-muted-foreground'>
            &copy; {new Date().getFullYear()} Fragmetric F Point Checker. All rights reserved.
          </div>
          <div className='flex items-center gap-4'>
            <a
              href='https://docs.fragmetric.xyz/'
              target='_blank'
              rel='noopener noreferrer'
              className='text-sm text-muted-foreground transition-colors hover:text-primary'
            >
              Documentation
            </a>
            <a
              href='https://x.com/fragmetric'
              target='_blank'
              rel='noopener noreferrer'
              className='text-sm text-muted-foreground transition-colors hover:text-primary'
            >
              Twitter
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
