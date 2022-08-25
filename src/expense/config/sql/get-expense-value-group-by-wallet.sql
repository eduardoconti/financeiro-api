SELECT
    SUM(d.valor) valor,
    c.descricao descricao,
    c.id id
FROM
    despesas d
    INNER JOIN carteiras c ON c.id = d.carteira_id
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
    AND CASE
        WHEN (cast ($4 as boolean)) IS NULL THEN true
        ELSE d.pago = $4
    END
GROUP BY
    c.id
ORDER BY
    valor DESC