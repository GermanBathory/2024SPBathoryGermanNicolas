class Auto extends Vehiculo {

    constructor(id, modelo, anoFabricacion, velMax, cantidadPuertas, asientos) {
        super(id, modelo, anoFabricacion, velMax);
        this.cantidadPuertas = cantidadPuertas;
        this.asientos = asientos;
    }

    toString() {
        return `Cliente: ` + super.toString() + `Cantidad puertas: ${this.cantidadPuertas}, 
        Asientos: ${this.asientos}`;
    }
}