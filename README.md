Manto da Invisibilidade Web

Autor: Matheus Siqueira

Descrição
Esta aplicação implementa um efeito de "manto da invisibilidade" em tempo real diretamente no navegador web. Utilizando técnicas de visão computacional e manipulação de pixels, o sistema detecta uma faixa de cor específica (Matiz, Saturação, Valor) no feed de vídeo e substitui esses pixels por uma imagem de fundo capturada previamente.

O projeto demonstra processamento de imagem de alta performance em JavaScript/TypeScript usando HTML5 Canvas, sem a necessidade de bibliotecas externas de processamento de vídeo ou servidores backend para o loop de vídeo.

Funcionalidades
- Subtração de Fundo em Tempo Real: Captura um quadro de referência estático para usar como fundo.
- Detecção de Cor Ajustável: Usuários podem selecionar qualquer cor alvo para mascarar.
- Controles de Ajuste Fino: Controles deslizantes de precisão para limiares de Matiz, Saturação e Brilho para lidar com várias condições de iluminação.
- Análise de Cena Inteligente: Assistente de IA integrado para analisar a cena e explicar os conceitos de visão computacional subjacentes.

Instalação e Uso

1. Clone o repositório ou baixe o código fonte.
2. Instale as dependências:
   npm install

3. Execute o servidor de desenvolvimento:
   npm start

4. Abra seu navegador no endereço do servidor local (geralmente http://localhost:3000).

Instruções de Uso
1. Permita o acesso à câmera quando solicitado.
2. Certifique-se de que a câmera esteja estável e apontada para a cena.
3. Saia do enquadramento para que a câmera veja apenas o fundo (o cenário vazio).
4. Clique em "Capture Background" (Capturar Fundo).
5. Volte para o enquadramento segurando um objeto da cor alvo (o padrão é Vermelho).
6. Use o Painel de Controle para ajustar a cor e a sensibilidade se o mascaramento não estiver perfeito.

Stack Tecnológico
- React
- TypeScript
- HTML5 Canvas API
- Tailwind CSS
- SDK de Inteligência Artificial (para análise de cena)
