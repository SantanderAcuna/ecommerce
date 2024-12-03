document.addEventListener('DOMContentLoaded', () => {
      // Base de datos de productos
      const baseDeDatos = [
          {
              id: 1,
              nombre: 'Sombrero Voltia, hecho a mano, 23 vueltas',
              precio: 250000,
              imagen: 'Assets/img/imagen1.jpg'
          },
          {
              id: 2,
              nombre: 'Sombrero Voltia',
              precio: 15000,
              imagen: 'Assets/img/imagen 2.jpg'
          },
          {
              id: 3,
              nombre: 'Mochilas Wayuu',
              precio: 15000,
              imagen: 'Assets/img/imagen 3.jpg'
          }
      ];

      // Variables
      let carrito = [];
      const divisa = '$';
      const DOMitems = document.querySelector('#items');
      const DOMcarrito = document.querySelector('#carrito');
      const DOMtotal = document.querySelector('#total');

  // Función para renderizar productos
  function renderizarProductos() {
            baseDeDatos.forEach((info) => {
                // Estructura
                const miNodo = document.createElement('div');
                miNodo.classList.add('card', 'col-sm-4');

                // Body
                const miNodoCardBody = document.createElement('div');
                miNodoCardBody.classList.add('card-body');

                // Título
                const miNodoTitle = document.createElement('h6');
                miNodoTitle.classList.add('card-title');
                miNodoTitle.textContent = info.nombre;

                // Imagen
                const miNodoImagen = document.createElement('img');
                miNodoImagen.classList.add('img-fluid');
                miNodoImagen.setAttribute('src', info.imagen);

                // Precio
                const miNodoPrecio = document.createElement('p');
                miNodoPrecio.classList.add('card-text');
                miNodoPrecio.textContent = `${divisa}${info.precio}`;

                // Botón
                const miNodoBoton = document.createElement('button');
                miNodoBoton.classList.add('btn', 'btn-primary');
                miNodoBoton.textContent = 'Agregar';
                miNodoBoton.setAttribute('marcador', info.id);
                miNodoBoton.addEventListener('click', anadirProductoAlCarrito);
                // Insertamos
                miNodoCardBody.appendChild(miNodoImagen);
                miNodoCardBody.appendChild(miNodoTitle);
                miNodoCardBody.appendChild(miNodoPrecio);
                miNodoCardBody.appendChild(miNodoBoton);
                miNodo.appendChild(miNodoCardBody);
                DOMitems.appendChild(miNodo);
            });
        }
 // Función para añadir producto al carrito
 function anadirProductoAlCarrito(evento) {
            carrito.push(evento.target.getAttribute('marcador'));
            renderizadoCarrito();
            handleCarritoValue(carrito.length); // Corrección: "length" en lugar de "lenght"
        }

        // Función para manejar el valor del carrito
        function handleCarritoValue(value) {
            const carritoContainer = document.getElementById("carrito-value");
            carritoContainer.textContent = `${value}`;
        }

        // Función para renderizar el carrito
        function renderizadoCarrito() {
            DOMcarrito.textContent = '';
            const carritoSinDuplicados = [...new Set(carrito)];
            carritoSinDuplicados.forEach((item) => {
                const miItem = baseDeDatos.filter((itemBaseDatos) => {
                    return itemBaseDatos.id === parseInt(item);
                });
                const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                    return itemId === item ? total += 1 : total;
                }, 0);

                // Nodo del carrito
                const miNodo = document.createElement('li');
                miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
                miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${divisa}${miItem[0].precio}`;
  // Botón de borrar
  const miBoton = document.createElement('button');
                miBoton.classList.add('btn', 'btn-danger', 'mx-5');
                miBoton.textContent = 'X';
                miBoton.style.marginLeft = '1rem';
                miBoton.dataset.item = item;
                miBoton.addEventListener('click', borrarItemCarrito);

                // Mezclamos nodos
                miNodo.appendChild(miBoton);
                DOMcarrito.appendChild(miNodo);
            });
        }

        // Función para borrar un item del carrito
        function borrarItemCarrito(evento) {
            const id = evento.target.dataset.item;
            carrito = carrito.filter((itemId) => itemId !== id);
            renderizadoCarrito();
            handleCarritoValue(carrito.length);
        }

        // Inicializar
        renderizarProductos();
    });
