--
-- PostgreSQL database dump
--

-- Dumped from database version 12.16 (Ubuntu 12.16-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 14.1

-- Started on 2024-06-04 12:25:45

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 202 (class 1259 OID 19843)
-- Name: activities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activities (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    creater_id integer,
    created_at timestamp without time zone,
    img json,
    description text,
    status_id integer,
    decoration json,
    group_id integer,
    fields json,
    direction_id integer
);


ALTER TABLE public.activities OWNER TO postgres;

--
-- TOC entry 203 (class 1259 OID 19849)
-- Name: activities_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.activities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.activities_id_seq OWNER TO postgres;

--
-- TOC entry 3460 (class 0 OID 0)
-- Dependencies: 203
-- Name: activities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.activities_id_seq OWNED BY public.activities.id;


--
-- TOC entry 204 (class 1259 OID 19851)
-- Name: activity_statuses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activity_statuses (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.activity_statuses OWNER TO postgres;

--
-- TOC entry 205 (class 1259 OID 19854)
-- Name: activity_statuses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.activity_statuses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.activity_statuses_id_seq OWNER TO postgres;

--
-- TOC entry 3461 (class 0 OID 0)
-- Dependencies: 205
-- Name: activity_statuses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.activity_statuses_id_seq OWNED BY public.activity_statuses.id;


--
-- TOC entry 206 (class 1259 OID 19856)
-- Name: activity_task_assignments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activity_task_assignments (
    user_id integer NOT NULL,
    task_id integer NOT NULL,
    created_at timestamp without time zone
);


ALTER TABLE public.activity_task_assignments OWNER TO postgres;

--
-- TOC entry 207 (class 1259 OID 19859)
-- Name: activity_task_statuses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activity_task_statuses (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    is_change boolean
);


ALTER TABLE public.activity_task_statuses OWNER TO postgres;

--
-- TOC entry 208 (class 1259 OID 19862)
-- Name: activity_task_statuses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.activity_task_statuses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.activity_task_statuses_id_seq OWNER TO postgres;

--
-- TOC entry 3462 (class 0 OID 0)
-- Dependencies: 208
-- Name: activity_task_statuses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.activity_task_statuses_id_seq OWNED BY public.activity_task_statuses.id;


--
-- TOC entry 209 (class 1259 OID 19864)
-- Name: activity_tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activity_tasks (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    creater_id integer,
    activity_id integer,
    status_id integer,
    deadline timestamp without time zone,
    created_at timestamp without time zone,
    materials json
);


ALTER TABLE public.activity_tasks OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 19870)
-- Name: activity_tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.activity_tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.activity_tasks_id_seq OWNER TO postgres;

--
-- TOC entry 3463 (class 0 OID 0)
-- Dependencies: 210
-- Name: activity_tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.activity_tasks_id_seq OWNED BY public.activity_tasks.id;


--
-- TOC entry 211 (class 1259 OID 19872)
-- Name: admins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admins (
    id integer NOT NULL,
    is_super boolean
);


ALTER TABLE public.admins OWNER TO postgres;

--
-- TOC entry 212 (class 1259 OID 19875)
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO postgres;

--
-- TOC entry 213 (class 1259 OID 19878)
-- Name: cities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cities (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    region_id integer
);


ALTER TABLE public.cities OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 19881)
-- Name: cities_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cities_id_seq OWNER TO postgres;

--
-- TOC entry 3464 (class 0 OID 0)
-- Dependencies: 214
-- Name: cities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cities_id_seq OWNED BY public.cities.id;


--
-- TOC entry 215 (class 1259 OID 19883)
-- Name: contact_activities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contact_activities (
    id integer NOT NULL,
    contact_id integer,
    activity_id integer,
    value character varying(255) NOT NULL
);


ALTER TABLE public.contact_activities OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 19886)
-- Name: contact_activities_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contact_activities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.contact_activities_id_seq OWNER TO postgres;

--
-- TOC entry 3465 (class 0 OID 0)
-- Dependencies: 216
-- Name: contact_activities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contact_activities_id_seq OWNED BY public.contact_activities.id;


--
-- TOC entry 217 (class 1259 OID 19888)
-- Name: contact_groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contact_groups (
    id integer NOT NULL,
    contact_id integer,
    group_id integer,
    value character varying(255) NOT NULL
);


ALTER TABLE public.contact_groups OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 19891)
-- Name: contact_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contact_groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.contact_groups_id_seq OWNER TO postgres;

--
-- TOC entry 3466 (class 0 OID 0)
-- Dependencies: 218
-- Name: contact_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contact_groups_id_seq OWNED BY public.contact_groups.id;


--
-- TOC entry 219 (class 1259 OID 19893)
-- Name: contact_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contact_users (
    id integer NOT NULL,
    contact_id integer,
    user_id integer,
    value character varying(255) NOT NULL
);


ALTER TABLE public.contact_users OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 19896)
-- Name: contact_users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contact_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.contact_users_id_seq OWNER TO postgres;

--
-- TOC entry 3467 (class 0 OID 0)
-- Dependencies: 220
-- Name: contact_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contact_users_id_seq OWNED BY public.contact_users.id;


--
-- TOC entry 221 (class 1259 OID 19898)
-- Name: contacts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contacts (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    icon character varying(255) NOT NULL,
    prefix character varying(255),
    is_redirect boolean,
    details json
);


ALTER TABLE public.contacts OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 19904)
-- Name: contacts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contacts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.contacts_id_seq OWNER TO postgres;

--
-- TOC entry 3468 (class 0 OID 0)
-- Dependencies: 222
-- Name: contacts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contacts_id_seq OWNED BY public.contacts.id;


--
-- TOC entry 223 (class 1259 OID 19906)
-- Name: directions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.directions (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    icon character varying(255)
);


ALTER TABLE public.directions OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 19912)
-- Name: directions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.directions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.directions_id_seq OWNER TO postgres;

--
-- TOC entry 3469 (class 0 OID 0)
-- Dependencies: 224
-- Name: directions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.directions_id_seq OWNED BY public.directions.id;


--
-- TOC entry 225 (class 1259 OID 19914)
-- Name: files; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.files (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    owner_id integer,
    details json,
    created_at timestamp without time zone
);


ALTER TABLE public.files OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 19920)
-- Name: files_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.files_id_seq OWNER TO postgres;

--
-- TOC entry 3470 (class 0 OID 0)
-- Dependencies: 226
-- Name: files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.files_id_seq OWNED BY public.files.id;


--
-- TOC entry 227 (class 1259 OID 19922)
-- Name: group_invites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.group_invites (
    group_id integer NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp without time zone,
    is_approved boolean
);


ALTER TABLE public.group_invites OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 19925)
-- Name: group_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.group_roles (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    is_common boolean,
    group_id integer
);


ALTER TABLE public.group_roles OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 19928)
-- Name: group_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.group_roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.group_roles_id_seq OWNER TO postgres;

--
-- TOC entry 3471 (class 0 OID 0)
-- Dependencies: 229
-- Name: group_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.group_roles_id_seq OWNED BY public.group_roles.id;


--
-- TOC entry 230 (class 1259 OID 19930)
-- Name: group_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.group_types (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.group_types OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 19933)
-- Name: group_types_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.group_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.group_types_id_seq OWNER TO postgres;

--
-- TOC entry 3472 (class 0 OID 0)
-- Dependencies: 231
-- Name: group_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.group_types_id_seq OWNED BY public.group_types.id;


--
-- TOC entry 232 (class 1259 OID 19935)
-- Name: group_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.group_users (
    group_id integer NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp without time zone,
    role_id integer
);


ALTER TABLE public.group_users OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 19938)
-- Name: groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.groups (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    note text,
    avatar json,
    created_at timestamp without time zone,
    decoration json,
    creater_id integer,
    type_id integer,
    username character varying(255)
);


ALTER TABLE public.groups OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 19944)
-- Name: groups_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.groups_id_seq OWNER TO postgres;

--
-- TOC entry 3473 (class 0 OID 0)
-- Dependencies: 234
-- Name: groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.groups_id_seq OWNED BY public.groups.id;


--
-- TOC entry 235 (class 1259 OID 19946)
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    materials json,
    text text NOT NULL,
    created_at timestamp without time zone,
    activity_id integer,
    sender_id integer
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 19952)
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.messages_id_seq OWNER TO postgres;

--
-- TOC entry 3474 (class 0 OID 0)
-- Dependencies: 236
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- TOC entry 237 (class 1259 OID 19954)
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    text character varying(255),
    user_abstract_id integer,
    created_at timestamp without time zone,
    is_readed boolean
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 19957)
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notifications_id_seq OWNER TO postgres;

--
-- TOC entry 3475 (class 0 OID 0)
-- Dependencies: 238
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- TOC entry 239 (class 1259 OID 19959)
-- Name: portfolio_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.portfolio_types (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    details json
);


ALTER TABLE public.portfolio_types OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 19965)
-- Name: portfolio_types_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.portfolio_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.portfolio_types_id_seq OWNER TO postgres;

--
-- TOC entry 3476 (class 0 OID 0)
-- Dependencies: 240
-- Name: portfolio_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.portfolio_types_id_seq OWNED BY public.portfolio_types.id;


--
-- TOC entry 241 (class 1259 OID 19967)
-- Name: portfolios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.portfolios (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    user_id integer,
    group_id integer,
    activity_id integer,
    getted_at timestamp without time zone,
    material json,
    type_id integer,
    note text,
    value text
);


ALTER TABLE public.portfolios OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 19973)
-- Name: portfolios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.portfolios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.portfolios_id_seq OWNER TO postgres;

--
-- TOC entry 3477 (class 0 OID 0)
-- Dependencies: 242
-- Name: portfolios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.portfolios_id_seq OWNED BY public.portfolios.id;


--
-- TOC entry 243 (class 1259 OID 19975)
-- Name: post_likes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.post_likes (
    user_id integer NOT NULL,
    post_id integer NOT NULL
);


ALTER TABLE public.post_likes OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 19978)
-- Name: post_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.post_types (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.post_types OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 19981)
-- Name: post_types_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.post_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.post_types_id_seq OWNER TO postgres;

--
-- TOC entry 3478 (class 0 OID 0)
-- Dependencies: 245
-- Name: post_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.post_types_id_seq OWNED BY public.post_types.id;


--
-- TOC entry 246 (class 1259 OID 19983)
-- Name: posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.posts (
    id integer NOT NULL,
    text text,
    user_id integer,
    group_id integer,
    activity_id integer,
    created_at timestamp without time zone,
    materials json,
    type_id integer
);


ALTER TABLE public.posts OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 19989)
-- Name: posts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.posts_id_seq OWNER TO postgres;

--
-- TOC entry 3479 (class 0 OID 0)
-- Dependencies: 247
-- Name: posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.posts_id_seq OWNED BY public.posts.id;


--
-- TOC entry 248 (class 1259 OID 19991)
-- Name: regions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.regions (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.regions OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 19994)
-- Name: regions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.regions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.regions_id_seq OWNER TO postgres;

--
-- TOC entry 3480 (class 0 OID 0)
-- Dependencies: 249
-- Name: regions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.regions_id_seq OWNED BY public.regions.id;


--
-- TOC entry 250 (class 1259 OID 19996)
-- Name: requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.requests (
    group_id integer NOT NULL,
    activity_id integer NOT NULL,
    status_id integer,
    created_at timestamp without time zone
);


ALTER TABLE public.requests OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 19999)
-- Name: requets_statuses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.requets_statuses (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.requets_statuses OWNER TO postgres;

--
-- TOC entry 252 (class 1259 OID 20002)
-- Name: requets_statuses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.requets_statuses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.requets_statuses_id_seq OWNER TO postgres;

--
-- TOC entry 3481 (class 0 OID 0)
-- Dependencies: 252
-- Name: requets_statuses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.requets_statuses_id_seq OWNED BY public.requets_statuses.id;


--
-- TOC entry 253 (class 1259 OID 20004)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 254 (class 1259 OID 20007)
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.roles_id_seq OWNER TO postgres;

--
-- TOC entry 3482 (class 0 OID 0)
-- Dependencies: 254
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- TOC entry 255 (class 1259 OID 20009)
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subscriptions (
    subscriber_id integer NOT NULL,
    favorite_id integer NOT NULL,
    created_at timestamp without time zone
);


ALTER TABLE public.subscriptions OWNER TO postgres;

--
-- TOC entry 256 (class 1259 OID 20012)
-- Name: tag_activities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tag_activities (
    tag_id integer NOT NULL,
    activity_id integer NOT NULL
);


ALTER TABLE public.tag_activities OWNER TO postgres;

--
-- TOC entry 257 (class 1259 OID 20015)
-- Name: tag_levels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tag_levels (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    icon character varying(255)
);


ALTER TABLE public.tag_levels OWNER TO postgres;

--
-- TOC entry 258 (class 1259 OID 20021)
-- Name: tag_levels_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tag_levels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tag_levels_id_seq OWNER TO postgres;

--
-- TOC entry 3483 (class 0 OID 0)
-- Dependencies: 258
-- Name: tag_levels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tag_levels_id_seq OWNED BY public.tag_levels.id;


--
-- TOC entry 259 (class 1259 OID 20023)
-- Name: tag_portfolios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tag_portfolios (
    tag_id integer NOT NULL,
    portfolio_id integer NOT NULL
);


ALTER TABLE public.tag_portfolios OWNER TO postgres;

--
-- TOC entry 260 (class 1259 OID 20026)
-- Name: tag_posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tag_posts (
    tag_id integer NOT NULL,
    post_id integer NOT NULL
);


ALTER TABLE public.tag_posts OWNER TO postgres;

--
-- TOC entry 261 (class 1259 OID 20029)
-- Name: tag_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tag_users (
    tag_id integer NOT NULL,
    user_id integer NOT NULL,
    level_id integer
);


ALTER TABLE public.tag_users OWNER TO postgres;

--
-- TOC entry 262 (class 1259 OID 20032)
-- Name: tag_vacancies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tag_vacancies (
    tag_id integer NOT NULL,
    vacancy_id integer NOT NULL,
    level_id integer
);


ALTER TABLE public.tag_vacancies OWNER TO postgres;

--
-- TOC entry 263 (class 1259 OID 20035)
-- Name: tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tags (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.tags OWNER TO postgres;

--
-- TOC entry 264 (class 1259 OID 20038)
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tags_id_seq OWNER TO postgres;

--
-- TOC entry 3484 (class 0 OID 0)
-- Dependencies: 264
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;


--
-- TOC entry 265 (class 1259 OID 20040)
-- Name: user_abstracts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_abstracts (
    id integer NOT NULL,
    email character varying(320) NOT NULL,
    avatar json,
    created_at timestamp without time zone,
    username character varying(255),
    hashed_password character varying(1024) NOT NULL,
    decoration json,
    role_id integer,
    firstname character varying(100) NOT NULL,
    lastname character varying(100) NOT NULL,
    is_active boolean
);


ALTER TABLE public.user_abstracts OWNER TO postgres;

--
-- TOC entry 266 (class 1259 OID 20046)
-- Name: user_abstracts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_abstracts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_abstracts_id_seq OWNER TO postgres;

--
-- TOC entry 3485 (class 0 OID 0)
-- Dependencies: 266
-- Name: user_abstracts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_abstracts_id_seq OWNED BY public.user_abstracts.id;


--
-- TOC entry 267 (class 1259 OID 20048)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    city_id integer,
    birthdate date
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 268 (class 1259 OID 20051)
-- Name: vacancies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vacancies (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    created_at timestamp without time zone,
    group_id integer,
    is_active boolean
);


ALTER TABLE public.vacancies OWNER TO postgres;

--
-- TOC entry 269 (class 1259 OID 20057)
-- Name: vacancies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vacancies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.vacancies_id_seq OWNER TO postgres;

--
-- TOC entry 3486 (class 0 OID 0)
-- Dependencies: 269
-- Name: vacancies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vacancies_id_seq OWNED BY public.vacancies.id;


--
-- TOC entry 270 (class 1259 OID 20059)
-- Name: vacancy_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vacancy_users (
    vacancy_id integer NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp without time zone,
    is_approved boolean
);


ALTER TABLE public.vacancy_users OWNER TO postgres;

--
-- TOC entry 3059 (class 2604 OID 20062)
-- Name: activities id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities ALTER COLUMN id SET DEFAULT nextval('public.activities_id_seq'::regclass);


--
-- TOC entry 3060 (class 2604 OID 20063)
-- Name: activity_statuses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_statuses ALTER COLUMN id SET DEFAULT nextval('public.activity_statuses_id_seq'::regclass);


--
-- TOC entry 3061 (class 2604 OID 20064)
-- Name: activity_task_statuses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_task_statuses ALTER COLUMN id SET DEFAULT nextval('public.activity_task_statuses_id_seq'::regclass);


--
-- TOC entry 3062 (class 2604 OID 20065)
-- Name: activity_tasks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_tasks ALTER COLUMN id SET DEFAULT nextval('public.activity_tasks_id_seq'::regclass);


--
-- TOC entry 3063 (class 2604 OID 20066)
-- Name: cities id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cities ALTER COLUMN id SET DEFAULT nextval('public.cities_id_seq'::regclass);


--
-- TOC entry 3064 (class 2604 OID 20067)
-- Name: contact_activities id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_activities ALTER COLUMN id SET DEFAULT nextval('public.contact_activities_id_seq'::regclass);


--
-- TOC entry 3065 (class 2604 OID 20068)
-- Name: contact_groups id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_groups ALTER COLUMN id SET DEFAULT nextval('public.contact_groups_id_seq'::regclass);


--
-- TOC entry 3066 (class 2604 OID 20069)
-- Name: contact_users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_users ALTER COLUMN id SET DEFAULT nextval('public.contact_users_id_seq'::regclass);


--
-- TOC entry 3067 (class 2604 OID 20070)
-- Name: contacts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts ALTER COLUMN id SET DEFAULT nextval('public.contacts_id_seq'::regclass);


--
-- TOC entry 3068 (class 2604 OID 20071)
-- Name: directions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directions ALTER COLUMN id SET DEFAULT nextval('public.directions_id_seq'::regclass);


--
-- TOC entry 3069 (class 2604 OID 20072)
-- Name: files id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.files ALTER COLUMN id SET DEFAULT nextval('public.files_id_seq'::regclass);


--
-- TOC entry 3070 (class 2604 OID 20073)
-- Name: group_roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_roles ALTER COLUMN id SET DEFAULT nextval('public.group_roles_id_seq'::regclass);


--
-- TOC entry 3071 (class 2604 OID 20074)
-- Name: group_types id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_types ALTER COLUMN id SET DEFAULT nextval('public.group_types_id_seq'::regclass);


--
-- TOC entry 3072 (class 2604 OID 20075)
-- Name: groups id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups ALTER COLUMN id SET DEFAULT nextval('public.groups_id_seq'::regclass);


--
-- TOC entry 3073 (class 2604 OID 20076)
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- TOC entry 3074 (class 2604 OID 20077)
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- TOC entry 3075 (class 2604 OID 20078)
-- Name: portfolio_types id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolio_types ALTER COLUMN id SET DEFAULT nextval('public.portfolio_types_id_seq'::regclass);


--
-- TOC entry 3076 (class 2604 OID 20079)
-- Name: portfolios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolios ALTER COLUMN id SET DEFAULT nextval('public.portfolios_id_seq'::regclass);


--
-- TOC entry 3077 (class 2604 OID 20080)
-- Name: post_types id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_types ALTER COLUMN id SET DEFAULT nextval('public.post_types_id_seq'::regclass);


--
-- TOC entry 3078 (class 2604 OID 20081)
-- Name: posts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts ALTER COLUMN id SET DEFAULT nextval('public.posts_id_seq'::regclass);


--
-- TOC entry 3079 (class 2604 OID 20082)
-- Name: regions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.regions ALTER COLUMN id SET DEFAULT nextval('public.regions_id_seq'::regclass);


--
-- TOC entry 3080 (class 2604 OID 20083)
-- Name: requets_statuses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requets_statuses ALTER COLUMN id SET DEFAULT nextval('public.requets_statuses_id_seq'::regclass);


--
-- TOC entry 3081 (class 2604 OID 20084)
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- TOC entry 3082 (class 2604 OID 20085)
-- Name: tag_levels id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag_levels ALTER COLUMN id SET DEFAULT nextval('public.tag_levels_id_seq'::regclass);


--
-- TOC entry 3083 (class 2604 OID 20086)
-- Name: tags id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);


--
-- TOC entry 3084 (class 2604 OID 20087)
-- Name: user_abstracts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_abstracts ALTER COLUMN id SET DEFAULT nextval('public.user_abstracts_id_seq'::regclass);


--
-- TOC entry 3085 (class 2604 OID 20088)
-- Name: vacancies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vacancies ALTER COLUMN id SET DEFAULT nextval('public.vacancies_id_seq'::regclass);


--
-- TOC entry 3386 (class 0 OID 19843)
-- Dependencies: 202
-- Data for Name: activities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activities (id, name, creater_id, created_at, img, description, status_id, decoration, group_id, fields, direction_id) FROM stdin;
23	Food Diary	22	2024-05-01 19:37:09.832629	{"id": 349, "url": "MEHD1ACG927LBY1VT086_1714581565485.png"}	Приложение для отслеживания физической активности и питания	1	{}	1	{}	5
19	Энергодом	1	2024-04-30 14:33:12.555536	{"id": 327, "url": "J1IMZBADRUHGAUED3JR6_1714477008685.png"}	Система учета и анализа потребления энергии в доме или офисе	2	{}	1	{}	6
22	Cognitive Gym	22	2024-05-01 19:27:22.304041	{"id": 348, "url": "JYIX63GGM0O7INCX404W_1714581047412.png"}	Приложение для ментального тренинга и развития когнитивных способностей	1	{}	1	{}	12
13	Sign Sense	1	2024-04-10 21:15:15.090204	{"id": 314, "url": "QL17NA2OQB3R3QOMAWYZ_1714259012085.png"}	Интеллектуальная система распознавания дорожных знаков	2	{"id": 316, "coverImage": "DPEOF0GNH3SOIRU6NPLX_20117.jpg"}	\N	{}	7
17	Space Tour	1	2024-04-30 10:43:32.917345	{"id": 325, "url": "YQTARV6A9CMBT0T9J0KL_1714463774840.png"}	Онлайн-платформа для поиска и бронирования космических туров	1	{"id": 323, "coverImage": "NZL0JEUSE501PEATE6YC_14658088_5509862.jpg"}	21	{}	16
20	Одевайка	19	2024-05-01 15:09:24.475852	{"id": 328, "url": "5G1MJSSFC5JTIUTPADGU_1714565640757.png"}	Приложения для оценки и выбора собственного стиля одежды	1	{"id": 329, "coverImage": "AYTA3LK14Q5B9VGEHI3J_13405043_5242212.jpg"}	27	{}	2
3	Pro Connect	1	2024-03-18 16:39:54.79885	{"id": 52, "url": "logo_QZMUEFHAKZA3AFWGMYP1.png"}	Площадка для реализации идей	2	{"id": 56, "coverImage": "1671677199_kalix-club-p-sinyaya-abstraktsiya-vkontakte-3_GDG9GRUO5NSPXIW80LO0.jpg"}	1	{}	1
1	Helper Teacher	1	2024-03-18 16:28:35.635245	{"id": 55, "url": "1711214543677_DH5146U8PYD1M04F26G8.png"}	Сервис упрощающий рутинную работу учителям	1	{"id": 57, "coverImage": "1677332067_bogatyr-club-p-temno-sinii-fon-vkontakte-44_AHNFWJ11EMHF9UARE913.jpg"}	\N	{}	1
18	ГидКарта	1	2024-04-30 14:29:45.477375	{"id": 326, "url": "G73ZUVOLK52YU6WQTOYT_1714476719975.png"}	Онлайн-сервис для обмена информацией о местных достопримечательностях и туристических маршрутах	1	{}	\N	{}	16
21	Healthy Lifestyle Hub	21	2024-05-01 17:29:38.694155	{"id": 335, "url": "HAKJ632QR1D0S9GSX6EM_1714574072652.png"}	Сервис для обмена опытом и знаниями в области здорового образа жизни и фитнеса	2	{"id": 334, "coverImage": "Q8HCBCUZQY3GO0ECQSYS_12811084_5050388.jpg"}	28	{}	5
43	TeamBridge	5	2024-05-29 21:11:14.758403	{"id": 406, "url": "4YC1TFMQT0YSKUM00CP3_1717189509945.png"}	Система для управления задачами и проектами в команде	1	{}	\N	{}	10
26	Smart Home	1	2024-05-29 15:20:16.712535	{"id": 417, "url": "VTAQJ1LSIUXN2LIQ7LMH_1717190575367.png"}	Система умного дома с использованием IoT-технологий	1	{}	\N	{}	13
27	Говори и переводи	1	2024-05-29 15:21:35.220586	{"id": 418, "url": "CXYB66JS8I47P7KNT5EX_1717311127575.png"}	Игровое приложение для изучения иностранных языков	1	{}	\N	{}	12
28	Обмен Знаниями	1	2024-05-29 15:22:11.830476	{"id": 419, "url": "QYLTBNV2R4TSYDPBIKYG_1717311217127.png"}	Сервис для обмена опытом и знаниями между профессионалами разных отраслей	1	{}	\N	{}	12
29	Спутник	1	2024-05-29 15:24:37.392487	{"id": 420, "url": "QLZFACMVC3UY4AGMWA4V_1717311320506.png"}	Приложение для поиска и бронирования туров и экскурсий	1	{}	\N	{}	16
32	Мои финансы	2	2024-05-29 15:30:50.089858	{"id": 425, "url": "P0QIXKBK58XP7Y6J00TI_1717314013645.png"}	Приложение для управления финансами и бюджетом	2	{}	\N	{}	9
36	Зелёные тропы	3	2024-05-29 15:43:28.782728	{"id": 428, "url": "IK7Q5WV1EKJCRIBLOEEL_1717314387839.png"}	Приложение для поиска идеального места для пикника или отдыха на природе	1	{}	\N	{}	16
35	Готовим вместе	3	2024-05-29 15:42:51.682555	{"id": 431, "url": "26UKASGI869VKQN6OFBM_1717314619537.png"}	Сервис для обмена рецептами и кулинарными идеями	1	{}	\N	{}	17
34	Электронный наставник	3	2024-05-29 15:41:38.558428	{"id": 430, "url": "GK81EPKFTZXA14JVZ5OQ_1717314504119.png"}	Платформа для онлайн-обучения и дистанционных курсов	2	{}	\N	{}	12
38	Explore Together	4	2024-05-29 16:18:59.619159	{"id": 432, "url": "GLQWC1BMH2RYE56VJATR_1717314657289.png"}	Приложение для организации групповых поездок и путешествий	1	{}	\N	{}	16
39	Большой Фикус	4	2024-05-29 16:21:07.874262	{"id": 434, "url": "3GCIF8N1ORA55BBRE1M2_1717314830534.png"}	Сервис для обмена растениями и саженцами среди садоводов и цветоводов	1	{}	\N	{}	17
40	Фото Академия	4	2024-05-29 16:25:55.54076	{"id": 435, "url": "6RVF7IEO8WR42HTPX30J_1717314901596.png"}	Платформа для обмена опытом и знаниями в области фотографии и видеосъемки	1	{}	\N	{}	2
42	Отдыхайка	4	2024-05-29 21:10:00.681449	{"id": 436, "url": "KFNERK9Z1AOLEK8R78TC_1717314982703.png"}	Онлайн-сервис для поиска и бронирования мест в детских и оздоровительных лагерях	1	{}	\N	{}	16
31	Успешный DevOps	2	2024-05-29 15:28:12.565395	{"id": 424, "url": "RYCYP7LFB8BOMECYDIKJ_1717313960284.png"}	Онлайн-курс по программированию для начинающих	4	{}	\N	{}	12
25	Book Exchange	1	2024-05-29 15:19:20.096354	{"id": 404, "url": "0SQF3NCT61M8Q46VGTBK_1717188805659.png"}	Онлайн-платформа для обмена книгами	1	{}	\N	{}	12
45	Eventia	5	2024-05-29 21:14:50.451501	{"id": 405, "url": "0Z2X8AJZWVYU1DR3ZS70_1717189403740.png"}	Платформа для организации совместных мероприятий и встреч с друзьями	1	{}	\N	{}	10
44	Фейерверк идей	5	2024-05-29 21:13:27.55165	{"id": 407, "url": "NXOFIY84IH8JAYOOMCJG_1717189611076.png"}	Сервис для обмена подарками и идеями для праздников	2	{}	\N	{}	2
46	Фитнес-трекер	5	2024-05-29 21:16:22.970545	{"id": 408, "url": "MAQUQNNY7XFQCJ6LT3GK_1717189718774.png"}	Система учета и анализа личных тренировок и спортивных достижений	1	{}	\N	{}	8
48	SiteBuilder	5	2024-05-29 21:19:13.579301	{"id": 409, "url": "DPCW5JGX41XWNI2E0U0O_1717189798841.png"}	Приложение для создания и управления собственным блогом или сайтом	1	{}	\N	{}	1
47	Культурный мост	5	2024-05-29 21:17:08.781694	{"id": 410, "url": "Q3IKRO0ZBRWQH1BWDXN9_1717189871933.png"}	Сервис для обмена культурными ценностями и традициями между разными странами	1	{}	\N	{}	16
49	EventSpace	8	2024-05-29 21:23:18.039997	{"id": 411, "url": "ZN9TD6OHG6JRSMSZJXLS_1717189942383.png"}	Платформа для поиска идеального места для проведения корпоративных мероприятий	1	{}	\N	{}	10
51	Music Composer	8	2024-05-29 21:24:45.795266	{"id": 412, "url": "J2ACAJD6FJJFH5TR2F4O_1717189973347.png"}	Приложение для создания и публикации собственных музыкальных композиций	1	{}	\N	{}	2
50	Читательский круг	8	2024-05-29 21:24:08.621836	{"id": 413, "url": "V0XQ9DD78XHCF5DZ1N9A_1717190067447.png"}	Онлайн-сервис для обмена книгами и литературными произведениями	1	{}	\N	{}	12
52	Преодоление границ	8	2024-05-29 21:25:33.957658	{"id": 414, "url": "7HMP6W964QQ39YK1JCLC_1717190154642.png"}	Платформа для организации онлайн-тренингов и курсов по саморазвитию	1	{}	\N	{}	12
53	MedTech Innovations	26	2024-05-31 18:14:05.190849	{"id": 415, "url": "C2A1OT9RXKJRSAT1YTV5_1717190243462.png"}	Инновационное решение в области медицины, основанное на использовании искусственного интеллекта и машинного обучения для анализа медицинских данных и предоставления персонализированных рекомендаций по лечению и профилактике заболеваний.	2	{}	\N	{}	5
24	Волшебный день	25	2024-05-02 02:20:26.717984	{"id": 416, "url": "Y9W405JQXUYAH9N4NV44_1717190424543.png"}	Приложение для поиска идеального места для свадебной церемонии	1	{}	21	{}	17
30	Music Hub	2	2024-05-29 15:27:17.410701	{"id": 423, "url": "VY43RSQ7T6CH919LNKAI_1717313844184.png"}	Платформа для обмена музыкой и создания собственных плейлистов	2	{}	\N	{}	2
33	Кафе Поиск	3	2024-05-29 15:40:54.613166	{"id": 427, "url": "TOOVQNJLWI1UR77NZLYK_1717314149400.png"}	Сервис для поиска и бронирования ресторанов и кафе	1	{}	\N	{}	17
37	Финансовая гармония	4	2024-05-29 15:46:31.797576	{"id": 433, "url": "ULEW6ASIBGOOI03L18KF_1717314765800.png"}	Система для автоматизации процессов управления своими деньгами	1	{}	\N	{}	9
41	Вкусные истории	4	2024-05-29 21:08:19.301292	{"id": 437, "url": "6TSL2X9Z1A74ZLUI52NM_1717315057132.png"}	Приложение для создания и публикации собственных кулинарных рецептов	1	{}	\N	{}	17
11	Голос Города	9	2024-03-24 12:47:59.340121	{"id": 61, "url": "1711285017488_N6UU51BVSHGF06IHL9C1.png"}	Проект «Голос Города» представляет собой информационно-навигационную платформу (веб-приложение) с голосовым ассистентом, цель которого информирование туристов и жителей о событиях, мероприятиях города	3	{"id": 60, "coverImage": "\\u0411\\u0435\\u0437_\\u0438\\u043c\\u0435\\u043d\\u0438_OW1XLP11QXI6AMT5KNLR.png"}	5	{}	16
\.


--
-- TOC entry 3388 (class 0 OID 19851)
-- Dependencies: 204
-- Data for Name: activity_statuses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activity_statuses (id, name) FROM stdin;
1	идея
2	прототип
3	mvp (минимально жизнеспособный продукт)
4	первые продажи
5	масштабирование
\.


--
-- TOC entry 3390 (class 0 OID 19856)
-- Dependencies: 206
-- Data for Name: activity_task_assignments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activity_task_assignments (user_id, task_id, created_at) FROM stdin;
1	7	2024-04-04 18:53:21.750226
1	12	2024-04-04 18:53:41.960242
5	12	2024-04-25 00:35:44.043065
8	12	2024-04-27 11:51:01.059349
1	21	2024-05-29 11:42:13.709358
9	8	2024-06-04 06:45:56.305316
1	25	2024-06-04 06:46:14.230886
\.


--
-- TOC entry 3391 (class 0 OID 19859)
-- Dependencies: 207
-- Data for Name: activity_task_statuses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activity_task_statuses (id, name, is_change) FROM stdin;
1	Поставлена	f
2	Принята к исполнению	t
3	Выполнена	t
4	На исправление	t
\.


--
-- TOC entry 3393 (class 0 OID 19864)
-- Dependencies: 209
-- Data for Name: activity_tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activity_tasks (id, name, description, creater_id, activity_id, status_id, deadline, created_at, materials) FROM stdin;
8	string	≡ Краткое руководство Markdown\n\n# Заголовок h1\n## Заголовок h2\n### Заголовок h3\n#### Заголовок h4\n##### Заголовок h5\n###### Заголовок h6\n\nАбзац Markdown. Пример:\n\nLorem ipsum dolor sit amet... Абзацы создаются при помощи пустой строки.\n\nДля переноса строки делаем два пробела ` ` ` ` в конце (предыдущей) строки\nПеренос строки\n\nПолучается? Отлично! :+1:\n\nТекст с жирным начертанием (**strong**) и курсив (*italic*) в Markdown:\n\n_1 символ_ `_` или `*` для наклонного текста\n__2 символа__  `__` или `**` для жирного текста\n***3 символа*** `___` или `***` для наклонного и жирного одновременно.\n\nПеречеркнутый текст. 2 тильды `~` до и после текста - текст как перечеркнутый - ~~Зачеркнуто~~\n\nГоризонтальная черта. `hr` - 3 звездочки или 3 дефиса\n\n***\n\n♦ Маркированный список. Для разметки неупорядоченных списков `*`, `-`, `+`:\n\n* текст\n* текст\n* текст\n\nВложенные пункты. 4 пробела перед маркером:\n\n* элемент маркированного списка\n* элемент маркированного списка\n    * вложенный текст\n    * вложенный текст\n\nНумерованный список. Главное, чтобы перед элементом списка стояла цифра с точкой.\n\n1. элемент нумерованного списка\n2. элемент нумерованного списка\n    1. вложенный\n    2. вложенный\n\nМожно сделать так:\n\n0. текст\n0. текст\n0. текст\n\nСписок с абзацами:\n\n* Текст\n* Текст\n* Текст\n\n    Текст (4 пробела или `Tab`).\n\n---\n\n##### ♦ Ссылки Markdown\n\nЗдесь - [ссылка с title](http://example.com/ "Привет!").\n\nЗдесь - [ссылка без title](http://example.com/).\n\nСсылки с разметкой как у сносок.\n\nЗдесь - [ссылка][1] продолжение текста [ссылка][2] продолжение текста [ссылка][id]. [Просто ссылка][] без указания id.\n\n[1]: http://example.com/ "Пример Title"\n[2]: http://example.com/page\n[id]: http://example.com/links (Пример Title)\n[Просто ссылка]: http://example.com/short\n\nСсылки-сноски можно располагать в любом месте документа.\n\n---\n\n##### Цитаты в Markdown - cимвол `>`.\n\n> Lorem ipsum dolor sit amet.\n> Lorem ipsum dolor sit amet.\n>\n> Lorem ipsum dolor sit amet.\n\nВ цитаты можно помещать всё что угодно, в том числе вложенные цитаты:\n\n> ### Заголовок.\n>\n> 1. список\n> 2. список\n>\n> > Вложенная цитата.\n>\n> Исходный код (4 пробела в начале строки):\n>\n>     $source = file_get_contents('example.php');\n\n##### Исходный код в Markdown\n\nВ GFM - поставить 3 апострофа (где `Ё`) до и после кода. Можно указать язык исходного кода.\n\n```html\n<div class="as-header">\n    <h1>Матрёшка</h1>\n    <p>Lorem ipsum dolor sit amet.</p>\n</div>\n```\n\n```javascript\n    $(function() { ... });\n```\n\nДля вставки кода внутри предложений - надо обрамить в апострофы (где `Ё`).\n\nПример: `<div class="as-markdown">`.\n\nЕсли внутри кода есть апостроф, то код надо обрамить двойными апострофами: ``Бла-бла (`) тут.``\n\n##### Картинки в Markdown\n\nКартинка без alt текста\n\n![](//placehold.it/200x100)\n\nКартинка с alt и title:\n\n![Alt text](//placehold.it/200x100 "Здесь title")\n\nКартинка-ссылка:\nПодсказка: синтаксис как у ссылок, только перед открывающей квадратной скобкой ставится восклицательный знак.\n\n[![Alt text](//placehold.it/200x100)](http://example.com/)\n\nКартинки-сноски:\n\n![Картинка][image1]\n![Картинка][image2]\n![Картинка][image3]\n\n[image1]: //placehold.it/200x100\n[image2]: //placehold.it/150x100\n[image3]: //placehold.it/100x100\n\n---\n\n##### Использование HTML внутри Markdown\n\nMожно смешивать Markdown и HTML. Если на какие-то элементы нужно поставить классы или атрибуты, используем HTML:\n\n> Выделим слова без помощи * и _ . Например, это <em class="as-italic">курсив</em> и это тоже <i>курсив</i>. А вот так уже <b>strong</b>, и так тоже <strong>strong</strong>.\n\nМожно и наоборот, внутри HTML-тегов использовать Markdown.\n\n<div class="as-markdown">\n\n###### Markdown внутри HTML. Пример:\n\nВыделять слова можно при помощи `*` и `_` . Например, это _курсив_ и это тоже *italic*. А вот так уже __strong__, и так тоже **strong**.\n\n</div>\n\n---\n\n##### Таблицы\n\nВ чистом Маркдауне нет синтаксиса для таблиц, а в GFM есть. Рисуем:\n\nFirst Header  | Second Header\n------------- | -------------\nContent Cell  | Content Cell\nContent Cell  | Content Cell\n\nМожно по бокам линии нарисовать:\n\n| First Header  | Second Header |\n| ------------- | ------------- |\n| Content Cell  | Content Cell  |\n| Content Cell  | Content Cell  |\n\nМожно управлять выравниванием столбцов при помощи двоеточия:\n\n| Left-Aligned  | Center Aligned  | Right Aligned |\n|:------------- |:---------------:| -------------:|\n| col 3 is      | какой-то текст  |   **my text** |\n| col 2 is      | центр           |           $123|\n| Content Cell  | бука            |         ~~$7~~|\n\nВнутри таблиц можно использовать ссылки, наклонный, жирный или зачеркнутый текст.\n\n---\n\n♦ Для всего остального есть обычный HTML.\n\n---\n\n###### Links:\n\n * <small>[markdown-it](https://github.com/markdown-it/markdown-it) for Markdown parsing</small>\n * <small>[CodeMirror](http://codemirror.net/) for the awesome syntax-highlighted editor</small>\n * <small>[Live (Github-flavored)](https://github.com/jbt/markdown-editor) Markdown Editor</small>\n * <small>[highlight.js](http://softwaremaniacs.org/soft/highlight/en/) for syntax highlighting in output code blocks</small>\n * <small>[js-deflate](https://github.com/dankogai/js-deflate) for gzipping of data to make it fit in URLs</small>\n	1	11	1	2024-03-30 00:00:00	2024-03-30 20:53:36.808907	{"files": [], "images": []}
7	string	I :heart: ngx-markdown\n# Dillinger\n## _The Last Markdown Editor, Ever_\n\n[![N|Solid](https://cldup.com/dTxpPi9lDf.thumb.png)](https://nodesource.com/products/nsolid)\n\n[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)\n\nDillinger is a cloud-enabled, mobile-ready, offline-storage compatible,\nAngularJS-powered HTML5 Markdown editor.\n\n- Type some Markdown on the left\n- See HTML in the right\n- ✨Magic ✨\n\n## Features\n\n- Import a HTML file and watch it magically convert to Markdown\n- Drag and drop images (requires your Dropbox account be linked)\n- Import and save files from GitHub, Dropbox, Google Drive and One Drive\n- Drag and drop markdown and HTML files into Dillinger\n- Export documents as Markdown, HTML and PDF\n\nMarkdown is a lightweight markup language based on the formatting conventions\nthat people naturally use in email.\nAs [John Gruber] writes on the [Markdown site][df1]\n\n> The overriding design goal for Markdown's\n> formatting syntax is to make it as readable\n> as possible. The idea is that a\n> Markdown-formatted document should be\n> publishable as-is, as plain text, without\n> looking like it's been marked up with tags\n> or formatting instructions.\n\nThis text you see here is *actually- written in Markdown! To get a feel\nfor Markdown's syntax, type some text into the left window and\nwatch the results in the right.\n\n## Tech\n\nDillinger uses a number of open source projects to work properly:\n\n- [AngularJS] - HTML enhanced for web apps!\n- [Ace Editor] - awesome web-based text editor\n- [markdown-it] - Markdown parser done right. Fast and easy to extend.\n- [Twitter Bootstrap] - great UI boilerplate for modern web apps\n- [node.js] - evented I/O for the backend\n- [Express] - fast node.js network app framework [@tjholowaychuk]\n- [Gulp] - the streaming build system\n- [Breakdance](https://breakdance.github.io/breakdance/) - HTML\nto Markdown converter\n- [jQuery] - duh\n\nAnd of course Dillinger itself is open source with a [public repository][dill]\n on GitHub.\n\n## Installation\n\nDillinger requires [Node.js](https://nodejs.org/) v10+ to run.\n\nInstall the dependencies and devDependencies and start the server.\n\n```sh\ncd dillinger\nnpm i\nnode app\n```\n\nFor production environments...\n\n```sh\nnpm install --production\nNODE_ENV=production node app\n```\n\n## Plugins\n\nDillinger is currently extended with the following plugins.\nInstructions on how to use them in your own application are linked below.\n\n| Plugin | README |\n| ------ | ------ |\n| Dropbox | [plugins/dropbox/README.md][PlDb] |\n| GitHub | [plugins/github/README.md][PlGh] |\n| Google Drive | [plugins/googledrive/README.md][PlGd] |\n| OneDrive | [plugins/onedrive/README.md][PlOd] |\n| Medium | [plugins/medium/README.md][PlMe] |\n| Google Analytics | [plugins/googleanalytics/README.md][PlGa] |\n\n## Development\n\nWant to contribute? Great!\n\nDillinger uses Gulp + Webpack for fast developing.\nMake a change in your file and instantaneously see your updates!\n\nOpen your favorite Terminal and run these commands.\n\nFirst Tab:\n\n```sh\nnode app\n```\n\nSecond Tab:\n\n```sh\ngulp watch\n```\n\n(optional) Third:\n\n```sh\nkarma test\n```\n\n#### Building for source\n\nFor production release:\n\n```sh\ngulp build --prod\n```\n\nGenerating pre-built zip archives for distribution:\n\n```sh\ngulp build dist --prod\n```\n\n## Docker\n\nDillinger is very easy to install and deploy in a Docker container.\n\nBy default, the Docker will expose port 8080, so change this within the\nDockerfile if necessary. When ready, simply use the Dockerfile to\nbuild the image.\n\n```sh\ncd dillinger\ndocker build -t <youruser>/dillinger:${package.json.version} .\n```\n\nThis will create the dillinger image and pull in the necessary dependencies.\nBe sure to swap out `${package.json.version}` with the actual\nversion of Dillinger.\n\nOnce done, run the Docker image and map the port to whatever you wish on\nyour host. In this example, we simply map port 8000 of the host to\nport 8080 of the Docker (or whatever port was exposed in the Dockerfile):\n\n```sh\ndocker run -d -p 8000:8080 --restart=always --cap-add=SYS_ADMIN --name=dillinger <youruser>/dillinger:${package.json.version}\n```\n\n> Note: `--capt-add=SYS-ADMIN` is required for PDF rendering.\n\nVerify the deployment by navigating to your server address in\nyour preferred browser.\n\n```sh\n127.0.0.1:8000\n```\n\n## Markdown __rulez__!\n---\n\n### Syntax highlight\n```typescript\nconst language = 'typescript';\n```\n\n### Lists\n1. Ordered list\n2. Another bullet point\n   - Unordered list\n   - Another unordered bullet\n\n### Blockquote\n> Blockquote to the max\n```javascript\nvar s = "JavaScript syntax highlighting";\nalert(s);\n```\n\n```python\ns = "Python syntax highlighting"\nprint s\n```	1	1	2	2024-03-30 00:00:00	2024-03-30 20:40:50.390234	{"files": [], "images": []}
12	допилить	- [x]  Рекомендации (нейронки, typesense, алгоритмы) пару штук\n- [ ] баги: найти и уничтожить	1	3	2	2024-05-31 00:00:00	2024-04-02 11:43:08.518543	{"files": [], "images": []}
21	развернуть решение	развернуть решение на SberCloud с SSL-сертификатом	1	3	3	2024-05-31 00:00:00	2024-05-29 11:42:04.866082	{"files": [], "images": []}
24	фыв	\N	26	53	1	\N	2024-05-31 18:14:43.627686	{"files": [], "images": []}
25	задача	# Описание задачи\n- первый подпункт\n- второй подпункт	9	11	1	2024-06-13 00:00:00	2024-06-04 06:45:42.388938	{"files": [{"id": 446, "name": "HRK1NH4Q7AXFXFITH5WK_\\u0444\\u0430\\u0439\\u043b.txt", "owner_id": 9, "details": {"old_name": "\\u0444\\u0430\\u0439\\u043b.txt"}}], "images": []}
\.


--
-- TOC entry 3395 (class 0 OID 19872)
-- Dependencies: 211
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admins (id, is_super) FROM stdin;
6	t
\.


--
-- TOC entry 3396 (class 0 OID 19875)
-- Dependencies: 212
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alembic_version (version_num) FROM stdin;
905036dea971
\.


--
-- TOC entry 3397 (class 0 OID 19878)
-- Dependencies: 213
-- Data for Name: cities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cities (id, name, region_id) FROM stdin;
3	Красная Слобода	3
4	Бор	3
5	Нижний Новгород	3
6	Москва	4
7	Санкт-Петербург	4
8	Севастополь	4
13	Тамбов	5
14	Курск	6
15	Черкесск	7
18	Абакан	10
19	Тюмень	11
17	Королёв	8
21	Одинцово	8
31	Владивосток	13
10	Альметьевск	1
11	Рязань	2
9	Казань	1
32	Братск	14
12	Иркутск	14
\.


--
-- TOC entry 3399 (class 0 OID 19883)
-- Dependencies: 215
-- Data for Name: contact_activities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contact_activities (id, contact_id, activity_id, value) FROM stdin;
4	7	11	http://46.243.226.43/
7	7	3	https://www.mrvaynbaum.store/
\.


--
-- TOC entry 3401 (class 0 OID 19888)
-- Dependencies: 217
-- Data for Name: contact_groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contact_groups (id, contact_id, group_id, value) FROM stdin;
9	1	1	https://vk.com/club_deviteam
10	7	6	https://www.miriteam.com/
11	6	6	+7 (960) 185-99-55
12	1	6	https://vk.com/miriteam
\.


--
-- TOC entry 3403 (class 0 OID 19893)
-- Dependencies: 219
-- Data for Name: contact_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contact_users (id, contact_id, user_id, value) FROM stdin;
5	1	1	https://vk.com/mr.vaynbaum
10	4	1	https://github.com/Vaynbaum
13	6	1	89524621655
14	8	1	mr.vaynbaum@mail.ru
16	2	1	https://t.me/vaynbaum
17	1	5	https://vk.com/v.romanmelnikov
18	1	2	https://vk.com/idigidrid
19	1	3	https://vk.com/id144522468
20	1	4	https://vk.com/id461912673
23	8	10	miriteam.school@gmail.com
24	6	10	+7 (960) 185-99-55
33	6	18	+7 (927) 416-40-96
34	8	18	nikolay1990@gmail.com
35	6	13	+7 (991) 558-33-87
36	8	13	vyacheslav22081973@mail.ru
37	1	10	https://vk.com/kaer1n
38	6	19	+7 (984) 897-78-67
39	8	19	konstantin.salagin@rambler.ru
40	6	20	+7 (912) 260-27-63
41	8	20	yakov4662@hotmail.com
42	6	21	+7 (954) 266-60-19
43	8	21	timofey.agafonov@yandex.ru
44	8	22	larisa1977@hotmail.com
45	6	22	+7 (924) 901-78-94
46	6	25	+7 (950) 915-40-33
47	8	25	kira5974@yandex.ru
48	8	27	lokor87931@crodity.com
\.


--
-- TOC entry 3405 (class 0 OID 19898)
-- Dependencies: 221
-- Data for Name: contacts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contacts (id, title, icon, prefix, is_redirect, details) FROM stdin;
1	ВКонтакте	vk.png	https://vk.com/	t	\N
2	Telegram	telegram.png	https://t.me/	t	\N
3	Discord	discord.png	https://discord.com/users/	t	\N
4	GitHub	github.png	https://github.com/	t	\N
5	Instagram	instagram.png	https://www.instagram.com/	t	\N
6	Телефон	call	\N	f	{"copy_sucess":"Телефон скопирован!","copy_fail":"Не удалось скопировать телефон"}
7	Сайт	language	\N	t	\N
8	Почта	email	\N	f	{"copy_sucess":"Почта скопирована!","copy_fail":"Не удалось скопировать почту"}
10	Другое	link	\N	f	{"copy_sucess":"Контакт скопирован!","copy_fail":"Не удалось скопировать контакт"}
9	На платформе	web	http://localhost:4200/	t	\N
\.


--
-- TOC entry 3407 (class 0 OID 19906)
-- Dependencies: 223
-- Data for Name: directions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.directions (id, name, icon) FROM stdin;
1	IT	code
3	биотех	biotech
5	медицина и здоровье	medical_services
6	энергетика	bolt
7	транспорт	local_shipping
8	спорт	sports_soccer
9	финансы	payments
10	управление	bookmark_manager
11	безопасность	security
12	образование	school
13	недвижимость	location_city
14	право	gavel
15	производство и технологии	precision_manufacturing
17	другое	more_horiz
16	туризм	explore
4	химия	science
2	креативные индустрии	emoji_objects
\.


--
-- TOC entry 3409 (class 0 OID 19914)
-- Dependencies: 225
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.files (id, name, owner_id, details, created_at) FROM stdin;
282	0ZRSQ061294NMMRIK8NA_Certificate-_1_.png	1	{"old_name": "Certificate-_1_.png"}	2024-04-24 20:55:54.057805
5	1709921178475_FMHUZMDCRP7Q1U9PYO07.jpeg	5	{}	\N
6	r-SOJcBSFr4_CZ0PWO926VGGDTX3XI4P.jpg	5	{}	\N
284	8ST1KN2ZKPGHCFG8SP5B_Certificate_finals_page-0001.jpg	1	{"old_name": "Certificate_finals_page-0001.jpg"}	2024-04-24 20:57:02.525158
253	7930XQYJJNG6I0I2AS8G_7HUOzxM_49U.jpg	1	{"old_name": "7HUOzxM_49U.jpg"}	2024-04-23 20:38:34.455235
11	5GLUkKON5qA_4Y2JEERA2CRYSABPN7TY.jpg	2	{}	\N
12	1709935773065_6TICO9A32RLSV6B2MAVZ.jpeg	4	{}	\N
13	1709935901116_QOE4A446WCRM2G0FQ7RN.jpeg	3	{}	\N
254	7TVWNEO6FU3R7ISNXZWR_0c3d42c3f26144bc839b206080c061f3.pdf	1	{"old_name": "0c3d42c3f26144bc839b206080c061f3.pdf"}	2024-04-23 20:53:17.192637
285	MVLOFRNF1H34L4EE25NK_uQKGs3uQlkE.jpg	1	{"old_name": "uQKGs3uQlkE.jpg"}	2024-04-24 21:29:39.361259
286	FRPG3RZLSTD9J4VI29LJ_stepik-certificate-73418-feef020_(1)_page-0001.jpg	1	{"old_name": "stepik-certificate-73418-feef020 (1)_page-0001.jpg"}	2024-04-24 21:34:11.156696
292	0WB4S0ZBT9HUVEKMGU09_photo_5231156036818291194_y.jpg	9	{"old_name": "photo_5231156036818291194_y.jpg"}	2024-04-25 11:21:30.654019
293	DMR68QJUBJO5GMZGJ0T9_1714255366114.png	18	{"old_name": "1714255366114.png"}	2024-04-27 22:02:48.692654
296	4T01IGD2JV4YK6Y1L3II_Фоны_для_обложек_ВК.jpg	18	{"old_name": "\\u0424\\u043e\\u043d\\u044b \\u0434\\u043b\\u044f \\u043e\\u0431\\u043b\\u043e\\u0436\\u0435\\u043a \\u0412\\u041a.jpg"}	2024-04-27 22:11:48.263598
25	1710018465138_L0RA9K9F2RANSI0CVDH4.png	1	{}	\N
27	kub-temnyy-tekstura-formy-kartinki-325-2279_KH2SR0VWPSI5K1DFBNDR_C77YDQUJ4W1RFECN7L55.jpg	1	{}	\N
299	46UGWN6I1H41F7K6T3WY_1714256450759.jpeg	13	{"old_name": "1714256450759.jpeg"}	2024-04-27 22:20:53.203352
300	DGHQGFMOMXELZMG91T3J_Network.jpg	13	{"old_name": "Network.jpg"}	2024-04-27 22:21:47.220795
301	WT835ENCA9G1JCEC5GOE_1714256717567.jpeg	10	{"old_name": "1714256717567.jpeg"}	2024-04-27 22:25:19.665481
32	image_861109181712294698219_HWLA4BCMF7OMGFXY9HQQ.gif	1	{}	\N
33	1710350156117_8705W9NPKIN9O7JFTKD4.jpeg	9	{}	\N
34	1710350424598_RZ04DRLYQRM9ES6553QC.png	9	{}	\N
303	L4G7NBYAMFRYSJR8P7C3_Без_названия.jpg	10	{"old_name": "\\u0411\\u0435\\u0437 \\u043d\\u0430\\u0437\\u0432\\u0430\\u043d\\u0438\\u044f.jpg"}	2024-04-27 22:27:39.319729
36	1710350757056_0E6EK72ZIOXFY5JL7OB6.png	5	{}	\N
37	1710351255115_B6DIWY7J5CL1VZ79M4S8.jpeg	8	{}	\N
304	GTYUYXNG1FFTU7BGU2X2_122988.jpg	10	{"old_name": "122988.jpg"}	2024-04-27 22:30:40.85742
305	WAW934ZW9DC90RQRUGQ8_1714257224083.png	10	{"old_name": "1714257224083.png"}	2024-04-27 22:33:46.479807
306	TGIHHW6BMX08RN6MI20C_1714257348790.png	1	{"old_name": "1714257348790.png"}	2024-04-27 22:35:50.875929
307	P9ZXBZTRZT045WZOEX3U_Whhhite_—_segmented.jpg	1	{"old_name": "Whhhite \\u2014 segmented.jpg"}	2024-04-27 22:36:39.924849
308	YNF4V9HEKVLMZAH7BFJV_1714257923193.jpeg	19	{"old_name": "1714257923193.jpeg"}	2024-04-27 22:45:25.609171
309	IV4AEQ6JCOO4PK9WYRJP_1dfb6dac-ecb5-4e36-b340-6807daa631b6.jpg	19	{"old_name": "1dfb6dac-ecb5-4e36-b340-6807daa631b6.jpg"}	2024-04-27 22:45:27.301673
310	HRNAB7Q08OYW5G47JGB5_1714258427007.jpeg	19	{"old_name": "1714258427007.jpeg"}	2024-04-27 22:53:49.427446
311	23WNT5J3BZPVIP3NXC2P_125000.jpg	19	{"old_name": "125000.jpg"}	2024-04-27 22:55:00.452751
314	QL17NA2OQB3R3QOMAWYZ_1714259012085.png	1	{"old_name": "1714259012085.png"}	2024-04-27 23:03:34.291196
52	logo_QZMUEFHAKZA3AFWGMYP1.png	1	{}	\N
316	DPEOF0GNH3SOIRU6NPLX_20117.jpg	1	{"old_name": "20117.jpg"}	2024-04-27 23:04:09.795356
55	1711214543677_DH5146U8PYD1M04F26G8.png	1	{}	\N
56	1671677199_kalix-club-p-sinyaya-abstraktsiya-vkontakte-3_GDG9GRUO5NSPXIW80LO0.jpg	1	{}	\N
57	1677332067_bogatyr-club-p-temno-sinii-fon-vkontakte-44_AHNFWJ11EMHF9UARE913.jpg	1	{}	\N
60	Без_имени_OW1XLP11QXI6AMT5KNLR.png	9	{}	\N
61	1711285017488_N6UU51BVSHGF06IHL9C1.png	9	{}	\N
323	NZL0JEUSE501PEATE6YC_14658088_5509862.jpg	1	{"old_name": "14658088_5509862.jpg"}	2024-04-30 07:53:46.304347
325	YQTARV6A9CMBT0T9J0KL_1714463774840.png	1	{"old_name": "1714463774840.png"}	2024-04-30 07:56:17.022687
326	G73ZUVOLK52YU6WQTOYT_1714476719975.png	1	{"old_name": "1714476719975.png"}	2024-04-30 11:32:02.305429
327	J1IMZBADRUHGAUED3JR6_1714477008685.png	1	{"old_name": "1714477008685.png"}	2024-04-30 11:36:50.820658
328	5G1MJSSFC5JTIUTPADGU_1714565640757.png	19	{"old_name": "1714565640757.png"}	2024-05-01 12:14:03.58823
329	AYTA3LK14Q5B9VGEHI3J_13405043_5242212.jpg	19	{"old_name": "13405043_5242212.jpg"}	2024-05-01 12:15:57.360325
330	PHLV6PU1VJWDIDBFB9M3_1714573071081.png	20	{"old_name": "1714573071081.png"}	2024-05-01 14:17:53.505077
331	9GDGB8H9PA8V8V1THF6K_2148393480.jpg	20	{"old_name": "2148393480.jpg"}	2024-05-01 14:18:32.640238
332	UK3QIRQYTYXOENG34QV2_8478.jpg	21	{"old_name": "8478.jpg"}	2024-05-01 14:22:12.245073
333	93F6SKQGOPVU1A3NHTHJ_1714573381744.png	21	{"old_name": "1714573381744.png"}	2024-05-01 14:23:04.164488
334	Q8HCBCUZQY3GO0ECQSYS_12811084_5050388.jpg	21	{"old_name": "12811084_5050388.jpg"}	2024-05-01 14:31:29.804136
335	HAKJ632QR1D0S9GSX6EM_1714574072652.png	21	{"old_name": "1714574072652.png"}	2024-05-01 14:34:35.154196
336	blur_3Q04KVTUQ0BCG5B675MP_2149350001.jpg	21	{"old_name": "2149350001.jpg"}	2024-05-01 14:46:59.090384
337	3Q04KVTUQ0BCG5B675MP_2149350001.jpg	21	{"old_name": "2149350001.jpg", "blur_image": {"id": 336, "name": "blur_3Q04KVTUQ0BCG5B675MP_2149350001.jpg", "owner_id": 21, "details": {"old_name": "2149350001.jpg"}}}	2024-05-01 14:46:59.09425
338	blur_5OJBTOLYVN1WV948QOGD_2149546688.jpg	21	{"old_name": "2149546688.jpg"}	2024-05-01 14:47:48.151953
339	5OJBTOLYVN1WV948QOGD_2149546688.jpg	21	{"old_name": "2149546688.jpg", "blur_image": {"id": 338, "name": "blur_5OJBTOLYVN1WV948QOGD_2149546688.jpg", "owner_id": 21, "details": {"old_name": "2149546688.jpg"}}}	2024-05-01 14:47:48.155491
340	blur_ZAAWBZ1SLKFLKPYHRCGK_2148523213.jpg	21	{"old_name": "2148523213.jpg"}	2024-05-01 14:48:47.581967
341	ZAAWBZ1SLKFLKPYHRCGK_2148523213.jpg	21	{"old_name": "2148523213.jpg", "blur_image": {"id": 340, "name": "blur_ZAAWBZ1SLKFLKPYHRCGK_2148523213.jpg", "owner_id": 21, "details": {"old_name": "2148523213.jpg"}}}	2024-05-01 14:48:47.58562
342	2W8F4Q1N8KBBMSVNJKQ9_1714575454806.png	21	{"old_name": "1714575454806.png"}	2024-05-01 14:57:37.22263
343	LTHGFXHVY4OM0RXFFP3P_2148846103.jpg	21	{"old_name": "2148846103.jpg"}	2024-05-01 14:58:13.127621
344	EWS2AOD49YMFFSTAO7H3_1714578670139.png	22	{"old_name": "1714578670139.png"}	2024-05-01 15:51:12.573991
364	blur_VOAKZ6PXBIJ00AWQUT5G_00_ryazan.jpg	3	{"old_name": "00_ryazan.jpg"}	2024-05-29 12:35:46.856747
287	PDNSSQGOX366WR7QQ7CR_2022684619_page-0001.jpg	9	{"old_name": "2022684619_page-0001.jpg"}	2024-04-25 10:58:26.41416
319	OGLTYBK1UYJ0FYW0QAX4_1714307015268.png	6	{"old_name": "1714307015268.png"}	2024-04-28 12:23:37.780497
320	NWXKZWUIAJ7EGWPKONUV_1671677199_kalix-club-p-sinyaya-abstraktsiya-vkontakte-3_GDG9GRUO5NSPXIW80LO0.jpg	6	{"old_name": "1671677199_kalix-club-p-sinyaya-abstraktsiya-vkontakte-3_GDG9GRUO5NSPXIW80LO0.jpg"}	2024-04-28 12:23:57.275069
346	FM9RORIIQXG1CZO0WT5Y_Без_имени.png	22	{"old_name": "\\u0411\\u0435\\u0437 \\u0438\\u043c\\u0435\\u043d\\u0438.png"}	2024-05-01 16:22:31.52566
348	JYIX63GGM0O7INCX404W_1714581047412.png	22	{"old_name": "1714581047412.png"}	2024-05-01 16:30:49.561853
349	MEHD1ACG927LBY1VT086_1714581565485.png	22	{"old_name": "1714581565485.png"}	2024-05-01 16:39:27.975851
350	blur_OKRE9VM4IDXGLRMIJ69E_20200125110231_Priroda_10-344.jpg	1	{"old_name": "20200125110231_Priroda_10-344.jpg"}	2024-05-01 20:13:08.868946
351	OKRE9VM4IDXGLRMIJ69E_20200125110231_Priroda_10-344.jpg	1	{"old_name": "20200125110231_Priroda_10-344.jpg", "blur_image": {"id": 350, "name": "blur_OKRE9VM4IDXGLRMIJ69E_20200125110231_Priroda_10-344.jpg", "owner_id": 1, "details": {"old_name": "20200125110231_Priroda_10-344.jpg"}}}	2024-05-01 20:13:08.881331
352	blur_J5GOKCU7MI4ZA3C4BK82_1659982416_2-priroda-club-p-krasivaya-priroda-rossii-krasivo-foto-2.jpg	1	{"old_name": "1659982416_2-priroda-club-p-krasivaya-priroda-rossii-krasivo-foto-2.jpg"}	2024-05-01 20:15:12.127172
353	J5GOKCU7MI4ZA3C4BK82_1659982416_2-priroda-club-p-krasivaya-priroda-rossii-krasivo-foto-2.jpg	1	{"old_name": "1659982416_2-priroda-club-p-krasivaya-priroda-rossii-krasivo-foto-2.jpg", "blur_image": {"id": 352, "name": "blur_J5GOKCU7MI4ZA3C4BK82_1659982416_2-priroda-club-p-krasivaya-priroda-rossii-krasivo-foto-2.jpg", "owner_id": 1, "details": {"old_name": "1659982416_2-priroda-club-p-krasivaya-priroda-rossii-krasivo-foto-2.jpg"}}}	2024-05-01 20:15:12.130147
354	ZRDRNFY5DQD24BRDX759_1714595958895.jpeg	25	{"old_name": "1714595958895.jpeg"}	2024-05-01 20:39:21.427669
355	WGWMZDH999X8OWAY5DU8_1714596133927.jpeg	25	{"old_name": "1714596133927.jpeg"}	2024-05-01 20:42:16.047476
356	V8O2ECP33HMFQIN1AMP1_world-smile-day-emojis-arrangement_23-2149024492.jpg	25	{"old_name": "world-smile-day-emojis-arrangement_23-2149024492.jpg"}	2024-05-01 20:42:21.270663
357	blur_6HLX9HZBP25OI2G1HKWX_hand-drawn-finance-leaders-illustrated_23-2149163551.jpg	25	{"old_name": "hand-drawn-finance-leaders-illustrated_23-2149163551.jpg"}	2024-05-01 21:57:47.166435
358	6HLX9HZBP25OI2G1HKWX_hand-drawn-finance-leaders-illustrated_23-2149163551.jpg	25	{"old_name": "hand-drawn-finance-leaders-illustrated_23-2149163551.jpg", "blur_image": {"id": 357, "name": "blur_6HLX9HZBP25OI2G1HKWX_hand-drawn-finance-leaders-illustrated_23-2149163551.jpg", "owner_id": 25, "details": {"old_name": "hand-drawn-finance-leaders-illustrated_23-2149163551.jpg"}}}	2024-05-01 21:57:47.190295
359	blur_ERC2CEIOMLU7K4CDMRCO_illustration-startup-business_53876-37657.jpg	25	{"old_name": "illustration-startup-business_53876-37657.jpg"}	2024-05-01 21:57:50.290794
360	ERC2CEIOMLU7K4CDMRCO_illustration-startup-business_53876-37657.jpg	25	{"old_name": "illustration-startup-business_53876-37657.jpg", "blur_image": {"id": 359, "name": "blur_ERC2CEIOMLU7K4CDMRCO_illustration-startup-business_53876-37657.jpg", "owner_id": 25, "details": {"old_name": "illustration-startup-business_53876-37657.jpg"}}}	2024-05-01 21:57:50.294718
365	VOAKZ6PXBIJ00AWQUT5G_00_ryazan.jpg	3	{"old_name": "00_ryazan.jpg", "blur_image": {"id": 364, "name": "blur_VOAKZ6PXBIJ00AWQUT5G_00_ryazan.jpg", "owner_id": 3, "details": {"old_name": "00_ryazan.jpg"}}}	2024-05-29 12:35:46.880126
366	blur_W84KD5JY4MN6F03NL1GG_wr-960.webp	3	{"old_name": "wr-960.webp"}	2024-05-29 12:36:58.688194
367	W84KD5JY4MN6F03NL1GG_wr-960.webp	3	{"old_name": "wr-960.webp", "blur_image": {"id": 366, "name": "blur_W84KD5JY4MN6F03NL1GG_wr-960.webp", "owner_id": 3, "details": {"old_name": "wr-960.webp"}}}	2024-05-29 12:36:58.692196
368	blur_B8NGJLQ145N0Y3ZI6LBZ_istockphoto-647337554-1024x1024.jpg	3	{"old_name": "istockphoto-647337554-1024x1024.jpg"}	2024-05-29 12:37:47.305377
369	B8NGJLQ145N0Y3ZI6LBZ_istockphoto-647337554-1024x1024.jpg	3	{"old_name": "istockphoto-647337554-1024x1024.jpg", "blur_image": {"id": 368, "name": "blur_B8NGJLQ145N0Y3ZI6LBZ_istockphoto-647337554-1024x1024.jpg", "owner_id": 3, "details": {"old_name": "istockphoto-647337554-1024x1024.jpg"}}}	2024-05-29 12:37:47.308498
370	blur_AMNMUL1EU4X2Q5G0DKYS_ss_9a3f16b256935e5bb965a9b5a5c9de6a1a36b0c5.1920x1080.jpg	8	{"old_name": "ss_9a3f16b256935e5bb965a9b5a5c9de6a1a36b0c5.1920x1080.jpg"}	2024-05-29 18:28:46.594334
244	blur_QGBSL3WDHBZO53GNOWM3_be397c91b8026b17f5f8a6ed98e23e9e.jpg	1	{"old_name": "be397c91b8026b17f5f8a6ed98e23e9e.jpg"}	2024-04-20 09:23:40.769496
245	QGBSL3WDHBZO53GNOWM3_be397c91b8026b17f5f8a6ed98e23e9e.jpg	1	{"old_name": "be397c91b8026b17f5f8a6ed98e23e9e.jpg", "blur_image": {"id": 244, "name": "blur_QGBSL3WDHBZO53GNOWM3_be397c91b8026b17f5f8a6ed98e23e9e.jpg", "owner_id": 1, "details": {"old_name": "be397c91b8026b17f5f8a6ed98e23e9e.jpg"}}}	2024-04-20 09:23:40.792571
371	AMNMUL1EU4X2Q5G0DKYS_ss_9a3f16b256935e5bb965a9b5a5c9de6a1a36b0c5.1920x1080.jpg	8	{"old_name": "ss_9a3f16b256935e5bb965a9b5a5c9de6a1a36b0c5.1920x1080.jpg", "blur_image": {"id": 370, "name": "blur_AMNMUL1EU4X2Q5G0DKYS_ss_9a3f16b256935e5bb965a9b5a5c9de6a1a36b0c5.1920x1080.jpg", "owner_id": 8, "details": {"old_name": "ss_9a3f16b256935e5bb965a9b5a5c9de6a1a36b0c5.1920x1080.jpg"}}}	2024-05-29 18:28:46.603899
257	DDEXZ5679A6Y9EPR0SGL_Липужин_И.А..pdf	1	{"old_name": "\\u041b\\u0438\\u043f\\u0443\\u0436\\u0438\\u043d \\u0418.\\u0410..pdf"}	2024-04-24 15:36:32.084549
259	RPQWXIL4NIU83SRH90TE_Certificate_2023-09-27_17_19_31.783Z.pdf	1	{"old_name": "Certificate_2023-09-27_17_19_31.783Z.pdf"}	2024-04-24 16:00:07.931994
260	UL0U33KXDNI4C3IB4WAP_Certificate_2023-09-27_17_19_31.783Z.pdf	1	{"old_name": "Certificate_2023-09-27_17_19_31.783Z.pdf"}	2024-04-24 16:00:15.91512
261	FV27S3IPIS7UOZ0J2MTJ_Certificate_2023-09-27_17_19_31.783Z.pdf	1	{"old_name": "Certificate_2023-09-27_17_19_31.783Z.pdf"}	2024-04-24 16:53:56.659801
262	95OKNEUUTKN11HALFOXV_2022684619_page-0001.jpg	1	{"old_name": "2022684619_page-0001.jpg"}	2024-04-24 19:21:14.474578
263	OK1OX6CGL92GUA14HAB5_2022684619_page-0001.jpg	1	{"old_name": "2022684619_page-0001.jpg"}	2024-04-24 19:23:54.149946
268	HW3DL8CVZJ1JXSLXWU53_2022684619_page-0001.jpg	1	{"old_name": "2022684619_page-0001.jpg"}	2024-04-24 20:01:28.708039
274	0S8B5MFN68BPDHQAQ3UP_Certificate_finals_page-0001.jpg	1	{"old_name": "Certificate_finals_page-0001.jpg"}	2024-04-24 20:34:23.181656
277	7UGJU7LT9P2683TYCGD4_Certificate-_1_.png	1	{"old_name": "Certificate-_1_.png"}	2024-04-24 20:40:17.502726
281	TEVY48RM7T8J4A5OU06Z_img-230202210215-001_rotated_page-0001.jpg	1	{"old_name": "img-230202210215-001_rotated_page-0001.jpg"}	2024-04-24 20:49:23.761423
375	A029ALCJPJMC5OP1SWPS_1717143174718.jpeg	1	{"old_name": "1717143174718.jpeg"}	2024-05-31 08:12:54.04063
388	blur_WI0M5XSW07A2T33O8TQ6_cb9be1bf9cc26d0c8b1f9e3b64acd847.jpg	2	{"old_name": "cb9be1bf9cc26d0c8b1f9e3b64acd847.jpg"}	2024-05-31 17:41:30.145806
389	WI0M5XSW07A2T33O8TQ6_cb9be1bf9cc26d0c8b1f9e3b64acd847.jpg	2	{"old_name": "cb9be1bf9cc26d0c8b1f9e3b64acd847.jpg", "blur_image": {"id": 388, "name": "blur_WI0M5XSW07A2T33O8TQ6_cb9be1bf9cc26d0c8b1f9e3b64acd847.jpg", "owner_id": 2, "details": {"old_name": "cb9be1bf9cc26d0c8b1f9e3b64acd847.jpg"}}}	2024-05-31 17:41:30.148138
395	blur_LHOVW4P9KARXERMVVB4O_an7w4usRhL0.jpg	1	{"old_name": "an7w4usRhL0.jpg"}	2024-05-31 17:58:36.189735
396	LHOVW4P9KARXERMVVB4O_an7w4usRhL0.jpg	1	{"old_name": "an7w4usRhL0.jpg", "blur_image": {"id": 395, "name": "blur_LHOVW4P9KARXERMVVB4O_an7w4usRhL0.jpg", "owner_id": 1, "details": {"old_name": "an7w4usRhL0.jpg"}}}	2024-05-31 17:58:36.191811
402	0PRL1RG8BCT2859UPYBV_note.mp3	1	{"old_name": "note.mp3"}	2024-05-31 18:12:32.610801
404	0SQF3NCT61M8Q46VGTBK_1717188805659.png	1	{"old_name": "1717188805659.png"}	2024-05-31 20:53:24.316325
405	0Z2X8AJZWVYU1DR3ZS70_1717189403740.png	5	{"old_name": "1717189403740.png"}	2024-05-31 21:03:22.389902
406	4YC1TFMQT0YSKUM00CP3_1717189509945.png	5	{"old_name": "1717189509945.png"}	2024-05-31 21:05:08.560018
407	NXOFIY84IH8JAYOOMCJG_1717189611076.png	5	{"old_name": "1717189611076.png"}	2024-05-31 21:06:49.694986
408	MAQUQNNY7XFQCJ6LT3GK_1717189718774.png	5	{"old_name": "1717189718774.png"}	2024-05-31 21:08:37.42578
409	DPCW5JGX41XWNI2E0U0O_1717189798841.png	5	{"old_name": "1717189798841.png"}	2024-05-31 21:09:57.503141
410	Q3IKRO0ZBRWQH1BWDXN9_1717189871933.png	5	{"old_name": "1717189871933.png"}	2024-05-31 21:11:10.554903
411	ZN9TD6OHG6JRSMSZJXLS_1717189942383.png	8	{"old_name": "1717189942383.png"}	2024-05-31 21:12:20.972055
412	J2ACAJD6FJJFH5TR2F4O_1717189973347.png	8	{"old_name": "1717189973347.png"}	2024-05-31 21:12:51.957599
413	V0XQ9DD78XHCF5DZ1N9A_1717190067447.png	8	{"old_name": "1717190067447.png"}	2024-05-31 21:14:26.062219
414	7HMP6W964QQ39YK1JCLC_1717190154642.png	8	{"old_name": "1717190154642.png"}	2024-05-31 21:15:53.235822
415	C2A1OT9RXKJRSAT1YTV5_1717190243462.png	26	{"old_name": "1717190243462.png"}	2024-05-31 21:17:22.070998
416	Y9W405JQXUYAH9N4NV44_1717190424543.png	25	{"old_name": "1717190424543.png"}	2024-05-31 21:20:23.159157
417	VTAQJ1LSIUXN2LIQ7LMH_1717190575367.png	1	{"old_name": "1717190575367.png"}	2024-05-31 21:22:54.934873
418	CXYB66JS8I47P7KNT5EX_1717311127575.png	1	{"old_name": "1717311127575.png"}	2024-06-02 06:52:07.839389
419	QYLTBNV2R4TSYDPBIKYG_1717311217127.png	1	{"old_name": "1717311217127.png"}	2024-06-02 06:53:37.242448
420	QLZFACMVC3UY4AGMWA4V_1717311320506.png	1	{"old_name": "1717311320506.png"}	2024-06-02 06:55:20.573103
422	XD2MPKHOFVFL0KNDF8M5_1717313432494.jpeg	2	{"old_name": "1717313432494.jpeg"}	2024-06-02 07:30:32.495365
423	VY43RSQ7T6CH919LNKAI_1717313844184.png	2	{"old_name": "1717313844184.png"}	2024-06-02 07:37:24.437669
424	RYCYP7LFB8BOMECYDIKJ_1717313960284.png	2	{"old_name": "1717313960284.png"}	2024-06-02 07:39:20.315343
425	P0QIXKBK58XP7Y6J00TI_1717314013645.png	2	{"old_name": "1717314013645.png"}	2024-06-02 07:40:13.679718
427	TOOVQNJLWI1UR77NZLYK_1717314149400.png	3	{"old_name": "1717314149400.png"}	2024-06-02 07:42:29.41657
428	IK7Q5WV1EKJCRIBLOEEL_1717314387839.png	3	{"old_name": "1717314387839.png"}	2024-06-02 07:46:28.221437
430	GK81EPKFTZXA14JVZ5OQ_1717314504119.png	3	{"old_name": "1717314504119.png"}	2024-06-02 07:48:24.223792
431	26UKASGI869VKQN6OFBM_1717314619537.png	3	{"old_name": "1717314619537.png"}	2024-06-02 07:50:19.615317
432	GLQWC1BMH2RYE56VJATR_1717314657289.png	4	{"old_name": "1717314657289.png"}	2024-06-02 07:50:57.329313
433	ULEW6ASIBGOOI03L18KF_1717314765800.png	4	{"old_name": "1717314765800.png"}	2024-06-02 07:52:45.841552
434	3GCIF8N1ORA55BBRE1M2_1717314830534.png	4	{"old_name": "1717314830534.png"}	2024-06-02 07:53:50.558374
435	6RVF7IEO8WR42HTPX30J_1717314901596.png	4	{"old_name": "1717314901596.png"}	2024-06-02 07:55:01.651605
436	KFNERK9Z1AOLEK8R78TC_1717314982703.png	4	{"old_name": "1717314982703.png"}	2024-06-02 07:56:22.720376
437	6TSL2X9Z1A74ZLUI52NM_1717315057132.png	4	{"old_name": "1717315057132.png"}	2024-06-02 07:57:37.188321
438	blur_TSZCQKT0SKDO25NHY53Q_1.jpg	2	{"old_name": "1.jpg"}	2024-06-02 09:08:54.660069
439	TSZCQKT0SKDO25NHY53Q_1.jpg	2	{"old_name": "1.jpg", "blur_image": {"id": 438, "name": "blur_TSZCQKT0SKDO25NHY53Q_1.jpg", "owner_id": 2, "details": {"old_name": "1.jpg"}}}	2024-06-02 09:08:54.667043
440	L2UK2ZBYO0AKSFHYYE2L_shablon-klev-club-p-shabloni-gramota-russkii-medvezhonok-2.jpg	27	{"old_name": "shablon-klev-club-p-shabloni-gramota-russkii-medvezhonok-2.jpg"}	2024-06-03 09:55:29.119561
441	OC9B5CUEFEL70LKCZHPF_shablon-klev-club.jpg	27	{"old_name": "shablon-klev-club.jpg"}	2024-06-03 09:57:15.756801
444	0BT83VQ0LMJB0K1DFCE0_файл.txt	27	{"old_name": "\\u0444\\u0430\\u0439\\u043b.txt"}	2024-06-03 10:22:48.61054
445	07QQU9Y95LK3S19JN2TD_файл.txt	9	{"old_name": "\\u0444\\u0430\\u0439\\u043b.txt"}	2024-06-04 06:42:05.411179
446	HRK1NH4Q7AXFXFITH5WK_файл.txt	9	{"old_name": "\\u0444\\u0430\\u0439\\u043b.txt"}	2024-06-04 06:43:34.861509
\.


--
-- TOC entry 3411 (class 0 OID 19922)
-- Dependencies: 227
-- Data for Name: group_invites; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.group_invites (group_id, user_id, created_at, is_approved) FROM stdin;
1	2	2024-05-01 14:45:14.840098	\N
1	8	2024-05-01 14:45:15.857715	\N
1	13	2024-05-01 14:45:16.1965	\N
1	3	2024-05-01 14:45:17.503957	\N
1	19	2024-05-01 15:04:39.957119	t
21	2	2024-05-02 02:43:40.631077	\N
21	9	2024-05-02 02:43:41.353885	\N
21	8	2024-05-02 02:43:42.789619	\N
21	19	2024-05-02 02:43:43.250491	\N
21	5	2024-05-02 02:43:40.273605	t
1	26	2024-05-31 18:05:50.388279	\N
1	9	2024-05-01 14:45:15.531697	t
5	1	2024-06-04 10:58:29.325898	t
\.


--
-- TOC entry 3412 (class 0 OID 19925)
-- Dependencies: 228
-- Data for Name: group_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.group_roles (id, name, is_common, group_id) FROM stdin;
1	Создатель👨‍💼	t	\N
2	Администратор🪪	t	\N
3	Наблюдатель🔭	t	\N
4	Эксперт🎓	t	\N
5	Инвестор🪙	t	\N
6	Backender🔧	f	1
11	Frontender💻	f	1
15	Fullstack🗿	f	1
22	DevOps💽	f	1
7	Часть команды⛵	t	\N
24	Fullstack🗿	f	5
25	Frontend 🏞️	f	2
26	Backender 🏗️	f	2
\.


--
-- TOC entry 3414 (class 0 OID 19930)
-- Dependencies: 230
-- Data for Name: group_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.group_types (id, name) FROM stdin;
1	команда
2	организация
3	объединение
\.


--
-- TOC entry 3416 (class 0 OID 19935)
-- Dependencies: 232
-- Data for Name: group_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.group_users (group_id, user_id, created_at, role_id) FROM stdin;
1	1	2024-03-07 13:10:26.368881	1
5	9	2024-03-13 17:15:02.735496	1
2	5	2024-03-08 18:15:40.074387	1
6	10	2024-03-13 18:09:55.768496	1
1	5	2024-03-07 13:52:25.678744	11
1	8	2024-03-14 08:56:13.156703	15
6	9	2024-03-24 13:43:36.690568	3
3	9	2024-03-24 13:43:37.52103	3
2	9	2024-03-24 13:43:37.859121	3
3	8	2024-03-13 16:19:53.007888	1
3	1	2024-03-31 10:29:26.120284	3
21	1	2024-04-10 21:05:59.446486	1
2	8	2024-04-10 21:54:09.334822	26
1	4	2024-03-23 07:04:09.768811	3
1	3	2024-03-22 08:25:14.288109	3
27	19	2024-04-28 01:52:30.516827	1
28	21	2024-05-01 17:55:07.628246	1
1	21	2024-05-02 02:44:12.697931	7
1	2	2024-03-23 07:15:59.274206	22
1	25	2024-05-02 01:09:43.640165	7
21	5	2024-05-02 02:58:39.787437	7
1	26	2024-05-31 18:06:51.409629	7
2	1	2024-06-02 15:56:00.764225	3
1	9	2024-06-03 20:32:20.30502	7
5	1	2024-06-04 07:58:59.582767	24
\.


--
-- TOC entry 3417 (class 0 OID 19938)
-- Dependencies: 233
-- Data for Name: groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.groups (id, name, note, avatar, created_at, decoration, creater_id, type_id, username) FROM stdin;
2	MistyBit	мурлык	{"id": 36, "url": "1710350757056_0E6EK72ZIOXFY5JL7OB6.png"}	2024-03-08 18:15:40.046219	{}	5	1	\N
3	IMA	Их боялись даже чеченцы	{"id": 37, "url": "1710351255115_B6DIWY7J5CL1VZ79M4S8.jpeg"}	2024-03-13 16:19:52.978541	{}	8	1	\N
27	Вдохновение	Группа людей, совместно занимающихся искусством и культурой. Участники объединения проводят мастер-классы, выставки и концерты, обмениваются опытом и поддерживают друг друга в творчестве	{"id": 310, "url": "HRNAB7Q08OYW5G47JGB5_1714258427007.jpeg"}	2024-04-28 01:52:30.462573	{"id": 311, "coverImage": "23WNT5J3BZPVIP3NXC2P_125000.jpg"}	19	3	\N
5	Erbium	Молодая IT-команда	{"id": 34, "url": "1710350424598_RZ04DRLYQRM9ES6553QC.png"}	2024-03-13 17:15:02.729774	{}	9	1	erbium
1	DeV	Молодая IT-команда	{"id": 25, "url": "1710018465138_L0RA9K9F2RANSI0CVDH4.png"}	2024-03-07 13:10:26.118639	{"id": 27, "coverImage": "kub-temnyy-tekstura-formy-kartinki-325-2279_KH2SR0VWPSI5K1DFBNDR_C77YDQUJ4W1RFECN7L55.jpg"}	1	1	dev
28	Титановый сплав	\N	{"id": 342, "url": "2W8F4Q1N8KBBMSVNJKQ9_1714575454806.png"}	2024-05-01 17:55:07.614782	{"id": 343, "coverImage": "LTHGFXHVY4OM0RXFFP3P_2148846103.jpg"}	21	1	\N
6	IT-Инновации	Учись у лучших, получи самые актуальные навыки в IT, собери команду мечты, выигрывай российские и международные соревнования, создавай вместе с нами Всероссийское ИТ-сообщество, получай интересные задачи в разработку или реализуй свой проект	{"id": 305, "url": "WAW934ZW9DC90RQRUGQ8_1714257224083.png"}	2024-03-13 18:09:55.763344	{"id": 304, "coverImage": "GTYUYXNG1FFTU7BGU2X2_122988.jpg"}	10	2	it_innovations
21	DreamTeam	\N	{"id": 306, "url": "TGIHHW6BMX08RN6MI20C_1714257348790.png"}	2024-04-10 21:05:59.435611	{"id": 307, "coverImage": "P9ZXBZTRZT045WZOEX3U_Whhhite_\\u2014_segmented.jpg"}	1	1	\N
\.


--
-- TOC entry 3419 (class 0 OID 19946)
-- Dependencies: 235
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (id, materials, text, created_at, activity_id, sender_id) FROM stdin;
6	{}	где Роман?\n	2024-04-18 23:42:35.004715	3	1
7	{}	не видел(\n	2024-04-18 23:42:43.367067	3	8
8	{}	это очень плохо\n	2024-04-18 23:42:50.995363	3	1
9	{}	да(\n	2024-04-18 23:44:08.045348	3	8
10	{}	я тут\n	2024-04-18 23:44:36.822353	3	5
11	{}	ура\n	2024-04-18 23:44:43.647571	3	1
12	{}	ну раз все вместе\n	2024-04-18 23:44:50.084767	3	1
13	{}	нужно решить как будет заканчивать проект\n	2024-04-18 23:45:02.389676	3	1
14	{}	нам нужен devops-инженер\n	2024-04-18 23:46:05.290191	3	1
15	{}	можем позвать Сергея Рындова\n	2024-04-18 23:46:20.847631	3	5
16	{}	давайте кого-нибудь другого)\n	2024-04-18 23:47:17.025974	3	1
17	{}	итак был исправлен баг\n	2024-04-18 23:51:19.162022	3	1
18	{}	продолжим\n	2024-04-18 23:51:22.367284	3	1
19	{}	нам нужен devops-инженер\n	2024-04-18 23:51:42.619505	3	1
20	{}	я могу https сделать\n	2024-04-18 23:52:00.829906	3	5
21	{}	там нужен ssl сертификат\n	2024-04-18 23:52:07.192686	3	5
22	{}	добро\n	2024-04-18 23:52:12.299356	3	1
4	{}	добрый день, коллеги!	2024-04-17 23:42:35.004715	3	1
5	{}	добрый день, товарищ Вайнбаум	2024-04-17 23:47:35.004715	3	8
23	{}	нам также необходим сервак\n	2024-04-18 23:54:06.455299	3	1
25	{}	добрый день коллеги!\n	2024-04-22 13:12:50.501959	3	1
26	{}	добрый день\n	2024-04-22 22:22:32.503763	3	8
27	{}	ало\n	2024-04-22 22:24:08.390678	3	8
29	{}	меня слышно?\n	2024-04-22 22:25:39.023388	3	8
36	{}	да, слышно\n	2024-04-22 22:32:11.936711	3	1
37	{}	привет\n	2024-04-28 00:34:09.233726	3	8
38	{}	привет	2024-04-28 00:35:18.529467	3	1
42	{}	добрый день, коллеги!\n	2024-05-02 02:45:48.420165	3	1
43	{}	привет!\n	2024-05-02 02:46:03.742236	3	25
49	{}	добрый день, коллеги!\n	2024-05-31 08:07:10.988362	3	1
50	{}	Привет) 	2024-05-31 16:21:13.735301	3	25
51	{}	привет\n	2024-05-31 16:21:23.134919	3	1
52	{}	Миша, привет!\n	2024-05-31 18:07:53.660825	3	1
58	{}	Ох\n	2024-05-31 18:10:49.297481	3	26
59	{}	Добрый день коллега\n	2024-05-31 18:11:01.350798	3	26
60	{}	Укладываетесь в срок?\n	2024-05-31 18:11:05.611331	3	26
61	{}	да\n	2024-05-31 18:11:10.75613	3	1
62	{}	идем по графику\n	2024-05-31 18:11:15.700315	3	1
93	{}	Проверка	2024-06-01 21:35:09.456951	3	1
94	{}	Всем привет!!!\n	2024-06-03 20:53:37.491869	11	1
95	{}	привет\n	2024-06-04 06:09:55.769525	11	9
\.


--
-- TOC entry 3421 (class 0 OID 19954)
-- Dependencies: 237
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, text, user_abstract_id, created_at, is_readed) FROM stdin;
5	На вас подписался Вельветровый Транскрибитор	1	2024-04-21 21:48:27.041834	t
3	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-04-21 19:19:47.273248	t
4	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	13	2024-04-21 21:48:12.161591	t
17	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-04-22 17:43:47.390831	t
18	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	13	2024-04-22 17:43:51.575313	t
22	Ваш отклик на вакансию frontend-разработчик отклонен	13	2024-04-22 17:45:52.283808	t
35	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-04-24 00:46:47.074687	t
24	Ваш отклик на вакансию DevOps отклонен	13	2024-04-22 17:46:16.042705	t
57	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	18	2024-04-28 00:49:42.722254	t
39	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	9	2024-04-25 14:00:34.213396	t
13	На вас подписался Плюшкин Евгений	1	2024-04-22 13:58:42.349383	t
12	Был оставлен новый отклик на вакансию frontend-разработчик	1	2024-04-22 13:15:36.388116	t
9	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-04-21 21:57:13.057018	t
8	Был оставлен новый отклик на вакансию Fullstack разработчик	1	2024-04-21 21:54:23.681886	t
7	Был оставлен новый отклик на вакансию DevOps	1	2024-04-21 21:54:21.579612	t
6	Был оставлен новый отклик на вакансию frontend-разработчик	1	2024-04-21 21:54:04.366504	t
58	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	13	2024-04-28 01:13:20.588543	t
50	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-04-25 18:17:59.938031	t
41	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	9	2024-04-25 14:03:29.431406	t
40	Вам назначили роль Fullstack🗿 в группе Erbium	1	2024-04-25 14:01:21.796847	t
38	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-04-25 14:00:27.178157	t
42	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-04-25 14:24:13.209886	t
54	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-04-28 00:26:38.672129	t
55	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-04-28 00:32:17.710195	t
56	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	8	2024-04-28 00:33:59.837914	t
53	Вам назначили задачу Сделать основу системы в проекте ProConnect	8	2024-04-27 11:51:03.40731	t
37	Вам назначили задачу Сделать основу системы в проекте ProConnect	8	2024-04-25 00:35:51.029317	t
59	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	10	2024-04-28 01:23:26.031662	t
61	На вас подписался Вайнбаум Денис	18	2024-04-28 01:37:00.42525	f
60	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-04-28 01:35:54.613513	t
62	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	19	2024-04-28 01:42:37.4212	t
64	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	19	2024-04-28 01:48:47.225968	t
66	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	19	2024-04-28 01:51:29.917725	t
68	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-04-28 01:58:25.736343	t
65	На вас подписался Салагин Константин	1	2024-04-28 01:49:10.095753	t
63	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-04-28 01:48:35.072837	t
70	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	6	2024-04-28 14:09:24.893318	t
69	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-04-28 14:09:15.869167	t
74	Группа DreamTeam отправила заявку в проект Helper Teacher	1	2024-04-30 10:56:29.432079	t
44	Вам назначили роль Наблюдатель🔭 в группе DeV	3	2024-04-25 15:27:28.638144	t
67	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	5	2024-04-28 01:58:15.207526	t
36	Вам назначили задачу Сделать основу системы в проекте ProConnect	5	2024-04-25 00:35:46.379066	t
43	Вам назначили роль Наблюдатель🔭 в группе DeV	4	2024-04-25 15:27:19.126913	t
73	Группа DreamTeam отправила заявку в проект Sign Sense	1	2024-04-30 10:56:27.361607	t
72	Группа DeV отправила заявку в проект Sign Sense	1	2024-04-30 10:56:25.284424	t
71	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-04-30 10:56:23.187547	t
75	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	6	2024-04-30 12:52:59.619162	t
77	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	6	2024-04-30 14:38:34.80209	t
78	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-04-30 18:51:33.221463	t
76	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-04-30 14:28:27.074492	t
82	Группа DreamTeam отправила заявку в проект Энергодом	1	2024-04-30 18:54:02.516809	t
84	Вашей группе IT-Инновации отправлено приглашение в проект Helper Teacher	10	2024-04-30 18:54:23.427183	f
85	Вашей группе DreamTeam отправлено приглашение в проект ГидКарта	1	2024-04-30 18:54:38.820881	t
83	Группа DeV отправила заявку в проект ГидКарта	1	2024-04-30 18:54:08.884642	t
81	Группа DeV отправила заявку в проект Энергодом	1	2024-04-30 18:53:59.337838	t
80	Группа DreamTeam отправила заявку в проект Space Tour	1	2024-04-30 18:53:50.785344	t
79	Группа DeV отправила заявку в проект Space Tour	1	2024-04-30 18:53:44.076999	t
86	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-05-01 10:17:04.845011	t
88	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-05-01 10:39:50.461034	t
90	Салагин Константин приглашает вас в группу DeV	1	2024-05-01 10:41:30.685609	t
91	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-05-01 10:46:46.948523	t
92	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-05-01 11:03:11.880774	t
94	Рындов Сергей приглашает вас в группу DeV	1	2024-05-01 11:05:18.573068	t
95	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	3	2024-05-01 12:13:35.140154	t
97	Ваш отклик на вакансию frontend-разработчик отклонен	13	2024-05-01 12:20:59.978235	f
99	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-05-01 13:41:45.371992	t
96	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-05-01 12:15:54.651141	t
100	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	19	2024-05-01 13:53:55.15171	t
89	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	19	2024-05-01 10:40:22.86727	t
87	Вайнбаум Денис приглашает вас в группу DeV	19	2024-05-01 10:19:12.155032	t
107	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-05-01 14:15:40.273672	t
106	Был оставлен новый отклик на вакансию frontend-разработчик	1	2024-05-01 14:05:12.705371	t
105	Был оставлен новый отклик на вакансию DevOps	1	2024-05-01 14:05:10.622319	t
104	Был оставлен новый отклик на вакансию Fullstack разработчик	1	2024-05-01 14:05:08.537046	t
103	Был оставлен новый отклик на вакансию Fullstack разработчик	1	2024-05-01 13:55:40.999497	t
102	Был оставлен новый отклик на вакансию DevOps	1	2024-05-01 13:55:38.925991	t
101	Был оставлен новый отклик на вакансию frontend-разработчик	1	2024-05-01 13:55:36.823369	t
112	Вайнбаум Денис приглашает вас в группу DeV	13	2024-05-01 14:45:24.457467	f
115	Салагин Константин теперь в группе DeV по приглашению	1	2024-05-01 14:45:39.148749	t
118	Ваше приглашение в проект Энергодом одобрено	1	2024-05-01 14:49:30.178933	t
117	Салагин Константин теперь в группе DeV по приглашению	1	2024-05-01 14:46:29.583825	t
116	Салагин Константин теперь в группе DeV по приглашению	1	2024-05-01 14:46:27.476339	t
122	Вайнбаум Денис приглашает вас в группу DeV	19	2024-05-01 15:03:02.343325	t
120	Вайнбаум Денис приглашает вас в группу DeV	19	2024-05-01 15:01:36.498722	t
119	Вайнбаум Денис приглашает вас в группу DeV	19	2024-05-01 14:59:43.237839	t
113	Вайнбаум Денис приглашает вас в группу DeV	19	2024-05-01 14:45:26.517721	t
108	Вайнбаум Денис приглашает вас в группу DeV	5	2024-05-01 14:45:16.071686	t
109	Вайнбаум Денис приглашает вас в группу DeV	2	2024-05-01 14:45:18.134339	t
93	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	2	2024-05-01 11:04:09.118752	t
114	Вайнбаум Денис приглашает вас в группу DeV	3	2024-05-01 14:45:28.589881	t
98	Ваш отклик на вакансию DevOps отклонен	3	2024-05-01 12:21:16.213469	t
111	Вайнбаум Денис приглашает вас в группу DeV	8	2024-05-01 14:45:22.340951	t
127	Салагин Константин теперь в группе DeV по приглашению	1	2024-05-01 15:04:47.568112	t
125	Салагин Константин отклонил приглашение вступить в группу DeV	1	2024-05-01 15:03:51.170779	t
123	Приглашение отклонено	1	2024-05-01 15:03:10.778145	t
121	Салагин Константин теперь в группе DeV по приглашению	1	2024-05-01 15:01:43.583263	t
126	Вайнбаум Денис приглашает вас в группу DeV	19	2024-05-01 15:04:42.178441	t
124	Вайнбаум Денис приглашает вас в группу DeV	19	2024-05-01 15:03:45.88985	t
129	Ваше приглашение в проект Одевайка одобрено	19	2024-05-01 15:09:55.506253	t
128	Группа Вдохновение отправила заявку в проект Одевайка	19	2024-05-01 15:09:40.808049	t
110	Вайнбаум Денис приглашает вас в группу DeV	9	2024-05-01 14:45:20.258911	t
324	У вас новый подписчик Рындов Сергей	9	2024-06-04 11:37:33.394001	f
130	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	18	2024-05-01 15:16:58.604251	f
131	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-05-01 15:17:24.424773	t
132	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	20	2024-05-01 17:04:58.660552	t
133	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	21	2024-05-01 17:21:46.901445	t
138	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	6	2024-05-01 17:36:41.796349	t
140	Ваша заявка в проект Healthy Lifestyle Hub одобрена	21	2024-05-01 17:58:33.967768	t
139	Вашей группе Титановый сплав отправлено приглашение в проект Healthy Lifestyle Hub	21	2024-05-01 17:58:28.185015	t
141	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	22	2024-05-01 18:49:36.526486	t
143	Вашей группе IT-Инновации отправлено приглашение в проект Food Diary	10	2024-05-01 19:39:43.692864	f
144	Вашей группе IT-Инновации отправлено приглашение в проект Cognitive Gym	10	2024-05-01 19:39:46.17122	f
142	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	6	2024-05-01 19:31:33.434651	t
149	Вашей группе DeV отправлено приглашение в проект Food Diary	1	2024-05-01 19:41:07.929078	t
148	Вашей группе DeV отправлено приглашение в проект Cognitive Gym	1	2024-05-01 19:41:05.532921	t
147	На вас подписался Карчагина Лариса	1	2024-05-01 19:40:12.911009	t
137	На вас подписался Агафонов Тимофей	1	2024-05-01 17:28:26.085159	t
136	Был оставлен новый отклик на вакансию Fullstack разработчик	1	2024-05-01 17:28:20.156309	t
135	Был оставлен новый отклик на вакансию DevOps	1	2024-05-01 17:28:18.038895	t
134	Был оставлен новый отклик на вакансию frontend-разработчик	1	2024-05-01 17:28:15.948538	t
153	Ваше приглашение в проект Space Tour одобрено	1	2024-05-01 19:42:18.773771	t
152	Ваша заявка в проект Cognitive Gym одобрена	1	2024-05-01 19:41:52.146825	t
151	Ваша заявка в проект Food Diary одобрена	1	2024-05-01 19:41:48.962602	t
150	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-05-01 19:41:32.068845	t
155	Вашу группу DeV выгнали из проекта ГидКарта	1	2024-05-01 19:43:13.144299	t
154	Ваше приглашение в проект ГидКарта одобрено	1	2024-05-01 19:42:37.617254	t
158	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	25	2024-05-01 23:28:02.403244	t
165	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-05-02 02:25:49.571008	t
164	Вашей группе DeV отправлено приглашение в проект Волшебный день	1	2024-05-02 02:24:18.422967	t
162	Вашей группе DreamTeam отправлено приглашение в проект Волшебный день	1	2024-05-02 02:24:12.846095	t
161	На вас подписался Горбунова Кира	1	2024-05-02 01:10:38.2688	t
160	Был оставлен новый отклик на вакансию DevOps	1	2024-05-02 01:09:56.666808	t
159	Был оставлен новый отклик на вакансию frontend-разработчик	1	2024-05-02 01:09:54.612226	t
166	Ваша заявка в проект Волшебный день одобрена	1	2024-05-02 02:26:13.967467	t
169	Ваша заявка в проект Волшебный день одобрена	1	2024-05-02 02:27:11.15417	t
168	Вашей группе DreamTeam отправлено приглашение в проект Волшебный день	1	2024-05-02 02:26:59.470883	t
170	Группа DreamTeam вышла из проекта Волшебный день	25	2024-05-02 02:34:04.38713	t
172	Ваше приглашение в проект Волшебный день одобрено	25	2024-05-02 02:36:55.537155	t
167	Группа DreamTeam вышла из проекта Волшебный день	25	2024-05-02 02:26:49.635902	t
163	Вашей группе MistyBit отправлено приглашение в проект Волшебный день	5	2024-05-02 02:24:16.227201	t
146	Вашей группе MistyBit отправлено приглашение в проект Food Diary	5	2024-05-01 19:39:51.289266	t
145	Вашей группе MistyBit отправлено приглашение в проект Cognitive Gym	5	2024-05-01 19:39:48.889029	t
174	Вашей группе «DeV» отправлено приглашение в проект «Волшебный день»	1	2024-05-02 02:41:16.603416	t
173	Вашей группе «DreamTeam» отправлено приглашение в проект «Волшебный день»	1	2024-05-02 02:41:13.643158	t
171	Вашей группе DreamTeam отправлено приглашение в проект Волшебный день	1	2024-05-02 02:34:12.734158	t
179	Ваше приглашение в проект «Волшебный день» одобрено	25	2024-05-02 02:42:49.227333	t
188	Вам назначили роль «Часть команды⛵» в группе «DeV»	25	2024-05-02 02:45:27.237566	t
175	Вашей группе «MistyBit» отправлено приглашение в проект «Волшебный день»	5	2024-05-02 02:41:19.597782	t
187	Вам назначили роль «DevOps💽» в группе «DeV»	2	2024-05-02 02:45:03.208744	t
178	Вашей группе «DeV» отправлено приглашение в проект «Волшебный день»	1	2024-05-02 02:42:18.549569	t
177	Вашей группе «DreamTeam» отправлено приглашение в проект «Волшебный день»	1	2024-05-02 02:42:16.133139	t
176	Группа «DreamTeam» вышла из проекта «Волшебный день»	25	2024-05-02 02:42:08.364755	t
184	Вайнбаум Денис приглашает вас в группу «DreamTeam»	19	2024-05-02 02:43:50.717056	f
185	Ваш отклик на вакансию «frontend-разработчик» одобрен	21	2024-05-02 02:44:14.800441	f
186	Ваш отклик на вакансию «frontend-разработчик» отклонен	25	2024-05-02 02:44:16.888369	t
189	Вам назначили задачу «закончить проект» в проекте «Pro Connect»	25	2024-05-02 02:46:52.157079	t
191	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	6	2024-05-02 02:48:25.429499	t
192	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	5	2024-05-02 02:58:19.205869	t
180	Вайнбаум Денис приглашает вас в группу «DreamTeam»	5	2024-05-02 02:43:42.356758	t
195	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-05-26 09:07:47.679026	t
194	Рындов Сергей приглашает вас в группу DeV	1	2024-05-26 09:07:40.284944	t
193	Мельников Роман теперь в группе «DreamTeam» по приглашению	1	2024-05-02 02:58:41.863842	t
197	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-05-26 12:02:58.96276	t
198	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	6	2024-05-26 12:12:09.172464	t
199	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-05-26 18:35:42.820761	t
203	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-05-29 11:26:43.623226	t
202	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-05-29 11:26:27.814368	t
201	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-05-29 11:26:22.910676	t
204	Вам назначили задачу «развернуть решение» в проекте «Pro Connect»	1	2024-05-29 11:42:15.881186	t
206	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-05-29 15:11:51.612083	t
207	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	2	2024-05-29 15:25:43.697166	t
196	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	2	2024-05-26 12:02:47.870521	t
181	Вайнбаум Денис приглашает вас в группу «DreamTeam»	2	2024-05-02 02:43:44.414158	t
208	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	3	2024-05-29 15:33:03.678649	t
209	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	4	2024-05-29 15:44:30.088326	t
210	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	5	2024-05-29 21:10:35.616171	t
211	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	6	2024-05-29 21:20:04.793794	t
190	Вам назначили задачу «закончить проект» в проекте «Pro Connect»	8	2024-05-02 02:46:59.559344	t
183	Вайнбаум Денис приглашает вас в группу «DreamTeam»	8	2024-05-02 02:43:48.650815	t
212	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	8	2024-05-29 21:21:13.429039	t
217	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-05-31 06:42:03.394122	t
216	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-05-31 06:28:02.772613	t
215	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-05-30 19:01:25.40781	t
214	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-05-30 17:57:47.203164	t
213	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-05-30 17:15:25.847	t
221	У вас новый подписчик Вайнбаум Денис	21	2024-05-31 08:06:35.778427	f
219	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-05-31 08:03:40.402637	t
218	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-05-31 07:52:40.979203	t
220	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-05-31 08:04:16.512157	t
222	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-05-31 08:13:47.857987	t
223	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	5	2024-05-31 14:17:40.514051	f
224	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	5	2024-05-31 14:23:43.08147	f
226	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	16	2024-05-31 14:33:58.502803	t
205	У вас новый подписчик Вайнбаум Денис	16	2024-05-29 12:37:12.33218	t
52	На вас подписался Вайнбаум Денис	16	2024-04-27 10:17:48.559699	t
51	На вас подписался Вайнбаум Денис	16	2024-04-25 19:45:22.122884	t
227	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	6	2024-05-31 14:46:59.732145	t
229	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	6	2024-05-31 15:03:34.892152	t
225	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-05-31 14:24:42.847804	t
230	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-05-31 15:20:46.270725	t
231	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	25	2024-05-31 16:20:54.389505	t
233	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	2	2024-05-31 17:41:03.48375	t
236	У вас новый подписчик Багиров Миррабас	1	2024-05-31 17:53:45.116513	t
232	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-05-31 17:28:16.100713	t
237	Вайнбаум Денис приглашает вас в группу «DeV»	26	2024-05-31 18:05:50.418435	t
235	У вас новый подписчик Вайнбаум Денис	26	2024-05-31 17:51:55.40732	t
234	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	26	2024-05-31 17:47:53.723905	t
238	Вам назначили роль «Часть команды⛵» в группе «DeV»	26	2024-05-31 18:10:36.538487	t
239	Вам назначили задачу «еба боба» в проекте «Pro Connect»	26	2024-05-31 18:12:39.081905	t
240	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	26	2024-05-31 18:25:25.565133	t
241	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	6	2024-05-31 18:49:10.16081	t
228	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	6	2024-05-31 15:03:05.810364	t
242	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-05-31 19:00:30.766231	t
243	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	5	2024-05-31 21:03:14.956083	f
244	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	8	2024-05-31 21:12:10.563055	f
245	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	26	2024-05-31 21:17:00.813664	f
246	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	25	2024-05-31 21:18:03.607153	f
247	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-05-31 21:21:21.474954	t
248	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-06-01 04:31:02.563941	t
250	Вам назначили роль «Продажник» в группе «DeV»	9	2024-06-01 12:07:56.467015	t
249	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	9	2024-06-01 12:06:13.825922	t
182	Вайнбаум Денис приглашает вас в группу «DreamTeam»	9	2024-05-02 02:43:46.53213	t
251	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-06-02 06:51:48.229043	t
253	У вас новый подписчик Рындов Сергей	26	2024-06-02 07:32:23.595326	f
254	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	3	2024-06-02 07:40:51.118686	f
255	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	4	2024-06-02 07:50:50.373994	t
256	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	2	2024-06-02 09:08:40.036908	t
252	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	2	2024-06-02 07:25:22.551137	t
257	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-06-02 09:14:35.008491	t
259	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	27	2024-06-02 11:50:09.893443	t
260	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	27	2024-06-02 11:52:17.105091	t
261	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-06-02 13:08:32.776417	t
262	Был оставлен новый отклик на вакансию «Junior front-end (React)»	5	2024-06-02 15:56:03.287286	f
263	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	27	2024-06-02 15:56:43.511035	t
265	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-06-03 14:15:25.52041	t
264	У вас новый подписчик Иванов Иван	1	2024-06-03 13:51:15.373361	t
258	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-06-02 09:54:07.413203	t
268	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-06-03 20:33:39.881847	t
267	Вахутина Екатерина теперь в группе «DeV» по приглашению	1	2024-06-03 20:32:20.321427	t
269	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	9	2024-06-03 20:54:29.883837	t
266	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	9	2024-06-03 20:32:15.729348	t
272	Вашей группе «Erbium» отправлено приглашение в проект «Голос Города»	9	2024-06-04 05:41:37.529425	t
270	Группа «Erbium» отправила заявку в проект «Говори и переводи»	1	2024-06-04 05:41:05.351521	t
271	Вашу группу «Erbium» выгнали из проекта «Голос Города»	9	2024-06-04 05:41:31.516077	t
274	Вашу группу «Erbium» выгнали из проекта «Голос Города»	9	2024-06-04 06:01:33.781777	t
278	Вам назначили задачу «string» в проекте «Голос Города»	1	2024-06-04 06:15:13.124633	t
279	Вам назначили задачу «string» в проекте «Голос Города»	9	2024-06-04 06:45:56.45002	t
277	Ваше приглашение в проект «Голос Города» одобрено	9	2024-06-04 06:03:40.438855	t
276	Вашей группе «Erbium» отправлено приглашение в проект «Голос Города»	9	2024-06-04 06:02:13.556875	t
275	Группа «DeV» отправила заявку в проект «Голос Города»	9	2024-06-04 06:01:44.094377	t
273	Ваше приглашение в проект «Голос Города» одобрено	9	2024-06-04 05:56:32.838912	t
280	Вам назначили задачу «задача» в проекте «Голос Города»	1	2024-06-04 06:46:14.277035	t
282	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-06-04 10:40:50.140956	t
281	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	1	2024-06-04 10:33:41.075929	t
283	Был оставлен новый отклик на вакансию «Junior front-end (React)»	5	2024-06-04 10:41:43.170014	f
284	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	9	2024-06-04 10:50:21.592437	t
286	Вайнбаум Денис теперь в группе «Erbium» по приглашению	9	2024-06-04 10:51:37.991294	f
287	Был оставлен новый отклик на вакансию «Fullstack»	9	2024-06-04 10:57:28.63765	f
289	Вахутина Екатерина приглашает вас в группу «Erbium»	1	2024-06-04 10:58:04.151074	t
288	Ваш отклик на вакансию «Fullstack» отклонен	1	2024-06-04 10:57:43.099013	t
285	Вахутина Екатерина приглашает вас в группу «Erbium»	1	2024-06-04 10:50:57.063105	t
290	Вахутина Екатерина приглашает вас в группу «Erbium»	1	2024-06-04 10:58:29.344828	t
291	Вайнбаум Денис теперь в группе «Erbium» по приглашению	9	2024-06-04 10:58:59.602065	f
292	Вам назначили роль «Fullstack🗿» в группе «Erbium»	1	2024-06-04 10:59:18.54001	t
293	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	27	2024-06-04 11:07:15.223334	f
294	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	26	2024-06-04 11:08:00.463552	f
296	Был оставлен новый отклик на вакансию «Junior front-end (React)»	5	2024-06-04 11:09:21.850567	f
295	В ваш аккаунт кто-то вошел. Если это не вы, необходимо сменить пароль	2	2024-06-04 11:08:22.149017	t
297	Рындов Сергей приглашает вас в группу «в»	1	2024-06-04 11:19:17.894002	t
304	Рындов Сергей приглашает вас в группу «в»	1	2024-06-04 11:20:40.005689	t
307	Был оставлен новый отклик на вакансию «в»	2	2024-06-04 11:21:35.49585	t
303	Вайнбаум Денис отклонил(а) приглашение вступить в группу «в»	2	2024-06-04 11:20:21.163708	t
301	Вайнбаум Денис отклонил(а) приглашение вступить в группу «в»	2	2024-06-04 11:19:58.669139	t
298	Вайнбаум Денис теперь в группе «в» по приглашению	2	2024-06-04 11:19:30.389873	t
308	Ваш отклик на вакансию «в» одобрен	1	2024-06-04 11:21:43.988586	t
306	Вам назначили роль «d» в группе «в»	1	2024-06-04 11:21:10.787916	t
305	Вам назначили роль «Часть команды⛵» в группе «в»	1	2024-06-04 11:21:00.716145	t
302	Рындов Сергей приглашает вас в группу «в»	1	2024-06-04 11:20:16.427891	t
300	Вайнбаум Денис отклонил(а) приглашение вступить в группу «DeV»	1	2024-06-04 11:19:53.583851	t
299	Рындов Сергей приглашает вас в группу «в»	1	2024-06-04 11:19:48.364007	t
313	Вашей группе «в» отправлено приглашение в проект «Успешный DevOps»	2	2024-06-04 11:24:37.16345	t
312	Вашей группе «в» отправлено приглашение в проект «Мои финансы»	2	2024-06-04 11:24:34.789465	t
311	Вашей группе «в» отправлено приглашение в проект «Music Hub»	2	2024-06-04 11:24:32.737387	t
310	Вашей группе «в» отправлено приглашение в проект «проект»	2	2024-06-04 11:24:30.202849	t
309	Вайнбаум Денис теперь в группе «в» по приглашению	2	2024-06-04 11:24:15.976325	t
317	Вашу группу «в» выгнали из проекта «Успешный DevOps»	2	2024-06-04 11:25:10.12371	t
316	Ваше приглашение в проект «Успешный DevOps» одобрено	2	2024-06-04 11:24:54.952314	t
315	Ваше приглашение в проект «Мои финансы» отклонено	2	2024-06-04 11:24:51.825924	t
314	Ваше приглашение в проект «проект» одобрено	2	2024-06-04 11:24:47.713885	t
322	Вам назначили задачу «уцацуа» в проекте «проект»	1	2024-06-04 11:32:34.77311	f
323	Вам назначили задачу «уцацуа» в проекте «проект»	1	2024-06-04 11:32:39.261209	f
321	Ваша заявка в проект «проект» одобрена	2	2024-06-04 11:26:50.112235	t
320	Группа «в» отправила заявку в проект «проект»	2	2024-06-04 11:26:41.839159	t
319	Вам назначили задачу «уцацуа» в проекте «проект»	2	2024-06-04 11:26:16.490806	t
318	Группа «в» вышла из проекта «проект»	2	2024-06-04 11:25:24.218862	t
325	У вас новый подписчик Рындов Сергей	8	2024-06-04 11:39:23.892085	f
\.


--
-- TOC entry 3423 (class 0 OID 19959)
-- Dependencies: 239
-- Data for Name: portfolio_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.portfolio_types (id, name, details) FROM stdin;
2	Свидетельство ПО для ЭВМ / БД	{\n  "name": {\n    "label": "Название ПО/БД",\n    "placeholder": "Цифровой помощник инвестора..."\n  },\n  "value": {\n    "label": "Номер свидетельства",\n    "icon":"tag",\n    "placeholder": "1234567890..."\n  }\n}
5	Патент	{\n  "name": {\n    "label": "Название изобретения",\n    "placeholder": "Инновационный энергогенератор..."\n  },\n  "value": {\n    "label": "Номер патента",\n    "icon":"tag",\n    "placeholder": "1234567890..."\n  }\n}
6	Курсы	{\n  "name": {\n    "label": "Название курсов",\n    "placeholder": "Основы программирования..."\n  },\n  "value": {\n    "label": "Номер сертификата",\n    "icon":"tag",\n    "placeholder": "1234567890..."\n  }\n}
7	Другое	{\n  "name": {\n    "label": "Название",\n    "placeholder": "Пример названия..."\n  },\n  "value": {\n    "label": "Основная информация",\n    "icon":"feed",\n    "placeholder": "Номер документа..."\n  }\n}
1	Публикация	{\n  "name": {\n    "label": "Название публикации",\n    "placeholder": "Инновационные подходы к повышению..."\n  },\n  "value": {\n    "label": "Ссылка на статью",\n    "icon":"link",\n    "placeholder": "https://пример_сайта/статья"\n  }\n}
3	Конкурс	{\n  "name": {\n    "label": "Название конкурса",\n    "placeholder": "хакатон «</>»"\n  },\n  "value": {\n    "label": "Занятое место",\n    "icon":"emoji_events",\n    "placeholder": "диплом 1 степени..."\n  }\n}
4	Грант	{\n  "name": {\n    "label": "Название проекта",\n    "placeholder": "Развитие молодёжного предпринимательства..."\n  },\n  "value": {\n    "label": "Сумма гранта",\n    "icon":"currency_ruble",\n    "placeholder": "250 000 ₽"\n  }\n}
\.


--
-- TOC entry 3425 (class 0 OID 19967)
-- Dependencies: 241
-- Data for Name: portfolios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.portfolios (id, name, user_id, group_id, activity_id, getted_at, material, type_id, note, value) FROM stdin;
13	Лидеры цифровой трансформации	1	\N	\N	2022-11-16 00:00:00	{"img": {"id": 284, "name": "8ST1KN2ZKPGHCFG8SP5B_Certificate_finals_page-0001.jpg", "owner_id": 1, "details": {"old_name": "Certificate_finals_page-0001.jpg"}}}	3	задача "интерактивная платформа для реализации инновационных идей"	топ 10
6	Клиент-серверное приложение с голосовым помощником «Голос Города» для регионов Российской Федерации	1	\N	\N	2022-12-15 00:00:00	{"img": {"id": 268, "name": "HW3DL8CVZJ1JXSLXWU53_2022684619_page-0001.jpg", "owner_id": 1, "details": {"old_name": "2022684619_page-0001.jpg"}}}	2	\N	2022684619
1	Цифровой помощник инвестора биржевого рынка	1	\N	\N	2023-10-30 00:00:00	{\n  "img": {\n    "id": 253,\n    "name": "7930XQYJJNG6I0I2AS8G_7HUOzxM_49U.jpg",\n    "owner_id": 1,\n    "details": {\n      "old_name": "7HUOzxM_49U.jpg"\n    }\n  }\n}	2	\N	2023682718
22	Ведение переговоров и урегулирование конфликтов	22	\N	\N	2023-06-17 00:00:00	{}	6	Курс посвящен рассмотрению различных стилей и методов ведения переговоров, стратегии разрешения конфликтов, а также практические примеры успешных и неудачных переговоров	123456789
15	олимпиада "КОГРАФ-2023"	1	\N	\N	2023-04-23 00:00:00	{"img": {"id": 285, "name": "MVLOFRNF1H34L4EE25NK_uQKGs3uQlkE.jpg", "owner_id": 1, "details": {"old_name": "uQKGs3uQlkE.jpg"}}}	3	31-й Всероссийская студенческая олимпиада по графическим информационным технологиям «КОГРАФ-2023» «WEB-технологии»	диплом 1 степени
18	string	\N	\N	1	2024-04-25 00:00:00	{}	1	string	string
19	Клиент-серверное приложение с голосовым помощником «Голос Города» для регионов Российской Федерации	\N	5	\N	2022-12-15 00:00:00	{"img": {"id": 287, "name": "PDNSSQGOX366WR7QQ7CR_2022684619_page-0001.jpg", "owner_id": 9, "details": {"old_name": "2022684619_page-0001.jpg"}}}	2	\N	2022684619
20	областной конкурс молодежных инновационных команд «РОСТ»	\N	\N	11	2023-03-15 00:00:00	{"img": {"id": 292, "name": "0WB4S0ZBT9HUVEKMGU09_photo_5231156036818291194_y.jpg", "owner_id": 9, "details": {"old_name": "photo_5231156036818291194_y.jpg"}}}	3	проект "Голос Города" - голосовой ассистент городов Российской Федерации в секции «Информационные технологии и моделирование виртуального мира (VR/AR)»	диплом 2 степени
12	Лидеры цифровой трансформации	1	\N	\N	2023-06-15 00:00:00	{"img": {"id": 282, "name": "0ZRSQ061294NMMRIK8NA_Certificate-_1_.png", "owner_id": 1, "details": {"old_name": "Certificate-_1_.png"}}}	3	задача "Интерактивная платформа-сообщество для стажеров и участников молодежных карьерных проектов"	топ 10
23	Финансовый менеджмент	25	\N	\N	2022-07-13 00:00:00	{}	6	Курс посвящен освоению принципов управления финансовыми ресурсами компании, научитесь планировать и контролировать бюджет	12345678
16	Разработка для KasperskyOS	1	\N	\N	2022-11-20 00:00:00	{"img": {"id": 286, "name": "FRPG3RZLSTD9J4VI29LJ_stepik-certificate-73418-feef020_(1)_page-0001.jpg", "owner_id": 1, "details": {"old_name": "stepik-certificate-73418-feef020 (1)_page-0001.jpg"}}}	6	\N	1780475
4	«ЛЦТ Краснодарский край»	1	\N	\N	2023-11-16 00:00:00	{\n  "file": {\n    "id": 254,\n    "name": "7TVWNEO6FU3R7ISNXZWR_0c3d42c3f26144bc839b206080c061f3.pdf",\n    "owner_id": 1,\n    "details": {\n      "old_name": "0c3d42c3f26144bc839b206080c061f3.pdf"\n    }\n  }\n}	3	задача «Сервис автоматического распределения задач для выездных сотрудников банка»	сертификат
25	"Русский медвежонок"	27	\N	\N	2021-02-13 00:00:00	{"img": {"id": 441, "name": "OC9B5CUEFEL70LKCZHPF_shablon-klev-club.jpg", "owner_id": 27, "details": {"old_name": "shablon-klev-club.jpg"}}}	3	Региональный уровень конкурса-игры "Русский медвежонок - языкознание для всех"	победитель
\.


--
-- TOC entry 3427 (class 0 OID 19975)
-- Dependencies: 243
-- Data for Name: post_likes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.post_likes (user_id, post_id) FROM stdin;
21	53
21	42
21	78
21	79
21	77
21	80
21	45
21	46
21	48
21	52
21	72
21	73
21	74
21	75
21	76
22	75
22	72
22	82
22	83
1	83
1	80
1	82
1	81
1	79
1	78
25	84
25	83
25	82
25	80
25	75
25	53
25	42
25	85
1	85
1	52
3	94
5	110
8	115
8	53
8	80
8	52
5	46
5	48
1	48
8	42
1	46
1	45
1	42
9	46
9	53
9	52
9	48
9	45
9	42
1	53
19	53
19	52
19	48
19	46
19	45
19	42
1	73
1	72
19	72
19	76
19	75
19	74
19	73
18	76
18	75
18	74
18	73
18	72
18	53
18	52
18	48
18	46
18	45
18	42
1	74
1	75
1	76
1	118
1	125
4	83
27	125
27	52
27	53
27	48
27	46
27	45
27	42
2	52
2	53
2	48
2	118
2	42
\.


--
-- TOC entry 3428 (class 0 OID 19978)
-- Dependencies: 244
-- Data for Name: post_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.post_types (id, name) FROM stdin;
1	новость
3	вакансия
4	новый проект
2	новая группа
\.


--
-- TOC entry 3430 (class 0 OID 19983)
-- Dependencies: 246
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.posts (id, text, user_id, group_id, activity_id, created_at, materials, type_id) FROM stdin;
79	# Киберспорт\n\n## будущее спорта или новая реальность\nВ этом посте можно обсудить перспективы развития киберспорта и его влияние на традиционные виды спорта. Можно рассмотреть вопросы о том, как `киберспорт` становится всё более популярным и привлекает внимание молодёжи, а также обсудить возможные изменения в спортивной индустрии из-за роста популярности киберспорта.	21	\N	\N	2024-05-01 17:42:45.288472	{"files": [], "images": [{"id": 337, "name": "3Q04KVTUQ0BCG5B675MP_2149350001.jpg", "owner_id": 21, "details": {"old_name": "2149350001.jpg", "blur_image": {"id": 336, "name": "blur_3Q04KVTUQ0BCG5B675MP_2149350001.jpg", "owner_id": 21, "details": {"old_name": "2149350001.jpg"}}}}, {"id": 339, "name": "5OJBTOLYVN1WV948QOGD_2149546688.jpg", "owner_id": 21, "details": {"old_name": "2149546688.jpg", "blur_image": {"id": 338, "name": "blur_5OJBTOLYVN1WV948QOGD_2149546688.jpg", "owner_id": 21, "details": {"old_name": "2149546688.jpg"}}}}]}	1
48	# Тебя ищут в группе «MistyBit»\n\nНа вакансию **Junior front-end (React)**\n	\N	2	\N	2024-04-10 21:46:21.786423	{"files": [], "images": []}	3
53	# Тебя ищут в группе «DeV»\n\nНа вакансию **frontend-разработчик**\n	\N	1	\N	2024-04-20 12:59:50.35851	{"files": [], "images": []}	3
74	# Добро пожаловать\n\nДобро пожаловать в наш новый проект **ГидКарта**! Мы рады приветствовать каждого участника и готовы вместе создавать что-то удивительное. Давайте вместе воплощать свои идеи и делать этот проект незабываемым!	\N	\N	18	2024-04-30 14:29:45.52232	{"files": [], "images": []}	4
76	# Добро пожаловать\n\nДобро пожаловать в наш новый проект **Одевайка**! Мы рады приветствовать каждого участника и готовы вместе создавать что-то удивительное. Давайте вместе воплощать свои идеи и делать этот проект незабываемым!	\N	\N	20	2024-05-01 15:09:24.508589	{"files": [], "images": []}	4
82	# Добро пожаловать\n\nДобро пожаловать в наш новый проект **Cognitive Gym**! Мы рады приветствовать каждого участника и готовы вместе создавать что-то удивительное. Давайте вместе воплощать свои идеи и делать этот проект незабываемым!	\N	\N	22	2024-05-01 19:27:22.31561	{"files": [], "images": []}	4
85	# Добро пожаловать\n\nДобро пожаловать в наш новый проект **Волшебный день**! Мы рады приветствовать каждого участника и готовы вместе создавать что-то удивительное. Давайте вместе воплощать свои идеи и делать этот проект незабываемым!	\N	\N	24	2024-05-02 02:20:26.736617	{"files": [], "images": []}	4
86	# Добро пожаловать\n\nДобро пожаловать в наш новый проект **Book Exchange**! Мы рады приветствовать каждого участника и готовы вместе создавать что-то удивительное. Давайте вместе воплощать свои идеи и делать этот проект незабываемым!	\N	\N	25	2024-05-29 15:19:20.112307	{"files": [], "images": []}	4
88	# Добро пожаловать\n\nДобро пожаловать в наш новый проект **Говори и переводи**! Мы рады приветствовать каждого участника и готовы вместе создавать что-то удивительное. Давайте вместе воплощать свои идеи и делать этот проект незабываемым!	\N	\N	27	2024-05-29 15:21:35.227444	{"files": [], "images": []}	4
89	# Добро пожаловать\n\nДобро пожаловать в наш новый проект **Обмен Знаниями**! Мы рады приветствовать каждого участника и готовы вместе создавать что-то удивительное. Давайте вместе воплощать свои идеи и делать этот проект незабываемым!	\N	\N	28	2024-05-29 15:22:11.836844	{"files": [], "images": []}	4
91	# Добро пожаловать\n\nДобро пожаловать в наш новый проект **Music Hub**! Мы рады приветствовать каждого участника и готовы вместе создавать что-то удивительное. Давайте вместе воплощать свои идеи и делать этот проект незабываемым!	\N	\N	30	2024-05-29 15:27:17.417827	{"files": [], "images": []}	4
78	# Спорт и IT\n## как технологии меняют мир спорта\nСовременные технологии, такие как `искусственный интеллект`, `аналитика` данных и `виртуальная реальность`, влияют на развитие спорта. Можно привести примеры успешного использования этих технологий в различных видах спорта, а также обсудить перспективы их дальнейшего развития	21	\N	\N	2024-05-01 17:40:38.141352	{"files": [], "images": []}	1
80	# Спорт и IT-стартапы\n\n## новые возможности для инноваций и сотрудничества\nВ этом посте можно рассказать о `стартапах`, которые объединяют спорт и `IT`. Например, создание приложений для мониторинга здоровья спортсменов, разработка технологий `виртуальной реальности` для тренировок или создание платформ для обмена опытом и знаниями между спортсменами и тренерами. Можно обсудить перспективы развития таких стартапов и их вклад в развитие спортивной индустрии.	\N	\N	21	2024-05-01 17:44:39.291252	{"files": [], "images": [{"id": 341, "name": "ZAAWBZ1SLKFLKPYHRCGK_2148523213.jpg", "owner_id": 21, "details": {"old_name": "2148523213.jpg", "blur_image": {"id": 340, "name": "blur_ZAAWBZ1SLKFLKPYHRCGK_2148523213.jpg", "owner_id": 21, "details": {"old_name": "2148523213.jpg"}}}}]}	1
75	# Добро пожаловать\n\nДобро пожаловать в наш новый проект **Энерго Дом**! Мы рады приветствовать каждого участника и готовы вместе создавать что-то удивительное. Давайте вместе воплощать свои идеи и делать этот проект незабываемым!	\N	\N	19	2024-04-30 14:33:12.561101	{"files": [], "images": []}	4
77	# Добро пожаловать\n\nДобро пожаловать в наш новый проект **HealthyLifestyleHub**! Мы рады приветствовать каждого участника и готовы вместе создавать что-то удивительное. Давайте вместе воплощать свои идеи и делать этот проект незабываемым!	\N	\N	21	2024-05-01 17:29:38.707445	{"files": [], "images": []}	4
81	# Добро пожаловать\n\nДобро пожаловать в нашу новую группу! Мы рады приветствовать каждого из вас и уверены, что вместе мы сможем достичь невероятных результатов. Давайте работать вместе, поддерживать друг друга и двигаться к общей цели с единой целью! Добро пожаловать в **Титановый сплав**!	\N	28	\N	2024-05-01 17:55:07.641356	{"files": [], "images": []}	2
87	# Добро пожаловать\n\nДобро пожаловать в наш новый проект **Smart Home**! Мы рады приветствовать каждого участника и готовы вместе создавать что-то удивительное. Давайте вместе воплощать свои идеи и делать этот проект незабываемым!	\N	\N	26	2024-05-29 15:20:16.718535	{"files": [], "images": []}	4
90	# Добро пожаловать\n\nДобро пожаловать в наш новый проект **Спутник**! Мы рады приветствовать каждого участника и готовы вместе создавать что-то удивительное. Давайте вместе воплощать свои идеи и делать этот проект незабываемым!	\N	\N	29	2024-05-29 15:24:37.403915	{"files": [], "images": []}	4
92	# Добро пожаловать\n\nДобро пожаловать в наш новый проект **Успешный DevOps**! Мы рады приветствовать каждого участника и готовы вместе создавать что-то удивительное. Давайте вместе воплощать свои идеи и делать этот проект незабываемым!	\N	\N	31	2024-05-29 15:28:12.573569	{"files": [], "images": []}	4
93	# Добро пожаловать\n\nДобро пожаловать в наш новый проект **Мои финансы**! Мы рады приветствовать каждого участника и готовы вместе создавать что-то удивительное. Давайте вместе воплощать свои идеи и делать этот проект незабываемым!	\N	\N	32	2024-05-29 15:30:50.098865	{"files": [], "images": []}	4
110	# Добро пожаловать\n\nДобро пожаловать в наш новый проект **SiteBuilder**! Мы рады приветствовать каждого участника и готовы вместе создавать что-то удивительное. Давайте вместе воплощать свои идеи и делать этот проект незабываемым!	\N	\N	48	2024-05-29 21:19:13.589733	{"files": [], "images": []}	4
111	# Добро пожаловать\n\nДобро пожаловать в наш новый проект **EventSpace**! Мы рады приветствовать каждого участника и готовы вместе создавать что-то удивительное. Давайте вместе воплощать свои идеи и делать этот проект незабываемым!	\N	\N	49	2024-05-29 21:23:18.047787	{"files": [], "images": []}	4
112	# Добро пожаловать\n\nДобро пожаловать в наш новый проект **Читательский круг**! Мы рады приветствовать каждого участника и готовы вместе создавать что-то удивительное. Давайте вместе воплощать свои идеи и делать этот проект незабываемым!	\N	\N	50	2024-05-29 21:24:08.629706	{"files": [], "images": []}	4
113	# Добро пожаловать\n\nДобро пожаловать в наш новый проект **Music Composer**! Мы рады приветствовать каждого участника и готовы вместе создавать что-то удивительное. Давайте вместе воплощать свои идеи и делать этот проект незабываемым!	\N	\N	51	2024-05-29 21:24:45.801013	{"files": [], "images": []}	4
114	# Добро пожаловать\n\nДобро пожаловать в наш новый проект **Преодоление границ**! Мы рады приветствовать каждого участника и готовы вместе создавать что-то удивительное. Давайте вместе воплощать свои идеи и делать этот проект незабываемым!	\N	\N	52	2024-05-29 21:25:33.964888	{"files": [], "images": []}	4
52		1	\N	\N	2024-04-20 12:23:54.317164	{"files": [], "images": [{"id": 245, "name": "QGBSL3WDHBZO53GNOWM3_be397c91b8026b17f5f8a6ed98e23e9e.jpg", "owner_id": 1, "details": {"old_name": "be397c91b8026b17f5f8a6ed98e23e9e.jpg", "blur_image": {"id": 244, "name": "blur_QGBSL3WDHBZO53GNOWM3_be397c91b8026b17f5f8a6ed98e23e9e.jpg", "owner_id": 1, "details": {"old_name": "be397c91b8026b17f5f8a6ed98e23e9e.jpg"}}}}, {"id": 351, "name": "OKRE9VM4IDXGLRMIJ69E_20200125110231_Priroda_10-344.jpg", "owner_id": 1, "details": {"old_name": "20200125110231_Priroda_10-344.jpg", "blur_image": {"id": 350, "name": "blur_OKRE9VM4IDXGLRMIJ69E_20200125110231_Priroda_10-344.jpg", "owner_id": 1, "details": {"old_name": "20200125110231_Priroda_10-344.jpg"}}}}, {"id": 353, "name": "J5GOKCU7MI4ZA3C4BK82_1659982416_2-priroda-club-p-krasivaya-priroda-rossii-krasivo-foto-2.jpg", "owner_id": 1, "details": {"old_name": "1659982416_2-priroda-club-p-krasivaya-priroda-rossii-krasivo-foto-2.jpg", "blur_image": {"id": 352, "name": "blur_J5GOKCU7MI4ZA3C4BK82_1659982416_2-priroda-club-p-krasivaya-priroda-rossii-krasivo-foto-2.jpg", "owner_id": 1, "details": {"old_name": "1659982416_2-priroda-club-p-krasivaya-priroda-rossii-krasivo-foto-2.jpg"}}}}]}	1
84	# Финансовая грамотность — ключ к успеху\r\n\r\nСегодня хочу поговорить о важности финансовой грамотности. Это набор навыков и знаний, которые помогают управлять своими средствами, избегать лишних трат и приумножать накопления. Финансовая грамотность включает в себя планирование бюджета, знание кредитных и страховых продуктов, умение распоряжаться деньгами и инвестировать.\r\n\r\nСогласно исследованиям, население России имеет средний уровень финансовой грамотности среди стран G20. Однако это не повод расслабляться, ведь повышение финансовой грамотности доступно каждому. Достаточно освоить базовые принципы и практические приёмы, чтобы уверенно чувствовать себя в будущем и не переживать о долгах и непредвиденных ситуациях.\r\n\r\nВот три основных подхода, которые используют люди, умеющие обращаться с деньгами:\r\n1. Ведение ежемесячного бюджета — учитывайте доходы, расходы, сбережения и инвестиции.\r\n2. Формирование «подушки безопасности» — создайте резерв на случай непредвиденных расходов.\r\n3. Инвестирование в будущее — подумайте о пенсионных отчислениях, страховании и обучении.\r\n\r\nОцените свою финансовую грамотность, ответив на вопросы. Чем больше баллов, тем выше ваша грамотность. Развивайте финансовое мышление и поддерживайте дисциплину, и вы сможете достичь успеха в управлении своими финансами.\r\n\r\n	25	\N	\N	2024-05-02 00:56:54.495646	{"files": [], "images": [{"id": 358, "name": "6HLX9HZBP25OI2G1HKWX_hand-drawn-finance-leaders-illustrated_23-2149163551.jpg", "owner_id": 25, "details": {"old_name": "hand-drawn-finance-leaders-illustrated_23-2149163551.jpg", "blur_image": {"id": 357, "name": "blur_6HLX9HZBP25OI2G1HKWX_hand-drawn-finance-leaders-illustrated_23-2149163551.jpg", "owner_id": 25, "details": {"old_name": "hand-drawn-finance-leaders-illustrated_23-2149163551.jpg"}}}}, {"id": 360, "name": "ERC2CEIOMLU7K4CDMRCO_illustration-startup-business_53876-37657.jpg", "owner_id": 25, "details": {"old_name": "illustration-startup-business_53876-37657.jpg", "blur_image": {"id": 359, "name": "blur_ERC2CEIOMLU7K4CDMRCO_illustration-startup-business_53876-37657.jpg", "owner_id": 25, "details": {"old_name": "illustration-startup-business_53876-37657.jpg"}}}}]}	1
94	# Рязань\r\nРязань — древний российский город, административный центр Рязанской области. Он расположен на берегу рек Трубеж, Лыбедь и Ока. Основан в 1095 году. Население города составляет 520 509 человек, а вместе с пригородами — около 700 тысяч.\r\n\r\nВ Рязани много университетов и высших учебных заведений, что привлекает студентов со всего мира. В 1915 году здесь был открыт первый в России женский учительский институт, который сейчас является государственным университетом. Также в городе находится Рязанское высшее воздушно-десантное училище.\r\n\r\nОсновные экономические отрасли Рязани включают медицину, радиоэлектронику, авиационную, космическую и пищевую промышленность, агротехнологии и нефтехимию.\r\nИсторический центр Рязани — Рязанский кремль и его музеи — включён в список особо ценных объектов культурного наследия России. В городе много памятников архитектуры, ансамблей каменной и деревянной застройки XVIII–XX веков, городских музеев и усадеб.\r\n\r\nРязань известна как `«столица ВДВ`», так как здесь расположено главное учебное заведение воздушно-десантных войск России.	3	\N	\N	2024-05-29 15:35:48.330364	{"files": [], "images": [{"id": 365, "name": "VOAKZ6PXBIJ00AWQUT5G_00_ryazan.jpg", "owner_id": 3, "details": {"old_name": "00_ryazan.jpg", "blur_image": {"id": 364, "name": "blur_VOAKZ6PXBIJ00AWQUT5G_00_ryazan.jpg", "owner_id": 3, "details": {"old_name": "00_ryazan.jpg"}}}}, {"id": 367, "name": "W84KD5JY4MN6F03NL1GG_wr-960.webp", "owner_id": 3, "details": {"old_name": "wr-960.webp", "blur_image": {"id": 366, "name": "blur_W84KD5JY4MN6F03NL1GG_wr-960.webp", "owner_id": 3, "details": {"old_name": "wr-960.webp"}}}}, {"id": 369, "name": "B8NGJLQ145N0Y3ZI6LBZ_istockphoto-647337554-1024x1024.jpg", "owner_id": 3, "details": {"old_name": "istockphoto-647337554-1024x1024.jpg", "blur_image": {"id": 368, "name": "blur_B8NGJLQ145N0Y3ZI6LBZ_istockphoto-647337554-1024x1024.jpg", "owner_id": 3, "details": {"old_name": "istockphoto-647337554-1024x1024.jpg"}}}}]}	1
101	# Добро пожаловать\n\nДобро пожаловать в наш новый проект **Большой Фикус**! Мы рады приветствовать каждого участника и готовы вместе создавать что-то удивительное. Давайте вместе воплощать свои идеи и делать этот проект незабываемым!	\N	\N	39	2024-05-29 16:21:07.882299	{"files": [], "images": []}	4
115	# Brawlhalla\r\nBrawlhalla — это захватывающий бесплатный `файтинг`, разработанный компанией Blue Mammoth Games и выпущенный Ubisoft. Игра была представлена на PAX East в апреле 2014 года и перешла в альфа-версию в том же месяце. Открытая бета-версия стала доступна в ноябре 2015 года, а полный релиз состоялся в 2017 году.\r\n\r\nИгровой процесс Brawlhalla основан на идее сбивания противника с арены, как в Super Smash Bros. Цель достигается нанесением урона оппоненту, который отображается цветом иконки персонажа. Чем ближе цвет к красному, тем дальше игрок будет отлетать от ударов. Выигрывает тот, кто последним останется на арене или наберет больше очков.\r\n\r\nВ игре доступны одиночная и многопользовательская игра, а также различные игровые режимы, такие как Free-For-All, 1v1 Strikeout, Experimental 1v1 и уникальные режимы каждую неделю. Управление в игре простое и удобное, подходит как для новичков, так и для опытных игроков.\r\nЧемпионат мира Brawlhalla — это официальный турнир с призовым фондом в 50 000 долларов, который проводится ежегодно. Он собирает лучших игроков со всего мира и является ярким событием в мире видеоигр.	8	\N	\N	2024-05-29 21:28:48.108191	{"files": [], "images": [{"id": 371, "name": "AMNMUL1EU4X2Q5G0DKYS_ss_9a3f16b256935e5bb965a9b5a5c9de6a1a36b0c5.1920x1080.jpg", "owner_id": 8, "details": {"old_name": "ss_9a3f16b256935e5bb965a9b5a5c9de6a1a36b0c5.1920x1080.jpg", "blur_image": {"id": 370, "name": "blur_AMNMUL1EU4X2Q5G0DKYS_ss_9a3f16b256935e5bb965a9b5a5c9de6a1a36b0c5.1920x1080.jpg", "owner_id": 8, "details": {"old_name": "ss_9a3f16b256935e5bb965a9b5a5c9de6a1a36b0c5.1920x1080.jpg"}}}}]}	1
46	# Добро пожаловать\n\nДобро пожаловать в наш новый проект **Sign Sense**! Мы рады приветствовать каждого участника и готовы вместе создавать что-то удивительное. Давайте вместе воплощать свои идеи и делать этот проект незабываемым!	\N	\N	13	2024-04-10 21:15:15.117207	{"files": [], "images": []}	4
42	# Добро пожаловать\n\nДобро пожаловать в нашу новую группу! Мы рады приветствовать каждого из вас и уверены, что вместе мы сможем достичь невероятных результатов. Давайте работать вместе, поддерживать друг друга и двигаться к общей цели с единой целью! Добро пожаловать в **DeV**!	\N	1	\N	2024-04-10 20:41:16.101051	{"files": [], "images": []}	2
72	# Добро пожаловать\n\nДобро пожаловать в нашу новую группу! Мы рады приветствовать каждого из вас и уверены, что вместе мы сможем достичь невероятных результатов. Давайте работать вместе, поддерживать друг друга и двигаться к общей цели с единой целью! Добро пожаловать в **Вдохновение**!	\N	27	\N	2024-04-28 01:52:30.527799	{"files": [], "images": []}	2
73	# Добро пожаловать\n\nДобро пожаловать в наш новый проект **Space Tour**! Мы рады приветствовать каждого участника и готовы вместе создавать что-то удивительное. Давайте вместе воплощать свои идеи и делать этот проект незабываемым!	\N	\N	17	2024-04-30 10:43:32.935283	{"files": [], "images": []}	4
125	# Добро пожаловать\n\nДобро пожаловать в наш новый проект **MedTech Innovations**! Мы рады приветствовать каждого участника и готовы вместе создавать что-то удивительное. Давайте вместе воплощать свои идеи и делать этот проект незабываемым!	\N	\N	53	2024-05-31 18:14:05.196113	{"files": [], "images": []}	4
118		2	\N	\N	2024-05-31 17:42:15.661299	{"files": [], "images": [{"id": 439, "name": "TSZCQKT0SKDO25NHY53Q_1.jpg", "owner_id": 2, "details": {"old_name": "1.jpg", "blur_image": {"id": 438, "name": "blur_TSZCQKT0SKDO25NHY53Q_1.jpg", "owner_id": 2, "details": {"old_name": "1.jpg"}}}}]}	1
45	# Добро пожаловать\n\nДобро пожаловать в нашу новую группу! Мы рады приветствовать каждого из вас и уверены, что вместе мы сможем достичь невероятных результатов. Давайте работать вместе, поддерживать друг друга и двигаться к общей цели с единой целью! Добро пожаловать в **DreamTeam**!	\N	21	\N	2024-04-10 21:05:59.459789	{"files": [], "images": []}	2
83	# Добро пожаловать\n\nДобро пожаловать в наш новый проект **Food Diary**! Мы рады приветствовать каждого участника и готовы вместе создавать что-то удивительное. Давайте вместе воплощать свои идеи и делать этот проект незабываемым!	\N	\N	23	2024-05-01 19:37:09.840375	{"files": [], "images": []}	4
95	# Добро пожаловать\n\nДобро пожаловать в наш новый проект **Кафе Поиск**! Мы рады приветствовать каждого участника и готовы вместе создавать что-то удивительное. Давайте вместе воплощать свои идеи и делать этот проект незабываемым!	\N	\N	33	2024-05-29 15:40:54.619436	{"files": [], "images": []}	4
96	# Добро пожаловать\n\nДобро пожаловать в наш новый проект **Электронный наставник**! Мы рады приветствовать каждого участника и готовы вместе создавать что-то удивительное. Давайте вместе воплощать свои идеи и делать этот проект незабываемым!	\N	\N	34	2024-05-29 15:41:38.565178	{"files": [], "images": []}	4
97	# Добро пожаловать\n\nДобро пожаловать в наш новый проект **Готовим вместе**! Мы рады приветствовать каждого участника и готовы вместе создавать что-то удивительное. Давайте вместе воплощать свои идеи и делать этот проект незабываемым!	\N	\N	35	2024-05-29 15:42:51.688813	{"files": [], "images": []}	4
98	# Добро пожаловать\n\nДобро пожаловать в наш новый проект **Зелёные тропы**! Мы рады приветствовать каждого участника и готовы вместе создавать что-то удивительное. Давайте вместе воплощать свои идеи и делать этот проект незабываемым!	\N	\N	36	2024-05-29 15:43:28.790154	{"files": [], "images": []}	4
99	# Добро пожаловать\n\nДобро пожаловать в наш новый проект **Финансовая гармония**! Мы рады приветствовать каждого участника и готовы вместе создавать что-то удивительное. Давайте вместе воплощать свои идеи и делать этот проект незабываемым!	\N	\N	37	2024-05-29 15:46:31.802967	{"files": [], "images": []}	4
100	# Добро пожаловать\n\nДобро пожаловать в наш новый проект **Explore Together**! Мы рады приветствовать каждого участника и готовы вместе создавать что-то удивительное. Давайте вместе воплощать свои идеи и делать этот проект незабываемым!	\N	\N	38	2024-05-29 16:18:59.629174	{"files": [], "images": []}	4
102	# Добро пожаловать\n\nДобро пожаловать в наш новый проект **Фото Академия**! Мы рады приветствовать каждого участника и готовы вместе создавать что-то удивительное. Давайте вместе воплощать свои идеи и делать этот проект незабываемым!	\N	\N	40	2024-05-29 16:25:55.548159	{"files": [], "images": []}	4
103	# Добро пожаловать\n\nДобро пожаловать в наш новый проект **Вкусные истории**! Мы рады приветствовать каждого участника и готовы вместе создавать что-то удивительное. Давайте вместе воплощать свои идеи и делать этот проект незабываемым!	\N	\N	41	2024-05-29 21:08:19.315819	{"files": [], "images": []}	4
104	# Добро пожаловать\n\nДобро пожаловать в наш новый проект **Отдыхайка**! Мы рады приветствовать каждого участника и готовы вместе создавать что-то удивительное. Давайте вместе воплощать свои идеи и делать этот проект незабываемым!	\N	\N	42	2024-05-29 21:10:00.68877	{"files": [], "images": []}	4
105	# Добро пожаловать\n\nДобро пожаловать в наш новый проект **TeamBridge**! Мы рады приветствовать каждого участника и готовы вместе создавать что-то удивительное. Давайте вместе воплощать свои идеи и делать этот проект незабываемым!	\N	\N	43	2024-05-29 21:11:14.766349	{"files": [], "images": []}	4
106	# Добро пожаловать\n\nДобро пожаловать в наш новый проект **Фейерверк идей**! Мы рады приветствовать каждого участника и готовы вместе создавать что-то удивительное. Давайте вместе воплощать свои идеи и делать этот проект незабываемым!	\N	\N	44	2024-05-29 21:13:27.600549	{"files": [], "images": []}	4
107	# Добро пожаловать\n\nДобро пожаловать в наш новый проект **Eventia**! Мы рады приветствовать каждого участника и готовы вместе создавать что-то удивительное. Давайте вместе воплощать свои идеи и делать этот проект незабываемым!	\N	\N	45	2024-05-29 21:14:50.460791	{"files": [], "images": []}	4
108	# Добро пожаловать\n\nДобро пожаловать в наш новый проект **Фитнес-трекер**! Мы рады приветствовать каждого участника и готовы вместе создавать что-то удивительное. Давайте вместе воплощать свои идеи и делать этот проект незабываемым!	\N	\N	46	2024-05-29 21:16:22.977199	{"files": [], "images": []}	4
109	# Добро пожаловать\n\nДобро пожаловать в наш новый проект **Культурный мост**! Мы рады приветствовать каждого участника и готовы вместе создавать что-то удивительное. Давайте вместе воплощать свои идеи и делать этот проект незабываемым!	\N	\N	47	2024-05-29 21:17:08.791146	{"files": [], "images": []}	4
\.


--
-- TOC entry 3432 (class 0 OID 19991)
-- Dependencies: 248
-- Data for Name: regions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.regions (id, name) FROM stdin;
3	Нижегородская область
4	Город федерального значения
5	‎Тамбовская область
6	Курская область
7	Карачаево-Черкесская Республика
8	Московская область
10	Республика Хакасия
11	Тюменская область
12	Приморский край
13	Приморский край
1	Республика Татарстан
2	Рязанская область
14	Иркутская область
\.


--
-- TOC entry 3434 (class 0 OID 19996)
-- Dependencies: 250
-- Data for Name: requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.requests (group_id, activity_id, status_id, created_at) FROM stdin;
2	24	3	2024-05-02 02:41:17.441994
21	24	4	2024-05-02 02:42:13.994714
3	3	3	2024-03-25 06:38:36.754945
2	3	3	2024-03-25 06:38:38.667107
1	3	4	2024-03-25 06:38:33.879654
6	11	3	2024-03-24 19:42:00.126981
5	1	3	2024-03-25 06:24:38.341079
3	1	3	2024-03-25 06:24:40.00357
2	1	3	2024-03-25 06:24:42.091467
1	1	1	2024-04-05 07:49:56.175195
2	13	4	2024-04-10 21:16:33.58866
1	13	1	2024-04-30 10:13:04.145828
21	13	1	2024-04-30 10:13:09.705581
21	1	1	2024-04-30 10:13:13.258843
6	1	2	2024-04-30 18:54:21.27701
21	19	3	2024-04-30 18:54:00.403709
1	19	4	2024-04-30 18:53:57.190032
27	20	4	2024-05-01 15:09:38.672604
28	21	4	2024-05-01 17:58:25.921126
6	23	3	2024-05-01 19:39:41.547811
2	23	3	2024-05-01 19:39:49.137037
1	23	4	2024-05-01 19:41:05.785098
6	22	3	2024-05-01 19:39:44.025514
2	22	3	2024-05-01 19:39:46.754509
1	22	4	2024-05-01 19:41:03.421983
1	17	3	2024-04-30 18:53:41.855571
21	17	4	2024-04-30 18:53:48.560271
21	18	3	2024-04-30 18:54:36.683745
1	18	4	2024-04-30 18:54:06.728832
5	27	1	2024-06-04 05:41:05.281047
1	11	3	2024-06-04 06:01:44.053545
5	11	4	2024-06-04 06:02:13.517892
\.


--
-- TOC entry 3435 (class 0 OID 19999)
-- Dependencies: 251
-- Data for Name: requets_statuses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.requets_statuses (id, name) FROM stdin;
1	Заявка
2	Приглашение
3	Недействительно
4	Одобрено
5	Отклонено
\.


--
-- TOC entry 3437 (class 0 OID 20004)
-- Dependencies: 253
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name) FROM stdin;
1	пользователь
2	администратор
3	эксперт
4	инвестор
\.


--
-- TOC entry 3439 (class 0 OID 20009)
-- Dependencies: 255
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subscriptions (subscriber_id, favorite_id, created_at) FROM stdin;
5	1	2024-03-07 13:52:32.657628
1	2	2024-03-07 21:32:30.111106
2	3	2024-03-08 21:45:33.279648
2	4	2024-03-08 21:45:38.365057
2	5	2024-03-08 21:45:43.414046
2	1	2024-03-08 21:47:54.038869
3	2	2024-03-08 22:11:11.792436
4	2	2024-03-08 22:12:45.933787
1	8	2024-03-14 16:49:53.755691
1	3	2024-03-14 16:55:14.400153
1	5	2024-03-21 11:59:20.751525
9	1	2024-03-24 12:57:54.656667
9	10	2024-03-24 13:43:50.446396
1	9	2024-03-25 14:17:34.599569
8	1	2024-04-04 07:08:54.072344
13	1	2024-04-22 17:45:20.156858
19	1	2024-04-28 01:49:07.991884
21	1	2024-05-01 17:28:23.998905
22	1	2024-05-01 19:40:10.828917
25	1	2024-05-02 01:10:36.16662
1	16	2024-05-29 12:37:09.987581
1	26	2024-05-31 17:51:55.37665
26	1	2024-05-31 17:53:45.098746
2	26	2024-06-02 07:32:23.579139
27	1	2024-06-03 13:51:15.305678
2	9	2024-06-04 08:37:33.377617
\.


--
-- TOC entry 3440 (class 0 OID 20012)
-- Dependencies: 256
-- Data for Name: tag_activities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tag_activities (tag_id, activity_id) FROM stdin;
16	1
6	3
23	3
16	3
24	3
53	17
62	21
63	21
6	11
\.


--
-- TOC entry 3441 (class 0 OID 20015)
-- Dependencies: 257
-- Data for Name: tag_levels; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tag_levels (id, name, icon) FROM stdin;
1	Начальный	A1
2	Ниже среднего	A2
3	Средний	B1
4	Выше среднего	B2
5	Продвинутый	С1
6	Профессиональный	С2
8	Эксперт	E
7	Сложно оценить	\N
\.


--
-- TOC entry 3443 (class 0 OID 20023)
-- Dependencies: 259
-- Data for Name: tag_portfolios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tag_portfolios (tag_id, portfolio_id) FROM stdin;
3	1
37	1
6	4
1	4
23	4
16	4
37	4
6	6
23	6
20	6
24	6
38	6
6	12
23	12
20	12
1	12
24	12
6	13
23	13
24	13
6	15
39	16
6	19
23	19
20	19
38	19
24	19
38	20
6	20
20	20
1	20
23	20
40	16
2	16
21	4
20	4
68	22
4	22
70	22
37	23
73	23
74	23
69	25
\.


--
-- TOC entry 3444 (class 0 OID 20026)
-- Dependencies: 260
-- Data for Name: tag_posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tag_posts (tag_id, post_id) FROM stdin;
7	48
32	48
33	48
34	48
35	48
36	48
6	53
41	52
6	48
62	78
64	78
62	79
65	79
62	80
9	80
66	80
37	84
73	84
38	94
65	115
75	115
41	118
\.


--
-- TOC entry 3445 (class 0 OID 20029)
-- Dependencies: 261
-- Data for Name: tag_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tag_users (tag_id, user_id, level_id) FROM stdin;
2	1	3
3	1	2
4	1	7
5	1	1
6	1	3
7	1	2
6	5	2
7	5	4
4	5	7
5	2	3
4	2	6
8	2	3
8	10	4
9	10	4
10	10	4
11	10	4
1	1	2
4	9	7
43	18	4
44	18	4
45	18	3
46	18	7
39	13	4
47	13	3
48	13	4
49	13	3
4	19	7
49	19	7
50	19	7
51	19	7
52	19	7
54	20	4
55	20	3
56	20	3
57	20	3
20	21	3
7	21	2
1	21	3
49	21	2
58	21	2
59	21	3
60	21	3
61	21	1
4	22	7
67	22	7
68	22	7
69	22	4
49	25	3
37	25	4
71	25	4
72	25	3
10	27	3
\.


--
-- TOC entry 3446 (class 0 OID 20032)
-- Dependencies: 262
-- Data for Name: tag_vacancies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tag_vacancies (tag_id, vacancy_id, level_id) FROM stdin;
1	1	3
5	2	3
18	2	3
19	2	4
6	1	3
5	1	2
20	1	3
21	1	2
22	1	2
7	19	2
32	19	3
33	19	2
34	19	2
35	19	3
36	19	3
6	20	3
\.


--
-- TOC entry 3447 (class 0 OID 20035)
-- Dependencies: 263
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tags (id, name) FROM stdin;
1	Python
2	C/C++
3	C#
4	Коммуникабельность
5	Docker
6	Angular
7	JS
8	ML
9	IT
10	Data science
11	CV
16	Бизнес-инструменты
18	Jenkins
19	CI/CD
20	PostgreSQL
21	Redis
22	Celery
23	FastAPI
24	Веб-сервис
32	Figma
33	Git
34	Redux
35	React
36	TypeScript
37	Финансы
38	Туризм
39	Информационная безопасность
40	ОС
41	Природа
43	Психология
44	Сурдопедагогика
45	Жестовая речь
46	Артистизм
47	Криминалистика
48	Тестирование
49	Аналитика
50	Креативность
51	Ответственность
52	Адаптивность
53	Космос
54	Плазменная резка
55	Конструирование
56	Преподавание
57	Маркетинг
58	Nginx
59	PHP
60	Linux
61	SEO
62	Спорт
63	Фитнес
64	ИИ
65	Киберспорт
66	VR
67	Стрессоустойчивость
68	Тактичность
69	Английский язык
70	Навык дипломатии
71	Банковское дело
72	Математические методы
73	Инвестиции
74	Бюджетирование
75	Компьютерные игры
\.


--
-- TOC entry 3449 (class 0 OID 20040)
-- Dependencies: 265
-- Data for Name: user_abstracts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_abstracts (id, email, avatar, created_at, username, hashed_password, decoration, role_id, firstname, lastname, is_active) FROM stdin;
23	evgeniya8251@hotmail.com	{}	2024-05-01 23:23:38.359625	\N	$2b$12$Ff0MiAKJaonjgQUlLHnfp.WoinVjRd3C8LYoU4kX6EnKRR./XD0HK	{}	1	Евгения	Батрутдинова	f
21	timofey.agafonov@yandex.ru	{"id": 333, "url": "93F6SKQGOPVU1A3NHTHJ_1714573381744.png"}	2024-05-01 17:21:10.355475	timofey.agafonov	$2b$12$MkKm2izN/3e7P6u91dDk.ebCa7xsDr6BI1QZyuPpIpDiUvSQNCvqu	{"id": 332, "coverImage": "UK3QIRQYTYXOENG34QV2_8478.jpg"}	1	Тимофей	Агафонов	t
6	dev@mail.ru	{"id": 319, "url": "OGLTYBK1UYJ0FYW0QAX4_1714307015268.png"}	2024-03-08 14:25:26.373279	pro_connect_admin	$2b$12$GD/B9b3.J4Bu.IPmlpuNau2nqg2J/TFaGlHobzx9pMf57Fh0bIzMi	{"id": 320, "coverImage": "NWXKZWUIAJ7EGWPKONUV_1671677199_kalix-club-p-sinyaya-abstraktsiya-vkontakte-3_GDG9GRUO5NSPXIW80LO0.jpg"}	2	Администратор	Pro Connect	t
20	yakov4662@hotmail.com	{"id": 330, "url": "PHLV6PU1VJWDIDBFB9M3_1714573071081.png"}	2024-05-01 17:04:00.054514	yakov4662	$2b$12$fy/i5SNb2/GX5a0eQoWsC.KGSXNDZaSq9EhZiJNqPmWCuk218cnaG	{"id": 331, "coverImage": "9GDGB8H9PA8V8V1THF6K_2148393480.jpg"}	1	Яков	Набатников	t
25	jarofe2765@goulink.com	{"id": 355, "url": "WGWMZDH999X8OWAY5DU8_1714596133927.jpeg"}	2024-05-01 23:27:31.669113	kira5974	$2b$12$vvWFvy3x/7E0/MOzubzKwO3Z191RtMnwgbyqND3npeobE1Tpd/s/O	{"id": 356, "coverImage": "V8O2ECP33HMFQIN1AMP1_world-smile-day-emojis-arrangement_23-2149024492.jpg"}	1	Кира	Горбунова	t
13	lireko4999@felibg.com	{"id": 299, "url": "46UGWN6I1H41F7K6T3WY_1714256450759.jpeg"}	2024-04-04 08:15:12.070486	vyacheslav22081973	$2b$12$mdf7V8v8h47QcOgn9LwZt./KPfemcGufyow78KZ4GZqx5vDtHta2y	{"id": 300, "coverImage": "DGHQGFMOMXELZMG91T3J_Network.jpg"}	1	Вячеслав	Коромыслов	t
9	katyryab1ninaryabinina@yandex.ru	{"id": 33, "url": "1710350156117_8705W9NPKIN9O7JFTKD4.jpeg"}	2024-03-13 17:14:09.970481	katya	$2b$12$pMhW8sB1EJw2YVS/ctwVUelRTlY/REtetxVP5eguyEQUyMlR7EVI6	{}	1	Екатерина	Вахутина	t
22	larisa1977@hotmail.com	{"id": 344, "url": "EWS2AOD49YMFFSTAO7H3_1714578670139.png"}	2024-05-01 18:49:10.667018	larisa1977	$2b$12$.AWXwsbXZgxTYT/TsJH9zONFSWHVT2rdcdVXBvH.m7VBn/9MTo.wC	{"id": 346, "coverImage": "FM9RORIIQXG1CZO0WT5Y_\\u0411\\u0435\\u0437_\\u0438\\u043c\\u0435\\u043d\\u0438.png"}	1	Лариса	Карчагина	t
8	saksim228775@gmail.com	{}	2024-03-13 16:18:42.18267	\N	$2b$12$FmnY6ovgHIy2CChW4EKAxu3bjl/VyjnqRJI6T5YI9RRS9c1HOlOwS	{}	1	Максим	Исаев	t
3	vaynbaum20@gmail.com	{"id": 13, "url": "1709935901116_QOE4A446WCRM2G0FQ7RN.jpeg"}	2024-03-07 11:31:29.511264	ivanov	$2b$12$zxWBYeSLX05.rK4kMdhF3.nfPerppBTTkhD5g/YZYnOau0VXq2sXC	{}	1	Иван	Иванов	t
4	vaynbaum30@gmail.com	{"id": 12, "url": "1709935773065_6TICO9A32RLSV6B2MAVZ.jpeg"}	2024-03-07 11:31:45.156483	baranov	$2b$12$OGiF/xvbnE51GFXdpJl14eBCbDotVNzbJKCKpe7DfPFJjD4nqBB2m	{}	1	Роман	Баранов	t
10	kontrabbas@mail.ru	{"id": 301, "url": "WT835ENCA9G1JCEC5GOE_1714256717567.jpeg"}	2024-03-13 18:06:33.359958	kaer1n	$2b$12$hnQWiZpwNYDJZF9t4axO5uLuaCZQTjoyYBEhR3tE9rsy4xKo35XvS	{"id": 303, "coverImage": "L4G7NBYAMFRYSJR8P7C3_\\u0411\\u0435\\u0437_\\u043d\\u0430\\u0437\\u0432\\u0430\\u043d\\u0438\\u044f.jpg"}	1	Андрей	Левтев	t
16	martinova.iri@yandex.ru	{}	2024-04-20 18:43:44.135051	\N	$2b$12$Nd0VixQq7J2/j53cMEILR.rCtW26kegc5KPcqkxUelwQ0zUO8pGaO	{}	1	Ирина	Мартынова	t
18	verik68385@buzblox.com	{"id": 293, "url": "DMR68QJUBJO5GMZGJ0T9_1714255366114.png"}	2024-04-28 00:49:03.86533	nikolay1990	$2b$12$PHtfoyPsxBoRIAwbYQACJ.50K7Dqkai4PA6tLRUGSbrH/RNrdXopq	{"id": 296, "coverImage": "4T01IGD2JV4YK6Y1L3II_\\u0424\\u043e\\u043d\\u044b_\\u0434\\u043b\\u044f_\\u043e\\u0431\\u043b\\u043e\\u0436\\u0435\\u043a_\\u0412\\u041a.jpg"}	1	Николай	Цитников	t
19	konstantin.salagin@rambler.ru	{"id": 308, "url": "YNF4V9HEKVLMZAH7BFJV_1714257923193.jpeg"}	2024-04-28 01:41:45.749892	konstantin.salagin	$2b$12$OtGTT0bmlvkOABLn/N748O1nslAwG5YQ6FwyXE7udVefeKxv7WkqO	{"id": 309, "coverImage": "IV4AEQ6JCOO4PK9WYRJP_1dfb6dac-ecb5-4e36-b340-6807daa631b6.jpg"}	1	Константин	Салагин	t
5	vvromanmelnikov@yandex.ru	{"id": 5, "url": "1709921178475_FMHUZMDCRP7Q1U9PYO07.jpeg"}	2024-03-07 11:32:30.951698	v.romanmelnikov	$2b$12$HRJ1vzgHyBaQ882wpNoymO9qb1OLNVY6OwDm9E1eLyKW.9D0KMRyS	{"id": 6, "coverImage": "r-SOJcBSFr4_CZ0PWO926VGGDTX3XI4P.jpg"}	1	Роман	Мельников	t
1	mr.vaynbaum@mail.ru	{"id": 4, "url": "1709846460998_U65YB17GB7LWN0MA56XD.jpeg"}	2024-03-07 11:29:29.356672	mr.vaynbaum	$2b$12$La.0lJsXgFAZlZMAehs0sO0cJsR985u83mL/XV9stjfR3P3lbf4vC	{"id": 32, "coverImage": "image_861109181712294698219_HWLA4BCMF7OMGFXY9HQQ.gif"}	1	Денис	Вайнбаум	t
27	lokor87931@crodity.com	{}	2024-06-02 10:24:56.726249	id27	$2b$12$hziUWMn3C47s56N5bUBrPOBVld9aQkqm6JbyCeWv1IShUscUVkQiq	{}	1	Иван	Иванов	t
2	vaynbaum10@gmail.com	{"id": 422, "url": "XD2MPKHOFVFL0KNDF8M5_1717313432494.jpeg"}	2024-03-07 11:31:18.701956	idigidrid	$2b$12$0/lnC5DvLgjE9gY/FV3b7uUQh/WlctDUGl2FEKEXQ/qzeRUHDzwda	{"id": 11, "coverImage": "5GLUkKON5qA_4Y2JEERA2CRYSABPN7TY.jpg"}	1	Сергей	Рындов	t
26	mishaborisov0159@gmail.com	{}	2024-05-31 17:46:51.158025	Misha	$2b$12$N8GsQH4b3HEVXgE7c3weeu75RLaKbIiGTdo.1ApBwnXjh0169WlV6	{}	1	Михаил	Борисов	t
\.


--
-- TOC entry 3451 (class 0 OID 20048)
-- Dependencies: 267
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, city_id, birthdate) FROM stdin;
1	3	2003-01-16
5	4	2002-08-19
3	11	1992-03-21
4	13	2001-09-07
8	\N	\N
9	5	\N
16	\N	\N
18	14	1990-06-20
13	15	1991-08-22
10	5	1994-12-28
19	17	1991-12-22
20	18	1995-12-17
21	19	1985-09-08
22	21	1977-06-27
23	\N	\N
25	31	1976-07-23
26	\N	\N
2	5	2002-10-17
27	32	2003-02-04
\.


--
-- TOC entry 3452 (class 0 OID 20051)
-- Dependencies: 268
-- Data for Name: vacancies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vacancies (id, name, description, created_at, group_id, is_active) FROM stdin;
20	frontend-разработчик	нужен frontend-разработчик 1 шт.	2024-04-20 12:59:50.286474	1	t
2	DevOps	Ищем DevOps специалиста в команду для реализации CI/CD в наших проектах	2024-03-21 13:47:04.459206	1	t
1	Fullstack разработчик	Идет поиск fullstack разработчика в команду для реализации проектов. Стек технологий: FastAPI, Angular, PostgreSQL, Redis, Celery. Опыт в хакатонах, проектной деятельности приветствуется.	2024-03-21 20:56:16.693173	1	t
19	Junior front-end (React)	Сейчас мы в поиске junior Front-end (React), UX/UI дизайнера , который вместе с командой привнесет еще больше крутых инструментов для воплощения наших грандиозных планов!\n\nМы предлагаем тебе:\n\n- понятную и стабильную зарплату;\n\n- карьерный и профессиональный рост\n\n- работа в комбинированном формате (офис\\дом);\n\n- график работы с 8:15 до 16:35 ( сб. вс. выходные)\n\n- ВСЕ ПО ЗАКОНУ: официальное трудоустройство по ТК, соцгарантии и забота о твоем будущем;\n\n- крутую атмосферу в коллективе – каждый сотрудник понимает свои цели, видит результаты, получает поддержку;\n\n- профессиональное развитие, ведь мы так же заинтересованы в твоем результате;\n\nВы полны интереса? Загорелись глаза, а сердце стало биться чаще? Высылайте резюме!\n\nЧто нужно будет делать?\n\nРазрабатывать проекты (frontend-части) на React\nДорабатывать существующие проекты\nПроектирование пользовательских интерфейсов UX/UI в Figma;\nМы ждем тебя в команду, если ты:\n\n-Ты уже разрабатывал Web-приложений на JavaScript, TypeScript, React.js\n\n-Знаешь JavaScript;\n\n-Работал с React.js;\n\n-Владеешь дизайном UX/UI интерфейсов в Figma; Git, Jira;\n\n-Если ты стремишься развиваться\n\nБудет здорово, если в твоем арсенале есть:\n\n- Знание TypeScript;\n\n- Знание MaterialUI;\n\n- Умение работать с Redux;\n\n- Опыт и умение работать кроссплатформенной разработки;\n\n- Знание дополнительных языков C++/C#\n\nБудем рады видеть вас частью нашей команды!	2024-04-10 21:46:21.694036	2	t
25	Fullstack	Нужен fullstack	2024-06-04 10:57:12.270919	5	t
\.


--
-- TOC entry 3454 (class 0 OID 20059)
-- Dependencies: 270
-- Data for Name: vacancy_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vacancy_users (vacancy_id, user_id, created_at, is_approved) FROM stdin;
2	2	2024-03-21 21:12:05.406481	f
1	4	2024-03-21 21:12:41.615751	f
1	3	2024-03-21 21:11:52.678971	f
2	4	2024-03-21 21:12:39.268082	t
1	13	2024-04-21 21:54:21.047701	\N
20	13	2024-04-21 21:53:58.056753	f
2	13	2024-04-21 21:54:19.512519	f
2	3	2024-03-21 21:11:53.945629	f
2	19	2024-05-01 14:05:08.203034	\N
2	21	2024-05-01 17:28:15.266275	\N
1	21	2024-05-01 17:28:16.960826	\N
2	25	2024-05-02 01:09:54.12846	\N
20	21	2024-05-01 17:28:13.851762	t
20	25	2024-05-02 01:09:50.996374	f
19	1	2024-06-04 10:41:43.150451	\N
19	2	2024-06-04 11:09:21.831995	\N
\.


--
-- TOC entry 3487 (class 0 OID 0)
-- Dependencies: 203
-- Name: activities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.activities_id_seq', 54, true);


--
-- TOC entry 3488 (class 0 OID 0)
-- Dependencies: 205
-- Name: activity_statuses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.activity_statuses_id_seq', 1, false);


--
-- TOC entry 3489 (class 0 OID 0)
-- Dependencies: 208
-- Name: activity_task_statuses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.activity_task_statuses_id_seq', 1, false);


--
-- TOC entry 3490 (class 0 OID 0)
-- Dependencies: 210
-- Name: activity_tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.activity_tasks_id_seq', 26, true);


--
-- TOC entry 3491 (class 0 OID 0)
-- Dependencies: 214
-- Name: cities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cities_id_seq', 32, true);


--
-- TOC entry 3492 (class 0 OID 0)
-- Dependencies: 216
-- Name: contact_activities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contact_activities_id_seq', 8, true);


--
-- TOC entry 3493 (class 0 OID 0)
-- Dependencies: 218
-- Name: contact_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contact_groups_id_seq', 14, true);


--
-- TOC entry 3494 (class 0 OID 0)
-- Dependencies: 220
-- Name: contact_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contact_users_id_seq', 48, true);


--
-- TOC entry 3495 (class 0 OID 0)
-- Dependencies: 222
-- Name: contacts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contacts_id_seq', 1, false);


--
-- TOC entry 3496 (class 0 OID 0)
-- Dependencies: 224
-- Name: directions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.directions_id_seq', 1, false);


--
-- TOC entry 3497 (class 0 OID 0)
-- Dependencies: 226
-- Name: files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.files_id_seq', 451, true);


--
-- TOC entry 3498 (class 0 OID 0)
-- Dependencies: 229
-- Name: group_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.group_roles_id_seq', 29, true);


--
-- TOC entry 3499 (class 0 OID 0)
-- Dependencies: 231
-- Name: group_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.group_types_id_seq', 1, false);


--
-- TOC entry 3500 (class 0 OID 0)
-- Dependencies: 234
-- Name: groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.groups_id_seq', 30, true);


--
-- TOC entry 3501 (class 0 OID 0)
-- Dependencies: 236
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.messages_id_seq', 101, true);


--
-- TOC entry 3502 (class 0 OID 0)
-- Dependencies: 238
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 325, true);


--
-- TOC entry 3503 (class 0 OID 0)
-- Dependencies: 240
-- Name: portfolio_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.portfolio_types_id_seq', 1, false);


--
-- TOC entry 3504 (class 0 OID 0)
-- Dependencies: 242
-- Name: portfolios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.portfolios_id_seq', 27, true);


--
-- TOC entry 3505 (class 0 OID 0)
-- Dependencies: 245
-- Name: post_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.post_types_id_seq', 1, false);


--
-- TOC entry 3506 (class 0 OID 0)
-- Dependencies: 247
-- Name: posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.posts_id_seq', 136, true);


--
-- TOC entry 3507 (class 0 OID 0)
-- Dependencies: 249
-- Name: regions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.regions_id_seq', 14, true);


--
-- TOC entry 3508 (class 0 OID 0)
-- Dependencies: 252
-- Name: requets_statuses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.requets_statuses_id_seq', 1, false);


--
-- TOC entry 3509 (class 0 OID 0)
-- Dependencies: 254
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 1, false);


--
-- TOC entry 3510 (class 0 OID 0)
-- Dependencies: 258
-- Name: tag_levels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tag_levels_id_seq', 1, false);


--
-- TOC entry 3511 (class 0 OID 0)
-- Dependencies: 264
-- Name: tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tags_id_seq', 75, true);


--
-- TOC entry 3512 (class 0 OID 0)
-- Dependencies: 266
-- Name: user_abstracts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_abstracts_id_seq', 27, true);


--
-- TOC entry 3513 (class 0 OID 0)
-- Dependencies: 269
-- Name: vacancies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vacancies_id_seq', 26, true);


--
-- TOC entry 3087 (class 2606 OID 20092)
-- Name: activities activities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_pkey PRIMARY KEY (id);


--
-- TOC entry 3089 (class 2606 OID 20094)
-- Name: activity_statuses activity_statuses_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_statuses
    ADD CONSTRAINT activity_statuses_name_key UNIQUE (name);


--
-- TOC entry 3091 (class 2606 OID 20096)
-- Name: activity_statuses activity_statuses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_statuses
    ADD CONSTRAINT activity_statuses_pkey PRIMARY KEY (id);


--
-- TOC entry 3093 (class 2606 OID 20098)
-- Name: activity_task_assignments activity_task_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_task_assignments
    ADD CONSTRAINT activity_task_assignments_pkey PRIMARY KEY (user_id, task_id);


--
-- TOC entry 3095 (class 2606 OID 20100)
-- Name: activity_task_statuses activity_task_statuses_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_task_statuses
    ADD CONSTRAINT activity_task_statuses_name_key UNIQUE (name);


--
-- TOC entry 3097 (class 2606 OID 20102)
-- Name: activity_task_statuses activity_task_statuses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_task_statuses
    ADD CONSTRAINT activity_task_statuses_pkey PRIMARY KEY (id);


--
-- TOC entry 3099 (class 2606 OID 20104)
-- Name: activity_tasks activity_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_tasks
    ADD CONSTRAINT activity_tasks_pkey PRIMARY KEY (id);


--
-- TOC entry 3101 (class 2606 OID 20106)
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- TOC entry 3103 (class 2606 OID 20108)
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- TOC entry 3105 (class 2606 OID 20110)
-- Name: cities cities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cities
    ADD CONSTRAINT cities_pkey PRIMARY KEY (id);


--
-- TOC entry 3107 (class 2606 OID 20112)
-- Name: contact_activities contact_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_activities
    ADD CONSTRAINT contact_activities_pkey PRIMARY KEY (id);


--
-- TOC entry 3109 (class 2606 OID 20114)
-- Name: contact_groups contact_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_groups
    ADD CONSTRAINT contact_groups_pkey PRIMARY KEY (id);


--
-- TOC entry 3111 (class 2606 OID 20116)
-- Name: contact_users contact_users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_users
    ADD CONSTRAINT contact_users_pkey PRIMARY KEY (id);


--
-- TOC entry 3113 (class 2606 OID 20118)
-- Name: contacts contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_pkey PRIMARY KEY (id);


--
-- TOC entry 3115 (class 2606 OID 20120)
-- Name: directions directions_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directions
    ADD CONSTRAINT directions_name_key UNIQUE (name);


--
-- TOC entry 3117 (class 2606 OID 20122)
-- Name: directions directions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directions
    ADD CONSTRAINT directions_pkey PRIMARY KEY (id);


--
-- TOC entry 3119 (class 2606 OID 20124)
-- Name: files files_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_name_key UNIQUE (name);


--
-- TOC entry 3121 (class 2606 OID 20126)
-- Name: files files_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (id);


--
-- TOC entry 3123 (class 2606 OID 20128)
-- Name: group_invites group_invites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_invites
    ADD CONSTRAINT group_invites_pkey PRIMARY KEY (group_id, user_id);


--
-- TOC entry 3125 (class 2606 OID 20130)
-- Name: group_roles group_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_roles
    ADD CONSTRAINT group_roles_pkey PRIMARY KEY (id);


--
-- TOC entry 3127 (class 2606 OID 20132)
-- Name: group_types group_types_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_types
    ADD CONSTRAINT group_types_name_key UNIQUE (name);


--
-- TOC entry 3129 (class 2606 OID 20134)
-- Name: group_types group_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_types
    ADD CONSTRAINT group_types_pkey PRIMARY KEY (id);


--
-- TOC entry 3131 (class 2606 OID 20136)
-- Name: group_users group_users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_users
    ADD CONSTRAINT group_users_pkey PRIMARY KEY (group_id, user_id);


--
-- TOC entry 3133 (class 2606 OID 20138)
-- Name: groups groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);


--
-- TOC entry 3135 (class 2606 OID 20140)
-- Name: groups groups_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_username_key UNIQUE (username);


--
-- TOC entry 3137 (class 2606 OID 20142)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- TOC entry 3139 (class 2606 OID 20144)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 3141 (class 2606 OID 20146)
-- Name: portfolio_types portfolio_types_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolio_types
    ADD CONSTRAINT portfolio_types_name_key UNIQUE (name);


--
-- TOC entry 3143 (class 2606 OID 20148)
-- Name: portfolio_types portfolio_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolio_types
    ADD CONSTRAINT portfolio_types_pkey PRIMARY KEY (id);


--
-- TOC entry 3145 (class 2606 OID 20150)
-- Name: portfolios portfolios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolios
    ADD CONSTRAINT portfolios_pkey PRIMARY KEY (id);


--
-- TOC entry 3147 (class 2606 OID 20152)
-- Name: post_likes post_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_likes
    ADD CONSTRAINT post_likes_pkey PRIMARY KEY (user_id, post_id);


--
-- TOC entry 3149 (class 2606 OID 20154)
-- Name: post_types post_types_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_types
    ADD CONSTRAINT post_types_name_key UNIQUE (name);


--
-- TOC entry 3151 (class 2606 OID 20156)
-- Name: post_types post_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_types
    ADD CONSTRAINT post_types_pkey PRIMARY KEY (id);


--
-- TOC entry 3153 (class 2606 OID 20158)
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- TOC entry 3155 (class 2606 OID 20160)
-- Name: regions regions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.regions
    ADD CONSTRAINT regions_pkey PRIMARY KEY (id);


--
-- TOC entry 3157 (class 2606 OID 20162)
-- Name: requests requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_pkey PRIMARY KEY (group_id, activity_id);


--
-- TOC entry 3159 (class 2606 OID 20164)
-- Name: requets_statuses requets_statuses_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requets_statuses
    ADD CONSTRAINT requets_statuses_name_key UNIQUE (name);


--
-- TOC entry 3161 (class 2606 OID 20166)
-- Name: requets_statuses requets_statuses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requets_statuses
    ADD CONSTRAINT requets_statuses_pkey PRIMARY KEY (id);


--
-- TOC entry 3163 (class 2606 OID 20168)
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- TOC entry 3165 (class 2606 OID 20170)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 3167 (class 2606 OID 20172)
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (subscriber_id, favorite_id);


--
-- TOC entry 3169 (class 2606 OID 20174)
-- Name: tag_activities tag_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag_activities
    ADD CONSTRAINT tag_activities_pkey PRIMARY KEY (tag_id, activity_id);


--
-- TOC entry 3171 (class 2606 OID 20176)
-- Name: tag_levels tag_levels_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag_levels
    ADD CONSTRAINT tag_levels_name_key UNIQUE (name);


--
-- TOC entry 3173 (class 2606 OID 20178)
-- Name: tag_levels tag_levels_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag_levels
    ADD CONSTRAINT tag_levels_pkey PRIMARY KEY (id);


--
-- TOC entry 3175 (class 2606 OID 20180)
-- Name: tag_portfolios tag_portfolios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag_portfolios
    ADD CONSTRAINT tag_portfolios_pkey PRIMARY KEY (tag_id, portfolio_id);


--
-- TOC entry 3177 (class 2606 OID 20182)
-- Name: tag_posts tag_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag_posts
    ADD CONSTRAINT tag_posts_pkey PRIMARY KEY (tag_id, post_id);


--
-- TOC entry 3179 (class 2606 OID 20184)
-- Name: tag_users tag_users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag_users
    ADD CONSTRAINT tag_users_pkey PRIMARY KEY (tag_id, user_id);


--
-- TOC entry 3181 (class 2606 OID 20186)
-- Name: tag_vacancies tag_vacancies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag_vacancies
    ADD CONSTRAINT tag_vacancies_pkey PRIMARY KEY (tag_id, vacancy_id);


--
-- TOC entry 3183 (class 2606 OID 20188)
-- Name: tags tags_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_name_key UNIQUE (name);


--
-- TOC entry 3185 (class 2606 OID 20190)
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- TOC entry 3187 (class 2606 OID 20192)
-- Name: user_abstracts user_abstracts_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_abstracts
    ADD CONSTRAINT user_abstracts_email_key UNIQUE (email);


--
-- TOC entry 3189 (class 2606 OID 20194)
-- Name: user_abstracts user_abstracts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_abstracts
    ADD CONSTRAINT user_abstracts_pkey PRIMARY KEY (id);


--
-- TOC entry 3191 (class 2606 OID 20196)
-- Name: user_abstracts user_abstracts_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_abstracts
    ADD CONSTRAINT user_abstracts_username_key UNIQUE (username);


--
-- TOC entry 3193 (class 2606 OID 20198)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3195 (class 2606 OID 20200)
-- Name: vacancies vacancies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vacancies
    ADD CONSTRAINT vacancies_pkey PRIMARY KEY (id);


--
-- TOC entry 3197 (class 2606 OID 20202)
-- Name: vacancy_users vacancy_users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vacancy_users
    ADD CONSTRAINT vacancy_users_pkey PRIMARY KEY (vacancy_id, user_id);


--
-- TOC entry 3198 (class 2606 OID 20203)
-- Name: activities activities_creater_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_creater_id_fkey FOREIGN KEY (creater_id) REFERENCES public.users(id);


--
-- TOC entry 3199 (class 2606 OID 20208)
-- Name: activities activities_direction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_direction_id_fkey FOREIGN KEY (direction_id) REFERENCES public.directions(id);


--
-- TOC entry 3200 (class 2606 OID 20213)
-- Name: activities activities_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id);


--
-- TOC entry 3201 (class 2606 OID 20218)
-- Name: activities activities_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.activity_statuses(id);


--
-- TOC entry 3202 (class 2606 OID 20223)
-- Name: activity_task_assignments activity_task_assignments_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_task_assignments
    ADD CONSTRAINT activity_task_assignments_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.activity_tasks(id);


--
-- TOC entry 3203 (class 2606 OID 20228)
-- Name: activity_task_assignments activity_task_assignments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_task_assignments
    ADD CONSTRAINT activity_task_assignments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3204 (class 2606 OID 20233)
-- Name: activity_tasks activity_tasks_activity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_tasks
    ADD CONSTRAINT activity_tasks_activity_id_fkey FOREIGN KEY (activity_id) REFERENCES public.activities(id);


--
-- TOC entry 3205 (class 2606 OID 20238)
-- Name: activity_tasks activity_tasks_creater_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_tasks
    ADD CONSTRAINT activity_tasks_creater_id_fkey FOREIGN KEY (creater_id) REFERENCES public.users(id);


--
-- TOC entry 3206 (class 2606 OID 20243)
-- Name: activity_tasks activity_tasks_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_tasks
    ADD CONSTRAINT activity_tasks_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.activity_task_statuses(id);


--
-- TOC entry 3207 (class 2606 OID 20248)
-- Name: admins admins_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_id_fkey FOREIGN KEY (id) REFERENCES public.user_abstracts(id);


--
-- TOC entry 3208 (class 2606 OID 20253)
-- Name: cities cities_region_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cities
    ADD CONSTRAINT cities_region_id_fkey FOREIGN KEY (region_id) REFERENCES public.regions(id);


--
-- TOC entry 3209 (class 2606 OID 20258)
-- Name: contact_activities contact_activities_activity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_activities
    ADD CONSTRAINT contact_activities_activity_id_fkey FOREIGN KEY (activity_id) REFERENCES public.activities(id);


--
-- TOC entry 3210 (class 2606 OID 20263)
-- Name: contact_activities contact_activities_contact_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_activities
    ADD CONSTRAINT contact_activities_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES public.contacts(id);


--
-- TOC entry 3211 (class 2606 OID 20268)
-- Name: contact_groups contact_groups_contact_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_groups
    ADD CONSTRAINT contact_groups_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES public.contacts(id);


--
-- TOC entry 3212 (class 2606 OID 20273)
-- Name: contact_groups contact_groups_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_groups
    ADD CONSTRAINT contact_groups_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id);


--
-- TOC entry 3213 (class 2606 OID 20278)
-- Name: contact_users contact_users_contact_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_users
    ADD CONSTRAINT contact_users_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES public.contacts(id);


--
-- TOC entry 3214 (class 2606 OID 20283)
-- Name: contact_users contact_users_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_users
    ADD CONSTRAINT contact_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3215 (class 2606 OID 20288)
-- Name: files files_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.user_abstracts(id);


--
-- TOC entry 3216 (class 2606 OID 20293)
-- Name: group_invites group_invites_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_invites
    ADD CONSTRAINT group_invites_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id);


--
-- TOC entry 3217 (class 2606 OID 20298)
-- Name: group_invites group_invites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_invites
    ADD CONSTRAINT group_invites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3218 (class 2606 OID 20303)
-- Name: group_roles group_roles_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_roles
    ADD CONSTRAINT group_roles_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id);


--
-- TOC entry 3219 (class 2606 OID 20308)
-- Name: group_users group_users_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_users
    ADD CONSTRAINT group_users_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id);


--
-- TOC entry 3220 (class 2606 OID 20313)
-- Name: group_users group_users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_users
    ADD CONSTRAINT group_users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.group_roles(id);


--
-- TOC entry 3221 (class 2606 OID 20318)
-- Name: group_users group_users_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_users
    ADD CONSTRAINT group_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3222 (class 2606 OID 20323)
-- Name: groups groups_creater_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_creater_id_fkey FOREIGN KEY (creater_id) REFERENCES public.users(id);


--
-- TOC entry 3223 (class 2606 OID 20328)
-- Name: groups groups_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_type_id_fkey FOREIGN KEY (type_id) REFERENCES public.group_types(id);


--
-- TOC entry 3224 (class 2606 OID 20333)
-- Name: messages messages_activity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_activity_id_fkey FOREIGN KEY (activity_id) REFERENCES public.activities(id);


--
-- TOC entry 3225 (class 2606 OID 20338)
-- Name: messages messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id);


--
-- TOC entry 3226 (class 2606 OID 20343)
-- Name: notifications notifications_user_abstract_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_abstract_id_fkey FOREIGN KEY (user_abstract_id) REFERENCES public.user_abstracts(id);


--
-- TOC entry 3227 (class 2606 OID 20348)
-- Name: portfolios portfolios_activity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolios
    ADD CONSTRAINT portfolios_activity_id_fkey FOREIGN KEY (activity_id) REFERENCES public.activities(id);


--
-- TOC entry 3228 (class 2606 OID 20353)
-- Name: portfolios portfolios_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolios
    ADD CONSTRAINT portfolios_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id);


--
-- TOC entry 3229 (class 2606 OID 20358)
-- Name: portfolios portfolios_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolios
    ADD CONSTRAINT portfolios_type_id_fkey FOREIGN KEY (type_id) REFERENCES public.portfolio_types(id);


--
-- TOC entry 3230 (class 2606 OID 20363)
-- Name: portfolios portfolios_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolios
    ADD CONSTRAINT portfolios_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3231 (class 2606 OID 20368)
-- Name: post_likes post_likes_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_likes
    ADD CONSTRAINT post_likes_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id);


--
-- TOC entry 3232 (class 2606 OID 20373)
-- Name: post_likes post_likes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_likes
    ADD CONSTRAINT post_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3233 (class 2606 OID 20378)
-- Name: posts posts_activity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_activity_id_fkey FOREIGN KEY (activity_id) REFERENCES public.activities(id);


--
-- TOC entry 3234 (class 2606 OID 20383)
-- Name: posts posts_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id);


--
-- TOC entry 3235 (class 2606 OID 20388)
-- Name: posts posts_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_type_id_fkey FOREIGN KEY (type_id) REFERENCES public.post_types(id);


--
-- TOC entry 3236 (class 2606 OID 20393)
-- Name: posts posts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3237 (class 2606 OID 20398)
-- Name: requests requests_activity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_activity_id_fkey FOREIGN KEY (activity_id) REFERENCES public.activities(id);


--
-- TOC entry 3238 (class 2606 OID 20403)
-- Name: requests requests_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id);


--
-- TOC entry 3239 (class 2606 OID 20408)
-- Name: requests requests_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.requets_statuses(id);


--
-- TOC entry 3240 (class 2606 OID 20413)
-- Name: subscriptions subscriptions_favorite_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_favorite_id_fkey FOREIGN KEY (favorite_id) REFERENCES public.users(id);


--
-- TOC entry 3241 (class 2606 OID 20418)
-- Name: subscriptions subscriptions_subscriber_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_subscriber_id_fkey FOREIGN KEY (subscriber_id) REFERENCES public.users(id);


--
-- TOC entry 3242 (class 2606 OID 20423)
-- Name: tag_activities tag_activities_activity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag_activities
    ADD CONSTRAINT tag_activities_activity_id_fkey FOREIGN KEY (activity_id) REFERENCES public.activities(id);


--
-- TOC entry 3243 (class 2606 OID 20428)
-- Name: tag_activities tag_activities_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag_activities
    ADD CONSTRAINT tag_activities_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id);


--
-- TOC entry 3244 (class 2606 OID 20433)
-- Name: tag_portfolios tag_portfolios_portfolio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag_portfolios
    ADD CONSTRAINT tag_portfolios_portfolio_id_fkey FOREIGN KEY (portfolio_id) REFERENCES public.portfolios(id);


--
-- TOC entry 3245 (class 2606 OID 20438)
-- Name: tag_portfolios tag_portfolios_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag_portfolios
    ADD CONSTRAINT tag_portfolios_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id);


--
-- TOC entry 3246 (class 2606 OID 20443)
-- Name: tag_posts tag_posts_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag_posts
    ADD CONSTRAINT tag_posts_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id);


--
-- TOC entry 3247 (class 2606 OID 20448)
-- Name: tag_posts tag_posts_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag_posts
    ADD CONSTRAINT tag_posts_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id);


--
-- TOC entry 3248 (class 2606 OID 20453)
-- Name: tag_users tag_users_level_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag_users
    ADD CONSTRAINT tag_users_level_id_fkey FOREIGN KEY (level_id) REFERENCES public.tag_levels(id);


--
-- TOC entry 3249 (class 2606 OID 20458)
-- Name: tag_users tag_users_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag_users
    ADD CONSTRAINT tag_users_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id);


--
-- TOC entry 3250 (class 2606 OID 20463)
-- Name: tag_users tag_users_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag_users
    ADD CONSTRAINT tag_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3251 (class 2606 OID 20468)
-- Name: tag_vacancies tag_vacancies_level_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag_vacancies
    ADD CONSTRAINT tag_vacancies_level_id_fkey FOREIGN KEY (level_id) REFERENCES public.tag_levels(id);


--
-- TOC entry 3252 (class 2606 OID 20473)
-- Name: tag_vacancies tag_vacancies_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag_vacancies
    ADD CONSTRAINT tag_vacancies_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id);


--
-- TOC entry 3253 (class 2606 OID 20478)
-- Name: tag_vacancies tag_vacancies_vacancy_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag_vacancies
    ADD CONSTRAINT tag_vacancies_vacancy_id_fkey FOREIGN KEY (vacancy_id) REFERENCES public.vacancies(id);


--
-- TOC entry 3254 (class 2606 OID 20483)
-- Name: user_abstracts user_abstracts_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_abstracts
    ADD CONSTRAINT user_abstracts_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- TOC entry 3255 (class 2606 OID 20488)
-- Name: users users_city_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_city_id_fkey FOREIGN KEY (city_id) REFERENCES public.cities(id);


--
-- TOC entry 3256 (class 2606 OID 20493)
-- Name: users users_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES public.user_abstracts(id);


--
-- TOC entry 3257 (class 2606 OID 20498)
-- Name: vacancies vacancies_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vacancies
    ADD CONSTRAINT vacancies_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id);


--
-- TOC entry 3258 (class 2606 OID 20503)
-- Name: vacancy_users vacancy_users_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vacancy_users
    ADD CONSTRAINT vacancy_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3259 (class 2606 OID 20508)
-- Name: vacancy_users vacancy_users_vacancy_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vacancy_users
    ADD CONSTRAINT vacancy_users_vacancy_id_fkey FOREIGN KEY (vacancy_id) REFERENCES public.vacancies(id);


-- Completed on 2024-06-04 12:25:53

--
-- PostgreSQL database dump complete
--

