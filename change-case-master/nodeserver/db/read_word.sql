select * from savedwords
where word ~* $1
and externalid = $2;
