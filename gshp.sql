--
-- PostgreSQL database dump
--

-- Dumped from database version 10.1
-- Dumped by pg_dump version 10.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: project_detail; Type: TABLE; Schema: public; Owner: test
--

CREATE TABLE project_detail (
    id integer NOT NULL,
    "time" time without time zone,
    tgo double precision NOT NULL,
    tg double precision NOT NULL,
    a double precision NOT NULL,
    n double precision NOT NULL,
    cop double precision NOT NULL,
    eer double precision NOT NULL,
    project_name text
);


ALTER TABLE project_detail OWNER TO test;

--
-- Name: project_detail_id_seq; Type: SEQUENCE; Schema: public; Owner: test
--

CREATE SEQUENCE project_detail_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE project_detail_id_seq OWNER TO test;

--
-- Name: project_detail_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: test
--

ALTER SEQUENCE project_detail_id_seq OWNED BY project_detail.id;


--
-- Name: projects; Type: TABLE; Schema: public; Owner: test
--

CREATE TABLE projects (
    id integer NOT NULL,
    tgo double precision NOT NULL,
    tg double precision NOT NULL,
    a double precision NOT NULL,
    n double precision NOT NULL,
    cop double precision NOT NULL,
    eer double precision NOT NULL,
    res double precision,
    project_name text,
    area double precision NOT NULL,
    "position" text,
    type text
);


ALTER TABLE projects OWNER TO test;

--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: test
--

CREATE SEQUENCE projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE projects_id_seq OWNER TO test;

--
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: test
--

ALTER SEQUENCE projects_id_seq OWNED BY projects.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: test
--

CREATE TABLE users (
    id integer NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    user_id text
);


ALTER TABLE users OWNER TO test;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: test
--

CREATE SEQUENCE user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE user_id_seq OWNER TO test;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: test
--

ALTER SEQUENCE user_id_seq OWNED BY users.id;


--
-- Name: project_detail id; Type: DEFAULT; Schema: public; Owner: test
--

ALTER TABLE ONLY project_detail ALTER COLUMN id SET DEFAULT nextval('project_detail_id_seq'::regclass);


--
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: test
--

ALTER TABLE ONLY projects ALTER COLUMN id SET DEFAULT nextval('projects_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: test
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('user_id_seq'::regclass);


--
-- Data for Name: project_detail; Type: TABLE DATA; Schema: public; Owner: test
--

COPY project_detail (id, "time", tgo, tg, a, n, cop, eer, project_name) FROM stdin;
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: test
--

COPY projects (id, tgo, tg, a, n, cop, eer, res, project_name, area, "position", type) FROM stdin;
1	18.1999999999999993	4.29999999999999982	0.82999999999999996	0.380000000000000004	3.60999999999999988	4.08999999999999986	\N	project1	32	home	a
2	24.8000000000000007	5.5	0.540000000000000036	0.530000000000000027	4.70999999999999996	3.37000000000000011	\N	project2	23	company	b
3	23.3999999999999986	2.5	0.869999999999999996	0.23000000000000001	5.98000000000000043	2.16999999999999993	\N	project3	45	island	c
4	25.5	4.59999999999999964	0.619999999999999996	0.170000000000000012	3.75	2.9700000000000002	\N	project4	42	mountain	d
5	22.3999999999999986	3.20000000000000018	0.689999999999999947	0.28999999999999998	2.85999999999999988	1.97999999999999998	\N	project5	74	river	e
6	23.3999999999999986	4.90000000000000036	0.760000000000000009	0.340000000000000024	2.85999999999999988	3.22999999999999998	\N	project6	33	restaurant	f
7	22.8999999999999986	1.5	0.67000000000000004	0.489999999999999991	1.87999999999999989	4.74000000000000021	\N	project7	63	toilet	g
8	19.3000000000000007	1.80000000000000004	0.760000000000000009	0.309999999999999998	4.80999999999999961	1.17999999999999994	\N	project8	26	bathroom	h
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: test
--

COPY users (id, username, password, user_id) FROM stdin;
1	test	test	\N
2	dym	dym	\N
\.


--
-- Name: project_detail_id_seq; Type: SEQUENCE SET; Schema: public; Owner: test
--

SELECT pg_catalog.setval('project_detail_id_seq', 1, false);


--
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: test
--

SELECT pg_catalog.setval('projects_id_seq', 8, true);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: test
--

SELECT pg_catalog.setval('user_id_seq', 2, true);


--
-- Name: project_detail project_detail_pkey; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY project_detail
    ADD CONSTRAINT project_detail_pkey PRIMARY KEY (id);


--
-- Name: project_detail project_detail_project_name_key; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY project_detail
    ADD CONSTRAINT project_detail_project_name_key UNIQUE (project_name);


--
-- Name: projects projects_name_key; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY projects
    ADD CONSTRAINT projects_name_key UNIQUE (project_name);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: users user_pkey; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY users
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: users user_username_key; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY users
    ADD CONSTRAINT user_username_key UNIQUE (username);


--
-- Name: users users_user_id_key; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_user_id_key UNIQUE (user_id);


--
-- PostgreSQL database dump complete
--

