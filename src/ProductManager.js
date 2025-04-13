const fs = require('fs/promises');
const path = require('path');

class ProductManager {
  constructor() {
    this.path = path.join(__dirname, '../data/products.json');
  }

  // Asegura que el archivo exista
  async ensureFileExists() {
    try {
      await fs.access(this.path);
    } catch {
      await fs.writeFile(this.path, '[]');
    }
  }

  // Obtener todos los productos
  async getProducts() {
    await this.ensureFileExists();
    const data = await fs.readFile(this.path, 'utf-8');
    return JSON.parse(data);
  }

  // Obtener producto por ID
  async getProductById(pid) {
    const products = await this.getProducts();
    return products.find(p => p.id === pid);
  }

  // Agregar producto con validación de campos y autogeneración de ID
  async addProduct(obj) {
    const requiredFields = ['title', 'description', 'price', 'stock'];
    for (const field of requiredFields) {
      if (!obj[field]) {
        throw new Error(`Campo obligatorio faltante: ${field}`);
      }
    }

    const products = await this.getProducts();
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const newProduct = { id: newId, ...obj };

    products.push(newProduct);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return newProduct;
  }

  // Actualizar producto sin modificar el ID
  async updateProduct(pid, updateFields) {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === pid);
    if (index === -1) return null;

    products[index] = { ...products[index], ...updateFields, id: pid };
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return products[index];
  }

  // Eliminar producto y devolver si se eliminó o no
  async deleteProduct(pid) {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === pid);
    if (index === -1) return false;

    products.splice(index, 1);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return true;
  }
}

module.exports = ProductManager;
