
const API_URL = 'http://localhost:3000/api'


export async function listarJogos(genero = '') {
  const parametros = new URLSearchParams()

  if (genero.trim()) {
    parametros.set('genero', genero.trim())
  }

  const query = parametros.toString()
  const url = query
    ? `${API_URL}/jogo?${query}`
    : `${API_URL}/jogo`

  const resposta = await fetch(url)

  if (!resposta.ok) {
    throw new Error('Não foi possível carregar os jogos.')
  }

  const dados = await resposta.json()
  return dados.jogos
}



export async function buscarJogoPorId(id) {
  const resposta = await fetch(`${API_URL}/jogo/${id}`)
  const dados = await resposta.json()

  if (!resposta.ok) {
    throw new Error(
      dados.erro || 'Não foi possível encontrar o jogo.'
    )
  }

  const jogo = Array.isArray(dados.jogo)
    ? dados.jogo[0]
    : dados.jogo

  if (!jogo) {
    throw new Error('Jogo não encontrado.')
  }

  return jogo
}


export async function cadastrarJogo(jogo) {
  const resposta = await fetch(`${API_URL}/jogo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(jogo),
  })

  const dados = await resposta.json()

  if (!resposta.ok) {
    throw new Error(
      dados.erro || 'Não foi possível cadastrar o jogo.'
    )
  }

  return dados
}

export async function cadastrarAvaliacao(avaliacao) {
  const resposta = await fetch(`${API_URL}/avaliacao`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(avaliacao),
  })

  const dados = await resposta.json()

  if (!resposta.ok) {
    throw new Error(
      dados.erro || 'Não foi possível cadastrar a avaliação.'
    )
  }

  return dados
}


export async function listarAvaliacoes() {
  const resposta = await fetch(`${API_URL}/avaliacao`)
  const dados = await resposta.json()

  // O backend retorna 404 quando ainda não há avaliações.
  if (resposta.status === 404) {
    return []
  }

  if (!resposta.ok) {
    throw new Error(
      dados.erro || 'Não foi possível carregar as avaliações.'
    )
  }

  return dados.avaliacoes || []
}


async function lerResposta(resposta) {
  const dados = await resposta.json().catch(() => ({}))

  if (!resposta.ok) {
    throw new Error(
      dados.erro || `Erro na requisição: HTTP ${resposta.status}`
    )
  }

  return dados
}

// EDITAR JOGO
export async function editarJogo(id, jogo) {
  const resposta = await fetch(`${API_URL}/jogo/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(jogo),
  })

  return lerResposta(resposta)
}

// EXCLUIR JOGO
export async function excluirJogo(id) {
  const resposta = await fetch(`${API_URL}/jogo/${id}`, {
    method: 'DELETE',
  })

  return lerResposta(resposta)
}

// BUSCAR AVALIAÇÃO POR ID
export async function buscarAvaliacaoPorId(id) {
  const resposta = await fetch(`${API_URL}/avaliacao/${id}`)
  const dados = await lerResposta(resposta)

  const avaliacao = Array.isArray(dados.avaliacao)
    ? dados.avaliacao[0]
    : dados.avaliacao

  if (!avaliacao) {
    throw new Error('Avaliação não encontrada.')
  }

  return avaliacao
}

// LISTAR AVALIAÇÕES DE UM JOGO ESPECÍFICO
export async function listarAvaliacoesPorJogo(jogoId) {
  const resposta = await fetch(
    `${API_URL}/avaliacao?jogo_id=${encodeURIComponent(jogoId)}`
  )

  const dados = await lerResposta(resposta)
  return dados.avaliacoes || []
}

// EDITAR AVALIAÇÃO
export async function editarAvaliacao(id, avaliacao) {
  const resposta = await fetch(`${API_URL}/avaliacao/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(avaliacao),
  })

  return lerResposta(resposta)
}

// EXCLUIR AVALIAÇÃO
export async function excluirAvaliacao(id) {
  const resposta = await fetch(`${API_URL}/avaliacao/${id}`, {
    method: 'DELETE',
  })

  return lerResposta(resposta)
}
