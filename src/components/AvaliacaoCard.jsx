
import Capa from './Capa'
import Estrelas from './Estrelas'
import { formatarPlataformas } from '../utils/plataforma'

const fmt = (n) => Number(n).toFixed(1).replace('.', ',')

const data = (valor) => {
  if (!valor) return 'Data indisponível'

  const dataAvaliacao = new Date(valor)

  if (Number.isNaN(dataAvaliacao.getTime())) {
    return 'Data indisponível'
  }

  return dataAvaliacao.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export default function AvaliacaoCard({ avaliacao, jogo, media }) {
  return (
    <article className="flex gap-4 rounded-xl border border-borda bg-card p-4 transition hover:-translate-y-0.5 hover:border-white/20">
      <div className="shrink-0">
        <Capa jogo={jogo} className="h-32 w-24" />

        <p className="mt-2 text-xs text-white/50">
          <strong className="text-destaque">{fmt(media)}</strong> média do jogo
        </p>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="truncate text-lg font-bold">{jogo.titulo}</h3>

        <p className="text-xs text-white/50">
          {jogo.genero} · {formatarPlataformas(jogo.plataforma)}
        </p>

        <div className="mt-2 flex items-center gap-2">
          <Estrelas nota={avaliacao.nota} />
          <span className="text-xs text-white/60">
            {avaliacao.nota}/5
          </span>
        </div>

        <p className="mt-2 line-clamp-3 flex-1 text-sm text-white/70">
          {avaliacao.review || (
            <em className="text-white/30">Sem texto, só a nota.</em>
          )}
        </p>

        <div className="mt-3 flex items-center justify-between text-xs text-white/50">
          <span className="font-semibold text-white/80">
            {avaliacao.nome_avaliador}
          </span>

          <span>{data(avaliacao.criado_em)}</span>
        </div>
      </div>
    </article>
  )
}
