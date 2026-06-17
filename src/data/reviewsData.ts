export interface Review {
  id: string;
  name: string;
  avatar: string;
  stars: number;
  comment: string;
  date: string;
}

export const mockReviews: Review[] = [
  {
    id: '1',
    name: 'Lucas Almeida',
    avatar: '👨‍💻',
    stars: 5,
    comment: 'Ambiente sensacional e profissionais extremamente qualificados. O corte degradê com o João Santos ficou impecável!',
    date: 'Há 2 dias'
  },
  {
    id: '2',
    name: 'Bruno Silva',
    avatar: '🏃‍♂️',
    stars: 5,
    comment: 'Melhor barbearia da região sem dúvidas. O sistema de agendamento pelo site facilita demais a vida, nunca peguei fila.',
    date: 'Há 1 semana'
  },
  {
    id: '3',
    name: 'Rafael Costa',
    avatar: '🧑‍💼',
    stars: 4,
    comment: 'Atendimento nota 10 e café de primeira. Fiz a barba completa e o cuidado com a toalha quente faz toda a diferença.',
    date: 'Há 2 semanas'
  },
  {
    id: '4',
    name: 'Thiago Oliveira',
    avatar: '🧔',
    stars: 5,
    comment: 'Corte de cabelo e barba excelentes. O atendimento é pontual e a resenha com os barbeiros é garantida.',
    date: 'Há 3 dias'
  },
  {
    id: '5',
    name: 'Rodrigo Santos',
    avatar: '👨‍🎨',
    stars: 5,
    comment: 'Fiquei impressionado com a estrutura da barbearia. O profissional entendeu perfeitamente o corte clássico que eu queria.',
    date: 'Há 5 dias'
  },
  {
    id: '6',
    name: 'Felipe Melo',
    avatar: '🏋️‍♂️',
    stars: 5,
    comment: 'Agendei pelo site e o atendimento começou exatamente no horário. O reflexo alinhado ficou top demais, recomendo!',
    date: 'Há 4 dias'
  },
  {
    id: '7',
    name: 'Gabriel Souza',
    avatar: '🎓',
    stars: 4,
    comment: 'Fiz o corte social e a sobrancelha na navalha. Preço justo pela qualidade do serviço e do ambiente oferecido.',
    date: 'Há 1 semana'
  },
  {
    id: '8',
    name: 'Matheus Lima',
    avatar: '🎸',
    stars: 5,
    comment: 'A toalha quente na barba é relaxante demais. Os caras usam produtos de primeira linha, o cheiro do pós-barba é animal.',
    date: 'Há 10 dias'
  },
  {
    id: '9',
    name: 'Diego Pereira',
    avatar: '🛹',
    stars: 5,
    comment: 'Espaço massa com videogame e cerveja gelada enquanto espera. O corte riscado na lateral ficou perfeito.',
    date: 'Há 3 semanas'
  },
  {
    id: '10',
    name: 'André Ribeiro',
    avatar: '👨‍🍳',
    stars: 4,
    comment: 'Primeira vez que fui e já virei cliente fiel. Muito prático agendar o horário e os barbeiros mandam muito bem.',
    date: 'Há 1 mês'
  },
  {
    id: '11',
    name: 'Henrique Martins',
    avatar: '🏎️',
    stars: 5,
    comment: 'Faço o corte americano aqui todo mês. A simetria que os caras conseguem dar no acabamento do pezinho é absurda.',
    date: 'Há 1 dia'
  },
  {
    id: '12',
    name: 'Guilherme Augusto',
    avatar: '👔',
    stars: 5,
    comment: 'Excelente para quem precisa cortar o cabelo antes do trabalho. O primeiro horário das 8h salva demais a rotina de reuniões.',
    date: 'Há 6 dias'
  },
  {
    id: '13',
    name: 'Gustavo Henrique',
    avatar: '🎨',
    stars: 5,
    comment: 'Levei meu filho de 6 anos e o barbeiro teve uma paciência gigantesca. O corte infantil ficou estiloso e ele adorou o espaço.',
    date: 'Há 4 dias'
  },
  {
    id: '14',
    name: 'Leonardo Farias',
    avatar: '🎧',
    stars: 4,
    comment: 'Corte fade limpo e bem executado. O som ambiente da barbearia é muito bom e o clima geral é super descontraído.',
    date: 'Há 2 semanas'
  },
  {
    id: '15',
    name: 'Marcelo Vieira',
    avatar: '🥊',
    stars: 5,
    comment: 'Fiz a pigmentação na barba e ficou extremamente natural. Não ficou aquela marcação artificial que a gente costuma ver por aí.',
    date: 'Há 12 dias'
  },
  {
    id: '16',
    name: 'Vinícius Rocha',
    avatar: '🎮',
    stars: 5,
    comment: 'Mando o nevou clássico todo ano aqui. Os caras têm a manha de descolorir sem queimar o couro cabeludo, o platinado ficou impecável.',
    date: 'Há 3 dias'
  },
  {
    id: '17',
    name: 'Eduardo Gomes',
    avatar: '📈',
    stars: 4,
    comment: 'Excelente infraestrutura e cadeiras muito confortáveis. O corte com tesoura foi preciso. Só senti falta de mais vagas na frente.',
    date: 'Há 1 semana'
  },
  {
    id: '18',
    name: 'Arthur Barbosa',
    avatar: '🥋',
    stars: 5,
    comment: 'Os produtos que eles vendem para manter a barba hidratada em casa são muito bons. O óleo de barba deles mudou meu visual.',
    date: 'Há 9 dias'
  },
  {
    id: '19',
    name: 'Samuel Teixeira',
    avatar: '✈️',
    stars: 5,
    comment: 'A navalha que usam para desenhar o contorno é super afiada, nenhum corte ou irritação na pele. Higiene e biossegurança impecáveis.',
    date: 'Há 5 dias'
  },
  {
    id: '20',
    name: 'Pedro Henrique',
    avatar: '📸',
    stars: 5,
    comment: 'Fiz um corte mullet moderno e a estilização texturizada ficou irada. Os caras conhecem muito de cortes modernos de rua.',
    date: 'Há 2 semanas'
  },
  {
    id: '21',
    name: 'Igor Fernandes',
    avatar: '💻',
    stars: 5,
    comment: 'O site para agendar é leve e funciona direto do celular. Dá pra escolher o barbeiro e ver os preços na hora, sem surpresas.',
    date: 'Há 11 dias'
  },
  {
    id: '22',
    name: 'Alexandre Lopes',
    avatar: '🚴',
    stars: 5,
    comment: 'Fiz o alisamento com a progressiva masculina e o resultado reduziu o volume exatamente como eu queria. Cabelo alinhado e macio.',
    date: 'Há 18 dias'
  },
  {
    id: '23',
    name: 'Caio Roberto',
    avatar: '🏀',
    stars: 4,
    comment: 'O corte em camadas com tesoura ficou muito leve. O barbeiro Lucas entende muito de visagismo e deu ótimas dicas pro meu rosto.',
    date: 'Há 1 semana'
  },
  {
    id: '24',
    name: 'Daniel Nogueira',
    avatar: '📚',
    stars: 5,
    comment: 'Atendimento padrão premium. A massagem facial na hora da lavagem do cabelo é sensacional, quase dormi na cadeira.',
    date: 'Há 4 dias'
  },
  {
    id: '25',
    name: 'Renan Castro',
    avatar: '🩺',
    stars: 5,
    comment: 'Muito pontuais! Como sou médico, meu tempo é corrido. Entrei na cadeira no minuto exato do agendamento do app.',
    date: 'Há 2 dias'
  },
  {
    id: '26',
    name: 'Victor Hugo',
    avatar: '✒️',
    stars: 5,
    comment: 'Ambiente climatizado na temperatura perfeita e a playlist de rock clássico deixa o clima nostálgico e muito agradável.',
    date: 'Há 14 dias'
  },
  {
    id: '27',
    name: 'Douglas Souza',
    avatar: '🏐',
    stars: 5,
    comment: 'Corte Buzz Cut bem raspado e simétrico. As máquinas deles estão sempre limpas e novas, dá pra perceber o cuidado.',
    date: 'Há 8 dias'
  },
  {
    id: '28',
    name: 'Murilo Borges',
    avatar: '🎬',
    stars: 4,
    comment: 'O corte pompadour ficou clássico e volumoso. Demorou um pouquinho mais do que o previsto, mas o capricho justificou a espera.',
    date: 'Há 3 semanas'
  },
  {
    id: '29',
    name: 'Otávio Miranda',
    avatar: '💼',
    stars: 5,
    comment: 'Estilo Old School de verdade. Desde o atendimento na recepção até a finalização com pomada matte, tudo é excelente.',
    date: 'Há 7 dias'
  },
  {
    id: '30',
    name: 'Jonathan Silva',
    avatar: '🔧',
    stars: 5,
    comment: 'Preço extremamente justo pela estrutura que oferecem. Ganha de lavada de qualquer franquia de shopping da cidade.',
    date: 'Há 2 meses'
  },
  {
    id: '31',
    name: 'Yago Pires',
    avatar: '🎙️',
    stars: 5,
    comment: 'Fiz o design de cavanhaque e o acabamento ficou perfeito. Simetria milimétrica, o barbeiro manja muito da profissão.',
    date: 'Há 3 dias'
  },
  {
    id: '32',
    name: 'Fábio Assunção',
    avatar: '🎭',
    stars: 4,
    comment: 'Corte social clássico na tesoura muito bem executado. Cerveja cortesia gelada na chegada faz a experiência valer a pena.',
    date: 'Há 12 dias'
  },
  {
    id: '33',
    name: 'Christian Santos',
    avatar: '📐',
    stars: 5,
    comment: 'Corte taper fade executado com maestria. A transição da pele pro cabelo ficou extremamente suave, sem nenhuma marca.',
    date: 'Há 5 dias'
  },
  {
    id: '34',
    name: 'Breno Correia',
    avatar: '🌴',
    stars: 5,
    comment: 'Estava de passagem pela cidade e agendei pelo site. Atendimento ágil e corte moderno de primeira qualidade. Nota mil.',
    date: 'Há 22 dias'
  },
  {
    id: '35',
    name: 'Ricardo Mendes',
    avatar: '⛺',
    stars: 5,
    comment: 'A esfoliação facial que fazem antes da barba ajuda demais a não encravar os pelos. O cuidado com o cliente aqui é diferenciado.',
    date: 'Há 6 dias'
  },
  {
    id: '36',
    name: 'Erick Silva',
    avatar: '🧱',
    stars: 4,
    comment: 'Corte Flat Top bem reto e estruturado. Difícl achar profissionais que saibam fazer esse corte com perfeição hoje em dia.',
    date: 'Há 18 dias'
  },
  {
    id: '37',
    name: 'Luiz Gustavo',
    avatar: '👔',
    stars: 5,
    comment: 'Faço o cabelo e a barba toda semana. A constância na qualidade do serviço é o que me faz não trocar de barbearia por nada.',
    date: 'Há 1 dia'
  },
  {
    id: '38',
    name: 'Wesley Carvalho',
    avatar: '🎤',
    stars: 5,
    comment: 'Corte moicano disfarçado com freestyle na lateral ficou irado demais. Trabalho artístico impecável do barbeiro.',
    date: 'Há 9 dias'
  },
  {
    id: '39',
    name: 'Marcos Roberto',
    avatar: '🎣',
    stars: 4,
    comment: 'Gostei muito do corte e da higienização. O ambiente é muito limpo e organizado. Volto com certeza no próximo mês.',
    date: 'Há 2 semanas'
  },
  {
    id: '40',
    name: 'Alan Cardoso',
    avatar: '💻',
    stars: 5,
    comment: 'Atendimento ágil, recepção educada e corte na régua. A Barbearia Network elevou o nível de serviço da região.',
    date: 'Há 4 dias'
  }
];