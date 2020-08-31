from collections import defaultdict

class Grafo:
    def __init__(self, vertices, arestas=None):
        if arestas is None:
            arestas = []
        self.vertices = vertices
        self.arestas = arestas
        self._grafo = defaultdict(lambda: defaultdict(int))

        if arestas:
            self.__configura_grafo()

    def __configura_grafo(self):
        """Configura as arestas no grafo."""
        for v1, v2, custo in self.arestas:
            self._grafo[v1][v2] = custo
            # self._grafo[v2][v1] = custo

    def _menor_custo(self, v1, v2, opcao='c'):
        """Encontra menor custo para ir de v1 a v2 atraves do algoritmo de Dijktra."""
        # Inicializa menor custo de v1 ate ele mesmo como 0 e como infinito ate os demais.
        menores_custos = {vertice: {'via': None, 'custo': float('inf')} for vertice in self.vertices}
        menores_custos[v1]['via'] = v1
        menores_custos[v1]['custo'] = 0

        # Vertices cuja menor distancia ate eles ainda nao foi determinada.
        nao_determinados = self.vertices.copy()

        vertice_atual = v1
        # Enquanto tiver algum vertice nao determinado.
        while nao_determinados:
            # Encontra os vertices conectados com vertice_atual.
            vertices_conectados = self.get_vertices_adjacentes(vertice_atual)
            for vertice in vertices_conectados:
                # Encontra distancia do vertice_atual ate o vizinho dele.
                custo = self.get_custo(vertice_atual, vertice) + menores_custos[vertice_atual]['custo']
                if custo < menores_custos[vertice]['custo']:
                    menores_custos[vertice]['via'] = vertice_atual
                    menores_custos[vertice]['custo'] = custo

            nao_determinados.remove(vertice_atual)

            # Orderna para pegar sempre o proximo vertice com menor custo.
            menores_custos = dict(sorted(menores_custos.items(), key=lambda item: item[1]['custo']))

            # if vertice_atual == v2:
            #     return menores_custos[v2]['custo']          
            
            # Encontra vertice com menor custo.
            for menor in menores_custos.keys():
                if menor in nao_determinados:
                    vertice_atual = menor
                    break
        if opcao == 'c':
            caminho = []
            caminho.append(v2)
            while v1 != v2:
                menor = menores_custos[v2]
                via = menor['via']
                caminho.append(via)
                v2 = via
            return list(reversed(caminho))
        return menores_custos[v2]['custo']
    
    def _possui_ciclo(self, vertice, visitados=[]):
        if vertice in visitados:
            return True
        visitados.append(vertice)
        for v in self.get_vertices_adjacentes(vertice):
            possui_ciclo = self._possui_ciclo(v, visitados)
            if possui_ciclo:
                return possui_ciclo
        return False

    @staticmethod
    def ciclico(grafo, v):
        return Grafo._possui_ciclo(grafo, v)

    def bfs(self, v):
        proximos = [v]
        visitados = []
        while proximos:
            v = proximos.pop(0)
            if v not in visitados:
                print('encontrando vizinhos de', v)
                for adjacente in self.get_vertices_adjacentes(v):
                    proximos.append(adjacente)
                visitados.append(v)

    def dfs(self, v, vis=[]):
        if v not in vis:
            for vertice in self.get_vertices_adjacentes(v):
                self.dfs(vertice, vis)
            vis.append(v)

    def get_caminho_completo(self):
        """Retorna o menor caminho que liga todos os vertices."""
        pass

    def add_aresta(self, aresta):
        """Adiciona aresta no grafo."""
        # print(f'adicionando aresta entre {aresta[0]} e {aresta[1]}')
        self.arestas.append(aresta)
        self.__configura_grafo()
    
    def add_arestas(self, arestas):
        """Adiciona varias arestas no grafo."""
        self.arestas.extend(arestas)
        self.__configura_grafo()

    def get_vertices_adjacentes(self, v):
        """Retorna vertices diretamente conectados com v."""
        return set(self._grafo[v].keys())

    def get_custo(self, v1, v2):
        """Retorna menor custo para ir de v1 a v2."""
        if v2 in self.get_vertices_adjacentes(v1):
            return self._grafo[v1][v2]
        return self._menor_custo(v1, v2)

if __name__ == '__main__':
    grafo = Grafo(list('abcde'))
    grafo.add_aresta(('a', 'b', 6))
    grafo.add_aresta(('a', 'd', 1))
    grafo.add_aresta(('b', 'a', 6))
    grafo.add_aresta(('b', 'c', 5))
    grafo.add_aresta(('b', 'd', 2))
    grafo.add_aresta(('b', 'e', 2))
    grafo.add_aresta(('c', 'e', 5))
    grafo.add_aresta(('c', 'b', 5))
    grafo.add_aresta(('d', 'a', 1))
    grafo.add_aresta(('d', 'b', 2))
    grafo.add_aresta(('d', 'e', 1))
    grafo.add_aresta(('e', 'd', 1))
    grafo.add_aresta(('e', 'b', 2))
    grafo.add_aresta(('e', 'c', 5))

    print(grafo._menor_custo('a', 'd'))
        