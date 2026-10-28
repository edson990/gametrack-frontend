
import { useState } from 'react'
import { cadastrarJogo } from '../services/api'

export default function AdicionarJogo() {
  const [titulo, setTitulo] = useState('Outer Wilds')
  const [urlCapa, setUrlCapa] = useState(
    'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/753640/header.jpg'
  )
  const [descricao, setDescricao] = useState(
    'Um jogo de exploração espacial em um sistema solar preso em um ciclo temporal.'
  )
  const [genero, setGenero] = useState('Aventura')
  const [plataformas, setPlataformas] = useState('PC')
  const [mensagem, setMensagem] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [capaComErro, setCapaComErro] = useState(false)

  async function adicionarJogo(event) {
    event.preventDefault()
    setMensagem('')
    setCarregando(true)

    try {
      const plataformasArray = plataformas
        .split(',')
        .map((plataforma) => plataforma.trim())
        .filter((plataforma) => plataforma !== '')

      await cadastrarJogo({
        titulo: titulo.trim(),
        capa_url: urlCapa.trim() || null,
        descricao: descricao.trim() || null,
        genero: genero.trim() || null,
        plataforma: plataformasArray,
      })

      setMensagem('Jogo cadastrado com sucesso no GameTrack!')
      setTitulo('')
      setUrlCapa('')
      setDescricao('')
      setGenero('')
      setPlataformas('')
      setCapaComErro(false)
    } catch (erro) {
      setMensagem(erro.message || 'Não foi possível cadastrar o jogo.')
    } finally {
      setCarregando(false)
    }
  }

  function cancelar() {
    setTitulo('')
    setUrlCapa('')
    setDescricao('')
    setGenero('')
    setPlataformas('')
    setMensagem('')
    setCapaComErro(false)
  }

  return (
    <main className="min-h-screen bg-[#10110f] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="mb-2 text-sm text-[#c0ff5d]">
            GAMETRACK / BIBLIOTECA
          </p>

          <h1 className="text-3xl font-bold md:text-4xl">
            Adicionar jogo
          </h1>

          <p className="mt-3 text-gray-400">
            Adicione um novo jogo à biblioteca do GameTrack.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <form
            onSubmit={adicionarJogo}
            className="space-y-5 rounded-2xl border border-white/10 bg-[#191a17] p-6"
          >
            <div>
              <label
                htmlFor="titulo"
                className="mb-2 block text-sm font-medium"
              >
                Título do jogo *
              </label>

              <input
                id="titulo"
                type="text"
                value={titulo}
                onChange={(event) => setTitulo(event.target.value)}
                placeholder="Ex.: Elden Ring"
                required
                className="w-full rounded-lg border border-white/10 bg-[#10110f] px-4 py-3 outline-none focus:border-[#c0ff5d]"
              />
            </div>

            <div>
              <label
                htmlFor="urlCapa"
                className="mb-2 block text-sm font-medium"
              >
                URL da capa
              </label>

              <input
                id="urlCapa"
                type="url"
                value={urlCapa}
                onChange={(event) => {
                  setUrlCapa(event.target.value)
                  setCapaComErro(false)
                }}
                placeholder="https://..."
                className="w-full rounded-lg border border-white/10 bg-[#10110f] px-4 py-3 outline-none focus:border-[#c0ff5d]"
              />
            </div>

            <div>
              <label
                htmlFor="descricao"
                className="mb-2 block text-sm font-medium"
              >
                Descrição
              </label>

              <textarea
                id="descricao"
                value={descricao}
                onChange={(event) => setDescricao(event.target.value)}
                placeholder="Descreva o jogo..."
                rows={4}
                className="w-full resize-y rounded-lg border border-white/10 bg-[#10110f] px-4 py-3 outline-none focus:border-[#c0ff5d]"
              />
            </div>

            <div>
              <label
                htmlFor="genero"
                className="mb-2 block text-sm font-medium"
              >
                Gênero
              </label>

              <input
                id="genero"
                type="text"
                value={genero}
                onChange={(event) => setGenero(event.target.value)}
                placeholder="Ex.: RPG, Aventura, Ação"
                className="w-full rounded-lg border border-white/10 bg-[#10110f] px-4 py-3 outline-none focus:border-[#c0ff5d]"
              />
            </div>

            <div>
              <label
                htmlFor="plataformas"
                className="mb-2 block text-sm font-medium"
              >
                Plataforma
              </label>

              <input
                id="plataformas"
                type="text"
                value={plataformas}
                onChange={(event) => setPlataformas(event.target.value)}
                placeholder="Ex.: PC, PlayStation, Xbox"
                className="w-full rounded-lg border border-white/10 bg-[#10110f] px-4 py-3 outline-none focus:border-[#c0ff5d]"
              />

              <p className="mt-2 text-xs text-gray-500">
                Separe por vírgulas. Opções aceitas: PC, PlayStation,
                Xbox e Nintendo Switch.
              </p>
            </div>

            {mensagem && (
              <p
                role="status"
                className={`rounded-lg p-3 text-sm ${
                  mensagem.includes('sucesso')
                    ? 'bg-[#c0ff5d]/10 text-[#c0ff5d]'
                    : 'bg-red-500/10 text-red-400'
                }`}
              >
                {mensagem}
              </p>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={carregando}
                className="rounded-lg bg-[#c0ff5d] px-5 py-3 font-semibold text-black transition hover:bg-[#d2ff8b] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {carregando ? 'Salvando...' : '+ Adicionar jogo'}
              </button>

              <button
                type="button"
                onClick={cancelar}
                disabled={carregando}
                className="rounded-lg border border-white/15 px-5 py-3 text-white transition hover:bg-white/5 disabled:opacity-60"
              >
                Limpar
              </button>
            </div>
          </form>

          <aside className="h-fit rounded-2xl border border-white/10 bg-[#191a17] p-6">
            <p className="mb-4 text-sm font-medium text-gray-400">
              PRÉ-VISUALIZAÇÃO
            </p>

            <div className="overflow-hidden rounded-xl border border-white/10 bg-[#10110f]">
              {urlCapa && !capaComErro ? (
                <img
                  src={urlCapa}
                  alt={`Capa de ${titulo || 'jogo'}`}
                  onError={() => setCapaComErro(true)}
                  className="h-52 w-full object-cover"
                />
              ) : (
                <div className="flex h-52 items-center justify-center bg-[#242620] text-gray-500">
                  Capa indisponível
                </div>
              )}

              <div className="space-y-3 p-5">
                <h2 className="text-2xl font-bold">
                  {titulo || 'Título do jogo'}
                </h2>

                <div className="flex flex-wrap gap-2">
                  {genero && (
                    <span className="rounded-full bg-[#c0ff5d]/10 px-3 py-1 text-sm text-[#c0ff5d]">
                      {genero}
                    </span>
                  )}

                  {plataformas && (
                    <span className="rounded-full bg-white/5 px-3 py-1 text-sm text-gray-300">
                      {plataformas}
                    </span>
                  )}
                </div>

                <p className="text-sm leading-6 text-gray-400">
                  {descricao || 'A descrição do jogo aparecerá aqui.'}
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs leading-5 text-gray-500">
              A pré-visualização mostra como as informações preenchidas
              poderão aparecer na biblioteca.
            </p>
          </aside>
        </div>
      </div>
    </main>
  )
}
