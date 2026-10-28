import React from 'react'

const gradientes = [
  'from-red-900 to-stone-700',
  'from-slate-900 to-blue-800',
  'from-emerald-900 to-lime-600',
  'from-purple-900 to-fuchsia-600',
  'from-orange-900 to-amber-500',
  'from-sky-900 to-cyan-600',
]

export default function Capa({ jogo, className = '' }) {
  const [erroImagem, setErroImagem] = React.useState(false)

  const titulo = jogo?.titulo || 'Jogo'
  const id = Number(jogo?.id) || 0
  const gradiente = gradientes[id % gradientes.length]

  if (jogo?.capa_url && !erroImagem) {
    return (
      <img
        src={jogo.capa_url}
        alt={`Capa de ${titulo}`}
        onError={() => setErroImagem(true)}
        className={`rounded-lg object-cover ${className}`}
      />
    )
  }

  return (
    <div
      className={`grid place-items-center rounded-lg bg-gradient-to-br ${gradiente} ${className}`}
    >
      <span className="text-4xl font-black text-white/30">
        {titulo[0].toUpperCase()}
      </span>
    </div>
  )
}
