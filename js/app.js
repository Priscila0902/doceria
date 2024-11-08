import { MENU } from "./dados.js"

let cart = JSON.parse(localStorage.getItem('cart')) || {}; // Carrega o carrinho do localStorage
let cartItemCount = Object.values(cart).reduce((total, item) => total + item.quantity, 0); // Contagem inicial de itens no carrinho

// Função para inicializar a aplicação
const initApp = () => {
  carregaItensMenu("cakes");  // coloca a categoria de bolos como padrão de carregamento 
  addEventosMenu();
  atualizaContagemCarrinho();
}

// Função para carregar os itens do menu
const carregaItensMenu = (categoria, mostreTudo = false) => {
  const container = document.getElementById("itensCardapio");
  container.innerHTML = "";

  const items = MENU[categoria];
  const limite = 8; // Limite de itens visíveis inicialmente

  // Exibe itens de acordo com o estado (mostrar tudo ou apenas o que está configurado em 'limite')
  const itensVisiveis = mostreTudo ? items : items.slice(0, limite);
  itensVisiveis.forEach((item) => {
    const itemElement = criaMenuItem(item);
    container.appendChild(itemElement);
  });

  // Verifica se há mais itens que o configurado em 'limite'e adiciona botão "Ver mais" ou "Ver menos"
  if (items.length > limite) {
    const toggleButton = document.createElement("button");
    toggleButton.innerText = mostreTudo ? "Ver menos" : "Ver mais";
    toggleButton.classList.add("btn-pink", "view-toggle-btn");
    toggleButton.style.display = "block";
    toggleButton.style.margin = "20px auto";
    toggleButton.addEventListener("click", () => carregaItensMenu(categoria, !mostreTudo));
    container.appendChild(toggleButton);
  }
}

// Função para criar um elemento de menu
const criaMenuItem = (item) => {
  const div = document.createElement("div");
  div.classList.add("col-3");

  div.innerHTML = `
    <div class="card card-item">
      <div class="img-produto">
        <img src="${item.img}" alt="${item.dsc}">
      </div>
      <h5 class="title-produto text-center mt-4"><b>${item.name}</b></h5>
      <p class="price-produto text-center"><b>R$ ${item.price.toFixed(2)}</b></p>
      <p class="dsc-produto text-center"><b>${item.dsc}</b></p>
      <div class="add-carrinho">
        <span class="btn-menos"><i class="ph ph-minus"></i></span>
        <span class="add-numero-itens" id="qntd-${item.id}">0</span>
        <span class="btn-mais"><i class="ph ph-plus"></i></span>
        <span class="btn btn-add"><i class="ph ph-shopping-cart"></i></span>
      </div>
    </div>
  `;

  div.querySelector(".btn-menos").addEventListener("click", () => diminuiQuantidade(item.id));
  div.querySelector(".btn-mais").addEventListener("click", () => aumentaQuantidade(item.id));
  div.querySelector(".btn-add").addEventListener("click", () => adicionarAoCarrinho(item));

  return div;
}

// Função para adicionar eventos aos botões de menu
const addEventosMenu = () => {
  const menuLinks = document.querySelectorAll(".container-menu a");
  menuLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const categoria = event.target.querySelector("h5").innerText.toLowerCase();
      carregaItensMenu(categoria);
      atualizaMenuAtivo(categoria);
    });
  });
}

// Função para atualizar o menu ativo visualmente
const atualizaMenuAtivo = (categoria) => {
  const menuLinks = document.querySelectorAll(".container-menu a");
  menuLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.querySelector("h5").innerText.toLowerCase() === categoria) {
      link.classList.add("active");
    }
  });
}

// Função para aumentar a quantidade de itens
const aumentaQuantidade = (itemId) => {
  const quantityElement = document.getElementById(`qntd-${itemId}`);
  let quantity = parseInt(quantityElement.innerText);
  quantityElement.innerText = quantity + 1;
}

// Função para diminuir a quantidade de itens
const diminuiQuantidade = (itemId) => {
  const quantityElement = document.getElementById(`qntd-${itemId}`);
  let quantity = parseInt(quantityElement.innerText);
  if (quantity > 0) {
    quantityElement.innerText = quantity - 1;
  }
}

// Função para adicionar um item ao carrinho
const adicionarAoCarrinho = (item) => {
    const quantityElement = document.getElementById(`qntd-${item.id}`);
    const quantity = parseInt(quantityElement.innerText);
  
    if (quantity > 0) {
      if (cart[item.id]) {
        cart[item.id].quantity += quantity;
      } else {
        cart[item.id] = { ...item, quantity };
      }
  
      cartItemCount += quantity;
      atualizaCarrinho();
      atualizaContagemCarrinho();
      // mostreMensagem(`Adicionado ${quantity} ${item.name}(s) ao carrinho.`);
      quantityElement.innerText = 0; // Resetar quantidade no menu após adicionar ao carrinho
    } else {
      // mostreMensagem("Por favor, selecione uma quantidade para adicionar ao carrinho.");
    }
  }

// Função para atualizar o carrinho de compras
const atualizaCarrinho = () => {
    const cartItemsContainer = document.getElementById("cart-items");
    cartItemsContainer.innerHTML = ""; // Limpa os itens anteriores no contêiner do carrinho
    
    let total = 0;
    Object.values(cart).forEach((cartItem) => {
      const itemTotal = cartItem.price * cartItem.quantity;
      total += itemTotal;
  
      const cartElement = document.createElement("div");
      cartElement.classList.add("cart-item");
      cartElement.innerHTML = `
        <span>${cartItem.name} x ${cartItem.quantity}</span>
        <span>R$ ${itemTotal.toFixed(2)}</span>
        <button class="btn-remove" onclick="removeItemCarrinho('${cartItem.id}')">Remover</button>
      `;
      cartItemsContainer.appendChild(cartElement);
    });
  
    // Atualizar o total do carrinho no HTML
    document.getElementById("cart-total").innerText = `R$ ${total.toFixed(2)}`;

    // Salva o carrinho no localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
  }

// Função para atualizar a exibição da contagem de itens no botão do carrinho
const atualizaContagemCarrinho = () => {
  const cartCountElement = document.getElementById("cart-count");
  cartCountElement.innerText = cartItemCount;
}

// Função para alternar a visibilidade do dropdown do carrinho
const toggleCarrinhoDropdown = () => {
  const cartDropdown = document.getElementById("cart-dropdown");
  cartDropdown.style.display = cartDropdown.style.display === "none" ? "block" : "none";
}

// Função para alternar a visibilidade do carrinho
const toggleCarrinhoVisao = () => {
  const cartContainer = document.getElementById("cart-modal");
  cartContainer.style.display = cartContainer.style.display === "none" ? "block" : "none";
}

// Função para remover um item do carrinho e atualizar a contagem
const removeItemCarrinho = (itemId) => {
  if (cart[itemId]) {
    cartItemCount -= cart[itemId].quantity; // Diminui a quantidade removida do total
    delete cart[itemId];
    atualizaCarrinho();
    atualizaContagemCarrinho();
    // mostreMensagem("Item removido do carrinho.");
  }
}
  
// Função para exibir mensagens de notificação
// const mostreMensagem = (mensagem) => {
//   const messageContainer = document.getElementById("mensagem");
//   messageContainer.innerText = mensagem;
//   messageContainer.classList.add("visible");

//   setTimeout(() => {
//     messageContainer.classList.remove("visible");
//   }, 1000);
// }

// Função para redirecionar para a página de checkout
const irParaCheckout = () => {
  window.location.href = "/checkout.html"; // Redireciona para a página de checkout
}

// Fechar o dropdown se clicar fora dele
window.addEventListener("click", function(event) {
  const cartDropdown = document.getElementById("cart-dropdown");
  const cartButton = document.querySelector(".btn-icon");
  if (!cartDropdown.contains(event.target) && !cartButton.contains(event.target)) {
    cartDropdown.style.display = "none";
  }
});

// Por ser carregado como um módulo, é necessário tornar funções acessíveis globalmente
window.toggleCarrinhoDropdown = toggleCarrinhoDropdown;
window.removeItemCarrinho = removeItemCarrinho;
window.irParaCheckout = irParaCheckout;
window.toggleCarrinhoVisao = toggleCarrinhoVisao;

document.addEventListener("DOMContentLoaded", initApp);