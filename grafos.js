const cor = '#000000';
const corAtivo = '#FF0000';
const raio = 20;
const tamanhoFlecha = 15;

class Grafo {
    constructor(canvasVertices, canvasArestas) {
        this._canvasVertices = $(`#${canvasVertices}`).get(0);
        this._canvasArestas = $(`#${canvasArestas}`).get(0);
        this._ctxVertices = this._canvasVertices.getContext("2d");
        this._ctxArestas = this._canvasArestas.getContext("2d");
        this._arrastando = null;
        this._quantidadeArestas = 0
        this._vertices = {};
        this._grafo = {};

        $(this._canvasVertices)
            .prop("width", 600)
            .prop("height", 600);

        $(this._canvasArestas)
            .prop("width", 600)
            .prop("height", 600);

        this._canvasVertices.onmousedown = (e) => {
            const { top, left } = $(this._canvasArestas).offset();
            Object.entries(this._vertices).map(([id, vertice]) => {
                const distancia = Math.sqrt((vertice.x - (e.pageX - left)) ** 2 + (vertice.y - (e.pageY - top)) ** 2);
                if (distancia <= (vertice.raio ?? raio)) {
                    this._arrastando = { id, vertice };
                    return;
                }
            });
        }

        this._canvasVertices.onmousemove = (e) => {
            if (this._arrastando) {
                const { top, left } = $(this._canvasArestas).offset();
                this.vertice(this._arrastando.id, 'x', (e.pageX - left));
                this.vertice(this._arrastando.id, 'y', (e.pageY - top));
            }
        }

        this._canvasVertices.onmouseup = (e) => {
            this._arrastando = null;
        }
    }

    static criaGrafoMatriz(camada, vertices, tamanho) {
        //   const altura = parseInt($(`#${camada}`).prop('height'));
        //   const largura = parseInt($(`#${camada}`).prop('width'));
        const altura = 600;
        const largura = 600;
        // Calcula de quanto será o espeçamento entre os vértices e suas margens com as bordas.
        const espacamentoX = (largura - (tamanho * raio)) / (tamanho + 2);
        const espacamentoY = (altura - (tamanho * raio)) / (tamanho + 2);
        const grafo = new Grafo('camada1', 'camada2');
        for (let l = 0; l < tamanho; l++) {
            let parteVertices = vertices.slice((l * tamanho), (l * tamanho + tamanho));
            for (let c = 0; c < tamanho; c++) {
                let v = { nome: parteVertices[c], x: (espacamentoX * (c + 1)) + (raio * c), y: (espacamentoY * (l + 1)) + (raio * l) };
                grafo.adicionarVertice(v);
            }
        }
        return grafo;
    }

    arestasEntre(origem, destino) {
        let quantidade = 0;
        let desenhadas = 0;
        if (this._grafo?.[origem]?.[destino]) {
            this._grafo[origem][destino].map(aresta => {
                quantidade++;
                if (aresta.desenhada) desenhadas++;
            });
        }
        if (this._grafo?.[destino]?.[origem]) {
            this._grafo[destino][origem].map(aresta => {
                quantidade++;
                if (aresta.desenhada) desenhadas++;
            });
        }
        return { quantidade, desenhadas };
    }

    adicionarVertice(vertice) {
        this._vertices[vertice.nome] = { ...vertice, ativo: false };
        this._grafo[vertice.nome] = {};
    }

    adicionarAresta(origem, destino, custo, direcionada, ativa) {
        if (!this._grafo[origem][destino]) this._grafo[origem][destino] = [];
        this._quantidadeArestas++;
        this._grafo[origem][destino].push({ id: this._quantidadeArestas, custo: custo, direcionada: direcionada, desenhada: false, ativa: ativa ?? false });
    }

    vertice(id, atributo, valor) {
        if (valor) {
            this._vertices[id][atributo] = valor;
            this.limparVertices();
            this.renderVertices();
            this.limparArestas();
            this.renderArestas();
            return;
        }
        return this._vertices[id][atributo];
    }

    aresta(origem, destino, atributo, valor) {
        if (valor) {
            this._grafo[origem][destino][atributo] = valor;
            return;
        }
        return this._grafo[origem][destino][atributo];
    }

    calculaAngulos(angulo, quantidade) {
        const angulos = [];
        if (quantidade % 2 == 1) {
            angulos.push(angulo);
            quantidade--;
        }
        for (let i = 1; i <= (parseInt(quantidade / 2)); i++) {
            angulos.push(angulo + 0.5 * i);
            angulos.push(angulo - 0.5 * i);
        }
        return angulos;
    }

    renderVertices() {
        Object.entries(this._vertices).map(([id, vertice]) => {
            this.renderVertice(vertice);
        });
    }

    ativarVertice(vertice) {
        this._vertices[vertice].ativo = true;
    }

    ativarVertices(vertices) {
        this.limparVertices()
        vertices.map(vertice => {
            this.ativarVertice(vertice);
        });
        this.renderVertices();
    }

    ativarCaminho(caminho) {
        this.limparVertices();
        this.limparArestas();
        caminho.map((vertice, i) => {
            this.ativarVertice(vertice);
            if (i < caminho.length - 1) {
                const proximo = caminho[i+1];
                for (let i = 0; i < this._grafo[vertice][proximo].length; i++) {
                    this._grafo[vertice][proximo][i].ativa = true;
                }
            }
        });
        this.renderVertices();
        this.renderArestas();
    }

    renderArestas() {
        Object.keys(this._vertices).map(nomeOrigem => {
            const origem = this._grafo[nomeOrigem];
            Object.keys(origem).map(nomeDestino => {
                this._grafo[nomeOrigem][nomeDestino].map(aresta => {
                    const a = {
                        id: aresta.id,
                        custo: aresta.custo,
                        ativa: aresta.ativa,
                        desenhada: aresta.desenhada,
                        direcionada: true,
                        origem: this._vertices[nomeOrigem],
                        destino: this._vertices[nomeDestino]
                    };
                    this.renderAresta(a);
                });
            });
        });
    }

    renderVertice(vertice) {
        this._ctxVertices.beginPath();
        this._ctxVertices.save();
        this._ctxVertices.lineWidth = 2;
        this._ctxVertices.strokeStyle = vertice.ativo ? corAtivo : cor;
        this._ctxVertices.font = `${vertice.raio ? vertice.raio - 10 : raio - 10}px Arial`;
        this._ctxVertices.fillStyle = vertice.ativo ? corAtivo : cor;
        this._ctxVertices.arc(vertice.x, vertice.y, vertice.raio ?? raio, 0, Math.PI * 2, false);
        this._ctxVertices.stroke();
        this._ctxVertices.fillText(vertice.nome, vertice.x - 10, vertice.y + 10);
        this._ctxVertices.restore();
        this._ctxVertices.closePath();
    }

    renderAresta(aresta) {
        this._ctxArestas.beginPath();
        this._ctxArestas.save();
        this._ctxArestas.strokeStyle = aresta.ativa ? corAtivo : cor;
        // Quantidade de arestas entre os dois vertices;
        const { quantidade, desenhadas } = this.arestasEntre(aresta.origem.nome, aresta.destino.nome);

        const diferencaX = Math.abs(aresta.destino.x - aresta.origem.x);
        const diferencaY = Math.abs(aresta.destino.y - aresta.origem.y);
        const anguloOrigemOriginal = Math.atan(diferencaY / diferencaX);
        const anguloDestinoOriginal = Math.atan(diferencaX / diferencaY);

        const angulosOrigem = this.calculaAngulos(anguloOrigemOriginal, quantidade);
        const angulosDestino = this.calculaAngulos(anguloDestinoOriginal, quantidade);

        const anguloOrigem = angulosOrigem[desenhadas];
        const anguloDestino = angulosDestino[desenhadas];

        let xFlecha = 0;
        let yFlecha = 0;
        let anguloFlecha = 0;

        // Se diferencaX for negativa signica que o destino está à esquerda do origem.
        // Se diferencaY for negativa significa que o destino está acima do origem.

        const origem = {
            x: Math.cos(anguloOrigem) * (aresta.origem.raio ?? raio),
            y: Math.sin(anguloOrigem) * (aresta.origem.raio ?? raio)
        };

        const destino = {
            x: Math.sin(anguloDestino) * (aresta.destino.raio ?? raio),
            y: Math.cos(anguloDestino) * (aresta.destino.raio ?? raio)
        };

        /**
         * (saidaX, saidaY): ponto onde a aresta sai do vertice de origem.
         * (chegadaX, chegadaY): ponto onde a aresta sai do vertice de chegada. 
         */
        if (aresta.origem.x > aresta.destino.x) {
            if (aresta.origem.y > aresta.destino.y) {
                const saidaX = aresta.origem.x - origem.x;
                const saidaY = aresta.origem.y - origem.y;
                const chegadaX = aresta.destino.x + destino.x;
                const chegadaY = aresta.destino.y + destino.y;
                const hipotenusa = Math.sqrt(Math.abs(chegadaY - saidaY) ** 2 + Math.abs(chegadaX - saidaX) ** 2);
                const angulo = Math.atan((chegadaY - saidaY) / (chegadaX - saidaX));
                xFlecha = saidaX - (Math.cos(angulo) * (hipotenusa / 2));
                yFlecha = saidaY - (Math.sin(angulo) * (hipotenusa / 2));
                this._ctxArestas.moveTo(saidaX, saidaY);
                this._ctxArestas.lineTo(chegadaX, chegadaY);
                anguloFlecha = -90 * Math.PI / 180 + anguloOrigemOriginal;
            } else {
                const saidaX = aresta.origem.x - origem.x;
                const saidaY = aresta.origem.y + origem.y;
                const chegadaX = aresta.destino.x + destino.x;
                const chegadaY = aresta.destino.y - destino.y;
                const hipotenusa = Math.sqrt(Math.abs(chegadaY - saidaY) ** 2 + Math.abs(chegadaX - saidaX) ** 2);
                const angulo = Math.atan((chegadaY - saidaY) / (chegadaX - saidaX));
                xFlecha = saidaX - (Math.cos(angulo) * (hipotenusa / 2));
                yFlecha = saidaY - (Math.sin(angulo) * (hipotenusa / 2));
                anguloFlecha = -90 * Math.PI / 180 - anguloOrigemOriginal;
                this._ctxArestas.moveTo(saidaX, saidaY);
                this._ctxArestas.lineTo(chegadaX, chegadaY);
            }
        } else {
            if (aresta.origem.y > aresta.destino.y) {
                const saidaX = aresta.origem.x + origem.x;
                const saidaY = aresta.origem.y - origem.y;
                const chegadaX = aresta.destino.x - destino.x;
                const chegadaY = aresta.destino.y + destino.y;
                const hipotenusa = Math.sqrt(Math.abs(chegadaY - saidaY) ** 2 + Math.abs(chegadaX - saidaX) ** 2);
                const angulo = Math.atan((chegadaY - saidaY) / (chegadaX - saidaX));
                xFlecha = saidaX + (Math.cos(angulo) * (hipotenusa / 2));
                yFlecha = saidaY + (Math.sin(angulo) * (hipotenusa / 2));
                this._ctxArestas.moveTo(saidaX, saidaY);
                this._ctxArestas.lineTo(chegadaX, chegadaY);
                anguloFlecha = 90 * Math.PI / 180 - anguloOrigemOriginal;
            } else {
                const saidaX = aresta.origem.x + origem.x;
                const saidaY = aresta.origem.y + origem.y;
                const chegadaX = aresta.destino.x - destino.x;
                const chegadaY = aresta.destino.y - destino.y;
                const hipotenusa = Math.sqrt(Math.abs(chegadaY - saidaY) ** 2 + Math.abs(chegadaX - saidaX) ** 2);
                const angulo = Math.atan((chegadaY - saidaY) / (chegadaX - saidaX));
                xFlecha = saidaX + (Math.cos(angulo) * (hipotenusa / 2));
                yFlecha = saidaY + (Math.sin(angulo) * (hipotenusa / 2));
                this._ctxArestas.moveTo(saidaX, saidaY);
                this._ctxArestas.lineTo(chegadaX, chegadaY);
                anguloFlecha = 90 * Math.PI / 180 + anguloOrigemOriginal;
            }
        }

        this._ctxArestas.stroke();
        this._ctxArestas.restore();
        this._ctxArestas.closePath();

        if (aresta.direcionada) {
            const flecha = { x: xFlecha, y: yFlecha, lado: 15, angulo: anguloFlecha, ativa: aresta.ativa };
            this.desenhaFlecha(flecha);
        }

        // Marca que a aresta já foi desenhada.
        this._grafo[aresta.origem.nome][aresta.destino.nome].map((a, i) => {
            if (a.id == aresta.id) this._grafo[aresta.origem.nome][aresta.destino.nome][i].desenhada = true;
        });
    }

    desenhaFlecha(flecha) {
        const altura = flecha.lado * Math.sqrt(3) / 2;
        this._ctxArestas.beginPath();
        this._ctxArestas.save();
        this._ctxArestas.fillStyle = flecha.ativa ? corAtivo : cor;
        this._ctxArestas.translate(flecha.x, flecha.y);
        this._ctxArestas.rotate(flecha.angulo);
        this._ctxArestas.translate(-flecha.x, -flecha.y);
        this._ctxArestas.moveTo(flecha.x, flecha.y);
        this._ctxArestas.lineTo(flecha.x + flecha.lado / 2, flecha.y + altura / 2);
        this._ctxArestas.lineTo(flecha.x, flecha.y - altura / 2);
        this._ctxArestas.lineTo(flecha.x - flecha.lado / 2, flecha.y + altura / 2);
        this._ctxArestas.fill();
        this._ctxArestas.closePath();
        this._ctxArestas.setTransform(1, 0, 0, 1, 0, 0);
        this._ctxArestas.restore();
        this._ctxArestas.closePath();
    }

    limparVertices() {
        this._ctxVertices.clearRect(0, 0, this._canvasVertices.width, this._canvasVertices.height);
    }

    limparArestas() {
        this._ctxArestas.clearRect(0, 0, this._canvasArestas.width, this._canvasArestas.height);
        Object.keys(this._vertices).map(nomeOrigem => {
            const origem = this._grafo[nomeOrigem];
            Object.keys(origem).map(nomeDestino => {
                this._grafo[nomeOrigem][nomeDestino].map(aresta => {
                    aresta.desenhada = false;
                });
            });
        });
    }
}

// const grafo = new Grafo('camada1', 'camada2');
// grafo.adicionarVertice({ nome: 'A', x: 150, y: 150 });
// grafo.adicionarVertice({ nome: 'B', x: 300, y: 80 });
// grafo.adicionarVertice({ nome: 'C', x: 150, y: 150 });
// grafo.adicionarVertice({ nome: 'D', x: 110, y: 300 });
//
// grafo.renderVertices();
// grafo.adicionarAresta('A', 'B', 100, true, true);
// grafo.adicionarAresta('B', 'A', 20, true);
// grafo.adicionarAresta('A', 'B', 10, true);
// grafo.adicionarAresta('B', 'C', 10, true);
// grafo.adicionarAresta('A', 'C', 30, true);
// grafo.adicionarAresta('B', 'D', 30, true, true);
// grafo.adicionarAresta('A', 'D', 30, true, true);

// grafo.renderArestas();
// grafo.ativarVertices(['A', 'B']);
// console.log('grafo', grafo);

// const g = Grafo.criaGrafoMatriz('camada1', ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P"], 4);
// g.renderVertices();
// g.adicionarAresta('A', 'B', 1);
// g.adicionarAresta('B', 'A', 2);
// g.adicionarAresta('A', 'E', 1);
// g.adicionarAresta('E', 'A', 2);
// g.adicionarAresta('B', 'C', 3);
// g.adicionarAresta('C', 'B', 4);
// g.adicionarAresta('F', 'E', 1);
// g.adicionarAresta('E', 'F', 2);
// g.adicionarAresta('C', 'D', 1);
// g.adicionarAresta('D', 'C', 1);
// g.adicionarAresta('B', 'F', 1);
// g.adicionarAresta('F', 'B', 1);
// g.adicionarAresta('F', 'G', 1);
// g.adicionarAresta('G', 'F', 1);
// g.adicionarAresta('G', 'H', 1);
// g.adicionarAresta('H', 'G', 1);
// g.adicionarAresta('C', 'G', 1);
// g.adicionarAresta('G', 'C', 1);
// g.adicionarAresta('H', 'D', 1);
// g.adicionarAresta('D', 'H', 1);
// g.adicionarAresta('E', 'I', 1);
// g.adicionarAresta('I', 'E', 1);
// g.adicionarAresta('I', 'J', 1);
// g.adicionarAresta('J', 'I', 1);
// g.adicionarAresta('F', 'J', 1);
// g.adicionarAresta('J', 'F', 1);
// g.adicionarAresta('J', 'K', 1);
// g.adicionarAresta('K', 'J', 1);
// g.adicionarAresta('G', 'K', 1);
// g.adicionarAresta('K', 'G', 1);
// g.adicionarAresta('K', 'L', 1);
// g.adicionarAresta('L', 'K', 1);
// g.adicionarAresta('H', 'L', 1);
// g.adicionarAresta('L', 'H', 1);
// g.adicionarAresta('I', 'M', 1);
// g.adicionarAresta('M', 'I', 1);
// g.adicionarAresta('J', 'N', 1);
// g.adicionarAresta('N', 'J', 1);
// g.adicionarAresta('M', 'N', 1);
// g.adicionarAresta('N', 'M', 1);
// g.adicionarAresta('N', 'O', 1);
// g.adicionarAresta('O', 'N', 1);
// g.adicionarAresta('K', 'O', 1);
// g.adicionarAresta('O', 'K', 1);
// g.adicionarAresta('O', 'P', 1);
// g.adicionarAresta('P', 'O', 1);
// g.adicionarAresta('P', 'L', 1);
// g.adicionarAresta('L', 'P', 1);

// g.renderArestas();

// g.ativarVertices(['A', 'B', 'E'])
