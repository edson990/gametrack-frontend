
import { useState } from 'react'

const CAPA_PADRAO =
  'https://cdn.akamai.steamstatic.com/steam/apps/753640/library_600x900.jpg'

export default function AdicionarJogo() {
  const [titulo, setTitulo] = useState('Outer Wilds')
  const [urlCapa, setUrlCapa] = useState(CAPA_PADRAO)
  const [descricao, setDescricao] = useState(
    'Explore um sistema solar cheio de mistérios em uma aventura espacial de mundo aberto. Descubra os segredos de uma civilização perdida e encontre respostas antes que o tempo recomece.'
  )
  const [genero, setGenero] = useState('Aventura e exploração')
  const [plataformas, setPlataformas] = useState(
    'PC, PlayStation 4, Nintendo Switch'
  )
  const [capaComErro, setCapaComErro] = useState(false)
  const [mensagem, setMensagem] = useState('')

  function atualizarCapa(valor) {
    setUrlCapa(valor)
    setCapaComErro(false)
  }

  function cancelar() {
    setTitulo('')
    setUrlCapa('')
    setDescricao('')
    setGenero('')
    setPlataformas('')
    setCapaComErro(false)
    setMensagem('')
  }

  function adicionarJogo(event) {
    event.preventDefault()
    setMensagem(
      'Formulário preenchido! A integração para salvar o jogo será feita com o backend.'
    )
  }

  const imagemValida = urlCapa.trim() !== '' && !capaComErro

  return (
    <section className="mx-auto w-full max-w-5xl text-[#e8e9e4]">
      <button
        type="button"
        onClick={() => window.history.back()}
        className="mb-3 text-xs text-[#a4a79e] transition hover:text-[#c0ff5d]"
      >
        ← Voltar para avaliações
      </button>

      <div className="mb-7 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Adicionar jogo
          </h1>
          <p className="mt-2 text-xs leading-5 text-[#a4a79e]">
            Não encontrou o que jogou? Adicione o jogo para que você e outras
            pessoas possam avaliar.
          </p>
        </div>

        <span className="hidden pt-2 text-[9px] uppercase tracking-wide text-[#777c72] sm:block">
          Mais um jogo ao catálogo
        </span>
      </div>

      <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-[minmax(0,1.7fr)_minmax(250px,0.8fr)]">
        <form
          onSubmit={adicionarJogo}
          className="rounded-lg border border-[#292e27] bg-[#171b17] p-4 sm:p-5"
        >
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-xs font-semibold">Informações do jogo</h2>
            <span className="text-[9px] text-[#a4a79e]">
              <span className="text-[#c0ff5d]">*</span> Campos obrigatórios
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[11px]">
                Título do jogo <span className="text-[#c0ff5d]">*</span>
              </label>
              <input
                required
                value={titulo}
                onChange={(e) => {
                  setTitulo(e.target.value)
                  setMensagem('')
                }}
                placeholder="Ex.: Outer Wilds"
                className="w-full rounded-md border border-[#292e27] bg-[#101310] px-3 py-2.5 text-xs outline-none transition placeholder:text-[#666b62] focus:border-[#a8e94e]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px]">
                URL da capa
              </label>
              <input
                type="url"
                value={urlCapa}
                onChange={(e) => atualizarCapa(e.target.value)}
                placeholder="https://exemplo.com/capa.jpg"
                className="w-full rounded-md border border-[#292e27] bg-[#101310] px-3 py-2.5 text-xs outline-none transition placeholder:text-[#666b62] focus:border-[#a8e94e]"
              />
              <p className="mt-1.5 text-[9px] leading-4 text-[#777c72]">
                Use o link direto de uma imagem. Prefira uma capa vertical (2:3).
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px]">
                Descrição
              </label>
              <textarea
                rows={4}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Conte um pouco sobre o jogo..."
                className="w-full resize-y rounded-md border border-[#292e27] bg-[#101310] px-3 py-2.5 text-xs leading-5 outline-none transition placeholder:text-[#666b62] focus:border-[#a8e94e]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px]">Gênero</label>
              <input
                value={genero}
                onChange={(e) => setGenero(e.target.value)}
                placeholder="Ex.: RPG, aventura, estratégia"
                className="w-full rounded-md border border-[#292e27] bg-[#101310] px-3 py-2.5 text-xs outline-none transition placeholder:text-[#666b62] focus:border-[#a8e94e]"
              />
              <p className="mt-1.5 text-[9px] text-[#777c72]">
                Ex.: RPG, plataforma, aventura, estratégia.
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px]">Plataformas</label>
              <input
                value={plataformas}
                onChange={(e) => setPlataformas(e.target.value)}
                placeholder="PC, PlayStation 5, Xbox..."
                className="w-full rounded-md border border-[#292e27] bg-[#101310] px-3 py-2.5 text-xs outline-none transition placeholder:text-[#666b62] focus:border-[#a8e94e]"
              />
              <p className="mt-1.5 text-[9px] text-[#777c72]">
                Se houver mais de uma, separe por vírgulas.
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

          <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#292e27] pt-4">
            <button
              type="button"
              onClick={cancelar}
              className="rounded-md border border-[#30362d] px-4 py-2 text-[11px] transition hover:bg-[#242a22]"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="rounded-md bg-[#c0ff5d] px-4 py-2.5 text-[11px] font-semibold text-[#17200d] transition hover:bg-[#d0ff8b]"
            >
              + &nbsp; Adicionar jogo
            </button>
          </div>
        </form>

        <aside className="space-y-4">
          <div className="rounded-lg border border-[#292e27] bg-[#171b17] p-3.5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[9px] uppercase tracking-wide text-[#a4a79e]">
                Preview do jogo
              </h2>
              <span className="text-xs text-[#777c72]">◉</span>
            </div>

            <div className="mx-auto mb-3 aspect-[2/3] w-full max-w-[190px] overflow-hidden rounded-md bg-[#242a22] sm:max-w-none">
              {imagemValida ? (
                <img
                  src={urlCapa}
                  alt={`Capa de ${titulo || 'jogo'}`}
                  onError={() => setCapaComErro(true)}
                  onLoad={() => setCapaComErro(false)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full min-h-40 items-center justify-center p-4 text-center text-xs text-[#a4a79e]">
                  Capa indisponível
                </div>
              )}
            </div>

            <h3 className="break-words text-lg font-bold">
              {titulo.trim() || 'Título do jogo'}
            </h3>
            <p className="mt-1 text-[10px] leading-4 text-[#a4a79e]">
              {genero || 'Gênero não informado'}
            </p>
            <p className="mt-2 text-[9px] leading-4 text-[#777c72]">
              {plataformas || 'Plataformas não informadas'}
            </p>

            <div className="mt-4 flex items-center gap-2 border-t border-[#292e27] pt-3">
              <span className="text-sm text-[#c0ff5d]">▧</span>
              <span className="text-[10px] text-[#a4a79e]">
                Ainda sem avaliações
              </span>
            </div>
          </div>

          <div className="flex gap-3 px-1">
            <span className="text-sm text-[#c0ff5d]">▥</span>
            <div>
              <h3 className="text-[10px] font-semibold">
                Pronto para a primeira opinião.
              </h3>
              <p className="mt-1 text-[9px] leading-4 text-[#777c72]">
                Depois de adicionar, o jogo ficará disponível na seleção de
                jogos para criar uma avaliação.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
