import type { FaqItem, GalleryPhoto, GiftQuota, StoryChapter, Venue } from '../types';

export const WEDDING_DATE = new Date('2027-01-16T16:30:00-03:00');
export const WEDDING_DATE_LABEL = '16 de janeiro de 2027';
export const RSVP_DEADLINE_LABEL = '16 de dezembro de 2026';

export const COUPLE = {
  groom: 'José',
  bride: 'Leidiane',
  groomNickname: 'Zé',
  brideNickname: 'Leidi',
  monogram: 'J&L',
  city: 'Osasco, SP',
  // Contato e chave PIX serão substituídos pelos dados reais dos noivos.
  whatsapp: '',
  pixKey: '',
  // Link da lista criada no Magazine Luiza (Quero de Casamento).
  giftListUrl: '',
};

export const VENUES: { ceremony?: Venue; reception?: Venue } = {
  ceremony: {
    name: 'Paróquia Espírito Santo',
    address: 'Av. Horácio Lafer, 986 — Jardim das Flores',
    city: 'Osasco, SP',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Par%C3%B3quia+Esp%C3%ADrito+Santo%2C+Av.+Hor%C3%A1cio+Lafer%2C+986%2C+Osasco+SP',
    time: '16h30',
  },
  reception: {
    name: 'Buffet Uriel I',
    address: 'Rua General Florêncio, 868 — Quitaúna',
    city: 'Osasco, SP',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Buffet+Uriel+I%2C+Rua+General+Flor%C3%AAncio%2C+868%2C+Osasco+SP',
    time: 'Logo após a cerimônia',
  },
};

export const STORY: StoryChapter[] = [
  {
    id: 'cinema',
    date: 'Outubro de 2022',
    title: 'Uma sessão de cinema',
    quote: 'Um filme, duas poltronas e a sensação de que aquilo era só o começo.',
    text: 'As primeiras conversas começaram no Instagram. Do nada, o noivo mandou para ela: esse é meu WhatsApp, seguido do número. Algumas horas depois ela chamou por lá e os dois não pararam mais de se falar. Uns dias de conversa, uma passada na casa da noiva com uma barra de chocolate e, no dia 29 de outubro de 2022, veio o primeiro encontro oficial. Um jantar no The Square, em que ele sugeriu um sabor de pizza que sabia que ela não gostava (corajoso!), um filme de herói dublado comprado no nervosismo, a saída da sala de mãos dadas e, um pouco depois, o primeiro beijo. Ali começava uma história que nenhum dos dois planejou, mas que os dois escolheram continuar.',
    image: 'images/historia-cinema.webp',
    imageAlt: 'José e Leidiane sorrindo em uma sala de cinema, no primeiro encontro',
  },
  {
    id: 'viagens',
    date: '2022 — 2026',
    title: 'Estrada, céus e muitas fotos',
    quote: 'Descobrimos que a vida fica maior quando a gente divide o caminho.\nEle de pegar estrada, ela de pegar avião…',
    text: 'Campos do Jordão, Foz do Iguaçu, Manaus, Fortaleza, Peruíbe, Aparecida do Norte, Buenos Aires, Santo Antônio do Pinhal, Rio de Janeiro e tantas outras. Cada viagem virou um capítulo, e cada capítulo confirmou a mesma coisa: em qualquer lugar do mapa, o melhor destino era estar junto.',
    image: 'images/historia-viagens.webp',
    imageAlt: 'O casal em frente às Cataratas do Iguaçu, com um arco-íris ao fundo',
  },
  {
    id: 'pedido',
    date: 'Abril de 2026',
    title: 'O pedido, aos pés do Cristo',
    quote: 'Uma pergunta feita no alto do Rio, e a resposta mais fácil da vida.',
    text: 'Ele já tinha planejado tudo, com a ajuda das amigas da noiva, as alianças escolhidas: era só chegar o grande dia. Escondeu a aliança e o plano direitinho, ela nem desconfiava e, ainda por cima, estava brava porque achava que ele ia perder a melhor oportunidade da vida dele para o pedido… mal sabia ela! No dia 20 de abril de 2026, depois de algumas vans, escadas e filas até o Cristo, num dia abençoado com um céu lindo, veio o pedido. O noivo de joelhos aos pés do Cristo, a emoção e o tão esperado sim.',
    image: 'images/historia-pedido.webp',
    imageAlt: 'José e Leidiane em frente ao Cristo Redentor, logo depois do pedido de casamento',
    portrait: true,
  },
  {
    id: 'noivado',
    date: 'Maio de 2026',
    title: 'Um brinde com quem a gente ama',
    quote: 'Um amor que aguardou o tempo certo para acontecer.',
    text: 'Os noivos ouviram desde o pedido que “Deus ama casamentos” e, desde então, têm vivido e sentido essa frase diariamente. Com o dia da primeira Eucaristia e da Crisma do noivo, decidiram aproveitar o momento para celebrar o noivado com a família e alguns amigos. Foi o ensaio geral para a festa que vem por aí, com bolo, flores e a certeza de que a data já estava marcada e escolhida muito antes por Ele.',
    image: 'images/historia-noivado.webp',
    imageAlt: 'O casal brindando com espumante na festa de noivado',
    portrait: true,
  },
  {
    id: 'ensaio',
    date: 'Inverno de 2026',
    title: 'O ensaio, entre vinhedos e carros clássicos',
    quote: 'A fotografia é a literatura do olhar.',
    text: 'No ensaio pré-wedding, eles escolheram cenários que representam cada um: um vinhedo para ela, um museu de carros para ele. Uma manhã perfeita de inverno, com a luz ideal para os registros e fotos que ficarão guardadas para sempre no coração dos dois.',
    image: 'images/historia-ensaio.webp',
    imageAlt: 'Mãos dadas do casal segurando um terço, no ensaio pré-wedding',
  },
];

export const GALLERY: GalleryPhoto[] = [
  { src: 'images/ensaio-01.webp', alt: 'Casal rindo e brindando com vinho sentados na grama', category: 'ensaio' },
  { src: 'images/ensaio-02.webp', alt: 'Beijo do casal com taças de vinho', category: 'ensaio', portrait: true },
  { src: 'images/ensaio-03.webp', alt: 'Casal de mãos dadas em frente a uma cachoeira', category: 'ensaio', portrait: true },
  { src: 'images/ensaio-04.webp', alt: 'Casal caminhando entre as parreiras do vinhedo', category: 'ensaio' },
  { src: 'images/ensaio-05.webp', alt: 'José levantando Leidiane no colo sob guarda-chuvas coloridos', category: 'ensaio', portrait: true },
  { src: 'images/ensaio-06.webp', alt: 'Casal ao lado de uma Ferrari vermelha', category: 'ensaio', portrait: true },
  { src: 'images/ensaio-07.webp', alt: 'Beijo do casal em um museu de carros antigos', category: 'ensaio' },
  { src: 'images/ensaio-08.webp', alt: 'Casal dentro de uma Ferrari conversível', category: 'ensaio' },
  { src: 'images/ensaio-09.webp', alt: 'Varal de corações com a data do casamento: 16 01 27', category: 'ensaio', portrait: true },
  { src: 'images/ensaio-10.webp', alt: 'Casal abraçado em uma varanda de madeira', category: 'ensaio' },
  { src: 'images/viagens-01.webp', alt: 'Casal em frente ao letreiro de Campos do Jordão', category: 'viagens' },
  { src: 'images/viagens-02.webp', alt: 'Casal abraçado nas dunas de Canoa Quebrada', category: 'viagens', portrait: true },
  { src: 'images/viagens-03.webp', alt: 'Casal sentado em um banco decorado com coração de flores', category: 'viagens' },
  { src: 'images/viagens-04.webp', alt: 'Casal em um labirinto de jardim', category: 'viagens' },
  { src: 'images/viagens-05.webp', alt: 'Casal em frente à Casa Rosada, em Buenos Aires', category: 'viagens' },
  { src: 'images/viagens-06.webp', alt: 'Casal abraçado ao pé de uma árvore gigante', category: 'viagens', portrait: true },
  { src: 'images/viagens-07.webp', alt: 'Casal mostrando as alianças no alto de uma serra', category: 'viagens' },
  { src: 'images/viagens-08.webp', alt: 'Selfie do casal sob guarda-chuvas coloridos', category: 'viagens', portrait: true },
  { src: 'images/noivado-01.webp', alt: 'Selfie do casal mostrando o anel, com o Cristo Redentor ao fundo', category: 'noivado', portrait: true },
  { src: 'images/noivado-02.webp', alt: 'Mão com o anel de noivado e a vista do Rio de Janeiro', category: 'noivado', portrait: true },
  { src: 'images/noivado-03.webp', alt: 'Beijo do casal na festa de noivado', category: 'noivado', portrait: true },
  { src: 'images/noivado-04.webp', alt: 'Bolo e flores da festa de noivado', category: 'noivado', portrait: true },
];

export const GIFT_QUOTAS: GiftQuota[] = [
  { id: 'cafe', name: 'Café para sobreviver à segunda-feira', description: 'O combustível que faz a semana começar em paz.', price: 59.9 },
  { id: 'meias', name: 'Fundo emergencial para meias perdidas', description: 'Ninguém sabe para onde elas vão, mas alguém precisa repor.', price: 59.9 },
  { id: 'hamburguer', name: 'Hambúrguer para aquela noite em que ninguém quer cozinhar', description: 'Acontece mais do que a gente admite.', price: 89.9 },
  { id: 'plantinha', name: 'Uma plantinha para testar nossas responsabilidades', description: 'Se ela sobreviver, é porque estamos indo bem.', price: 79.9 },
  { id: 'videogame', name: 'Uma noite de videogame sem reclamações', description: 'Trégua oficial assinada pelos dois lados.', price: 149.9 },
  { id: 'lavanderia', name: 'Lavanderia: porque roupa suja não se lava sozinha', description: 'Um fim de semana livre da máquina.', price: 150 },
  { id: 'contas', name: 'Ajude a pagar as contas que chegam depois do sim', description: 'A vida real bate na porta logo depois da festa.', price: 179.9 },
  { id: 'emergencia', name: 'Compra emergencial que não estava no orçamento', description: 'Sempre tem uma, e ela nunca avisa.', price: 200 },
  { id: 'hotel', name: 'Uma noite de hotel para fugir da rotina', description: 'Café da manhã na cama e nada de louça para lavar.', price: 300 },
  { id: 'praia', name: 'Patrocínio de um dia de praia sem preocupação', description: 'Guarda-sol, cadeira e nenhum compromisso.', price: 400 },
  { id: 'lua-de-mel', name: 'Patrocínio oficial de um dia perfeito na lua de mel', description: 'Um dia inteiro da viagem por sua conta.', price: 500 },
  { id: 'amo-os-noivos', name: 'Cota “eu realmente amo esses noivos”', description: 'Para quem quer exagerar no carinho.', price: 1000 },
  { id: 'livre', name: 'Cota livre', description: 'Qualquer valor, do jeito que o seu coração mandar.', price: 100, customAmount: true },
];

export const FAQ: FaqItem[] = [
  {
    question: 'Até quando devo confirmar minha presença?',
    answer: `Pedimos que a confirmação seja feita até ${RSVP_DEADLINE_LABEL}, para organizarmos buffet e acomodações com tranquilidade.`,
  },
  {
    question: 'Posso levar acompanhante?',
    answer: 'Os acompanhantes de cada convite aparecerão nominalmente na confirmação de presença. Em caso de dúvida, fale com os noivos com antecedência.',
  },
  {
    question: 'Qual é o traje sugerido?',
    answer: 'Traje social. Pedimos apenas que evitem branco, off-white, marfim e outros tons claros que possam parecer branco — essa cor fica reservada à noiva.',
  },
  {
    question: 'Como funciona a lista de presentes?',
    answer: 'Há dois caminhos: a lista no Magazine Luiza, com entrega direta para os noivos, ou as cotas simbólicas via PIX aqui no site. A presença de vocês já é o maior presente.',
  },
];
