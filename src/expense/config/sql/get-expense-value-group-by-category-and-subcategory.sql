select
  cat.id,
  cat.value,
  cat.descricao as description,
  json_agg(
    json_build_object(
      'id',
      sub.id,
      'description',
      sub.descricao,
      'value',
      sub.valor
    )
  ) as "subCategoryData"
from
(
    select
      ca.descricao,
      ca.id,
      sum(d.valor) as value
    from
      despesas d
      inner join categorias ca on ca.id = d.categoria_id
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
    group by
      ca.id
    order by
      value
  ) cat
  left join(
    select
      SUM(d.valor) valor,
      sc.description descricao,
      sc.id,
      sc.category_id categoryid,
      d.sub_category_id
    from
      despesas d
      inner join sub_categories sc on sc.id = d.sub_category_id
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
    group by
      sc.id,
      d.sub_category_id
    order by
      valor desc
  ) sub on cat.id = sub.categoryid
group by
  cat.id,
  cat.value,
  cat.descricao
order by cat.value  