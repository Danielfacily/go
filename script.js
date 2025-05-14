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
      updateUI: function() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const cartCounter = document.getElementById('cart-counter');
        
        // Atualiza itens
        cartItems.innerHTML = this.items.map(item => `
          <div class="cart-item">
            <div>
              <h4>${item.name}</h4>
              <p>${item.quantity} ${item.unit} × R$ ${item.price.toFixed(2)}</p>
            </div>
            <span>R$ ${(item.quantity * item.price).toFixed(2)}</span>
          </div>
        `).join('');
        
        // Atualiza total
        const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `R$ ${total.toFixed(2)}`;
        
        // Atualiza contador
        cartCounter.textContent = this.items.reduce((sum, item) => sum + item.quantity, 0);
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
    });
  
    closeCart.addEventListener('click', () => {
      cartSidebar.classList.remove('active');
      overlay.style.display = 'none';
    });
  
    // Adiciona eventos aos inputs
    document.querySelectorAll('input[type="number"]').forEach(input => {
      input.addEventListener('change', function() {
        if (this.value > 0) {
          const item = {
            name: this.dataset.name,
            price: parseFloat(this.dataset.price),
            quantity: parseFloat(this.value),
            unit: this.dataset.unit
          };
          cart.addItem(item);
        }
      });
    });
  
    // Envio do formulário
    document.getElementById('orderForm').addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Validação
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
      
      // Formata mensagem para WhatsApp
      let message = `*PEDIDO - FRANGO NA BRASA*%0A%0A`;
      message += `*Cliente:* ${name}%0A`;
      message += `*Telefone:* ${phone}%0A%0A`;
      message += `*ITENS:*%0A`;
      
      cart.items.forEach(item => {
        message += `- ${item.name} (${item.quantity} ${item.unit}) - R$ ${(item.price * item.quantity).toFixed(2)}%0A`;
      });
      
      message += `%0A*TOTAL: R$ ${cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}*`;
      
      // Abre WhatsApp
      const whatsappURL = `https://wa.me/5511970565356?text=${message}`;
      window.open(whatsappURL, '_blank');
    });
  });

