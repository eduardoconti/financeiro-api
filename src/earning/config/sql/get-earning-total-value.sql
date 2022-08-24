SELECT
    coalesce(SUM(r.valor), 0) as total,
    coalesce(
        SUM(
            CASE
                WHEN r.pago = false THEN r.valor
            END
        ),
        0
    ) as "totalOpen",
    coalesce(
        SUM(
            CASE
                WHEN r.pago = true THEN r.valor
            END
        ),
        0
    ) as "totalPayed"
FROM
    receitas r
WHERE
    r.user_id = $1
    AND CASE
        WHEN (cast($2 as timestamp)) IS NOT NULL
        AND (cast($3 as timestamp)) IS NOT NULL THEN r.pagamento BETWEEN $2
        AND $3
        WHEN(cast($2 as timestamp)) IS NOT NULL
        AND (cast($3 as timestamp)) IS NULL THEN r.pagamento >= $2
        ELSE true
    END