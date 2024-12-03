// DOMContentLoaded asegura que el DOM esté completamente cargado antes de ejecutar el script
document.addEventListener('DOMContentLoaded', () => { 
    // Base de datos de productos disponibles
    const baseDeDatos = [
        {
            id: 1,
            nombre: 'Sombrero vueltiao con la bandera de Colombia, 23 vueltas',
            precio: 250000,
            imagen: 'assets/img/feature_prod_02.jpg',
            categoria: 'sombreros'
        },
        {
            id: 2,
            nombre: 'Sombrero vueltiao-machiembriao',
            precio: 150000,
            imagen: 'assets/img/feature_prod_02.jpg',
            categoria: 'sombreros'
        },
        {
            id: 3,
            nombre: 'Sombrero vueltiao colombiano 15 vueltas tricolor',
            precio: 250000,
            imagen: 'assets/img/feature_prod_02.jpg',
            categoria: 'sombreros'
        },
        {
            id: 4,
            nombre: 'Mochila wayuu azul 6',
            precio: 120000,
            imagen: 'assets/img/shop_04.jpg',
            categoria: 'mochilas'
        },
        {
            id: 5,
            nombre: 'Bolso en fique',
            precio: 120000,
            imagen: 'assets/img/shop_03.jpg',
            categoria: 'bolsos'
        },
        {
            id: 6,
            nombre: 'Hamaca',
            precio: 120000,
            imagen: 'assets/img/category_img_02.jpg',
            categoria: 'hamacas'
        }
    ];

    // Variables globales
    let carrito = []; // Almacena los IDs de los productos en el carrito
    const divisa = '$'; // Símbolo de moneda
    const DOMitems = document.querySelector('#items'); // Contenedor para productos
    const DOMcarrito = document.querySelector('#carrito'); // Contenedor para mostrar el carrito
    const DOMtotal = document.querySelector('#total'); // Elemento para mostrar el total
    const DOMbotonVaciar = document.querySelector('#boton-vaciar'); // Botón para vaciar el carrito
    const miLocalStorage = window.localStorage; // Referencia al almacenamiento local del navegador
    const filtroSelect = document.getElementById("filtro"); // Select para filtrar productos

    // Renderiza los productos disponibles en el DOM
    function renderizarProductos() {
        DOMitems.innerHTML = ""; // Limpia el contenido previo de productos

        // Filtra los productos según la categoría seleccionada
        const filtro = filtroSelect.value;
        const productosFiltrados = baseDeDatos.filter(producto => 
            filtro === "todas" || producto.categoria === filtro
        );

        // Crea elementos HTML para cada producto
        productosFiltrados.forEach((info) => {
            const miNodo = document.createElement('div');
            miNodo.classList.add('card', 'col-sm-4'); // Usa clases de Bootstrap
            
            const miNodoCardBody = document.createElement('div');
            miNodoCardBody.classList.add('card-body');
            
            const miNodoTitle = document.createElement('h6');
            miNodoTitle.classList.add('card-title');
            miNodoTitle.textContent = info.nombre; // Nombre del producto
            
            const miNodoImagen = document.createElement('img');
            miNodoImagen.classList.add('img-fluid');
            miNodoImagen.setAttribute('src', info.imagen); // Imagen del producto
            
            const miNodoPrecio = document.createElement('p');
            miNodoPrecio.classList.add('card-text');
            miNodoPrecio.textContent = `${info.precio}${divisa}`; // Precio del producto
            
            const miNodoBoton = document.createElement('button');
            miNodoBoton.classList.add('btn', 'btn-primary');
            miNodoBoton.textContent = 'Agregar'; // Botón para agregar al carrito
            miNodoBoton.setAttribute('marcador', info.id); // Asocia el ID del producto al botón
            miNodoBoton.addEventListener('click', anadirProductoAlCarrito);

            // Ensambla la tarjeta del producto
            miNodoCardBody.appendChild(miNodoImagen);
            miNodoCardBody.appendChild(miNodoTitle);
            miNodoCardBody.appendChild(miNodoPrecio);
            miNodoCardBody.appendChild(miNodoBoton);
            miNodo.appendChild(miNodoCardBody);
            DOMitems.appendChild(miNodo); // Agrega la tarjeta al DOM
        });
    }

    // Incrementa y muestra el contador de visitas usando localStorage
    let visitas = localStorage.getItem('contadorVisitas');
    if (!visitas) visitas = 0; // Si no existe, inicializa a 0
    visitas++;
    localStorage.setItem('contadorVisitas', visitas); // Actualiza el contador en localStorage
    document.getElementById('contador').textContent = visitas; // Muestra el contador

    // Añade un producto al carrito
    function anadirProductoAlCarrito(evento) {
        carrito.push(evento.target.getAttribute('marcador')); // Obtiene el ID del producto
        renderizarCarrito(); // Actualiza la visualización del carrito
        guardarCarritoEnLocalStorage(); // Guarda el carrito en localStorage
        handleCarritoValue(carrito.length); // Actualiza el contador del carrito
    }

    // Actualiza el contador visual del carrito
    function handleCarritoValue(value) {
        const carritoContainer = document.getElementById("carrito-value");
        carritoContainer.textContent = `${value}`;
    }

    // Renderiza el carrito en el DOM
    function renderizarCarrito() {
        DOMcarrito.textContent = ''; // Limpia el contenido previo
        const carritoSinDuplicados = [...new Set(carrito)]; // Elimina productos duplicados

        carritoSinDuplicados.forEach((item) => {
            const miItem = baseDeDatos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });

            const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                return itemId === item ? total += 1 : total;
            }, 0);

            const miNodo = document.createElement('li');
            miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
            miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${miItem[0].precio}${divisa}`;
            
            const miBoton = document.createElement('button');
            miBoton.classList.add('btn', 'btn-danger', 'mx-5');
            miBoton.textContent = 'X'; // Botón para eliminar un producto
            miBoton.style.marginLeft = '1rem';
            miBoton.dataset.item = item;
            miBoton.addEventListener('click', borrarItemCarrito);
            
            miNodo.appendChild(miBoton); // Añade el botón al nodo
            DOMcarrito.appendChild(miNodo); // Añade el nodo al DOM
        });
        DOMtotal.textContent = calcularTotal(); // Calcula y muestra el total
    }

    // Elimina un producto del carrito
    function borrarItemCarrito(evento) {
        const id = evento.target.dataset.item; // ID del producto a eliminar
        carrito = carrito.filter((carritoId) => carritoId !== id); // Filtra el carrito
        renderizarCarrito(); // Actualiza el carrito
        guardarCarritoEnLocalStorage(); // Guarda los cambios
        handleCarritoValue(carrito.length); // Actualiza el contador del carrito
    }

    // Calcula el total del carrito
    function calcularTotal() {
        return carrito.reduce((total, item) => {
            const miItem = baseDeDatos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });
            return total + miItem[0].precio;
        }, 0).toFixed(2); // Redondea a 2 decimales
    }

    // Vacía el carrito
    function vaciarCarrito() {
        carrito = []; // Reinicia el carrito
        renderizarCarrito(); // Actualiza el DOM
        localStorage.clear(); // Limpia el localStorage
    }

    // Guarda el carrito en localStorage
    function guardarCarritoEnLocalStorage() {
        miLocalStorage.setItem('carrito', JSON.stringify(carrito));
    }

    // Carga el carrito desde localStorage
    function cargarCarritoDeLocalStorage() {
        if (miLocalStorage.getItem('carrito') !== null) {
            carrito = JSON.parse(miLocalStorage.getItem('carrito'));
            handleCarritoValue(carrito.length); // Actualiza el contador visual
        }
    }

    // Eventos
    DOMbotonVaciar.addEventListener('click', vaciarCarrito); // Vacia el carrito al hacer clic
    filtroSelect.addEventListener('change', renderizarProductos); // Filtra productos

    // Inicialización
    cargarCarritoDeLocalStorage(); // Carga el carrito guardado
    renderizarProductos(); // Muestra los productos
    renderizarCarrito(); // Muestra el carrito
});
