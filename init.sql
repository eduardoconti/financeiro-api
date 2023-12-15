create table "sub_categories" ("id" SERIAL not null,
"user_id" uuid not null,
"description" text not null,
"category_id" integer not null,
constraint "PK_f319b046685c0e07287e76c5ab1" primary key ("id"));

create table "categorias" ("id" SERIAL not null,
"user_id" uuid not null,
"descricao" text not null,
constraint "PK_3886a26251605c571c6b4f861fe" primary key ("id"));

create table "despesas" ("id" SERIAL not null,
"descricao" text not null,
"valor" integer not null default '0',
"vencimento" TIMESTAMP not null default now(),
"created_at" TIMESTAMP not null default now(),
"updated_at" TIMESTAMP,
"pagamento" TIMESTAMP,
"pago" boolean not null default false,
"user_id" uuid not null,
"carteira_id" integer not null,
"categoria_id" integer not null,
"sub_category_id" integer not null,
"instalment_id" uuid,
"instalment" integer not null default '1',
constraint "PK_e56af303d820f51a6e6a007b380" primary key ("id"));

create table "transferencias" ("id" SERIAL not null,
"transferencia" TIMESTAMP not null default now(),
"pago" boolean not null default false,
"valor" integer not null default '0',
"user_id" uuid not null,
"carteira_origem_id" integer not null,
"carteira_destino_id" integer not null,
constraint "PK_68d981495936b6bdcfe66cf9047" primary key ("id"));

create table "carteiras" ("id" SERIAL not null,
"descricao" text not null,
"user_id" uuid not null,
"active" boolean not null default true,
constraint "PK_efe9dd56ffcf32615a6bb284619" primary key ("id"));

create table "receitas" ("id" SERIAL not null,
"descricao" text not null,
"valor" double precision not null default '0',
"pagamento" TIMESTAMP not null default now(),
"pago" boolean not null default false,
"created_at" TIMESTAMP not null default now(),
"updated_at" TIMESTAMP,
"user_id" uuid not null,
"carteira_id" integer not null,
constraint "PK_8312a0fa7e81b3c0643ccac8b36" primary key ("id"));

create table "users" ("id" uuid not null,
"password" text not null,
"login" text not null,
"nome" text not null,
"status" integer not null default '1',
"perfil" integer not null default '1',
constraint "UQ_2d443082eccd5198f95f2a36e2c" unique ("login"),
constraint "PK_a3ffb1c0c8416b9fc6f907b7433" primary key ("id"));

INSERT INTO public.users (id,"password",login,nome,status,perfil) VALUES
	 ('9d8ec318-bf2b-4d0c-ac0e-dec9682b36a2','$2b$10$CAuNOs1VnmmjCzSLeNilfuP1hS4rIGQKgFoPaLVgFxgskHz4zSV/W','user','User',1,1);
INSERT INTO public.carteiras (descricao,user_id,active) VALUES
	 ('Nubank','9d8ec318-bf2b-4d0c-ac0e-dec9682b36a2',true),
	 ('Itau','9d8ec318-bf2b-4d0c-ac0e-dec9682b36a2',true),
	 ('Bradesco','9d8ec318-bf2b-4d0c-ac0e-dec9682b36a2',true);

INSERT INTO public.categorias (user_id,descricao) VALUES
	 ('9d8ec318-bf2b-4d0c-ac0e-dec9682b36a2','Casa'),
	 ('9d8ec318-bf2b-4d0c-ac0e-dec9682b36a2','Alimentacao'),
	 ('9d8ec318-bf2b-4d0c-ac0e-dec9682b36a2','Saude');

INSERT INTO public.sub_categories (user_id,description,category_id) VALUES
	 ('9d8ec318-bf2b-4d0c-ac0e-dec9682b36a2','Conta fixa',1),
	 ('9d8ec318-bf2b-4d0c-ac0e-dec9682b36a2','Reforma',1),
	 ('9d8ec318-bf2b-4d0c-ac0e-dec9682b36a2','Mercado',2),
	 ('9d8ec318-bf2b-4d0c-ac0e-dec9682b36a2','Lanche',2),
	 ('9d8ec318-bf2b-4d0c-ac0e-dec9682b36a2','Remedio',3),
	 ('9d8ec318-bf2b-4d0c-ac0e-dec9682b36a2','Exame',3);

INSERT INTO public.despesas (descricao,valor,vencimento,created_at,updated_at,pagamento,pago,user_id,carteira_id,categoria_id,sub_category_id,instalment_id,instalment) VALUES
	 ('Compra do mes',85000,'2023-01-10 12:00:00','2023-01-10 12:00:00',NULL,'2023-01-10 12:00:00',true,'9d8ec318-bf2b-4d0c-ac0e-dec9682b36a2',1,2,3,NULL,1),
	 ('Energia',25000,'2023-01-10 12:00:00','2023-01-10 12:00:00',NULL,'2023-01-10 12:00:00',true,'9d8ec318-bf2b-4d0c-ac0e-dec9682b36a2',2,1,1,NULL,1),
	 ('Remedio',11000,'2023-01-10 12:00:00','2023-01-10 12:00:00',NULL,'2023-01-10 12:00:00',true,'9d8ec318-bf2b-4d0c-ac0e-dec9682b36a2',3,3,5,NULL,1);

INSERT INTO public.receitas (descricao,valor,pagamento,pago,created_at,updated_at,user_id,carteira_id) VALUES
	 ('Salario 1',1600.0,'2023-01-10 12:00:00',true,'2023-01-10 12:00:00',NULL,'9d8ec318-bf2b-4d0c-ac0e-dec9682b36a2',1),
	 ('Salario 2',15990.0,'2023-01-10 12:00:00',true,'2023-01-10 12:00:00',NULL,'9d8ec318-bf2b-4d0c-ac0e-dec9682b36a2',2),
	 ('Salario 3',130000.0,'2023-01-10 12:00:00',true,'2023-01-10 12:00:00',NULL,'9d8ec318-bf2b-4d0c-ac0e-dec9682b36a2',3);
ALTER TABLE "sub_categories" ADD CONSTRAINT "FK_7a424f07f46010d3441442f7764" FOREIGN KEY ("category_id") REFERENCES "categorias"("id") ON DELETE NO ACTION ON UPDATE NO action;
ALTER TABLE "sub_categories" ADD CONSTRAINT "FK_1af4563f1eee8d1463755c9959f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO action;
ALTER TABLE "categorias" ADD CONSTRAINT "FK_1d97e32834a53286c44b38ae286" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO action;
ALTER TABLE "despesas" ADD CONSTRAINT "FK_9707000a73544abc2d125409400" FOREIGN KEY ("carteira_id") REFERENCES "carteiras"("id") ON DELETE NO ACTION ON UPDATE NO action;
ALTER TABLE "despesas" ADD CONSTRAINT "FK_09ac33dcad7a16504745913777a" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE NO ACTION ON UPDATE NO action;
ALTER TABLE "despesas" ADD CONSTRAINT "FK_e9dd72cc3a5c32c9f2f415d0260" FOREIGN KEY ("sub_category_id") REFERENCES "sub_categories"("id") ON DELETE NO ACTION ON UPDATE NO action;
ALTER TABLE "despesas" ADD CONSTRAINT "FK_73302541948ba3d84f63dcf6b10" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO action;
ALTER TABLE "transferencias" ADD CONSTRAINT "FK_a33c2d8dfc217cb4c8d5825ed35" FOREIGN KEY ("carteira_origem_id") REFERENCES "carteiras"("id") ON DELETE NO ACTION ON UPDATE NO action;
ALTER TABLE "transferencias" ADD CONSTRAINT "FK_c87a585a1294f4d18fcc1528475" FOREIGN KEY ("carteira_destino_id") REFERENCES "carteiras"("id") ON DELETE NO ACTION ON UPDATE NO action;
ALTER TABLE "transferencias" ADD CONSTRAINT "FK_8111a44a4bc472ba012e4e44e3e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO action;
ALTER TABLE "carteiras" ADD CONSTRAINT "FK_830e267d4c3fad2dfbb22160eb0" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO action;
ALTER TABLE "receitas" ADD CONSTRAINT "FK_3af6597fbe1702b7e0d743eaa7a" FOREIGN KEY ("carteira_id") REFERENCES "carteiras"("id") ON DELETE NO ACTION ON UPDATE NO action;
ALTER TABLE "receitas" ADD CONSTRAINT "FK_3e3d2c8cecdf883e6e86d810b06" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO action;
