import random

import prettytable

VAZIO = 'o'
WUMPUS = 'w'
CACADOR = 'c'
OURO = 'g'
BRISA = 'b'
FEDOR = 'f'
CAVERNA = 'v'

TAMANHO = 6

print(f'{VAZIO}: vazio')
print(f'{WUMPUS}: wupus')
print(f'{CACADOR}: caçador')
print(f'{OURO}: ouro')
print(f'{BRISA}: brisa')
print(f'{FEDOR}: fedor')
print(f'{CAVERNA}: caverna')

class Wumpus:
    def __init__(self, tamanho=TAMANHO, inicio=[]):
        self.quantidade_wumpus = 0
        self.quantidade_ouro = 0
        self.quantidade_brisa = 0
        self.quantidade_caverna = 0
        self.quantidade_fedor = 0
        if inicio and len(inicio) == 2:
            self.x_inicio, self.y_inicio = inicio
        else:
            self.x_inicio, self.y_inicio = random.randint(0, tamanho-1), random.randint(0, tamanho-1)
            self.tamanho = tamanho
            self.tabuleiro = [[VAZIO] * tamanho for _ in range(tamanho)]
            self.posiciona_cacador(self.x_inicio, self.y_inicio)

    def __str__(self):
        """Mostra tabuleiro formatado como tabela."""
        tabuleiro = prettytable.PrettyTable(header=False)
        for linha in self.tabuleiro:
            tabuleiro.add_row(linha)
        return str(tabuleiro)

    @staticmethod
    def cria_de_lista(lista, tamanho):
        """Cria tabuleiro a partir de uma lista de listas."""
        tabuleiro = []
        for x in range(tamanho):
            tabuleiro.append([])
            for y in range(tamanho):
                tabuleiro[x].append(lista[x][y])
        wumpus = Wumpus(tamanho)
        wumpus.tabuleiro = tabuleiro
        return wumpus


    def posiciona_cacador(self, x, y):
        """Coloca o caçador na posição especificada."""
        self.tabuleiro[x][y] = self.tabuleiro[x][y].replace(VAZIO, '') + CACADOR

    def posiciona_wumpus(self, x, y):
        """Coloca o wumpus na posição especificada."""
        self.tabuleiro[x][y] = self.tabuleiro[x][y].replace(VAZIO, '') + WUMPUS
        self.quantidade_wumpus += 1

    def posiciona_ouro(self, x, y):
        """Coloca um ouro na posição especificada."""
        self.tabuleiro[x][y] = self.tabuleiro[x][y].replace(VAZIO, '') + OURO
        self.quantidade_ouro += 1

    def posiciona_caverna(self, x, y):
        """Coloca uma caverna na posição especificada."""
        self.tabuleiro[x][y] = self.tabuleiro[x][y].replace(VAZIO, '') + CAVERNA
        self.quantidade_caverna += 1

    def posiciona_brisa(self, x, y):
        """Coloca uma brisa na posição especificada."""
        self.tabuleiro[x][y] = self.tabuleiro[x][y].replace(VAZIO, '') + BRISA
        self.quantidade_brisa += 1

    def posiciona_fedor(self, x, y):
        """Coloca um fedor na posição especificada."""
        self.tabuleiro[x][y] = self.tabuleiro[x][y].replace(VAZIO, '') + FEDOR
        self.quantidade_fedor += 1

    def casa(self, x, y):
        """Retorna o que está na casa na posição especificada."""
        return self.tabuleiro[x][y]

    def casa_esta_livre(self, x, y):
        """Verifica se uma casa está livre"""
        return self.tabuleiro[x][y] == VAZIO

    def casas_livres(self):
        """Retorna lista com casas do tabuleiro que ainda não foram utilizadas."""
        casas_livres = []
        for x in range(self.tamanho):
            for y in range(self.tamanho):
                if self.tabuleiro[x][y] == VAZIO:
                    casas_livres.append((x, y))
        return casas_livres

    def casas_com_wumpus(self):
        """Retorna lista de casas do tabuleiro que possuem um wumpus nela."""
        casas_com_wumpus = []
        for x in range(self.tamanho):
            for y in range(self.tamanho):
                if self.tabuleiro[x][y] == WUMPUS:
                    casas_com_wumpus.append((x, y))
        return casas_com_wumpus

    def inicializa_tabuleiro(self, cavernas, brisas, fedores, wumpus=1, ouros=1):
        """Posiciona o ambiente aleatoriamente, recebe a quantidade de cada componente."""
        casas_livres = self.casas_livres()
        # Coloca todas as cavernas no tabuleiro.
        for _ in range(cavernas):
            x, y = casas_livres.pop(random.randint(0, len(casas_livres) - 1))
            self.posiciona_caverna(x, y)
        # Coloca todas as brisas no tabuleiro.
        for _ in range(brisas):
            x, y = casas_livres.pop(random.randint(0,len(casas_livres) - 1))
            self.posiciona_brisa(x, y)
        # Coloca todos os wumpus no tabuleiro.
        for _ in range(wumpus):
            x, y = casas_livres.pop(random.randint(0,len(casas_livres) - 1))
            self.posiciona_wumpus(x, y)
        # Coloca todas os ouros no tabuleiro.
        for _ in range(ouros):
            x, y = casas_livres.pop(random.randint(0, len(casas_livres) - 1))
            self.posiciona_ouro(x, y)
        # Coloca todas os fedores sempre em casas próximas de algum wumpus.
        casas_com_wumpus = self.casas_com_wumpus()
        for x, y in casas_com_wumpus:
            # Pega todas as casas ao redor da casa que tem o wumpus.
            casas_proximas = []
            if x > 0:
                casas_proximas.append((x - 1, y))
            if x < self.tamanho - 1:
                casas_proximas.append((x + 1, y))
            if y > 0:
                casas_proximas.append((x, y - 1))
            if y < self.tamanho - 1:
                casas_proximas.append((x, y + 1))

        for _ in range(fedores):
            x, y = casas_proximas.pop(random.randint(0, len(casas_proximas) - 1))
            self.posiciona_fedor(x, y)

if __name__ == '__main__':
    wumpus2 = Wumpus.cria_de_lista([
        ['o', 'b', 'g', 'o'],
        ['o', 'v', 'v', 'f'],
        ['o', 'b', 'o', 'w'],
        ['c', 'o', 'o', 'f'],
    ], 4)
    print(wumpus2)
