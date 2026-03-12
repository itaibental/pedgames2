const gameGrid = document.getElementById('game-grid');

const games = [
  { name: 'גלגל המזל', url: 'wheel.html' },
  { name: 'Game 2', url: '#' },
  { name: 'Game 3', url: '#' },
  { name: 'Game 4', url: '#' },
];

games.forEach(game => {
  const tile = document.createElement('a');
  tile.href = game.url;
  tile.classList.add('game-tile');
  tile.textContent = game.name;
  gameGrid.appendChild(tile);
});