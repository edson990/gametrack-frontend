const gradientes = [
  'from-red-900 to-stone-700',
  'from-slate-900 to-blue-800',
  'from-emerald-900 to-lime-600',
  'from-purple-900 to-fuchsia-600',
  'from-orange-900 to-amber-500',
  'from-sky-900 to-cyan-600',
]

export default function Capa({ jogo, className = '' }) {
  if (jogo.capa_url) {
    return <img src={jogo.capa_url} alt={jogo.titulo} className={`rounded-lg object-cover ${className}`} />
  }
  return (
    <div
      className={`grid place-items-center rounded-lg bg-gradient-to-br ${gradientes[jogo.id % gradientes.length]} ${className}`}
    >
      <span className="text-4xl font-black text-white/30">{jogo.titulo[0]}</span>
    </div>
  )
}