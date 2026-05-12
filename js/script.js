// Array que armazenará todos os RPGs cadastrados
let rpgs = [];

// Função para carregar dados do localStorage ao iniciar a página
function carregarDados() {
  const dados = localStorage.getItem('rpgBoxd');
  if (dados) {
    rpgs = JSON.parse(dados);
  } else {
    // Dados iniciais de exemplo (para não ficar vazio)
    rpgs = [
      {
        id: 1700000000001,
        nome: "Dungeons & Dragons 5ª Edicao",
        editora: "Wizards of the Coast",
        ano: 2014,
        genero: "fantasia",
        status: "completo",
        nota: 5,
        comentarios: "O classico absoluto! Sistema versatil, otimo para comecar no RPG."
      },
      {
        id: 1700000000002,
        nome: "Tormenta20",
        editora: "Jambo Editora",
        ano: 2020,
        genero: "fantasia",
        status: "incompleto",
        nota: 4,
        comentarios: "Sistema brasileiro muito bem feito! Combate tatico e muitas opcoes."
      },
      {
        id: 1700000000003,
        nome: "Call of Cthulhu",
        editora: "Chaosium",
        ano: 1981,
        genero: "terror",
        status: "quero",
        nota: 0,
        comentarios: ""
      },
      {
        id: 1700000000004,
        nome: "Cyberpunk RED",
        editora: "R. Talsorian Games",
        ano: 2020,
        genero: "sci-fi",
        status: "quero",
        nota: 0,
        comentarios: ""
      }
    ];
    salvarDados();
  }
  atualizarHeaderStats();
  renderizarCards();
}

// Função para salvar os dados no localStorage
function salvarDados() {
  localStorage.setItem('rpgBoxd', JSON.stringify(rpgs));
}

// Retorna o texto do genero em portugues
function getTextoGenero(genero) {
  const map = {
    fantasia: "Fantasia",
    terror: "Terror",
    "sci-fi": "Sci-Fi",
    futurismo: "Futurismo"
  };
  return map[genero] || genero;
}

// Retorna o texto legivel do status
function getTextoStatus(status) {
  const map = {
    quero: "Quero jogar",
    completo: "Completo",
    incompleto: "Incompleto",
    abandonado: "Abandonado"
  };
  return map[status] || status;
}

// Gera as estrelas visuais baseado na nota (0-5)
function renderizarEstrelas(nota) {
  let estrelas = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= nota) {
      estrelas += '★';
    } else {
      estrelas += '☆';
    }
  }
  return estrelas;
}

/*Renderizar Cards*/

function renderizarCards() {
  const grid = document.getElementById('sistemasLista');
  const mensagemVazia = document.getElementById('mensagemVazia');
  
  if (!grid) return;
  
  // Aplicar filtros e ordenacao
  let rpgsFiltrados = [...rpgs];
  
  const filtroGenero = document.getElementById('filtroGenero');
  const filtroStatus = document.getElementById('filtroStatus');
  const ordenacao = document.getElementById('ordenacao');
  
  // Filtro por genero
  if (filtroGenero && filtroGenero.value !== 'todos') {
    rpgsFiltrados = rpgsFiltrados.filter(r => r.genero === filtroGenero.value);
  }
  
  // Filtro por status
  if (filtroStatus && filtroStatus.value !== 'todos') {
    rpgsFiltrados = rpgsFiltrados.filter(r => r.status === filtroStatus.value);
  }
  
  //Ordenação dos elementos na página
  if (ordenacao) {
    switch(ordenacao.value) {
      case 'data-desc': // Mais recente (ID maior = mais novo)
        rpgsFiltrados.sort((a, b) => b.id - a.id);
        break;
      case 'data-asc': // Mais antigo
        rpgsFiltrados.sort((a, b) => a.id - b.id);
        break;
      case 'nome-asc': // Nome A-Z
        rpgsFiltrados.sort((a, b) => a.nome.localeCompare(b.nome));
        break;
      case 'nome-desc': // Nome Z-A
        rpgsFiltrados.sort((a, b) => b.nome.localeCompare(a.nome));
        break;
      case 'nota-desc': // Maior nota primeiro
        rpgsFiltrados.sort((a, b) => b.nota - a.nota);
        break;
      case 'nota-asc': // Menor nota primeiro
        rpgsFiltrados.sort((a, b) => a.nota - b.nota);
        break;
    }
  }
  
  // Verificar se ha resultados apos os filtros
  if (rpgsFiltrados.length === 0) {
    if (grid) grid.style.display = 'none';
    if (mensagemVazia) mensagemVazia.style.display = 'block';
    return;
  }
  
  // Mostrar grid e esconder mensagem de vazio
  if (grid) grid.style.display = 'grid';
  if (mensagemVazia) mensagemVazia.style.display = 'none';
  
  // Gerar HTML dos cards
  grid.innerHTML = rpgsFiltrados.map(rpg => `
    <div class="card" data-id="${rpg.id}">
      <div class="card-header">
        <h3>${rpg.nome}</h3>
        <div class="editora">${rpg.editora}</div>
      </div>
      <div class="card-body">
        <div class="card-info">
          <span class="ano">Ano: ${rpg.ano}</span>
          <span class="genero">Genero: ${getTextoGenero(rpg.genero)}</span>
        </div>
        <div class="status-badge status-${rpg.status}">${getTextoStatus(rpg.status)}</div>
        <div class="nota-estrelas">${renderizarEstrelas(rpg.nota)}</div>
        <div class="comentarios-preview">${rpg.comentarios ? rpg.comentarios.substring(0, 100) + (rpg.comentarios.length > 100 ? '...' : '') : 'Sem comentarios'}</div>
        <div class="card-actions">
          <button class="btn-edit" data-id="${rpg.id}">Editar</button>
          <button class="btn-delete" data-id="${rpg.id}">Excluir</button>
        </div>
      </div>
    </div>
  `).join('');
  
  // Adicionar eventos aos botoes de editar
  document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      abrirModalEditar(parseInt(btn.dataset.id));
    });
  });
  
  // Adicionar eventos aos botoes de excluir
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      abrirModalExcluir(parseInt(btn.dataset.id));
    });
  });
  
  // Adicionar evento de clique no card para ver detalhes (REMOVER SE NAO QUISER)
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (!e.target.classList.contains('btn-edit') && !e.target.classList.contains('btn-delete')) {
        abrirModalDetalhe(parseInt(card.dataset.id));
      }
    });
  });
}

// Atualiza as estatisticas no header (total de sistemas e media de notas)

function atualizarHeaderStats() {
  const total = rpgs.length;
  const rpgsComNota = rpgs.filter(r => r.nota > 0);
  const media = rpgsComNota.length > 0 
    ? (rpgsComNota.reduce((sum, r) => sum + r.nota, 0) / rpgsComNota.length).toFixed(1)
    : 0;
  
  const headerStats = document.getElementById('headerStats');
  if (headerStats) {
    headerStats.innerHTML = `
      <span>${total} ${total === 1 ? 'sistema' : 'sistemas'}</span>
      <span>${media} media</span>
    `;
  }
}

// Modal de formulario (adicionar/editar)

let editandoId = null; // Guarda o ID do RPG que esta sendo editado (null se for novo)

// Abrir modal para ADICIONAR novo RPG
function abrirModalAdicionar() {
  editandoId = null; // Reseta o ID de edicao
  const modalTitle = document.getElementById('modalTitle');
  const form = document.getElementById('rpgForm');
  const rpgId = document.getElementById('rpgId');
  const notaInput = document.getElementById('nota');
  
  if (modalTitle) modalTitle.innerHTML = 'Adicionar Sistema';
  if (form) form.reset(); // Limpa todos os campos do formulario
  if (rpgId) rpgId.value = '';
  if (notaInput) notaInput.value = '0';
  
  resetEstrelas(); // Reseta as estrelas visuais
  const modal = document.getElementById('modelForm');
  if (modal) modal.style.display = 'flex';
}

// Abrir modal para EDITAR um RPG existente
function abrirModalEditar(id) {
  const rpg = rpgs.find(r => r.id === id);
  if (!rpg) return;
  
  editandoId = id;
  const modalTitle = document.getElementById('modalTitle');
  const rpgId = document.getElementById('rpgId');
  const nome = document.getElementById('rpgnome');
  const editora = document.getElementById('rpgeditora');
  const ano = document.getElementById('rpgano');
  const genero = document.getElementById('rpggenero');
  const status = document.getElementById('rpgstatus');
  const comentarios = document.getElementById('rpgcomentarios');
  const notaInput = document.getElementById('nota');
  
  if (modalTitle) modalTitle.innerHTML = 'Editar Sistema';
  if (rpgId) rpgId.value = rpg.id;
  if (nome) nome.value = rpg.nome;
  if (editora) editora.value = rpg.editora;
  if (ano) ano.value = rpg.ano;
  if (genero) genero.value = rpg.genero;
  if (status) status.value = rpg.status;
  if (comentarios) comentarios.value = rpg.comentarios || '';
  if (notaInput) notaInput.value = rpg.nota || 0;
  
  atualizarEstrelas(rpg.nota || 0); // Atualiza as estrelas visuais
  
  const modal = document.getElementById('modelForm');
  if (modal) modal.style.display = 'flex';
}

// Reseta todas as estrelas para o estado vazio (☆)
function resetEstrelas() {
  const estrelas = document.querySelectorAll('.star');
  estrelas.forEach(star => {
    star.classList.remove('active');
    star.innerHTML = '☆';
  });
}

// Atualiza as estrelas baseado na nota (ex: nota 3 mostra 3 estrelas ★ e 2 ☆)
function atualizarEstrelas(nota) {
  resetEstrelas();
  const estrelas = document.querySelectorAll('.star');
  for (let i = 0; i < nota; i++) {
    if (estrelas[i]) {
      estrelas[i].classList.add('active');
      estrelas[i].innerHTML = '★';
    }
  }
}

// Estrelas clicaveis: ao clicar em uma estrela, define a nota e atualiza as estrelas visuais

function initStarRating() {
  const estrelas = document.querySelectorAll('.star');
  estrelas.forEach(star => {
    // Remove eventos antigos para evitar duplicacao
    star.removeEventListener('click', star.clickHandler);
    
    // Cria novo handler de clique
    star.clickHandler = () => {
      const valor = parseInt(star.dataset.valor);
      const notaInput = document.getElementById('nota');
      if (notaInput) notaInput.value = valor;
      atualizarEstrelas(valor);
    };
    
    star.addEventListener('click', star.clickHandler);
  });
}

// Salvar formulario (tanto para adicionar quanto para editar)

const form = document.getElementById('rpgForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Impede o recarregamento da pagina
    
    // Capturar valores dos campos
    const nomeInput = document.getElementById('rpgnome');
    const editoraInput = document.getElementById('rpgeditora');
    const anoInput = document.getElementById('rpgano');
    const generoInput = document.getElementById('rpggenero');
    const statusInput = document.getElementById('rpgstatus');
    const notaInput = document.getElementById('nota');
    const comentariosInput = document.getElementById('rpgcomentarios');
    
    // Validar campos obrigatorios
    if (!nomeInput || !nomeInput.value) {
      alert('Por favor, preencha o nome do sistema');
      return;
    }
    
    // Validar se o ano é válido
    const anoValue = anoInput ? parseInt(anoInput.value) : 2024;
    if (anoValue < 1900 || anoValue > 2026) {
      alert('Por favor, insira um ano válido entre 1900 e 2026');
      return;
    }
    
    // Criar objeto do RPG
    const novoRPG = {
      id: editandoId || Date.now(), // Se for edicao, mantem ID; se for novo, gera novo ID
      nome: nomeInput.value,
      editora: editoraInput ? editoraInput.value : '',
      ano: anoValue,
      genero: generoInput ? generoInput.value : 'fantasia',
      status: statusInput ? statusInput.value : 'quero',
      nota: notaInput ? parseInt(notaInput.value) : 0,
      comentarios: comentariosInput ? comentariosInput.value : ''
    };
    
    // Salvar (adicionar ou atualizar)
    if (editandoId) {
      // EDITAR: encontra o indice e substitui
      const index = rpgs.findIndex(r => r.id === editandoId);
      if (index !== -1) rpgs[index] = novoRPG;
    } else {
      // ADICIONAR: insere no array
      rpgs.push(novoRPG);
    }
    
    // Persistir dados, atualizar interface e fechar modal
    salvarDados();
    renderizarCards();
    atualizarHeaderStats();
    fecharModais();
  });
}

// Modal de exlusão

let excluindoId = null; // Guarda o ID do RPG que sera excluido

function abrirModalExcluir(id) {
  excluindoId = id;
  const rpg = rpgs.find(r => r.id === id);
  const mensagem = document.getElementById('excluirMensagem');
  
  if (mensagem && rpg) {
    mensagem.innerHTML = `Tem certeza que deseja excluir <strong>${rpg.nome}</strong>?`;
  }
  
  const modal = document.getElementById('modalExcluir');
  if (modal) modal.style.display = 'flex';
}

// Botao de confirmar exclusao
const confirmarExcluirBtn = document.getElementById('confirmarExcluirBtn');
if (confirmarExcluirBtn) {
  confirmarExcluirBtn.addEventListener('click', () => {
    if (excluindoId) {
      rpgs = rpgs.filter(r => r.id !== excluindoId);
      salvarDados();
      renderizarCards();
      atualizarHeaderStats();
      fecharModais();
      excluindoId = null;
    }
  });
}

// Botao de cancelar exclusao
const cancelarExcluirBtn = document.getElementById('cancelarExcluirBtn');
if (cancelarExcluirBtn) {
  cancelarExcluirBtn.addEventListener('click', () => {
    fecharModais();
    excluindoId = null;
  });
}

// ==================== MODAL DETALHE (CORRIGIDO - MODAL SEPARADO) ====================

function abrirModalDetalhe(id) {
  const rpg = rpgs.find(r => r.id === id);
  if (!rpg) return;
  
  const detalheContent = document.getElementById('detalheContent');
  if (detalheContent) {
    detalheContent.innerHTML = `
      <div class="detalhe-info">
        <p><strong>Nome:</strong> ${rpg.nome}</p>
        <p><strong>Editora:</strong> ${rpg.editora}</p>
        <p><strong>Ano:</strong> ${rpg.ano}</p>
        <p><strong>Genero:</strong> ${getTextoGenero(rpg.genero)}</p>
        <p><strong>Status:</strong> <span class="status-badge status-${rpg.status}">${getTextoStatus(rpg.status)}</span></p>
        <p><strong>Avaliacao:</strong> ${renderizarEstrelas(rpg.nota)}</p>
        ${rpg.comentarios ? `<div class="detalhe-comentarios"><strong>Comentarios:</strong><br>${rpg.comentarios}</div>` : '<p><em>Sem comentarios</em></p>'}
      </div>
    `;
  }
  
  const modal = document.getElementById('modalDetalhe');
  if (modal) {
    const modalHeader = modal.querySelector('.modalHeader h2');
    if (modalHeader) modalHeader.innerHTML = `${rpg.nome}`;
    modal.style.display = 'flex';
  }
}

// Função para fechar dos modais (formulario, exclusao e detalhe)

function fecharModais() {
  const modais = document.querySelectorAll('.modal');
  modais.forEach(modal => {
    modal.style.display = 'none';
  });
}

// Inicializar eventos de fechar modal (botoes X e clique fora)
function initFecharModais() {
  // Botoes com classe .close (X)
  const botoesFechar = document.querySelectorAll('.close');
  botoesFechar.forEach(btn => {
    btn.addEventListener('click', fecharModais);
  });
  
  // Botao Cancelar do formulario
  const btnCancelar = document.getElementById('btnCancelar');
  if (btnCancelar) {
    btnCancelar.addEventListener('click', fecharModais);
  }
  
  // Clicar fora do modal (no fundo escuro)
  window.addEventListener('click', (e) => {
    if (e.target.classList && e.target.classList.contains('modal')) {
      fecharModais();
    }
  });
}

// Filtros e ordenação

function initFiltros() {
  const filtroGenero = document.getElementById('filtroGenero');
  const filtroStatus = document.getElementById('filtroStatus');
  const ordenacao = document.getElementById('ordenacao');
  
  if (filtroGenero) filtroGenero.addEventListener('change', () => renderizarCards());
  if (filtroStatus) filtroStatus.addEventListener('change', () => renderizarCards());
  if (ordenacao) ordenacao.addEventListener('change', () => renderizarCards());
}

// botão de adicionar novo RPG

function initBotoes() {
  const btnAdicionar = document.getElementById('btnAdicionar');
  if (btnAdicionar) {
    btnAdicionar.addEventListener('click', abrirModalAdicionar);
  }
}

// Inicialização: carregar dados, configurar eventos e renderizar interface

function init() {
  carregarDados();      // Carrega dados do localStorage
  initStarRating();     // Inicia sistema de estrelas clicaveis
  initFecharModais();   // Configura botoes de fechar modais
  initFiltros();        // Configura os filtros e ordenacao
  initBotoes();         // Configura o botao de adicionar
}

// Iniciar tudo quando a pagina terminar de carregar
document.addEventListener('DOMContentLoaded', init);
