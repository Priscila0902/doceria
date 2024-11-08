// Função para carregar os itens do carrinho na página de checkout
const carregaItemsPagamento = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || {}; // Recupera o carrinho do localStorage
    const checkoutItemsContainer = document.getElementById("checkout-items");
    let total = 0;
  
    checkoutItemsContainer.innerHTML = ""; // Limpa o contêiner de itens do checkout
  
    // Itera sobre os itens do carrinho e os exibe na página
    Object.values(cart).forEach(cartItem => {
      const itemTotal = cartItem.price * cartItem.quantity;
      total += itemTotal;
  
      const itemElement = document.createElement("div");
      itemElement.classList.add("checkout-item");
      itemElement.innerHTML = 
      `
        <div class="d-flex justify-content-between">
          <span>${cartItem.name} x ${cartItem.quantity}</span>
          <span>R$ ${itemTotal.toFixed(2)}</span>
        </div>
      `;
      checkoutItemsContainer.appendChild(itemElement);
    });
  
    // Atualiza o total da compra
    document.getElementById("checkout-total").innerText = `R$ ${total.toFixed(2)}`;
  }
  
  // Função para finalizar a compra
  const finalizaCompra = () => {
    alert("Compra finalizada com sucesso!"); // Exibe alerta na tela
    localStorage.removeItem('cart'); // Limpa o carrinho após a compra
    window.location.href = "/"; // Redireciona para a página inicial
  }
  
  // Carregar os itens do carrinho ao carregar a página
  document.addEventListener("DOMContentLoaded", carregaItemsPagamento);