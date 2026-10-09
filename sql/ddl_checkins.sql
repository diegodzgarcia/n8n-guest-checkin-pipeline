-- Analytics layer for the guest check-in pipeline.
-- Receives only pseudonymized data: no name, document, phone or birth date.
-- Replace `your-project-id` with your GCP project ID.

CREATE SCHEMA IF NOT EXISTS `your-project-id.hospedagem`
OPTIONS (location = 'US');

CREATE TABLE IF NOT EXISTS `your-project-id.hospedagem.checkins` (
  hospede_id                STRING NOT NULL,  -- HMAC-SHA256 of the guest document
  envio_em                  TIMESTAMP,        -- form submission time
  data_reserva              DATE,             -- optional
  data_checkin              DATE,
  data_checkout             DATE,
  hora_chegada              TIME,
  num_hospedes              INT64,
  idade                     INT64,            -- age at check-in date
  faixa_etaria              STRING,
  sexo                      STRING,
  nacionalidade             STRING,
  profissao                 STRING,
  uf_residencia             STRING,
  cidade_residencia         STRING,
  origem_cidade             STRING,
  motivo_viagem             STRING,
  meio_transporte           STRING,
  primeira_vez_ubatuba      BOOL,
  noites                    INT64,
  antecedencia_reserva_dias INT64,            -- null when booking date is unknown
  dia_semana_checkin        STRING,
  mes_checkin               STRING,
  aceite_registro           BOOL,
  processado_em             TIMESTAMP
)
PARTITION BY data_checkin;
