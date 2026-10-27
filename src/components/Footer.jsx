import { MARCA } from '../config'

export default function Footer() {
  return (
    <footer className="border-t border-borda">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 text-xs text-white/40">
        <span><strong className="text-white/70">{MARCA}</strong> · Cada jogo, uma história.</span>
        <span>Feito para quem joga. Aberto a todo mundo.</span>
      </div>
    </footer>
  )
}