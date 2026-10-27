import { Link, NavLink } from 'react-router-dom'
import { MARCA } from '../config'

const link = ({ isActive }) =>
  `px-3 py-1.5 text-sm font-semibold transition ${
    isActive ? 'text-destaque' : 'text-white/60 hover:text-white'
  }`

export default function Header() {
  return (
    <header className="border-b border-borda">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-lg font-extrabold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-destaque text-fundo">🎮</span>
          <span>{MARCA}</span>
        </Link>
        <nav className="flex items-center gap-1">
          <NavLink to="/" end className={link}>Avaliações</NavLink>
          <NavLink to="/adicionar-jogo" className={link}>Adicionar jogo</NavLink>
          <Link
            to="/nova-avaliacao"
            className="ml-2 rounded-lg bg-destaque px-3 py-1.5 text-sm font-bold text-fundo hover:brightness-110"
          >
            + Avaliar um jogo
          </Link>
        </nav>
      </div>
    </header>
  )
}