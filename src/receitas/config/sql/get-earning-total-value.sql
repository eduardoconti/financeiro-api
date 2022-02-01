SELECT
    SUM(r.valor) as total,
    SUM(CASE WHEN r.pago = false THEN r.valor END) as totalOpen,
    SUM(CASE WHEN r.pago = true THEN r.valor END) as totalPayed   
FROM
    receitas r
WHERE
    r.user_id = $1
    AND CASE
        WHEN (cast ($2 as numeric)) IS NULL THEN true
        ELSE date_part('year', r.pagamento) = $2
    END
     AND CASE
        WHEN (cast ($3 as numeric)) IS NULL THEN true
        ELSE date_part('month', r.pagamento) = $3
    END

