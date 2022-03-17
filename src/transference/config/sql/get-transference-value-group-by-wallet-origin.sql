SELECT
    SUM(t.valor) valor,
    c.descricao descricao,
    c.id id
FROM
    receitas t
    INNER JOIN carteiras c ON c.id = t.carteira_origem_id
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
    AND CASE
        WHEN (cast ($4 as boolean)) IS NULL THEN true
        ELSE t.pago = $4
    END
GROUP BY
    c.id
ORDER BY
    valor DESC