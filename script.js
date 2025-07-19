document.addEventListener('DOMContentLoaded', function() {
  // Carrinho de compras
  const cart = {
    items: [],
    addItem: function(item) {
      const existingItem = this.items.find(i => i.name === item.name);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        this.items.push(item);
      }
      this.updateUI();
    },
    removeItem: function(itemName) {
      this.items = this.items.filter(item => item.name !== itemName);
      this.updateUI();
    },
    clearCart: function() {
      this.items = [];
      this.updateUI();
    },
    updateUI: function() {
      const cartItems = document.getElementById('cart-items');
      const cartTotal = document.getElementById('cart-total');
      const cartCounter = document.getElementById('cart-counter');
      
      // Atualiza itens
      if (this.items.length === 0) {
        cartItems.innerHTML = `
          <div class="empty-cart">
            <i class="fas fa-shopping-cart"></i>
            <p>Seu carrinho está vazio</p>
            <p>Adicione itens ao seu pedido</p>
          </div>
        `;
      } else {
        cartItems.innerHTML = this.items.map(item => `
          <div class="cart-item">
            <div class="cart-item-info">
              <h4>${item.name}</h4>
              <p>${item.quantity} ${item.unit} × R$ ${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-price">R$ ${(item.quantity * item.price).toFixed(2)}</div>
          </div>
        `).join('');
      }
      
      // Atualiza total
      const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      cartTotal.textContent = `R$ ${total.toFixed(2)}`;
      
      // Atualiza contador
      const itemCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
      cartCounter.textContent = itemCount;
    }
  };

  // Controle do carrinho
  const cartBtn = document.getElementById('cart-btn');
  const cartSidebar = document.getElementById('cart-sidebar');
  const closeCart = document.getElementById('close-cart');
  const overlay = document.getElementById('overlay');

  cartBtn.addEventListener('click', () => {
    cartSidebar.classList.add('active');
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
  });

  closeCart.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    overlay.style.display = 'none';
    document.body.style.overflow = 'auto';
  });
  
  overlay.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    overlay.style.display = 'none';
    document.body.style.overflow = 'auto';
  });

  // Adiciona eventos aos inputs
  document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('change', function() {
      const value = parseFloat(this.value);
      if (value > 0) {
        const item = {
          name: this.dataset.name,
          price: parseFloat(this.dataset.price),
          quantity: parseFloat(this.value),
          unit: this.dataset.unit
        };
        cart.addItem(item);
      } else if (value === 0) {
        // Remove o item se a quantidade for zero
        cart.removeItem(this.dataset.name);
      }
    });
  });

  // Envio do formulário
  document.getElementById('orderForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validação
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    
    if (!name) {
      alert('Por favor, preencha seu nome!');
      return;
    }
    
    if (!phone) {
      alert('Por favor, preencha seu telefone!');
      return;
    }
    
    if (cart.items.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }
    
    // Formata mensagem para WhatsApp
    let message = `*PEDIDO - FRANGO NA BRASA*%0A%0A`;
    message += `*Cliente:* ${name}%0A`;
    message += `*Telefone:* ${phone}%0A%0A`;
    message += `*ITENS:*%0A`;
    
    cart.items.forEach(item => {
      message += `- ${item.name} (${item.quantity} ${item.unit}) - R$ ${(item.price * item.quantity).toFixed(2)}%0A`;
    });
    
    const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `%0A*TOTAL: R$ ${total.toFixed(2)}*`;
    
    // Abre WhatsApp
    const whatsappURL = `https://wa.me/5511970565356?text=${message}`;
    window.open(whatsappURL, '_blank');
    
    // Limpa carrinho após envio
    cart.clearCart();
    
    // Reseta formulário
    document.querySelectorAll('input[type="number"]').forEach(input => {
      input.value = '';
      document.getElementById(`${input.name}_preview`).textContent = 'R$ 0,00';
    });
    
    document.getElementById('name').value = '';
    document.getElementById('phone').value = '';
  });
  
  // Botão de checkout do carrinho
  document.getElementById('checkout-btn').addEventListener('click', function() {
    document.getElementById('orderForm').dispatchEvent(new Event('submit'));
  });
  
  // Atualização em tempo real dos valores
  document.querySelectorAll('input[type="number"]').forEach(input => {
    const updatePreview = () => {
      const price = parseFloat(input.dataset.price);
      const quantity = parseFloat(input.value) || 0;
      const previewElement = document.getElementById(`${input.name}_preview`);
      if (previewElement) {
        previewElement.textContent = `R$ ${(price * quantity).toFixed(2)}`;
      }
    };
    
    input.addEventListener('input', updatePreview);
    updatePreview(); // Inicializa os valores
  });
  
  // Máscara para telefone
  const phoneInput = document.getElementById('phone');
  phoneInput.addEventListener('input', function() {
    let value = this.value.replace(/\D/g, '');
    if (value.length > 11) value = value.substring(0, 11);
    
    if (value.length > 2) {
      value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
    }
    if (value.length > 10) {
      value = `${value.substring(0, 10)}-${value.substring(10)}`;
    }
    
    this.value = value;
  });
});
