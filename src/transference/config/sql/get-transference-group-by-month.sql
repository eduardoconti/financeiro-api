SELECT
    concat(
        date_part('year', t.transferencia),
        RIGHT(
            concat(
                '0',
                CAST(date_part('month', t.transferencia) as VARCHAR(2))
            ),
            2
        )
    ) as month,
    json_build_object(
        'month',
        date_part('month', t.transferencia),
        'total',
        SUM(t.valor),
        'totalOpen',
        SUM(
            CASE
                WHEN t.pago = false THEN t.valor
            END
        ),
        'totalPayed',
        SUM(
            CASE
                WHEN t.pago = true THEN t.valor
            END
        ),
        'quantity',
        count(t.*),
        'data',
        json_agg(
            json_build_object(
                'id',
                t.id,
                'valor',
                t.valor,
                'transferencia',
                t.transferencia,
                'pago',
                t.pago,
                'carteiraOrigem',
                json_build_object('id', cr.id, 'descricao', cr.descricao),
                'carteiraDestino',
                json_build_object('id', crd.id, 'descricao', crd.descricao)
            )
        )
    ) as data
FROM
    transferencias t
    INNER JOIN carteiras cr ON cr.id = t.carteira_origem_id 
    INNER JOIN carteiras crd ON crd.id = t.carteira_destino_id 
    WHERE t.user_id = $1
    AND CASE
        WHEN (cast($2 as date)) IS NOT NULL
        AND (cast($3 as date)) IS NOT NULL THEN t.transferencia BETWEEN $2
        AND $3
        WHEN(cast($2 as date)) IS NOT NULL
        AND (cast($3 as date)) IS NULL THEN t.transferencia >= $2
        ELSE true
    END
GROUP BY
    date_part('year', t.transferencia),
    date_part('month', t.transferencia)
ORDER BY
    date_part('month', t.transferencia)