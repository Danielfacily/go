form.addEventListener('submit', function (e) {
    e.preventDefault(); // Impede envio padrão

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const deliveryType = document.getElementById('deliveryType').value;
    const pickupCode = document.getElementById('pickupCode').value.trim();

    let message = `*Pedido Frango na Brasa*\n\n`;
    message += `*Cliente:* ${name}\n`;
    message += `*Telefone:* ${phone}\n`;
    message += `*Retirada:* ${deliveryType}\n`;
    if (pickupCode && deliveryType.includes("Aplicativo")) {
      message += `*Código de Coleta:* ${pickupCode}\n`;
    }

    message += `\n*Itens:* \n`;

    let total = 0;

    for (let name in prices) {
      const input = form.elements[name];
      if (input && parseFloat(input.value) > 0) {
        const quantity = parseFloat(input.value);
        const price = prices[name];
        const itemTotal = quantity * price;
        total += itemTotal;

        let label = document.querySelector(`[name="${name}"]`).parentElement.querySelector('label').innerText;
        message += `- ${label}: ${quantity} x R$${price} = R$${itemTotal.toFixed(2)}\n`;
      }
    }

    message += `\n*Total estimado:* R$ ${total.toFixed(2)}`;

    // Monta URL do WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = '5511970565356'; // Altere para o número oficial do restaurante
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappURL, '_blank');
  });

