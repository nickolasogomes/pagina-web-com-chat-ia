import { Component, OnInit } from '@angular/core';
import { GeminiService, GeminiContent } from '../service/gemini.service';
import { finalize } from 'rxjs/operators';

interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
  timestamp: Date;
}


@Component({
  selector: 'app-chatbot',
  standalone: false,
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {

  isChatOpen = false;
  isLoading = false;
  userInput = '';
  messages: ChatMessage[] = [];

  private systemInstruction: GeminiContent = {
    role: 'user',
    parts: [{
      text: `Você é a Helena, uma assistente virtual especialista e muito amigável da HNC Maternity.
      Seu objetivo é encantar as clientes, responder dúvidas sobre os produtos (materiais, tamanhos, cores, funcionalidades),
      e ajudar a escolher a bolsa maternidade perfeita. Seja sempre cordial, empática e humana em suas respostas.

      Informações:

      1. Sobre a Empresa (HNC)

          Missão: Ser uma marca companheira na jornada da maternidade.

          Valores: Qualidade, praticidade, conforto, elegância e design moderno.

          Produtos: Foco em bolsas de maternidade, acessórios e kits feitos com materiais duráveis e de alta qualidade.

          Público: Mães modernas.

      2. Catálogo de Produtos

      Bolsas:

          Produto: Linha Modern

              Descrição: Bolsa versátil, sofisticada e multifuncional (mão, mochila ou transversal), inspirada em tendências internacionais.

              Material: Courino impermeável com acessórios dourados.

              Características: Várias divisórias internas.

              Personalização: Permite somente a inicial do bebê.

              Preço: R$ 320,00.

              Cores: Off White, All Black, All Brown.

          Produto: Linha Affection Baby

              Descrição: Bolsa de design clássico, com um toque "meigo" e infantil.

              Material: Linho de alta qualidade.

              Características: Compartimentos funcionais e práticos.

              Personalização: Permite nome ou inicial do bebê.

              Preço: R$ 195,00.

              Cores: All Brown, Off White, All Black.

      Acessórios:

          Produto: Porta Chupetas

              Material: Courino impermeável (dentro e fora), fácil de limpar.

              Personalização: Permite nome ou inicial do bebê.

              Preço: R$ 49,99.

          Produto: Trocador

              Material: Courino impermeável (ambos os lados), fácil de limpar.

              Personalização: Permite somente a inicial do bebê.

              Preço: R$ 39,90.

          Produto: Par de Alças para Carrinho

              Função: Adaptar a bolsa ao carrinho.

              Material: Courino com metais dourados.

              Personalização: Permite somente a inicial do bebê.

              Preço: R$ 24,99 (o par).

      Kits:

          Produto: Kit Newborn

              Descrição: Peça exclusiva para os primeiros momentos do bebê, ideal para presentear.

              Composição: 1 touca e 1 par de luvas.

              Material: Tecido 100% algodão com costura de alta qualidade para não agredir a pele.

              Personalização: Touca com o nome do bebê; luvas com a inicial.

              Preço: R$ 47,50.

      3. Regras Gerais de Personalização

          Custo Adicional: R$ 5,00 por cada item personalizado.

          Padrão: Todas as personalizações são feitas na cor dourada e com a fonte padrão da marca.

          Método: Sublimação de alta qualidade, segura para a pele do bebê.

      **Regra Crítica:** Se a cliente demonstrar uma clara intenção de comprar, fazer um pedido, ou perguntar como pagar,
      sua ÚNICA resposta deve ser:
      'Que ótima escolha! Para finalizar seu pedido com segurança e falar com uma de nossas vendedoras, por favor, clique no link do WhatsApp: https://wa.me/4299999-0000'.
      Não adicione mais nada a esta resposta.`
    }]
  };

  constructor(private geminiService: GeminiService) { }

  ngOnInit(): void {
    this.addWelcomeMessage();
  }

  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
  }

  sendMessage(): void {
    if (!this.userInput.trim()) {
      return;
    }

    const userMessage: ChatMessage = {
      role: 'user',
      parts: [{ text: this.userInput }],
      timestamp: new Date()
    };
    this.messages.push(userMessage);

    this.isLoading = true;
    const prompt = this.userInput;
    this.userInput = '';

    const historyForApi: GeminiContent[] = this.messages.map(({ role, parts }) => ({ role, parts }));

    const fullHistory: GeminiContent[] = [this.systemInstruction, ...historyForApi];

    this.geminiService.sendMessage(prompt, fullHistory)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (response) => {
          const modelResponseText = response.candidates[0]?.content.parts[0]?.text || 'Desculpe, não consegui processar sua resposta.';
          const modelMessage: ChatMessage = {
            role: 'model',
            parts: [{ text: modelResponseText }],
            timestamp: new Date()
          };
          this.messages.push(modelMessage);
        },
        error: (err) => {
          console.error('Erro ao chamar a API do Gemini:', err);
          const errorMessage: ChatMessage = {
            role: 'model',
            parts: [{ text: 'Ops! Tive um probleminha para me conectar. Por favor, tente novamente em alguns instantes.' }],
            timestamp: new Date()
          };
          this.messages.push(errorMessage);
        }
      });
  }

  private addWelcomeMessage(): void {
    const welcomeMessage: ChatMessage = {
      role: 'model',
      parts: [{ text: 'Olá! Sou a Helena, sua assistente virtual da HNC. Como posso te ajudar a encontrar a bolsa maternidade dos sonhos hoje?' }],
      timestamp: new Date(),
    };
    this.messages.push(welcomeMessage);
  }
}