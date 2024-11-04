class Vehiculo {
    
    constructor(id, modelo, anoFabricacion, velMax) {
        this.id = id;
        this.modelo = modelo;
        this.anoFabricacion = anoFabricacion;
        this.velMax = velMax;
    }

    toString() {
        return `ID: ${this.id}, Modelo: ${this.modelo}, Año Fabricacion: ${this.anoFabricacion}, 
        Velocidad Maxima: ${this.velMax}, `;
    }
}