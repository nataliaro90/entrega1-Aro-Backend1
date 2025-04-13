const ProductManager = require('./ProductManager');
const CartManager = require('./CartManager');

const pm = new ProductManager();
const cm = new CartManager();

const test = async () => {
  try {
    console.log("🟢 Backend funcionando correctamente");

    // Agregando productos
    console.log("\n🔹 Agregando productos...");
    const prod1 = await pm.addProduct({ title: 'Mouse', description: 'Mouse óptico', price: 1500, stock: 10 });
    const prod2 = await pm.addProduct({ title: 'Teclado', description: 'Teclado mecánico', price: 3000, stock: 5 });

    console.log("✅ Productos agregados:", await pm.getProducts());

    // Creando un carrito
    console.log("\n🔹 Creando un carrito...");
    const cart = await cm.createCart();
    console.log("✅ Carrito creado con ID:", cart.id);

    // Agregando productos al carrito
    console.log("\n🔹 Agregando productos al carrito...");
    await cm.addProductToCart(cart.id, prod1.id);
    await cm.addProductToCart(cart.id, prod2.id);
    await cm.addProductToCart(cart.id, prod1.id); // Agrega el mismo producto de nuevo

    // Mostrando el contenido del carrito
    const result = await cm.getCartById(cart.id);
    console.log("\n🛒 Contenido final del carrito:");
    console.dir(result, { depth: null });

  } catch (err) {
    console.error("❌ Error en la ejecución:", err.message);
  }
};

test();
