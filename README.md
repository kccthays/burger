# Ofício — Hamburgueria Artesanal (fictícia)

Site de duas páginas para uma hamburgueria fictícia, feito em HTML, CSS e JS puro, com animações via GSAP + ScrollTrigger.

- `index.html`: Home. A hero monta o burger com o scroll: cada ingrediente cai no prato e a ficha técnica se desenha. Depois vêm a história (texto que acende palavra por palavra), os destaques (scroll horizontal), onde estamos e horário (status "aberto agora" calculado no fuso de São Paulo), o Instagram e o contato.
- `cardapio.html`: cardápio com categorias fixas no topo e carrinho (adicionar, remover, quantidade e total). A finalização abre o WhatsApp com o pedido já escrito. O carrinho fica salvo no `localStorage`.

## Como rodar

Não precisa de build. Sirva a pasta com qualquer servidor estático:

```bash
python3 -m http.server 8000
```

Depois, abra http://localhost:8000.

## Dados provisórios

Telefone, WhatsApp, e-mail, endereço, Instagram, horários e preços estão em `assets/js/data.js`. Troque por dados reais antes de publicar. O número de WhatsApp atual (`5511900000000`) é fictício.

## Estrutura

```
assets/
  css/style.css      estilos (tokens de cor no topo)
  js/data.js         cardápio + configurações
  js/cart.js         carrinho compartilhado + envio pelo WhatsApp
  js/common.js       menu móvel, contatos, botões "+"
  js/home.js         animações da Home
  js/cardapio.js     lista do cardápio, categorias e burger que segue o cursor
  img/               ingredientes com fundo transparente (gerados por IA)
  vendor/            GSAP 3.12.5 e ScrollTrigger
design/              mockup aprovado e quadros de design
```

## Notas

- As fotos dos ingredientes e do burger foram geradas por IA (Higgsfield), com fundo removido. Os destaques e o cardápio usam a mesma foto do burger para todos os itens, como ilustração.
- Com `prefers-reduced-motion` ativado, o site mostra o burger já montado, sem animações de scroll.
