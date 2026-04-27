# ET7GM - Redes de Sensores Sem Fio

Material offline em portugues para a prova de suficiencia de **ET7GM - Redes de Sensores Sem Fio**.

## Como usar durante a prova

Abra o arquivo [`index.html`](index.html) diretamente no navegador. Ele nao usa CDN, internet, bibliotecas externas nem servidor local. As calculadoras funcionam com JavaScript local em [`assets/calculadoras.js`](assets/calculadoras.js).

O conteudo em Markdown esta em [`docs/`](docs/) para leitura pelo GitHub e revisao rapida.

## Dados da prova

- Disciplina: ET7GM - Redes de Sensores Sem Fio
- Data: 26/05/2026
- Local: sala CA-307
- Horario: 13:50 as 16:20
- Condicao informada: computador sem acesso a internet, com este repositorio disponivel localmente

## Mapa do material

- [`index.html`](index.html): guia offline completo, navegavel, com calculadoras.
- [`docs/01-guia-de-estudo.md`](docs/01-guia-de-estudo.md): resumo estruturado de RSSF, LoRa/LR-FHSS, LoRaWAN e ChirpStack.
- [`docs/02-formulas-e-calculos.md`](docs/02-formulas-e-calculos.md): formulas, passos e exemplos numericos.
- [`docs/03-simulado.md`](docs/03-simulado.md): questoes provaveis com respostas comentadas.
- [`docs/04-fontes.md`](docs/04-fontes.md): fontes principais e links de referencia.
- [`docs/05-base-expandida.md`](docs/05-base-expandida.md): base ampliada com LoRa PHY, LoRaWAN, ChirpStack, LR-FHSS e diagnostico.
- [`docs/06-fichas-fontes.md`](docs/06-fichas-fontes.md): fichas de fontes analisadas.
- [`data/source-map.json`](data/source-map.json): manifesto da coleta recursiva focada.
- [`Email suficiencia comunicação sem fio.pdf`](Email%20suficiencia%20comunica%C3%A7%C3%A3o%20sem%20fio.pdf): email original com as informacoes da prova.

## Escopo

O material foi montado para responder questoes sobre:

- fundamentos de RSSF, IoT e LPWAN;
- LoRa: CSS, SF, BW, CR, RSSI, SNR, sensibilidade, link budget e airtime;
- LR-FHSS: motivacao, diferencas para LoRa e uso em LoRaWAN;
- LoRaWAN: arquitetura, classes A/B/C, OTAA/ABP, seguranca, ADR, uplink/downlink e parametros regionais;
- ChirpStack: componentes, fluxo de dados, MQTT, perfis, gateways, dispositivos e troubleshooting.

## Expansao recursiva focada

O material foi expandido a partir de uma curadoria focada das fontes do exame:

- 32 paginas da documentacao TTN LoRaWAN;
- documentacao ChirpStack v4 sobre arquitetura, tenants, applications, device profiles, devices, gateways, MQTT e componentes de gateway;
- pagina MOKO em portugues sobre LoRa e LoRaWAN;
- referencias normativas LoRa Alliance TS001 e RP002;
- video indicado no email como referencia secundaria.

As paginas externas nao foram copiadas integralmente. O conteudo local e um resumo original em portugues para consulta offline.

## Fontes principais

- The Things Network: LoRaWAN, Spreading Factors, ADR, arquitetura, dB/dBm/dBi/dBd, EIRP/ERP, RSSI/SNR.
- ChirpStack Docs v4 e ChirpStack Architecture.
- LoRa Alliance: LoRaWAN L2 TS001-1.0.4 e Regional Parameters RP002.
- MOKO: Full Understanding of LoRa and LoRaWAN.
- Video indicado no email: `https://www.youtube.com/watch?v=9NjgRWlvw44`.
