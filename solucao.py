import string

import grafo2 as grafo
import wumpus

class Solucao:
    def __init__(self):
        pass

    def tabuleiro_para_grafo(self, jogo):
        letras = string.ascii_lowercase
        g = grafo.Grafo(list(letras[:jogo.tamanho**2]))
        matriz = []
        for i in range(0, jogo.tamanho**2, jogo.tamanho):
            matriz.append(letras[i:i + jogo.tamanho])
        for x in range(jogo.tamanho):
            for y in range(jogo.tamanho):
                casa_atual = jogo.casa(x, y)
                if 0 <= x < jogo.tamanho - 1:
                    casa_proxima = jogo.casa(x + 1 , y)
                    g.add_aresta((matriz[x][y], matriz[x+1][y], self._calcula_custo(casa_atual, casa_proxima)))
                    # g.add_aresta((matriz[x+1][y], matriz[x][y], self._calcula_custo(casa_proxima, casa_atual)))
                if 0 < x <= jogo.tamanho - 1:
                    casa_anterior = jogo.casa(x - 1 , y)
                    g.add_aresta((matriz[x][y], matriz[x-1][y], self._calcula_custo(casa_atual, casa_anterior)))
                    # g.add_aresta((matriz[x-1][y], matriz[x][y], self._calcula_custo(casa_anterior, casa_atual)))   

                if 0 <= y < jogo.tamanho - 1:
                    casa_direita = jogo.casa(x, y + 1)
                    g.add_aresta((matriz[x][y], matriz[x][y+1], self._calcula_custo(casa_atual, casa_direita)))
                    # g.add_aresta((matriz[x][y+1], matriz[x][y], self._calcula_custo(casa_direita, casa_atual)))
                if 0 < y <= jogo.tamanho - 1:
                    casa_esquerda = jogo.casa(x, y - 1)
                    g.add_aresta((matriz[x][y], matriz[x][y-1], self._calcula_custo(casa_atual, casa_esquerda)))
                    # g.add_aresta((matriz[x][y-1], matriz[x][y], self._calcula_custo(casa_esquerda, casa_atual)))
        return g

    def _calcula_custo(self, casa1, casa2):
        """Calcula o custo para ir de uma casa para outra de acordo com o que está nela."""
        custo = 1
        # Caso estiver indo para uma casa com wumpus.
        if casa2 == wumpus.WUMPUS:
            custo = 10

        # Caso estiver indo para uma casa com fedor.
        if casa2 == wumpus.FEDOR:
            custo = 8
            if casa1 == wumpus.WUMPUS:
                custo = 2

        # Caso estiver indo para uma casa com ouro.
        if casa2 == wumpus.OURO:
            custo = 0

        # Caso estiver indo de casa com ouro para casa vazia ou com brisa ou com caverna.
        if casa1 == wumpus.OURO and casa2 in ([wumpus.VAZIO, wumpus.BRISA, wumpus.CAVERNA]):
            custo = 5

        return custo

if __name__ == '__main__':
    solucao = Solucao()
    w = wumpus.Wumpus.cria_de_lista([
        ['o', 'b', 'g', 'o'],
        ['o', 'v', 'v', 'f'],
        ['o', 'b', 'o', 'w'],
        ['c', 'o', 'o', 'f'],
    ], 4)
    print(w)
    g = solucao.tabuleiro_para_grafo(w)
    print(g._grafo)
    print(g._menor_custo('m', 'c'))