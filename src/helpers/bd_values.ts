export class BDValues {

    static readonly cozinhaInside = ['Nenhum', 'fora', 'dentro', 'fora e dentro']
    static readonly cozinhaShared = ['Nenhum', 'pessoal', 'compartilhado', 'pessoal e compartilhado']

    static readonly bafroomInside = ['fora', 'dentro', 'fora e dentro']
    static readonly bafroomShared = ['pessoal', 'compartilhado', 'pessoal e compartilhado']

    static getNamedCozinhaInside(index: -1 | 0 | 1 | 2 | number) {
        return this.cozinhaInside[index + 1]
    }
    static getNamedCozinhaShared(index: -1 | 0 | 1 | 2 | number) {
        return this.cozinhaShared[index + 1]
    }

    static getNamedBafroomInside(index: 0 | 1 | 2 | number) {
        return this.bafroomInside[index + 1]
    }
    static getNamedBafroomShared(index: 0 | 1 | 2 | number) {
        return this.bafroomShared[index + 1]
    }

}