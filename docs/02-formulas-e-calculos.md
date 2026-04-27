# Formulas e Calculos

Use este arquivo quando a questao pedir conta. Cada bloco tem a formula, quando usar, exemplo resolvido e erro comum.

## 1. dBm, mW e W

Use para converter potencia absoluta.

Formulas:

```text
dBm = 10 log10(P_mW)
P_mW = 10^(dBm/10)
P_W = P_mW / 1000
```

Exemplo: converter 14 dBm para mW.

1. `P_mW = 10^(14/10)`
2. `P_mW = 10^1,4`
3. `P_mW = 25,12 mW`
4. Em watts: `25,12 / 1000 = 0,02512 W`

Erro comum: dB nao e potencia absoluta; dBm e absoluto porque referencia 1 mW.

## 2. dB, dBi e dBd

Use dB para relacao ou ganho/perda. Use dBi para ganho em relacao a antena isotropica. Use dBd para ganho em relacao a dipolo.

Formulas:

```text
dBi = dBd + 2,15
dBd = dBi - 2,15
```

Exemplo: antena de 5 dBi em dBd.

1. `dBd = 5 - 2,15`
2. `dBd = 2,85 dBd`

Erro comum: somar dBi e dBd como se fossem referencias iguais.

## 3. EIRP e ERP

Use para potencia irradiada equivalente.

Formulas:

```text
EIRP_dBm = Ptx_dBm + G_ant_dBi - perdas_dB
ERP_dBm = EIRP_dBm - 2,15
```

Exemplo: transmissor 14 dBm, antena 3 dBi, cabo 1,5 dB.

1. `EIRP = 14 + 3 - 1,5`
2. `EIRP = 15,5 dBm`
3. `ERP = 15,5 - 2,15 = 13,35 dBm`

Erro comum: esquecer perdas de cabo/conector.

## 4. Ruido, RSSI e SNR

Use para avaliar qualidade do enlace.

Formulas:

```text
N_dBm = -174 + 10 log10(BW_Hz) + NF
SNR_dB = RSSI_dBm - N_dBm
```

Exemplo: BW = 125 kHz, NF = 6 dB, RSSI = -120 dBm.

1. `10 log10(125000) = 50,97`
2. `N = -174 + 50,97 + 6`
3. `N = -117,03 dBm`
4. `SNR = -120 - (-117,03)`
5. `SNR = -2,97 dB`

Erro comum: achar que SNR negativo sempre significa falha. Em LoRa, dependendo do SF, SNR negativo ainda pode ser decodificado.

## 5. Link budget e margem

Use para estimar se o enlace fecha.

Formulas:

```text
Perda_maxima_dB = Ptx + Gtx + Grx - perdas - sensibilidade
Prx_dBm = Ptx + Gtx + Grx - perdas - perda_caminho
Margem_dB = Prx_dBm - sensibilidade_dBm
```

Exemplo: Ptx 14 dBm, Gtx 2 dBi, Grx 2 dBi, perdas 2 dB, sensibilidade -137 dBm.

1. `Perda_maxima = 14 + 2 + 2 - 2 - (-137)`
2. `Perda_maxima = 153 dB`
3. Se a perda de caminho for 145 dB:
4. `Prx = 14 + 2 + 2 - 2 - 145`
5. `Prx = -129 dBm`
6. `Margem = -129 - (-137) = 8 dB`

Erro comum: errar o sinal da sensibilidade, que normalmente e negativa.

## 6. Taxa de bits LoRa

Use para estimar taxa bruta aproximada.

Formulas:

```text
Rs = BW / 2^SF
Rb = SF * Rs * 4/(4+CR)
```

Onde `CR = 1` representa 4/5, `CR = 2` representa 4/6, `CR = 3` representa 4/7 e `CR = 4` representa 4/8.

Exemplo: SF7, BW 125 kHz, CR 4/5.

1. `Rs = 125000 / 2^7 = 976,56 simbolos/s`
2. `Rb = 7 * 976,56 * 4/(4+1)`
3. `Rb = 5468,75 bit/s`

Erro comum: tratar taxa bruta como throughput da aplicacao. LoRaWAN tem overhead, duty cycle e confirmacoes.

## 7. Tempo de simbolo

Use antes de calcular airtime.

Formula:

```text
Tsym = 2^SF / BW
```

Exemplo: SF12, BW 125 kHz.

1. `Tsym = 4096 / 125000`
2. `Tsym = 0,032768 s`
3. `Tsym = 32,768 ms`

Erro comum: esquecer que subir SF aumenta exponencialmente o tempo.

## 8. Airtime LoRa

Use para tempo no ar de um pacote LoRa.

Variaveis:

- `PL`: payload em bytes.
- `SF`: spreading factor.
- `BW`: largura de banda em Hz.
- `CR`: 1 para 4/5, 2 para 4/6, 3 para 4/7, 4 para 4/8.
- `CRC`: 1 se CRC habilitado, 0 se nao.
- `IH`: 0 para cabecalho explicito, 1 para cabecalho implicito.
- `DE`: 1 para low data rate optimization, 0 caso contrario.
- `Npreamble`: simbolos de preambulo, comum 8.

Formulas:

```text
Tsym = 2^SF / BW
Tpreamble = (Npreamble + 4,25) * Tsym
payloadSymbNb = 8 + max(ceil((8PL - 4SF + 28 + 16CRC - 20IH) / (4(SF - 2DE))) * (CR + 4), 0)
Tpayload = payloadSymbNb * Tsym
Tpacket = Tpreamble + Tpayload
```

Exemplo: SF7, BW 125 kHz, CR 4/5, PL 20 bytes, preambulo 8, CRC sim, cabecalho explicito.

1. `Tsym = 2^7 / 125000 = 0,001024 s = 1,024 ms`
2. `DE = 0`
3. Numerador: `8*20 - 4*7 + 28 + 16*1 - 20*0 = 176`
4. Denominador: `4*(7 - 2*0) = 28`
5. `ceil(176/28) = 7`
6. `payloadSymbNb = 8 + 7*(1+4) = 43 simbolos`
7. `Tpreamble = (8 + 4,25)*1,024 = 12,544 ms`
8. `Tpayload = 43*1,024 = 44,032 ms`
9. `Tpacket = 56,576 ms`

Comparacao com SF12 no mesmo payload:

1. `Tsym = 4096/125000 = 32,768 ms`
2. `DE = 1`
3. Numerador: `160 - 48 + 28 + 16 = 156`
4. Denominador: `4*(12 - 2) = 40`
5. `ceil(156/40) = 4`
6. `payloadSymbNb = 8 + 4*5 = 28`
7. `Tpreamble = 401,408 ms`
8. `Tpayload = 917,504 ms`
9. `Tpacket = 1318,912 ms`

Erro comum: comparar apenas payload; preambulo e overhead tambem contam.

## 9. Duty cycle

Use para calcular espera minima entre transmissoes em regioes com duty cycle.

Formulas:

```text
Tempo_total_periodo = airtime / duty
Espera_minima = airtime * (1/duty - 1)
Tempo_maximo_por_hora = 3600 * duty
```

Exemplo: airtime 56,576 ms e duty cycle 1%.

1. `duty = 0,01`
2. `Espera = 0,056576 * (1/0,01 - 1)`
3. `Espera = 0,056576 * 99`
4. `Espera = 5,601 s`
5. Tempo total ate poder transmitir de novo: `5,6576 s`

Erro comum: usar 1% como `1` em vez de `0,01`.

## 10. Margem ADR

Use para estimar se o servidor pode reduzir SF ou potencia.

Tabela usual de SNR minimo aproximado:

| SF | SNR minimo |
| --- | --- |
| SF7 | -7,5 dB |
| SF8 | -10 dB |
| SF9 | -12,5 dB |
| SF10 | -15 dB |
| SF11 | -17,5 dB |
| SF12 | -20 dB |

Formulas:

```text
Margem_link = SNR_medido - SNR_minimo_do_SF
Margem_util = Margem_link - margem_ADR_configurada
Passos_de_3dB = floor(Margem_util / 3)
```

Exemplo: dispositivo em SF10, SNR medido -8 dB, margem ADR 2,5 dB.

1. `SNR_minimo(SF10) = -15 dB`
2. `Margem_link = -8 - (-15) = 7 dB`
3. `Margem_util = 7 - 2,5 = 4,5 dB`
4. `Passos = floor(4,5/3) = 1`
5. Interpretacao: existe uma folga de aproximadamente um passo de 3 dB.

Erro comum: usar RSSI no lugar de SNR para margem ADR.
