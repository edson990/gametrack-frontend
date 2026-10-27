export const jogos = [
  { id: 1, titulo: 'Elden Ring', capa_url: '', descricao: 'RPG de mundo aberto nas Terras Intermédias.', genero: 'RPG de ação', plataforma: 'PC' },
  { id: 2, titulo: 'Hollow Knight', capa_url: '', descricao: 'Metroidvania em um reino subterrâneo de insetos.', genero: 'Metroidvania', plataforma: 'Nintendo Switch' },
  { id: 3, titulo: 'Hades', capa_url: '', descricao: 'Roguelike de ação pelo submundo grego.', genero: 'Roguelike', plataforma: 'PC' },
  { id: 4, titulo: 'Celeste', capa_url: '', descricao: 'Plataforma sobre escalar uma montanha e superar a ansiedade.', genero: 'Plataforma', plataforma: 'PlayStation 4' },
  { id: 5, titulo: 'Stardew Valley', capa_url: '', descricao: 'Herde uma fazenda e faça amizade com a vila.', genero: 'Simulação', plataforma: 'PC' },
  { id: 6, titulo: 'God of War', capa_url: '', descricao: 'Kratos e Atreus na mitologia nórdica.', genero: 'Aventura', plataforma: 'PlayStation' },
]

export const avaliacoes = [
  { id: 1, jogo_id: 1, nome_avaliador: 'Lucas Almeida', nota: 5, review: 'A sensação de descobrir um caminho que parecia impossível não tem igual. Cada ruína conta uma história.', criado_em: '2026-10-27' },
  { id: 2, jogo_id: 2, nome_avaliador: 'Bia Santos', nota: 5, review: 'Hallownest é um lugar triste e lindo de se perder. O combate é preciso.', criado_em: '2026-10-26' },
  { id: 3, jogo_id: 3, nome_avaliador: 'Rafael Oliveira', nota: 4, review: 'Fui pela ação e fiquei pelos personagens. Até perder faz a história andar.', criado_em: '2026-10-25' },
  { id: 4, jogo_id: 4, nome_avaliador: 'Ana Ferreira', nota: 5, review: 'Poucos jogos fazem a dificuldade conversar tão bem com a história.', criado_em: '2026-10-23' },
  { id: 5, jogo_id: 5, nome_avaliador: 'Clara Nunes', nota: 5, review: 'Aconchegante, profundo e impossível de largar.', criado_em: '2026-10-20' },
  { id: 6, jogo_id: 6, nome_avaliador: 'André Lima', nota: 4, review: 'Combate poderoso e uma história que fica com você.', criado_em: '2026-10-18' },
  { id: 7, jogo_id: 1, nome_avaliador: 'Marina Costa', nota: 4, review: '', criado_em: '2026-10-15' },
  { id: 8, jogo_id: 3, nome_avaliador: 'Pedro Dias', nota: 5, review: 'Cada tentativa tem uma história nova.', criado_em: '2026-10-12' },
]

export const mediaDoJogo = (lista, jogoId) => {
  const notas = lista.filter((a) => a.jogo_id === jogoId).map((a) => a.nota)
  return notas.length ? notas.reduce((s, n) => s + n, 0) / notas.length : 0
}