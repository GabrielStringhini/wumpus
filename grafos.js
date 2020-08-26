const cor = '#000000';
const corAtivo = '#FF0000';
const raio = 40;
const tamanhoFlecha = 15;

class Grafo {
    constructor(canvasVertices, canvasArestas) {
        this._canvasVertices = document.getElementById(canvasVertices);
        this._canvasArestas = document.getElementById(canvasArestas);
        this._ctxVertices = this._canvasVertices.getContext("2d");
        this._ctxArestas = this._canvasArestas.getContext("2d");
        this._arrastando = null;
        this._quantidadeArestas = 0
        this._vertices = {};
        this._grafo = {};

        this._canvasVertices.onmousedown = (e) => {
            Object.entries(this._vertices).map(([id, vertice]) => {
                const distancia = Math.sqrt((vertice.x - e.pageX) ** 2 + (vertice.y - e.pageY) ** 2);
                if (distancia <= (vertice.raio ?? raio)) {
                    this._arrastando = { id, vertice };
                    return;
                }
            });
        }

        this._canvasVertices.onmousemove = (e) => {
            if (this._arrastando) {
                this.vertice(this._arrastando.id, 'x', e.pageX);
                this.vertice(this._arrastando.id, 'y', e.pageY);
            }
        }

        this._canvasVertices.onmouseup = (e) => {
            this._arrastando = null;
        }
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
        this._vertices[vertice.nome] = vertice;
        this._grafo[vertice.nome] = {};
    }

    adicionarAresta(origem, destino, custo) {
        if (!this._grafo[origem][destino]) this._grafo[origem][destino] = [];
        this._quantidadeArestas++;
        this._grafo[origem][destino].push({ id:this._quantidadeArestas, custo: custo, desenhada: false });
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
        // const angulos = [];
        // if (quantidade % 2 == 1) {
        //     angulos.push(angulo);
        //     quantidade--;
        // }
        // for (let i = 1; i <= (parseInt(quantidade / 2)); i++) {
        //     angulos.push(angulo + (angulo / quantidade) * i);
        //     angulos.push(angulo - (angulo / quantidade) * i);
        // }
        // return angulos;
    }

    renderVertices() {
        Object.entries(this._vertices).map(([id, vertice]) => {
            this.renderVertice(vertice);
        });
    }

    renderArestas() {
        Object.keys(this._vertices).map(nomeOrigem => {
            const origem = this._grafo[nomeOrigem];
            Object.keys(origem).map(nomeDestino => {
                this._grafo[nomeOrigem][nomeDestino].map(aresta => {
                    const a = {
                        id: aresta.id,
                        custo: aresta.custo,
                        desenhada: aresta.desenhada,
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
        this._ctxVertices.strokeStyle = vertice.ativado ? corAtivo : cor;
        this._ctxVertices.font = "30px Arial";
        this._ctxVertices.fillStyle = vertice.ativado ? corAtivo : cor;
        this._ctxVertices.arc(vertice.x, vertice.y, vertice.raio ?? raio, 0, Math.PI * 2, false);
        this._ctxVertices.stroke();
        this._ctxVertices.fillText(vertice.nome, vertice.x - 10, vertice.y + 10);
        this._ctxVertices.restore();
        this._ctxVertices.closePath();
    }

    renderAresta(aresta) {
        this._ctxArestas.beginPath();
        this._ctxArestas.save();
        // Quantidade de arestas entre os dois vertices;
        const { quantidade, desenhadas } = this.arestasEntre(aresta.origem.nome, aresta.destino.nome);

        const diferencaX = Math.abs(aresta.destino.x - aresta.origem.x);
        const diferencaY = Math.abs(aresta.destino.y - aresta.origem.y);
        let anguloOrigem = Math.atan(diferencaY / diferencaX);
        let anguloDestino = Math.atan(diferencaX / diferencaY);

        const angulosOrigem = this.calculaAngulos(anguloOrigem, quantidade);
        const angulosDestino = this.calculaAngulos(anguloDestino, quantidade);

        anguloOrigem = angulosOrigem[desenhadas];
        anguloDestino = angulosDestino[desenhadas];

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

        if (aresta.origem.x > aresta.destino.x) {
            if (aresta.origem.y > aresta.destino.y) {
                this._ctxArestas.moveTo(aresta.origem.x - origem.x, aresta.origem.y - origem.y);
                this._ctxArestas.lineTo(aresta.destino.x + destino.x, aresta.destino.y + destino.y);
            } else {
                this._ctxArestas.moveTo(aresta.origem.x - origem.x, aresta.origem.y + origem.y);
                this._ctxArestas.lineTo(aresta.destino.x + destino.x, aresta.destino.y - destino.y);
            }
        } else {
            if (aresta.origem.y > aresta.destino.y) {
                this._ctxArestas.moveTo(aresta.origem.x + origem.x, aresta.origem.y - origem.y);
                this._ctxArestas.lineTo(aresta.destino.x - destino.x, aresta.destino.y + destino.y);
            } else {
                this._ctxArestas.moveTo(aresta.origem.x + origem.x, aresta.origem.y + origem.y);
                this._ctxArestas.lineTo(aresta.destino.x - destino.x, aresta.destino.y - destino.y);
            }
        }

        this._ctxArestas.stroke();
        this._ctxArestas.restore();
        this._ctxArestas.closePath();
        // Marca que a aresta já foi desenhada.
        this._grafo[aresta.origem.nome][aresta.destino.nome].map((a, i) => {
            if (a.id == aresta.id) this._grafo[aresta.origem.nome][aresta.destino.nome][i].desenhada = true;
        });
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

const grafo = new Grafo('camada1', 'camada2');
// X e Y da origem > destino
grafo.adicionarVertice({ nome: 'A', x: 100, y: 80 });
grafo.adicionarVertice({ nome: 'B', x: 300, y: 80 });
grafo.adicionarVertice({ nome: 'C', x: 150, y: 150 });
grafo.adicionarVertice({ nome: 'D', x: 110, y: 300 });

grafo.renderVertices();
grafo.adicionarAresta('A', 'B', 100);
grafo.adicionarAresta('A', 'B', 20);
grafo.adicionarAresta('A', 'B', 10);
grafo.adicionarAresta('B', 'C', 10);
grafo.adicionarAresta('A', 'C', 30);
grafo.adicionarAresta('B', 'D', 30);

grafo.renderArestas();
console.log('grafo', grafo);
