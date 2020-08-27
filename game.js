$(document).ready(() => {
    function montaTabuleiro(casas) {
      console.log('OK')
      const tabuleiro = $('#tabuleiro');
      for (let x = 0; x < casas; x++) {
        const linha = $('<tr/>').appendTo(tabuleiro);
        for (let y = 0; y < casas; y++) {
          const casa = $('<td/>').addClass([`casa-${x}-${y} casa`]);
          const conteudo = $('<div/>').addClass('conteudo').appendTo(casa);
          casa.appendTo(linha);
          // if (x == y) conteudo.addClass(['personagem cacador']);
        }
      }
    }

    function preencheTabuleiro(personagens) {
        Object.entries(personagens).map(([ personagem, propriedades ]) => {
          propriedades.map(({ x, y }) => {
            $(`#tabuleiro .casa-${x}-${y}`).addClass([`personagem ${personagem}`]);
          });
        });
    }

    montaTabuleiro(10);
    preencheTabuleiro({
      cheiro: [{x: 2, y: 2}],
      cacador: [{x: 1, y: 2}, {x: 2, y: 2}],
    })
});
