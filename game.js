$(document).ready(() => {
  console.log('game.js')
    let posicaoCacador = { x: 0, y: 0};

    function montaTabuleiro(casas) {
      console.log('OK')
      const tabuleiro = $('#tabuleiro');
      for (let x = 0; x < casas; x++) {
        const linha = $('<tr/>').appendTo(tabuleiro);
        for (let y = 0; y < casas; y++) {
          const casa = $('<td/>').addClass([`casa-${x}-${y} casa`]);
          casa.appendTo(linha);
        }
      }
    }

    function preencheTabuleiro(personagens) {
        Object.entries(personagens).map(([ personagem, propriedades ]) => {
          propriedades.map(({ x, y }) => {
            if (personagem == 'cacador') {
              const cacador = $(`
                <div class='personagem cacador' height='100%' width='100%'></div>
              `);
              $(`#tabuleiro .casa-${x}-${y}`).append(cacador);
              posicaoCacador.x = x;
              posicaoCacador.y = y;
            }
            else $(`#tabuleiro .casa-${x}-${y}`).addClass([`personagem ${personagem}`]);
          });
        });
    }

    function moveCacador(x, y) {
      $('.personagem.cacador').remove();
      $(`#tabuleiro .casa-${x}-${y}`).append(`<div class='personagem cacador' height='100%' width='100%'></div>`);
      posicaoCacador.x = x;
      posicaoCacador.y = y;
    }

    function seguirCaminho(caminho) {
      caminho.map(({ x, y }, i) => {
        setTimeout(() => {
          moveCacador(x, y);
        }, i * 1000);
      });
    }

    montaTabuleiro(4);
    preencheTabuleiro({
      cheiro: [{x: 1, y: 3}, {x: 3, y: 3}],
      cacador: [{x: 3, y: 0}],
      wumpus: [{x: 2, y: 3}],
      brisa: [{x: 0, y: 1}, {x: 2, y: 1}],
      caverna: [{x: 1, y: 1}, {x: 1, y: 2}],
      ouro: [{x: 0, y: 2}]
    });
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
