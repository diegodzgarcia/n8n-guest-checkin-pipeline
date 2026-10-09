// n8n Code node — "Run Once for Each Item", JavaScript.
// Derives analytical fields from the standardized check-in record.
// Null-safe: missing or invalid dates yield null instead of breaking the run.

const j = $json;

// ISO text -> Luxon DateTime, or null when empty/invalid
const toDate = (s) => {
  if (!s) return null;
  const d = DateTime.fromISO(s);
  return d.isValid ? d : null;
};

const checkin = toDate(j.data_checkin);
const checkout = toDate(j.data_checkout);
const reserva = toDate(j.data_reserva);
const nascimento = toDate(j.data_nascimento);

// age at check-in date (keeps historical profiles correct)
const idade = (checkin && nascimento)
  ? Math.floor(checkin.diff(nascimento, 'years').years)
  : null;

const faixa_etaria =
  idade === null ? 'Não informado' :
  idade < 18 ? 'Menor de 18' :
  idade < 25 ? '18-24' :
  idade < 35 ? '25-34' :
  idade < 45 ? '35-44' :
  idade < 55 ? '45-54' :
  idade < 65 ? '55-64' : '65+';

// masked document for display (the pseudonymous id is generated in the Crypto node)
const doc = String(j.documento ?? '');
const documento_mascarado = doc.length > 5
  ? doc.slice(0, 3) + '*****' + doc.slice(-2)
  : null;

return {
  json: {
    ...j,
    idade,
    faixa_etaria,
    noites: (checkin && checkout) ? checkout.diff(checkin, 'days').days : null,
    antecedencia_reserva_dias: (checkin && reserva) ? checkin.diff(reserva, 'days').days : null,
    dia_semana_checkin: checkin ? checkin.setLocale('pt-BR').toFormat('cccc') : null,
    mes_checkin: checkin ? checkin.toFormat('yyyy-MM') : null,
    documento_mascarado,
  }
};
