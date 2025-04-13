const fs = require('fs/promises');
const path = require('path');

class CartManager {
  constructor() {
    this.path = path.join(__dirname, '../data/carts.json');
  }

  // Asegura que el archivo exista
  async ensureFileExists() {
    try {
      await fs.access(this.path);
    } catch {
      await fs.writeFile(this.path, '[]');
    }
  }

  // Obtener todos los carritos
  async getCarts() {
    await this.ensureFileExists();
    const data = await fs.readFile(this.path, 'utf-8');
    return JSON.parse(data);
  }

  // Crear un nuevo carrito con ID autoincremental
  async createCart() {
    const carts = await this.getCarts();
    const newId = carts.length > 0 ? Math.max(...carts.map(c => c.id)) + 1 : 1;
    const newCart = { id: newId, products: [] };

    carts.push(newCart);
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    return newCart;
  }

  // Obtener carrito por ID
  async getCartById(cid) {
    const carts = await this.getCarts();
    return carts.find(c => c.id === cid);
  }

  // Agregar producto al carrito, o incrementar cantidad si ya existe
  async addProductToCart(cid, pid) {
    const carts = await this.getCarts();
    const cart = carts.find(c => c.id === cid);
    if (!cart) return null;

    const existingProduct = cart.products.find(p => p.product === pid);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    return cart;
  }
}

module.exports = CartManager;

