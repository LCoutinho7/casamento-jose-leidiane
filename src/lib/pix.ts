/**
 * Monta o payload "PIX copia e cola" (BR Code, padrão EMV do Banco Central)
 * para uma chave estática, sem depender de gateway.
 */

interface PixPayloadInput {
  key: string;
  /** Nome do recebedor, até 25 caracteres. */
  name: string;
  /** Cidade do recebedor, até 15 caracteres. */
  city: string;
  amount?: number;
  /** Identificador da transação, até 25 caracteres alfanuméricos. */
  txid?: string;
}

const field = (id: string, value: string) => `${id}${String(value.length).padStart(2, '0')}${value}`;

const ascii = (value: string, max: number) =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Za-z0-9 ]/g, '')
    .slice(0, max);

function crc16(payload: string): string {
  let crc = 0xffff;
  for (const char of payload) {
    crc ^= char.charCodeAt(0) << 8;
    for (let i = 0; i < 8; i++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

export function buildPixPayload({ key, name, city, amount, txid = '***' }: PixPayloadInput): string {
  const merchantAccount = field('00', 'BR.GOV.BCB.PIX') + field('01', key);

  const payload =
    field('00', '01') +
    field('26', merchantAccount) +
    field('52', '0000') +
    field('53', '986') +
    (amount ? field('54', amount.toFixed(2)) : '') +
    field('58', 'BR') +
    field('59', ascii(name, 25)) +
    field('60', ascii(city, 15)) +
    field('62', field('05', ascii(txid, 25) || '***')) +
    '6304';

  return payload + crc16(payload);
}
