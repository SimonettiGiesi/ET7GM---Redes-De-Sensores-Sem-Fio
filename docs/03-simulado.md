# Simulado Comentado

## Parte 1 - Conceitos

### 1. Qual a diferenca entre LoRa e LoRaWAN?

**Resposta:** LoRa e a camada fisica de radio, baseada em Chirp Spread Spectrum. LoRaWAN e o protocolo de rede/MAC que define arquitetura, classes, seguranca, ativacao, ADR, mensagens e parametros regionais.

Comentario: em prova, nunca trate LoRaWAN como modulacao.

### 2. Por que aumentar o SF aumenta o alcance e diminui a taxa?

**Resposta:** SF maior espalha mais a informacao e permite decodificar sinais mais fracos, inclusive com SNR mais negativo. Como `Tsym = 2^SF/BW`, o tempo de simbolo aumenta exponencialmente, entao a taxa cai e o airtime cresce.

### 3. Por que downlink deve ser economizado em LoRaWAN?

**Resposta:** Downlink ocupa transmissao do gateway, depende de janelas RX do dispositivo e pode estar sujeito a duty cycle/limites regionais. Muitos downlinks e ACKs reduzem a capacidade da rede.

### 4. Quando ADR e recomendado?

**Resposta:** ADR e recomendado para dispositivos fixos ou com canal relativamente estavel. Ele usa historico de enlace para reduzir SF/potencia quando ha margem. Para dispositivos moveis, pode ser inadequado porque a qualidade muda rapido.

### 5. O gateway descriptografa o payload de aplicacao?

**Resposta:** Nao. O gateway encaminha quadros e metadados. A seguranca e processada nos servidores; o payload de aplicacao e protegido pela AppSKey.

### 6. O que e LR-FHSS e por que ele existe?

**Resposta:** LR-FHSS e uma camada fisica de longo alcance baseada em saltos de frequencia estreitos e codificacao robusta. Ela aumenta robustez e capacidade em cenarios densos, de longo alcance e satelite, mas nao e uma tecnologia de alta taxa.

### 7. Qual a diferenca entre OTAA e ABP?

**Resposta:** OTAA faz join e deriva chaves de sessao dinamicamente. ABP usa parametros e chaves gravados manualmente. OTAA e preferivel por seguranca, administracao e menor risco de contador invalido.

### 8. O que parametros regionais definem?

**Resposta:** Frequencias, data rates, potencia, mascaras de canal, RX1/RX2, duty cycle ou dwell time e restricoes de operacao. Se regiao/sub-banda estiver errada, join e uplinks podem falhar.

### 9. Para que serve o ChirpStack?

**Resposta:** ChirpStack e uma pilha open-source LoRaWAN que fornece servidor de rede/aplicacao, cadastro de gateways, devices, perfis, integracoes e APIs. Normalmente usa MQTT, banco e componentes como Gateway Bridge.

### 10. O que conferir se um dispositivo nao faz join no ChirpStack?

**Resposta:** Regiao e sub-banda, gateway online, DevEUI, JoinEUI, AppKey, MAC version, RX2, logs do gateway, MQTT e eventos de join no ChirpStack.

## Parte 2 - Calculos

### 11. Converta 20 dBm para mW.

1. `P_mW = 10^(20/10)`
2. `P_mW = 10^2`
3. `P_mW = 100 mW`

**Resposta:** 20 dBm = 100 mW.

### 12. Converta 100 mW para dBm.

1. `dBm = 10 log10(100)`
2. `dBm = 10 * 2`
3. `dBm = 20 dBm`

**Resposta:** 100 mW = 20 dBm.

### 13. Calcule EIRP para Ptx 14 dBm, antena 5 dBi e perdas 2 dB.

1. `EIRP = Ptx + Gant - perdas`
2. `EIRP = 14 + 5 - 2`
3. `EIRP = 17 dBm`

**Resposta:** 17 dBm.

### 14. Calcule ERP do caso anterior.

1. `ERP = EIRP - 2,15`
2. `ERP = 17 - 2,15`
3. `ERP = 14,85 dBm`

**Resposta:** 14,85 dBm.

### 15. Um enlace tem Ptx 14 dBm, Gtx 2 dBi, Grx 2 dBi, perdas 2 dB e sensibilidade -137 dBm. Qual a perda maxima?

1. `Perda_maxima = 14 + 2 + 2 - 2 - (-137)`
2. `Perda_maxima = 153 dB`

**Resposta:** 153 dB.

### 16. No enlace anterior, se a perda de caminho for 148 dB, qual a margem?

1. `Prx = 14 + 2 + 2 - 2 - 148`
2. `Prx = -132 dBm`
3. `Margem = -132 - (-137)`
4. `Margem = 5 dB`

**Resposta:** margem de 5 dB.

### 17. Calcule o tempo de simbolo para SF7 e BW 125 kHz.

1. `Tsym = 2^7 / 125000`
2. `Tsym = 128 / 125000`
3. `Tsym = 0,001024 s`
4. `Tsym = 1,024 ms`

**Resposta:** 1,024 ms.

### 18. Calcule a taxa bruta aproximada para SF7, BW 125 kHz, CR 4/5.

1. `Rs = 125000/128 = 976,56 simbolos/s`
2. `Rb = SF * Rs * 4/(4+CR)`
3. `Rb = 7 * 976,56 * 4/5`
4. `Rb = 5468,75 bit/s`

**Resposta:** aproximadamente 5,47 kbit/s.

### 19. Calcule airtime para SF7, BW 125 kHz, CR 4/5, payload 20 bytes, preambulo 8, CRC ligado e cabecalho explicito.

1. `Tsym = 2^7/125000 = 1,024 ms`
2. `DE = 0`, `IH = 0`, `CRC = 1`, `CR = 1`
3. Numerador: `8*20 - 4*7 + 28 + 16*1 - 20*0 = 176`
4. Denominador: `4*(7 - 2*0) = 28`
5. `ceil(176/28) = 7`
6. `payloadSymbNb = 8 + 7*(1+4) = 43`
7. `Tpreamble = (8 + 4,25)*1,024 = 12,544 ms`
8. `Tpayload = 43*1,024 = 44,032 ms`
9. `Tpacket = 56,576 ms`

**Resposta:** aproximadamente 56,6 ms.

### 20. Com airtime 56,576 ms e duty cycle 1%, qual a espera minima?

1. `duty = 0,01`
2. `Espera = 0,056576 * (1/0,01 - 1)`
3. `Espera = 0,056576 * 99`
4. `Espera = 5,601 s`

**Resposta:** esperar aproximadamente 5,6 s antes da proxima transmissao no mesmo limite.

### 21. BW 125 kHz, NF 6 dB, RSSI -120 dBm. Calcule o ruido e SNR.

1. `N = -174 + 10log10(125000) + 6`
2. `N = -174 + 50,97 + 6`
3. `N = -117,03 dBm`
4. `SNR = -120 - (-117,03)`
5. `SNR = -2,97 dB`

**Resposta:** ruido aproximado -117,03 dBm; SNR aproximado -2,97 dB.

### 22. Dispositivo em SF10 tem SNR medido -8 dB. Se o SNR minimo de SF10 e -15 dB e a margem ADR configurada e 2,5 dB, quantos passos de 3 dB existem?

1. `Margem_link = -8 - (-15) = 7 dB`
2. `Margem_util = 7 - 2,5 = 4,5 dB`
3. `Passos = floor(4,5/3) = 1`

**Resposta:** 1 passo de 3 dB.

## Parte 3 - Respostas curtas prontas

### 23. Por que SF12 deve ser evitado quando SF7 fecha o enlace?

Porque SF12 aumenta muito o airtime, reduz taxa, consome mais energia e ocupa mais o canal. Se SF7 fecha com margem, ele aumenta a capacidade da rede.

### 24. Um dispositivo ABP parou depois de reset. Qual suspeita?

Contador de frame reiniciado ou fora de sincronismo. Em ABP, contadores precisam ser preservados; caso contrario o servidor pode rejeitar quadros por seguranca.

### 25. O que significa gateway receber o mesmo uplink em varios gateways?

E normal em LoRaWAN. O Network Server deduplica os quadros e pode usar os metadados para escolher melhor caminho de downlink e estimar qualidade do enlace.
