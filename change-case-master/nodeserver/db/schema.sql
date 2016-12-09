create database changecase

CREATE TABLE USERS
(
  id serial primary key,
  name character varying(250),
  externalId character varying(50)
);

CREATE TABLE SAVEDWORDS
(
  word text,
  externalId character varying(50)
);
