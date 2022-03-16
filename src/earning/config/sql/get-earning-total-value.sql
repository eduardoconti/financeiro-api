SELECT
    SUM(r.valor) as total,
    SUM(
        CASE
            WHEN r.pago = false THEN r.valor
        END
    ) as "totalOpen",
    SUM(
        CASE
            WHEN r.pago = true THEN r.valor
        END
    ) as "totalPayed"
FROM
    receitas r
WHERE
    r.user_id = $1
    AND CASE
        WHEN (cast($2 as date)) IS NOT NULL
        AND (cast($3 as date)) IS NOT NULL THEN r.pagamento BETWEEN $2
        AND $3
        WHEN(cast($2 as date)) IS NOT NULL
        AND (cast($3 as date)) IS NULL THEN r.pagamento >= $2
        ELSE true
    END