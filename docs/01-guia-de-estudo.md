# Guia de Estudo - ET7GM

Este guia resume o conhecimento minimo para a prova de suficiencia em Redes de Sensores Sem Fio, com foco em LoRa/LR-FHSS, LoRaWAN e ChirpStack.

## 1. Fundamentos de RSSF, IoT e LPWAN

Uma rede de sensores sem fio (RSSF) conecta nos sensores/atuadores que medem grandezas fisicas, processam pouco localmente e enviam dados por radio. Em IoT, esses nos costumam ser alimentados por bateria, precisam operar por meses ou anos e enviam pacotes pequenos.

Pontos que quase sempre aparecem em prova:

- **Trade-off principal:** alcance, taxa de dados, consumo e latencia nao melhoram todos ao mesmo tempo.
- **LPWAN:** redes de baixa potencia e longo alcance, boas para telemetria esparsa, ruins para grande volume de dados ou baixa latencia.
- **Topologia LoRaWAN:** normalmente estrela-de-estrelas: dispositivos falam com gateways; gateways encaminham para servidor de rede por IP.
- **Gateway nao e roteador IP do dispositivo:** ele repassa quadros LoRaWAN, mas nao termina a seguranca de aplicacao.
- **Downlink e caro:** ocupa gateway, consome janelas de recepcao e pode limitar capacidade.

Comparacao rapida:

| Tecnologia | Pontos fortes | Limitacoes |
| --- | --- | --- |
| BLE | baixo consumo, curto alcance, celular como gateway | alcance pequeno |
| Wi-Fi | alta taxa e IP nativo | alto consumo |
| Zigbee/802.15.4 | malha local, baixo consumo | alcance menor que LPWAN |
| LoRaWAN | longo alcance, baixo consumo, rede publica/privada | baixa taxa, downlink limitado |
| NB-IoT/LTE-M | rede celular gerenciada | custo/modem/operadora |

## 2. LoRa

LoRa e a camada fisica de radio baseada em **Chirp Spread Spectrum (CSS)**. Ela define como os bits viram sinais no ar. LoRaWAN, por outro lado, e o protocolo MAC/rede que usa LoRa e LR-FHSS como camada fisica.

Parametros importantes:

- **SF (Spreading Factor):** normalmente SF7 a SF12. Quanto maior o SF, maior o alcance e a robustez, mas menor a taxa e maior o airtime.
- **BW (Bandwidth):** largura de banda, usualmente 125 kHz, 250 kHz ou 500 kHz. BW maior aumenta taxa e reduz airtime, mas reduz sensibilidade.
- **CR (Coding Rate):** codificacao de erro, como 4/5, 4/6, 4/7, 4/8. Maior protecao aumenta airtime.
- **RSSI:** potencia recebida em dBm.
- **SNR:** relacao sinal-ruido em dB. Em LoRa, quadros podem ser decodificados mesmo com SNR negativo.
- **Sensibilidade:** menor potencia recebida ainda decodificavel.
- **Link budget:** diferenca entre potencia transmitida equivalente e sensibilidade, ajustada por ganhos/perdas.

Regra de prova: se aumentar SF, o pacote fica mais robusto, mas o tempo no ar cresce muito. Como `Tsym = 2^SF / BW`, subir um SF aproximadamente dobra o tempo de simbolo.

## 3. LR-FHSS

LR-FHSS significa **Long Range - Frequency Hopping Spread Spectrum**. Ele tambem pode ser usado dentro do ecossistema LoRaWAN, mas nao e o mesmo que LoRa CSS.

Ideia central:

- LoRa CSS espalha o sinal em chirps dentro de uma banda.
- LR-FHSS usa saltos de frequencia estreitos e codificacao robusta.
- O pacote e dividido/transmitido de forma que a rede possa recuperar a mensagem mesmo com interferencia em partes da transmissao.

Quando citar LR-FHSS:

- bom para redes densas, muitos dispositivos e uplinks pequenos;
- util em cenarios de longo alcance e satelite;
- melhora robustez contra interferencia e colisoes;
- nao transforma LoRaWAN em rede de alta taxa;
- a disponibilidade depende de hardware, regiao e suporte do network server.

## 4. LoRaWAN

LoRaWAN define a camada MAC, seguranca, ativacao, classes, controle de taxa e integracao com servidores.

### Arquitetura

Componentes:

- **End device:** sensor/atuador, geralmente bateria, transmite uplinks.
- **Gateway:** recebe LoRa/LR-FHSS e encaminha por IP ao servidor. Um uplink pode chegar a varios gateways.
- **Network Server:** remove duplicados, valida MIC, controla MAC, ADR e escolhe gateway para downlink.
- **Join Server:** processa OTAA e deriva chaves de sessao.
- **Application Server:** recebe payload da aplicacao, normalmente depois de descriptografado com AppSKey.

Fluxo de uplink:

1. Dispositivo transmite quadro LoRaWAN.
2. Um ou mais gateways recebem.
3. Gateways encaminham metadados e PHY payload.
4. Network Server valida, deduplica e processa MAC.
5. Application Server entrega evento para a aplicacao.

### Classes

| Classe | Como funciona | Uso tipico |
| --- | --- | --- |
| A | Todo uplink abre duas janelas curtas de downlink | padrao; menor consumo |
| B | Beacons sincronizam janelas extras agendadas | downlink previsivel |
| C | receptor quase sempre aberto | atuadores alimentados pela rede |

Classe A e obrigatoria para todos os dispositivos. Classes B e C sao opcionais.

### Ativacao

**OTAA** e o modo recomendado. O dispositivo envia Join Request, recebe Join Accept e deriva chaves de sessao. Vantagens: chaves renovadas, melhor seguranca, melhor administracao.

**ABP** grava parametros e chaves manualmente. E simples, mas mais sujeito a erro de contador, reuso de chaves e problemas de seguranca.

### Seguranca

LoRaWAN usa AES-128. A rede verifica integridade com MIC e separa chaves de rede e de aplicacao. Em termos praticos:

- chaves de rede protegem autenticidade e controle MAC;
- AppSKey protege o payload de aplicacao;
- OTAA permite derivar chaves de sessao;
- DevEUI identifica o dispositivo; JoinEUI/AppEUI identifica o dominio de join; AppKey/NwkKey sao segredos.

### ADR

ADR significa **Adaptive Data Rate**. O servidor usa historico de qualidade do link para ajustar SF e potencia. Se o link tem margem, pode reduzir SF ou potencia, diminuindo airtime e consumo. Se o dispositivo se move muito, ADR pode ser inadequado porque a qualidade do canal varia rapido.

### Uplink e downlink

Uplink e a direcao dispositivo -> rede. Downlink e rede -> dispositivo. Em LoRaWAN, downlink e recurso escasso:

- gateway transmite e pode ficar indisponivel para receber no mesmo canal/tempo;
- dispositivos classe A so recebem depois de uplink;
- duty cycle ou limites regionais podem restringir transmissao;
- ACK em excesso reduz capacidade.

## 5. Parametros Regionais

LoRaWAN depende de plano regional. Errar a regiao impede join/uplink correto.

| Regiao | Caracteristicas de prova |
| --- | --- |
| EU868 | 863-870 MHz, canais como 868.1/868.3/868.5 MHz, duty cycle importante |
| US915 | 902-928 MHz, muitos canais, uso de sub-bands/channel mask |
| AU915/Brasil | 915-928 MHz em muitos cenarios; configurar sub-banda coerente no gateway, servidor e dispositivo |

Para prova, responda assim: parametros regionais definem frequencias, data rates, potencia, janelas RX1/RX2, dwell time/duty cycle e mascaras de canal.

## 6. ChirpStack

ChirpStack e uma pilha open-source para LoRaWAN. Na versao 4, o componente principal atua como servidor LoRaWAN e expositor de integracoes/API, usando banco e broker conforme instalacao.

Componentes comuns:

- **ChirpStack:** Network Server/Application Server na pilha v4.
- **ChirpStack Gateway Bridge:** converte protocolos de gateway para MQTT.
- **MQTT broker:** transporte de eventos e comandos.
- **PostgreSQL:** persistencia.
- **Redis:** cache/filas/estado conforme instalacao.
- **Gateways:** Semtech UDP packet forwarder, Basics Station ou MQTT forwarder, dependendo do setup.

Entidades de cadastro:

- **Tenant:** organizacao/dono logico.
- **Application:** grupo de dispositivos de uma aplicacao.
- **Device profile:** regiao, MAC version, classe, codecs e capacidades.
- **Device:** DevEUI, JoinEUI, chaves e parametros de ativacao.
- **Gateway:** concentrador LoRaWAN fisico, com Gateway ID/EUI.

Fluxo pratico para cadastrar OTAA:

1. Configurar regiao correta no ChirpStack.
2. Cadastrar gateway e confirmar que esta online.
3. Criar tenant e application.
4. Criar device profile com MAC version e regiao corretas.
5. Cadastrar device com DevEUI, JoinEUI e AppKey.
6. Fazer join no dispositivo.
7. Conferir eventos de join e uplink.

Troubleshooting:

- gateway offline: conferir rede IP, MQTT, Gateway Bridge e logs;
- join nao ocorre: conferir regiao, sub-banda, DevEUI, JoinEUI, AppKey e RX2;
- uplink chega sem payload decodificado: conferir codec e FPort;
- downlink falha: conferir classe, janelas RX, duty cycle, gateway escolhido e fila;
- contador invalido: problema comum em ABP ou reset sem persistencia.

## 7. Frases prontas para prova

- LoRa e camada fisica; LoRaWAN e protocolo MAC/rede.
- Aumentar SF aumenta alcance e airtime; reduzir SF aumenta taxa e reduz consumo.
- Gateway LoRaWAN nao descriptografa payload de aplicacao; ele encaminha quadros para o servidor.
- OTAA e preferivel a ABP porque deriva chaves de sessao e reduz problemas de seguranca/contador.
- ADR e bom para dispositivos fixos; para dispositivos moveis pode reagir tarde.
- Downlink deve ser economizado porque consome capacidade de gateway e depende de janelas de recepcao.
- O plano regional precisa bater entre dispositivo, gateway e network server.
