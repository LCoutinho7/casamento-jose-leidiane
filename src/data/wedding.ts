import type { FaqItem, GalleryPhoto, GiftQuota, StoryChapter, Venue } from '../types';

// Horário provisório: a cerimônia ainda não tem hora definida pelos noivos.
export const WEDDING_DATE = new Date('2027-01-16T16:00:00-03:00');
export const WEDDING_DATE_LABEL = '16 de janeiro de 2027';
export const RSVP_DEADLINE_LABEL = '16 de dezembro de 2026';

export const COUPLE = {
  groom: 'José',
  bride: 'Leidiane',
  groomNickname: 'Zé',
  brideNickname: 'Leidi',
  monogram: 'J&L',
  city: 'São Paulo, SP',
  // Contato e chave PIX serão substituídos pelos dados reais dos noivos.
  whatsapp: '',
  pixKey: '',
  // Link da lista criada no Magazine Luiza (Quero de Casamento).
  giftListUrl: '',
};

// Enquanto os locais não forem definidos, a seção "O grande dia" mostra "em breve".
export const VENUES: { ceremony?: Venue; reception?: Venue } = {};

export const STORY: StoryChapter[] = [
  {
    id: 'cinema',
    date: 'Novembro de 2022',
    title: 'Uma sessão de cinema',
    quote: 'Um filme, duas poltronas e a sensação de que aquilo era só o começo.',
    text: 'O primeiro encontro foi no cinema. A foto é tremida, o filme ninguém lembra direito, mas o sorriso dos dois já dizia tudo: ali começava uma história que nenhum dos dois planejou, mas que os dois escolheram continuar.',
    image: 'images/historia-cinema.webp',
    imageAlt: 'José e Leidiane sorrindo em uma sala de cinema, no primeiro encontro',
  },
  {
    id: 'viagens',
    date: '2023 — 2025',
    title: 'Estrada, mar e muitas fotos',
    quote: 'Descobrimos que a vida fica maior quando a gente divide o caminho.',
    text: 'Campos do Jordão, Foz do Iguaçu, o litoral do Nordeste, Buenos Aires. Cada viagem virou um capítulo, e cada capítulo confirmou a mesma coisa: em qualquer lugar do mapa, o melhor destino era estar junto.',
    image: 'images/historia-viagens.webp',
    imageAlt: 'O casal em frente às Cataratas do Iguaçu, com um arco-íris ao fundo',
  },
  {
    id: 'pedido',
    date: 'Abril de 2026',
    title: 'O pedido, aos pés do Cristo',
    quote: 'Uma pergunta feita no alto do Rio, e a resposta mais fácil da vida.',
    text: 'Foi no Corcovado, com o Rio inteiro aos pés e o Cristo Redentor de braços abertos, que o Zé fez a pergunta. A Leidi disse sim, e o anel ganhou a primeira de muitas fotos.',
    image: 'images/historia-pedido.webp',
    imageAlt: 'José e Leidiane em frente ao Cristo Redentor, logo depois do pedido de casamento',
    portrait: true,
  },
  {
    id: 'noivado',
    date: 'Maio de 2026',
    title: 'Um brinde com quem a gente ama',
    quote: '"Um amor que aguardou o tempo certo."',
    text: 'A celebração do noivado reuniu família e amigos para um brinde ao lado dos dois. Foi o ensaio geral da festa que vem por aí, com bolo, flores e a certeza de que a data já estava marcada.',
    image: 'images/historia-noivado.webp',
    imageAlt: 'O casal brindando com espumante na festa de noivado',
    portrait: true,
  },
  {
    id: 'ensaio',
    date: 'Inverno de 2026',
    title: 'O ensaio, entre vinhedos e carros clássicos',
    quote: '16 · 01 · 27',
    text: 'No ensaio pré-wedding, os dois lados do casal: a calma dos vinhedos e a paixão por carros. A data do casamento, pendurada num varal de corações, virou a foto favorita dos noivos.',
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
  { id: 'jantar', name: 'Jantar na lua de mel', description: 'Um jantar a dois para brindar o começo da vida de casados.', price: 250 },
  { id: 'cafe', name: 'Café da manhã dos recém-casados', description: 'Porque alguém precisa garantir o café reforçado depois da festa.', price: 120 },
  { id: 'passeio', name: 'Passeio na lua de mel', description: 'Uma lembrança para levar da viagem mais especial.', price: 380 },
  { id: 'lar', name: 'Um tijolinho do novo lar', description: 'Um pedaço da nova casa construído com o carinho de quem amamos.', price: 500 },
  { id: 'sobremesa', name: 'A sobremesa fica por sua conta', description: 'A mais chocolatuda que a gente encontrar.', price: 65 },
  { id: 'brinde', name: 'Um brinde aos noivos', description: 'Uma boa taça de vinho para celebrar a vida a dois.', price: 95 },
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
    question: 'Crianças são bem-vindas?',
    answer: 'As crianças da família e de convidados próximos são muito bem-vindas. Os detalhes sobre a estrutura para elas serão divulgados junto com o local da festa.',
  },
  {
    question: 'Qual é o traje sugerido?',
    answer: 'Traje passeio completo. Pedimos apenas que evitem branco, off-white e marfim, tons reservados à noiva.',
  },
  {
    question: 'Tenho uma restrição alimentar. Como aviso?',
    answer: 'Na confirmação de presença haverá um campo para restrições (vegetariano, vegano, alergias). Também pode avisar os noivos diretamente.',
  },
  {
    question: 'Como funciona a lista de presentes?',
    answer: 'Há dois caminhos: a lista no Magazine Luiza, com entrega direta para os noivos, ou as cotas simbólicas via PIX aqui no site. A presença de vocês já é o maior presente.',
  },
];
