# Fichas de Fontes Analisadas

As fichas abaixo resumem as paginas usadas na expansao. Elas indicam o que estudar de cada grupo, sem copiar o conteudo original.

## TTN LoRaWAN

Fonte principal: <https://www.thethingsnetwork.org/docs/lorawan/>

Paginas analisadas: pagina principal e subpaginas sobre arquitetura, classes, ADR, enderecamento, ativacao, seguranca, RSSI/SNR, EIRP/ERP, duty cycle, planos de frequencia, parametros regionais, tipos de mensagem, formato PHY, FEC/code rate, antenas, conectores, concentradores, transceivers, limitacoes e glossario.

O que extrair para prova:

- LoRa e LoRaWAN nao sao sinonimos.
- Gateway e uma ponte radio-IP; Network Server deduplica, valida e gerencia MAC.
- Classe A minimiza consumo; Classe C prioriza downlink e consome mais.
- ADR reduz airtime quando ha margem de enlace.
- Duty cycle limita tempo de transmissao em regioes como EU868.
- RSSI mede potencia; SNR mede relacao sinal-ruido.
- EIRP soma potencia, ganho e perdas em dB.
- Frame counters e MIC protegem contra replay e adulteracao.

Erros comuns:

- ignorar downlink como gargalo;
- configurar regiao errada;
- usar ACK em toda telemetria;
- escolher SF alto sem necessidade.

## ChirpStack v4

Fonte principal: <https://www.chirpstack.io/docs/>

Paginas analisadas: introducao, arquitetura, configuracao, tenants, applications, device profiles, devices, gateways, integracao MQTT, Gateway Bridge, MQTT Forwarder e Concentratord.

O que extrair para prova:

- Tenant organiza perfis, gateways, aplicacoes e usuarios.
- Application agrupa devices e integracoes.
- Device profile define regiao, MAC version, classes e parametros LoRaWAN.
- Gateway precisa aparecer online antes de diagnosticar o device.
- MQTT transporta eventos e comandos.
- Gateway Bridge/MQTT Forwarder ficam entre gateway e servidor.

Erros comuns:

- cadastrar device em profile de regiao errada;
- confundir gateway EUI com DevEUI;
- ignorar logs de MQTT/Gateway Bridge;
- tentar downlink classe A sem uplink recente.

## MOKO LoRa e LoRaWAN

Fonte em portugues: <https://www.mokolora.com/pt/full-understanding-of-lora-and-lorawan/>

O que extrair para prova:

- visao geral de LoRa e LoRaWAN;
- elementos de rede;
- papel de dispositivos finais e gateways;
- casos de uso e vantagens de LPWAN.

Uso no material: apoio conceitual em portugues, sem depender da traducao literal.

## LoRa Alliance

Fontes:

- <https://resources.lora-alliance.org/getting-started-with-lorawan/ts001-1-0-4-lorawan-l2-1-0-4-specification>
- <https://resources.lora-alliance.org/document/rp002-1-0-5-lorawan-regional-parameters>

O que extrair para prova:

- LoRaWAN L2 define MAC, classes, seguranca, ativacao e mensagens.
- Regional Parameters define frequencias, data rates, potencia e janelas por regiao.
- A especificacao e referencia normativa; para prova, use os resumos e tabelas locais.

## Video indicado no email

Fonte: <https://www.youtube.com/watch?v=9NjgRWlvw44>

Status: link preservado como referencia secundaria. O material local nao depende da transcricao do video para funcionar offline.

Topicos associados:

- revisao geral de LoRaWAN;
- arquitetura;
- conceitos de dispositivos, gateways e servidores;
- boas praticas de rede.
