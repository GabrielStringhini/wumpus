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

    function moveCacador(x, y) {
      const cacador = $('#tabuleiro .personagem.cacador');
      let posicao = cacador.attr('class').split(' ')[0].split('-');
      posicao.shift();
      posicao = {
        x: parseInt(posicao[0]),
        y: parseInt(posicao[1])
      };
      console.log('classes antes', cacador.attr('class'));
      cacador.removeClass('personagem');
      cacador.removeClass('cacador');
      console.log('classes depois', cacador.attr('class'));
      console.log(posicao);
      // console.log(cacador);
    }

    montaTabuleiro(10);
    preencheTabuleiro({
      cheiro: [{x: 2, y: 2}],
      cacador: [{x: 1, y: 2}, {x: 2, y: 2}],
    });
    // moveCacador(4, 4);
});
