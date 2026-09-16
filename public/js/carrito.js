// 1. Agregar un artículo
function agregarAlCarrito(id, nombre, precio, imagen) {
    let carrito = JSON.parse(localStorage.getItem('xspot_carrito')) || [];
    
    let existente = carrito.find(item => item.id === id);
    if (existente) {
        existente.cantidad += 1;
    } else {
        carrito.push({ id, nombre, precio, imagen, cantidad: 1 });
    }
    
    localStorage.setItem('xspot_carrito', JSON.stringify(carrito));
    
    alert(`¡${nombre} se agregó a tu lista!`);
}

// 2. Enviar el pedido por WhatsApp
function enviarPorWhatsApp() {
    let carrito = JSON.parse(localStorage.getItem('xspot_carrito')) || [];
    
    if (carrito.length === 0) {
        alert('Tu lista está vacía. ¡Ve a agregar algo del catálogo!');
        return;
    }
    
    let telefono = "525500000000"; 
    
    let texto = "¡Hola! Me gustaría iniciar un pedido en XSPOT con lo siguiente:%0A%0A";
    let total = 0;
    
    carrito.forEach(item => {
        texto += `🛒 ${item.cantidad}x ${item.nombre} ($${item.precio} c/u)%0A`;
        total += (parseFloat(item.precio) * item.cantidad);
    });
    
    texto += `%0A*Total estimado: $${total.toFixed(2)} MXN*%0A%0A¿Me confirmas disponibilidad y los pasos para el pago?`;
    
    window.open(`https://wa.me/${telefono}?text=${texto}`, '_blank');
    
    localStorage.removeItem('xspot_carrito'); 
}

function prepararCarrito(id, nombre, precio, imagen) {
    let cantidadInput = document.getElementById('cantidadProducto').value;
    let versionInput = document.getElementById('versionElegida').value;
    
    let cantidad = parseInt(cantidadInput);
    
    if (cantidad < 1 || isNaN(cantidad)) {
        alert("Por favor elige una cantidad válida.");
        return;
    }

    let nombreConVersion = versionInput !== 'Estándar' ? `${nombre} (${versionInput})` : nombre;

    agregarAlCarrito(id, nombreConVersion, precio, imagen, cantidad);
}

function agregarAlCarrito(id, nombre, precio, imagen, cantidad) {
    let carrito = JSON.parse(localStorage.getItem('xspot_carrito')) || [];
    
    let existente = carrito.find(item => item.id === id && item.nombre === nombre);
    
    if (existente) {
        existente.cantidad += cantidad;
    } else {
        carrito.push({ id, nombre, precio, imagen, cantidad: cantidad });
    }
    
    localStorage.setItem('xspot_carrito', JSON.stringify(carrito));
    
    alert(`¡Se agregaron ${cantidad}x ${nombre} a tu lista!`);
}