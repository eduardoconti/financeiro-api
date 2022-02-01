SELECT
    SUM(d.valor) as total,
    SUM(CASE WHEN d.pago = false THEN d.valor END) as totalOpen,
    SUM(CASE WHEN d.pago = true THEN d.valor END) as totalPayed   
FROM
    despesas d
WHERE
    d.user_id = $1
    AND CASE
        WHEN (cast ($2 as numeric)) IS NULL THEN true
        ELSE date_part('year', d.vencimento) = $2
    END
     AND CASE
        WHEN (cast ($3 as numeric)) IS NULL THEN true
        ELSE date_part('month', d.vencimento) = $3
    END

