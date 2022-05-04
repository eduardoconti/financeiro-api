SELECT
    SUM(d.valor) as total,
    SUM(
        CASE
            WHEN d.pago = false THEN d.valor
        END
    ) as "totalOpen",
    SUM(
        CASE
            WHEN d.pago = true THEN d.valor
        END
    ) as "totalPayed"
FROM
    despesas d
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