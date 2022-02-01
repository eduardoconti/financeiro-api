SELECT
    SUM(d.valor) valor,
    c.descricao descricao,
    c.id id
FROM
    despesas d
    INNER JOIN carteiras c ON c.id = d.carteira_id
WHERE
    d.user_id = $1
    AND date_part('year', d.vencimento) = $2
    AND date_part('month', d.vencimento) = $3
    AND CASE
        WHEN (cast ($4 as boolean)) IS NULL THEN true
        ELSE d.pago = $4
    END
GROUP BY
    c.id
ORDER BY
    valor DESC