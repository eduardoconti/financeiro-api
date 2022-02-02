SELECT 
	concat( date_part('year', d.vencimento),RIGHT(concat('0',CAST(date_part('month', d.vencimento) as VARCHAR(2))),2)) as month, json_build_object(
	'month', date_part('month', d.vencimento),
    'total',SUM(d.valor),
    'totalOpen',SUM(CASE WHEN d.pago = false THEN d.valor END),
    'totalPayed',SUM(CASE WHEN d.pago = true THEN d.valor END),
    'quantity', count(d.*),
    'data',json_agg(
        json_build_object( 'id',d.id,
        'descricao',d.descricao,
        'valor', d.valor,
        'vencimento', d.vencimento,
        'pagamento', d.pagamento,
        'pago', d.pago,
        'carteira', json_build_object('id', cr.id, 'descricao', cr.descricao),
        'categoria', json_build_object('id', ct.id, 'descricao', ct.descricao))
        )
) as data
  
FROM
    despesas d
INNER JOIN carteiras cr ON cr.id = d.carteira_id
INNER JOIN categorias ct on ct.id = d.categoria_id
WHERE
    d.user_id = $1
    -- AND CASE
    --     WHEN (cast ($2 as numeric)) IS NULL THEN true
    --     ELSE date_part('year', d.vencimento) = $2
    -- END
    -- AND CASE
    --     WHEN (cast ($3 as boolean)) IS NULL THEN true
    --     ELSE d.pago = $3
    -- END
    GROUP BY d.vencimento
    ORDER BY date_part('month', d.vencimento)