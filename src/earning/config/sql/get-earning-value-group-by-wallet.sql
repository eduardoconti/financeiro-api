SELECT
    SUM(r.valor) valor,
    c.descricao descricao,
    c.id id
FROM
    receitas r
    INNER JOIN carteiras c ON c.id = r.carteira_id
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
    AND CASE
        WHEN (cast ($4 as boolean)) IS NULL THEN true
        ELSE r.pago = $4
    END
GROUP BY
    c.id
ORDER BY
    valor DESC