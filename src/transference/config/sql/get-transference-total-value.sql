SELECT
    SUM(t.valor) as total,
    SUM(
        CASE
            WHEN t.pago = false THEN t.valor
        END
    ) as "totalOpen",
    SUM(
        CASE
            WHEN t.pago = true THEN t.valor
        END
    ) as "totalPayed"
FROM
    transferencias t
WHERE
    t.user_id = $1
    AND CASE
        WHEN (cast($2 as date)) IS NOT NULL
        AND (cast($3 as date)) IS NOT NULL THEN t.transferencia BETWEEN $2
        AND $3
        WHEN(cast($2 as date)) IS NOT NULL
        AND (cast($3 as date)) IS NULL THEN t.transferencia >= $2
        ELSE true
    END