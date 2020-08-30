import json

from flask import Flask
from flask import request
from flask_cors import CORS

import wumpus as wumpus_game
import solucao

app = Flask(__name__)
CORS(app)

GAME = None

@app.route('/criar-tabuleiro')
def criar_tabuleiro():
    # Quantidades de cada personagem.
    casas = int(request.args.get('casas'))
    wumpus = int(request.args.get('wumpus'))
    fedor = int(request.args.get('fedor'))
    brisa = int(request.args.get('brisa'))
    caverna = int(request.args.get('caverna'))

    print('casas', casas)
    print('wumpus', wumpus)
    print('fedor', fedor)
    print('brisa', brisa)
    print('caverna', caverna)

    game = wumpus_game.Wumpus(casas, [0, 0])
    game.inicializa_tabuleiro(caverna, brisa, fedor, wumpus)
    global GAME
    GAME = game
    return json.dumps(game.tabuleiro)

@app.route('/solucionar')
def solucionar():
    print('solucionando')
    print(GAME)
    incio = GAME.posicao_cacador
    fim = GAME.posicao_ouro
    sol = solucao.Solucao()
    grafo = sol.tabuleiro_para_grafo(GAME)
    caminho = grafo._menor_custo(sol.vertice_cacador, sol.vertice_ouro)
    return json.dumps(caminho)