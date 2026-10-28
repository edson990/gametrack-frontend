
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { cadastrarAvaliacao, listarJogos } from '../services/api'
import { formatarPlataformas } from '../utils/plataforma'

export default function NovaAvaliacao() {
  const [jogos, setJogos] = useState([])
  const [jogoId, setJogoId] = useState('')
  const [avaliador, setAvaliador] = useState('')
  const [nota, setNota] = useState(0)
  const [review, setReview] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    async function carregarJogos() {
      try {
        const dados = await listarJogos()
        setJogos(dados)

        if (dados.length > 0) {
          setJogoId(String(dados[0].id))
        }
      } catch (error) {
        setErro(error.message || 'Não foi possível carregar os jogos.')
      } finally {
        setCarregando(false)
      }
    }

    carregarJogos()
  }, [])

  const jogoSelecionado = jogos.find(
    (jogo) => String(jogo.id) === String(jogoId),
  )

  async function publicarAvaliacao(event) {
    event.preventDefault()
    setMensagem('')
    setErro('')

    if (!jogoId) {
      setErro('Cadastre ou selecione um jogo antes de avaliar.')
      return
    }

    if (nota < 1 || nota > 5) {
      setErro('Selecione uma nota de 1 a 5.')
      return
    }

    if (!avaliador.trim()) {
      setErro('Informe o nome do avaliador.')
      return
    }

    setEnviando(true)

    try {
      await cadastrarAvaliacao({
        jogo_id: Number(jogoId),
        nome_avaliador: avaliador.trim(),
        nota,
        review: review.trim(),
      })

      setMensagem('Avaliação publicada com sucesso no GameTrack!')
      setAvaliador('')
      setNota(0)
      setReview('')
    } catch (error) {
      setErro(error.message || 'Não foi possível publicar a avaliação.')
    } finally {
      setEnviando(false)
    }
  }

  function cancelar() {
    setAvaliador('')
    setNota(0)
    setReview('')
    setMensagem('')
    setErro('')
  }

  return (
    <section className="mx-auto w-full max-w-5xl text-[#e8e9e4]">
      <Link
        to="/"
        className="mb-3 inline-block text-xs text-[#a4a79e] transition hover:text-[#c0ff5d]"
      >
        ← Voltar para avaliações
      </Link>

      <div className="mb-7 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Adicionar avaliação
          </h1>
          <p className="mt-2 text-xs leading-5 text-[#a4a79e]">
            Vale o que você sentiu jogando. Escolha um jogo e compartilhe sua
            experiência.
          </p>
        </div>

        <span className="hidden pt-2 text-[9px] uppercase tracking-wide text-[#777c72] sm:block">
          Sua voz de gamer
        </span>
      </div>

      <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-[minmax(0,1.7fr)_minmax(250px,0.8fr)]">
        <form
          onSubmit={publicarAvaliacao}
          className="rounded-lg border border-[#292e27] bg-[#171b17] p-4 sm:p-5"
        >
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-xs font-semibold">Sua avaliação</h2>
            <span className="text-[9px] text-[#a4a79e]">
              <span className="text-[#c0ff5d]">*</span> Campos obrigatórios
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="jogo" className="mb-1.5 block text-[11px]">
                Jogo <span className="text-[#c0ff5d]">*</span>
              </label>

              <select
                id="jogo"
                required
                disabled={carregando || jogos.length === 0}
                value={jogoId}
                onChange={(e) => {
                  setJogoId(e.target.value)
                  setMensagem('')
                  setErro('')
                }}
                className="w-full rounded-md border border-[#292e27] bg-[#101310] px-3 py-2.5 text-xs outline-none transition focus:border-[#a8e94e]"
              >
                {carregando && <option value="">Carregando jogos...</option>}
                {!carregando && jogos.length === 0 && (
                  <option value="">Nenhum jogo cadastrado</option>
                )}
                {jogos.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.titulo}
                  </option>
                ))}
              </select>

              <p className="mt-1.5 text-[9px] text-[#777c72]">
                Não encontrou o jogo?{' '}
                <Link
                  to="/adicionar-jogo"
                  className="text-[#c0ff5d] hover:underline"
                >
                  Adicionar ao catálogo ↗
                </Link>
              </p>
            </div>

            <div>
              <label htmlFor="avaliador" className="mb-1.5 block text-[11px]">
                Nome do avaliador{' '}
                <span className="text-[#c0ff5d]">*</span>
              </label>

              <input
                id="avaliador"
                required
                value={avaliador}
                onChange={(e) => setAvaliador(e.target.value)}
                placeholder="Como você quer aparecer?"
                className="w-full rounded-md border border-[#292e27] bg-[#101310] px-3 py-2.5 text-xs outline-none transition placeholder:text-[#666b62] focus:border-[#a8e94e]"
              />

              <p className="mt-1.5 text-[9px] text-[#777c72]">
                Este é o nome que aparecerá na sua avaliação.
              </p>
            </div>

            <fieldset>
              <legend className="mb-2 text-[11px]">
                Sua nota <span className="text-[#c0ff5d]">*</span>
              </legend>

              <div className="mb-2 flex items-center justify-between">
                <span className="text-[9px] text-[#777c72]">
                  Escolha de 1 a 5
                </span>
                <span className="text-[9px] text-[#c0ff5d]">
                  {nota > 0
                    ? `${nota} de 5 ★ ${
                        nota === 5
                          ? 'Favorito'
                          : nota === 4
                            ? 'Excelente'
                            : nota === 3
                              ? 'Bom'
                              : nota === 2
                                ? 'Regular'
                                : 'Fraco'
                      }`
                    : 'Selecione uma nota'}
                </span>
              </div>

              <div className="grid grid-cols-5 gap-1.5">
                {[1, 2, 3, 4, 5].map((valor) => (
                  <button
                    key={valor}
                    type="button"
                    aria-pressed={nota === valor}
                    aria-label={`Dar nota ${valor} de 5`}
                    onClick={() => {
                      setNota(valor)
                      setMensagem('')
                      setErro('')
                    }}
                    className={`flex items-center justify-center gap-1 rounded-md border px-1 py-3 text-xs transition sm:gap-2 ${
                      nota === valor
                        ? 'border-[#a8e94e] bg-[#26351b] text-[#c0ff5d]'
                        : 'border-[#292e27] bg-[#101310] text-[#a4a79e] hover:border-[#697d4c] hover:text-[#c0ff5d]'
                    }`}
                  >
                    <span>★</span>
                    <span>{valor}</span>
                  </button>
                ))}
              </div>

              <div className="mt-1.5 flex justify-between text-[9px] text-[#777c72]">
                <span>1 ★ Não curti</span>
                <span>5 ★ Favorito</span>
              </div>
            </fieldset>

            <div>
              <label htmlFor="review" className="mb-1.5 block text-[11px]">
                Review (opcional)
              </label>

              <textarea
                id="review"
                rows={4}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="O que você achou do jogo? Conte sua experiência..."
                className="w-full resize-y rounded-md border border-[#292e27] bg-[#101310] px-3 py-2.5 text-xs leading-5 outline-none transition placeholder:text-[#666b62] focus:border-[#a8e94e]"
              />

              <p className="mt-1.5 text-[9px] leading-4 text-[#777c72]">
                Conte o que marcou sua experiência. Se puder, evite spoilers.
              </p>
            </div>
          </div>

          {mensagem && (
            <p
              role="status"
              className="mt-4 rounded-md border border-[#526b32] bg-[#20291a] p-3 text-xs leading-5 text-[#c0ff5d]"
            >
              {mensagem}
            </p>
          )}

          {erro && (
            <p
              role="alert"
              className="mt-4 rounded-md border border-red-900 bg-red-950/40 p-3 text-xs leading-5 text-red-300"
            >
              {erro}
            </p>
          )}

          <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#292e27] pt-4">
            <button
              type="button"
              onClick={cancelar}
              className="rounded-md border border-[#30362d] px-4 py-2 text-[11px] transition hover:bg-[#242a22]"
            >
              Limpar
            </button>

            <button
              type="submit"
              disabled={nota === 0 || enviando || carregando || jogos.length === 0}
              className="rounded-md bg-[#c0ff5d] px-4 py-2.5 text-[11px] font-semibold text-[#17200d] transition hover:bg-[#d0ff8b] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {enviando ? 'Publicando...' : '↗ Publicar avaliação'}
            </button>
          </div>
        </form>

        <aside className="space-y-4">
          <div className="rounded-lg border border-[#292e27] bg-[#171b17] p-3.5">
            <h2 className="mb-3 text-[9px] uppercase tracking-wide text-[#a4a79e]">
              Jogo selecionado
            </h2>

            {jogoSelecionado ? (
              <>
                <div className="mx-auto mb-3 aspect-[2/3] w-full max-w-[190px] overflow-hidden rounded-md bg-[#242a22] sm:max-w-none">
                  {jogoSelecionado.capa_url ? (
                    <img
                      key={jogoSelecionado.id}
                      src={jogoSelecionado.capa_url}
                      alt={`Capa de ${jogoSelecionado.titulo}`}
                      onError={(e) => {
                        e.currentTarget.style.visibility = 'hidden'
                      }}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-[#777c72]">
                      Sem capa disponível
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-bold">
                  {jogoSelecionado.titulo}
                </h3>
                <p className="mt-1 text-[10px] text-[#a4a79e]">
                  {jogoSelecionado.genero || 'Gênero não informado'} ·{' '}
                  {formatarPlataformas(jogoSelecionado.plataforma)}
                </p>

                <div className="mt-4 flex items-center gap-3 border-t border-[#292e27] pt-3">
                  <span className="text-2xl font-bold">
                    {Number(jogoSelecionado.nota_media || 0).toLocaleString(
                      'pt-BR',
                      { minimumFractionDigits: 1, maximumFractionDigits: 1 },
                    )}
                  </span>
                  <div>
                    <div className="text-xs tracking-widest text-[#c0ff5d]">
                      ★★★★★
                    </div>
                    <p className="mt-1 text-[9px] text-[#777c72]">
                      Média da comunidade
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-xs text-[#a4a79e]">
                {carregando
                  ? 'Carregando informações do jogo...'
                  : 'Cadastre um jogo para poder avaliá-lo.'}
              </p>
            )}
          </div>

          <div className="flex gap-3 px-1">
            <span className="text-sm text-[#c0ff5d]">✦</span>
            <div>
              <h3 className="text-[10px] font-semibold">
                Sua opinião tem espaço aqui.
              </h3>
              <p className="mt-1 text-[9px] leading-4 text-[#777c72]">
                Sua avaliação será salva no GameTrack e ajudará a atualizar a
                nota média do jogo.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
