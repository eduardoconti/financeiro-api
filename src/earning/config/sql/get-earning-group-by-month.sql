SELECT
    concat(
        date_part('year', r.pagamento),
        RIGHT(
            concat(
                '0',
                CAST(date_part('month', r.pagamento) as VARCHAR(2))
            ),
            2
        )
    ) as month,
    json_build_object(
        'month',
        date_part('month', r.pagamento),
        'total',
        SUM(r.valor),
        'totalOpen',
        SUM(
            CASE
                WHEN r.pago = false THEN r.valor
            END
        ),
        'totalPayed',
        SUM(
            CASE
                WHEN r.pago = true THEN r.valor
            END
        ),
        'quantity',
        count(r.*),
        'data',
        json_agg(
            json_build_object(
                'id',
                r.id,
                'descricao',
                r.descricao,
                'valor',
                r.valor,
                'pagamento',
                r.pagamento,
                'pago',
                r.pago,
                'createdAt',
                r.created_at,
                'updatedAt',
                r.updated_at,
                'carteira',
                json_build_object('id', cr.id, 'descricao', cr.descricao)
            )
        )
    ) as data
FROM
    receitas r
    INNER JOIN carteiras cr ON cr.id = r.carteira_id 
    WHERE r.user_id = $1
    AND CASE
        WHEN (cast($2 as timestamp)) IS NOT NULL
        AND (cast($3 as timestamp)) IS NOT NULL THEN r.pagamento BETWEEN $2
        AND $3
        WHEN(cast($2 as timestamp)) IS NOT NULL
        AND (cast($3 as timestamp)) IS NULL THEN r.pagamento >= $2
        ELSE true
    END
GROUP BY
    date_part('year', r.pagamento),
    date_part('month', r.pagamento)
ORDER BY
    date_part('month', r.pagamento)