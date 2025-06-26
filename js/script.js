// Estado principal da aplicação: armazena os números do tabuleiro,
// o jogo atual e os jogos salvos no localStorage.
var state = {
  board: [],        // Números de 1 a 60
  currentGame: [],  // Números escolhidos no jogo atual
  savedGames: []    // Lista de jogos salvos
};

// Função inicial: carrega os jogos do localStorage, cria o tabuleiro e inicia um novo jogo
function start() {
  readLocalStorage(); // Lê jogos anteriores
  createBoard();      // Cria os números de 1 a 60
  newGame();          // Reseta e renderiza a interface
}

// Lê os jogos salvos do localStorage, se existirem
function readLocalStorage() {
  if (!window.localStorage) return;

  var savedGamesFromLocalStorage = window.localStorage.getItem('saved-games');

  if (savedGamesFromLocalStorage) {
    state.savedGames = JSON.parse(savedGamesFromLocalStorage);
  }
}

// Salva os jogos no localStorage
function writeToLocalStorage() {
  window.localStorage.setItem('saved-games', JSON.stringify(state.savedGames));
}

// Cria os números de 1 a 60 para o tabuleiro
function createBoard() {
  state.board = [];
  for (var i = 1; i <= 60; i++) {
    state.board.push(i);
  }
}

// Inicia um novo jogo: reseta e renderiza a interface
function newGame() {
  resetGame();
  render();
}

// Atualiza toda a interface: tabuleiro, botões e jogos salvos
function render() {
  renderBoard();
  renderButtons();
  renderSavedGames();
}

// Cria e exibe os números do tabuleiro na tela
function renderBoard() {
  var divBoard = document.querySelector('#megasena-board');
  divBoard.innerHTML = '';

  var ulNumbers = document.createElement('ul');
  ulNumbers.classList.add('numbers');

  // Para cada número do tabuleiro, cria um item na interface
  for (var i = 0; i < state.board.length; i++) {
    var currentNumber = state.board[i];

    var liNumber = document.createElement('li');
    liNumber.textContent = currentNumber;
    liNumber.classList.add('number');

    // Clique em um número adiciona ou remove do jogo
    liNumber.addEventListener('click', handleNumberClick);

    // Marca o número se ele já foi selecionado
    if (isNumberInGame(currentNumber)) {
      liNumber.classList.add('selected-number');
    }

    ulNumbers.appendChild(liNumber);
  }

  divBoard.appendChild(ulNumbers);
}

// Manipula o clique no número: adiciona ou remove do jogo
function handleNumberClick(event) {
  var value = Number(event.currentTarget.textContent);

  if (isNumberInGame(value)) {
    removeNumberFromGame(value);
  } else {
    addNumberToGame(value);
  }

  render(); // Atualiza a interface
}

// Cria e exibe os botões: novo jogo, jogo aleatório, salvar, limpar
function renderButtons() {
  var divButtons = document.querySelector('#megasena-buttons');
  divButtons.innerHTML = '';

  divButtons.appendChild(createNewGameButton());
  divButtons.appendChild(createRandomGameButton());
  divButtons.appendChild(createSaveGameButton());
  divButtons.appendChild(createClearSavedGamesButton());
}

// Botão "Novo jogo"
function createNewGameButton() {
  var button = document.createElement('button');
  button.textContent = 'Novo jogo';
  button.addEventListener('click', newGame);
  styleButton(button);
  return button;
}

// Botão "Jogo aleatório"
function createRandomGameButton() {
  var button = document.createElement('button');
  button.textContent = 'Jogo aleatório';
  button.addEventListener('click', randomGame);
  styleButton(button);
  return button;
}

// Botão "Salvar jogo"
function createSaveGameButton() {
  var button = document.createElement('button');
  button.textContent = 'Salvar jogo';
  button.disabled = !isGameComplete(); // Só habilita se o jogo tiver 6 números
  button.addEventListener('click', saveGame);
  styleButton(button);
  return button;
}

// Botão "Limpar jogos salvos"
function createClearSavedGamesButton() {
  var button = document.createElement('button');
  button.textContent = 'Limpar jogos salvos';

  button.addEventListener('click', function () {
    if (confirm('Tem certeza que deseja apagar todos os jogos salvos?')) {
      state.savedGames = [];
      writeToLocalStorage();
      render();
    }
  });

  styleButton(button, 'red');
  return button;
}

// Aplica estilo comum aos botões
function styleButton(button, color = 'blue') {
  button.style.backgroundColor = color;
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.borderRadius = '5px';
  button.style.padding = '10px 20px';
  button.style.marginRight = '10px';
}

// Mostra na tela os jogos salvos
function renderSavedGames() {
  var divSavedGames = document.querySelector('#megasena-saved-games');
  divSavedGames.innerHTML = '';

  if (state.savedGames.length === 0) {
    divSavedGames.innerHTML = '<p>Nenhum jogo salvo</p>';
    return;
  }

  var ulSavedGames = document.createElement('ul');

  for (var i = 0; i < state.savedGames.length; i++) {
    var currentGame = state.savedGames[i];

    var liGame = document.createElement('li');
    liGame.textContent = currentGame.join(', '); // Exibe os números

    ulSavedGames.appendChild(liGame);
  }

  divSavedGames.appendChild(ulSavedGames);
}

// Adiciona um número ao jogo atual (se permitido)
function addNumberToGame(numberToAdd) {
  if (numberToAdd < 1 || numberToAdd > 60 || isNumberInGame(numberToAdd)) return;
  if (state.currentGame.length >= 6) return;

  state.currentGame.push(numberToAdd);
}

// Remove um número do jogo atual
function removeNumberFromGame(numberToRemove) {
  if (numberToRemove < 1 || numberToRemove > 60) return;

  state.currentGame = state.currentGame.filter(n => n !== numberToRemove);
}

// Verifica se o número já foi selecionado no jogo atual
function isNumberInGame(numberToCheck) {
  return state.currentGame.includes(numberToCheck);
}

// Salva o jogo atual (ordenado) e impede duplicatas
function saveGame() {
  if (!isGameComplete()) {
    console.error('O jogo não está completo!');
    return;
  }

  const sortedGame = [...state.currentGame].sort((a, b) => a - b);

  // Verifica se esse jogo já foi salvo
  const gameExists = state.savedGames.some(game =>
    JSON.stringify(game) === JSON.stringify(sortedGame)
  );

  if (gameExists) {
    alert('Este jogo já foi salvo!');
    return;
  }

  state.savedGames.push(sortedGame);
  writeToLocalStorage();
  newGame();
}

// Verifica se o jogo atual tem 6 números
function isGameComplete() {
  return state.currentGame.length === 6;
}

// Reseta o jogo atual (zera os números)
function resetGame() {
  state.currentGame = [];
}

// Gera um jogo aleatório com 6 números únicos
function randomGame() {
  resetGame();

  while (!isGameComplete()) {
    var randomNumber = Math.ceil(Math.random() * 60);
    addNumberToGame(randomNumber);
  }

  render();
}

// Inicia o app quando a página carrega
start();
