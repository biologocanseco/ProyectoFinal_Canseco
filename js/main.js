//Clase molde para los productos
class Producto {
    constructor(id, nombre, precio, categoria, imagen) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
        this.imagen = imagen;
    }
}

//Clase que va a simular una base de datos

class BaseDeDatos {
    constructor() {
        this.productos = [];
        this.agregarRegistro(1, "Bolsa Bag Adidas", 3000, "Ropa", "bagAdidas.jpg");
        this.agregarRegistro(2, "Balon Wilson", 3000, "Ropa", "balonWilson.jpg");
        this.agregarRegistro(3, "Calcetas Adidas", 3000, "Ropa", "calcetasAdidas.jpg");
        this.agregarRegistro(4, "Gorra Joma", 7000, "Ropa", "gorraJoma.jpg");
        this.agregarRegistro(5, "Gorra Los Angeles", 7000, "Ropa", "GorraLA.jpg");
        this.agregarRegistro(6, "Gorra Los Yankis", 7000, "Ropa", "gorraYankis.jpg");
        this.agregarRegistro(7, "Pans Deportivo Adidas", 8000, "Ropa", "pansAdidas.jpg");
        this.agregarRegistro(8, "Playera Puma", 8000, "Ropa", "playeraPuma.jpg");
        this.agregarRegistro(9, "Short Adidas", 8000, "Ropa", "shortAdidas.jpg");
    }

    agregarRegistro(id, nombre, precio, categoria, imagen) {
        const producto = new Producto(id, nombre, precio, categoria, imagen);
        this.productos.push(producto);
    }

    traerRegistros() {
        return this.productos;
    }

    registroPorId(id) {
        return this.productos.find((producto) => producto.id === id);
    }

    registroPorNombre(palabra) {
        return this.productos.filter((producto) => producto.nombre.toLowerCase().includes(palabra));
    }
}

const bd = new BaseDeDatos();

//Elementos
const divProductos = document.querySelector("#productos");
const divCarrito = document.querySelector("#carrito");
const spanCantidadProductos = document.querySelector("#cantidadProductos");
const spanTotalCarrito = document.querySelector("#totalCarrito");
const inputBuscar = document.querySelector("#inputBuscar");
const botonCarrito = document.querySelector("section h1");

cargarProductos(bd.traerRegistros());

function cargarProductos(productos) {
    divProductos.innerHTML = "";
    for (const producto of productos) {
        divProductos.innerHTML += `
        <div class="producto">
        <h2>${producto.nombre}</h2>
        <p class="precio">$${producto.precio}</p>
        <div class= "imagen">
        <img src="../img/${producto.imagen}" width="150">
        </div>
        <a href="#" class="btnAgregar" data-id="${producto.id}">Agregar al carrito</a>
        </div>
        `;
    }

    const botonesAgregar = document.querySelectorAll(".btnAgregar");
    for (const boton of botonesAgregar) {
        boton.addEventListener("click", (event) => {
            event.preventDefault();
            const id = Number(boton.dataset.id);
            const producto = bd.registroPorId(id);
            carrito.agregar(producto);
        });
    }
}

//Clase carrito

class Carrito {
    constructor() {
        const carritoStorage = JSON.parse(localStorage.getItem("carrito"));
        this.carrito = carritoStorage || [];
        this.total = 0;
        this.totalProductos = 0;
        this.listar();
    }

    //Método para agregar el producto al carrito
    agregar(producto) {
        const productoEnCarrito = this.figuraEnCarrito(producto);
        if (productoEnCarrito) {
            productoEnCarrito.cantidad++;
        } else {
            this.carrito.push({ ...producto, cantidad: 1 });
        }
        localStorage.setItem("carrito", JSON.stringify(this.carrito));
        this.listar();
    }

    figuraEnCarrito({ id }) {
        return this.carrito.find((producto) => producto.id === id);
    }

    listar() {
        this.total = 0;
        this.totalProductos = 0;
        divCarrito.innerHTML = "";
        for (const producto of this.carrito) {
            divCarrito.innerHTML += `
            <div class="productoCarrito">
            <h2>${producto.nombre}</h2>
            <p>$${producto.precio}</p>
            <p>Cantidad: ${producto.cantidad}</p>
            <a href="#" data-id="${producto.id}" class="btnQuitar">Quitar del carrito</a>
            </div>
            `;
            this.total += producto.precio * producto.cantidad;
            this.totalProductos += producto.cantidad;
        }

        const botonesQuitar = document.querySelectorAll(".btnQuitar");
        for (const boton of botonesQuitar) {
            boton.onclick = (event) => {
                event.preventDefault();
                this.quitar(Number(boton.dataset.id));
            };
        }

        spanCantidadProductos.innerText = this.totalProductos;
        spanTotalCarrito.innerText = this.total;
    }

    //Método para quitar o restar productos del carrito
    quitar(id) {
        const indice = this.carrito.findIndex((producto) => producto.id === id);
        if (this.carrito[indice].cantidad > 1) {
            this.carrito[indice].cantidad--;
        } else {
            this.carrito.splice(indice, 1);
        }
        localStorage.setItem("carrito", JSON.stringify(this.carrito));
        this.listar();
    }
}

//Evento del buscador
inputBuscar.addEventListener("keyup", () => {
    const palabra = inputBuscar.value;
    const productos = bd.registroPorNombre(palabra.toLowerCase());
    cargarProductos(productos);
});

botonCarrito.addEventListener("click", () => {
    document.querySelector("section").classList.toggle("ocultar");
});

const carrito = new Carrito();