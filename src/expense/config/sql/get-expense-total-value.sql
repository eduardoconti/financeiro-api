SELECT
    coalesce(SUM(d.valor), 0) as total,
    coalesce(
        SUM(
            CASE
                WHEN d.pago = false THEN d.valor
            END
        ),
        0
    ) as "totalOpen",
    coalesce(
        SUM(
            CASE
                WHEN d.pago = true THEN d.valor
            END
        ),
        0
    ) as "totalPayed"
FROM
    despesas d
WHERE
    d.user_id = $1
    AND CASE
        WHEN (cast($2 as timestamp)) IS NOT NULL
        AND (cast($3 as timestamp)) IS NOT NULL THEN d.vencimento BETWEEN $2
        AND $3
        WHEN(cast($2 as timestamp)) IS NOT NULL
        AND (cast($3 as timestamp)) IS NULL THEN d.vencimento >= $2
        ELSE true
    END