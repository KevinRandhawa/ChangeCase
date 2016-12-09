delete from savedwords
  where word = $1
  and externalId = $2;
