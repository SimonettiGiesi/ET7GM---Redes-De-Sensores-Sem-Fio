(function () {
  "use strict";

  const byId = (id) => document.getElementById(id);
  const fmt = (value, digits = 3) => {
    if (!Number.isFinite(value)) return "valor invalido";
    return Number(value.toFixed(digits)).toLocaleString("pt-BR");
  };
  const log10 = (value) => Math.log(value) / Math.LN10;
  const num = (id) => Number.parseFloat(byId(id).value);

  function setResult(id, text) {
    byId(id).textContent = text;
  }

  function calcPower() {
    const dbm = num("power-dbm");
    const mw = Math.pow(10, dbm / 10);
    const w = mw / 1000;
    const back = 10 * log10(mw);
    setResult(
      "power-result",
      [
        `P_mW = 10^(dBm/10) = 10^(${fmt(dbm, 2)}/10)`,
        `P_mW = ${fmt(mw, 4)} mW`,
        `P_W = ${fmt(mw, 4)} / 1000 = ${fmt(w, 6)} W`,
        `Conferencia: dBm = 10 log10(${fmt(mw, 4)}) = ${fmt(back, 3)} dBm`
      ].join("\n")
    );
  }

  function calcEirp() {
    const ptx = num("eirp-ptx");
    const gain = num("eirp-gain");
    const loss = num("eirp-loss");
    const eirp = ptx + gain - loss;
    const erp = eirp - 2.15;
    setResult(
      "eirp-result",
      [
        `EIRP = Ptx + G_ant(dBi) - perdas`,
        `EIRP = ${fmt(ptx)} + ${fmt(gain)} - ${fmt(loss)} = ${fmt(eirp)} dBm`,
        `ERP = EIRP - 2,15 = ${fmt(eirp)} - 2,15 = ${fmt(erp)} dBm`
      ].join("\n")
    );
  }

  function calcNoise() {
    const rssi = num("noise-rssi");
    const bwKhz = num("noise-bw");
    const nf = num("noise-nf");
    const bwHz = bwKhz * 1000;
    const thermal = 10 * log10(bwHz);
    const noise = -174 + thermal + nf;
    const snr = rssi - noise;
    setResult(
      "noise-result",
      [
        `N = -174 + 10 log10(BW_Hz) + NF`,
        `10 log10(${fmt(bwHz, 0)}) = ${fmt(thermal)} dB`,
        `N = -174 + ${fmt(thermal)} + ${fmt(nf)} = ${fmt(noise)} dBm`,
        `SNR = RSSI - N = ${fmt(rssi)} - (${fmt(noise)}) = ${fmt(snr)} dB`
      ].join("\n")
    );
  }

  function calcLink() {
    const ptx = num("link-ptx");
    const gtx = num("link-gtx");
    const grx = num("link-grx");
    const loss = num("link-loss");
    const sens = num("link-sens");
    const path = num("link-path");
    const maxPath = ptx + gtx + grx - loss - sens;
    const prx = ptx + gtx + grx - loss - path;
    const margin = prx - sens;
    setResult(
      "link-result",
      [
        `Perda maxima = Ptx + Gtx + Grx - perdas - sensibilidade`,
        `Perda maxima = ${fmt(ptx)} + ${fmt(gtx)} + ${fmt(grx)} - ${fmt(loss)} - (${fmt(sens)}) = ${fmt(maxPath)} dB`,
        `Prx = ${fmt(ptx)} + ${fmt(gtx)} + ${fmt(grx)} - ${fmt(loss)} - ${fmt(path)} = ${fmt(prx)} dBm`,
        `Margem = Prx - sensibilidade = ${fmt(prx)} - (${fmt(sens)}) = ${fmt(margin)} dB`,
        margin >= 0 ? "Resultado: o enlace fecha com essa margem." : "Resultado: o enlace nao fecha sem melhorar ganho, potencia, SF/sensibilidade ou reduzir perdas."
      ].join("\n")
    );
  }

  function lowDataRateOptimize(sf, bwHz, forced) {
    if (forced === "on") return 1;
    if (forced === "off") return 0;
    return sf >= 11 && bwHz === 125000 ? 1 : 0;
  }

  function airtimeMs(sf, bwHz, cr, payload, preamble, crc, ih, de) {
    const ts = Math.pow(2, sf) / bwHz;
    const numerator = 8 * payload - 4 * sf + 28 + 16 * crc - 20 * ih;
    const denominator = 4 * (sf - 2 * de);
    const ceilValue = Math.ceil(numerator / denominator);
    const payloadSymbols = 8 + Math.max(ceilValue * (cr + 4), 0);
    const tPreamble = (preamble + 4.25) * ts;
    const tPayload = payloadSymbols * ts;
    return {
      ts,
      rs: bwHz / Math.pow(2, sf),
      rb: sf * (bwHz / Math.pow(2, sf)) * (4 / (4 + cr)),
      numerator,
      denominator,
      ceilValue,
      payloadSymbols,
      tPreamble,
      tPayload,
      tPacket: tPreamble + tPayload
    };
  }

  function calcAirtime() {
    const sf = num("air-sf");
    const bwKhz = num("air-bw");
    const bwHz = bwKhz * 1000;
    const cr = num("air-cr");
    const payload = num("air-pl");
    const preamble = num("air-pre");
    const crc = byId("air-crc").value === "1" ? 1 : 0;
    const ih = byId("air-header").value === "implicit" ? 1 : 0;
    const de = lowDataRateOptimize(sf, bwHz, byId("air-de").value);
    const air = airtimeMs(sf, bwHz, cr, payload, preamble, crc, ih, de);
    setResult(
      "air-result",
      [
        `Tsym = 2^SF/BW = 2^${sf}/${fmt(bwHz, 0)} = ${fmt(air.ts * 1000, 4)} ms`,
        `Rs = BW/2^SF = ${fmt(air.rs, 3)} simbolos/s`,
        `Rb ~= SF * Rs * 4/(4+CR) = ${fmt(air.rb, 2)} bit/s`,
        `DE = ${de}; IH = ${ih}; CRC = ${crc}; CR = ${cr}`,
        `Numerador = 8PL - 4SF + 28 + 16CRC - 20IH = ${fmt(air.numerator, 0)}`,
        `Denominador = 4(SF - 2DE) = ${fmt(air.denominator, 0)}`,
        `ceil(${fmt(air.numerator, 0)}/${fmt(air.denominator, 0)}) = ${fmt(air.ceilValue, 0)}`,
        `payloadSymbNb = 8 + max(ceil * (CR+4), 0) = ${fmt(air.payloadSymbols, 0)} simbolos`,
        `Tpreamble = (${fmt(preamble)} + 4,25) * Tsym = ${fmt(air.tPreamble * 1000, 4)} ms`,
        `Tpayload = ${fmt(air.payloadSymbols, 0)} * Tsym = ${fmt(air.tPayload * 1000, 4)} ms`,
        `Tpacket = ${fmt(air.tPacket * 1000, 4)} ms`
      ].join("\n")
    );
  }

  function calcCompareAirtime() {
    const bwKhz = num("cmp-bw");
    const bwHz = bwKhz * 1000;
    const cr = num("cmp-cr");
    const payload = num("cmp-pl");
    const preamble = num("cmp-pre");
    const rows = [];
    for (let sf = 7; sf <= 12; sf += 1) {
      const de = lowDataRateOptimize(sf, bwHz, "auto");
      const air = airtimeMs(sf, bwHz, cr, payload, preamble, 1, 0, de);
      rows.push(`SF${sf}: Tsym=${fmt(air.ts * 1000, 3)} ms | airtime=${fmt(air.tPacket * 1000, 3)} ms | taxa~${fmt(air.rb, 1)} bit/s | DE=${de}`);
    }
    const sf7 = airtimeMs(7, bwHz, cr, payload, preamble, 1, 0, lowDataRateOptimize(7, bwHz, "auto")).tPacket;
    const sf12 = airtimeMs(12, bwHz, cr, payload, preamble, 1, 0, lowDataRateOptimize(12, bwHz, "auto")).tPacket;
    rows.push(`Comparacao: SF12 fica aproximadamente ${fmt(sf12 / sf7, 1)} vezes mais tempo no ar que SF7 neste caso.`);
    setResult("cmp-result", rows.join("\n"));
  }

  function calcDuty() {
    const airtimeMs = num("duty-air");
    const dutyPercent = num("duty-percent");
    const airtime = airtimeMs / 1000;
    const duty = dutyPercent / 100;
    const wait = airtime * (1 / duty - 1);
    const period = airtime / duty;
    const hour = 3600 * duty;
    setResult(
      "duty-result",
      [
        `duty = ${fmt(dutyPercent)}% = ${fmt(duty, 5)}`,
        `Espera = airtime * (1/duty - 1)`,
        `Espera = ${fmt(airtime, 6)} * (1/${fmt(duty, 5)} - 1) = ${fmt(wait, 4)} s`,
        `Periodo total minimo = airtime/duty = ${fmt(period, 4)} s`,
        `Tempo maximo transmitindo por hora = 3600*duty = ${fmt(hour, 3)} s`
      ].join("\n")
    );
  }

  function calcAdr() {
    const required = {
      7: -7.5,
      8: -10,
      9: -12.5,
      10: -15,
      11: -17.5,
      12: -20
    };
    const sf = num("adr-sf");
    const measured = num("adr-snr");
    const marginConfig = num("adr-margin");
    const minSnr = required[sf];
    const linkMargin = measured - minSnr;
    const useful = linkMargin - marginConfig;
    const steps = Math.floor(useful / 3);
    setResult(
      "adr-result",
      [
        `SNR minimo aproximado para SF${sf} = ${fmt(minSnr)} dB`,
        `Margem_link = SNR_medido - SNR_minimo = ${fmt(measured)} - (${fmt(minSnr)}) = ${fmt(linkMargin)} dB`,
        `Margem_util = ${fmt(linkMargin)} - ${fmt(marginConfig)} = ${fmt(useful)} dB`,
        `Passos de 3 dB = floor(${fmt(useful)}/3) = ${fmt(steps, 0)}`,
        steps > 0 ? "Interpretacao: ha folga para reduzir SF e/ou potencia, conforme politica ADR." : "Interpretacao: nao ha folga util suficiente para reduzir taxa/potencia."
      ].join("\n")
    );
  }

  function bind(ids, callback) {
    ids.forEach((id) => {
      const el = byId(id);
      if (el) {
        el.addEventListener("input", callback);
        el.addEventListener("change", callback);
      }
    });
    callback();
  }

  window.addEventListener("DOMContentLoaded", () => {
    bind(["power-dbm"], calcPower);
    bind(["eirp-ptx", "eirp-gain", "eirp-loss"], calcEirp);
    bind(["noise-rssi", "noise-bw", "noise-nf"], calcNoise);
    bind(["link-ptx", "link-gtx", "link-grx", "link-loss", "link-sens", "link-path"], calcLink);
    bind(["air-sf", "air-bw", "air-cr", "air-pl", "air-pre", "air-crc", "air-header", "air-de"], calcAirtime);
    bind(["cmp-bw", "cmp-cr", "cmp-pl", "cmp-pre"], calcCompareAirtime);
    bind(["duty-air", "duty-percent"], calcDuty);
    bind(["adr-sf", "adr-snr", "adr-margin"], calcAdr);
  });
})();
