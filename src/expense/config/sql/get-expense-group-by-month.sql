SELECT
    concat(
        date_part('year', d.vencimento),
        RIGHT(
            concat(
                '0',
                CAST(date_part('month', d.vencimento) as VARCHAR(2))
            ),
            2
        )
    ) as month,
    json_build_object(
        'month',
        date_part('month', d.vencimento),
        'total',
        SUM(d.valor),
        'totalOpen',
        SUM(
            CASE
                WHEN d.pago = false THEN d.valor
            END
        ),
        'totalPayed',
        SUM(
            CASE
                WHEN d.pago = true THEN d.valor
            END
        ),
        'quantity',
        count(d.*),
        'data',
        json_agg(
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
        )
    ) as data
FROM
    despesas d
    INNER JOIN carteiras cr ON cr.id = d.carteira_id
    INNER JOIN categorias ct on ct.id = d.categoria_id
WHERE
    d.user_id = $1
    AND CASE
        WHEN (cast($2 as date)) IS NOT NULL
        AND (cast($3 as date)) IS NOT NULL THEN d.vencimento BETWEEN $2
        AND $3
        WHEN(cast($2 as date)) IS NOT NULL
        AND (cast($3 as date)) IS NULL THEN d.vencimento >= $2
        ELSE true
    END
GROUP BY 
    date_part('year', d.vencimento),
    date_part('month', d.vencimento)
ORDER BY
    date_part('month', d.vencimento)