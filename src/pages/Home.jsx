
import { useEffect, useMemo, useState } from 'react'
import {
  listarJogos,
  buscarJogoPorId,
  listarAvaliacoes,
} from '../services/api'
import AvaliacaoCard from '../components/AvaliacaoCard'
import Paginacao from '../components/Paginacao'

const POR_PAGINA = 4

const campo =
  'rounded-lg border border-borda bg-card px-3 py-2.5 text-sm outline-none focus:border-destaque'

// Converte plataformas recebidas como array ou texto do PostgreSQL.
function formatarPlataformas(plataforma) {
  if (Array.isArray(plataforma)) {
    return plataforma.join(', ')
  }

  if (typeof plataforma !== 'string' || !plataforma.trim()) {
    return 'Não informada'
  }

  const valor = plataforma.trim()

  // Trata o formato JSON: ["PC", "PlayStation"]
  try {
    const convertido = JSON.parse(valor)

    if (Array.isArray(convertido)) {
      return convertido.join(', ')
    }
  } catch {
    // O valor pode estar no formato de array do PostgreSQL.
  }

  // Trata o formato PostgreSQL: {PC} ou {"PC","PlayStation"}
  if (valor.startsWith('{') && valor.endsWith('}')) {
    return valor
      .slice(1, -1)
      .split(',')
      .map((item) => item.trim().replace(/^"|"$/g, ''))
      .filter(Boolean)
      .join(', ') || 'Não informada'
  }

  return valor
}

export default function Home() {
  const [jogosBanco, setJogosBanco] = useState([])
  const [todosOsJogos, setTodosOsJogos] = useState([])
  const [carregandoJogos, setCarregandoJogos] = useState(true)
  const [erroJogos, setErroJogos] = useState('')
  const [generoJogos, setGeneroJogos] = useState('')

  const [avaliacoesBanco, setAvaliacoesBanco] = useState([])
  const [carregandoAvaliacoes, setCarregandoAvaliacoes] = useState(true)
  const [erroAvaliacoes, setErroAvaliacoes] = useState('')

  const [buscaId, setBuscaId] = useState('')
  const [jogoEncontrado, setJogoEncontrado] = useState(null)
  const [buscandoId, setBuscandoId] = useState(false)
  const [erroBuscaId, setErroBuscaId] = useState('')

  const [busca, setBusca] = useState('')
  const [genero, setGenero] = useState('')
  const [ordem, setOrdem] = useState('recentes')
  const [pagina, setPagina] = useState(1)

  // Carrega a biblioteca completa e as avaliações.
  useEffect(() => {
    async function carregarJogos() {
      try {
        const dados = await listarJogos()

        setTodosOsJogos(dados || [])
        setJogosBanco(dados || [])
        setErroJogos('')
      } catch (erro) {
        setErroJogos(erro.message || 'Erro ao carregar os jogos.')
      } finally {
        setCarregandoJogos(false)
      }
    }

    async function carregarAvaliacoes() {
      try {
        const dados = await listarAvaliacoes()
        setAvaliacoesBanco(dados || [])
        setErroAvaliacoes('')
      } catch (erro) {
        setErroAvaliacoes(
          erro.message || 'Erro ao carregar as avaliações.'
        )
      } finally {
        setCarregandoAvaliacoes(false)
      }
    }

    carregarJogos()
    carregarAvaliacoes()
  }, [])

  // Pesquisa um jogo pelo ID.
  async function pesquisarPorId(event) {
    event.preventDefault()

    const id = buscaId.trim()

    setJogoEncontrado(null)
    setErroBuscaId('')

    if (!id) {
      setErroBuscaId('Digite o ID do jogo.')
      return
    }

    if (!/^\d+$/.test(id) || Number(id) < 1) {
      setErroBuscaId('Digite um ID numérico válido.')
      return
    }

    setBuscandoId(true)

    try {
      const jogo = await buscarJogoPorId(id)
      setJogoEncontrado(jogo)
    } catch (erro) {
      setErroBuscaId(
        erro.message || 'Não foi possível encontrar o jogo.'
      )
    } finally {
      setBuscandoId(false)
    }
  }

  function limparBuscaId() {
    setBuscaId('')
    setJogoEncontrado(null)
    setErroBuscaId('')
  }

  // Filtra a biblioteca consultando o backend.
  async function filtrarJogosPorGenero(novoGenero) {
    setGeneroJogos(novoGenero)
    setCarregandoJogos(true)
    setErroJogos('')

    try {
      const dados = await listarJogos(novoGenero)
      setJogosBanco(dados || [])
    } catch (erro) {
      setErroJogos(erro.message || 'Erro ao filtrar os jogos.')
    } finally {
      setCarregandoJogos(false)
    }
  }

  // Mantém os gêneros completos mesmo quando a biblioteca está filtrada.
  const generos = useMemo(
    () => [
      ...new Set(
        todosOsJogos.map((jogo) => jogo.genero).filter(Boolean)
      ),
    ],
    [todosOsJogos]
  )

  // Filtra e ordena as avaliações.
  const lista = useMemo(() => {
    const termo = busca.trim().toLowerCase()

    return avaliacoesBanco
      .map((avaliacao) => ({
        avaliacao,
        jogo: todosOsJogos.find(
          (jogo) => Number(jogo.id) === Number(avaliacao.jogo_id)
        ),
      }))
      .filter(({ avaliacao, jogo }) => {
        if (!jogo) return false

        const titulo = (jogo.titulo || '').toLowerCase()
        const nome = (avaliacao.nome_avaliador || '').toLowerCase()

        return (
          (!genero || jogo.genero === genero) &&
          (!termo ||
            titulo.includes(termo) ||
            nome.includes(termo))
        )
      })
      .sort((a, b) => {
        if (ordem === 'maior') {
          return Number(b.avaliacao.nota) - Number(a.avaliacao.nota)
        }

        if (ordem === 'menor') {
          return Number(a.avaliacao.nota) - Number(b.avaliacao.nota)
        }

        return (b.avaliacao.criado_em || '').localeCompare(
          a.avaliacao.criado_em || ''
        )
      })
  }, [avaliacoesBanco, todosOsJogos, busca, genero, ordem])

  const totalPaginas = Math.max(
    1,
    Math.ceil(lista.length / POR_PAGINA)
  )

  const inicio = (pagina - 1) * POR_PAGINA
  const visiveis = lista.slice(inicio, inicio + POR_PAGINA)

  function mudar(setter) {
    return (event) => {
      setter(event.target.value)
      setPagina(1)
    }
  }

  // Cartão de jogo reutilizado na biblioteca e na busca por ID.
  function renderizarJogo(jogo) {
    return (
      <article
        key={jogo.id}
        className="overflow-hidden rounded-xl border border-borda bg-card"
      >
        {jogo.capa_url ? (
          <img
            src={jogo.capa_url}
            alt={`Capa de ${jogo.titulo}`}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
            className="h-44 w-full object-cover"
          />
        ) : (
          <div className="flex h-44 items-center justify-center bg-black/20 text-sm text-white/50">
            Capa indisponível
          </div>
        )}

        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h2 className="break-words text-lg font-bold">
              {jogo.titulo}
            </h2>

            <span className="shrink-0 rounded bg-black/20 px-2 py-1 text-xs text-white/60">
              ID: {jogo.id}
            </span>
          </div>

          <p className="mt-2 line-clamp-3 text-sm leading-5 text-white/60">
            {jogo.descricao || 'Sem descrição.'}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-destaque/10 px-3 py-1 text-xs text-destaque">
              {jogo.genero || 'Gênero não informado'}
            </span>
          </div>

          <p className="mt-3 text-xs text-white/50">
            Plataforma: {formatarPlataformas(jogo.plataforma)}
          </p>

          <div className="mt-4 border-t border-borda pt-3">
            <p className="text-sm text-destaque">
              ★ {Number(jogo.nota_media || 0).toFixed(1)}
              <span className="ml-2 text-xs text-white/50">
                Nota média
              </span>
            </p>
          </div>
        </div>
      </article>
    )
  }

  return (
    <section>
      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-widest text-destaque">
          Sua coleção
        </p>

        <div className="mt-2 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h1 className="text-4xl font-extrabold">
              Biblioteca de jogos
            </h1>
            <p className="mt-2 text-sm text-white/60">
              Confira os jogos cadastrados no GameTrack.
            </p>
          </div>

          <p className="text-xs text-white/50">
            {todosOsJogos.length} jogos cadastrados
          </p>
        </div>

        <form
          onSubmit={pesquisarPorId}
          className="mt-5 flex flex-wrap gap-3"
        >
          <input
            type="number"
            min="1"
            value={buscaId}
            onChange={(event) => setBuscaId(event.target.value)}
            placeholder="Digite o ID do jogo"
            className={`${campo} min-w-0 flex-1`}
          />

          <button
            type="submit"
            disabled={buscandoId}
            className="rounded-lg bg-destaque px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
          >
            {buscandoId ? 'Buscando...' : 'Buscar por ID'}
          </button>

          {(jogoEncontrado || erroBuscaId) && (
            <button
              type="button"
              onClick={limparBuscaId}
              className="rounded-lg border border-borda px-4 py-2.5 text-sm"
            >
              Limpar
            </button>
          )}
        </form>

        {erroBuscaId && (
          <p role="alert" className="mt-3 text-sm text-red-400">
            {erroBuscaId}
          </p>
        )}

        {jogoEncontrado && (
          <div className="mt-5">
            <p className="mb-3 text-sm font-semibold text-destaque">
              Jogo encontrado pelo ID
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {renderizarJogo(jogoEncontrado)}
            </div>
          </div>
        )}

        {carregandoJogos && (
          <p className="mt-5 text-sm text-white/60">
            Carregando jogos...
          </p>
        )}

        {erroJogos && (
          <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <p className="text-sm text-red-400">{erroJogos}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-2 text-sm text-white underline"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!carregandoJogos &&
          !erroJogos &&
          jogosBanco.length === 0 &&
          todosOsJogos.length === 0 && (
            <div className="mt-5 rounded-xl border border-dashed border-borda p-8 text-center text-sm text-white/50">
              Nenhum jogo cadastrado ainda.
            </div>
          )}

        {!erroJogos && todosOsJogos.length > 0 && (
          <>
            <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-bold">Todos os jogos</h2>

              <select
                value={generoJogos}
                onChange={(event) =>
                  filtrarJogosPorGenero(event.target.value)
                }
                disabled={carregandoJogos}
                className={campo}
                aria-label="Filtrar jogos por gênero"
              >
                <option value="">Todos os gêneros</option>

                {generos.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {carregandoJogos ? (
              <p className="mt-4 text-sm text-white/60">
                Carregando jogos...
              </p>
            ) : jogosBanco.length > 0 ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {jogosBanco.map(renderizarJogo)}
              </div>
            ) : (
              <p className="mt-4 text-sm text-white/60">
                Nenhum jogo encontrado para esse gênero.
              </p>
            )}
          </>
        )}
      </div>

      <div className="border-t border-borda pt-8">
        <p className="text-xs font-bold uppercase tracking-widest text-destaque">
          Da comunidade
        </p>

        <div className="mt-2 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-4xl font-extrabold">
              Todas as avaliações
            </h2>
            <p className="mt-2 text-sm text-white/60">
              Leia o que a comunidade está jogando.
            </p>
          </div>

          <p className="text-xs text-white/50">
            {avaliacoesBanco.length}{' '}
            {avaliacoesBanco.length === 1
              ? 'avaliação publicada'
              : 'avaliações publicadas'}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <input
            value={busca}
            onChange={mudar(setBusca)}
            placeholder="Buscar por jogo ou avaliador"
            className={`${campo} min-w-60 flex-1`}
          />

          <select
            value={genero}
            onChange={mudar(setGenero)}
            className={campo}
          >
            <option value="">Todos os gêneros</option>
            {generos.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          <select
            value={ordem}
            onChange={mudar(setOrdem)}
            className={campo}
          >
            <option value="recentes">Mais recentes</option>
            <option value="maior">Maior nota</option>
            <option value="menor">Menor nota</option>
          </select>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3 text-xs text-white/50">
          <span className="font-semibold text-white/80">
            Últimas publicações
          </span>

          <span>
            {lista.length
              ? `Mostrando ${inicio + 1}-${inicio + visiveis.length} de ${lista.length} avaliações`
              : 'Nenhuma avaliação'}
          </span>
        </div>

        {carregandoAvaliacoes ? (
          <p className="mt-4 text-sm text-white/60">
            Carregando avaliações...
          </p>
        ) : erroAvaliacoes ? (
          <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <p className="text-sm text-red-400">{erroAvaliacoes}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-2 text-sm text-white underline"
            >
              Tentar novamente
            </button>
          </div>
        ) : lista.length > 0 ? (
          <>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              {visiveis.map(({ avaliacao, jogo }) => (
                <AvaliacaoCard
                  key={avaliacao.id}
                  avaliacao={avaliacao}
                  jogo={jogo}
                  media={Number(jogo.nota_media || 0)}
                />
              ))}
            </div>

            <Paginacao
              pagina={pagina}
              total={totalPaginas}
              porPagina={POR_PAGINA}
              onChange={setPagina}
            />
          </>
        ) : (
          <div className="mt-3 rounded-xl border border-dashed border-borda p-12 text-center text-white/50">
            Nenhuma avaliação encontrada para esse filtro.
          </div>
        )}
      </div>
    </section>
  )
}
