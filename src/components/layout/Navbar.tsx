import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { COUPLE } from '../../data/wedding';
import { cn } from '../../lib/cn';
import { LinkButton } from '../ui/Button';

const links = [
  { label: 'Nossa história', href: '#nossa-historia' },
  { label: 'O grande dia', href: '#o-grande-dia' },
  { label: 'Fotos', href: '#galeria' },
  { label: 'Presentes', href: '#presentes' },
  { label: 'Bilhetinhos', href: '#bilhetinhos' },
  { label: 'Dúvidas', href: '#faq' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow,padding] duration-200 ease-out-soft',
        scrolled ? 'bg-paper/95 py-3 shadow-[0_1px_0_rgb(90_90_64/0.12)] backdrop-blur-md' : 'py-5',
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 md:px-10">
        <a href="#inicio" className={cn('font-serif text-2xl font-semibold tracking-widest transition-colors', scrolled ? 'text-ink hover:text-olive' : 'text-paper hover:text-sand')}>
          {COUPLE.monogram}
        </a>

        <ul className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={cn(
                  'group relative py-1 text-[0.6875rem] font-semibold tracking-[0.2em] uppercase transition-colors',
                  scrolled ? 'text-olive hover:text-ink' : 'text-paper/90 hover:text-paper',
                )}
              >
                {link.label}
                <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-current transition-transform duration-200 ease-out-soft group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <span className="hidden sm:block">
            <LinkButton href="#rsvp" size="sm" variant={scrolled ? 'primary' : 'light'} className="whitespace-nowrap">
              Confirmar presença
            </LinkButton>
          </span>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
            className={cn('rounded-full p-2.5 transition-colors lg:hidden', scrolled ? 'text-olive hover:text-ink' : 'text-paper')}
          >
            <Menu className="size-6" />
          </button>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-paper p-6 animate-fade-in lg:hidden">
          <div className="flex items-center justify-between border-b border-olive/15 pb-5">
            <span className="font-serif text-3xl font-semibold tracking-widest text-olive">{COUPLE.monogram}</span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Fechar menu" className="rounded-full p-2 text-olive">
              <X className="size-6" />
            </button>
          </div>

          <ul className="flex flex-1 flex-col justify-center gap-6 text-center">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={() => setOpen(false)} className="font-serif text-3xl text-ink transition-colors hover:text-olive">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <LinkButton href="#rsvp" size="lg" onClick={() => setOpen(false)} className="w-full">
            Confirmar presença
          </LinkButton>
        </div>
      )}
    </header>
  );
}
