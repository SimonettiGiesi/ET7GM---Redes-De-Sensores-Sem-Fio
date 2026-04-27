# Base Expandida PT-BR

Esta base complementa o guia inicial com topicos coletados das paginas TTN LoRaWAN, ChirpStack v4, MOKO em portugues e referencias LoRa Alliance. O texto e proprio, resumido e organizado para prova.

## 1. LoRa PHY em profundidade

### Pacote fisico LoRa

Um pacote LoRa e composto, em termos praticos, por preambulo, cabecalho opcional, payload, informacoes de integridade e codificacao. O preambulo ajuda o receptor a detectar e sincronizar o sinal. O cabecalho explicito informa parametros do payload; o modo implicito pode ser usado quando transmissor e receptor ja combinam previamente os parametros.

Pontos de prova:

- preambulo maior facilita deteccao, mas aumenta airtime;
- cabecalho explicito e o caso mais comum em LoRaWAN;
- CRC ajuda a detectar erro no payload fisico;
- FEC/coding rate adiciona redundancia para recuperar erros, com custo em airtime.

### SF, BW, CR e taxa

O SF define quantos chirps/simbolos representam a informacao. BW define a largura de banda ocupada. CR define redundancia. A formula de referencia para tempo de simbolo e:

```text
Tsym = 2^SF / BW
```

Consequencias:

- aumentar SF aumenta sensibilidade e alcance;
- aumentar SF reduz taxa e aumenta colisao temporal;
- aumentar BW aumenta taxa, mas reduz sensibilidade;
- aumentar CR melhora robustez, mas aumenta airtime.

### Transceivers e concentradores

Transceiver e o chip de radio do dispositivo final. Concentrador e o componente de gateway que consegue receber multiplos canais/SFs e encaminhar pacotes ao processador do gateway.

Exemplos comuns:

- SX127x: familia classica de transceivers LoRa;
- SX126x: transceivers mais recentes e eficientes;
- LR1110: integra radio e recursos de geolocalizacao;
- SX1301/SX1302/SX1303: concentradores usados em gateways.

Resposta curta: end device usa transceiver; gateway usa concentrador para escutar varias transmissoes LoRaWAN.

### Antenas e conectores

Antena ruim ou mal casada derruba o link budget. Conectores comuns incluem U.FL, SMA e N-Type. U.FL costuma ser interno e delicado; SMA e comum em equipamentos de laboratorio; N-Type e mais robusto para instalacao externa.

Tipos comuns:

- fio simples: barato, depende muito do comprimento e montagem;
- PCB: integrado, compacto, sensivel ao layout;
- spring: compacto para produtos pequenos;
- rubber duck: comum em gateways/dispositivos;
- colinear: maior ganho, usada em gateways externos.

## 2. LoRaWAN expandido

### Tipos de mensagens

LoRaWAN diferencia mensagens de join, dados e comandos MAC. Uplink e enviado pelo dispositivo; downlink e enviado pela rede. Mensagens confirmadas pedem ACK; mensagens nao confirmadas nao pedem ACK.

Use mensagens confirmadas com cuidado:

- confirmacao aumenta downlink;
- downlink reduz capacidade;
- sensores periodicos normalmente usam uplink nao confirmado;
- atuadores ou comandos criticos podem justificar confirmacao.

### Enderecamento

Identificadores importantes:

- DevEUI: identificador global do dispositivo;
- JoinEUI/AppEUI: identifica o contexto de join;
- DevAddr: endereco curto usado na sessao;
- NetID: identifica rede;
- AppKey/NwkKey: segredos para derivacao de chaves;
- FCntUp/FCntDown: contadores de frame contra replay.

Erro comum: achar que DevAddr identifica permanentemente o dispositivo. Em OTAA, ele pode mudar entre sessoes.

### OTAA e ABP

OTAA:

1. dispositivo envia Join Request;
2. Join Server valida credenciais;
3. rede responde Join Accept;
4. chaves de sessao sao derivadas;
5. dispositivo passa a transmitir dados.

ABP:

1. DevAddr e chaves sao configurados manualmente;
2. nao ha join;
3. contadores precisam ser preservados;
4. e mais facil errar seguranca e sincronismo.

### Seguranca e frame counters

LoRaWAN usa criptografia e integridade baseadas em AES-128. O MIC protege autenticidade/integridade do frame. Frame counters evitam replay: se um atacante retransmitir frame antigo, o servidor deve rejeitar por contador repetido ou atrasado.

Na prova, associe:

- MIC: integridade/autenticidade;
- AppSKey: payload de aplicacao;
- chaves de rede: controle de rede/MAC;
- frame counter: protecao contra repeticao.

### Limitacoes praticas

LoRaWAN nao e adequado para:

- streaming;
- firmware grande frequente por downlink;
- controle em tempo real com baixa latencia garantida;
- payloads grandes e constantes;
- uso intensivo de ACK.

Ele e adequado para:

- medicao ambiental;
- agua, energia, agricultura, estacionamento, rastreamento esparso;
- alarmes/eventos pequenos;
- telemetria de longo alcance.

## 3. Parametros regionais

Parametros regionais sao essenciais porque LoRaWAN nao usa as mesmas frequencias em todo o mundo.

### EU868

- Faixa europeia 863-870 MHz.
- Duty cycle e um limitador central.
- Canais comuns de join/uplink ficam ao redor de 868 MHz.
- Bom para questoes de tempo de espera por duty cycle.

### US915

- Faixa 902-928 MHz.
- Usa muitos canais e mascaras/sub-bandas.
- Nao trabalha com duty cycle da mesma forma que EU868; ha outros limites regulatorios.
- Em laboratorio, erro de sub-banda e causa comum de join falhar.

### AU915 e Brasil

- Muito usado em cenarios brasileiros de LoRaWAN.
- A configuracao de sub-banda precisa ser coerente no firmware, gateway e servidor.
- Se o gateway mostra trafego, mas o join nao completa, verificar RX2, plano regional e channel mask.

## 4. ChirpStack expandido

### Modelo operacional

ChirpStack organiza a rede em camadas administrativas:

```text
Tenant -> Application -> Device
Tenant -> Device Profile
Tenant -> Gateway
```

Device profile define capacidades e parametros LoRaWAN; application agrupa dispositivos de uma solucao; device guarda DevEUI, chaves, ativacao, tags e variaveis.

### MQTT

MQTT e usado para eventos e comandos. Eventos de uplink saem do ChirpStack para a aplicacao; comandos de downlink entram na fila para o dispositivo.

Topicos conceituais:

```text
event/up: uplink recebido
event/join: join aceito
event/ack: confirmacao
event/status: status do dispositivo
command/down: agendar downlink
```

### Gateway Bridge, MQTT Forwarder e Concentratord

- Gateway Bridge traduz protocolos de gateway para MQTT.
- MQTT Forwarder encaminha pacotes do gateway para MQTT, podendo simplificar integracao.
- Concentratord gerencia concentradores LoRa em gateways Linux.

Em prova, explique que esses componentes ficam entre o radio/gateway e o servidor ChirpStack, transportando pacotes e metadados.

### Onboarding seguro

Checklist:

1. escolher regiao correta;
2. cadastrar gateway e confirmar estatisticas;
3. criar tenant;
4. criar application;
5. criar device profile correto;
6. cadastrar device com DevEUI/JoinEUI/AppKey;
7. iniciar join;
8. verificar eventos de join, uplink e decodificacao.

## 5. LR-FHSS

LR-FHSS usa saltos de frequencia e codificacao para tornar transmissao de longo alcance mais robusta. Ele e especialmente citado para redes densas e satelite, onde ha muitos dispositivos e interferencias. A ideia de prova e contrastar com LoRa CSS:

| Criterio | LoRa CSS | LR-FHSS |
| --- | --- | --- |
| Espalhamento | chirps | saltos de frequencia |
| Forca | simplicidade e ampla adocao | robustez e capacidade em cenarios densos |
| Uso | LoRaWAN terrestre comum | longo alcance, satelite, alta densidade |
| Limitacao | airtime alto em SF alto | depende de suporte regional/hardware |

## 6. Diagnostico rapido

| Sintoma | Causa provavel | Verificacao |
| --- | --- | --- |
| Join nao aparece | dispositivo fora da frequencia/sub-banda | plano regional, channel mask, gateway online |
| Join aparece mas falha | credenciais erradas | DevEUI, JoinEUI, AppKey, MAC version |
| Uplink sem payload legivel | codec ou FPort errado | codec da aplicacao, decoder, porta |
| Downlink nao chega | janela/classe/regiao | RX1/RX2, classe A/B/C, duty cycle |
| RSSI bom e SNR ruim | ruido/interferencia | canal, antena, ambiente RF |
| SNR bom e RSSI baixo | sinal fraco mas decodificavel | margem, SF, antena |
| ABP falha apos reset | contador reiniciado | FCntUp/FCntDown e persistencia |

## 7. Perguntas por tema

### LoRa PHY

1. Por que SF maior aumenta alcance?
2. Qual o efeito de BW maior?
3. Como FEC/CR afeta robustez e airtime?
4. O que e preambulo?
5. Qual a diferenca entre transceiver e concentrador?

### LoRaWAN

1. Quais componentes existem na arquitetura?
2. Classe A, B e C diferem em que?
3. Por que OTAA e recomendado?
4. O que o MIC protege?
5. Quando usar mensagem confirmada?

### ChirpStack

1. O que e tenant?
2. O que vai no device profile?
3. Como cadastrar um device OTAA?
4. Para que serve MQTT?
5. Como diagnosticar gateway offline?
