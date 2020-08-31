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
const tamanho = 0;

function montaTabuleiro(casas) {
  const tabuleiro = $('#tabuleiro');
  for (let x = 0; x < casas; x++) {
    const linha = $('<tr/>').appendTo(tabuleiro);
    for (let y = 0; y < casas; y++) {
      const casa = $('<td/>').addClass([`casa-${x}-${y} casa`]);
      casa.appendTo(linha);
    }
  }
}

function colocaPersonagem(classe, x, y) {
  const personagensMesmaCasa = $(`#tabuleiro .casa-${x}-${y} div`);
  const personagem = $(`<div class='personagem ${classe}'></div>`);
  $(`#tabuleiro .casa-${x}-${y}`).append(personagem);
  $(`#tabuleiro .casa-${x}-${y}`)
    .children()
    .css('height', `${100 / (personagensMesmaCasa.length + 1)}%`)
    .css('width', `${100 / (personagensMesmaCasa.length + 1)}%`)
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
            break;
          case personagem[i].includes('c'): colocaPersonagem('cacador', x, y);
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
  $('.personagem.cacador').remove();
  $(`#tabuleiro .casa-${x}-${y}`).append(`<div class='personagem cacador' height='100%' width='100%'></div>`);
  posicaoCacador.x = x;
  posicaoCacador.y = y;
}

function encontraPosicoesCaminho(caminho, tamanho) {
  const posicoes = [];
  caminho.map(valor => {
    valor = parseInt(valor);
    let x;
    let y;

    for (let i = 1; i <= tamanho; i++) {
      if (valor <= tamanho * i) {
          x = i - 1;
          break;
      }
    }

    for (let j = tamanho * x; (tamanho * x) + tamanho; j++) {
      if (valor == j) {
          y = j;
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
    }, i * 1000);
  });
}
