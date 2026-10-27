export default function Estrelas({ nota = 0, onChange, tamanho = 'text-base' }) {
  return (
    <span className={`inline-flex ${tamanho}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          className={`${n <= Math.round(nota) ? 'text-yellow-400' : 'text-white/20'} ${
            onChange ? 'cursor-pointer hover:scale-110' : 'cursor-default'
          }`}
        >
          ★
        </button>
      ))}
    </span>
  )
}