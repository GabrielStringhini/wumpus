$(document).ready(() => {
  // montaTabuleiro(4);
  // preencheTabuleiro({
  //   cheiro: [{x: 1, y: 3}, {x: 3, y: 3}],
  //   cacador: [{x: 3, y: 0}],
  //   wumpus: [{x: 2, y: 3}],
  //   brisa: [{x: 0, y: 1}, {x: 2, y: 1}],
  //   caverna: [{x: 1, y: 1}, {x: 1, y: 2}],
  //   ouro: [{x: 0, y: 2}]
  // });
  // preencheTabuleiro({
  //   cheiro: [{ x: 1, y: 3 }, { x: 3, y: 3 }],
  //   ouro: [{ x: 1, y: 3 }],
  //   caverna: [{ x: 2, y: 2 }, { x: 1, y: 3 }],
  //   cacador: [{x: 2, y: 2}],
  // });
  // moveCacador(0, 2)

  // seguirCaminho([
  //   {x: 2, y: 0},
  //   {x: 1, y: 0},
  //   {x: 0, y: 0},
  //   {x: 0, y: 1},
  //   {x: 0, y: 2},
  // ]);
  // teste();
});

const posicaoCacador = { x: 0, y: 0 };
const posicaoOuro = { x: 0, y: 0 };
const tamanho = 0;
let classeCacador = 'cacador';
let possuiFlecha = true;

function montaTabuleiro(casas) {
  classeCacador = 'cacador';
  possuiFlecha = true;
  const tabuleiro = $('#tabuleiro');
  for (let x = 0; x < casas; x++) {
    const linha = $('<tr/>').appendTo(tabuleiro);
    for (let y = 0; y < casas; y++) {
      const casa = $('<td/>').addClass([`casa-${x}-${y} casa`]);
      casa.appendTo(linha);
    }
  }
}

// Coloca o personagem em uma nova casa.
function colocaPersonagem(classe, x, y) {
  const personagensMesmaCasa = $(`#tabuleiro .casa-${x}-${y} div`);
  const personagem = $(`<div class='personagem ${classe}'></div>`);
  $(`#tabuleiro .casa-${x}-${y}`).append(personagem);
  $(`#tabuleiro .casa-${x}-${y}`)
    .children()
    .css('height', `${100 / (personagensMesmaCasa.length + 1)}%`)
    .css('width', `${100 / (personagensMesmaCasa.length + 1)}%`)
}

// Remove personagem da posição onde ele está.
function removePersonagem(classe, x, y) {
  $(`#tabuleiro .casa-${x}-${y} .personagem.${classe}`).remove();
  const personagensMesmaCasa = $(`#tabuleiro .casa-${x}-${y} div`);
  $(`#tabuleiro .casa-${x}-${y}`)
    .children()
    .css('height', `${100 / (personagensMesmaCasa.length)}%`)
    .css('width', `${100 / (personagensMesmaCasa.length)}%`)
}

function preencheTabuleiro(personagens) {
  Object.entries(personagens).map(([classe, propriedades]) => {
    propriedades.map(({ x, y }) => {
      colocaPersonagem(classe, x, y);
    });
  });
}

function preencheTabuleiroArray(arrayPersonagens) {
  arrayPersonagens.map((linha, x) => {
    linha.map((personagem, y) => {
      // console.log(`(${x}, ${y}): ${personagem}`);
      for (let i = 0; i < personagem.length; i++) {
        switch (true) {
          case personagem[i].includes('w'): colocaPersonagem('wumpus', x, y);
            break;
          case personagem[i].includes('g'): colocaPersonagem('ouro', x, y);
            posicaoOuro.x = x;
            posicaoOuro.y = y;
            break;
          case personagem[i].includes('c'): colocaPersonagem(classeCacador, x, y);
            break;
          case personagem[i].includes('v'): colocaPersonagem('caverna', x, y);
            break;
          case personagem[i].includes('b'): colocaPersonagem('brisa', x, y);
            break;
          case personagem[i].includes('f'): colocaPersonagem('cheiro', x, y);
            break;
        }
      }
    });
  })
}

function limpaTabuleiro(tamanho) {
  $(`#tabuleiro`).empty();
}

function moveCacador(x, y) {
  removePersonagem(classeCacador, posicaoCacador.x, posicaoCacador.y);
  colocaPersonagem(classeCacador, x, y);
  if (x == posicaoOuro.x && y == posicaoOuro.y) {
    removePersonagem('ouro', posicaoOuro.x, posicaoOuro.y);
    removePersonagem(classeCacador, x, y);
    if (possuiFlecha)
      classeCacador = 'cacador-com-ouro';
    else 
      classeCacador = 'cacador-com-ouro-sem-flecha';
    colocaPersonagem(classeCacador, x, y);
  }
  const casaComWumpus = personagemNaCasa('wumpus', x, y);
  if (casaComWumpus) {
    // Se está em uma casa que tem wumpus, mas o caçador ainda tem uma flecha, ele pode matar o wumpus;
    if (possuiFlecha) {
      removePersonagem('wumpus', x, y);
      removePersonagem(classeCacador, x, y);
      possuiFlecha = false;
      classeCacador = 'cacador-sem-flecha';
      colocaPersonagem(classeCacador, x, y);
      // Requisita para o backend indicando que o matou um wumpus.
      $.ajax({
        url: `http://localhost:5000/matar-wumpus?x=${x}&y=${y}`,
        async: false,
        success: () => {
          console.log('matou wumpus');
        }
      });
    }
  }
  posicaoCacador.x = x;
  posicaoCacador.y = y;
}

function personagemNaCasa(personagem, x, y) {
  return $(`#tabuleiro .casa-${x}-${y} > .${personagem}`).length > 0;
}

function encontraPosicoesCaminho(caminho, tamanho) {
  const posicoes = [];
  caminho.map(valor => {
    valor = parseInt(valor);
    let x;
    let y;

    // Encontra linha onde o vertice esta no tabuleiro.
    for (let i = 1; i <= tamanho; i++) {
      if (valor < tamanho * i) {
          x = i - 1;
          break;
      }
    }

    // Encontra coluna onde o vertice esta no tabuleiro.
    for (let j = tamanho * x; j <= (tamanho * x) + tamanho; j++) {
      if (valor == j) {
          y = (j - (tamanho * x));
          break;
      }
    }
    posicoes.push({ x: x, y: y });
  });
  return posicoes;
}

function seguirCaminho(caminho) {
  caminho.map(({ x, y }, i) => {
    setTimeout(() => {
      moveCacador(x, y);
    }, i * 300);
  });
}
