function toggleSection(header) {
  const section = header.nextElementSibling;
  section.style.display = section.style.display === "none" ? "block" : "none";
}

document.getElementById("orderForm").addEventListener("input", updateCart);

function updateCart() {
  const prices = {
    costelaBovina: 70,
    costelaSuina: 60,
    linguica: 50,
    frango: 50,
    batata: 10,
    farofa: 10,
    maionese: 10,
    mouse: 15,
    pudim: 15,
    manjar: 15,
    coca2l: 13,
    refri2l: 10,
    latinhas: 5,
    heineken: 5,
    original: 5
  };

  let total = 0;
  let summary = "<h3>Carrinho:</h3><ul>";

  Object.keys(prices).forEach(key => {
    const input = document.querySelector(`[name=${key}]`);
    let value;

    if (input?.type === "number") {
      value = parseFloat(input.value) || 0;
    } else if (input?.type === "checkbox") {
      value = input.checked ? 1 : 0;
    }

    if (value > 0) {
      const label = input.parentElement.innerText;
      const subtotal = prices[key] * value;
      total += subtotal;
      summary += `<li>${label} - ${value} x R$ ${prices[key]} = R$ ${subtotal.toFixed(2)}</li>`;
    }
  });

  summary += `</ul><strong>Total estimado: R$ ${total.toFixed(2)}</strong>`;
  document.getElementById("cart").innerHTML = summary;
}

document.getElementById("orderForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const delivery = document.getElementById("deliveryType").value;
  const code = document.getElementById("pickupCode").value;
  const summary = document.getElementById("cart").innerText;

  const msg = `Olá, meu nome é ${name} (%2B${phone}).\n\nMeu pedido:\n${summary}\n\nForma de retirada: ${delivery}${code ? `\nCódigo de coleta: ${code}` : ""}`;
  const encoded = encodeURIComponent(msg);
  window.open(`https://wa.me/55${phone}?text=${encoded}`);
});
