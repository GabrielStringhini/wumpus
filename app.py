import copy
import json

from flask import Flask, request, session
from flask_cors import CORS, cross_origin

import wumpus as wumpus_game
import solucao

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

app.secret_key = 'chave-secreta'

GAME = None
GRAFO = None
VERTICE_CACADOR = None
VERTICE_OURO = None

@app.route('/criar-tabuleiro')
@cross_origin()
def criar_tabuleiro():
    global GAME
    global GRAFO
    # Quantidades de cada personagem.
    casas = int(request.args.get('casas'))
    wumpus = int(request.args.get('wumpus'))
    fedor = int(request.args.get('fedor'))
    brisa = int(request.args.get('brisa'))
    caverna = int(request.args.get('caverna'))

    game = wumpus_game.Wumpus(casas, [0, 0])
    game.inicializa_tabuleiro(caverna, brisa, fedor, wumpus)
    GAME = copy.deepcopy(game)
    return json.dumps(game.tabuleiro)

@app.route('/criar-grafo')
@cross_origin()
def criar_grafo():
    # print('session criando grafo', session)
    global GRAFO
    global VERTICE_CACADOR
    global VERTICE_OURO
    sol = solucao.Solucao()
    GRAFO = copy.deepcopy(sol.tabuleiro_para_grafo(GAME))
    VERTICE_CACADOR = sol.vertice_cacador
    VERTICE_OURO = sol.vertice_ouro
    return json.dumps(GRAFO._grafo)

@app.route('/solucionar')
@cross_origin()
def solucionar():
    incio = GAME.posicao_cacador
    fim = GAME.posicao_ouro
    sol = solucao.Solucao()
    caminho = GRAFO._menor_custo(VERTICE_CACADOR, VERTICE_OURO)
    return json.dumps(caminho)