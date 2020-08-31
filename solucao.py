from collections import defaultdict
import string

import grafo
import wumpus

class Solucao:
    def __init__(self):
        self.vertice_cacador = None
        self.vertice_ouro = None

    def tabuleiro_para_grafo(self, jogo):
        # letras = string.ascii_lowercase
        numeros = list(range(jogo.tamanho**2))
        g = grafo.Grafo(list(numeros[:jogo.tamanho**2]))
        g._grafo = defaultdict(lambda: defaultdict(int))
        matriz = []
        for i in range(0, jogo.tamanho**2, jogo.tamanho):
            matriz.append(numeros[i:i + jogo.tamanho])
        for x in range(jogo.tamanho):
            for y in range(jogo.tamanho):
                casa_atual = jogo.casa(x, y)
                if wumpus.CACADOR in casa_atual:
                    self.vertice_cacador = matriz[x][y]
                if wumpus.OURO in casa_atual:
                    self.vertice_ouro = matriz[x][y]
                if 0 <= x < jogo.tamanho - 1:
                    casa_proxima = jogo.casa(x + 1 , y)
                    g.add_aresta((matriz[x][y], matriz[x+1][y], self._calcula_custo(casa_atual, casa_proxima)))
                if 0 < x <= jogo.tamanho - 1:
                    casa_anterior = jogo.casa(x - 1 , y)
                    g.add_aresta((matriz[x][y], matriz[x-1][y], self._calcula_custo(casa_atual, casa_anterior)))

                if 0 <= y < jogo.tamanho - 1:
                    casa_direita = jogo.casa(x, y + 1)
                    g.add_aresta((matriz[x][y], matriz[x][y+1], self._calcula_custo(casa_atual, casa_direita)))

                if 0 < y <= jogo.tamanho - 1:
                    casa_esquerda = jogo.casa(x, y - 1)
                    g.add_aresta((matriz[x][y], matriz[x][y-1], self._calcula_custo(casa_atual, casa_esquerda)))
        return g

    def _calcula_custo(self, casa1, casa2):
        """Calcula o custo para ir de uma casa para outra de acordo com o que está nela."""
        custo = 1
        # Caso estiver indo para casa que tenha Wumpus.
        if wumpus.WUMPUS in casa2:
            custo += 200
        
        # Caso estiver indo para casa que tenha fedor.
        if wumpus.FEDOR in casa2:
            custo += 50

        # Caso estiver indo para casa que tenha ouro.
        if wumpus.OURO in casa2:
            custo = 0

        return custo
        # custo = 1
        # # Caso estiver indo para uma casa com wumpus.
        # if casa2 == wumpus.WUMPUS:
        #     custo = 10

        # # Caso estiver indo para uma casa com fedor.
        # if casa2 == wumpus.FEDOR:
        #     custo = 8
        #     if casa1 == wumpus.WUMPUS:
        #         custo = 2

        # # Caso estiver indo para uma casa com ouro.
        # if casa2 == wumpus.OURO:
        #     custo = 0

        # # Caso estiver indo de casa com ouro para casa vazia ou com brisa ou com caverna.
        # if casa1 == wumpus.OURO and casa2 in ([wumpus.VAZIO, wumpus.BRISA, wumpus.CAVERNA]):
        #     custo = 5

        # return custo

if __name__ == '__main__':
    solucao = Solucao()
    w = wumpus.Wumpus.cria_de_lista([
        ['o', 'b', 'g', 'o', 'o'],
        ['o', 'v', 'v', 'f', 'o'],
        ['o', 'b', 'o', 'w', 'o'],
        ['c', 'o', 'o', 'f', 'o'],
        ['o', 'o', 'o', 'o', 'o'],
    ], 5)
    print(w)
    g = solucao.tabuleiro_para_grafo(w)
    print(g._grafo)
    # print(g._menor_custo(1, 10))
