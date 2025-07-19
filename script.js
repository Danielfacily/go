document.addEventListener('DOMContentLoaded', function () {
  const cartBtn = document.getElementById('cart-btn');
  const closeCart = document.getElementById('close-cart');
  const orderForm = document.getElementById('orderForm');

  if (!cartBtn || !closeCart || !orderForm) {
    console.warn('Alguns elementos obrigatórios não foram encontrados no DOM.');
    return;
  }

  const cart = {
    items: [],
    addItem: function (item) {
      const existingItem = this.items.find(i => i.name === item.name);
      if (existingItem) {
        existingItem.quantity = item.quantity;
      } else {
        this.items.push(item);
      }
      this.updateUI();
    },
    updateUI: function () {
      const cartItems = document.getElementById('cart-items');
      const cartTotal = document.getElementById('cart-total');
      const cartCounter = document.getElementById('cart-counter');

      if (!cartItems || !cartTotal || !cartCounter) return;

      cartItems.innerHTML = this.items.map(item => `
        <div class="cart-item">
          <div>
            <h4>${item.name}</h4>
            <p>${item.quantity} ${item.unit} × R$ ${item.price.toFixed(2)}</p>
          </div>
          <span>R$ ${(item.quantity * item.price).toFixed(2)}</span>
        </div>
      `).join('');

      const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      cartTotal.textContent = `R$ ${total.toFixed(2)}`;
      cartCounter.textContent = this.items.reduce((sum, item) => sum + item.quantity, 0);
    }
  };

  document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', function () {
      const quantity = parseFloat(this.value) || 0;
      const item = {
        name: this.name,
        price: parseFloat(this.dataset.price),
        quantity: quantity,
        unit: this.dataset.unit
      };
      const preview = document.getElementById(`${this.name}_preview`);
      if (preview) preview.textContent = `R$ ${(item.price * quantity).toFixed(2)}`;
      cart.addItem(item);
    });
  });

  cartBtn.addEventListener('click', () => {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('overlay');
    if (sidebar) sidebar.classList.add('active');
    if (overlay) overlay.style.display = 'block';
  });

  closeCart.addEventListener('click', () => {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('overlay');
    if (sidebar) sidebar.classList.remove('active');
    if (overlay) overlay.style.display = 'none';
  });

  orderForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();

    if (!name || !phone) {
      alert('Por favor, preencha seu nome e telefone!');
      return;
    }

    if (cart.items.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }

    let message = `*PEDIDO - FRANGO NA BRASA*%0A%0A`;
    message += `*Cliente:* ${name}%0A`;
    message += `*Telefone:* ${phone}%0A%0A`;
    message += `*ITENS:*%0A`;
    cart.items.forEach(item => {
      message += `- ${item.name} (${item.quantity} ${item.unit}) - R$ ${(item.price * item.quantity).toFixed(2)}%0A`;
    });
    message += `%0A*TOTAL: R$ ${cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}*`;

    const whatsappURL = `https://wa.me/5511970565356?text=${message}`;
    window.open(whatsappURL, '_blank');
  });
});
