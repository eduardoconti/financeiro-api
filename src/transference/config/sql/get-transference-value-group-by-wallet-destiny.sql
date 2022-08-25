SELECT
    SUM(t.valor) valor,
    c.descricao descricao,
    c.id id
FROM
    transferencias t
    INNER JOIN carteiras c ON c.id = t.carteira_destino_id
WHERE
    t.user_id = $1
    AND CASE
        WHEN (cast($2 as timestamp)) IS NOT NULL
        AND (cast($3 as timestamp)) IS NOT NULL THEN t.transferencia BETWEEN $2
        AND $3
        WHEN(cast($2 as timestamp)) IS NOT NULL
        AND (cast($3 as timestamp)) IS NULL THEN t.transferencia >= $2
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