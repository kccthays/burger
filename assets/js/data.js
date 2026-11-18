/* Ofício — dados do site.
   ATENÇÃO: hamburgueria fictícia. Todos os dados abaixo (telefone, WhatsApp,
   endereço, Instagram, preços) são PROVISÓRIOS e devem ser trocados pelos reais. */

window.OFICIO = {
  config: {
    // Número no formato internacional, só dígitos (55 + DDD + número). PROVISÓRIO.
    whatsapp: '5511900000000',
    telefone: '(11) 90000-0000',
    email: 'ola@oficio.burger',
    instagram: 'oficio.burger',
    endereco: 'Rua das Brasas, 180',
    bairro: 'Vila Fictícia — São Paulo',
    // 0 = domingo … 6 = sábado. null = fechado. Horas em formato 24h; 24 = meia-noite.
    horarios: {
      0: [12, 22],
      1: null,
      2: [18, 23],
      3: [18, 23],
      4: [18, 23],
      5: [18, 24],
      6: [12, 24]
    }
  },

  categorias: [
    { id: 'burgers', nome: 'Burgers' },
    { id: 'acompanhamentos', nome: 'Acompanhamentos' },
    { id: 'bebidas', nome: 'Bebidas' },
    { id: 'sobremesas', nome: 'Sobremesas' }
  ],

  itens: [
    // Burgers
    { id: 'classico', cat: 'burgers', nome: 'O Clássico', preco: 42, selo: 'da casa',
      desc: 'Blend 180g, cheddar inglês, alface, tomate, bacon da casa e maionese de alho assado no brioche.' },
    { id: 'duplo-brasa', cat: 'burgers', nome: 'Duplo Brasa', preco: 46,
      desc: 'Dois smash de 100g com crosta caramelizada, cheddar em dobro e cebola na chapa.' },
    { id: 'verde-oficio', cat: 'burgers', nome: 'Verde Ofício', preco: 44,
      desc: 'Blend 180g, queijo minas curado, rúcula, pesto de manjericão e tomate confit.' },
    { id: 'defumado', cat: 'burgers', nome: 'Defumado', preco: 48,
      desc: 'Blend 180g, provolone, bacon em lascas, barbecue de café e picles da casa.' },
    { id: 'cogumelo-trufa', cat: 'burgers', nome: 'Cogumelo & Trufa', preco: 52,
      desc: 'Blend 180g, cogumelos salteados, queijo gruyère e maionese trufada.' },
    { id: 'horta', cat: 'burgers', nome: 'Horta', preco: 39, selo: 'vegetariano',
      desc: 'Burger de grão-de-bico e beterraba, queijo coalho, alface, tomate e molho de iogurte.' },

    // Acompanhamentos
    { id: 'fritas', cat: 'acompanhamentos', nome: 'Fritas rústicas', preco: 18,
      desc: 'Batata com casca, alecrim e flor de sal.' },
    { id: 'onion-rings', cat: 'acompanhamentos', nome: 'Onion rings', preco: 22,
      desc: 'Anéis de cebola empanados na cerveja, com maionese defumada.' },
    { id: 'mandioca', cat: 'acompanhamentos', nome: 'Mandioca frita', preco: 21,
      desc: 'Mandioca crocante por fora, macia por dentro, com maionese de alho.' },
    { id: 'chips-doce', cat: 'acompanhamentos', nome: 'Chips de batata-doce', preco: 20,
      desc: 'Lâminas finas de batata-doce com páprica defumada.' },

    // Bebidas
    { id: 'limonada', cat: 'bebidas', nome: 'Limonada de capim-santo', preco: 12,
      desc: 'Feita na hora, 400 ml.' },
    { id: 'cha-hibisco', cat: 'bebidas', nome: 'Chá gelado de hibisco', preco: 11,
      desc: 'Hibisco, gengibre e um toque de mel, 400 ml.' },
    { id: 'refrigerante', cat: 'bebidas', nome: 'Refrigerante lata', preco: 7,
      desc: 'Lata 350 ml. Pergunte os sabores no pedido.' },
    { id: 'agua', cat: 'bebidas', nome: 'Água mineral', preco: 5,
      desc: 'Com ou sem gás, 500 ml.' },

    // Sobremesas
    { id: 'brownie', cat: 'sobremesas', nome: 'Brownie com sorvete', preco: 22,
      desc: 'Brownie de chocolate meio amargo, quente, com sorvete de creme.' },
    { id: 'milkshake', cat: 'sobremesas', nome: 'Milkshake de doce de leite', preco: 24,
      desc: 'Sorvete de creme batido com doce de leite artesanal, 400 ml.' },
    { id: 'cookie', cat: 'sobremesas', nome: 'Cookie com flor de sal', preco: 12,
      desc: 'Cookie de chocolate com casquinha crocante e flor de sal.' }
  ]
};
