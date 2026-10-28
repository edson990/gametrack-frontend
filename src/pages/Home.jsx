import { useEffect, useMemo, useState } from 'react'
import {
  listarJogos,
  buscarJogoPorId,
  listarAvaliacoes,
  editarJogo,
  excluirJogo,
  editarAvaliacao,
  excluirAvaliacao,
} from '../services/api'
import AvaliacaoCard from '../components/AvaliacaoCard'
import { formatarPlataformas } from '../utils/plataforma'

const campo =
  'rounded-lg border border-borda bg-card px-3 py-2.5 text-sm outline-none focus:border-destaque'
const campoModal =
  'w-full rounded-lg border border-borda bg-fundo px-3 py-2.5 text-sm outline-none focus:border-destaque'
const botaoAcao =
  'rounded-lg border border-borda px-3 py-1.5 text-xs hover:bg-white/5'
const botaoExcluir =
  'rounded-lg border border-red-500/30 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10'

function Modal({ titulo, onFechar, largura = 'max-w-lg', children }) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"
      onClick={onFechar}
    >
      <div
        className={`max-h-[90vh] w-full ${largura} overflow-y-auto rounded-xl border border-borda bg-card p-5`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold">{titulo}</h3>
          <button
            type="button"
            onClick={onFechar}
            className="text-white/60 hover:text-white"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function plataformaParaTexto(valor) {
  const texto = formatarPlataformas(valor)
  return /informada/i.test(texto) ? '' : texto
}

export default function Home() {
  const [jogos, setJogos] = useState([])
  const [carregandoJogos, setCarregandoJogos] = useState(true)
  const [erroJogos, setErroJogos] = useState('')

  const [avaliacoes, setAvaliacoes] = useState([])
  const [carregandoAvaliacoes, setCarregandoAvaliacoes] = useState(true)
  const [erroAvaliacoes, setErroAvaliacoes] = useState('')

  const [jogoSelecionadoId, setJogoSelecionadoId] = useState('')
  const [jogoEncontrado, setJogoEncontrado] = useState(null)
  const [buscandoJogo, setBuscandoJogo] = useState(false)
  const [erroBusca, setErroBusca] = useState('')

  const [filtroJogo, setFiltroJogo] = useState('')

  const [formJogo, setFormJogo] = useState(null)
  const [formAvaliacao, setFormAvaliacao] = useState(null)
  const [salvando, setSalvando] = useState(false)
  const [erroModal, setErroModal] = useState('')
  const [erroAcao, setErroAcao] = useState('')

  const [confirmacao, setConfirmacao] = useState(null)
  const [excluindo, setExcluindo] = useState(false)

  async function carregarJogos() {
    try {
      const dados = await listarJogos()
      setJogos(dados || [])
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
      setAvaliacoes(dados || [])
      setErroAvaliacoes('')
    } catch (erro) {
      setErroAvaliacoes(erro.message || 'Erro ao carregar as avaliações.')
    } finally {
      setCarregandoAvaliacoes(false)
    }
  }

  useEffect(() => {
    carregarJogos()
    carregarAvaliacoes()
  }, [])

  async function selecionarJogo(id) {
    setJogoSelecionadoId(id)
    setJogoEncontrado(null)
    setErroBusca('')

    if (!id) return

    setBuscandoJogo(true)

    try {
      setJogoEncontrado(await buscarJogoPorId(id))
    } catch (erro) {
      setErroBusca(erro.message || 'Não foi possível encontrar o jogo.')
    } finally {
      setBuscandoJogo(false)
    }
  }

  function limparSelecao() {
    setJogoSelecionadoId('')
    setJogoEncontrado(null)
    setErroBusca('')
  }

  function abrirEdicaoJogo(jogo) {
    setErroModal('')
    setFormJogo({
      id: jogo.id,
      titulo: jogo.titulo || '',
      capa_url: jogo.capa_url || '',
      descricao: jogo.descricao || '',
      genero: jogo.genero || '',
      plataforma: plataformaParaTexto(jogo.plataforma),
    })
  }

  function abrirEdicaoAvaliacao(avaliacao) {
    setErroModal('')
    setFormAvaliacao({
      id: avaliacao.id,
      nome_avaliador: avaliacao.nome_avaliador || '',
      nota: Number(avaliacao.nota) || 0,
      review: avaliacao.review || '',
    })
  }

  function alterarFormJogo(event) {
    const { name, value } = event.target
    setFormJogo((atual) => ({ ...atual, [name]: value }))
  }

  function alterarFormAvaliacao(event) {
    const { name, value } = event.target
    setFormAvaliacao((atual) => ({ ...atual, [name]: value }))
  }

  async function salvarJogo(event) {
    event.preventDefault()
    setErroModal('')

    if (!formJogo.titulo.trim()) {
      setErroModal('Informe o título do jogo.')
      return
    }

    setSalvando(true)

    try {
      await editarJogo(formJogo.id, {
        titulo: formJogo.titulo.trim(),
        capa_url: formJogo.capa_url.trim() || null,
        descricao: formJogo.descricao.trim() || null,
        genero: formJogo.genero.trim() || null,
        plataforma: formJogo.plataforma
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      })

      setFormJogo(null)
      limparSelecao()
      await carregarJogos()
    } catch (erro) {
      setErroModal(erro.message || 'Não foi possível salvar o jogo.')
    } finally {
      setSalvando(false)
    }
  }

  async function salvarAvaliacao(event) {
    event.preventDefault()
    setErroModal('')

    if (!formAvaliacao.nome_avaliador.trim()) {
      setErroModal('Informe o nome do avaliador.')
      return
    }

    if (formAvaliacao.nota < 1 || formAvaliacao.nota > 5) {
      setErroModal('Selecione uma nota de 1 a 5.')
      return
    }

    setSalvando(true)

    try {
      await editarAvaliacao(formAvaliacao.id, {
        nome_avaliador: formAvaliacao.nome_avaliador.trim(),
        nota: formAvaliacao.nota,
        review: formAvaliacao.review.trim(),
      })

      setFormAvaliacao(null)
      await Promise.all([carregarAvaliacoes(), carregarJogos()])
    } catch (erro) {
      setErroModal(erro.message || 'Não foi possível salvar a avaliação.')
    } finally {
      setSalvando(false)
    }
  }

  function removerJogo(jogo) {
    setErroAcao('')
    setConfirmacao({
      titulo: 'Excluir jogo',
      mensagem: `Excluir "${jogo.titulo}"? Essa ação não pode ser desfeita.`,
      erroPadrao: 'Não foi possível excluir o jogo.',
      acao: async () => {
        await excluirJogo(jogo.id)
        setFiltroJogo('')
        limparSelecao()
        await Promise.all([carregarJogos(), carregarAvaliacoes()])
      },
    })
  }

  function removerAvaliacao(avaliacao) {
    setErroAcao('')
    setConfirmacao({
      titulo: 'Excluir avaliação',
      mensagem: 'Excluir esta avaliação? Essa ação não pode ser desfeita.',
      erroPadrao: 'Não foi possível excluir a avaliação.',
      acao: async () => {
        await excluirAvaliacao(avaliacao.id)
        await Promise.all([carregarAvaliacoes(), carregarJogos()])
      },
    })
  }

  async function confirmarExclusao() {
    const atual = confirmacao
    setExcluindo(true)

    try {
      await atual.acao()
    } catch (erro) {
      setErroAcao(erro.message || atual.erroPadrao)
    } finally {
      setExcluindo(false)
      setConfirmacao(null)
    }
  }

  function cancelarExclusao() {
    if (!excluindo) setConfirmacao(null)
  }

  const lista = useMemo(() => {
    return avaliacoes
      .map((avaliacao) => ({
        avaliacao,
        jogo: jogos.find(
          (jogo) => Number(jogo.id) === Number(avaliacao.jogo_id)
        ),
      }))
      .filter(({ jogo }) => {
        if (!jogo) return false

        return !filtroJogo || Number(jogo.id) === Number(filtroJogo)
      })
      .sort((a, b) =>
        (b.avaliacao.criado_em || '').localeCompare(
          a.avaliacao.criado_em || ''
        )
      )
  }, [avaliacoes, jogos, filtroJogo])

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
            <h2 className="break-words text-lg font-bold">{jogo.titulo}</h2>

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

          <div className="mt-4 flex items-center justify-between gap-2 border-t border-borda pt-3">
            <p className="text-sm text-destaque">
              ★ {Number(jogo.nota_media || 0).toFixed(1)}
              <span className="ml-2 text-xs text-white/50">Nota média</span>
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => abrirEdicaoJogo(jogo)}
                className={botaoAcao}
              >
                Editar
              </button>
              <button
                type="button"
                onClick={() => removerJogo(jogo)}
                className={botaoExcluir}
              >
                Excluir
              </button>
            </div>
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
            <h1 className="text-4xl font-extrabold">Biblioteca de jogos</h1>
            <p className="mt-2 text-sm text-white/60">
              Confira os jogos cadastrados no GameTrack.
            </p>
          </div>

          <p className="text-xs text-white/50">
            {jogos.length} jogos cadastrados
          </p>
        </div>

        {erroAcao && (
          <p role="alert" className="mt-4 text-sm text-red-400">
            {erroAcao}
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <select
            value={jogoSelecionadoId}
            onChange={(event) => selecionarJogo(event.target.value)}
            disabled={carregandoJogos || jogos.length === 0}
            className={`${campo} min-w-0 flex-1`}
            aria-label="Selecionar jogo"
          >
            <option value="">Selecione um jogo</option>
            {jogos.map((jogo) => (
              <option key={jogo.id} value={jogo.id}>
                {jogo.titulo} (ID {jogo.id})
              </option>
            ))}
          </select>

          {(jogoSelecionadoId || erroBusca) && (
            <button
              type="button"
              onClick={limparSelecao}
              className="rounded-lg border border-borda px-4 py-2.5 text-sm"
            >
              Limpar
            </button>
          )}
        </div>

        {buscandoJogo && (
          <p className="mt-3 text-sm text-white/60">Buscando...</p>
        )}

        {erroBusca && (
          <p role="alert" className="mt-3 text-sm text-red-400">
            {erroBusca}
          </p>
        )}

        {jogoEncontrado && (
          <div className="mt-5">
            <p className="mb-3 text-sm font-semibold text-destaque">
              Jogo selecionado
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {renderizarJogo(jogoEncontrado)}
            </div>
          </div>
        )}

        {carregandoJogos && (
          <p className="mt-5 text-sm text-white/60">Carregando jogos...</p>
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

        {!carregandoJogos && !erroJogos && jogos.length === 0 && (
          <div className="mt-5 rounded-xl border border-dashed border-borda p-8 text-center text-sm text-white/50">
            Nenhum jogo cadastrado ainda.
          </div>
        )}

        {!erroJogos && jogos.length > 0 && (
          <>
            <h2 className="mt-7 text-lg font-bold">Todos os jogos</h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {jogos.map(renderizarJogo)}
            </div>
          </>
        )}
      </div>

      <div className="border-t border-borda pt-8">
        <p className="text-xs font-bold uppercase tracking-widest text-destaque">
          Da comunidade
        </p>

        <div className="mt-2 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-4xl font-extrabold">Todas as avaliações</h2>
            <p className="mt-2 text-sm text-white/60">
              Leia o que a comunidade está jogando.
            </p>
          </div>

          <p className="text-xs text-white/50">
            {avaliacoes.length}{' '}
            {avaliacoes.length === 1
              ? 'avaliação publicada'
              : 'avaliações publicadas'}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <select
            value={filtroJogo}
            onChange={(event) => setFiltroJogo(event.target.value)}
            className={`${campo} min-w-60 flex-1`}
            aria-label="Filtrar avaliações por jogo"
          >
            <option value="">Todos os jogos</option>
            {jogos.map((jogo) => (
              <option key={jogo.id} value={jogo.id}>
                {jogo.titulo}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3 text-xs text-white/50">
          <span className="font-semibold text-white/80">
            Últimas publicações
          </span>

          <span>
            {lista.length
              ? `${lista.length} de ${avaliacoes.length} avaliações`
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
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            {lista.map(({ avaliacao, jogo }) => (
              <div key={avaliacao.id} className="flex flex-col gap-2">
                <AvaliacaoCard
                  avaliacao={avaliacao}
                  jogo={jogo}
                  media={Number(jogo.nota_media || 0)}
                />

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => abrirEdicaoAvaliacao(avaliacao)}
                    className={botaoAcao}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => removerAvaliacao(avaliacao)}
                    className={botaoExcluir}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-3 rounded-xl border border-dashed border-borda p-12 text-center text-white/50">
            Nenhuma avaliação encontrada para esse filtro.
          </div>
        )}
      </div>

      {formJogo && (
        <Modal titulo="Editar jogo" onFechar={() => setFormJogo(null)}>
          <form onSubmit={salvarJogo} className="space-y-4">
            <input
              name="titulo"
              value={formJogo.titulo}
              onChange={alterarFormJogo}
              placeholder="Título *"
              className={campoModal}
            />
            <input
              name="capa_url"
              type="url"
              value={formJogo.capa_url}
              onChange={alterarFormJogo}
              placeholder="URL da capa"
              className={campoModal}
            />
            <textarea
              name="descricao"
              rows={4}
              value={formJogo.descricao}
              onChange={alterarFormJogo}
              placeholder="Descrição"
              className={`${campoModal} resize-y`}
            />
            <input
              name="genero"
              value={formJogo.genero}
              onChange={alterarFormJogo}
              placeholder="Gênero"
              className={campoModal}
            />
            <input
              name="plataforma"
              value={formJogo.plataforma}
              onChange={alterarFormJogo}
              placeholder="Plataformas separadas por vírgula"
              className={campoModal}
            />

            {erroModal && (
              <p role="alert" className="text-sm text-red-400">
                {erroModal}
              </p>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setFormJogo(null)}
                className={botaoAcao}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={salvando}
                className="rounded-lg bg-destaque px-4 py-2 text-sm font-bold text-fundo disabled:opacity-50"
              >
                {salvando ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {formAvaliacao && (
        <Modal
          titulo="Editar avaliação"
          onFechar={() => setFormAvaliacao(null)}
        >
          <form onSubmit={salvarAvaliacao} className="space-y-4">
            <input
              name="nome_avaliador"
              value={formAvaliacao.nome_avaliador}
              onChange={alterarFormAvaliacao}
              placeholder="Nome do avaliador *"
              className={campoModal}
            />

            <div className="grid grid-cols-5 gap-1.5">
              {[1, 2, 3, 4, 5].map((valor) => (
                <button
                  key={valor}
                  type="button"
                  aria-pressed={formAvaliacao.nota === valor}
                  onClick={() =>
                    setFormAvaliacao((atual) => ({ ...atual, nota: valor }))
                  }
                  className={`rounded-md border py-2.5 text-sm transition ${
                    formAvaliacao.nota === valor
                      ? 'border-destaque bg-destaque/10 text-destaque'
                      : 'border-borda text-white/60 hover:text-destaque'
                  }`}
                >
                  ★ {valor}
                </button>
              ))}
            </div>

            <textarea
              name="review"
              rows={4}
              value={formAvaliacao.review}
              onChange={alterarFormAvaliacao}
              placeholder="Review (opcional)"
              className={`${campoModal} resize-y`}
            />

            {erroModal && (
              <p role="alert" className="text-sm text-red-400">
                {erroModal}
              </p>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setFormAvaliacao(null)}
                className={botaoAcao}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={salvando}
                className="rounded-lg bg-destaque px-4 py-2 text-sm font-bold text-fundo disabled:opacity-50"
              >
                {salvando ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {confirmacao && (
        <Modal
          titulo={confirmacao.titulo}
          onFechar={cancelarExclusao}
          largura="max-w-sm"
        >
          <p className="text-sm text-white/70">{confirmacao.mensagem}</p>

          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={cancelarExclusao}
              disabled={excluindo}
              className={`${botaoAcao} disabled:opacity-50`}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={confirmarExclusao}
              disabled={excluindo}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white hover:bg-red-600 disabled:opacity-50"
            >
              {excluindo ? 'Excluindo...' : 'Excluir'}
            </button>
          </div>
        </Modal>
      )}
    </section>
  )
}