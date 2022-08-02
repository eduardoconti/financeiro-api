select
  to_char(d.vencimento, 'YYYYMM') as "month",
  cast(SUM(d.valor) as integer) as total,
  cast(
    coalesce(
      SUM(
        case
          when d.pago = false then d.valor
        end
      ),
      0
    ) as integer
  ) as "totalOpen",
  cast(
    coalesce(
      SUM(
        case
          when d.pago = true then d.valor
        end
      ),
      0
    ) as integer
  ) as "totalPayed",
  cast(count(d.*) as integer) as "quantity",
  array_agg(
    json_build_object(
      'id',
      d.id,
      'descricao',
      d.descricao,
      'valor',
      d.valor,
      'vencimento',
      d.vencimento,
      'pagamento',
      d.pagamento,
      'pago',
      d.pago,
      'carteira',
      json_build_object('id', cr.id, 'descricao', cr.descricao),
      'categoria',
      json_build_object('id', ct.id, 'descricao', ct.descricao),
      'createdAt',
      d.created_at,
      'updatedAt',
      d.updated_at
    )
  ) as data
from
  despesas d
  inner join carteiras cr on cr.id = d.carteira_id
  inner join categorias ct on ct.id = d.categoria_id
where
  d.user_id = $1
  and date_part('year', d.vencimento) = date_part('year', d.created_at)
  and date_part('month', d.vencimento) <= date_part('month', d.created_at)
  AND CASE
    WHEN (cast($2 as date)) IS NOT NULL
    AND (cast($3 as date)) IS NOT NULL THEN d.vencimento BETWEEN $2
    AND $3
    WHEN(cast($2 as date)) IS NOT NULL
    AND (cast($3 as date)) IS NULL THEN d.vencimento >= $2
    ELSE true
  END
group by
  to_char(d.vencimento, 'YYYYMM')
order by
  to_char(d.vencimento, 'YYYYMM');