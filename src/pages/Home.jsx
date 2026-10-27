import { useMemo, useState } from 'react'
import { jogos, avaliacoes, mediaDoJogo } from '../data/mock'
import AvaliacaoCard from '../components/AvaliacaoCard'
import Paginacao from '../components/Paginacao'

const POR_PAGINA = 4
const generos = [...new Set(jogos.map((j) => j.genero))]
const campo = 'rounded-lg border border-borda bg-card px-3 py-2.5 text-sm outline-none focus:border-destaque'

export default function Home() {
  const [busca, setBusca] = useState('')
  const [genero, setGenero] = useState('')
  const [ordem, setOrdem] = useState('recentes')
  const [pagina, setPagina] = useState(1)

  const lista = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return avaliacoes
      .map((a) => ({ avaliacao: a, jogo: jogos.find((j) => j.id === a.jogo_id) }))
      .filter(
        ({ avaliacao, jogo }) =>
          (!genero || jogo.genero === genero) &&
          (!termo ||
            jogo.titulo.toLowerCase().includes(termo) ||
            avaliacao.nome_avaliador.toLowerCase().includes(termo)),
      )
      .sort((x, y) => {
        if (ordem === 'maior') return y.avaliacao.nota - x.avaliacao.nota
        if (ordem === 'menor') return x.avaliacao.nota - y.avaliacao.nota
        return y.avaliacao.criado_em.localeCompare(x.avaliacao.criado_em)
      })
  }, [busca, genero, ordem])

  const totalPaginas = Math.max(1, Math.ceil(lista.length / POR_PAGINA))
  const inicio = (pagina - 1) * POR_PAGINA
  const visiveis = lista.slice(inicio, inicio + POR_PAGINA)

  const mudar = (setter) => (e) => {
    setter(e.target.value)
    setPagina(1)
  }

  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-widest text-destaque">Da comunidade</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-4xl font-extrabold">Todas as avaliações</h1>
          <p className="mt-2 text-sm text-white/60">
            O próximo jogo começa com uma boa recomendação. Leia o que a comunidade está jogando.
          </p>
        </div>
        <p className="text-xs text-white/50">{avaliacoes.length} avaliações / {jogos.length} jogos</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          value={busca}
          onChange={mudar(setBusca)}
          placeholder="Buscar por jogo ou avaliador"
          className={`${campo} min-w-60 flex-1`}
        />
        <select value={genero} onChange={mudar(setGenero)} className={campo}>
          <option value="">Todos os gêneros</option>
          {generos.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <select value={ordem} onChange={mudar(setOrdem)} className={campo}>
          <option value="recentes">Mais recentes</option>
          <option value="maior">Maior nota</option>
          <option value="menor">Menor nota</option>
        </select>
      </div>

      <div className="mt-6 flex items-center justify-between text-xs text-white/50">
        <span className="font-semibold text-white/80">Últimas publicações</span>
        <span>
          {lista.length
            ? `Mostrando ${inicio + 1}-${inicio + visiveis.length} de ${lista.length} avaliações`
            : 'Nenhuma avaliação'}
        </span>
      </div>

      {lista.length ? (
        <>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            {visiveis.map(({ avaliacao, jogo }) => (
              <AvaliacaoCard
                key={avaliacao.id}
                avaliacao={avaliacao}
                jogo={jogo}
                media={mediaDoJogo(avaliacoes, jogo.id)}
              />
            ))}
          </div>
          <Paginacao pagina={pagina} total={totalPaginas} porPagina={POR_PAGINA} onChange={setPagina} />
        </>
      ) : (
        <div className="mt-3 rounded-xl border border-dashed border-borda p-12 text-center text-white/50">
          Nenhuma avaliação encontrada para esse filtro.
        </div>
      )}
    </section>
  )
}