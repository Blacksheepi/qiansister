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
-- Name: project_params; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE project_params (
    id integer NOT NULL,
    tui double precision NOT NULL,
    tuo double precision NOT NULL,
    tgi double precision NOT NULL,
    tgo double precision NOT NULL,
    gu double precision NOT NULL,
    gg double precision NOT NULL,
    pl double precision NOT NULL,
    pu double precision NOT NULL,
    pg double precision NOT NULL,
    project_id integer NOT NULL,
    "time" text NOT NULL,
    hot boolean NOT NULL
);


ALTER TABLE project_params OWNER TO postgres;

--
-- Name: project_params_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE project_params_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE project_params_id_seq OWNER TO postgres;

--
-- Name: project_params_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE project_params_id_seq OWNED BY project_params.id;


--
-- Name: projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE projects (
    id integer NOT NULL,
    area double precision NOT NULL,
    "position" text NOT NULL,
    type text NOT NULL,
    begin_time text NOT NULL,
    project_name text NOT NULL
);


ALTER TABLE projects OWNER TO postgres;

--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE projects_id_seq OWNER TO postgres;

--
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE projects_id_seq OWNED BY projects.id;


--
-- Name: projects_params; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE projects_params (
    id integer NOT NULL,
    tui double precision NOT NULL,
    tuo double precision NOT NULL,
    tgi double precision NOT NULL,
    tgo double precision NOT NULL,
    gu double precision NOT NULL,
    gg double precision NOT NULL,
    pl double precision NOT NULL,
    pu double precision NOT NULL,
    pg double precision NOT NULL,
    hot boolean NOT NULL,
    project_id integer
);


ALTER TABLE projects_params OWNER TO postgres;

--
-- Name: projects_params_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE projects_params_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE projects_params_id_seq OWNER TO postgres;

--
-- Name: projects_params_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE projects_params_id_seq OWNED BY projects_params.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE users (
    id integer NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    user_id text
);


ALTER TABLE users OWNER TO postgres;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE user_id_seq OWNER TO postgres;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE user_id_seq OWNED BY users.id;


--
-- Name: project_params id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY project_params ALTER COLUMN id SET DEFAULT nextval('project_params_id_seq'::regclass);


--
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY projects ALTER COLUMN id SET DEFAULT nextval('projects_id_seq'::regclass);


--
-- Name: projects_params id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY projects_params ALTER COLUMN id SET DEFAULT nextval('projects_params_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('user_id_seq'::regclass);


--
-- Data for Name: project_params; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY project_params (id, tui, tuo, tgi, tgo, gu, gg, pl, pu, pg, project_id, "time", hot) FROM stdin;
9	34.5	35.3999999999999986	4.79999999999999982	5.59999999999999964	45.2000000000000028	42.5	556.200000000000045	582.600000000000023	843.399999999999977	32	Fri Jan 01 2010 00:00:00 GMT+0800 (CST)	t
10	34.2000000000000028	35.3999999999999986	4.90000000000000036	5.29999999999999982	46.2999999999999972	41.2000000000000028	557.299999999999955	593.200000000000045	876.299999999999955	32	Fri Jan 01 2010 00:00:00 GMT+0800 (CST)	t
11	34.6000000000000014	35.5	5.09999999999999964	4.59999999999999964	44.5	41.8999999999999986	568.200000000000045	562.200000000000045	876.200000000000045	32	Fri Jan 01 2010 00:00:00 GMT+0800 (CST)	t
12	32.5	30.3999999999999986	2.79999999999999982	3.60000000000000009	41.2000000000000028	46.5	536.200000000000045	522.600000000000023	743.399999999999977	32	Fri Jan 01 2010 00:00:00 GMT+0800 (CST)	f
13	32.2000000000000028	30.3999999999999986	2.89999999999999991	3.29999999999999982	43.2999999999999972	45.2000000000000028	537.299999999999955	513.200000000000045	776.299999999999955	32	Fri Jan 01 2010 00:00:00 GMT+0800 (CST)	f
14	32.6000000000000014	32.5	3.10000000000000009	3.60000000000000009	42.5	44.8999999999999986	528.200000000000045	522.200000000000045	876.200000000000045	32	Fri Jan 01 2010 00:00:00 GMT+0800 (CST)	f
15	34.5	35.3999999999999986	4.79999999999999982	5.59999999999999964	45.2000000000000028	42.5	556.200000000000045	582.600000000000023	843.399999999999977	33	Sat Jan 01 2011 00:00:00 GMT+0800 (CST)	t
16	34.2000000000000028	35.3999999999999986	4.90000000000000036	5.29999999999999982	46.2999999999999972	41.2000000000000028	557.299999999999955	593.200000000000045	876.299999999999955	33	Sat Jan 01 2011 00:00:00 GMT+0800 (CST)	t
17	34.6000000000000014	35.5	5.09999999999999964	4.59999999999999964	44.5	41.8999999999999986	568.200000000000045	562.200000000000045	876.200000000000045	33	Sat Jan 01 2011 00:00:00 GMT+0800 (CST)	t
18	32.5	30.3999999999999986	2.79999999999999982	3.60000000000000009	41.2000000000000028	46.5	536.200000000000045	522.600000000000023	743.399999999999977	33	Sat Jan 01 2011 00:00:00 GMT+0800 (CST)	f
19	32.2000000000000028	30.3999999999999986	2.89999999999999991	3.29999999999999982	43.2999999999999972	45.2000000000000028	537.299999999999955	513.200000000000045	776.299999999999955	33	Sat Jan 01 2011 00:00:00 GMT+0800 (CST)	f
20	32.6000000000000014	32.5	3.10000000000000009	3.60000000000000009	42.5	44.8999999999999986	528.200000000000045	522.200000000000045	876.200000000000045	33	Sat Jan 01 2011 00:00:00 GMT+0800 (CST)	f
21	34.5	35.3999999999999986	4.79999999999999982	5.59999999999999964	45.2000000000000028	42.5	556.200000000000045	582.600000000000023	843.399999999999977	34	Sun Jan 01 2012 00:00:00 GMT+0800 (CST)	t
22	34.2000000000000028	35.3999999999999986	4.90000000000000036	5.29999999999999982	46.2999999999999972	41.2000000000000028	557.299999999999955	593.200000000000045	876.299999999999955	34	Sun Jan 01 2012 00:00:00 GMT+0800 (CST)	t
23	34.6000000000000014	35.5	5.09999999999999964	4.59999999999999964	44.5	41.8999999999999986	568.200000000000045	562.200000000000045	876.200000000000045	34	Sun Jan 01 2012 00:00:00 GMT+0800 (CST)	t
24	32.5	30.3999999999999986	2.79999999999999982	3.60000000000000009	41.2000000000000028	46.5	536.200000000000045	522.600000000000023	743.399999999999977	34	Sat Jan 01 2011 00:00:00 GMT+0800 (CST)	f
25	32.2000000000000028	30.3999999999999986	2.89999999999999991	3.29999999999999982	43.2999999999999972	45.2000000000000028	537.299999999999955	513.200000000000045	776.299999999999955	34	Sat Jan 01 2011 00:00:00 GMT+0800 (CST)	f
26	32.6000000000000014	32.5	3.10000000000000009	3.60000000000000009	42.5	44.8999999999999986	528.200000000000045	522.200000000000045	876.200000000000045	34	Sat Jan 01 2011 00:00:00 GMT+0800 (CST)	f
27	34.5	35.3999999999999986	4.79999999999999982	5.59999999999999964	45.2000000000000028	42.5	556.200000000000045	582.600000000000023	843.399999999999977	35	Tue Jan 01 2013 00:00:00 GMT+0800 (CST)	t
28	34.2000000000000028	35.3999999999999986	4.90000000000000036	5.29999999999999982	46.2999999999999972	41.2000000000000028	557.299999999999955	593.200000000000045	876.299999999999955	35	Tue Jan 01 2013 00:00:00 GMT+0800 (CST)	t
29	34.6000000000000014	35.5	5.09999999999999964	4.59999999999999964	44.5	41.8999999999999986	568.200000000000045	562.200000000000045	876.200000000000045	35	Tue Jan 01 2013 00:00:00 GMT+0800 (CST)	t
30	32.5	30.3999999999999986	2.79999999999999982	3.60000000000000009	41.2000000000000028	46.5	536.200000000000045	522.600000000000023	743.399999999999977	35	Sun Jan 01 2012 00:00:00 GMT+0800 (CST)	f
31	32.2000000000000028	30.3999999999999986	2.89999999999999991	3.29999999999999982	43.2999999999999972	45.2000000000000028	537.299999999999955	513.200000000000045	776.299999999999955	35	Sun Jan 01 2012 00:00:00 GMT+0800 (CST)	f
32	32.6000000000000014	32.5	3.10000000000000009	3.60000000000000009	42.5	44.8999999999999986	528.200000000000045	522.200000000000045	876.200000000000045	35	Sun Jan 01 2012 00:00:00 GMT+0800 (CST)	f
33	34.5	35.3999999999999986	4.79999999999999982	5.59999999999999964	45.2000000000000028	42.5	556.200000000000045	582.600000000000023	843.399999999999977	36	Tue Jan 01 2013 00:00:00 GMT+0800 (CST)	t
34	34.2000000000000028	35.3999999999999986	4.90000000000000036	5.29999999999999982	46.2999999999999972	41.2000000000000028	557.299999999999955	593.200000000000045	876.299999999999955	36	Tue Jan 01 2013 00:00:00 GMT+0800 (CST)	t
35	34.6000000000000014	35.5	5.09999999999999964	4.59999999999999964	44.5	41.8999999999999986	568.200000000000045	562.200000000000045	876.200000000000045	36	Tue Jan 01 2013 00:00:00 GMT+0800 (CST)	t
36	32.5	30.3999999999999986	2.79999999999999982	3.60000000000000009	41.2000000000000028	46.5	536.200000000000045	522.600000000000023	743.399999999999977	36	Sun Jan 01 2012 00:00:00 GMT+0800 (CST)	f
37	32.2000000000000028	30.3999999999999986	2.89999999999999991	3.29999999999999982	43.2999999999999972	45.2000000000000028	537.299999999999955	513.200000000000045	776.299999999999955	36	Sun Jan 01 2012 00:00:00 GMT+0800 (CST)	f
38	32.6000000000000014	32.5	3.10000000000000009	3.60000000000000009	42.5	44.8999999999999986	528.200000000000045	522.200000000000045	876.200000000000045	36	Sun Jan 01 2012 00:00:00 GMT+0800 (CST)	f
39	34.5	35.3999999999999986	4.79999999999999982	5.59999999999999964	45.2000000000000028	42.5	556.200000000000045	582.600000000000023	843.399999999999977	37	Tue Jan 01 2013 00:00:00 GMT+0800 (CST)	t
41	34.2000000000000028	35.3999999999999986	4.90000000000000036	5.29999999999999982	46.2999999999999972	41.2000000000000028	557.299999999999955	593.200000000000045	876.299999999999955	37	Tue Jan 01 2013 00:00:00 GMT+0800 (CST)	t
42	34.6000000000000014	35.5	5.09999999999999964	4.59999999999999964	44.5	41.8999999999999986	568.200000000000045	562.200000000000045	876.200000000000045	37	Tue Jan 01 2013 00:00:00 GMT+0800 (CST)	t
40	32.5	30.3999999999999986	2.79999999999999982	3.60000000000000009	41.2000000000000028	46.5	536.200000000000045	522.600000000000023	743.399999999999977	37	Sun Jan 01 2012 00:00:00 GMT+0800 (CST)	f
43	32.2000000000000028	30.3999999999999986	2.89999999999999991	3.29999999999999982	43.2999999999999972	45.2000000000000028	537.299999999999955	513.200000000000045	776.299999999999955	37	Sun Jan 01 2012 00:00:00 GMT+0800 (CST)	f
44	32.6000000000000014	32.5	3.10000000000000009	3.60000000000000009	42.5	44.8999999999999986	528.200000000000045	522.200000000000045	876.200000000000045	37	Sun Jan 01 2012 00:00:00 GMT+0800 (CST)	f
45	34.5	35.3999999999999986	4.79999999999999982	5.59999999999999964	45.2000000000000028	42.5	556.200000000000045	582.600000000000023	843.399999999999977	38	Tue Jan 01 2013 00:00:00 GMT+0800 (CST)	t
46	34.2000000000000028	35.3999999999999986	4.90000000000000036	5.29999999999999982	46.2999999999999972	41.2000000000000028	557.299999999999955	593.200000000000045	876.299999999999955	38	Tue Jan 01 2013 00:00:00 GMT+0800 (CST)	t
47	34.6000000000000014	35.5	5.09999999999999964	4.59999999999999964	44.5	41.8999999999999986	568.200000000000045	562.200000000000045	876.200000000000045	38	Tue Jan 01 2013 00:00:00 GMT+0800 (CST)	t
48	32.5	30.3999999999999986	2.79999999999999982	3.60000000000000009	41.2000000000000028	46.5	536.200000000000045	522.600000000000023	743.399999999999977	38	Sun Jan 01 2012 00:00:00 GMT+0800 (CST)	f
49	32.2000000000000028	30.3999999999999986	2.89999999999999991	3.29999999999999982	43.2999999999999972	45.2000000000000028	537.299999999999955	513.200000000000045	776.299999999999955	38	Sun Jan 01 2012 00:00:00 GMT+0800 (CST)	f
50	32.6000000000000014	32.5	3.10000000000000009	3.60000000000000009	42.5	44.8999999999999986	528.200000000000045	522.200000000000045	876.200000000000045	38	Sun Jan 01 2012 00:00:00 GMT+0800 (CST)	f
51	34.5	35.3999999999999986	4.79999999999999982	5.59999999999999964	45.2000000000000028	42.5	556.200000000000045	582.600000000000023	843.399999999999977	39	Tue Jan 01 2013 00:00:00 GMT+0800 (CST)	t
52	34.2000000000000028	35.3999999999999986	4.90000000000000036	5.29999999999999982	46.2999999999999972	41.2000000000000028	557.299999999999955	593.200000000000045	876.299999999999955	39	Tue Jan 01 2013 00:00:00 GMT+0800 (CST)	t
53	34.6000000000000014	35.5	5.09999999999999964	4.59999999999999964	44.5	41.8999999999999986	568.200000000000045	562.200000000000045	876.200000000000045	39	Tue Jan 01 2013 00:00:00 GMT+0800 (CST)	t
54	32.5	30.3999999999999986	2.79999999999999982	3.60000000000000009	41.2000000000000028	46.5	536.200000000000045	522.600000000000023	743.399999999999977	39	Fri Jan 01 2016 00:00:00 GMT+0800 (CST)	f
55	32.2000000000000028	30.3999999999999986	2.89999999999999991	3.29999999999999982	43.2999999999999972	45.2000000000000028	537.299999999999955	513.200000000000045	776.299999999999955	39	Fri Jan 01 2016 00:00:00 GMT+0800 (CST)	f
56	32.6000000000000014	32.5	3.10000000000000009	3.60000000000000009	42.5	44.8999999999999986	528.200000000000045	522.200000000000045	876.200000000000045	39	Fri Jan 01 2016 00:00:00 GMT+0800 (CST)	f
57	34.5	35.3999999999999986	4.79999999999999982	5.59999999999999964	45.2000000000000028	42.5	556.200000000000045	582.600000000000023	843.399999999999977	40	Thu Jan 01 2015 00:00:00 GMT+0800 (CST)	t
58	34.2000000000000028	35.3999999999999986	4.90000000000000036	5.29999999999999982	46.2999999999999972	41.2000000000000028	557.299999999999955	593.200000000000045	876.299999999999955	40	Thu Jan 01 2015 00:00:00 GMT+0800 (CST)	t
59	34.6000000000000014	35.5	5.09999999999999964	4.59999999999999964	44.5	41.8999999999999986	568.200000000000045	562.200000000000045	876.200000000000045	40	Thu Jan 01 2015 00:00:00 GMT+0800 (CST)	t
60	32.5	30.3999999999999986	2.79999999999999982	3.60000000000000009	41.2000000000000028	46.5	536.200000000000045	522.600000000000023	743.399999999999977	40	Fri Jan 01 2016 00:00:00 GMT+0800 (CST)	f
61	32.2000000000000028	30.3999999999999986	2.89999999999999991	3.29999999999999982	43.2999999999999972	45.2000000000000028	537.299999999999955	513.200000000000045	776.299999999999955	40	Fri Jan 01 2016 00:00:00 GMT+0800 (CST)	f
62	32.6000000000000014	32.5	3.10000000000000009	3.60000000000000009	42.5	44.8999999999999986	528.200000000000045	522.200000000000045	876.200000000000045	40	Fri Jan 01 2016 00:00:00 GMT+0800 (CST)	f
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY projects (id, area, "position", type, begin_time, project_name) FROM stdin;
32	32.3999999999999986	成都	f	Wed Jan 03 2018 00:00:00 GMT+0800 (CST)	project4
33	45.2000000000000028	上海	a	Tue Dec 05 2017 00:00:00 GMT+0800 (CST)	project4s
34	45.7999999999999972	北京	b	Mon Dec 11 2017 00:00:00 GMT+0800 (CST)	project5
35	85.7999999999999972	北京	c	Fri Dec 01 2017 00:00:00 GMT+0800 (CST)	project5s
36	85.4000000000000057	合肥	c	Mon Dec 04 2017 00:00:00 GMT+0800 (CST)	project6
37	74.4000000000000057	武汉	d	Tue Dec 12 2017 00:00:00 GMT+0800 (CST)	project6s
38	74.7999999999999972	武汉	d	Mon Dec 18 2017 00:00:00 GMT+0800 (CST)	project7
39	74.7999999999999972	西藏	e	Mon Dec 18 2017 00:00:00 GMT+0800 (CST)	project8
40	54.7999999999999972	苏州	f	Mon Dec 18 2017 00:00:00 GMT+0800 (CST)	projectx
\.


--
-- Data for Name: projects_params; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY projects_params (id, tui, tuo, tgi, tgo, gu, gg, pl, pu, pg, hot, project_id) FROM stdin;
1	10.1999999999999993	14.3000000000000007	26.3999999999999986	23.6999999999999993	176.699999999999989	458.800000000000011	177.099999999999994	27.1000000000000014	32.5	t	32
2	10.6999999999999993	14.5999999999999996	29.6000000000000014	25.8999999999999986	15334.7999999999993	242.800000000000011	17280	43.2000000000000028	45.6000000000000014	t	33
3	12.1999999999999993	13.8000000000000007	27.6000000000000014	25.8000000000000007	429718.400000000023	249.699999999999989	178706.100000000006	32.5	35.6000000000000014	t	34
4	14	17.6000000000000014	28.5	25.3000000000000007	313.100000000000023	207180.399999999994	269.300000000000011	37.7999999999999972	34.6000000000000014	t	35
5	8.09999999999999964	13.5	33.2999999999999972	29.5	39.8999999999999986	11349.1000000000004	122	36.2999999999999972	35.2000000000000028	t	36
6	8.80000000000000071	13.6999999999999993	34.5	29	513.899999999999977	468.600000000000023	633.700000000000045	38.7999999999999972	66.4000000000000057	t	37
7	10	13.0999999999999996	25.6999999999999993	22.8000000000000007	188.699999999999989	202.300000000000011	152.699999999999989	21.8999999999999986	22.6999999999999993	t	38
8	19.1000000000000014	23.3000000000000007	25.6000000000000014	22.8000000000000007	227.699999999999989	286.699999999999989	216	29.3000000000000007	36.8999999999999986	t	39
9	8.69999999999999929	12.1999999999999993	27.6000000000000014	25.8000000000000007	584	229.199999999999989	616.200000000000045	35.2999999999999972	45.2999999999999972	t	40
10	45.6000000000000014	41.7000000000000028	10	12.1999999999999993	176.699999999999989	458.800000000000011	331.699999999999989	49	73.7999999999999972	f	32
11	41	35.7999999999999972	4.70000000000000018	8.90000000000000036	15334.7999999999993	242.800000000000011	273	26.3000000000000007	23.3000000000000007	f	33
12	32.8999999999999986	29.1000000000000014	13.0999999999999996	17	429718.400000000023	249.699999999999989	203.199999999999989	34.5	43.2000000000000028	f	34
13	45.2999999999999972	41.7000000000000028	8.5	12	313.100000000000023	207180.399999999994	174388.799999999988	32.3999999999999986	24.6000000000000014	f	35
14	49.5	45.7999999999999972	12.1999999999999993	16	39.8999999999999986	11349.1000000000004	12661.8999999999996	42.3999999999999986	43.5	f	36
15	38.7999999999999972	35.5	12.6999999999999993	14.5	513.899999999999977	468.600000000000023	172.599999999999994	43	27.3000000000000007	f	37
16	41	39	9.19999999999999929	11.5	188.699999999999989	202.300000000000011	154.099999999999994	22.6999999999999993	15.1999999999999993	f	38
17	40.2000000000000028	35.3999999999999986	6.90000000000000036	10.6999999999999993	227.699999999999989	286.699999999999989	239.5	17.1999999999999993	8.5	f	39
18	24	21.8000000000000007	7.59999999999999964	10.3000000000000007	584	229.199999999999989	184.099999999999994	36.5	57.2000000000000028	f	40
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY users (id, username, password, user_id) FROM stdin;
1	postgres	postgres	\N
2	dym	dym	\N
\.


--
-- Name: project_params_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('project_params_id_seq', 62, true);


--
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('projects_id_seq', 40, true);


--
-- Name: projects_params_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('projects_params_id_seq', 36, true);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('user_id_seq', 2, true);


--
-- Name: project_params project_params_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY project_params
    ADD CONSTRAINT project_params_pkey PRIMARY KEY (id);


--
-- Name: projects_params projects_params_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY projects_params
    ADD CONSTRAINT projects_params_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: users user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY users
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: users user_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY users
    ADD CONSTRAINT user_username_key UNIQUE (username);


--
-- Name: users users_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_user_id_key UNIQUE (user_id);


--
-- Name: project_params project_params_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY project_params
    ADD CONSTRAINT project_params_project_id_fkey FOREIGN KEY (project_id) REFERENCES projects(id);


--
-- Name: projects_params projects_params_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY projects_params
    ADD CONSTRAINT projects_params_project_id_fkey FOREIGN KEY (project_id) REFERENCES projects(id);


--
-- PostgreSQL database dump complete
--

