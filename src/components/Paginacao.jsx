const btn = 'grid h-8 min-w-8 place-items-center rounded-lg px-2 text-sm font-semibold transition'

export default function Paginacao({ pagina, total, porPagina, onChange }) {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-3 text-xs text-white/50">
      <span>Página {pagina} de {total}</span>
      <div className="flex items-center gap-1">
        <button
          disabled={pagina === 1}
          onClick={() => onChange(pagina - 1)}
          className={`${btn} text-white/70 hover:text-white disabled:opacity-30`}
        >
          ‹ Anterior
        </button>
        {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`${btn} ${n === pagina ? 'bg-destaque text-fundo' : 'text-white/70 hover:bg-card'}`}
          >
            {n}
          </button>
        ))}
        <button
          disabled={pagina === total}
          onClick={() => onChange(pagina + 1)}
          className={`${btn} text-white/70 hover:text-white disabled:opacity-30`}
        >
          Próxima ›
        </button>
      </div>
      <span>{porPagina} por página</span>
    </div>
  )
}