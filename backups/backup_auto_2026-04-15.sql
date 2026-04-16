--
-- PostgreSQL database dump
--

\restrict iIg1H075YYbbsmPBNfUZS6zDbQV0X5b8O4TRlsS1kvO9LHPYehMqrzE5PXYHjSv

-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP EVENT TRIGGER IF EXISTS pgrst_drop_watch;
DROP EVENT TRIGGER IF EXISTS pgrst_ddl_watch;
DROP EVENT TRIGGER IF EXISTS issue_pg_net_access;
DROP EVENT TRIGGER IF EXISTS issue_pg_graphql_access;
DROP EVENT TRIGGER IF EXISTS issue_pg_cron_access;
DROP EVENT TRIGGER IF EXISTS issue_graphql_placeholder;
DROP PUBLICATION IF EXISTS supabase_realtime;
ALTER TABLE IF EXISTS ONLY storage.vector_indexes DROP CONSTRAINT IF EXISTS vector_indexes_bucket_id_fkey;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads_parts DROP CONSTRAINT IF EXISTS s3_multipart_uploads_parts_upload_id_fkey;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads_parts DROP CONSTRAINT IF EXISTS s3_multipart_uploads_parts_bucket_id_fkey;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads DROP CONSTRAINT IF EXISTS s3_multipart_uploads_bucket_id_fkey;
ALTER TABLE IF EXISTS ONLY storage.objects DROP CONSTRAINT IF EXISTS "objects_bucketId_fkey";
ALTER TABLE IF EXISTS ONLY public."WorkReport" DROP CONSTRAINT IF EXISTS "WorkReport_siteId_fkey";
ALTER TABLE IF EXISTS ONLY public."WorkReport" DROP CONSTRAINT IF EXISTS "WorkReport_serviceId_fkey";
ALTER TABLE IF EXISTS ONLY public."WorkReport" DROP CONSTRAINT IF EXISTS "WorkReport_clientId_fkey";
ALTER TABLE IF EXISTS ONLY public."TrainingRecord" DROP CONSTRAINT IF EXISTS "TrainingRecord_personId_fkey";
ALTER TABLE IF EXISTS ONLY public."TrainingRecord" DROP CONSTRAINT IF EXISTS "TrainingRecord_courseId_fkey";
ALTER TABLE IF EXISTS ONLY public."PracticeBillingStep" DROP CONSTRAINT IF EXISTS "PracticeBillingStep_practiceId_fkey";
ALTER TABLE IF EXISTS ONLY public."Person" DROP CONSTRAINT IF EXISTS "Person_clientId_fkey";
ALTER TABLE IF EXISTS ONLY public."PersonSite" DROP CONSTRAINT IF EXISTS "PersonSite_siteId_fkey";
ALTER TABLE IF EXISTS ONLY public."PersonSite" DROP CONSTRAINT IF EXISTS "PersonSite_personId_fkey";
ALTER TABLE IF EXISTS ONLY public."PersonClient" DROP CONSTRAINT IF EXISTS "PersonClient_personId_fkey";
ALTER TABLE IF EXISTS ONLY public."PersonClient" DROP CONSTRAINT IF EXISTS "PersonClient_clientId_fkey";
ALTER TABLE IF EXISTS ONLY public."MapPlanItem" DROP CONSTRAINT IF EXISTS "MapPlanItem_siteId_fkey";
ALTER TABLE IF EXISTS ONLY public."MapPlanItem" DROP CONSTRAINT IF EXISTS "MapPlanItem_clientServiceId_fkey";
ALTER TABLE IF EXISTS ONLY public."MapPlanItem" DROP CONSTRAINT IF EXISTS "MapPlanItem_clientId_fkey";
ALTER TABLE IF EXISTS ONLY public."ClinicalEngineeringCheck" DROP CONSTRAINT IF EXISTS "ClinicalEngineeringCheck_siteId_fkey";
ALTER TABLE IF EXISTS ONLY public."ClinicalEngineeringCheck" DROP CONSTRAINT IF EXISTS "ClinicalEngineeringCheck_clientId_fkey";
ALTER TABLE IF EXISTS ONLY public."ClientSite" DROP CONSTRAINT IF EXISTS "ClientSite_clientId_fkey";
ALTER TABLE IF EXISTS ONLY public."ClientService" DROP CONSTRAINT IF EXISTS "ClientService_siteId_fkey";
ALTER TABLE IF EXISTS ONLY public."ClientService" DROP CONSTRAINT IF EXISTS "ClientService_serviceId_fkey";
ALTER TABLE IF EXISTS ONLY public."ClientService" DROP CONSTRAINT IF EXISTS "ClientService_clientId_fkey";
ALTER TABLE IF EXISTS ONLY public."ClientPractice" DROP CONSTRAINT IF EXISTS "ClientPractice_clientId_fkey";
ALTER TABLE IF EXISTS ONLY public."ClientContact" DROP CONSTRAINT IF EXISTS "ClientContact_clientId_fkey";
ALTER TABLE IF EXISTS ONLY public."ClientContactMarketingList" DROP CONSTRAINT IF EXISTS "ClientContactMarketingList_marketingListId_fkey";
ALTER TABLE IF EXISTS ONLY public."ClientContactMarketingList" DROP CONSTRAINT IF EXISTS "ClientContactMarketingList_clientContactId_fkey";
ALTER TABLE IF EXISTS ONLY auth.webauthn_credentials DROP CONSTRAINT IF EXISTS webauthn_credentials_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.webauthn_challenges DROP CONSTRAINT IF EXISTS webauthn_challenges_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.sso_domains DROP CONSTRAINT IF EXISTS sso_domains_sso_provider_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.sessions DROP CONSTRAINT IF EXISTS sessions_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.sessions DROP CONSTRAINT IF EXISTS sessions_oauth_client_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.saml_relay_states DROP CONSTRAINT IF EXISTS saml_relay_states_sso_provider_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.saml_relay_states DROP CONSTRAINT IF EXISTS saml_relay_states_flow_state_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.saml_providers DROP CONSTRAINT IF EXISTS saml_providers_sso_provider_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_session_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.one_time_tokens DROP CONSTRAINT IF EXISTS one_time_tokens_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_consents DROP CONSTRAINT IF EXISTS oauth_consents_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_consents DROP CONSTRAINT IF EXISTS oauth_consents_client_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_authorizations DROP CONSTRAINT IF EXISTS oauth_authorizations_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_authorizations DROP CONSTRAINT IF EXISTS oauth_authorizations_client_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_factors DROP CONSTRAINT IF EXISTS mfa_factors_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_challenges DROP CONSTRAINT IF EXISTS mfa_challenges_auth_factor_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_amr_claims DROP CONSTRAINT IF EXISTS mfa_amr_claims_session_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.identities DROP CONSTRAINT IF EXISTS identities_user_id_fkey;
DROP TRIGGER IF EXISTS update_objects_updated_at ON storage.objects;
DROP TRIGGER IF EXISTS protect_objects_delete ON storage.objects;
DROP TRIGGER IF EXISTS protect_buckets_delete ON storage.buckets;
DROP TRIGGER IF EXISTS enforce_bucket_name_length_trigger ON storage.buckets;
DROP TRIGGER IF EXISTS tr_check_filters ON realtime.subscription;
DROP INDEX IF EXISTS storage.vector_indexes_name_bucket_id_idx;
DROP INDEX IF EXISTS storage.name_prefix_search;
DROP INDEX IF EXISTS storage.idx_objects_bucket_id_name_lower;
DROP INDEX IF EXISTS storage.idx_objects_bucket_id_name;
DROP INDEX IF EXISTS storage.idx_multipart_uploads_list;
DROP INDEX IF EXISTS storage.buckets_analytics_unique_name_idx;
DROP INDEX IF EXISTS storage.bucketid_objname;
DROP INDEX IF EXISTS storage.bname;
DROP INDEX IF EXISTS realtime.subscription_subscription_id_entity_filters_action_filter_key;
DROP INDEX IF EXISTS realtime.messages_inserted_at_topic_index;
DROP INDEX IF EXISTS realtime.ix_realtime_subscription_entity;
DROP INDEX IF EXISTS public."WorkReport_ym_idx";
DROP INDEX IF EXISTS public."WorkReport_workedAt_idx";
DROP INDEX IF EXISTS public."WorkReport_siteId_idx";
DROP INDEX IF EXISTS public."WorkReport_serviceId_idx";
DROP INDEX IF EXISTS public."WorkReport_clientId_idx";
DROP INDEX IF EXISTS public."User_email_key";
DROP INDEX IF EXISTS public."TrainingRecord_personId_idx";
DROP INDEX IF EXISTS public."TrainingRecord_personId_courseId_key";
DROP INDEX IF EXISTS public."TrainingRecord_fatturata_idx";
DROP INDEX IF EXISTS public."TrainingRecord_fatturataAt_idx";
DROP INDEX IF EXISTS public."TrainingRecord_dueDate_idx";
DROP INDEX IF EXISTS public."ServiceCatalog_name_key";
DROP INDEX IF EXISTS public."PracticeBillingStep_triggerStatus_idx";
DROP INDEX IF EXISTS public."PracticeBillingStep_sortOrder_idx";
DROP INDEX IF EXISTS public."PracticeBillingStep_practiceId_idx";
DROP INDEX IF EXISTS public."PracticeBillingStep_paidAt_idx";
DROP INDEX IF EXISTS public."PracticeBillingStep_invoiceDate_idx";
DROP INDEX IF EXISTS public."PracticeBillingStep_billingType_idx";
DROP INDEX IF EXISTS public."PracticeBillingStep_billingStatus_idx";
DROP INDEX IF EXISTS public."Person_lastName_firstName_idx";
DROP INDEX IF EXISTS public."Person_fiscalCode_key";
DROP INDEX IF EXISTS public."PersonSite_siteId_idx";
DROP INDEX IF EXISTS public."PersonSite_personId_siteId_key";
DROP INDEX IF EXISTS public."PersonSite_personId_idx";
DROP INDEX IF EXISTS public."PersonClient_personId_idx";
DROP INDEX IF EXISTS public."PersonClient_personId_clientId_key";
DROP INDEX IF EXISTS public."PersonClient_clientId_idx";
DROP INDEX IF EXISTS public."MarketingList_slug_key";
DROP INDEX IF EXISTS public."MarketingList_slug_idx";
DROP INDEX IF EXISTS public."MarketingList_name_key";
DROP INDEX IF EXISTS public."MarketingList_name_idx";
DROP INDEX IF EXISTS public."MarketingList_isActive_idx";
DROP INDEX IF EXISTS public."MapPlanItem_ym_idx";
DROP INDEX IF EXISTS public."MapPlanItem_ym_clientServiceId_key";
DROP INDEX IF EXISTS public."MapPlanItem_status_idx";
DROP INDEX IF EXISTS public."MapPlanItem_siteId_idx";
DROP INDEX IF EXISTS public."MapPlanItem_plannedDay_idx";
DROP INDEX IF EXISTS public."MapPlanItem_plannedDate_idx";
DROP INDEX IF EXISTS public."MapPlanItem_clientId_idx";
DROP INDEX IF EXISTS public."CourseCatalog_name_key";
DROP INDEX IF EXISTS public."ClinicalEngineeringCheck_tecnicoFatturatoAt_idx";
DROP INDEX IF EXISTS public."ClinicalEngineeringCheck_siteId_idx";
DROP INDEX IF EXISTS public."ClinicalEngineeringCheck_fatturataAt_idx";
DROP INDEX IF EXISTS public."ClinicalEngineeringCheck_dataProssimoAppuntamento_idx";
DROP INDEX IF EXISTS public."ClinicalEngineeringCheck_dataAppuntamentoPreso_idx";
DROP INDEX IF EXISTS public."ClinicalEngineeringCheck_clientId_idx";
DROP INDEX IF EXISTS public."Client_name_key";
DROP INDEX IF EXISTS public."ClientSite_clientId_name_key";
DROP INDEX IF EXISTS public."ClientSite_clientId_idx";
DROP INDEX IF EXISTS public."ClientService_source_idx";
DROP INDEX IF EXISTS public."ClientService_siteId_idx";
DROP INDEX IF EXISTS public."ClientService_referenteName_idx";
DROP INDEX IF EXISTS public."ClientService_dueDate_idx";
DROP INDEX IF EXISTS public."ClientService_clientId_idx";
DROP INDEX IF EXISTS public."ClientPractice_startYear_idx";
DROP INDEX IF EXISTS public."ClientPractice_practiceDate_idx";
DROP INDEX IF EXISTS public."ClientPractice_inApertureList_idx";
DROP INDEX IF EXISTS public."ClientPractice_fatturata_idx";
DROP INDEX IF EXISTS public."ClientPractice_fatturataAt_idx";
DROP INDEX IF EXISTS public."ClientPractice_clientId_idx";
DROP INDEX IF EXISTS public."ClientPractice_apertureStatus_idx";
DROP INDEX IF EXISTS public."ClientContact_role_idx";
DROP INDEX IF EXISTS public."ClientContact_marketingList_idx";
DROP INDEX IF EXISTS public."ClientContact_clientId_idx";
DROP INDEX IF EXISTS public."ClientContactMarketingList_marketingListId_idx";
DROP INDEX IF EXISTS public."ClientContactMarketingList_clientContactId_marketingListId_key";
DROP INDEX IF EXISTS public."ClientContactMarketingList_clientContactId_idx";
DROP INDEX IF EXISTS auth.webauthn_credentials_user_id_idx;
DROP INDEX IF EXISTS auth.webauthn_credentials_credential_id_key;
DROP INDEX IF EXISTS auth.webauthn_challenges_user_id_idx;
DROP INDEX IF EXISTS auth.webauthn_challenges_expires_at_idx;
DROP INDEX IF EXISTS auth.users_is_anonymous_idx;
DROP INDEX IF EXISTS auth.users_instance_id_idx;
DROP INDEX IF EXISTS auth.users_instance_id_email_idx;
DROP INDEX IF EXISTS auth.users_email_partial_key;
DROP INDEX IF EXISTS auth.user_id_created_at_idx;
DROP INDEX IF EXISTS auth.unique_phone_factor_per_user;
DROP INDEX IF EXISTS auth.sso_providers_resource_id_pattern_idx;
DROP INDEX IF EXISTS auth.sso_providers_resource_id_idx;
DROP INDEX IF EXISTS auth.sso_domains_sso_provider_id_idx;
DROP INDEX IF EXISTS auth.sso_domains_domain_idx;
DROP INDEX IF EXISTS auth.sessions_user_id_idx;
DROP INDEX IF EXISTS auth.sessions_oauth_client_id_idx;
DROP INDEX IF EXISTS auth.sessions_not_after_idx;
DROP INDEX IF EXISTS auth.saml_relay_states_sso_provider_id_idx;
DROP INDEX IF EXISTS auth.saml_relay_states_for_email_idx;
DROP INDEX IF EXISTS auth.saml_relay_states_created_at_idx;
DROP INDEX IF EXISTS auth.saml_providers_sso_provider_id_idx;
DROP INDEX IF EXISTS auth.refresh_tokens_updated_at_idx;
DROP INDEX IF EXISTS auth.refresh_tokens_session_id_revoked_idx;
DROP INDEX IF EXISTS auth.refresh_tokens_parent_idx;
DROP INDEX IF EXISTS auth.refresh_tokens_instance_id_user_id_idx;
DROP INDEX IF EXISTS auth.refresh_tokens_instance_id_idx;
DROP INDEX IF EXISTS auth.recovery_token_idx;
DROP INDEX IF EXISTS auth.reauthentication_token_idx;
DROP INDEX IF EXISTS auth.one_time_tokens_user_id_token_type_key;
DROP INDEX IF EXISTS auth.one_time_tokens_token_hash_hash_idx;
DROP INDEX IF EXISTS auth.one_time_tokens_relates_to_hash_idx;
DROP INDEX IF EXISTS auth.oauth_consents_user_order_idx;
DROP INDEX IF EXISTS auth.oauth_consents_active_user_client_idx;
DROP INDEX IF EXISTS auth.oauth_consents_active_client_idx;
DROP INDEX IF EXISTS auth.oauth_clients_deleted_at_idx;
DROP INDEX IF EXISTS auth.oauth_auth_pending_exp_idx;
DROP INDEX IF EXISTS auth.mfa_factors_user_id_idx;
DROP INDEX IF EXISTS auth.mfa_factors_user_friendly_name_unique;
DROP INDEX IF EXISTS auth.mfa_challenge_created_at_idx;
DROP INDEX IF EXISTS auth.idx_user_id_auth_method;
DROP INDEX IF EXISTS auth.idx_oauth_client_states_created_at;
DROP INDEX IF EXISTS auth.idx_auth_code;
DROP INDEX IF EXISTS auth.identities_user_id_idx;
DROP INDEX IF EXISTS auth.identities_email_idx;
DROP INDEX IF EXISTS auth.flow_state_created_at_idx;
DROP INDEX IF EXISTS auth.factor_id_created_at_idx;
DROP INDEX IF EXISTS auth.email_change_token_new_idx;
DROP INDEX IF EXISTS auth.email_change_token_current_idx;
DROP INDEX IF EXISTS auth.custom_oauth_providers_provider_type_idx;
DROP INDEX IF EXISTS auth.custom_oauth_providers_identifier_idx;
DROP INDEX IF EXISTS auth.custom_oauth_providers_enabled_idx;
DROP INDEX IF EXISTS auth.custom_oauth_providers_created_at_idx;
DROP INDEX IF EXISTS auth.confirmation_token_idx;
DROP INDEX IF EXISTS auth.audit_logs_instance_id_idx;
ALTER TABLE IF EXISTS ONLY storage.vector_indexes DROP CONSTRAINT IF EXISTS vector_indexes_pkey;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads DROP CONSTRAINT IF EXISTS s3_multipart_uploads_pkey;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads_parts DROP CONSTRAINT IF EXISTS s3_multipart_uploads_parts_pkey;
ALTER TABLE IF EXISTS ONLY storage.objects DROP CONSTRAINT IF EXISTS objects_pkey;
ALTER TABLE IF EXISTS ONLY storage.migrations DROP CONSTRAINT IF EXISTS migrations_pkey;
ALTER TABLE IF EXISTS ONLY storage.migrations DROP CONSTRAINT IF EXISTS migrations_name_key;
ALTER TABLE IF EXISTS ONLY storage.buckets_vectors DROP CONSTRAINT IF EXISTS buckets_vectors_pkey;
ALTER TABLE IF EXISTS ONLY storage.buckets DROP CONSTRAINT IF EXISTS buckets_pkey;
ALTER TABLE IF EXISTS ONLY storage.buckets_analytics DROP CONSTRAINT IF EXISTS buckets_analytics_pkey;
ALTER TABLE IF EXISTS ONLY realtime.schema_migrations DROP CONSTRAINT IF EXISTS schema_migrations_pkey;
ALTER TABLE IF EXISTS ONLY realtime.subscription DROP CONSTRAINT IF EXISTS pk_subscription;
ALTER TABLE IF EXISTS ONLY realtime.messages DROP CONSTRAINT IF EXISTS messages_pkey;
ALTER TABLE IF EXISTS ONLY public."WorkReport" DROP CONSTRAINT IF EXISTS "WorkReport_pkey";
ALTER TABLE IF EXISTS ONLY public."User" DROP CONSTRAINT IF EXISTS "User_pkey";
ALTER TABLE IF EXISTS ONLY public."TrainingRecord" DROP CONSTRAINT IF EXISTS "TrainingRecord_pkey";
ALTER TABLE IF EXISTS ONLY public."ServiceCatalog" DROP CONSTRAINT IF EXISTS "ServiceCatalog_pkey";
ALTER TABLE IF EXISTS ONLY public."PracticeBillingStep" DROP CONSTRAINT IF EXISTS "PracticeBillingStep_pkey";
ALTER TABLE IF EXISTS ONLY public."Person" DROP CONSTRAINT IF EXISTS "Person_pkey";
ALTER TABLE IF EXISTS ONLY public."PersonSite" DROP CONSTRAINT IF EXISTS "PersonSite_pkey";
ALTER TABLE IF EXISTS ONLY public."PersonClient" DROP CONSTRAINT IF EXISTS "PersonClient_pkey";
ALTER TABLE IF EXISTS ONLY public."MarketingList" DROP CONSTRAINT IF EXISTS "MarketingList_pkey";
ALTER TABLE IF EXISTS ONLY public."MapPlanItem" DROP CONSTRAINT IF EXISTS "MapPlanItem_pkey";
ALTER TABLE IF EXISTS ONLY public."CourseCatalog" DROP CONSTRAINT IF EXISTS "CourseCatalog_pkey";
ALTER TABLE IF EXISTS ONLY public."ClinicalEngineeringCheck" DROP CONSTRAINT IF EXISTS "ClinicalEngineeringCheck_pkey";
ALTER TABLE IF EXISTS ONLY public."Client" DROP CONSTRAINT IF EXISTS "Client_pkey";
ALTER TABLE IF EXISTS ONLY public."ClientSite" DROP CONSTRAINT IF EXISTS "ClientSite_pkey";
ALTER TABLE IF EXISTS ONLY public."ClientService" DROP CONSTRAINT IF EXISTS "ClientService_pkey";
ALTER TABLE IF EXISTS ONLY public."ClientPractice" DROP CONSTRAINT IF EXISTS "ClientPractice_pkey";
ALTER TABLE IF EXISTS ONLY public."ClientContact" DROP CONSTRAINT IF EXISTS "ClientContact_pkey";
ALTER TABLE IF EXISTS ONLY public."ClientContactMarketingList" DROP CONSTRAINT IF EXISTS "ClientContactMarketingList_pkey";
ALTER TABLE IF EXISTS ONLY auth.webauthn_credentials DROP CONSTRAINT IF EXISTS webauthn_credentials_pkey;
ALTER TABLE IF EXISTS ONLY auth.webauthn_challenges DROP CONSTRAINT IF EXISTS webauthn_challenges_pkey;
ALTER TABLE IF EXISTS ONLY auth.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY auth.users DROP CONSTRAINT IF EXISTS users_phone_key;
ALTER TABLE IF EXISTS ONLY auth.sso_providers DROP CONSTRAINT IF EXISTS sso_providers_pkey;
ALTER TABLE IF EXISTS ONLY auth.sso_domains DROP CONSTRAINT IF EXISTS sso_domains_pkey;
ALTER TABLE IF EXISTS ONLY auth.sessions DROP CONSTRAINT IF EXISTS sessions_pkey;
ALTER TABLE IF EXISTS ONLY auth.schema_migrations DROP CONSTRAINT IF EXISTS schema_migrations_pkey;
ALTER TABLE IF EXISTS ONLY auth.saml_relay_states DROP CONSTRAINT IF EXISTS saml_relay_states_pkey;
ALTER TABLE IF EXISTS ONLY auth.saml_providers DROP CONSTRAINT IF EXISTS saml_providers_pkey;
ALTER TABLE IF EXISTS ONLY auth.saml_providers DROP CONSTRAINT IF EXISTS saml_providers_entity_id_key;
ALTER TABLE IF EXISTS ONLY auth.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_token_unique;
ALTER TABLE IF EXISTS ONLY auth.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_pkey;
ALTER TABLE IF EXISTS ONLY auth.one_time_tokens DROP CONSTRAINT IF EXISTS one_time_tokens_pkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_consents DROP CONSTRAINT IF EXISTS oauth_consents_user_client_unique;
ALTER TABLE IF EXISTS ONLY auth.oauth_consents DROP CONSTRAINT IF EXISTS oauth_consents_pkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_clients DROP CONSTRAINT IF EXISTS oauth_clients_pkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_client_states DROP CONSTRAINT IF EXISTS oauth_client_states_pkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_authorizations DROP CONSTRAINT IF EXISTS oauth_authorizations_pkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_authorizations DROP CONSTRAINT IF EXISTS oauth_authorizations_authorization_id_key;
ALTER TABLE IF EXISTS ONLY auth.oauth_authorizations DROP CONSTRAINT IF EXISTS oauth_authorizations_authorization_code_key;
ALTER TABLE IF EXISTS ONLY auth.mfa_factors DROP CONSTRAINT IF EXISTS mfa_factors_pkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_factors DROP CONSTRAINT IF EXISTS mfa_factors_last_challenged_at_key;
ALTER TABLE IF EXISTS ONLY auth.mfa_challenges DROP CONSTRAINT IF EXISTS mfa_challenges_pkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_amr_claims DROP CONSTRAINT IF EXISTS mfa_amr_claims_session_id_authentication_method_pkey;
ALTER TABLE IF EXISTS ONLY auth.instances DROP CONSTRAINT IF EXISTS instances_pkey;
ALTER TABLE IF EXISTS ONLY auth.identities DROP CONSTRAINT IF EXISTS identities_provider_id_provider_unique;
ALTER TABLE IF EXISTS ONLY auth.identities DROP CONSTRAINT IF EXISTS identities_pkey;
ALTER TABLE IF EXISTS ONLY auth.flow_state DROP CONSTRAINT IF EXISTS flow_state_pkey;
ALTER TABLE IF EXISTS ONLY auth.custom_oauth_providers DROP CONSTRAINT IF EXISTS custom_oauth_providers_pkey;
ALTER TABLE IF EXISTS ONLY auth.custom_oauth_providers DROP CONSTRAINT IF EXISTS custom_oauth_providers_identifier_key;
ALTER TABLE IF EXISTS ONLY auth.audit_log_entries DROP CONSTRAINT IF EXISTS audit_log_entries_pkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_amr_claims DROP CONSTRAINT IF EXISTS amr_id_pk;
ALTER TABLE IF EXISTS auth.refresh_tokens ALTER COLUMN id DROP DEFAULT;
DROP TABLE IF EXISTS storage.vector_indexes;
DROP TABLE IF EXISTS storage.s3_multipart_uploads_parts;
DROP TABLE IF EXISTS storage.s3_multipart_uploads;
DROP TABLE IF EXISTS storage.objects;
DROP TABLE IF EXISTS storage.migrations;
DROP TABLE IF EXISTS storage.buckets_vectors;
DROP TABLE IF EXISTS storage.buckets_analytics;
DROP TABLE IF EXISTS storage.buckets;
DROP TABLE IF EXISTS realtime.subscription;
DROP TABLE IF EXISTS realtime.schema_migrations;
DROP TABLE IF EXISTS realtime.messages;
DROP TABLE IF EXISTS public."WorkReport";
DROP TABLE IF EXISTS public."User";
DROP TABLE IF EXISTS public."TrainingRecord";
DROP TABLE IF EXISTS public."ServiceCatalog";
DROP TABLE IF EXISTS public."PracticeBillingStep";
DROP TABLE IF EXISTS public."PersonSite";
DROP TABLE IF EXISTS public."PersonClient";
DROP TABLE IF EXISTS public."Person";
DROP TABLE IF EXISTS public."MarketingList";
DROP TABLE IF EXISTS public."MapPlanItem";
DROP TABLE IF EXISTS public."CourseCatalog";
DROP TABLE IF EXISTS public."ClinicalEngineeringCheck";
DROP TABLE IF EXISTS public."ClientSite";
DROP TABLE IF EXISTS public."ClientService";
DROP TABLE IF EXISTS public."ClientPractice";
DROP TABLE IF EXISTS public."ClientContactMarketingList";
DROP TABLE IF EXISTS public."ClientContact";
DROP TABLE IF EXISTS public."Client";
DROP TABLE IF EXISTS auth.webauthn_credentials;
DROP TABLE IF EXISTS auth.webauthn_challenges;
DROP TABLE IF EXISTS auth.users;
DROP TABLE IF EXISTS auth.sso_providers;
DROP TABLE IF EXISTS auth.sso_domains;
DROP TABLE IF EXISTS auth.sessions;
DROP TABLE IF EXISTS auth.schema_migrations;
DROP TABLE IF EXISTS auth.saml_relay_states;
DROP TABLE IF EXISTS auth.saml_providers;
DROP SEQUENCE IF EXISTS auth.refresh_tokens_id_seq;
DROP TABLE IF EXISTS auth.refresh_tokens;
DROP TABLE IF EXISTS auth.one_time_tokens;
DROP TABLE IF EXISTS auth.oauth_consents;
DROP TABLE IF EXISTS auth.oauth_clients;
DROP TABLE IF EXISTS auth.oauth_client_states;
DROP TABLE IF EXISTS auth.oauth_authorizations;
DROP TABLE IF EXISTS auth.mfa_factors;
DROP TABLE IF EXISTS auth.mfa_challenges;
DROP TABLE IF EXISTS auth.mfa_amr_claims;
DROP TABLE IF EXISTS auth.instances;
DROP TABLE IF EXISTS auth.identities;
DROP TABLE IF EXISTS auth.flow_state;
DROP TABLE IF EXISTS auth.custom_oauth_providers;
DROP TABLE IF EXISTS auth.audit_log_entries;
DROP FUNCTION IF EXISTS storage.update_updated_at_column();
DROP FUNCTION IF EXISTS storage.search_v2(prefix text, bucket_name text, limits integer, levels integer, start_after text, sort_order text, sort_column text, sort_column_after text);
DROP FUNCTION IF EXISTS storage.search_by_timestamp(p_prefix text, p_bucket_id text, p_limit integer, p_level integer, p_start_after text, p_sort_order text, p_sort_column text, p_sort_column_after text);
DROP FUNCTION IF EXISTS storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text);
DROP FUNCTION IF EXISTS storage.protect_delete();
DROP FUNCTION IF EXISTS storage.operation();
DROP FUNCTION IF EXISTS storage.list_objects_with_delimiter(_bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text, sort_order text);
DROP FUNCTION IF EXISTS storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text);
DROP FUNCTION IF EXISTS storage.get_size_by_bucket();
DROP FUNCTION IF EXISTS storage.get_common_prefix(p_key text, p_prefix text, p_delimiter text);
DROP FUNCTION IF EXISTS storage.foldername(name text);
DROP FUNCTION IF EXISTS storage.filename(name text);
DROP FUNCTION IF EXISTS storage.extension(name text);
DROP FUNCTION IF EXISTS storage.enforce_bucket_name_length();
DROP FUNCTION IF EXISTS storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb);
DROP FUNCTION IF EXISTS storage.allow_only_operation(expected_operation text);
DROP FUNCTION IF EXISTS storage.allow_any_operation(expected_operations text[]);
DROP FUNCTION IF EXISTS realtime.topic();
DROP FUNCTION IF EXISTS realtime.to_regrole(role_name text);
DROP FUNCTION IF EXISTS realtime.subscription_check_filters();
DROP FUNCTION IF EXISTS realtime.send(payload jsonb, event text, topic text, private boolean);
DROP FUNCTION IF EXISTS realtime.quote_wal2json(entity regclass);
DROP FUNCTION IF EXISTS realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer);
DROP FUNCTION IF EXISTS realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]);
DROP FUNCTION IF EXISTS realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text);
DROP FUNCTION IF EXISTS realtime."cast"(val text, type_ regtype);
DROP FUNCTION IF EXISTS realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]);
DROP FUNCTION IF EXISTS realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text);
DROP FUNCTION IF EXISTS realtime.apply_rls(wal jsonb, max_record_bytes integer);
DROP FUNCTION IF EXISTS pgbouncer.get_auth(p_usename text);
DROP FUNCTION IF EXISTS extensions.set_graphql_placeholder();
DROP FUNCTION IF EXISTS extensions.pgrst_drop_watch();
DROP FUNCTION IF EXISTS extensions.pgrst_ddl_watch();
DROP FUNCTION IF EXISTS extensions.grant_pg_net_access();
DROP FUNCTION IF EXISTS extensions.grant_pg_graphql_access();
DROP FUNCTION IF EXISTS extensions.grant_pg_cron_access();
DROP FUNCTION IF EXISTS auth.uid();
DROP FUNCTION IF EXISTS auth.role();
DROP FUNCTION IF EXISTS auth.jwt();
DROP FUNCTION IF EXISTS auth.email();
DROP TYPE IF EXISTS storage.buckettype;
DROP TYPE IF EXISTS realtime.wal_rls;
DROP TYPE IF EXISTS realtime.wal_column;
DROP TYPE IF EXISTS realtime.user_defined_filter;
DROP TYPE IF EXISTS realtime.equality_op;
DROP TYPE IF EXISTS realtime.action;
DROP TYPE IF EXISTS auth.one_time_token_type;
DROP TYPE IF EXISTS auth.oauth_response_type;
DROP TYPE IF EXISTS auth.oauth_registration_type;
DROP TYPE IF EXISTS auth.oauth_client_type;
DROP TYPE IF EXISTS auth.oauth_authorization_status;
DROP TYPE IF EXISTS auth.factor_type;
DROP TYPE IF EXISTS auth.factor_status;
DROP TYPE IF EXISTS auth.code_challenge_method;
DROP TYPE IF EXISTS auth.aal_level;
DROP EXTENSION IF EXISTS "uuid-ossp";
DROP EXTENSION IF EXISTS supabase_vault;
DROP EXTENSION IF EXISTS pgcrypto;
DROP EXTENSION IF EXISTS pg_stat_statements;
DROP EXTENSION IF EXISTS pg_graphql;
DROP SCHEMA IF EXISTS vault;
DROP SCHEMA IF EXISTS storage;
DROP SCHEMA IF EXISTS realtime;
DROP SCHEMA IF EXISTS pgbouncer;
DROP SCHEMA IF EXISTS graphql_public;
DROP SCHEMA IF EXISTS graphql;
DROP SCHEMA IF EXISTS extensions;
DROP SCHEMA IF EXISTS auth;
--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA auth;


--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA extensions;


--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA graphql;


--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA graphql_public;


--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA pgbouncer;


--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA realtime;


--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA storage;


--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA vault;


--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;


--
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


--
-- Name: oauth_authorization_status; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.oauth_authorization_status AS ENUM (
    'pending',
    'approved',
    'denied',
    'expired'
);


--
-- Name: oauth_client_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.oauth_client_type AS ENUM (
    'public',
    'confidential'
);


--
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.oauth_registration_type AS ENUM (
    'dynamic',
    'manual'
);


--
-- Name: oauth_response_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.oauth_response_type AS ENUM (
    'code'
);


--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


--
-- Name: action; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


--
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: -
--

CREATE TYPE storage.buckettype AS ENUM (
    'STANDARD',
    'ANALYTICS',
    'VECTOR'
);


--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: -
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $_$
  BEGIN
      RAISE DEBUG 'PgBouncer auth request: %', p_usename;

      RETURN QUERY
      SELECT
          rolname::text,
          CASE WHEN rolvaliduntil < now()
              THEN null
              ELSE rolpassword::text
          END
      FROM pg_authid
      WHERE rolname=$1 and rolcanlogin;
  END;
  $_$;


--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_
        -- Filter by action early - only get subscriptions interested in this action
        -- action_filter column can be: '*' (all), 'INSERT', 'UPDATE', or 'DELETE'
        and (subs.action_filter = '*' or subs.action_filter = action::text);

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
declare
  res jsonb;
begin
  if type_::text = 'bytea' then
    return to_jsonb(val);
  end if;
  execute format('select to_jsonb(%L::'|| type_::text || ')', val) into res;
  return res;
end
$$;


--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS TABLE(wal jsonb, is_rls_enabled boolean, subscription_ids uuid[], errors text[], slot_changes_count bigint)
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
  WITH pub AS (
    SELECT
      concat_ws(
        ',',
        CASE WHEN bool_or(pubinsert) THEN 'insert' ELSE NULL END,
        CASE WHEN bool_or(pubupdate) THEN 'update' ELSE NULL END,
        CASE WHEN bool_or(pubdelete) THEN 'delete' ELSE NULL END
      ) AS w2j_actions,
      coalesce(
        string_agg(
          realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
          ','
        ) filter (WHERE ppt.tablename IS NOT NULL AND ppt.tablename NOT LIKE '% %'),
        ''
      ) AS w2j_add_tables
    FROM pg_publication pp
    LEFT JOIN pg_publication_tables ppt ON pp.pubname = ppt.pubname
    WHERE pp.pubname = publication
    GROUP BY pp.pubname
    LIMIT 1
  ),
  -- MATERIALIZED ensures pg_logical_slot_get_changes is called exactly once
  w2j AS MATERIALIZED (
    SELECT x.*, pub.w2j_add_tables
    FROM pub,
         pg_logical_slot_get_changes(
           slot_name, null, max_changes,
           'include-pk', 'true',
           'include-transaction', 'false',
           'include-timestamp', 'true',
           'include-type-oids', 'true',
           'format-version', '2',
           'actions', pub.w2j_actions,
           'add-tables', pub.w2j_add_tables
         ) x
  ),
  -- Count raw slot entries before apply_rls/subscription filter
  slot_count AS (
    SELECT count(*)::bigint AS cnt
    FROM w2j
    WHERE w2j.w2j_add_tables <> ''
  ),
  -- Apply RLS and filter as before
  rls_filtered AS (
    SELECT xyz.wal, xyz.is_rls_enabled, xyz.subscription_ids, xyz.errors
    FROM w2j,
         realtime.apply_rls(
           wal := w2j.data::jsonb,
           max_record_bytes := max_record_bytes
         ) xyz(wal, is_rls_enabled, subscription_ids, errors)
    WHERE w2j.w2j_add_tables <> ''
      AND xyz.subscription_ids[1] IS NOT NULL
  )
  -- Real rows with slot count attached
  SELECT rf.wal, rf.is_rls_enabled, rf.subscription_ids, rf.errors, sc.cnt
  FROM rls_filtered rf, slot_count sc

  UNION ALL

  -- Sentinel row: always returned when no real rows exist so Elixir can
  -- always read slot_changes_count. Identified by wal IS NULL.
  SELECT null, null, null, null, sc.cnt
  FROM slot_count sc
  WHERE NOT EXISTS (SELECT 1 FROM rls_filtered)
$$;


--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  generated_id uuid;
  final_payload jsonb;
BEGIN
  BEGIN
    -- Generate a new UUID for the id
    generated_id := gen_random_uuid();

    -- Check if payload has an 'id' key, if not, add the generated UUID
    IF payload ? 'id' THEN
      final_payload := payload;
    ELSE
      final_payload := jsonb_set(payload, '{id}', to_jsonb(generated_id));
    END IF;

    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (id, payload, event, topic, private, extension)
    VALUES (generated_id, final_payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      RAISE WARNING 'ErrorSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


--
-- Name: allow_any_operation(text[]); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.allow_any_operation(expected_operations text[]) RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
  WITH current_operation AS (
    SELECT storage.operation() AS raw_operation
  ),
  normalized AS (
    SELECT CASE
      WHEN raw_operation LIKE 'storage.%' THEN substr(raw_operation, 9)
      ELSE raw_operation
    END AS current_operation
    FROM current_operation
  )
  SELECT EXISTS (
    SELECT 1
    FROM normalized n
    CROSS JOIN LATERAL unnest(expected_operations) AS expected_operation
    WHERE expected_operation IS NOT NULL
      AND expected_operation <> ''
      AND n.current_operation = CASE
        WHEN expected_operation LIKE 'storage.%' THEN substr(expected_operation, 9)
        ELSE expected_operation
      END
  );
$$;


--
-- Name: allow_only_operation(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.allow_only_operation(expected_operation text) RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
  WITH current_operation AS (
    SELECT storage.operation() AS raw_operation
  ),
  normalized AS (
    SELECT
      CASE
        WHEN raw_operation LIKE 'storage.%' THEN substr(raw_operation, 9)
        ELSE raw_operation
      END AS current_operation,
      CASE
        WHEN expected_operation LIKE 'storage.%' THEN substr(expected_operation, 9)
        ELSE expected_operation
      END AS requested_operation
    FROM current_operation
  )
  SELECT CASE
    WHEN requested_operation IS NULL OR requested_operation = '' THEN FALSE
    ELSE COALESCE(current_operation = requested_operation, FALSE)
  END
  FROM normalized;
$$;


--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


--
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.enforce_bucket_name_length() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
_filename text;
BEGIN
	select string_to_array(name, '/') into _parts;
	select _parts[array_length(_parts,1)] into _filename;
	-- @todo return the last part instead of 2
	return reverse(split_part(reverse(_filename), '.', 1));
END
$$;


--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[1:array_length(_parts,1)-1];
END
$$;


--
-- Name: get_common_prefix(text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_common_prefix(p_key text, p_prefix text, p_delimiter text) RETURNS text
    LANGUAGE sql IMMUTABLE
    AS $$
SELECT CASE
    WHEN position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)) > 0
    THEN left(p_key, length(p_prefix) + position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)))
    ELSE NULL
END;
$$;


--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::int) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.list_objects_with_delimiter(_bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;

    -- Configuration
    v_is_asc BOOLEAN;
    v_prefix TEXT;
    v_start TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_is_asc := lower(coalesce(sort_order, 'asc')) = 'asc';
    v_prefix := coalesce(prefix_param, '');
    v_start := CASE WHEN coalesce(next_token, '') <> '' THEN next_token ELSE coalesce(start_after, '') END;
    v_file_batch_size := LEAST(GREATEST(max_keys * 2, 100), 1000);

    -- Calculate upper bound for prefix filtering (bytewise, using COLLATE "C")
    IF v_prefix = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix, 1) = delimiter_param THEN
        v_upper_bound := left(v_prefix, -1) || chr(ascii(delimiter_param) + 1);
    ELSE
        v_upper_bound := left(v_prefix, -1) || chr(ascii(right(v_prefix, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'AND o.name COLLATE "C" < $3 ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'AND o.name COLLATE "C" >= $3 ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- ========================================================================
    -- SEEK INITIALIZATION: Determine starting position
    -- ========================================================================
    IF v_start = '' THEN
        IF v_is_asc THEN
            v_next_seek := v_prefix;
        ELSE
            -- DESC without cursor: find the last item in range
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;

            IF v_next_seek IS NOT NULL THEN
                v_next_seek := v_next_seek || delimiter_param;
            ELSE
                RETURN;
            END IF;
        END IF;
    ELSE
        -- Cursor provided: determine if it refers to a folder or leaf
        IF EXISTS (
            SELECT 1 FROM storage.objects o
            WHERE o.bucket_id = _bucket_id
              AND o.name COLLATE "C" LIKE v_start || delimiter_param || '%'
            LIMIT 1
        ) THEN
            -- Cursor refers to a folder
            IF v_is_asc THEN
                v_next_seek := v_start || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_start || delimiter_param;
            END IF;
        ELSE
            -- Cursor refers to a leaf object
            IF v_is_asc THEN
                v_next_seek := v_start || delimiter_param;
            ELSE
                v_next_seek := v_start;
            END IF;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= max_keys;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(v_peek_name, v_prefix, delimiter_param);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Emit and skip to next folder (no heap access needed)
            name := rtrim(v_common_prefix, delimiter_param);
            id := NULL;
            updated_at := NULL;
            created_at := NULL;
            last_accessed_at := NULL;
            metadata := NULL;
            RETURN NEXT;
            v_count := v_count + 1;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := left(v_common_prefix, -1) || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_common_prefix;
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query USING _bucket_id, v_next_seek,
                CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix) ELSE v_prefix END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(v_current.name, v_prefix, delimiter_param);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := v_current.name;
                    EXIT;
                END IF;

                -- Emit file
                name := v_current.name;
                id := v_current.id;
                updated_at := v_current.updated_at;
                created_at := v_current.created_at;
                last_accessed_at := v_current.last_accessed_at;
                metadata := v_current.metadata;
                RETURN NEXT;
                v_count := v_count + 1;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := v_current.name || delimiter_param;
                ELSE
                    v_next_seek := v_current.name;
                END IF;

                EXIT WHEN v_count >= max_keys;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


--
-- Name: protect_delete(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.protect_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Check if storage.allow_delete_query is set to 'true'
    IF COALESCE(current_setting('storage.allow_delete_query', true), 'false') != 'true' THEN
        RAISE EXCEPTION 'Direct deletion from storage tables is not allowed. Use the Storage API instead.'
            USING HINT = 'This prevents accidental data loss from orphaned objects.',
                  ERRCODE = '42501';
    END IF;
    RETURN NULL;
END;
$$;


--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;
    v_delimiter CONSTANT TEXT := '/';

    -- Configuration
    v_limit INT;
    v_prefix TEXT;
    v_prefix_lower TEXT;
    v_is_asc BOOLEAN;
    v_order_by TEXT;
    v_sort_order TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;
    v_skipped INT := 0;
BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_limit := LEAST(coalesce(limits, 100), 1500);
    v_prefix := coalesce(prefix, '') || coalesce(search, '');
    v_prefix_lower := lower(v_prefix);
    v_is_asc := lower(coalesce(sortorder, 'asc')) = 'asc';
    v_file_batch_size := LEAST(GREATEST(v_limit * 2, 100), 1000);

    -- Validate sort column
    CASE lower(coalesce(sortcolumn, 'name'))
        WHEN 'name' THEN v_order_by := 'name';
        WHEN 'updated_at' THEN v_order_by := 'updated_at';
        WHEN 'created_at' THEN v_order_by := 'created_at';
        WHEN 'last_accessed_at' THEN v_order_by := 'last_accessed_at';
        ELSE v_order_by := 'name';
    END CASE;

    v_sort_order := CASE WHEN v_is_asc THEN 'asc' ELSE 'desc' END;

    -- ========================================================================
    -- NON-NAME SORTING: Use path_tokens approach (unchanged)
    -- ========================================================================
    IF v_order_by != 'name' THEN
        RETURN QUERY EXECUTE format(
            $sql$
            WITH folders AS (
                SELECT path_tokens[$1] AS folder
                FROM storage.objects
                WHERE objects.name ILIKE $2 || '%%'
                  AND bucket_id = $3
                  AND array_length(objects.path_tokens, 1) <> $1
                GROUP BY folder
                ORDER BY folder %s
            )
            (SELECT folder AS "name",
                   NULL::uuid AS id,
                   NULL::timestamptz AS updated_at,
                   NULL::timestamptz AS created_at,
                   NULL::timestamptz AS last_accessed_at,
                   NULL::jsonb AS metadata FROM folders)
            UNION ALL
            (SELECT path_tokens[$1] AS "name",
                   id, updated_at, created_at, last_accessed_at, metadata
             FROM storage.objects
             WHERE objects.name ILIKE $2 || '%%'
               AND bucket_id = $3
               AND array_length(objects.path_tokens, 1) = $1
             ORDER BY %I %s)
            LIMIT $4 OFFSET $5
            $sql$, v_sort_order, v_order_by, v_sort_order
        ) USING levels, v_prefix, bucketname, v_limit, offsets;
        RETURN;
    END IF;

    -- ========================================================================
    -- NAME SORTING: Hybrid skip-scan with batch optimization
    -- ========================================================================

    -- Calculate upper bound for prefix filtering
    IF v_prefix_lower = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix_lower, 1) = v_delimiter THEN
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(v_delimiter) + 1);
    ELSE
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(right(v_prefix_lower, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'AND lower(o.name) COLLATE "C" < $3 ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'AND lower(o.name) COLLATE "C" >= $3 ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- Initialize seek position
    IF v_is_asc THEN
        v_next_seek := v_prefix_lower;
    ELSE
        -- DESC: find the last item in range first (static SQL)
        IF v_upper_bound IS NOT NULL THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower AND lower(o.name) COLLATE "C" < v_upper_bound
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSIF v_prefix_lower <> '' THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSE
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        END IF;

        IF v_peek_name IS NOT NULL THEN
            v_next_seek := lower(v_peek_name) || v_delimiter;
        ELSE
            RETURN;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= v_limit;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek AND lower(o.name) COLLATE "C" < v_upper_bound
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix_lower <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(lower(v_peek_name), v_prefix_lower, v_delimiter);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Handle offset, emit if needed, skip to next folder
            IF v_skipped < offsets THEN
                v_skipped := v_skipped + 1;
            ELSE
                name := split_part(rtrim(storage.get_common_prefix(v_peek_name, v_prefix, v_delimiter), v_delimiter), v_delimiter, levels);
                id := NULL;
                updated_at := NULL;
                created_at := NULL;
                last_accessed_at := NULL;
                metadata := NULL;
                RETURN NEXT;
                v_count := v_count + 1;
            END IF;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := lower(left(v_common_prefix, -1)) || chr(ascii(v_delimiter) + 1);
            ELSE
                v_next_seek := lower(v_common_prefix);
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix_lower is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query
                USING bucketname, v_next_seek,
                    CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix_lower) ELSE v_prefix_lower END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(lower(v_current.name), v_prefix_lower, v_delimiter);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := lower(v_current.name);
                    EXIT;
                END IF;

                -- Handle offset skipping
                IF v_skipped < offsets THEN
                    v_skipped := v_skipped + 1;
                ELSE
                    -- Emit file
                    name := split_part(v_current.name, v_delimiter, levels);
                    id := v_current.id;
                    updated_at := v_current.updated_at;
                    created_at := v_current.created_at;
                    last_accessed_at := v_current.last_accessed_at;
                    metadata := v_current.metadata;
                    RETURN NEXT;
                    v_count := v_count + 1;
                END IF;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := lower(v_current.name) || v_delimiter;
                ELSE
                    v_next_seek := lower(v_current.name);
                END IF;

                EXIT WHEN v_count >= v_limit;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


--
-- Name: search_by_timestamp(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search_by_timestamp(p_prefix text, p_bucket_id text, p_limit integer, p_level integer, p_start_after text, p_sort_order text, p_sort_column text, p_sort_column_after text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_cursor_op text;
    v_query text;
    v_prefix text;
BEGIN
    v_prefix := coalesce(p_prefix, '');

    IF p_sort_order = 'asc' THEN
        v_cursor_op := '>';
    ELSE
        v_cursor_op := '<';
    END IF;

    v_query := format($sql$
        WITH raw_objects AS (
            SELECT
                o.name AS obj_name,
                o.id AS obj_id,
                o.updated_at AS obj_updated_at,
                o.created_at AS obj_created_at,
                o.last_accessed_at AS obj_last_accessed_at,
                o.metadata AS obj_metadata,
                storage.get_common_prefix(o.name, $1, '/') AS common_prefix
            FROM storage.objects o
            WHERE o.bucket_id = $2
              AND o.name COLLATE "C" LIKE $1 || '%%'
        ),
        -- Aggregate common prefixes (folders)
        -- Both created_at and updated_at use MIN(obj_created_at) to match the old prefixes table behavior
        aggregated_prefixes AS (
            SELECT
                rtrim(common_prefix, '/') AS name,
                NULL::uuid AS id,
                MIN(obj_created_at) AS updated_at,
                MIN(obj_created_at) AS created_at,
                NULL::timestamptz AS last_accessed_at,
                NULL::jsonb AS metadata,
                TRUE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NOT NULL
            GROUP BY common_prefix
        ),
        leaf_objects AS (
            SELECT
                obj_name AS name,
                obj_id AS id,
                obj_updated_at AS updated_at,
                obj_created_at AS created_at,
                obj_last_accessed_at AS last_accessed_at,
                obj_metadata AS metadata,
                FALSE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NULL
        ),
        combined AS (
            SELECT * FROM aggregated_prefixes
            UNION ALL
            SELECT * FROM leaf_objects
        ),
        filtered AS (
            SELECT *
            FROM combined
            WHERE (
                $5 = ''
                OR ROW(
                    date_trunc('milliseconds', %I),
                    name COLLATE "C"
                ) %s ROW(
                    COALESCE(NULLIF($6, '')::timestamptz, 'epoch'::timestamptz),
                    $5
                )
            )
        )
        SELECT
            split_part(name, '/', $3) AS key,
            name,
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
        FROM filtered
        ORDER BY
            COALESCE(date_trunc('milliseconds', %I), 'epoch'::timestamptz) %s,
            name COLLATE "C" %s
        LIMIT $4
    $sql$,
        p_sort_column,
        v_cursor_op,
        p_sort_column,
        p_sort_order,
        p_sort_order
    );

    RETURN QUERY EXECUTE v_query
    USING v_prefix, p_bucket_id, p_level, p_limit, p_start_after, p_sort_column_after;
END;
$_$;


--
-- Name: search_v2(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text, sort_column text DEFAULT 'name'::text, sort_column_after text DEFAULT ''::text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $$
DECLARE
    v_sort_col text;
    v_sort_ord text;
    v_limit int;
BEGIN
    -- Cap limit to maximum of 1500 records
    v_limit := LEAST(coalesce(limits, 100), 1500);

    -- Validate and normalize sort_order
    v_sort_ord := lower(coalesce(sort_order, 'asc'));
    IF v_sort_ord NOT IN ('asc', 'desc') THEN
        v_sort_ord := 'asc';
    END IF;

    -- Validate and normalize sort_column
    v_sort_col := lower(coalesce(sort_column, 'name'));
    IF v_sort_col NOT IN ('name', 'updated_at', 'created_at') THEN
        v_sort_col := 'name';
    END IF;

    -- Route to appropriate implementation
    IF v_sort_col = 'name' THEN
        -- Use list_objects_with_delimiter for name sorting (most efficient: O(k * log n))
        RETURN QUERY
        SELECT
            split_part(l.name, '/', levels) AS key,
            l.name AS name,
            l.id,
            l.updated_at,
            l.created_at,
            l.last_accessed_at,
            l.metadata
        FROM storage.list_objects_with_delimiter(
            bucket_name,
            coalesce(prefix, ''),
            '/',
            v_limit,
            start_after,
            '',
            v_sort_ord
        ) l;
    ELSE
        -- Use aggregation approach for timestamp sorting
        -- Not efficient for large datasets but supports correct pagination
        RETURN QUERY SELECT * FROM storage.search_by_timestamp(
            prefix, bucket_name, v_limit, levels, start_after,
            v_sort_ord, v_sort_col, sort_column_after
        );
    END IF;
END;
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: custom_oauth_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.custom_oauth_providers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    provider_type text NOT NULL,
    identifier text NOT NULL,
    name text NOT NULL,
    client_id text NOT NULL,
    client_secret text NOT NULL,
    acceptable_client_ids text[] DEFAULT '{}'::text[] NOT NULL,
    scopes text[] DEFAULT '{}'::text[] NOT NULL,
    pkce_enabled boolean DEFAULT true NOT NULL,
    attribute_mapping jsonb DEFAULT '{}'::jsonb NOT NULL,
    authorization_params jsonb DEFAULT '{}'::jsonb NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    email_optional boolean DEFAULT false NOT NULL,
    issuer text,
    discovery_url text,
    skip_nonce_check boolean DEFAULT false NOT NULL,
    cached_discovery jsonb,
    discovery_cached_at timestamp with time zone,
    authorization_url text,
    token_url text,
    userinfo_url text,
    jwks_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT custom_oauth_providers_authorization_url_https CHECK (((authorization_url IS NULL) OR (authorization_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_authorization_url_length CHECK (((authorization_url IS NULL) OR (char_length(authorization_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_client_id_length CHECK (((char_length(client_id) >= 1) AND (char_length(client_id) <= 512))),
    CONSTRAINT custom_oauth_providers_discovery_url_length CHECK (((discovery_url IS NULL) OR (char_length(discovery_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_identifier_format CHECK ((identifier ~ '^[a-z0-9][a-z0-9:-]{0,48}[a-z0-9]$'::text)),
    CONSTRAINT custom_oauth_providers_issuer_length CHECK (((issuer IS NULL) OR ((char_length(issuer) >= 1) AND (char_length(issuer) <= 2048)))),
    CONSTRAINT custom_oauth_providers_jwks_uri_https CHECK (((jwks_uri IS NULL) OR (jwks_uri ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_jwks_uri_length CHECK (((jwks_uri IS NULL) OR (char_length(jwks_uri) <= 2048))),
    CONSTRAINT custom_oauth_providers_name_length CHECK (((char_length(name) >= 1) AND (char_length(name) <= 100))),
    CONSTRAINT custom_oauth_providers_oauth2_requires_endpoints CHECK (((provider_type <> 'oauth2'::text) OR ((authorization_url IS NOT NULL) AND (token_url IS NOT NULL) AND (userinfo_url IS NOT NULL)))),
    CONSTRAINT custom_oauth_providers_oidc_discovery_url_https CHECK (((provider_type <> 'oidc'::text) OR (discovery_url IS NULL) OR (discovery_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_oidc_issuer_https CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NULL) OR (issuer ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_oidc_requires_issuer CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NOT NULL))),
    CONSTRAINT custom_oauth_providers_provider_type_check CHECK ((provider_type = ANY (ARRAY['oauth2'::text, 'oidc'::text]))),
    CONSTRAINT custom_oauth_providers_token_url_https CHECK (((token_url IS NULL) OR (token_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_token_url_length CHECK (((token_url IS NULL) OR (char_length(token_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_userinfo_url_https CHECK (((userinfo_url IS NULL) OR (userinfo_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_userinfo_url_length CHECK (((userinfo_url IS NULL) OR (char_length(userinfo_url) <= 2048)))
);


--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text,
    code_challenge_method auth.code_challenge_method,
    code_challenge text,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone,
    invite_token text,
    referrer text,
    oauth_client_state_id uuid,
    linking_target_id uuid,
    email_optional boolean DEFAULT false NOT NULL
);


--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.flow_state IS 'Stores metadata for all OAuth/SSO login flows';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid,
    last_webauthn_challenge_data jsonb
);


--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: COLUMN mfa_factors.last_webauthn_challenge_data; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.mfa_factors.last_webauthn_challenge_data IS 'Stores the latest WebAuthn challenge data including attestation/assertion for customer verification';


--
-- Name: oauth_authorizations; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.oauth_authorizations (
    id uuid NOT NULL,
    authorization_id text NOT NULL,
    client_id uuid NOT NULL,
    user_id uuid,
    redirect_uri text NOT NULL,
    scope text NOT NULL,
    state text,
    resource text,
    code_challenge text,
    code_challenge_method auth.code_challenge_method,
    response_type auth.oauth_response_type DEFAULT 'code'::auth.oauth_response_type NOT NULL,
    status auth.oauth_authorization_status DEFAULT 'pending'::auth.oauth_authorization_status NOT NULL,
    authorization_code text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '00:03:00'::interval) NOT NULL,
    approved_at timestamp with time zone,
    nonce text,
    CONSTRAINT oauth_authorizations_authorization_code_length CHECK ((char_length(authorization_code) <= 255)),
    CONSTRAINT oauth_authorizations_code_challenge_length CHECK ((char_length(code_challenge) <= 128)),
    CONSTRAINT oauth_authorizations_expires_at_future CHECK ((expires_at > created_at)),
    CONSTRAINT oauth_authorizations_nonce_length CHECK ((char_length(nonce) <= 255)),
    CONSTRAINT oauth_authorizations_redirect_uri_length CHECK ((char_length(redirect_uri) <= 2048)),
    CONSTRAINT oauth_authorizations_resource_length CHECK ((char_length(resource) <= 2048)),
    CONSTRAINT oauth_authorizations_scope_length CHECK ((char_length(scope) <= 4096)),
    CONSTRAINT oauth_authorizations_state_length CHECK ((char_length(state) <= 4096))
);


--
-- Name: oauth_client_states; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.oauth_client_states (
    id uuid NOT NULL,
    provider_type text NOT NULL,
    code_verifier text,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: TABLE oauth_client_states; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.oauth_client_states IS 'Stores OAuth states for third-party provider authentication flows where Supabase acts as the OAuth client.';


--
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.oauth_clients (
    id uuid NOT NULL,
    client_secret_hash text,
    registration_type auth.oauth_registration_type NOT NULL,
    redirect_uris text NOT NULL,
    grant_types text NOT NULL,
    client_name text,
    client_uri text,
    logo_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    client_type auth.oauth_client_type DEFAULT 'confidential'::auth.oauth_client_type NOT NULL,
    token_endpoint_auth_method text NOT NULL,
    CONSTRAINT oauth_clients_client_name_length CHECK ((char_length(client_name) <= 1024)),
    CONSTRAINT oauth_clients_client_uri_length CHECK ((char_length(client_uri) <= 2048)),
    CONSTRAINT oauth_clients_logo_uri_length CHECK ((char_length(logo_uri) <= 2048)),
    CONSTRAINT oauth_clients_token_endpoint_auth_method_check CHECK ((token_endpoint_auth_method = ANY (ARRAY['client_secret_basic'::text, 'client_secret_post'::text, 'none'::text])))
);


--
-- Name: oauth_consents; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.oauth_consents (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    client_id uuid NOT NULL,
    scopes text NOT NULL,
    granted_at timestamp with time zone DEFAULT now() NOT NULL,
    revoked_at timestamp with time zone,
    CONSTRAINT oauth_consents_revoked_after_granted CHECK (((revoked_at IS NULL) OR (revoked_at >= granted_at))),
    CONSTRAINT oauth_consents_scopes_length CHECK ((char_length(scopes) <= 2048)),
    CONSTRAINT oauth_consents_scopes_not_empty CHECK ((char_length(TRIM(BOTH FROM scopes)) > 0))
);


--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: -
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: -
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text,
    oauth_client_id uuid,
    refresh_token_hmac_key text,
    refresh_token_counter bigint,
    scopes text,
    CONSTRAINT sessions_scopes_length CHECK ((char_length(scopes) <= 4096))
);


--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: COLUMN sessions.refresh_token_hmac_key; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sessions.refresh_token_hmac_key IS 'Holds a HMAC-SHA256 key used to sign refresh tokens for this session.';


--
-- Name: COLUMN sessions.refresh_token_counter; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sessions.refresh_token_counter IS 'Holds the ID (counter) of the last issued refresh token.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    disabled boolean,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: webauthn_challenges; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.webauthn_challenges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    challenge_type text NOT NULL,
    session_data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    CONSTRAINT webauthn_challenges_challenge_type_check CHECK ((challenge_type = ANY (ARRAY['signup'::text, 'registration'::text, 'authentication'::text])))
);


--
-- Name: webauthn_credentials; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.webauthn_credentials (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    credential_id bytea NOT NULL,
    public_key bytea NOT NULL,
    attestation_type text DEFAULT ''::text NOT NULL,
    aaguid uuid,
    sign_count bigint DEFAULT 0 NOT NULL,
    transports jsonb DEFAULT '[]'::jsonb NOT NULL,
    backup_eligible boolean DEFAULT false NOT NULL,
    backed_up boolean DEFAULT false NOT NULL,
    friendly_name text DEFAULT ''::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    last_used_at timestamp with time zone
);


--
-- Name: Client; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Client" (
    id text NOT NULL,
    name text NOT NULL,
    type text DEFAULT 'ALTRO'::text NOT NULL,
    status text DEFAULT 'ATTIVO'::text NOT NULL,
    "dismissedAt" timestamp(3) without time zone,
    "vatNumber" text,
    "uniqueCode" text,
    pec text,
    email text,
    phone text,
    address text,
    "legalSeat" text,
    "operativeSeat" text,
    "employeesCount" integer,
    notes text,
    "occupationalDoctorName" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: ClientContact; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ClientContact" (
    id text NOT NULL,
    "clientId" text NOT NULL,
    role text DEFAULT 'ALTRO'::text NOT NULL,
    "marketingList" text DEFAULT 'ALTRO'::text,
    name text NOT NULL,
    email text,
    phone text,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: ClientContactMarketingList; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ClientContactMarketingList" (
    id text NOT NULL,
    "clientContactId" text NOT NULL,
    "marketingListId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: ClientPractice; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ClientPractice" (
    id text NOT NULL,
    "clientId" text NOT NULL,
    title text NOT NULL,
    "practiceDate" timestamp(3) without time zone,
    "determinaNumber" text,
    "inApertureList" boolean DEFAULT false NOT NULL,
    "apertureStatus" text DEFAULT 'IN_ATTESA'::text,
    "startYear" integer,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "amountEur" numeric(65,30),
    fatturata boolean DEFAULT false NOT NULL,
    "fatturataAt" timestamp(3) without time zone
);


--
-- Name: ClientService; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ClientService" (
    id text NOT NULL,
    "clientId" text NOT NULL,
    "serviceId" text NOT NULL,
    "siteId" text,
    "rxEndoralCount" integer,
    "rxOptCount" integer,
    "dueDate" timestamp(3) without time zone,
    "lastDoneAt" timestamp(3) without time zone,
    "priceEur" numeric(65,30),
    periodicity text DEFAULT 'ANNUALE'::text NOT NULL,
    priority text DEFAULT 'MEDIA'::text NOT NULL,
    status text DEFAULT 'DA_FARE'::text NOT NULL,
    source text,
    "referenteName" text,
    "referentePerc" numeric(65,30),
    "alertMonths" integer DEFAULT 1 NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: ClientSite; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ClientSite" (
    id text NOT NULL,
    "clientId" text NOT NULL,
    name text NOT NULL,
    address text,
    city text,
    province text,
    cap text,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: ClinicalEngineeringCheck; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ClinicalEngineeringCheck" (
    id text NOT NULL,
    "clientId" text,
    "siteId" text,
    "nomeClienteSnapshot" text,
    "nomeSedeSnapshot" text,
    "indirizzoSedeSnapshot" text,
    "studioRifAmministrativo" text,
    "contattiMail" text,
    "contattiCellulare" text,
    "numApparecchiature" integer DEFAULT 0 NOT NULL,
    "apparecchiatureAggiuntive" integer DEFAULT 0 NOT NULL,
    "costoServizio" numeric(65,30) DEFAULT 0 NOT NULL,
    "quotaTecnicoPerc" numeric(65,30) DEFAULT 40 NOT NULL,
    "quotaTecnico" numeric(65,30) DEFAULT 0 NOT NULL,
    "importoTrasferta" numeric(65,30) DEFAULT 0 NOT NULL,
    periodicita text DEFAULT 'ANNUALE'::text NOT NULL,
    "dataUltimoAppuntamento" timestamp(3) without time zone,
    "dataAppuntamentoPreso" timestamp(3) without time zone,
    "dataProssimoAppuntamento" timestamp(3) without time zone,
    "verificheEseguite" boolean DEFAULT false NOT NULL,
    "fileSuDropbox" boolean DEFAULT false NOT NULL,
    fatturata boolean DEFAULT false NOT NULL,
    "fatturataAt" timestamp(3) without time zone,
    "tecnicoFatturato" boolean DEFAULT false NOT NULL,
    "tecnicoFatturatoAt" timestamp(3) without time zone,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: CourseCatalog; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."CourseCatalog" (
    id text NOT NULL,
    name text NOT NULL,
    category text,
    "defaultPriceEur" numeric(65,30),
    "isActive" boolean DEFAULT true NOT NULL
);


--
-- Name: MapPlanItem; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."MapPlanItem" (
    id text NOT NULL,
    ym text NOT NULL,
    "clientServiceId" text NOT NULL,
    "clientId" text NOT NULL,
    "siteId" text,
    "plannedDay" integer,
    "plannedDate" timestamp(3) without time zone,
    status text DEFAULT 'DA_FARE'::text NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: MarketingList; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."MarketingList" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    "isSystem" boolean DEFAULT false NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Person; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Person" (
    id text NOT NULL,
    "fiscalCode" text,
    "lastName" text NOT NULL,
    "firstName" text NOT NULL,
    email text,
    phone text,
    role text,
    "hireDate" timestamp(3) without time zone,
    "medicalCheckDone" boolean DEFAULT false NOT NULL,
    "clientId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: PersonClient; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PersonClient" (
    id text NOT NULL,
    "personId" text NOT NULL,
    "clientId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: PersonSite; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PersonSite" (
    id text NOT NULL,
    "personId" text NOT NULL,
    "siteId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: PracticeBillingStep; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PracticeBillingStep" (
    id text NOT NULL,
    "practiceId" text NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    label text NOT NULL,
    "billingType" text DEFAULT 'ALTRO'::text NOT NULL,
    "triggerStatus" text,
    "amountEur" numeric(65,30) DEFAULT 0 NOT NULL,
    "billingStatus" text DEFAULT 'DA_FATTURARE'::text NOT NULL,
    "invoiceNumber" text,
    "invoiceDate" timestamp(3) without time zone,
    "paidAt" timestamp(3) without time zone,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: ServiceCatalog; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ServiceCatalog" (
    id text NOT NULL,
    name text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL
);


--
-- Name: TrainingRecord; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TrainingRecord" (
    id text NOT NULL,
    "personId" text NOT NULL,
    "courseId" text NOT NULL,
    "performedAt" timestamp(3) without time zone,
    "dueDate" timestamp(3) without time zone,
    status text DEFAULT 'DA_FARE'::text NOT NULL,
    priority text DEFAULT 'MEDIA'::text NOT NULL,
    "priceEur" numeric(65,30),
    "alertMonths" integer DEFAULT 2 NOT NULL,
    "alertMonths2" integer DEFAULT 3 NOT NULL,
    "certificateDelivered" boolean DEFAULT false NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    fatturata boolean DEFAULT false NOT NULL,
    "fatturataAt" timestamp(3) without time zone
);


--
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    name text,
    role text DEFAULT 'admin'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: WorkReport; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."WorkReport" (
    id text NOT NULL,
    ym text NOT NULL,
    "clientId" text NOT NULL,
    "serviceId" text,
    "siteId" text,
    "amountEur" numeric(65,30),
    "workedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    action_filter text DEFAULT '*'::text,
    CONSTRAINT subscription_action_filter_check CHECK ((action_filter = ANY (ARRAY['*'::text, 'INSERT'::text, 'UPDATE'::text, 'DELETE'::text])))
);


--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: -
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text,
    type storage.buckettype DEFAULT 'STANDARD'::storage.buckettype NOT NULL
);


--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.buckets_analytics (
    name text NOT NULL,
    type storage.buckettype DEFAULT 'ANALYTICS'::storage.buckettype NOT NULL,
    format text DEFAULT 'ICEBERG'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: buckets_vectors; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.buckets_vectors (
    id text NOT NULL,
    type storage.buckettype DEFAULT 'VECTOR'::storage.buckettype NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: objects; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb
);


--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb,
    metadata jsonb
);


--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: vector_indexes; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.vector_indexes (
    id text DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    bucket_id text NOT NULL,
    data_type text NOT NULL,
    dimension integer NOT NULL,
    distance_metric text NOT NULL,
    metadata_configuration jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
\.


--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.custom_oauth_providers (id, provider_type, identifier, name, client_id, client_secret, acceptable_client_ids, scopes, pkce_enabled, attribute_mapping, authorization_params, enabled, email_optional, issuer, discovery_url, skip_nonce_check, cached_discovery, discovery_cached_at, authorization_url, token_url, userinfo_url, jwks_uri, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at, invite_token, referrer, oauth_client_state_id, linking_target_id, email_optional) FROM stdin;
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid, last_webauthn_challenge_data) FROM stdin;
\.


--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.oauth_authorizations (id, authorization_id, client_id, user_id, redirect_uri, scope, state, resource, code_challenge, code_challenge_method, response_type, status, authorization_code, created_at, expires_at, approved_at, nonce) FROM stdin;
\.


--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.oauth_client_states (id, provider_type, code_verifier, created_at) FROM stdin;
\.


--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.oauth_clients (id, client_secret_hash, registration_type, redirect_uris, grant_types, client_name, client_uri, logo_uri, created_at, updated_at, deleted_at, client_type, token_endpoint_auth_method) FROM stdin;
\.


--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.oauth_consents (id, user_id, client_id, scopes, granted_at, revoked_at) FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20250717082212
20250731150234
20250804100000
20250901200500
20250903112500
20250904133000
20250925093508
20251007112900
20251104100000
20251111201300
20251201000000
20260115000000
20260121000000
20260219120000
20260302000000
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag, oauth_client_id, refresh_token_hmac_key, refresh_token_counter, scopes) FROM stdin;
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at, disabled) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
\.


--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.webauthn_challenges (id, user_id, challenge_type, session_data, created_at, expires_at) FROM stdin;
\.


--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.webauthn_credentials (id, user_id, credential_id, public_key, attestation_type, aaguid, sign_count, transports, backup_eligible, backed_up, friendly_name, created_at, updated_at, last_used_at) FROM stdin;
\.


--
-- Data for Name: Client; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Client" (id, name, type, status, "dismissedAt", "vatNumber", "uniqueCode", pec, email, phone, address, "legalSeat", "operativeSeat", "employeesCount", notes, "occupationalDoctorName", "createdAt", "updatedAt") FROM stdin;
cmmdjfgx00000kd41ei21e3yl	marco amato	STUDIO_ODONT_447	ATTIVO	\N	\N	\N	\N	mar.amato85@gmail.com	3381149755	\N	\N	\N	\N	\N	\N	2026-03-05 14:05:16.26	2026-03-05 14:05:16.26
cmmf0m8j80002kwqkcyzviolg	giulio panichelli	AMBULATORIO_FKT	ATTIVO	\N	5468445	\N	a@pec.it	GIULIO@LIBERO.IT	10616565	\N	VIA PEPPO PEPPOLO	\N	3	\N	\N	2026-03-06 14:54:11.636	2026-03-10 16:06:15.949
cmmjawsgx0000h56epujvz067	PIFFERO MAGICO	STUDIO_ODONT_447	ATTIVO	\N	\N	\N	alabetaa@pec.it	mario@pietralicna.it	5349+9454	\N	\N	\N	\N	\N	\N	2026-03-09 14:53:24.898	2026-03-09 14:53:24.898
cmn3dffdp0000yfuydsiupw6i	PIERFERDINANDOLO GUGLIELMONI	AMBULATORIO_FKT	ATTIVO	\N	132151454545	MGJD4566SS	ASTO@PEC.IT	PIERPERGLIAMICI@PIER59	35698569	\N	VIA PERUGIA 46 ROMA	\N	\N	\N	\N	2026-03-23 15:59:17.149	2026-03-23 16:00:13.78
cmn4ow97s000087nynvwbazw9	ROSSIDENT SRL	AMBULATORIO_ODONTOIATRICO	ATTIVO	\N	1321514789	magf456s	rossipec@pec.it	rossident@gmail.com	321654987	\N	piazza bologna 1 roma	\N	2	\N	flavio briatore	2026-03-24 14:08:04.264	2026-03-24 14:09:25.164
cmn4qp917000m87nyfxr06yy6	AB.TA. MEDICA DI TADDEI CARLA & C. S.A.S.	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:36.667	2026-03-24 14:58:36.667
cmn4qp92d000r87nyycqokb6o	ABBONDANZA CLAUDIO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:36.709	2026-03-24 14:58:36.709
cmn4qp93b000w87nyi01g5cyb	AGOSTINACCHIO SILVANA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:36.744	2026-03-24 14:58:36.744
cmn4qp94c001187nypfgxxzy8	AGRESTI FRANCO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:36.781	2026-03-24 14:58:36.781
cmn4qp950001487nyakcqkmwu	AIELLO FRANCESCO - ROMA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:36.804	2026-03-24 14:58:36.804
cmn4qp962001987nyf70g5edi	ALONZO PIERPAOLO (ROMA)	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:36.842	2026-03-24 14:58:36.842
cmn4qp983001i87nyjgpuntll	ALONZO PIERPAOLO (MONTALTO)	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:36.916	2026-03-24 14:58:36.916
cmn4qp99f001p87nyadrr7ote	STUDIO ASSOCIATO DEI DOTTORI ALTAMURA - SBRICCOLI	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:36.964	2026-03-24 14:58:36.964
cmn4qp9cd001y87ny1ia9icss	ALTIERI VINCENZO - ROMA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:37.07	2026-03-24 14:58:37.07
cmn4qp9ec002787nyuobe98oi	AMATI ARIANNA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:37.141	2026-03-24 14:58:37.141
cmn4qp9fx002g87ny7fek9n3r	ARENA GILBERTO MARIA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:37.198	2026-03-24 14:58:37.198
cmn4qp9gt002l87ny7lc7sozr	ARINI LUCA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:37.23	2026-03-24 14:58:37.23
cmn4qp9ie002q87nyql6wxw2t	ARMIDA MATTEO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:37.287	2026-03-24 14:58:37.287
cmn4qp9j1002t87ny8f4ceae1	ARS MEDICA DI PIERANTOZZI F. E S. SNC - SANTA MARINELLA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:37.31	2026-03-24 14:58:37.31
cmn4qp9jo002w87nyn9pcihfj	ARS MEDICA DI PIERANTOZZI F. E S. SNC - CERVETERI	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:37.332	2026-03-24 14:58:37.332
cmn4qp9le003387ny8s0k5xf3	STUDIO BARBERINI STP A R.L.	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:37.394	2026-03-24 14:58:37.394
cmn4qp9pe003m87nyxy8ua22o	BARLATTANI ALBERTA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:37.539	2026-03-24 14:58:37.539
cmn4qp9qd003r87nyb47nk89r	BASTIANELLI DARIO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:37.573	2026-03-24 14:58:37.573
cmn4qp9sq004287nyi1hjfbx1	BE SMILE SRL	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:37.659	2026-03-24 14:58:37.659
cmn4qp9v8004f87nyxk60rtc7	BELELLI MASSIMO - FRASCATI	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:37.749	2026-03-24 14:58:37.749
cmn4qp9wt004m87nyajmyko2u	BIANCHI MARA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:37.805	2026-03-24 14:58:37.805
cmn4qp9y1004t87ny5p413gis	BIANCO PIERO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:37.85	2026-03-24 14:58:37.85
cmn4qp9yz004y87nyg0wzcwuk	BISEGNA RICCARDO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:37.884	2026-03-24 14:58:37.884
cmn4qpa1n005b87ny460s9svd	BORRACCINO LUCA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:37.98	2026-03-24 14:58:37.98
cmn4qpa2a005e87nyg4g1vneg	BOTTICELLI LUCIANO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:38.003	2026-03-24 14:58:38.003
cmn4qpa4b005n87ny6yeoc4q1	BRACAGLIA PATRIZIA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:38.075	2026-03-24 14:58:38.075
cmn4qpa50005q87ny6obeaj69	CAMEDDA FRANCESCO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:38.101	2026-03-24 14:58:38.101
cmn4qpa5n005t87nymwxj6oxn	CANTIERO ALESSANDRO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:38.124	2026-03-24 14:58:38.124
cmn4qpa6b005w87nywe962fap	CAPONE VALERIANO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:38.147	2026-03-24 14:58:38.147
cmn4qpa79006187nyi64lnseq	GIORGIO CASSABGI	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:38.182	2026-03-24 14:58:38.182
cmn4qpa89006687nytfostn9s	CAVALIERI CARLO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:38.218	2026-03-24 14:58:38.218
cmn4qpa8w006987nywr2j2nvm	CAVICCHIONI TIZIANA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:38.24	2026-03-24 14:58:38.24
cmn4qpa9y006e87nyd0chrv0w	CECCAIONI FABIO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:38.279	2026-03-24 14:58:38.279
cmn4qpadh006v87nyf943p4x9	CELI FELICE	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:38.406	2026-03-24 14:58:38.406
cmn4qpaf1007287nyzhp9beun	CERVELLI GIULIO - VIA AQUILA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:38.461	2026-03-24 14:58:38.461
cmn4qpag2007587nyi0x3s9ic	CHIARAVALLOTI ERNESTO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:38.498	2026-03-24 14:58:38.498
cmn4qpahz007c87ny4vh298fm	CIARAMELLA ANTONIO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:38.568	2026-03-24 14:58:38.568
cmn4qpajj007j87ny8qlc1w9t	CIMINI FRANCESCO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:38.623	2026-03-24 14:58:38.623
cmn4qpako007o87nyyk1h2v3n	COCCHI EUGENIA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:38.664	2026-03-24 14:58:38.664
cmn4qpalv007t87ny3igfa8kn	COCCO ALESSANDRO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:38.707	2026-03-24 14:58:38.707
cmn4qpams007y87nydzbxdptx	CONSOLI GIUSEPPE	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:38.741	2026-03-24 14:58:38.741
cmn4qpanh008187nyj6929ncm	COSMA ANDREA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:38.765	2026-03-24 14:58:38.765
cmn4qpao8008487nyw4fmyrfh	CRESTI LUISA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:38.792	2026-03-24 14:58:38.792
cmn4qpap7008987nymaryy6uf	D'ANTONI ANGELO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:38.827	2026-03-24 14:58:38.827
cmn4qparf008m87nygrmt72ia	DE CUNTIS ANTONIO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:38.907	2026-03-24 14:58:38.907
cmn4qpau3008z87nyq9qspvpr	DE CUNTIS ARMANDO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:39.003	2026-03-24 14:58:39.003
cmn4qpaus009287nyqwm4j256	DE FALCO ALFREDO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:39.029	2026-03-24 14:58:39.029
cmn4qpaw2009787nyq40ryzsn	DE STEFANO VINCENZINA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:39.074	2026-03-24 14:58:39.074
cmn4qpay7009e87nyud0981zw	DE VICO GIOVANNI	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:39.151	2026-03-24 14:58:39.151
cmn4qpazw009l87nyrgjavvqz	DEL VECCHIO BRUNO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:39.212	2026-03-24 14:58:39.212
cmn4qpb0j009o87ny1y5onkqg	DELL'AGNOLA ANTONELLA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:39.236	2026-03-24 14:58:39.236
cmn4qpb1g009r87ny4peqlbuz	DELL'AQUILA DANIELA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:39.268	2026-03-24 14:58:39.268
cmn4qpb37009y87ny2iqnmsjo	DEMELAS SALVATORE	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:39.332	2026-03-24 14:58:39.332
cmn4qpb4t00a387nyesq05so7	DENTALNOVA SRL - POVEROMO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:39.389	2026-03-24 14:58:39.389
cmn4qpb5j00a687ny72zy244v	DI GREGORIO DAVIDE ANTONIO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:39.415	2026-03-24 14:58:39.415
cmn4qpb6500a987nympq3o48y	DI PORTO PATRIZIA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:39.437	2026-03-24 14:58:39.437
cmn4qpb6r00ac87nyikckxo7o	DI STIO MICHELE	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:39.459	2026-03-24 14:58:39.459
cmn4qpb9b00an87nyzmp6922k	DIGITAL SMILE SOLUTIONS STP SRL	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:39.552	2026-03-24 14:58:39.552
cmn4qpb9y00aq87nywp60l0le	DUCA VALENTINO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:39.575	2026-03-24 14:58:39.575
cmn4qpbap00at87nyjxymme19	DURASTANTE SANTE	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:39.601	2026-03-24 14:58:39.601
cmn4qpbd700b287ny7rcudb61	ELLE SMILE S.R.L.	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:39.691	2026-03-24 14:58:39.691
cmn4qpbem00b987nyzajzlvu8	FANFARILLO VALERIO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:39.742	2026-03-24 14:58:39.742
cmn4qpbg000bg87ny1dj7tqmn	ODONTOIATRIA FAVETTI SRL	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:39.792	2026-03-24 14:58:39.792
cmn4qpbgp00bj87ny8dzuxnq1	ODONTOIATRIA FAVETTI CIAMPINO SRL	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:39.818	2026-03-24 14:58:39.818
cmn4qpbjp00by87nytymb1irr	FERRANTINI PAOLA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:39.925	2026-03-24 14:58:39.925
cmn4qpbkp00c187ny7kfeyvhd	FERRETTI FRANCESCA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:39.961	2026-03-24 14:58:39.961
cmn4qpblv00c487ny16v1rd6c	FIORI DANIELE - VIA DEI BRUNO, ROMA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:40.004	2026-03-24 14:58:40.004
cmn4qpbnn00cb87nyekv1sgvy	STUDIO DENTISTICO FORTE S.T.P. S.R.L.	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:40.068	2026-03-24 14:58:40.068
cmn4qpbpl00ci87nyzdmn5msm	IMBRIOSCIA NICOLA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:40.138	2026-03-24 14:58:40.138
cmn4qpbqm00cn87nyq6hssxz7	FRAIOLI PAOLA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:40.174	2026-03-24 14:58:40.174
cmn4qpbrc00cq87nyu9c1kbah	GABRIELE CLAUDIO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:40.201	2026-03-24 14:58:40.201
cmn4qpbsg00cv87ny3ubnix56	GALLETTI STEFANO - VIA FRATELLI BONNET	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:40.24	2026-03-24 14:58:40.24
cmn4qpbtk00d087nyk3zezz3j	GE.DI.CA. SRL	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:40.281	2026-03-24 14:58:40.281
cmn4qpbxn00dl87nytb9ojxv9	STUDIO GELLINI S.R.L.	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:40.428	2026-03-24 14:58:40.428
cmn4qpc0800dy87nylew79qol	DOTTOR G SRL	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:40.52	2026-03-24 14:58:40.52
cmn4qpc1t00e387nyggg4czzt	GENTILE GIANLUCA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:40.577	2026-03-24 14:58:40.577
cmn4qpc3k00e887ny9lwbzj7u	GENTILE NICOLINO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:40.641	2026-03-24 14:58:40.641
cmn4qpc5800ef87nyqe8uwix1	STUDIO ODONTOIATRICO ASSOCIATO GENTILINI - GENTILINI SERGIO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:40.7	2026-03-24 14:58:40.7
cmn4qpc7900em87ny8q3s5xa0	GIFUNI ELISABETTA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:40.773	2026-03-24 14:58:40.773
cmn4qpc8u00et87ny65jj2u6i	GIGLIO STP	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:40.831	2026-03-24 14:58:40.831
cmn4qpcaj00f087nymuvit3wi	GIOVANNELLI ANNA MARIA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:40.891	2026-03-24 14:58:40.891
cmn4qpcbi00f587nyt8zxbl9s	ASSOCIAZIONE PROFESSIONALE GIRELLI ALESSANDRELLI - VIA GIACOMO TREVIS	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:40.926	2026-03-24 14:58:40.926
cmn4qpccj00fa87nyvql299oq	GIRELLI MANUELA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:40.963	2026-03-24 14:58:40.963
cmn4qpcdd00fd87ny03tr5p3u	FRANCO GREZZI	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:40.993	2026-03-24 14:58:40.993
cmn4qpcfl00fo87ny7txaoyq3	GSMA SOCIETA' TRA PROFESSIONISTI SRL	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:41.073	2026-03-24 14:58:41.073
cmn4qpchp00fx87nyekfupy7u	IAQUANIELLO MARINA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:41.149	2026-03-24 14:58:41.149
cmn4qpcix00g287nyqzsi254r	IERFINO ANTONIO GENNARO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:41.193	2026-03-24 14:58:41.193
cmn4qpcjx00g787nyyw559obs	IOS ISTITUTO ODONTOIATRIA SOSTENIBILE	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:41.229	2026-03-24 14:58:41.229
cmn4qpckj00ga87nytee5hznh	LA LIFE SRLS	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:41.251	2026-03-24 14:58:41.251
cmn4qpclf00gd87nyne3c3cx6	LAPUCCI FLAVIO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:41.283	2026-03-24 14:58:41.283
cmn4qpcn200gk87ny9vulggzt	LETIZIA ANTONIO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:41.342	2026-03-24 14:58:41.342
cmn4qpco300gp87nyork2n5cw	LSO LAURI STUDI ODONTOIATRICI STP - ROMA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:41.379	2026-03-24 14:58:41.379
cmn4qpcql00h087nyx0zavzok	MADENT STP SRL	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:41.469	2026-03-24 14:58:41.469
cmn4qpcry00h587nyyu5y5xgf	SAMI SOLUTIONS STP	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:41.519	2026-03-24 14:58:41.519
cmn4qpcun00hg87nya2llmqac	MARCELLI BRUNO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:41.615	2026-03-24 14:58:41.615
cmn4qpcwe00hp87nybw7e95rf	MARINO MICHELANGELO - VIA VALERIO PUBBLICOLA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:41.678	2026-03-24 14:58:41.678
cmn4qpczk00i487ny1q0b7yow	MARINO MICHELANGELO - VIA DESERTO DEL GOBI	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:41.792	2026-03-24 14:58:41.792
cmn4qpd0k00i787nyzzrmnx6t	MARRAPODI VINCENZO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:41.828	2026-03-24 14:58:41.828
cmn4qpd1l00ic87ny7xbk8630	MARROCCO MATTEO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:41.865	2026-03-24 14:58:41.865
cmn4qpd2m00ih87nyaohm5uj0	MARTINO ALESSANDRA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:41.902	2026-03-24 14:58:41.902
cmn4qpd3m00ik87ny1cwoyp62	MAZZEI STP	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:41.938	2026-03-24 14:58:41.938
cmn4qpd4g00in87nyqijjgcb7	MEDICAL PROJECT	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:41.968	2026-03-24 14:58:41.968
cmn4qpd5f00is87nym19j0of6	MIGLIANO GIOVANNI	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:42.004	2026-03-24 14:58:42.004
cmn4qpd7o00j387nyiedv8bon	MIMMOCCHI FABIO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:42.085	2026-03-24 14:58:42.085
cmn4qpd9900j887nyy2ovuxav	MULE' PAOLO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:42.141	2026-03-24 14:58:42.141
cmn4qpd9w00jb87nydhvunt96	NARI GIACOMO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:42.165	2026-03-24 14:58:42.165
cmn4qpdax00jg87nyppslibvy	NUZZO CARLO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:42.202	2026-03-24 14:58:42.202
cmn4qpdd300jp87ny25xirjtd	ODONTOCAP	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:42.279	2026-03-24 14:58:42.279
cmn4qpdfk00jy87nyd0483yy1	ORSINI MEDICAL SRL	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:42.369	2026-03-24 14:58:42.369
cmn4qpdh200k387nyahp3rpip	STUDIO MEDICO ASSOCIATO ORTHOSURGERY	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:42.422	2026-03-24 14:58:42.422
cmn4qpdli00kk87nyk3c9swox	ORTHOKINESIS STP	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:42.583	2026-03-24 14:58:42.583
cmn4qpdok00kx87nycjrpj2i4	ORTOLANI-BONIFACIO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:42.692	2026-03-24 14:58:42.692
cmn4qpdqq00l687ny92ou2xfd	PACIFICI EDOARDO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:42.77	2026-03-24 14:58:42.77
cmn4qpdrk00l987nypnkmdo51	PALLANTE SARA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:42.8	2026-03-24 14:58:42.8
cmn4qpdt900le87ny8a1jaule	PALMA FRANCESCO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:42.861	2026-03-24 14:58:42.861
cmn4qpduf00lj87nyda7ysdin	PANELLA MASSIMO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:42.903	2026-03-24 14:58:42.903
cmn4qpdvr00lo87nyhl1lz4vd	PANTI FABRIZIO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:42.951	2026-03-24 14:58:42.951
cmn4qpdwr00lt87nyx6v3efhl	PASQUANTONIO GUIDO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:42.987	2026-03-24 14:58:42.987
cmn4qpdyz00m287nym9q3ej1a	PEDOTO FRANCESCA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:43.067	2026-03-24 14:58:43.067
cmn4qpe0700m787ny54lakfau	PELLECCHIA STUDIO ASSOCIATO ODONTOIATRICO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:43.111	2026-03-24 14:58:43.111
cmn4qpe0u00ma87ny9tn1861a	PERONDI ARRIGO (STUDIO ODONTOIATRICO)	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:43.134	2026-03-24 14:58:43.134
cmn4qpe2z00mj87nyt8n4zd5a	PERSIA GIANCARLO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:43.211	2026-03-24 14:58:43.211
cmn4qpe4a00mo87nyo1hl4137	PERUZZO FABRIZIO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:43.259	2026-03-24 14:58:43.259
cmn4qpe5i00mt87nylivrdy5n	AMBULATORIO ODONTOIATRICO SDP 1978 PIERMATTEI	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:43.302	2026-03-24 14:58:43.302
cmn4qpe7f00n087nymq4h2wv2	APRILE GIUSEPPE	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:43.371	2026-03-24 14:58:43.371
cmn4qpe8i00n587ny934u9zky	OVIDI SIMONA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:43.411	2026-03-24 14:58:43.411
cmn4qpe9r00na87nyi4t1dyhg	RUSTEMAJ RUDINA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:43.455	2026-03-24 14:58:43.455
cmn4qpebi00nh87nyba6f0t4i	SANTUCCI VINCENZO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:43.518	2026-03-24 14:58:43.518
cmn4qpecs00nm87nysstgsfzo	LOGHI STEFANO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:43.564	2026-03-24 14:58:43.564
cmn4qpee500nt87nyy3em1w4k	DE MARCHI FABIO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:43.613	2026-03-24 14:58:43.613
cmn4qpeev00nw87nyuc3feh2d	TEDESCHI GIULIA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:43.639	2026-03-24 14:58:43.639
cmn4qpegc00o387nyl4svxrm3	PRIMA2 DENTAL S.R.L.	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:43.692	2026-03-24 14:58:43.692
cmn4qpei500oc87nysmv7af3g	PROIETTI PIORGO ROBERTO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:43.757	2026-03-24 14:58:43.757
cmn4qpeir00of87nycli4tqi4	RICCI NINO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:43.78	2026-03-24 14:58:43.78
cmn4qpejf00oi87ny42qc4p4s	PAOLO RICCI STP	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:43.804	2026-03-24 14:58:43.804
cmn4qpen500p187nyi8bk7m6y	STUDIO ODONTOIATRICO DOTT. VALERIO RICCIARDI	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:43.937	2026-03-24 14:58:43.937
cmn4qpeo700p487nykbtpf071	ROCA MEDICA SRL	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:43.975	2026-03-24 14:58:43.975
cmn4qpeq800pb87nyu4hpt5u3	ROGALLA TATIANA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:44.048	2026-03-24 14:58:44.048
cmn4qperb00pe87nyfd5qummn	ASS. MEDICA ODONTOIATRICA DOTT. MARCELLO E RICCARDO ROSSI	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:44.087	2026-03-24 14:58:44.087
cmn4qpetk00pn87nyaftefac0	ROSSINI DENTAL SERVICE SRLS	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:44.168	2026-03-24 14:58:44.168
cmn4qpewb00q087nyt48ahmey	RUGO BARZANAI GIULIANA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:44.267	2026-03-24 14:58:44.267
cmn4qpexw00q587ny7kl0bubh	SABATINI STP A.R.L.	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:44.324	2026-03-24 14:58:44.324
cmn4qpez600qa87nykhmml9up	SABBATINI DAVIDE - FONTE NUOVA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:44.37	2026-03-24 14:58:44.37
cmn4qpf0r00qh87nywt9yc84z	SACCO LUIGI	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:44.427	2026-03-24 14:58:44.427
cmn4qpf2900qo87nyg43wwuq8	SALVATORI CINZIA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:44.482	2026-03-24 14:58:44.482
cmn4qpf3200qr87nym8b4yuri	SAMA DENTAL SRL	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:44.51	2026-03-24 14:58:44.51
cmn4qpf4900qw87nyoltpuv78	SAMA GUIDI SRL	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:44.553	2026-03-24 14:58:44.553
cmn4qpf6i00r587ny1fd2yl98	SARZI AMADE' DAVID	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:44.634	2026-03-24 14:58:44.634
cmn4qpf7y00ra87nygms5n2ve	SBRAGA MASSIMO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:44.687	2026-03-24 14:58:44.687
cmn4qpf9m00rh87nyim5py62z	STUDIO ODONTOIATRICO ASSOCIATO CAVALIERE SCIONTI	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:44.747	2026-03-24 14:58:44.747
cmn4qpfai00rk87nyy51f0l6b	SICA CLAUDIA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:44.778	2026-03-24 14:58:44.778
cmn4qpfbd00rn87ny7x6l01bw	PIRAS SILVESTRO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:44.809	2026-03-24 14:58:44.809
cmn4qpfd200rw87nyaph1bhvq	SMILING CENTRI ODONTOIATRICI	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:44.871	2026-03-24 14:58:44.871
cmn4qpfe000s187nyr8qry0es	SORRIDENTI S.R.L.	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:44.904	2026-03-24 14:58:44.904
cmn4qpff200s687nym78148kq	SPINETTI ALESSANDRA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:44.942	2026-03-24 14:58:44.942
cmn4qpfgr00sd87nyb1z8xk10	STUDIO UNO SRLS (SCARFO')	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:45.003	2026-03-24 14:58:45.003
cmn4qpfim00sk87nya4cyt3dn	2 ESSE SRL	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:45.071	2026-03-24 14:58:45.071
cmn4qpfk300sr87nyr8yt2fl1	TG DENTAL STP S.R.L. - FANFARILLO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:45.124	2026-03-24 14:58:45.124
cmn4qpfmu00t287nyc8qnoav1	THREE STARS MEDICAL SRL	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:45.222	2026-03-24 14:58:45.222
cmn4qpfof00t787nylifue82z	TIROCCHI FRANCESCA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:45.279	2026-03-24 14:58:45.279
cmn4qpfqt00te87nynripi5fx	TUCCI ALFONSO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:45.365	2026-03-24 14:58:45.365
cmn4qpfrq00tj87ny0qbev2vv	VIOLA MASSIMO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:45.398	2026-03-24 14:58:45.398
cmn4qpftr00ts87ny21tcjp1u	VISIODENT - VIOLA MASSIMO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:45.472	2026-03-24 14:58:45.472
cmn4qpfvd00tz87nym3uf7lir	VISODENT STUDIO ODONTOIATRICO ASSOCIATO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:45.529	2026-03-24 14:58:45.529
cmn4qpfwo00u687nya3iavox6	VOLPE STEFANO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:45.576	2026-03-24 14:58:45.576
cmn4qpfxl00ub87ny9242ts4q	WHITE CROSS SRL	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:45.609	2026-03-24 14:58:45.609
cmn4qpfyy00ug87nytcly50up	ALFEA DIAGNOSTICA CORSO TRIESTE SRL	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:45.658	2026-03-24 14:58:45.658
cmn4qpfzx00ul87nywa31usza	APPIA ANTICA FISIOHUB SRLS	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:45.693	2026-03-24 14:58:45.693
cmn4qpg0v00uq87nyblbf72pw	ANGELICO FISIO MEDICA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:45.727	2026-03-24 14:58:45.727
cmn4qpg1l00ut87nyo7hdy9w0	ANTINORI MONICA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:45.753	2026-03-24 14:58:45.753
cmn4qpg2600uw87ny7rw4azle	BALDUINA MEDICA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:45.774	2026-03-24 14:58:45.774
cmn4qpg2s00uz87ny6lvehx68	BELLEI VITTORIO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:45.796	2026-03-24 14:58:45.796
cmn4qpg3v00v287nyx5f79vbw	BOCCIA INES	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:45.835	2026-03-24 14:58:45.835
cmn4qpg5c00v787nyk0yzmkvn	BRECEVICH MAURIZIO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:45.888	2026-03-24 14:58:45.888
cmn4qpg6b00vc87nyvuaudjng	CALORI ALESSANDRO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:45.923	2026-03-24 14:58:45.923
cmn4qpg6z00vf87nydviyta0l	CATARINACCI STUDIO RADIOLOGICO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:45.947	2026-03-24 14:58:45.947
cmn4qpg7n00vi87nyif386z88	A&M S.R.L.S. - COLLALTI ALESSIO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:45.971	2026-03-24 14:58:45.971
cmn4qpg8y00vn87ny1lcsbnwb	SABATINI DENTALMED S.R.L.	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:46.018	2026-03-24 14:58:46.018
cmn4qpg9z00vq87nyhtn9ffnq	UNIVERSO DONNA SRLS	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:46.055	2026-03-24 14:58:46.055
cmn4qpgb700vv87nyuu8savb9	EFFEMEDICA SRL	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:46.099	2026-03-24 14:58:46.099
cmn4qpgbs00vy87ny8hvwvnz3	FEVIMEDICA SRLS	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:46.121	2026-03-24 14:58:46.121
cmn4qpgcm00w187nyq7q1yaii	FISIOMED SANSOVINI	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:46.151	2026-03-24 14:58:46.151
cmn4qpgdb00w487nydzd122j0	FISIOMED RETTAGLIATI	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:46.175	2026-03-24 14:58:46.175
cmn4qpge100w787nybrl484jj	FRASSICA S.R.L	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:46.201	2026-03-24 14:58:46.201
cmn4qpggk00wk87ny79izuai6	KINESIO MEDICAL LAB SRL	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:46.292	2026-03-24 14:58:46.292
cmn4qpghn00wp87nync4w3ep9	LA GRANDE BELLEZZA 2020 S.R.L	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:46.332	2026-03-24 14:58:46.332
cmn4qpgij00ws87nys2tjwxls	MAGNANTI GIUSEPPINA - OSTIA - VIA DELLE CARENE	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:46.364	2026-03-24 14:58:46.364
cmn4qpgj400wv87nyjvimsavu	MEDICAL SERVICE 88	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:46.384	2026-03-24 14:58:46.384
cmn4qpgks00x487nyd8yu9yqe	MEDIVIT	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:46.445	2026-03-24 14:58:46.445
cmn4qpgnd00xh87nyqiwnb0rn	MH FISIOMED STP	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:46.538	2026-03-24 14:58:46.538
cmn4qpgpm00xq87nyxlvviy20	MIRESSI MICHELE	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:46.618	2026-03-24 14:58:46.618
cmn4qpgql00xt87nyz4664sy6	P & F ADRIATICO S.R.L.	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:46.653	2026-03-24 14:58:46.653
cmn4qpgsj00y087ny92zblpr3	ANNA PICCIRILLO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:46.723	2026-03-24 14:58:46.723
cmn4qpgtg00y587nyyo084ul8	MARIA PICCIRILLO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:46.757	2026-03-24 14:58:46.757
cmn4qpgub00y887ny1lb24irf	GIOVANNI PICCIRILLO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:46.788	2026-03-24 14:58:46.788
cmn4qpgvm00yd87nyit794pny	GIUSEPPE PICCIRILLO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:46.834	2026-03-24 14:58:46.834
cmn4qpgwv00yi87nyrvvwad47	PISANI MEDICAL GROUP S.R.L.	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:46.879	2026-03-24 14:58:46.879
cmn4qpgyd00yp87ny9v1dusg0	MAGISTRI MAURO - ODONTOIATRA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:46.933	2026-03-24 14:58:46.933
cmn4qpgzj00yu87nykk5wio2i	ROTILI MAURIZIO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:46.975	2026-03-24 14:58:46.975
cmn4qph0p00yz87nybc20whcp	RI-ABILITARE S.R.L.	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:47.017	2026-03-24 14:58:47.017
cmn4qph2200z687ny73jooyrm	SANTARELLI SILVIA - CISTERNA DI LATINA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:47.067	2026-03-24 14:58:47.067
cmn4qph3200zb87ny2dtft3y2	ROSATO SRL (SATOR CUOCCI)	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:47.102	2026-03-24 14:58:47.102
cmn4qph3o00ze87nywpz3nnf7	SBRICCOLI FRANCA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:47.124	2026-03-24 14:58:47.124
cmn4qph4c00zh87nytbhcefja	SCIUTO CHANTAL	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:47.148	2026-03-24 14:58:47.148
cmn4qph5w00zq87nyo99ca0i2	RAR S.R.L.	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:47.204	2026-03-24 14:58:47.204
cmn4qph84010187nybc7hiq2o	FRI SPORTHEALTH S.R.L.	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:47.285	2026-03-24 14:58:47.285
cmn4qphbi010i87ny0rgb5bvc	I-PHYSIO S.R.L.	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:47.406	2026-03-24 14:58:47.406
cmn4qphcy010n87ny6ovc4w63	STV - SOCIETA' PER LA TUTELA DELLA VISIONE A R.L.	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:47.458	2026-03-24 14:58:47.458
cmn4qphfu010y87nyr361zexx	VENTUCCI ENZO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:47.562	2026-03-24 14:58:47.562
cmn4qphgi011187nywc25wfw7	ORTOPEDIA ZIMBILE S.R.L.	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:47.586	2026-03-24 14:58:47.586
cmn4qphnb011y87nyjfnr3u4x	APS TUSCHOLE	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:47.832	2026-03-24 14:58:47.832
cmn4qphp6012787nypy54y70q	CAF LAVORO E FISCO SRL	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:47.898	2026-03-24 14:58:47.898
cmn4qphqt012g87nyjfggdfwk	CANCUN SRL	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:47.957	2026-03-24 14:58:47.957
cmn4qphu8012x87nyltetrcwh	CHIARUCCI GIUFRIDO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:48.08	2026-03-24 14:58:48.08
cmn4qphvh013287nyvl8pctv1	ASS. PROF. CLINICA VETERINARIA FRASCATI DI RUGGERI E SOCI	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:48.126	2026-03-24 14:58:48.126
cmn4qphxo013b87nyr8ejoomv	DEL SIGNORE INGROSSO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:48.205	2026-03-24 14:58:48.205
cmn4qpi0b013k87nyb17szc52	DELMO DENTAL SRL	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:48.299	2026-03-24 14:58:48.299
cmn4qpi1d013p87nyn3bawhsv	DM COMMUNICATION	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:48.337	2026-03-24 14:58:48.337
cmn4qpi2b013u87nyee2mjo30	DST MEDICAL SRL - GAUDI	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:48.371	2026-03-24 14:58:48.371
cmn4qpi3b013z87nymfvz2juv	EUROTENDE SUD 2000 S.R.L.	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:48.407	2026-03-24 14:58:48.407
cmn4qpi5s014a87nyzdwmn58c	FARMACIA DEL POGGIO SRL (PERONDI - VIA CAVONE)	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:48.496	2026-03-24 14:58:48.496
cmn4qpi6r014f87ny6jys4bxb	FARMACIA DOTTORI PERONDI S.R.L. (VIA DELLO SPORT)	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:48.531	2026-03-24 14:58:48.531
cmn4qpi8y014q87nyqvvcsav2	ANDREOZZI CLAUDIA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:48.61	2026-03-24 14:58:48.61
cmn4qpii7015x87ny4tcyjuma	AIELLO FRANCESCO - GROSSETO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:48.944	2026-03-24 14:58:48.944
cmn4qpipm016w87nysd3pwtp3	ALTIERI VINCENZO - MARINO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:49.21	2026-03-24 14:58:49.21
cmn4qpiub017f87nylqtfrqfe	VISION OTTICA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:49.38	2026-03-24 14:58:49.38
cmn4qpiy8017u87nynfbhwteb	RETE ROMANA SALUS - OIS MEDICAL CENTER	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:49.521	2026-03-24 14:58:49.521
cmn4qpj0y018587nyeufe798s	DST MEDICAL SRL - OIS CORNELIA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:49.618	2026-03-24 14:58:49.618
cmn4qpj2n018e87nytwtv0yt7	DST MEDICAL SRL - OIS OSTIA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:49.679	2026-03-24 14:58:49.679
cmn4qpj6v018t87nyltv4s543	DST MEDICAL SRL - OIS SAN PAOLO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:49.832	2026-03-24 14:58:49.832
cmn4qpj8q019287nyluvawf2h	DST MEDICAL SRL - OIS PRIMAVERA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:49.898	2026-03-24 14:58:49.898
cmn4qpjiv01a987nyv70r6rgu	MASSINI GROUP SRL	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:50.263	2026-03-24 14:58:50.263
cmn4qpjo101aw87nyd2selny0	FIORI DANIELE - SANTA MARINELLA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:50.449	2026-03-24 14:58:50.449
cmn4qpjqs01b587ny4a3s87jg	SANTARELLI SILVIA - VELLETRI	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:50.549	2026-03-24 14:58:50.549
cmn4qpjtg01bg87nyuo47ipeb	DI BARI KATYA - ROMA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:50.644	2026-03-24 14:58:50.644
cmn4qpjvt01br87nysou5uqwm	MAGNANTI GIUSEPPINA - VIA FANANO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:50.73	2026-03-24 14:58:50.73
cmn4qpjzk01c687ny7du64l3h	BASILE-FABRIZI	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:50.864	2026-03-24 14:58:50.864
cmn4qpk1r01cf87nybejpp649	MARINO NICOLE	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:50.944	2026-03-24 14:58:50.944
cmn4qpk3d01cm87nyyqu2o7j5	BONFA' LUIGI	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:51.002	2026-03-24 14:58:51.002
cmn4qpk8h01d987nyulvd6jao	CAPOGNA MARCO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:51.186	2026-03-24 14:58:51.186
cmn4qpka901di87nyy9xykutt	CAPOGNA & D'AMORE	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:51.249	2026-03-24 14:58:51.249
cmn4qpkc401dp87nyuwn4scfz	PIERPAOLO PALATTELLA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:51.316	2026-03-24 14:58:51.316
cmn4qpkd501du87nyv850trrc	NISII FRANCESCO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:51.353	2026-03-24 14:58:51.353
cmn4qpkdt01dx87nyadcmy5rp	NORBERTO BERNA	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:51.377	2026-03-24 14:58:51.377
cmn4qpkfo01e487nyyoe21g8v	DAVIDE GENTILI	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:51.445	2026-03-24 14:58:51.445
cmn4qpkhr01ef87nybc9bgi6i	ANGELO LOVAGLIO	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:51.519	2026-03-24 14:58:51.519
cmn4qpkl801eu87nytakzct2g	DM DENTAL SRL	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:51.644	2026-03-24 14:58:51.644
cmn4qpkq101fh87nynipijhfx	LUIGI FRANCHI	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:51.817	2026-03-24 14:58:51.817
cmn4qpkt001fw87nyp8ag44d6	STUDIO RADICCI STP	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:58:51.925	2026-03-24 14:58:51.925
cmn4qqaqy02b787nyoqi0zfic	PANICHELLI HSC	ALTRO	ATTIVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-24 14:59:25.546	2026-03-24 14:59:25.546
cmn5uufc3053c87nyoe7qrt8x	Marta macchia	STUDIO_ODONT_447	ATTIVO	\N	\N	\N	a@pec.it	marta@libero.it	321564789	\N	\N	\N	\N	\N	\N	2026-03-25 09:42:22.755	2026-03-25 09:42:53.728
cmn935w9a000010umdk5vv1f3	marta srl	AMBULATORIO_FKT	ATTIVO	\N	\N	\N	a@pec.it	mar.amato85@gmail.com	3381149755	\N	\N	\N	\N	\N	\N	2026-03-27 15:58:32.898	2026-03-27 15:58:32.898
cmnhbyg430000d5b171ao4nrk	marco amato 2	STUDIO_ODONTOIATRICO	ATTIVO	\N	\N	\N	alabetaa@pec.it	mar.amato85@gmail.com	3381149755	\N	\N	\N	\N	\N	\N	2026-04-02 10:26:51.748	2026-04-02 10:26:51.748
cmnydu0dx0000t2oxhfbr6ysd	AMATO MARCO 3	AMBULATORIO_ODONTOIATRICO	ATTIVO	\N	\N	\N	giulio@pec.it	asd@lasdjjkasd	3214569669	\N	\N	\N	\N	\N	Flavietto Briatore	2026-04-14 08:51:28.934	2026-04-14 08:51:28.934
\.


--
-- Data for Name: ClientContact; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ClientContact" (id, "clientId", role, "marketingList", name, email, phone, notes, "createdAt", "updatedAt") FROM stdin;
cmmj9tzxq000365jcd28artde	cmmf0m8j80002kwqkcyzviolg	TITOLARE	ALTRO	GIULIO PANICHELLI	GIULIOPANICHELLI@PANICO.IT	35268566	\N	2026-03-09 14:23:14.991	2026-03-10 16:06:15.962
cmmjay06r0004h56e6eaafkts	cmmjawsgx0000h56epujvz067	TITOLARE	MEDICI	mario pasquino	mario@libero.it	351224423	\N	2026-03-09 14:54:21.555	2026-03-24 14:25:31.559
cmmm4m63l000310jt2rx2qju3	cmmjawsgx0000h56epujvz067	ASO	ASO	gennarino esposito	mar.amato85@gmail.com	3381149755	\N	2026-03-11 14:20:30.178	2026-03-24 14:24:38.886
cmmnc7am500039la0vpab2raf	cmmdjfgx00000kd41ei21e3yl	TITOLARE	ALTRO	marco amato	mar.amato85@gmail.com	3381149755	\N	2026-03-12 10:40:39.293	2026-03-12 10:40:39.293
cmmnmru3l000111tc9r29cpdp	cmmf0m8j80002kwqkcyzviolg	ASO	ALTRO	giulio panichelli	\N	\N	\N	2026-03-12 15:36:33.825	2026-03-12 15:36:33.825
cmn3dgn350002yfuyvpvo7r8q	cmn3dffdp0000yfuydsiupw6i	TITOLARE	MEDICI	PIERALDO PERALDONI	SDDDA@GMAIL.COM	35698547	\N	2026-03-23 16:00:13.793	2026-03-23 16:01:29.044
cmn4oxznc000287nyyve9h3we	cmn4ow97s000087nynvwbazw9	LEGALE_RAPPRESENTANTE	ALTRO	Luigi Rossi	luigiross@gmail.com	3214569658	\N	2026-03-24 14:09:25.177	2026-03-24 14:09:25.177
cmn5uv38t053e87nyzxkezwj9	cmn5uufc3053c87nyoe7qrt8x	TITOLARE	MEDICI	marta macchia	marta@gmail.com	\N	\N	2026-03-25 09:42:53.742	2026-03-25 09:43:27.65
cmn935w9a000110umfmivfdkz	cmn935w9a000010umdk5vv1f3	TITOLARE	MEDICI	marco amato	mar.amato85@gmail.com	3381149755	\N	2026-03-27 15:58:32.898	2026-03-27 15:58:32.898
cmnhbyg430001d5b1p0umxzw2	cmnhbyg430000d5b171ao4nrk	TITOLARE	MEDICI, RADIOPROTEZIONE	marco amato	mar.amato85@gmail.com	3381149755	\N	2026-04-02 10:26:51.748	2026-04-03 09:28:13.731
cmnix8lgh00013zu3ixmx5jes	cmnhbyg430000d5b171ao4nrk	TITOLARE	MEDICI, RADIOPROTEZIONE	mario favino	favino@picoloino.it	324145566+	\N	2026-04-03 13:10:23.343	2026-04-03 13:53:20.573
cmnx842tn0006gtexka1674xh	cmmdjfgx00000kd41ei21e3yl	ASO	ASO	P Melissa	melissafragolina89@gmail.org	36936963969	Aggiornato automaticamente da Persona • Mansione: ASO	2026-04-13 13:23:34.067	2026-04-13 13:23:34.067
cmnxbaxai0006pj0ta5yiwve4	cmnhbyg430000d5b171ao4nrk	ASO	ASO	Paolani Poalo	mail@mail	5625632	Creato automaticamente da Persona • Mansione: aso	2026-04-13 14:52:52.739	2026-04-13 14:52:52.739
cmnydu0dx0001t2oxzerghrok	cmnydu0dx0000t2oxhfbr6ysd	ALTRO	ASO	GIOVANNI MUCCIACCIA	puiolo@piuolo	322145662356	\N	2026-04-14 08:51:28.934	2026-04-14 08:51:28.934
\.


--
-- Data for Name: ClientContactMarketingList; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ClientContactMarketingList" (id, "clientContactId", "marketingListId", "createdAt") FROM stdin;
\.


--
-- Data for Name: ClientPractice; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ClientPractice" (id, "clientId", title, "practiceDate", "determinaNumber", "inApertureList", "apertureStatus", "startYear", notes, "createdAt", "updatedAt", "amountEur", fatturata, "fatturataAt") FROM stdin;
cmmncl2wp00079la0fbxlj68z	cmmf0m8j80002kwqkcyzviolg	invio in regione	2026-03-22 00:00:00	g04568	f	IN_ATTESA	\N	\N	2026-03-12 10:51:22.49	2026-03-12 10:51:22.49	\N	f	\N
cmmoyllie0001ww3amn597qye	cmmjawsgx0000h56epujvz067	Apertura ambulatorio	2026-03-13 00:00:00	g04568	t	IN_ATTESA	2026	\N	2026-03-13 13:55:24.326	2026-03-18 15:31:59.695	\N	f	\N
cmn5urpil053b87ny3ve6kg7e	cmn4qp92d000r87nyycqokb6o	aeprtura studio odontoiatrico	2026-03-25 00:00:00	\N	t	IN_ATTESA	\N	--- ECONOMICA_JSON ---\n{"costoPraticaEur":5000,"accontoEur":1000,"accontoDate":"2026-03-25T00:00:00.000Z","accontoYear":2026,"accontoNotes":null,"saldoEur":null,"saldoDate":null,"saldoYear":null,"saldoNotes":null,"paymentRows":[]}\n--- FINE ECONOMICA_JSON ---	2026-03-25 09:40:15.982	2026-03-25 09:40:36.021	\N	f	\N
cmnd6jdax00016x4j07fzy5hn	cmmdjfgx00000kd41ei21e3yl	invio asl	2026-03-30 10:00:00	\N	t	IN_ATTESA	2026	\N	2026-03-30 12:44:05.484	2026-03-30 12:44:05.484	500.000000000000000000000000000000	f	\N
cmnd9aiwa0001yu6kw5cwgwrp	cmmdjfgx00000kd41ei21e3yl	istanza ambulatorio odontoiatrico	2026-03-30 10:00:00	\N	t	ISPEZIONE_ASL	2026	[[ECON_B64:eyJjb3N0b1ByYXRpY2FFdXIiOjUwMDAsImFjY29udG9FdXIiOjEwMDAsImFjY29udG9EYXRlIjpudWxsLCJhY2NvbnRvWWVhciI6bnVsbCwiYWNjb250b05vdGVzIjpudWxsLCJzYWxkb0V1ciI6bnVsbCwic2FsZG9EYXRlIjpudWxsLCJzYWxkb1llYXIiOm51bGwsInNhbGRvTm90ZXMiOm51bGwsInBheW1lbnRSb3dzIjpbXX0=]]	2026-03-30 14:01:11.644	2026-03-31 13:21:39.315	5000.000000000000000000000000000000	f	\N
cmnd71v0g00056x4jr1czvm5x	cmmdjfgx00000kd41ei21e3yl	Poliambulatorio apertura	2026-03-30 10:00:00	\N	t	INIZIO_LAVORI	2026	[[ECON_B64:eyJjb3N0b1ByYXRpY2FFdXIiOjYwMDAsImFjY29udG9FdXIiOjEwMDAsImFjY29udG9EYXRlIjoiMjAyNi0wMy0zMFQxMDowMDowMC4wMDBaIiwiYWNjb250b1llYXIiOjIwMjYsImFjY29udG9Ob3RlcyI6bnVsbCwic2FsZG9FdXIiOm51bGwsInNhbGRvRGF0ZSI6bnVsbCwic2FsZG9ZZWFyIjpudWxsLCJzYWxkb05vdGVzIjpudWxsLCJwYXltZW50Um93cyI6W3sibGFiZWwiOiJzZWNvbmRvIGFjY29udG8gaW5pemlvIGxhdm9yaSIsImFtb3VudEV1ciI6MTAwMCwicGFpZEF0IjpudWxsLCJwYWlkWWVhciI6MjAyNiwibm90ZXMiOm51bGx9LHsibGFiZWwiOiJ0ZXJ6byBhY2NvbnRvIGludmlvIGluIHJlZ2lvbmUiLCJhbW91bnRFdXIiOjQwMDAsInBhaWRBdCI6bnVsbCwicGFpZFllYXIiOm51bGwsIm5vdGVzIjpudWxsfV19]]	2026-03-30 12:58:28.242	2026-03-30 13:01:05.056	6000.000000000000000000000000000000	f	\N
cmnojtpiy0007f11hyffy0jtt	cmnhbyg430000d5b171ao4nrk	apertura studio	2026-04-07 10:00:00	\N	t	ACCETTATO	2026	\N	2026-04-07 11:41:30.829	2026-04-07 11:43:26.261	5000.000000000000000000000000000000	f	\N
\.


--
-- Data for Name: ClientService; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ClientService" (id, "clientId", "serviceId", "siteId", "rxEndoralCount", "rxOptCount", "dueDate", "lastDoneAt", "priceEur", periodicity, priority, status, source, "referenteName", "referentePerc", "alertMonths", notes, "createdAt", "updatedAt") FROM stdin;
cmmj9v3i6000965jct8q2xgrz	cmmf0m8j80002kwqkcyzviolg	cmmj9v3hu000765jc4bvdnr4g	cmmj9s76m000165jcai75ekxs	1	1	2027-03-25 10:14:36.862	2026-03-25 10:14:36.862	350.000000000000000000000000000000	ANNUALE	MEDIA	SVOLTO	\N	\N	\N	2	\N	2026-03-09 14:24:06.27	2026-03-25 10:14:36.861
cmmncre1v00099la0ma4tj00n	cmmdjfgx00000kd41ei21e3yl	cmmj9uksl000465jcrd26xcik	cmmdkyb4k0004kd41pifw2987	\N	\N	2026-03-12 00:00:00	\N	350.000000000000000000000000000000	ANNUALE	MEDIA	DA_FARE	\N	\N	\N	2	\N	2026-03-12 10:56:16.868	2026-03-12 11:14:14.987
cmmnctn70000d9la0lxhics8d	cmmdjfgx00000kd41ei21e3yl	cmmj9v3hu000765jc4bvdnr4g	cmmdkyjzj0008kd41jnxpilts	\N	\N	2027-03-12 11:00:00	2026-03-12 11:00:00	350.000000000000000000000000000000	ANNUALE	MEDIA	SVOLTO	\N	\N	\N	2	\N	2026-03-12 10:58:02.028	2026-03-18 12:48:32.25
cmmp18zyo00011tbam9zd9cln	cmmjawsgx0000h56epujvz067	cmmj9v3hu000765jc4bvdnr4g	cmmktln9k0001mhl9ttxkwoo0	1	\N	2026-03-14 00:00:00	2026-03-20 13:29:16.184	350.000000000000000000000000000000	ANNUALE	MEDIA	SVOLTO	DE ROSE	DE ROSE	40.000000000000000000000000000000	2	\N	2026-03-13 15:09:35.376	2026-03-20 13:29:16.18
cmn3djojt0008yfuyxhxgflch	cmn3dffdp0000yfuydsiupw6i	cmmj9uksl000465jcrd26xcik	cmn3diwk20006yfuyn0ig9g3v	\N	\N	2027-03-25 10:11:34.448	2026-03-25 10:11:34.448	350.000000000000000000000000000000	ANNUALE	MEDIA	SVOLTO	\N	\N	\N	2	\N	2026-03-23 16:02:35.658	2026-03-25 10:11:34.446
cmn3dkdrx000ayfuyhn8pzsja	cmn3dffdp0000yfuydsiupw6i	cmmj9v3hu000765jc4bvdnr4g	cmn3diwk20006yfuyn0ig9g3v	1	1	2026-03-23 00:00:00	\N	250.000000000000000000000000000000	ANNUALE	MEDIA	DA_FARE	PHSC	PHSC	0.000000000000000000000000000000	2	\N	2026-03-23 16:03:08.349	2026-03-23 16:03:08.349
cmn4ozsv0000687nykn1f9iv2	cmn4ow97s000087nynvwbazw9	cmmj9uksl000465jcrd26xcik	cmn4oz5k7000487ny9ths0563	\N	\N	2027-03-24 14:27:23.138	2026-03-24 14:27:23.138	250.000000000000000000000000000000	ANNUALE	MEDIA	SVOLTO	\N	\N	\N	2	\N	2026-03-24 14:10:49.692	2026-03-24 14:27:23.136
cmn9374p50001df6aebxk50jc	cmn935w9a000010umdk5vv1f3	cmmj9uksl000465jcrd26xcik	\N	\N	\N	2026-03-27 00:00:00	\N	250.000000000000000000000000000000	ANNUALE	MEDIA	DA_FARE	\N	\N	\N	2	\N	2026-03-27 15:59:30.883	2026-03-27 15:59:30.883
cmn938fuc0003df6ayujyvuth	cmn935w9a000010umdk5vv1f3	cmmj9v3hu000765jc4bvdnr4g	\N	1	1	\N	\N	\N	ANNUALE	MEDIA	DA_FARE	\N	\N	\N	2	\N	2026-03-27 16:00:32.052	2026-03-27 16:00:32.052
cmmj9ukt1000665jclhfwvgq8	cmmf0m8j80002kwqkcyzviolg	cmmj9uksl000465jcrd26xcik	cmmj9s76m000165jcai75ekxs	\N	\N	2027-04-02 11:01:03.098	2026-04-02 11:01:03.098	350.000000000000000000000000000000	ANNUALE	MEDIA	FATTURATO	\N	\N	\N	2	\N	2026-03-09 14:23:42.037	2026-04-02 11:01:03.101
cmn4p09rt000887nynk8omsv3	cmn4ow97s000087nynvwbazw9	cmmj9v3hu000765jc4bvdnr4g	cmn4oz5k7000487ny9ths0563	\N	\N	2027-04-07 11:31:03.318	2026-04-07 11:31:03.318	150.000000000000000000000000000000	ANNUALE	MEDIA	FATTURATO	PHSC	PHSC	0.000000000000000000000000000000	2	\N	2026-03-24 14:11:11.61	2026-04-07 11:31:14.671
cmmm4jbql000110jtlokvryr4	cmmjawsgx0000h56epujvz067	cmmj9uksl000465jcrd26xcik	cmmktln9k0001mhl9ttxkwoo0	\N	\N	2027-03-05 11:00:00	2026-03-05 11:00:00	350.000000000000000000000000000000	ANNUALE	MEDIA	SVOLTO	\N	\N	\N	2	\N	2026-03-11 14:18:17.517	2026-04-07 11:52:59.993
cmnoizv930001f11huoyy895f	cmmdjfgx00000kd41ei21e3yl	cmmdjfrtl0001kd41d2qrrj9z	cmmdkyb4k0004kd41pifw2987	\N	\N	2027-04-10 12:39:56.419	2026-04-10 12:39:56.419	350.000000000000000000000000000000	ANNUALE	MEDIA	FATTURATO	\N	\N	\N	2	\N	2026-04-07 11:18:18.615	2026-04-10 12:40:03.302
\.


--
-- Data for Name: ClientSite; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ClientSite" (id, "clientId", name, address, city, province, cap, notes, "createdAt", "updatedAt") FROM stdin;
cmmdkyb4k0004kd41pifw2987	cmmdjfgx00000kd41ei21e3yl	marco amato	via roncigliano 92	albano laziale	RM	00041	\N	2026-03-05 14:47:54.836	2026-03-05 14:47:54.836
cmmdkyf5z0006kd41l6pqnqlc	cmmdjfgx00000kd41ei21e3yl	marco g	via roncigliano 92	albano laziale	RM	00041	\N	2026-03-05 14:48:00.071	2026-03-05 14:48:00.071
cmmdkyjzj0008kd41jnxpilts	cmmdjfgx00000kd41ei21e3yl	marco p	via roncigliano 92	albano laziale	RM	00041	\N	2026-03-05 14:48:06.319	2026-03-05 14:48:06.319
cmmj9s76m000165jcai75ekxs	cmmf0m8j80002kwqkcyzviolg	tuscolana	via tuscolana 33	roma	RM	00186	\N	2026-03-09 14:21:51.071	2026-03-09 14:21:51.071
cmmktln9k0001mhl9ttxkwoo0	cmmjawsgx0000h56epujvz067	Pavona	via pavona 33	roma	rm	00154	\N	2026-03-10 16:24:23.816	2026-03-10 16:24:23.816
cmmnmtxyn000511tcbq63clga	cmmjawsgx0000h56epujvz067	OIS PRIMAVERA	via cinquefrondi 120	albano laziale	RM	00041	\N	2026-03-12 15:38:12.143	2026-03-12 15:38:12.143
cmn3diwk20006yfuyn0ig9g3v	cmn3dffdp0000yfuydsiupw6i	ANAGNINA	Via Cinquefrondi, 89	Roma	RM	00173	\N	2026-03-23 16:01:59.379	2026-03-23 16:01:59.379
cmn4oz5k7000487ny9ths0563	cmn4ow97s000087nynvwbazw9	Rossident Bologna	piazza bologna 1	Roma	rm	\N	\N	2026-03-24 14:10:19.496	2026-03-24 14:10:19.496
\.


--
-- Data for Name: ClinicalEngineeringCheck; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ClinicalEngineeringCheck" (id, "clientId", "siteId", "nomeClienteSnapshot", "nomeSedeSnapshot", "indirizzoSedeSnapshot", "studioRifAmministrativo", "contattiMail", "contattiCellulare", "numApparecchiature", "apparecchiatureAggiuntive", "costoServizio", "quotaTecnicoPerc", "quotaTecnico", "importoTrasferta", periodicita, "dataUltimoAppuntamento", "dataAppuntamentoPreso", "dataProssimoAppuntamento", "verificheEseguite", "fileSuDropbox", fatturata, "fatturataAt", "tecnicoFatturato", "tecnicoFatturatoAt", notes, "createdAt", "updatedAt") FROM stdin;
cmmksy10f0001ombscm8e9yhr	cmmf0m8j80002kwqkcyzviolg	cmmj9s76m000165jcai75ekxs	giulio panichelli	tuscolana	via tuscolana 33 roma RM 00186		GIULIO@LIBERO.IT	10616565	10	0	500.000000000000000000000000000000	40.000000000000000000000000000000	200.000000000000000000000000000000	0.000000000000000000000000000000	ANNUALE	2027-03-12 00:00:00	\N	2028-03-12 00:00:00	t	t	t	2026-03-17 14:03:48.85	t	2026-03-17 14:04:13.426		2026-03-10 16:06:01.887	2026-03-23 15:29:24.979
cmn3ef4yh00013tbw6yfnyk9j	cmn3dffdp0000yfuydsiupw6i	cmn3diwk20006yfuyn0ig9g3v	PIERFERDINANDOLO GUGLIELMONI	ANAGNINA	Via Cinquefrondi, 89	\N	PIERPERGLIAMICI@PIER59	35698569	5	0	250.000000000000000000000000000000	40.000000000000000000000000000000	100.000000000000000000000000000000	150.000000000000000000000000000000	ANNUALE	2026-03-23 00:00:00	2026-03-23 00:00:00	2027-03-23 00:00:00	t	t	t	2026-03-25 10:19:57.742	t	2026-03-25 10:20:00.166	\N	2026-03-23 16:27:03.257	2026-03-25 10:20:22.986
cmn4pg6pi000e87nyrp4ttxb6	cmn4ow97s000087nynvwbazw9	cmn4oz5k7000487ny9ths0563	ROSSIDENT SRL	Rossident Bologna	piazza bologna 1	\N	rossident@gmail.com	321654987	5	5	250.000000000000000000000000000000	40.000000000000000000000000000000	100.000000000000000000000000000000	100.000000000000000000000000000000	BIENNALE	2026-03-24 00:00:00	2026-03-24 00:00:00	2028-03-24 00:00:00	f	f	f	\N	f	\N	\N	2026-03-24 14:23:34.134	2026-03-24 14:23:34.134
cmmlz9gqd00017kq725ufxx00	cmmjawsgx0000h56epujvz067	cmmktln9k0001mhl9ttxkwoo0	PIFFERO MAGICO	Pavona	via pavona 33	\N	mario@pietralicna.it	5349+9454	6	0	500.000000000000000000000000000000	40.000000000000000000000000000000	200.000000000000000000000000000000	0.000000000000000000000000000000	ANNUALE	2026-03-11 00:00:00	2026-03-25 00:00:00	2027-03-11 00:00:00	t	t	t	2026-03-17 14:03:52.449	t	2026-03-18 14:08:40.014	\N	2026-03-11 11:50:39.349	2026-04-07 11:35:59.339
cmmdnxemq0001pwgfaw3ytrwn	cmmdjfgx00000kd41ei21e3yl	cmmdkyf5z0006kd41l6pqnqlc	marco amato	marco g	via roncigliano 92 albano laziale RM 00041		mar.amato85@gmail.com	3381149755	2	2	300.000000000000000000000000000000	40.000000000000000000000000000000	120.000000000000000000000000000000	0.000000000000000000000000000000	BIENNALE	2026-04-07 00:00:00	2026-04-07 00:00:00	2028-04-07 00:00:00	t	t	t	2026-04-07 11:37:16.661	t	2026-04-07 11:37:46.133		2026-03-05 16:11:11.57	2026-04-07 11:37:54.35
\.


--
-- Data for Name: CourseCatalog; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."CourseCatalog" (id, name, category, "defaultPriceEur", "isActive") FROM stdin;
cmmnf9h950005svg079sl1sze	AGGIORNAMENTO ASO	\N	\N	t
cmn4qq21401n487nyq9w5bv7g	FORMAZIONE GENERALE	\N	\N	t
cmn4qqd9q02gw87nycctz7zf2	BLSD	\N	\N	t
cmn4qqgi502pz87ny8xgpoguj	PREPOSTI	\N	\N	t
cmn4qqgkh02q387nypgux5wod	ANTINCENDIO BASSO	\N	\N	t
cmn4qqm6t038k87nylzfz3s1c	ANTINCENDIO MEDIO	\N	\N	t
cmn4qrio0039287nykv6spwnb	PRIMO SOCCORSO GRUPPO A	\N	\N	t
cmn4qrn3t03g387nyryrujue2	PRIMO SOCCORSO GRUPPO BC	\N	\N	t
cmn4qrv0103hr87nyeu4qm7tr	RLS MENO DI 50 DIP	\N	\N	t
cmn4qs2ho03sg87nycc7l5g7q	RSPP DATORE DI LAVORO	\N	\N	t
cmn4qs9lb03uh87nyhspbzsfm	SPEC BASSO	\N	\N	t
cmn4qseic048x87nyetridc8x	SPEC MEDIO	\N	\N	t
cmn4qsmcx049487ny8rnte9sw	SPEC ALTO	\N	\N	t
\.


--
-- Data for Name: MapPlanItem; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."MapPlanItem" (id, ym, "clientServiceId", "clientId", "siteId", "plannedDay", "plannedDate", status, notes, "createdAt", "updatedAt") FROM stdin;
cmmuqozlu0001jrkel2n07pis	2026-03	cmmj9v3i6000965jct8q2xgrz	cmmf0m8j80002kwqkcyzviolg	cmmj9s76m000165jcai75ekxs	3	2026-03-03 11:00:00	SVOLTO		2026-03-17 15:00:42.69	2026-03-17 15:40:20.735
cmmure3a7000hjrkey7btmub3	2026-03	cmmnctn70000d9la0lxhics8d	cmmdjfgx00000kd41ei21e3yl	cmmdkyjzj0008kd41jnxpilts	12	2026-03-12 11:00:00	SVOLTO		2026-03-17 15:20:13.856	2026-03-18 12:48:32.229
cmn4ps90e000j87nyo7ownxsx	2026-03	cmn3dkdrx000ayfuyhn8pzsja	cmn3dffdp0000yfuydsiupw6i	cmn3diwk20006yfuyn0ig9g3v	2	2026-03-02 11:00:00	APPUNTAMENTO_PRESO		2026-03-24 14:32:56.99	2026-03-24 14:32:56.99
cmmusspac0001129d6r805f15	2026-03	cmmm4jbql000110jtlokvryr4	cmmjawsgx0000h56epujvz067	cmmktln9k0001mhl9ttxkwoo0	5	2026-03-05 11:00:00	SVOLTO		2026-03-17 15:59:35.172	2026-04-07 11:52:59.548
cmmuredd0000tjrkeysnxjiry	2026-03	cmmp18zyo00011tbam9zd9cln	cmmjawsgx0000h56epujvz067	cmmktln9k0001mhl9ttxkwoo0	6	2026-03-06 11:00:00	APPUNTAMENTO_PRESO		2026-03-17 15:20:26.916	2026-04-07 11:54:19.082
\.


--
-- Data for Name: MarketingList; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."MarketingList" (id, name, slug, "isSystem", "isActive", "createdAt", "updatedAt") FROM stdin;
cmnilv9ok0000ux6limbc88qy	RADIOPROTEZIONE	radioprotezione	t	t	2026-04-03 07:52:05.829	2026-04-03 07:52:05.829
cmnilva3r0001ux6ll3daqlii	ASO	aso	t	t	2026-04-03 07:52:05.829	2026-04-03 07:52:05.829
cmnilvaeu0002ux6l2u1ft90v	FISIOTERAPISTI	fisioterapisti	t	t	2026-04-03 07:52:05.829	2026-04-03 07:52:05.829
cmnilvaps0003ux6lg40badnm	SICUREZZA DVR	sicurezza-dvr	t	t	2026-04-03 07:52:05.829	2026-04-03 07:52:05.829
cmnilvb0q0004ux6lg2t0q15x	HACCP	haccp	t	t	2026-04-03 07:52:05.829	2026-04-03 07:52:05.829
cmnilvbbn0005ux6lsf5zn7nb	MEDICI	medici	t	t	2026-04-03 07:52:05.829	2026-04-03 07:52:05.829
cmnimybcu0006ux6lojzdx1oa	LEGIONELLA	legionella	f	t	2026-04-03 08:22:27.582	2026-04-03 08:22:27.582
cmniop5px000011lm0n1knowr	ODONTOIATRI	odontoiatri	f	t	2026-04-03 09:11:19.606	2026-04-03 09:11:19.606
cmnip8l450000v199jq7zuaqp	SEGRETARIE	segretarie	f	t	2026-04-03 09:26:26.021	2026-04-03 09:26:26.021
\.


--
-- Data for Name: Person; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Person" (id, "fiscalCode", "lastName", "firstName", email, phone, role, "hireDate", "medicalCheckDone", "clientId", "createdAt", "updatedAt") FROM stdin;
cmmm4q8w8000510jt4q6d7yq1	\N	amato	marco	mar.amato85@gmail.com	3381149755	ASO	\N	f	cmmf0m8j80002kwqkcyzviolg	2026-03-11 14:23:40.424	2026-03-11 14:23:40.424
cmmndf4sj0001g4motnfhux74	\N	amato	marco	mar.amato85@gmail.com	3381149755	\N	\N	t	cmmdjfgx00000kd41ei21e3yl	2026-03-12 11:14:44.612	2026-03-12 12:04:41.538
cmmndkqij0003g4mojjqz1ael	\N	amato	marco	mar.amato85@gmail.com	3381149755	\N	\N	t	cmmdjfgx00000kd41ei21e3yl	2026-03-12 11:19:06.043	2026-03-12 11:36:18.233
cmn3dlcy4000cyfuye1geck4m	MAKKSJDIASD56588ASPDKA	MARILINO	LAURO	PAOLO@LIBERO.IT	32546859	aso	\N	t	cmn3dffdp0000yfuydsiupw6i	2026-03-23 16:03:53.932	2026-03-23 16:03:53.932
cmn4p17xs000a87ny512s5np3	majtisjcàpaàojsjd	Feliciani	Rossella	rossifelici@libero.it	06958636	ASO	\N	t	cmn4ow97s000087nynvwbazw9	2026-03-24 14:11:55.889	2026-03-24 14:11:55.889
cmn4qp91l000o87ny6qn4yctp	GLLNNL66L49H501O	Galluzzo	Antonella	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qp917000m87nyfxr06yy6	2026-03-24 14:58:36.682	2026-03-24 15:04:35.464
cmn4qp91y000q87nykkvwg8b8	DDOBBR72R52H501S	Oddi	Barbara	\N	\N	ASO	\N	f	cmn4qp917000m87nyfxr06yy6	2026-03-24 14:58:36.694	2026-03-24 15:04:35.498
cmn4qp92p000t87nyypaykrcu	BBNCLD62B27H501I	Abbondanza	Claudio	\N	\N	odontoiatra	\N	f	cmn4qp92d000r87nyycqokb6o	2026-03-24 14:58:36.721	2026-03-24 14:59:28.828
cmn4qp931000v87ny0ench9ck	RSPMCR63S62H501U	Rispoli	Maria Cristina	\N	\N	igienista dentale	\N	f	cmn4qp92d000r87nyycqokb6o	2026-03-24 14:58:36.733	2026-03-24 14:59:28.852
cmn4qp93m000y87ny362upgqu	GSTSVN82P45A893I	Agostinacchio	Silvana	\N	\N	odontoiatra	\N	f	cmn4qp93b000w87nyi01g5cyb	2026-03-24 14:58:36.754	2026-03-24 15:00:22.488
cmn4qp941001087nyli2c8mim	BNDFRC88T47I348F	Bonaduce	Federica	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qp93b000w87nyi01g5cyb	2026-03-24 14:58:36.769	2026-03-24 15:04:35.524
cmn4qp94o001387nyc6m1bl0s	GRSFNC48T18H501M	Agresti	Franco	\N	\N	medico odontoiatra	\N	f	cmn4qp94c001187nypfgxxzy8	2026-03-24 14:58:36.792	2026-03-24 14:59:33.159
cmn4qp95e001687ny0kfk06na	LLAFNC50M24D122R	Aiello	Francesco	\N	\N	medico odontoiatra	\N	f	cmn4qp950001487nyakcqkmwu	2026-03-24 14:58:36.818	2026-03-24 15:00:48.178
cmn4qp95q001887nycpnq7kd6	CNILIO66E60H501I	Ciani	Iole	\N	\N	ASO	\N	f	cmn4qp950001487nyakcqkmwu	2026-03-24 14:58:36.83	2026-03-24 15:04:35.55
cmn4qp96g001b87nyht0q510x	LNZPPL65D28H501H	Alonzo	Pierpaolo	\N	\N	odontoiatra	\N	f	cmn4qp962001987nyf70g5edi	2026-03-24 14:58:36.857	2026-03-24 15:00:28.263
cmn4qp96u001d87nysvbqii81	MNDPLA74L67B246A	Mandras	Paola	\N	\N	ASO	\N	f	cmn4qp962001987nyf70g5edi	2026-03-24 14:58:36.871	2026-03-24 15:04:35.578
cmn4qp977001f87nyixdsetam	BGLTRS84P67B619M	Baglivo	Teresa	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qp962001987nyf70g5edi	2026-03-24 14:58:36.884	2026-03-24 15:04:35.608
cmn4qp97n001h87nyp7sgyfec	MBLVNT80C69H501Y	Amabile	Valentina	\N	\N	ASO	\N	f	cmn4qp962001987nyf70g5edi	2026-03-24 14:58:36.899	2026-03-24 15:04:35.634
cmn4qp98h001k87ny8qp2efgi	XXXXXX11X11X111X	Palombarini	Simona	\N	\N	segretaria/aso	\N	t	cmn4qp983001i87nyjgpuntll	2026-03-24 14:58:36.929	2026-03-24 15:04:35.659
cmn4qp98t001m87nygl6la4af	XXXXXX11X11X112X	Sacco	Elisa	\N	\N	ASO	\N	t	cmn4qp983001i87nyjgpuntll	2026-03-24 14:58:36.941	2026-03-24 15:04:35.683
cmn4qp996001o87ny3gywstln	XXXXXX11X11X113X	Miceli	Michela	\N	\N	ASO	\N	t	cmn4qp983001i87nyjgpuntll	2026-03-24 14:58:36.954	2026-03-24 15:04:35.708
cmn4qp99s001r87nycrddgoh5	LTMLRD60E03H501K	Altamura	Leonardo	\N	\N	medico odontoiatra	\N	f	cmn4qp99f001p87nyadrr7ote	2026-03-24 14:58:36.976	2026-03-24 15:00:22.519
cmn4qp9a5001t87nymdzwd5gt	BLGMCM91P07H501N	Bolognini	Marco Maria	\N	\N	impiegato	\N	f	cmn4qp99f001p87nyadrr7ote	2026-03-24 14:58:36.989	2026-03-24 15:04:35.735
cmn4qp9bp001v87nywnygsaw8	DNTLRN92P61E974J	Donato	Lorena	\N	\N	ASO	\N	f	cmn4qp99f001p87nyadrr7ote	2026-03-24 14:58:37.046	2026-03-24 15:04:35.76
cmn4qp9c2001x87nyigqwoxyf	PTRLNR83A58I838S	Patriarca	Eleonora	\N	\N	\N	\N	t	cmn4qp99f001p87nyadrr7ote	2026-03-24 14:58:37.058	2026-03-24 15:04:35.787
cmn4qp9cp002087ny3bcsztt9	LTRVCN59C01H501N	Altieri	Vincenzo	\N	\N	medico odontoiatra	\N	t	cmn4qp9cd001y87ny1ia9icss	2026-03-24 14:58:37.082	2026-03-24 14:59:01.946
cmn4qp9d9002287nycr6vnw66	MLTTZN69T50H501G	Mileto	Tiziana	\N	\N	ASO	\N	f	cmn4qp9cd001y87ny1ia9icss	2026-03-24 14:58:37.101	2026-03-24 15:04:35.821
cmn4qp9dk002487nywfeou3i7	XXXXXX11X11X114X	De Rosa	Patrizia	\N	\N	\N	\N	t	cmn4qp9cd001y87ny1ia9icss	2026-03-24 14:58:37.112	2026-03-24 15:04:35.845
cmn4qp9e0002687nywrx35tz1	PTRVNT96B59H501H	Petricca	Valentina	\N	\N	\N	\N	t	cmn4qp9cd001y87ny1ia9icss	2026-03-24 14:58:37.128	2026-03-24 15:04:35.872
cmn4qp9en002987ny4v6bn5d2	MTARNN63H60H501U	Amati	Arianna	\N	\N	odontoiatra	\N	f	cmn4qp9ec002787nyuobe98oi	2026-03-24 14:58:37.152	2026-03-24 14:59:33.344
cmn4qp9f0002b87nyl51a4lqw	SPZSTR71B53H501T	Spizzichino	Ester	\N	\N	ASO	\N	f	cmn4qp9ec002787nyuobe98oi	2026-03-24 14:58:37.164	2026-03-24 15:04:35.899
cmn4qp9fc002d87nyyfl1dfwd	DLMRKE73T58H501H	Del Marro	Erika	\N	\N	ASO	\N	f	cmn4qp9ec002787nyuobe98oi	2026-03-24 14:58:37.176	2026-03-24 15:04:35.943
cmn4qp9fn002f87nybkzagkpn	DCSFRC86T70H501Z	Di Castro	Federica	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qp9ec002787nyuobe98oi	2026-03-24 14:58:37.187	2026-03-24 15:04:35.971
cmn4qp9g8002i87nyii2j6giy	RNAGBR75E27H501L	Arena	Gilberto Maria	\N	\N	odontoiatra	\N	f	cmn4qp9fx002g87ny7fek9n3r	2026-03-24 14:58:37.208	2026-03-24 15:00:48.205
cmn4qp9gj002k87nyzw8zlm8b	RNARSL69D68H501I	Arena	Rossella	\N	\N	ASO	\N	f	cmn4qp9fx002g87ny7fek9n3r	2026-03-24 14:58:37.219	2026-03-24 15:04:36.007
cmn4qp9hb002n87ny4ilytfco	RNALCU84M11E974L	Arini	Luca	\N	\N	odontoiatra	\N	f	cmn4qp9gt002l87ny7lc7sozr	2026-03-24 14:58:37.247	2026-03-24 14:59:33.42
cmn4qp9hy002p87nysy6yy4mg	DBRFRC00M46H501L	Di Bernardo	Federica	\N	\N	ASO	\N	f	cmn4qp9gt002l87ny7lc7sozr	2026-03-24 14:58:37.271	2026-03-24 15:04:36.044
cmn4qp9ip002s87ny78kckxvx	RMDMTT77H18D810B	Armida	Matteo	\N	\N	odontoiatra	\N	f	cmn4qp9ie002q87nyql6wxw2t	2026-03-24 14:58:37.297	2026-03-24 14:59:33.451
cmn4qp9jd002v87nyrypxotne	PRNFRZ67P01C773G	Fabrizio	Pierantozzi	\N	\N	legale rappresentante	\N	f	cmn4qp9j1002t87ny8f4ceae1	2026-03-24 14:58:37.321	2026-03-24 14:59:33.486
cmn4qp9k0002y87nywpxflx7m	MDLRNN65E59L014W	Modolo	Rosanna	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qp9jo002w87nyn9pcihfj	2026-03-24 14:58:37.344	2026-03-24 15:04:36.082
cmn4qp9kf003087nyw6obkhx6	PZZBBR72H51H501A	Pizza	Barbara	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qp9jo002w87nyn9pcihfj	2026-03-24 14:58:37.359	2026-03-24 15:04:36.119
cmn4qp9l2003287nyfvt55qqu	CLALSN97S50H501P	Cal�	Alessandra	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qp9jo002w87nyn9pcihfj	2026-03-24 14:58:37.383	2026-03-24 15:04:36.155
cmn4qp9lr003587nyssmcaog0	TRNNDR74T06L120W	Terenzi	Andrea	\N	\N	legale rappresentante/odontoiatra	\N	f	cmn4qp9le003387ny8s0k5xf3	2026-03-24 14:58:37.407	2026-03-24 14:59:33.521
cmn4qp9m2003787nyjafujqym	PRNBDT73L52H501R	Prandi	Benedetta	\N	\N	odontoiatra	\N	f	cmn4qp9le003387ny8s0k5xf3	2026-03-24 14:58:37.418	2026-03-24 14:59:33.548
cmn4qp9ms003987nydn44fl2m	RSSMRC73H14H501X	Rossi	Marco	\N	\N	odontoiatra	\N	f	cmn4qp9le003387ny8s0k5xf3	2026-03-24 14:58:37.444	2026-03-24 14:59:33.592
cmn4qp9n4003b87nyujvurcxf	CPRCST92M56C773Z	Capri	Cristina	\N	\N	ASO	\N	f	cmn4qp9le003387ny8s0k5xf3	2026-03-24 14:58:37.456	2026-03-24 15:04:36.189
cmn4qp9ng003d87ny2rkl8q9y	FRMGDN84C41H501W	Firmani	Giordana	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qp9le003387ny8s0k5xf3	2026-03-24 14:58:37.468	2026-03-24 15:04:36.228
cmn4qp9nx003f87nyj0fcqd5m	PLLFNC76M48H501Z	Palli	Francesca	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qp9le003387ny8s0k5xf3	2026-03-24 14:58:37.485	2026-03-24 15:04:36.254
cmn4qp9o8003h87nyqlty4max	LRAMLS84R55H096H	Laera	Maria Alessandra	\N	\N	ASO	\N	f	cmn4qp9le003387ny8s0k5xf3	2026-03-24 14:58:37.496	2026-03-24 15:04:36.295
cmn4qp9ok003j87nyx8yygl20	BTOPRN87H64Z129Q	Bota	Petronela	\N	\N	ASO	\N	f	cmn4qp9le003387ny8s0k5xf3	2026-03-24 14:58:37.508	2026-03-24 15:04:36.333
cmn4qp9p0003l87nyj3j46n09	XXXXXX11X11X115X	Bah	Hamjat Jallomy	\N	\N	addetto pulizie	\N	f	cmn4qp9le003387ny8s0k5xf3	2026-03-24 14:58:37.524	2026-03-24 15:04:36.361
cmn4qp9pp003o87nyhl3hizde	BRLLRT76A56H501T	Barlattani	Alberta	\N	\N	odontoiatra	\N	f	cmn4qp9pe003m87nyxy8ua22o	2026-03-24 14:58:37.55	2026-03-24 14:59:33.655
cmn4qp9q0003q87ny10t81ejk	RSCFRC69A43H501P	Roscani	Federica	\N	\N	ASO	\N	f	cmn4qp9pe003m87nyxy8ua22o	2026-03-24 14:58:37.56	2026-03-24 15:04:36.397
cmn4qp9qp003t87nykm2lm1x7	BSTDRA87H08L719Z	Bastianelli	Dario	\N	\N	odontoiatra	\N	f	cmn4qp9qd003r87nyb47nk89r	2026-03-24 14:58:37.585	2026-03-24 14:59:33.682
cmn4qp9r0003v87nyygijz1sf	CFRVGN96R62L719H	Cafarotti	Virginia	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qp9qd003r87nyb47nk89r	2026-03-24 14:58:37.596	2026-03-24 15:04:36.437
cmn4qp9rg003x87nykpkt1y9b	CPNMGR98R65L719I	Caponera	Maria Grazia	\N	\N	ASO	\N	f	cmn4qp9qd003r87nyb47nk89r	2026-03-24 14:58:37.612	2026-03-24 15:04:36.473
cmn4qp9s0003z87ny9r9c3bgp	FSCRSI76A56L719L	Foschi	Iris	\N	\N	ASO	\N	f	cmn4qp9qd003r87nyb47nk89r	2026-03-24 14:58:37.633	2026-03-24 15:04:36.508
cmn4qp9sg004187nylhp443s5	XXXXXX11X11X116X	Segala	Monica	\N	\N	ASO	\N	t	cmn4qp9qd003r87nyb47nk89r	2026-03-24 14:58:37.649	2026-03-24 15:04:36.539
cmn4qp9t2004487ny299wr82s	PRSGCR74L29H501D	Giancarlo	Persia	\N	\N	\N	\N	t	cmn4qp9sq004287nyi1hjfbx1	2026-03-24 14:58:37.67	2026-03-24 15:00:22.583
cmn4qp9te004687nylycsdwal	LPCSFN62L31H501I	Lapucci	Stefano	\N	\N	legale rappresentante/odontoiatra	\N	f	cmn4qp9sq004287nyi1hjfbx1	2026-03-24 14:58:37.683	2026-03-24 14:59:33.734
cmn4qp9ts004887nyqfw9ac0f	FRNLRA71R64D972Q	Franceschelli	Lara	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qp9sq004287nyi1hjfbx1	2026-03-24 14:58:37.697	2026-03-24 15:04:36.572
cmn4qp9u4004a87ny1aok747m	MEICRL68S44H501X	Mei	Carla	\N	\N	ASO	\N	f	cmn4qp9sq004287nyi1hjfbx1	2026-03-24 14:58:37.709	2026-03-24 15:04:36.602
cmn4qp9uj004c87ny8nae3nyd	TRAGRG85M65F839F	Auteri	Giorgia	\N	\N	ASO	\N	f	cmn4qp9sq004287nyi1hjfbx1	2026-03-24 14:58:37.723	2026-03-24 15:04:36.639
cmn4qp9ux004e87nyfq492uaw	XXXXXX11X11X117X	Scarpetti	Maria	\N	\N	ASO	\N	t	cmn4qp9sq004287nyi1hjfbx1	2026-03-24 14:58:37.737	2026-03-24 15:04:36.677
cmn4qp9vl004h87nyjnhvcj8l	XXXXXX11X11X118X	Belelli	Massimo	\N	\N	odontoiatra	\N	t	cmn4qp9v8004f87nyxk60rtc7	2026-03-24 14:58:37.761	2026-03-24 14:59:02.55
cmn4qp9vx004j87nyr82mawh2	GBBVNT82E42H501F	Gobbi	Valentina	\N	\N	ASO	\N	t	cmn4qp9v8004f87nyxk60rtc7	2026-03-24 14:58:37.773	2026-03-24 15:04:36.703
cmn4qp9wb004l87nyj6t33ot6	MRSLDN76E54D773C	Marsili	Loredana	\N	\N	ASO	\N	t	cmn4qp9v8004f87nyxk60rtc7	2026-03-24 14:58:37.788	2026-03-24 15:04:36.727
cmn4qp9x4004o87nya68kgixf	BNCMRA71D68H501E	Bianchi	Mara	\N	\N	medico odontoiatra	\N	f	cmn4qp9wt004m87nyajmyko2u	2026-03-24 14:58:37.816	2026-03-24 14:59:33.793
cmn4qp9xf004q87nyne5w5oov	LPRCRN67B54A132Q	La Prova	Caterina	\N	\N	ASO	\N	f	cmn4qp9wt004m87nyajmyko2u	2026-03-24 14:58:37.827	2026-03-24 15:04:36.752
cmn4qp9xq004s87nyfujwajh0	XXXXXX11X11X119X	Fiorucci	Tiziana	\N	\N	addetto pulizie	\N	t	cmn4qp9wt004m87nyajmyko2u	2026-03-24 14:58:37.838	2026-03-24 15:04:36.776
cmn4qp9ye004v87nyudlegi71	BNCPRI70T04H501F	Bianco	Piero	\N	\N	odontoiatra	\N	f	cmn4qp9y1004t87ny5p413gis	2026-03-24 14:58:37.862	2026-03-24 15:00:48.239
cmn4qp9yp004x87nys4rpsfvr	SRLMRA86R50H501I	Sarleti	Mara	\N	\N	ASO	\N	f	cmn4qp9y1004t87ny5p413gis	2026-03-24 14:58:37.873	2026-03-24 15:04:36.815
cmn4qp9zb005087nyk6g5jocp	BSGRCR70H29A515A	Bisegna	Riccardo	\N	\N	odontoiatra	\N	f	cmn4qp9yz004y87nyg0wzcwuk	2026-03-24 14:58:37.895	2026-03-24 15:00:22.61
cmn4qp9zt005287nydzq4xhx6	MNTVNT77B54H501H	Montenero	Valentina	\N	\N	ASO	\N	f	cmn4qp9yz004y87nyg0wzcwuk	2026-03-24 14:58:37.914	2026-03-24 15:04:36.846
cmn4qpa0e005487nylbv3aejb	STMFBN79C70L049N	Stomeo	Fabiana	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qp9yz004y87nyg0wzcwuk	2026-03-24 14:58:37.935	2026-03-24 15:04:36.878
cmn4qpa0p005687ny7knpckql	STNPLR86E41A132D	Stingi	Paola Laura	\N	\N	ASO	\N	f	cmn4qp9yz004y87nyg0wzcwuk	2026-03-24 14:58:37.945	2026-03-24 15:04:36.903
cmn4qpa11005887nyel01ymrl	SVRLRI87S45A132B	Severi	Ilaria	\N	\N	\N	\N	t	cmn4qp9yz004y87nyg0wzcwuk	2026-03-24 14:58:37.957	2026-03-24 15:04:36.926
cmn4qpa1d005a87nygsxs89rl	XXXXXX11X11X120X	Piroli	Elisa	\N	\N	\N	\N	t	cmn4qp9yz004y87nyg0wzcwuk	2026-03-24 14:58:37.969	2026-03-24 15:04:36.954
cmn4qpa1z005d87nyjt33954a	TSCRSO64A56H501K	Toschei	Rosa	\N	\N	ASO	\N	f	cmn4qpa1n005b87ny460s9svd	2026-03-24 14:58:37.991	2026-03-24 15:04:36.986
cmn4qpa2n005g87nyf8gz82dw	BTTLCN68T13H501X	Botticelli	Luciano	\N	\N	odontoiatra	\N	f	cmn4qpa2a005e87nyg4g1vneg	2026-03-24 14:58:38.015	2026-03-24 14:59:33.911
cmn4qpa36005i87nyy5uijmmw	FDNFRC73R71H501C	Fidani	Federica	\N	\N	ASO	\N	f	cmn4qpa2a005e87nyg4g1vneg	2026-03-24 14:58:38.035	2026-03-24 15:04:37.013
cmn4qpa3p005k87ny9igekm49	GRRSRA98C69H501R	Guerra	Sara	\N	\N	ASO	\N	f	cmn4qpa2a005e87nyg4g1vneg	2026-03-24 14:58:38.054	2026-03-24 15:04:37.042
cmn4qpa41005m87nyl4gkch2t	PSTSLV75B56H501K	Pistilli	Silvia	\N	\N	\N	\N	t	cmn4qpa2a005e87nyg4g1vneg	2026-03-24 14:58:38.065	2026-03-24 14:59:29.609
cmn4qpa4p005p87ny4m51rp2w	NNNSRA78C69H501A	Nonni	Sara	\N	\N	impiegato	\N	f	cmn4qpa4b005n87ny6yeoc4q1	2026-03-24 14:58:38.09	2026-03-24 15:04:37.072
cmn4qpa5c005s87nyzz8nvx8e	CMDFNC82P14L719F	Camedda	Francesco	\N	\N	odontoiatra	\N	f	cmn4qpa50005q87ny6obeaj69	2026-03-24 14:58:38.113	2026-03-24 15:00:22.64
cmn4qpa5y005v87nybtbid9fu	CNTSLL73A56H501W	Cantiero	Isabella	\N	\N	\N	\N	t	cmn4qpa5n005t87nymwxj6oxn	2026-03-24 14:58:38.134	2026-03-24 15:00:39.094
cmn4qpa6n005y87ny2213r4ob	CPNVRN60D11A515C	Capone	Valeriano	\N	\N	odontoiatra	\N	f	cmn4qpa6b005w87nywe962fap	2026-03-24 14:58:38.16	2026-03-24 14:59:33.965
cmn4qpa6z006087nylyoonxqt	CPNFNP86P62H501W	Capone	Francesca	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpa6b005w87nywe962fap	2026-03-24 14:58:38.171	2026-03-24 15:04:37.1
cmn4qpa7m006387ny5bqlywfc	CSSGRG72D03E958H	Cassabgi	Giorgio	\N	\N	odontoiatra	\N	f	cmn4qpa79006187nyi64lnseq	2026-03-24 14:58:38.194	2026-03-24 15:00:28.293
cmn4qpa7x006587nyhkh4ahqh	NTLDSR89B66E606C	Natoli Paino	Desir�	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpa79006187nyi64lnseq	2026-03-24 14:58:38.205	2026-03-24 15:04:37.133
cmn4qpa8k006887nyq7vy9y4c	CVLCRL68C28L719U	Carlo	Cavalieri	\N	\N	odontoiatra	\N	f	cmn4qpa89006687nytfostn9s	2026-03-24 14:58:38.228	2026-03-24 14:59:29.686
cmn4qpa99006b87nygpb565ik	CVCTZN76S46H501E	Cavicchioni	Tiziana	\N	\N	odontoiatra	\N	f	cmn4qpa8w006987nywr2j2nvm	2026-03-24 14:58:38.253	2026-03-24 14:59:34.041
cmn4qpa9m006d87nyj5aeltpq	RMBLNE69T55D612F	Rombai	Elena	\N	\N	ASO	\N	f	cmn4qpa8w006987nywr2j2nvm	2026-03-24 14:58:38.266	2026-03-24 15:04:37.158
cmn4qpaa9006g87nylpzkqmqi	CCCFBA57D08H501F	Ceccaioni	Fabio	\N	\N	odontoiatra	\N	f	cmn4qpa9y006e87nyd0chrv0w	2026-03-24 14:58:38.289	2026-03-24 14:59:34.066
cmn4qpaal006i87nylqcg4bs7	CLLMNC74T47H501A	Collu	Monica	\N	\N	ASO	\N	f	cmn4qpa9y006e87nyd0chrv0w	2026-03-24 14:58:38.301	2026-03-24 15:04:37.182
cmn4qpaax006k87nymzo903ui	CRZMRT74M52H501X	Corazza	Ombretta	\N	\N	ASO	\N	f	cmn4qpa9y006e87nyd0chrv0w	2026-03-24 14:58:38.313	2026-03-24 15:04:37.213
cmn4qpab9006m87nyzwyneq2h	LZZRNN76C53H501G	Lazzarini	Arianna	\N	\N	ASO	\N	f	cmn4qpa9y006e87nyd0chrv0w	2026-03-24 14:58:38.325	2026-03-24 15:04:37.257
cmn4qpabp006o87ny47pr3aw8	GLLSNT78T46E958M	Galli	Samantha	\N	\N	ASO	\N	f	cmn4qpa9y006e87nyd0chrv0w	2026-03-24 14:58:38.342	2026-03-24 15:04:37.291
cmn4qpac2006q87nywt094qhj	DLMSLV95M44H501A	Del Monaco	Silvia	\N	\N	ASO	\N	f	cmn4qpa9y006e87nyd0chrv0w	2026-03-24 14:58:38.354	2026-03-24 15:04:37.329
cmn4qpack006s87ny5poa1nl6	CCCGLI87C29H501A	Ceccaioni	Gioel	\N	\N	\N	\N	t	cmn4qpa9y006e87nyd0chrv0w	2026-03-24 14:58:38.372	2026-03-24 15:04:37.362
cmn4qpacy006u87nymhvaus19	VSCGRL73A08Z129Q	Ivasciuk	Gabriel	\N	\N	operaio	\N	f	cmn4qpa9y006e87nyd0chrv0w	2026-03-24 14:58:38.386	2026-03-24 15:04:37.389
cmn4qpadw006x87nyzd6h82hd	CLEFLC58E04A515Y	Celi	Felice	\N	\N	medico odontoiatra	\N	f	cmn4qpadh006v87nyf943p4x9	2026-03-24 14:58:38.42	2026-03-24 14:59:34.163
cmn4qpae9006z87ny8bu2je1t	PPUMNT59P56D767R	Pupo	Mariantonia	\N	\N	ASO	\N	f	cmn4qpadh006v87nyf943p4x9	2026-03-24 14:58:38.434	2026-03-24 15:04:37.416
cmn4qpaem007187ny43c7ae3m	SBRLSN68H60H501U	Sbarrini	Alessandra	\N	\N	ASO	\N	f	cmn4qpadh006v87nyf943p4x9	2026-03-24 14:58:38.446	2026-03-24 15:04:37.441
cmn4qpafk007487nyjwqy3r2n	CRVGLI68E18H501S	Giulio	Cervelli	\N	\N	medico odontoiatra	\N	f	cmn4qpaf1007287nyzhp9beun	2026-03-24 14:58:38.481	2026-03-24 14:59:03.22
cmn4qpagk007787nyc2en7buu	CHRRST76T24D122W	Ernesto	Chiaravalloti	\N	\N	odontoiatra	\N	f	cmn4qpag2007587nyi0x3s9ic	2026-03-24 14:58:38.516	2026-03-24 14:59:34.19
cmn4qpagw007987nylruol6ip	RCCLNR93L46H501A	Ricciato	Eleonora	\N	\N	ASO	\N	f	cmn4qpag2007587nyi0x3s9ic	2026-03-24 14:58:38.528	2026-03-24 15:04:37.482
cmn4qpahd007b87ny1mhzfm4q	RCCRRA00P63H501Z	Ricciato	Aurora	\N	\N	cso	\N	f	cmn4qpag2007587nyi0x3s9ic	2026-03-24 14:58:38.546	2026-03-24 14:59:03.269
cmn4qpaih007e87nye67o6nz1	CRMNTN74D04F839J	Ciaramella	Antonio	\N	\N	odontoiatra	\N	f	cmn4qpahz007c87ny4vh298fm	2026-03-24 14:58:38.585	2026-03-24 14:59:34.217
cmn4qpait007g87nyi8jp0s3i	TRRSRN77E53H501N	Torregiani	Serena	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpahz007c87ny4vh298fm	2026-03-24 14:58:38.597	2026-03-24 15:04:37.517
cmn4qpaj6007i87nyypsu53d2	VLPMLA92H63H501J	Volpi	Maila	\N	\N	ASO	\N	f	cmn4qpahz007c87ny4vh298fm	2026-03-24 14:58:38.61	2026-03-24 15:04:37.541
cmn4qpaju007l87nyxa5xuwqy	CMNFNC63L18H501W	Cimini	Francesco	\N	\N	odontoiatra	\N	f	cmn4qpajj007j87ny8qlc1w9t	2026-03-24 14:58:38.635	2026-03-24 14:59:34.249
cmn4qpak6007n87nyvrx7ykjo	BLNLGB86R58Z129H	Balan	Alina Gabriela	\N	\N	ASO	\N	f	cmn4qpajj007j87ny8qlc1w9t	2026-03-24 14:58:38.646	2026-03-24 15:04:37.578
cmn4qpal4007q87nyfwmssfio	CCCMGN54T61D773T	Cocchi	Maria Eugenia	\N	\N	medico odontoiatra	\N	f	cmn4qpako007o87nyyk1h2v3n	2026-03-24 14:58:38.68	2026-03-24 14:59:34.28
cmn4qpalf007s87ny9945upvp	BLLDNL63S47H501Q	Bellucci	Daniela	\N	\N	ASO	\N	f	cmn4qpako007o87nyyk1h2v3n	2026-03-24 14:58:38.692	2026-03-24 15:04:37.616
cmn4qpam6007v87nymqs4c757	CCCLSN65A25H501A	Cocco	Alessandro	\N	\N	odontoiatra	\N	f	cmn4qpalv007t87ny3igfa8kn	2026-03-24 14:58:38.718	2026-03-24 15:00:48.268
cmn4qpamh007x87ny7kypo29y	DLGCLD64P43A132F	Del Giovane	Claudia	\N	\N	ASO	\N	f	cmn4qpalv007t87ny3igfa8kn	2026-03-24 14:58:38.73	2026-03-24 15:04:37.646
cmn4qpan5008087nyz5l557eg	CNSGPP72L23H501C	Consoli	Giuseppe	\N	\N	odontoiatra	\N	f	cmn4qpams007y87nydzbxdptx	2026-03-24 14:58:38.754	2026-03-24 14:59:29.987
cmn4qpanv008387nyx4cm98mw	CSMNDR68M21H501L	Cosma	Andrea	\N	\N	odontoiatra	\N	f	cmn4qpanh008187nyj6929ncm	2026-03-24 14:58:38.779	2026-03-24 15:00:48.299
cmn4qpaok008687nyhsgzl8ez	CRSLSU72R47H501P	Cresti	Luisa	\N	\N	odontoiatra	\N	f	cmn4qpao8008487nyw4fmyrfh	2026-03-24 14:58:38.804	2026-03-24 15:00:28.44
cmn4qpaov008887nyfvycvoic	GBTTNA88S46H501R	Gubitoso	Tania	\N	\N	ASO	\N	f	cmn4qpao8008487nyw4fmyrfh	2026-03-24 14:58:38.816	2026-03-24 15:04:37.684
cmn4qpapi008b87ny0e4jwt11	DNTNGL63M04H501I	Angelo	D'antoni	\N	\N	odontoiatra	\N	f	cmn4qpap7008987nymaryy6uf	2026-03-24 14:58:38.838	2026-03-24 15:00:48.325
cmn4qpapr008d87nyi76ijqlr	PZZNTN70M52H501A	Pezzotti	Antonia	\N	\N	ASO	\N	f	cmn4qpap7008987nymaryy6uf	2026-03-24 14:58:38.847	2026-03-24 15:04:37.717
cmn4qpaq0008f87nyd529d9be	WTKMDL77M66Z127Y	Witek	Magdalena	\N	\N	ASO	\N	f	cmn4qpap7008987nymaryy6uf	2026-03-24 14:58:38.857	2026-03-24 15:04:37.743
cmn4qpaq9008h87nyiu56mt0p	GHTNLT84S51Z129E	Ghita	Nicoleta Viorica	\N	\N	ASO	\N	f	cmn4qpap7008987nymaryy6uf	2026-03-24 14:58:38.866	2026-03-24 15:04:37.77
cmn4qpaqo008j87nydr9hm0d8	LMBCHR92H43H501T	Lombardi	Chiara	\N	\N	ASO	\N	f	cmn4qpap7008987nymaryy6uf	2026-03-24 14:58:38.88	2026-03-24 15:04:37.794
cmn4qpar3008l87ny0kxl5gzq	CRDRMR83P42Z602E	Cardoso	Rosemeri Maria	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpap7008987nymaryy6uf	2026-03-24 14:58:38.895	2026-03-24 15:04:37.83
cmn4qparq008o87nyrn97a5hp	DCNNTN65M07H590Y	De Cuntis	Antonio	\N	\N	odontoiatra	\N	f	cmn4qparf008m87nygrmt72ia	2026-03-24 14:58:38.918	2026-03-24 14:59:30.154
cmn4qpas1008q87nyttyc2nbn	GRGGMN74R45H501U	Gregori	Germana	\N	\N	ASO	\N	f	cmn4qparf008m87nygrmt72ia	2026-03-24 14:58:38.93	2026-03-24 15:04:37.872
cmn4qpash008s87nyc35ndnyz	VRNGLI95P52H501U	Vernotti	Giulia	\N	\N	ASO	\N	f	cmn4qparf008m87nygrmt72ia	2026-03-24 14:58:38.945	2026-03-24 15:04:37.91
cmn4qpass008u87ny5iktsdat	SCCLRI87A63H501C	Scaccia	Ilaria	\N	\N	ASO	\N	f	cmn4qparf008m87nygrmt72ia	2026-03-24 14:58:38.956	2026-03-24 15:04:37.95
cmn4qpat5008w87nye9xrszoi	DMRMTN98C69H501R	De Marco	Martina	\N	\N	impiegato	\N	f	cmn4qparf008m87nygrmt72ia	2026-03-24 14:58:38.97	2026-03-24 15:04:37.974
cmn4qpatj008y87nyr58xhn5z	STBPML81P44E958E	Stabile	Pamela	\N	\N	impiegato	\N	f	cmn4qparf008m87nygrmt72ia	2026-03-24 14:58:38.984	2026-03-24 15:04:38.002
cmn4qpauf009187nyr0b9usoe	DCNRND58A01H590R	De Cuntis	Armando	\N	\N	medico odontoiatra	\N	f	cmn4qpau3008z87nyq9qspvpr	2026-03-24 14:58:39.015	2026-03-24 14:59:34.417
cmn4qpav3009487nycyrkhlhj	DFLLRD49L13H501K	De Falco	Alfredo	\N	\N	medico odontoiatra	\N	f	cmn4qpaus009287nyqwm4j256	2026-03-24 14:58:39.039	2026-03-24 14:59:34.445
cmn4qpave009687nybdj4awnu	FSOGMN68D42H501I	Fois	Germana	\N	\N	ASO	\N	f	cmn4qpaus009287nyqwm4j256	2026-03-24 14:58:39.051	2026-03-24 15:04:38.035
cmn4qpawq009987ny8otxe9q8	DSTVCN62L67D086T	De Stefano	Vincenzina	\N	\N	odontoiatra	\N	f	cmn4qpaw2009787nyq40ryzsn	2026-03-24 14:58:39.098	2026-03-24 14:59:03.716
cmn4qpax2009b87ny9rrxd1gt	LMMRLB73T55E919Z	Lemmo	Rosalba	\N	\N	ASO	\N	f	cmn4qpaw2009787nyq40ryzsn	2026-03-24 14:58:39.11	2026-03-24 15:04:38.065
cmn4qpaxo009d87ny4pwofxmx	BRMMRA73B41H501V	Bramucci	Maura	\N	\N	ASO	\N	f	cmn4qpaw2009787nyq40ryzsn	2026-03-24 14:58:39.132	2026-03-24 15:04:38.099
cmn4qpayr009g87nyaismegky	DVCGNN76B05F839A	De Vico	Giovanni	\N	\N	odontoiatra	\N	f	cmn4qpay7009e87nyud0981zw	2026-03-24 14:58:39.171	2026-03-24 15:00:22.762
cmn4qpaz2009i87nylmv6c09f	SCLMLE90D54I537R	Siclari	Emilia	\N	\N	ASO	\N	f	cmn4qpay7009e87nyud0981zw	2026-03-24 14:58:39.182	2026-03-24 15:04:38.131
cmn4qpazk009k87nyk96rwnza	XXXXXX11X11X121X	Gattolla	Carmela	\N	\N	ASO	\N	t	cmn4qpay7009e87nyud0981zw	2026-03-24 14:58:39.2	2026-03-24 15:04:38.156
cmn4qpb07009n87nyicktmogk	DLVBRN57P04H501Y	Bruno	Del Vecchio	\N	\N	medico odontoiatra	\N	f	cmn4qpazw009l87nyrgjavvqz	2026-03-24 14:58:39.224	2026-03-24 14:59:34.508
cmn4qpb0w009q87nyifjvvlyf	DLLNNL65S52F205B	Dell'agnola	Antonella	\N	\N	odontoiatra	\N	f	cmn4qpb0j009o87ny1y5onkqg	2026-03-24 14:58:39.248	2026-03-24 14:59:30.376
cmn4qpb20009t87nyle9vppgm	DLLDNL77T62H501V	Dell'aquila	Daniela	\N	\N	odontoiatra	\N	f	cmn4qpb1g009r87ny4peqlbuz	2026-03-24 14:58:39.289	2026-03-24 15:00:22.789
cmn4qpb2h009v87nyawyfx292	MRALNR82R59H501D	Mauro	Eleonora	\N	\N	\N	\N	t	cmn4qpb1g009r87ny4peqlbuz	2026-03-24 14:58:39.306	2026-03-24 15:04:38.186
cmn4qpb2u009x87ny5ogiyz26	LSSMRA74E56F611V	Alessandris	Mara	\N	\N	ASO	\N	f	cmn4qpb1g009r87ny4peqlbuz	2026-03-24 14:58:39.319	2026-03-24 15:04:38.209
cmn4qpb3o00a087ny1r2qzlf6	DMLSVT60M30H756V	Demelas	Salvatore	\N	\N	odontoiatra	\N	f	cmn4qpb37009y87ny2iqnmsjo	2026-03-24 14:58:39.348	2026-03-24 14:59:34.594
cmn4qpb4a00a287nykqf7no01	SCCGPP66C59D024G	Sacchi	Giuseppina	\N	\N	ASO	\N	f	cmn4qpb37009y87ny2iqnmsjo	2026-03-24 14:58:39.371	2026-03-24 15:04:38.237
cmn4qpb5500a587nysh48mhuo	PVRNRC56L25H501J	Poveromo	Enrico	\N	\N	legale rappresentante	\N	f	cmn4qpb4t00a387nyesq05so7	2026-03-24 14:58:39.401	2026-03-24 14:59:34.637
cmn4qpb5u00a887ny5aitfzd4	DGRDDN71D03H501S	Di Gregorio	Davide Antonio	\N	\N	odontoiatra	\N	f	cmn4qpb5j00a687ny72zy244v	2026-03-24 14:58:39.426	2026-03-24 15:00:48.36
cmn4qpb6g00ab87nyfiqqsix3	DPRPRZ58E52H501I	Di Porto	Patrizia	\N	\N	medico odontoiatra	\N	f	cmn4qpb6500a987nympq3o48y	2026-03-24 14:58:39.449	2026-03-24 14:59:34.678
cmn4qpb7200ae87ny9tedvq9y	DSTMHL67R26L219I	Di Stio	Michele	\N	\N	odontoiatra	\N	f	cmn4qpb6r00ac87nyikckxo7o	2026-03-24 14:58:39.47	2026-03-24 14:59:34.716
cmn4qpb7e00ag87nyxzaxdmle	RRUFNC81D46H501E	Urru	Francesca	\N	\N	ASO	\N	f	cmn4qpb6r00ac87nyikckxo7o	2026-03-24 14:58:39.483	2026-03-24 15:04:38.268
cmn4qpb7x00ai87nyf45wfflc	MRCVLN50A67H501F	Muraca	Evelina	\N	\N	\N	\N	t	cmn4qpb6r00ac87nyikckxo7o	2026-03-24 14:58:39.501	2026-03-24 15:04:38.292
cmn4qpb8c00ak87nyb0h7gqay	SPSLRA70M62H501U	Esposito	Laura	\N	\N	\N	\N	t	cmn4qpb6r00ac87nyikckxo7o	2026-03-24 14:58:39.517	2026-03-24 15:04:38.321
cmn4qpb8v00am87nyfueno4hi	BLLNGL76P68H501V	Bellusci	Angela	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpb6r00ac87nyikckxo7o	2026-03-24 14:58:39.535	2026-03-24 15:04:38.357
cmn4qpb9n00ap87nysgwmmjtc	MCRCTN64R71H501H	Micarelli	Costanza	\N	\N	legale rappresentante	\N	f	cmn4qpb9b00an87nyzmp6922k	2026-03-24 14:58:39.563	2026-03-24 14:59:34.74
cmn4qpbaa00as87nyr6995hxn	DCUVNT79M02H501Y	Duca	Valentino	\N	\N	odontoiatra	\N	f	cmn4qpb9y00aq87nywp60l0le	2026-03-24 14:58:39.586	2026-03-24 14:59:34.765
cmn4qpbb400av87nyi5q08hhc	DRSSNT59D13H501U	Durastante	Sante	\N	\N	medico odontoiatra	\N	f	cmn4qpbap00at87nyjxymme19	2026-03-24 14:58:39.617	2026-03-24 15:00:28.477
cmn4qpbbp00ax87nyb13tti6w	DRSGTA60S57H501V	Durastante	Agata	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpbap00at87nyjxymme19	2026-03-24 14:58:39.638	2026-03-24 15:04:38.394
cmn4qpbca00az87nyxqsbq84h	GLLLVC94P42H501G	Gallinelli	Ludovica	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpbap00at87nyjxymme19	2026-03-24 14:58:39.659	2026-03-24 15:04:38.422
cmn4qpbct00b187nyh4lptdow	TFLLSS00B60C773B	Taflaj	Alessia	\N	\N	ASO	\N	f	cmn4qpbap00at87nyjxymme19	2026-03-24 14:58:39.678	2026-03-24 15:04:38.444
cmn4qpbdi00b487nywa43bbv7	CRBLDI84C47F839P	Corbo	Lidia	\N	\N	legale rappresentante	\N	f	cmn4qpbd700b287ny7rcudb61	2026-03-24 14:58:39.702	2026-03-24 14:59:34.819
cmn4qpbdy00b687nyt9f1ue3m	XXXXXX11X11X122X	Conti	Ivano	\N	\N	direttore sanitario	\N	f	cmn4qpbd700b287ny7rcudb61	2026-03-24 14:58:39.718	2026-03-24 14:59:30.43
cmn4qpbea00b887nydtrxxybq	SDTLFR90D57F206P	Sidoti	Laura	\N	\N	\N	\N	t	cmn4qpbd700b287ny7rcudb61	2026-03-24 14:58:39.731	2026-03-24 15:00:39.477
cmn4qpbex00bb87ny3txbvfb6	FNFVLR93A31H501Z	Valerio	Fanfarillo	\N	\N	odontoiatra	\N	f	cmn4qpbem00b987nyzajzlvu8	2026-03-24 14:58:39.753	2026-03-24 15:00:48.387
cmn4qpbfa00bd87nymtzu13gm	XXXXXX11X11X123X	Silvestri	Tatiana	\N	\N	ASO	\N	t	cmn4qpbem00b987nyzajzlvu8	2026-03-24 14:58:39.766	2026-03-24 15:04:38.479
cmn4qpbfm00bf87nyup15wzta	XXXXXX11X11X124X	Colore	Patrizia	\N	\N	ADDETTO ALLA SEGRETERIA	\N	t	cmn4qpbem00b987nyzajzlvu8	2026-03-24 14:58:39.778	2026-03-24 15:04:38.516
cmn4qpbgb00bi87nysrr8rrzx	FVTMSM68R12H501L	Favetti	Massimiliano	\N	\N	legale rappresentante/odontoiatra	\N	f	cmn4qpbg000bg87ny1dj7tqmn	2026-03-24 14:58:39.803	2026-03-24 14:59:34.87
cmn4qpbh500bl87nyckb6dbfz	CRLPRC74D55H501N	Carletti	Patricia	\N	\N	\N	\N	t	cmn4qpbgp00bj87ny8dzuxnq1	2026-03-24 14:58:39.834	2026-03-24 15:04:38.555
cmn4qpbhj00bn87nyk4dil4gg	CNUDUE93R60Z100S	Cuni	Ueda	\N	\N	\N	\N	t	cmn4qpbgp00bj87ny8dzuxnq1	2026-03-24 14:58:39.848	2026-03-24 15:04:38.58
cmn4qpbhx00bp87nyas2ywvj8	BCCDRH90S45H501R	Bucceri	Deborah	\N	\N	\N	\N	t	cmn4qpbgp00bj87ny8dzuxnq1	2026-03-24 14:58:39.862	2026-03-24 15:04:38.605
cmn4qpbi900br87nyx4ayfj6u	CPPFRC79A67E958H	Cappelli	Federica	\N	\N	\N	\N	t	cmn4qpbgp00bj87ny8dzuxnq1	2026-03-24 14:58:39.874	2026-03-24 15:04:38.628
cmn4qpbin00bt87nycigylsvs	LLRFBN80C58H501F	Ellera	Fabiana	\N	\N	ASO	\N	f	cmn4qpbg000bg87ny1dj7tqmn	2026-03-24 14:58:39.888	2026-03-24 15:04:38.658
cmn4qpbiz00bv87nyhhtoeqgt	FVTLRI01R60H501J	Favetti Giaquinto	Ilaria	\N	\N	impiegato	\N	f	cmn4qpbg000bg87ny1dj7tqmn	2026-03-24 14:58:39.9	2026-03-24 15:04:38.683
cmn4qpbjd00bx87nygkmkwi5a	SNTGLI64H63L310W	Sanetti	Giulia	\N	\N	addetto pulizie	\N	f	cmn4qpbg000bg87ny1dj7tqmn	2026-03-24 14:58:39.914	2026-03-24 15:04:38.707
cmn4qpbk800c087nymnsljwto	RLNSMN87P44F611V	Orlandi	Simona	\N	\N	ASO	\N	f	cmn4qpbjp00by87nytymb1irr	2026-03-24 14:58:39.944	2026-03-24 15:04:38.736
cmn4qpblj00c387ny64mbzh0o	FRRFNC87L42H501U	Ferretti	Francesca	\N	\N	odontoiatra	\N	f	cmn4qpbkp00c187ny7kfeyvhd	2026-03-24 14:58:39.991	2026-03-24 14:59:35.019
cmn4qpbm800c687ny1qgfmq7l	FRIDNL76B28H501R	Fiori	Daniele	\N	\N	odontoiatra	\N	f	cmn4qpblv00c487ny16v1rd6c	2026-03-24 14:58:40.017	2026-03-24 14:59:35.043
cmn4qpbms00c887nygkjyqi71	BNCSMN69H47C773G	Biancucci	Simona	\N	\N	ASO	\N	f	cmn4qpblv00c487ny16v1rd6c	2026-03-24 14:58:40.036	2026-03-24 15:04:38.769
cmn4qpbn900ca87nygg03i5hb	SMMJNB79B50Z127S	Sommerfeld	Joanna Barbara	\N	\N	ASO	\N	f	cmn4qpblv00c487ny16v1rd6c	2026-03-24 14:58:40.053	2026-03-24 15:04:38.796
cmn4qpbo000cd87nyk1xgze4e	FRTFRZ71M23H501R	Forte	Fabrizio	\N	\N	odontoiatra	\N	f	cmn4qpbnn00cb87nyekv1sgvy	2026-03-24 14:58:40.08	2026-03-24 14:59:35.077
cmn4qpboq00cf87nyxp19mxve	CRSFLV90R44H501W	Caruso	Flavia	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpbnn00cb87nyekv1sgvy	2026-03-24 14:58:40.106	2026-03-24 15:04:38.83
cmn4qpbpa00ch87nym3tekzyq	PNCMTN96E44D972P	Pancotti	Martina	\N	\N	ASO	\N	f	cmn4qpbnn00cb87nyekv1sgvy	2026-03-24 14:58:40.126	2026-03-24 15:04:38.861
cmn4qpbpw00ck87ny4o52k5dh	XXXXXX11X11X125X	Imbrioscia	Nicola	\N	\N	odontoiatra	\N	t	cmn4qpbpl00ci87nyzdmn5msm	2026-03-24 14:58:40.148	2026-03-24 14:59:35.106
cmn4qpbq700cm87nym5mm911j	XXXXXX11X11X126X	Sciamanna	Simona	\N	\N	\N	\N	t	cmn4qpbpl00ci87nyzdmn5msm	2026-03-24 14:58:40.16	2026-03-24 15:04:38.9
cmn4qpbqz00cp87ny0ai7m58l	FRLPLA58S56H501W	Fraioli	Paola	\N	\N	medico odontoiatra	\N	f	cmn4qpbqm00cn87nyq6hssxz7	2026-03-24 14:58:40.187	2026-03-24 14:59:35.13
cmn4qpbro00cs87ny8nf5az05	GBRCLD63T01C858G	Gabriele	Claudio	\N	\N	odontoiatra	\N	f	cmn4qpbrc00cq87nyu9c1kbah	2026-03-24 14:58:40.212	2026-03-24 15:00:48.414
cmn4qpbry00cu87ny00kff2dq	PPSRKE79P59A269K	Pep� Sciarria	Erika	\N	\N	ASO	\N	f	cmn4qpbrc00cq87nyu9c1kbah	2026-03-24 14:58:40.223	2026-03-24 15:04:38.937
cmn4qpbst00cx87nyha0bf428	GLLSFN73B17H501I	Galletti	Stefano	\N	\N	odontoiatra	\N	f	cmn4qpbsg00cv87ny3ubnix56	2026-03-24 14:58:40.253	2026-03-24 14:59:35.155
cmn4qpbt600cz87ny7au5wain	MNGMLC70M54H501D	Mangano	Maria Lucia	\N	\N	ASO	\N	f	cmn4qpbsg00cv87ny3ubnix56	2026-03-24 14:58:40.266	2026-03-24 15:04:38.964
cmn4qpbu300d287nyb0sirec5	DCNSLV76P49H501N	Di Censo	Silvia	\N	\N	amministratore	\N	f	cmn4qpbtk00d087nyk3zezz3j	2026-03-24 14:58:40.3	2026-03-24 15:00:48.45
cmn4qpbuk00d487nymow3pr2z	MNTMRZ70E59H501G	Montuori	Marzia	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpbtk00d087nyk3zezz3j	2026-03-24 14:58:40.317	2026-03-24 15:04:38.992
cmn4qpbuw00d687ny54rvn7bq	BSCMNL77C44H501Y	Biscardi	Manuela	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpbtk00d087nyk3zezz3j	2026-03-24 14:58:40.329	2026-03-24 15:04:39.016
cmn4qpbv800d887nyicc7e16a	CHLSRN75C48E958Y	Achilli	Sabrina	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpbtk00d087nyk3zezz3j	2026-03-24 14:58:40.34	2026-03-24 15:04:39.047
cmn4qpbvm00da87ny239lsa52	MNTVNT81M46H501A	Montani	Valentina	\N	\N	ASO	\N	f	cmn4qpbtk00d087nyk3zezz3j	2026-03-24 14:58:40.354	2026-03-24 15:04:39.074
cmn4qpbvx00dc87nykq4gzq0s	ZCCSRN84R51H501V	Zaccagnini	Serena	\N	\N	ASO	\N	f	cmn4qpbtk00d087nyk3zezz3j	2026-03-24 14:58:40.365	2026-03-24 15:04:39.101
cmn4qpbw900de87nyz109l1l8	ZCCMTN89T50H501H	Zaccagnini	Martina	\N	\N	ASO	\N	f	cmn4qpbtk00d087nyk3zezz3j	2026-03-24 14:58:40.378	2026-03-24 15:04:39.126
cmn4qpbwm00dg87ny2wcluw3m	DDTSMN70R41H501S	Diodato	Simona	\N	\N	ASO	\N	f	cmn4qpbtk00d087nyk3zezz3j	2026-03-24 14:58:40.391	2026-03-24 15:04:39.15
cmn4qpbwx00di87nywvgmhjkw	BCCCLL98A69H501X	Bacciali	Camilla	\N	\N	igienista dentale	\N	f	cmn4qpbtk00d087nyk3zezz3j	2026-03-24 14:58:40.402	2026-03-24 15:04:39.181
cmn4qpbxa00dk87nyj56mfqkl	PGNDTL87C68H501D	Pagnozzi	Donatella	\N	\N	ASO	\N	f	cmn4qpbtk00d087nyk3zezz3j	2026-03-24 14:58:40.414	2026-03-24 15:04:39.217
cmn4qpbxz00dn87nyd82glffq	GLLSMN78B17H501M	Gellini	Simone	\N	\N	legale rappresentante/odontoiatra	\N	f	cmn4qpbxn00dl87nytb9ojxv9	2026-03-24 14:58:40.439	2026-03-24 14:59:35.252
cmn4qpbya00dp87nybjh31i8u	GLLDNL80B06H501O	Gellini	Daniele	\N	\N	odontoiatra	\N	f	cmn4qpbxn00dl87nytb9ojxv9	2026-03-24 14:58:40.45	2026-03-24 14:59:30.566
cmn4qpbym00dr87nyf4r0gaqj	CNNMRT88D56H501V	Ciannarella	Marta	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpbxn00dl87nytb9ojxv9	2026-03-24 14:58:40.462	2026-03-24 15:04:39.251
cmn4qpbyy00dt87nyz65g48oa	LDKJNT71S67Z127Y	Oldakowska	Joanna Teresa	\N	\N	ASO	\N	f	cmn4qpbxn00dl87nytb9ojxv9	2026-03-24 14:58:40.474	2026-03-24 15:04:39.275
cmn4qpbzb00dv87nyzyhrw61g	HMDNDA88S53H501X	Hamdi	Nadia	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpbxn00dl87nytb9ojxv9	2026-03-24 14:58:40.487	2026-03-24 15:04:39.306
cmn4qpbzn00dx87nyzcq0o6go	XXXXXX11X11X127X	Dautova	Anna	\N	\N	\N	\N	t	cmn4qpbxn00dl87nytb9ojxv9	2026-03-24 14:58:40.499	2026-03-24 15:04:39.335
cmn4qpc0m00e087nyoz6t8l1p	GNTGLC83B26E958M	Gentile	Gianluca	\N	\N	odontoiatra	\N	f	cmn4qpc0800dy87nylew79qol	2026-03-24 14:58:40.534	2026-03-24 14:59:35.32
cmn4qpc1500e287ny68ge8fb7	ZNZVGN82H54H501Y	Zanzarri	Virginia	\N	\N	\N	\N	t	cmn4qpc0800dy87nylew79qol	2026-03-24 14:58:40.553	2026-03-24 15:04:49.159
cmn4qpc2d00e587nyohjzmkic	SNTDNC91R47C136F	Santoro	Domenica	\N	\N	ASO	\N	f	cmn4qpc1t00e387nyggg4czzt	2026-03-24 14:58:40.598	2026-03-24 15:04:39.383
cmn4qpc2x00e787ny72bvh60m	CPPSNT71D50H501B	Capponi	Simonetta	\N	\N	ASO	\N	f	cmn4qpc0800dy87nylew79qol	2026-03-24 14:58:40.618	2026-03-24 15:04:39.408
cmn4qpc3v00ea87nynovo1ahu	GNTNLN55M30H501C	Gentile	Nicolino	\N	\N	medico odontoiatra	\N	f	cmn4qpc3k00e887ny9lwbzj7u	2026-03-24 14:58:40.652	2026-03-24 15:00:48.481
cmn4qpc4d00ec87ny94tughqd	XXXXXX11X11X128X	Bella	Marzia	\N	\N	ASO	\N	t	cmn4qpc3k00e887ny9lwbzj7u	2026-03-24 14:58:40.669	2026-03-24 15:04:39.435
cmn4qpc4s00ee87ny06h5jzu9	XXXXXX11X11X129X	Dettoli	Antonella	\N	\N	\N	\N	t	cmn4qpc3k00e887ny9lwbzj7u	2026-03-24 14:58:40.685	2026-03-24 15:04:39.463
cmn4qpc5t00eh87nybthfr51j	GNTSRG57H29G273D	Gentilini	Sergio	\N	\N	medico odontoiatra	\N	f	cmn4qpc5800ef87nyqe8uwix1	2026-03-24 14:58:40.721	2026-03-24 14:59:35.383
cmn4qpc6f00ej87nyngmbi2ym	QGLKTA73L58H501E	Quagliarella	Katia	\N	\N	ASO	\N	f	cmn4qpc5800ef87nyqe8uwix1	2026-03-24 14:58:40.743	2026-03-24 15:04:39.493
cmn4qpc6w00el87nyjno92sb5	PZZBBR73D70H501U	Pazzaglia	Barbara	\N	\N	segretaria/aso	\N	f	cmn4qpc5800ef87nyqe8uwix1	2026-03-24 14:58:40.761	2026-03-24 15:04:39.524
cmn4qpc7l00eo87nyiq0lo2tp	GFNLBT68S47H501Q	Gifuni	Elisabetta	\N	\N	odontoiatra	\N	f	cmn4qpc7900em87ny8q3s5xa0	2026-03-24 14:58:40.786	2026-03-24 15:00:48.51
cmn4qpc8700eq87ny97e130ex	XXXXXX11X11X130X	Di Marzio	Giulia	\N	\N	ASO	\N	t	cmn4qpc7900em87ny8q3s5xa0	2026-03-24 14:58:40.807	2026-03-24 15:04:39.549
cmn4qpc8i00es87ny2mkig1b3	XXXXXX11X11X131X	Moro	Siria	\N	\N	ASO	\N	t	cmn4qpc7900em87ny8q3s5xa0	2026-03-24 14:58:40.818	2026-03-24 15:04:39.58
cmn4qpc9a00ev87nyn4rh77xm	GGLGPP62E22H501Y	Giglio	Giuseppe	\N	\N	medico odontoiatra	\N	f	cmn4qpc8u00et87ny65jj2u6i	2026-03-24 14:58:40.846	2026-03-24 14:59:35.479
cmn4qpc9u00ex87nyn4157kgy	RSSSNO78P47E335K	Rossi	Sonia	\N	\N	ASO	\N	f	cmn4qpc8u00et87ny65jj2u6i	2026-03-24 14:58:40.866	2026-03-24 15:04:39.613
cmn4qpca700ez87nyouhkg223	SCHCHR81A56H501Y	Schir�	Chiara	\N	\N	\N	\N	t	cmn4qpc8u00et87ny65jj2u6i	2026-03-24 14:58:40.879	2026-03-24 15:04:39.639
cmn4qpcaw00f287ny2eb08rya	GVNNMR65H57H501B	Giovannelli	Anna Maria	\N	\N	odontoiatra	\N	f	cmn4qpcaj00f087nymuvit3wi	2026-03-24 14:58:40.904	2026-03-24 14:59:30.708
cmn4qpcb800f487nygnbla74w	TSCRRA03P59H501L	Toscano	Aurora	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpcaj00f087nymuvit3wi	2026-03-24 14:58:40.916	2026-03-24 15:04:39.682
cmn4qpcbu00f787nyj83lsm4i	MGGRFL69A71B160Q	Moggio	Raffaella	\N	\N	ASO	\N	f	cmn4qpcbi00f587nyt8zxbl9s	2026-03-24 14:58:40.939	2026-03-24 15:04:39.711
cmn4qpcc600f987nykzqc6g80	MSTTNA71C54D773E	Mastrofini	Tania	\N	\N	ASO	\N	f	cmn4qpcbi00f587nyt8zxbl9s	2026-03-24 14:58:40.951	2026-03-24 15:04:39.754
cmn4qpcd100fc87nywevy5bwm	GRLMNL60A44H501Y	Girelli	Manuela	\N	\N	odontoiatra	\N	f	cmn4qpccj00fa87nyvql299oq	2026-03-24 14:58:40.982	2026-03-24 14:59:35.557
cmn4qpcdp00ff87ny0ivsw28o	GRZFNC68B24H501G	Grezzi	Franco	\N	\N	odontoiatra	\N	f	cmn4qpcdd00fd87ny03tr5p3u	2026-03-24 14:58:41.005	2026-03-24 14:59:35.585
cmn4qpce000fh87ny0memgeng	GRZLRA79A49H501Q	Grezzi	Laura	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpcdd00fd87ny03tr5p3u	2026-03-24 14:58:41.017	2026-03-24 15:04:39.793
cmn4qpced00fj87nyml9adkio	TRSMPL73B64H501U	Tursini	Maria Paola	\N	\N	ASO	\N	f	cmn4qpcdd00fd87ny03tr5p3u	2026-03-24 14:58:41.03	2026-03-24 15:04:39.836
cmn4qpcey00fl87nyjgm71l22	FVRFBL83R49H501D	Favaro	Fabiola	\N	\N	ASO	\N	f	cmn4qpcdd00fd87ny03tr5p3u	2026-03-24 14:58:41.05	2026-03-24 15:04:39.867
cmn4qpcf900fn87nyedi6phj7	VLLSVL69M44Z605Q	Villacis Alava	Silvia Leticia	\N	\N	\N	\N	t	cmn4qpcdd00fd87ny03tr5p3u	2026-03-24 14:58:41.062	2026-03-24 14:59:05.23
cmn4qpcfw00fq87nyk4n2v239	MLRMSM62B21F158R	Malara	Massimo	\N	\N	odontoiatra	\N	f	cmn4qpcfl00fo87ny7txaoyq3	2026-03-24 14:58:41.084	2026-03-24 15:00:48.542
cmn4qpcg800fs87nyvf6nvwxu	BLSNTL89D63Z154S	Bolshakova	Natalia	\N	\N	ASO	\N	f	cmn4qpcfl00fo87ny7txaoyq3	2026-03-24 14:58:41.097	2026-03-24 15:04:39.894
cmn4qpcgt00fu87nyqve4pwql	PRCCLL93S62H501F	Porcu	Camilla	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpcfl00fo87ny7txaoyq3	2026-03-24 14:58:41.117	2026-03-24 15:04:39.917
cmn4qpchd00fw87nyrwekjbwd	BLJRRT00L54H501L	Bolojan	Roberta Livia	\N	\N	ASO	\N	f	cmn4qpcfl00fo87ny7txaoyq3	2026-03-24 14:58:41.137	2026-03-24 15:04:39.958
cmn4qpcia00fz87ny1zw4btd9	QNLMRN63M56H501C	Iaquaniello	Marina	\N	\N	medico odontoiatra	\N	f	cmn4qpchp00fx87nyekfupy7u	2026-03-24 14:58:41.17	2026-03-24 14:59:35.637
cmn4qpcim00g187ny51px34bj	NGOWTT70L49Z127A	Noga	Wioletta Agnieszka	\N	\N	ASO	\N	f	cmn4qpchp00fx87nyekfupy7u	2026-03-24 14:58:41.182	2026-03-24 15:04:40.004
cmn4qpcj700g487ny99ijxonx	RFNNNG57H02F112V	Ierfino	Antonio Gennaro	\N	\N	medico odontoiatra	\N	f	cmn4qpcix00g287nyqzsi254r	2026-03-24 14:58:41.203	2026-03-24 15:00:22.873
cmn4qpcjj00g687ny66otbsad	MTLWNN73B45Z127V	Matlakowska	Ewa Anna	\N	\N	ASO	\N	f	cmn4qpcix00g287nyqzsi254r	2026-03-24 14:58:41.216	2026-03-24 15:04:40.036
cmn4qpck800g987nyeuiptwg9	RSCGNN60E23H501T	Rosicarelli	Giovanni	\N	\N	legale rappresentante	\N	f	cmn4qpcjx00g787nyyw559obs	2026-03-24 14:58:41.24	2026-03-24 14:59:35.696
cmn4qpcky00gc87nyssd881h3	MRRRCM63C01B496E	Marra	Rocco Marciano	\N	\N	legale rappresentante	\N	f	cmn4qpckj00ga87nytee5hznh	2026-03-24 14:58:41.266	2026-03-24 15:00:22.901
cmn4qpclx00gf87ny2ccozdwr	LPCFLV64B24H501A	Lapucci	Flavio	\N	\N	odontoiatra	\N	f	cmn4qpclf00gd87nyne3c3cx6	2026-03-24 14:58:41.302	2026-03-24 15:00:22.936
cmn4qpcmf00gh87nym35v3rjq	SHKSRA91H48Z236B	Shakoor	Saira	\N	\N	ASO	\N	f	cmn4qpclf00gd87nyne3c3cx6	2026-03-24 14:58:41.319	2026-03-24 15:04:40.072
cmn4qpcmp00gj87ny0lpplg5d	SHKSDA89L41Z236A	Shakoor	Saeeda	\N	\N	ASO	\N	f	cmn4qpclf00gd87nyne3c3cx6	2026-03-24 14:58:41.33	2026-03-24 15:04:40.106
cmn4qpcnd00gm87nymq1wfmbq	LTZNTN66E17H501Y	Letizia	Antonio	\N	\N	odontoiatra	\N	f	cmn4qpcn200gk87ny9vulggzt	2026-03-24 14:58:41.353	2026-03-24 15:00:22.963
cmn4qpcnp00go87ny4xp224gt	CRDMRK74R49F880Q	Cardoselli	Marika	\N	\N	ASO	\N	f	cmn4qpcn200gk87ny9vulggzt	2026-03-24 14:58:41.366	2026-03-24 15:04:40.139
cmn4qpcog00gr87nyat6ydhu2	TSTCLD57P54L872E	Testa	Claudia	\N	\N	\N	\N	t	cmn4qpco300gp87nyork2n5cw	2026-03-24 14:58:41.393	2026-03-24 15:00:23.01
cmn4qpcov00gt87nyr5xypc48	LRAGRG98S13H501H	Lauri	Giorgio	\N	\N	odontoiatra	\N	f	cmn4qpco300gp87nyork2n5cw	2026-03-24 14:58:41.407	2026-03-24 14:59:35.873
cmn4qpcp700gv87ny42pu0and	CSCMTN93E41H501U	Cascioli	Martina	\N	\N	ASO	\N	f	cmn4qpco300gp87nyork2n5cw	2026-03-24 14:58:41.42	2026-03-24 15:04:40.183
cmn4qpcpj00gx87nyqdjcn77o	PTRSNN65C66I841C	Petri	Susanna	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpco300gp87nyork2n5cw	2026-03-24 14:58:41.432	2026-03-24 15:04:40.208
cmn4qpcpz00gz87ny98glz6lb	PCCTTN78E65F499X	Pacchiarelli	Tatiana	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpco300gp87nyork2n5cw	2026-03-24 14:58:41.448	2026-03-24 15:04:40.244
cmn4qpcqx00h287nyppkm56mz	MRTMNL92L46C349Q	Maritato	Manuela	\N	\N	odontoiatra	\N	f	cmn4qpcql00h087nyx0zavzok	2026-03-24 14:58:41.482	2026-03-24 14:59:35.897
cmn4qpcr900h487nyyz89h075	WJTMTL91E55Z127T	Wojtal	Marta Oliwia	\N	\N	odontoiatra	\N	f	cmn4qpcql00h087nyx0zavzok	2026-03-24 14:58:41.493	2026-03-24 14:59:35.92
cmn4qpcs900h787nyndmz64pv	MLCSVR79E01H501E	Maluccio	Saverio	\N	\N	odontoiatra	\N	f	cmn4qpcry00h587nyyu5y5xgf	2026-03-24 14:58:41.529	2026-03-24 15:00:23.039
cmn4qpcst00h987nypz669eoj	BBTMHL86L66L682O	Abbate	Michela	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpcry00h587nyyu5y5xgf	2026-03-24 14:58:41.55	2026-03-24 15:04:40.275
cmn4qpcta00hb87nyi0q15gqn	DRCCHR75P55H501Y	De Arcangelis	Chiara	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpcry00h587nyyu5y5xgf	2026-03-24 14:58:41.567	2026-03-24 15:04:40.303
cmn4qpcts00hd87nyv2z6pgqz	PLLMTN88C43H501Q	Pelliccia	Martina	\N	\N	ASO	\N	f	cmn4qpcry00h587nyyu5y5xgf	2026-03-24 14:58:41.585	2026-03-24 15:04:40.328
cmn4qpcuc00hf87nyob4tdgog	RNLLCA90R44H501Z	Rinaldi	Alice	\N	\N	ASO	\N	f	cmn4qpcry00h587nyyu5y5xgf	2026-03-24 14:58:41.604	2026-03-24 15:04:40.353
cmn4qpcv100hi87nymrxrak8l	MRCBRN61H17H501D	Marcelli	Bruno	\N	\N	medico odontoiatra	\N	f	cmn4qpcun00hg87nya2llmqac	2026-03-24 14:58:41.63	2026-03-24 15:00:23.131
cmn4qpcvc00hk87ny8gbdnsrp	MZZPLA66M42H501X	Mazzolini	Paola	\N	\N	ASO	\N	f	cmn4qpcun00hg87nya2llmqac	2026-03-24 14:58:41.641	2026-03-24 15:04:40.383
cmn4qpcvp00hm87ny5xsovzzd	SBBLRI86D45H501F	Sabbetta	Ilaria	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpcun00hg87nya2llmqac	2026-03-24 14:58:41.653	2026-03-24 15:04:40.422
cmn4qpj94019487nycl1bpuah	\N	NUCERA	GIULIA	\N	\N	impiegato	\N	t	cmn4qpj8q019287nyluvawf2h	2026-03-24 14:58:49.912	2026-03-24 15:04:47.726
cmn4qpcw300ho87ny6i0irx0x	RNNFRC77S58D883X	Renna	Federica	\N	\N	ASO	\N	f	cmn4qpcun00hg87nya2llmqac	2026-03-24 14:58:41.667	2026-03-24 15:04:40.449
cmn4qpcwq00hr87ny0srulaw7	MRNMHL69C14H501Y	Marino	Michelangelo	\N	\N	odontoiatra	\N	f	cmn4qpcwe00hp87nybw7e95rf	2026-03-24 14:58:41.691	2026-03-24 14:59:35.998
cmn4qpcx300ht87nyzbp6b5m2	CPCGLI90H54H501L	Capocci	Giulia	\N	\N	ASO	\N	f	cmn4qpcwe00hp87nybw7e95rf	2026-03-24 14:58:41.704	2026-03-24 15:04:40.473
cmn4qpcxf00hv87ny3tb9xt30	MSTSLV81P51L719P	Mastrantonio	Silvia	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpcwe00hp87nybw7e95rf	2026-03-24 14:58:41.715	2026-03-24 15:04:40.497
cmn4qpcxq00hx87nyykb3v0pk	PMPSLV83C52H501O	Pompili	Silvia	\N	\N	ASO	\N	f	cmn4qpcwe00hp87nybw7e95rf	2026-03-24 14:58:41.726	2026-03-24 15:04:40.53
cmn4qpcy500hz87ny77l0atfe	MSTLNR99A60H501A	Mastropietro	Eleonora	\N	\N	ASO	\N	f	cmn4qpcwe00hp87nybw7e95rf	2026-03-24 14:58:41.742	2026-03-24 15:04:40.573
cmn4qpcyp00i187ny0zeekbzg	CRBLSS91D43H501T	Carbone	Alessia	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpcwe00hp87nybw7e95rf	2026-03-24 14:58:41.762	2026-03-24 15:04:40.597
cmn4qpcz800i387nyk966vqyh	CPNSRN88R45I804L	Capuano	Sabrina	\N	\N	\N	\N	t	cmn4qpcwe00hp87nybw7e95rf	2026-03-24 14:58:41.781	2026-03-24 15:04:40.623
cmn4qpd0800i687nyiyv8sa2f	MRNNCL91H45H501E	Marino	Nicole	\N	\N	odontoiatra	\N	f	cmn4qpczk00i487ny1q0b7yow	2026-03-24 14:58:41.816	2026-03-24 15:00:23.166
cmn4qpd0w00i987nypjmk45sv	MRRVCN60S23F112Z	Marrapodi	Vincenzo	\N	\N	medico odontoiatra	\N	f	cmn4qpd0k00i787nyzzrmnx6t	2026-03-24 14:58:41.841	2026-03-24 15:00:48.568
cmn4qpd1800ib87ny46jiejzt	FRTMLN83P68H501N	Fortes Da Luz	Marlene	\N	\N	ASO	\N	f	cmn4qpd0k00i787nyzzrmnx6t	2026-03-24 14:58:41.853	2026-03-24 15:04:40.65
cmn4qpd1w00ie87ny1vun5taq	MRRMTT89P21L419H	Marrocco	Matteo	\N	\N	odontoiatra	\N	f	cmn4qpd1l00ic87ny7xbk8630	2026-03-24 14:58:41.877	2026-03-24 14:59:36.096
cmn4qpd2a00ig87nylfecbcgq	MSLCML70P68F839I	Musella	Carmela	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpd1l00ic87ny7xbk8630	2026-03-24 14:58:41.89	2026-03-24 15:04:40.684
cmn4qpd2y00ij87nylngfwy83	MRTLSN78B51D976F	Martino	Alessandra	\N	\N	odontoiatra	\N	f	cmn4qpd2m00ih87nyaohm5uj0	2026-03-24 14:58:41.914	2026-03-24 15:00:23.208
cmn4qpd4500im87nybcvwjbfj	MZZGNN65M09D086J	Mazzei	Giovanni	\N	\N	odontoiatra	\N	f	cmn4qpd3m00ik87ny1cwoyp62	2026-03-24 14:58:41.957	2026-03-24 15:00:23.236
cmn4qpd4s00ip87ny62o8562r	DNPRFL64D48H501D	Di Napoli	Raffaella	\N	\N	legale rappresentante	\N	f	cmn4qpd4g00in87nyqijjgcb7	2026-03-24 14:58:41.981	2026-03-24 14:59:36.187
cmn4qpd5300ir87nym15x07lu	VDOLLL66M61H501L	Ovidi	Lorella	\N	\N	ASO	\N	f	cmn4qpd4g00in87nyqijjgcb7	2026-03-24 14:58:41.992	2026-03-24 15:04:40.722
cmn4qpd5r00iu87nygb1utvl4	MGLGNN70P12D086Q	Migliano	Giovanni	\N	\N	odontoiatra	\N	f	cmn4qpd5f00is87nym19j0of6	2026-03-24 14:58:42.016	2026-03-24 15:00:23.265
cmn4qpd6100iw87nyd7h836e8	BSTFBL69H68H501E	Bastianelli	Fabiola	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpd5f00is87nym19j0of6	2026-03-24 14:58:42.026	2026-03-24 15:04:40.754
cmn4qpd6d00iy87ny20ap4h4s	GLLJRD79S60Z100R	Agolli	Jorida	\N	\N	ASO	\N	f	cmn4qpd5f00is87nym19j0of6	2026-03-24 14:58:42.037	2026-03-24 15:04:40.783
cmn4qpd6t00j087nyluqi1npi	PGNMRA97B54H501H	Pignani	Maria	\N	\N	ASO	\N	f	cmn4qpd5f00is87nym19j0of6	2026-03-24 14:58:42.053	2026-03-24 15:04:40.806
cmn4qpd7900j287nyj5fnqpa5	XXXXXX11X11X132X	Giacchetti	Sabrina	\N	\N	addetto pulizie	\N	t	cmn4qpd5f00is87nym19j0of6	2026-03-24 14:58:42.069	2026-03-24 14:59:06.033
cmn4qpd8400j587nyyw0oaqgs	MMMFBA78A16Z110S	Mimmocchi	Fabio	\N	\N	odontoiatra	\N	f	cmn4qpd7o00j387nyiedv8bon	2026-03-24 14:58:42.101	2026-03-24 15:00:28.529
cmn4qpd8s00j787nyqv6huyfe	CRAVNT85D53H501Q	Cairo	Valentina	\N	\N	\N	\N	t	cmn4qpd7o00j387nyiedv8bon	2026-03-24 14:58:42.124	2026-03-24 15:04:40.83
cmn4qpd9l00ja87nyfx7yj79v	DNTRLL95M41F611F	D'antoni	Ornella	\N	\N	ASO	\N	f	cmn4qpd9900j887nyy2ovuxav	2026-03-24 14:58:42.154	2026-03-24 15:04:40.863
cmn4qpda700jd87nyrixgq9jx	NRAGCM60E17H501T	Nari	Giacomo	\N	\N	odontoiatra	\N	f	cmn4qpd9w00jb87nydhvunt96	2026-03-24 14:58:42.176	2026-03-24 14:59:36.271
cmn4qpdal00jf87nylqh54eda	MRCFNC73T59C352Q	Marchetti	Francesca	\N	\N	ASO	\N	f	cmn4qpd9w00jb87nydhvunt96	2026-03-24 14:58:42.19	2026-03-24 15:04:40.887
cmn4qpdba00ji87ny22iozvdr	NZZCRL74L03H501L	Nuzzo	Carlo	\N	\N	odontoiatra	\N	f	cmn4qpdax00jg87nyppslibvy	2026-03-24 14:58:42.214	2026-03-24 14:59:36.306
cmn4qpdbn00jk87nyg39ezu87	SGLLLN83M58L182I	Sigillo	Liliana	\N	\N	\N	\N	t	cmn4qpdax00jg87nyppslibvy	2026-03-24 14:58:42.228	2026-03-24 15:04:40.912
cmn4qpdc200jm87ny60cq4eus	VTLVNT94B58H501G	Vitale	Valentina	\N	\N	ASO	\N	f	cmn4qpdax00jg87nyppslibvy	2026-03-24 14:58:42.242	2026-03-24 15:04:40.947
cmn4qpdcj00jo87nyhnobjxdt	PSTFRC94L49C773H	Pastore	Federica	\N	\N	ASO	\N	f	cmn4qpdax00jg87nyppslibvy	2026-03-24 14:58:42.259	2026-03-24 15:04:40.982
cmn4qpddl00jr87nyffarh4ff	MNLMRS75E57H501Q	Emanuele	Mariarosa	\N	\N	ASO	\N	f	cmn4qpdd300jp87ny25xirjtd	2026-03-24 14:58:42.297	2026-03-24 15:04:41.018
cmn4qpde400jt87ny1b73etps	LCCMNC70P59Z129J	Lucaci	Monica	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpdd300jp87ny25xirjtd	2026-03-24 14:58:42.316	2026-03-24 15:04:41.057
cmn4qpdem00jv87nym5op8aeg	CPRRFL60H52H501B	Caporale	Raffaella	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpdd300jp87ny25xirjtd	2026-03-24 14:58:42.335	2026-03-24 15:04:41.091
cmn4qpdf000jx87ny1lnwzinb	XXXXXX11X11X133X	Oprea	Nelea	\N	\N	ADDETTO ALLA SEGRETERIA	\N	t	cmn4qpdd300jp87ny25xirjtd	2026-03-24 14:58:42.348	2026-03-24 15:04:41.129
cmn4qpdg100k087nyutuz2vts	RSNFRZ71H01H501J	Orsini	Fabrizio	\N	\N	odontoiatra	\N	f	cmn4qpdfk00jy87nyd0483yy1	2026-03-24 14:58:42.386	2026-03-24 14:59:36.431
cmn4qpdgj00k287nyqe191f7t	TTVCST69L64H501J	Ottaviani	Cristina	\N	\N	\N	\N	t	cmn4qpdfk00jy87nyd0483yy1	2026-03-24 14:58:42.404	2026-03-24 15:04:41.156
cmn4qpdhi00k587nyua4ns2y4	CNCFNC54P28C677C	Canichella	Franco	\N	\N	medico odontoiatra	\N	f	cmn4qpdh200k387nyahp3rpip	2026-03-24 14:58:42.439	2026-03-24 14:59:36.46
cmn4qpdi200k787nyqfkr8ukt	DPRGPP54H06L182X	De Propris	Giuseppe	\N	\N	medico odontoiatra	\N	f	cmn4qpdh200k387nyahp3rpip	2026-03-24 14:58:42.458	2026-03-24 14:59:36.499
cmn4qpdip00k987nya0djhuq2	SZODLD70C66H501R	Sozio	Adelaide	\N	\N	ASO	\N	f	cmn4qpdh200k387nyahp3rpip	2026-03-24 14:58:42.481	2026-03-24 15:04:41.182
cmn4qpdj200kb87nyvvgqisxo	CTTCLD85S45L182U	Ciattaglia	Claudia	\N	\N	ASO	\N	f	cmn4qpdh200k387nyahp3rpip	2026-03-24 14:58:42.495	2026-03-24 15:04:41.211
cmn4qpdjl00kd87ny5ajqfynj	VSPFBN63T46L182U	Vesprini	Fabiana	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpdh200k387nyahp3rpip	2026-03-24 14:58:42.513	2026-03-24 15:04:41.229
cmn4qpdk000kf87ny289yyk1k	FDRRTI75L64L182Y	Federici	Rita	\N	\N	ASO	\N	f	cmn4qpdh200k387nyahp3rpip	2026-03-24 14:58:42.528	2026-03-24 15:04:41.251
cmn4qpdkj00kh87nyyq0g6ea6	MSCSMN78T43L182I	Maschietti	Simona	\N	\N	ASO	\N	f	cmn4qpdh200k387nyahp3rpip	2026-03-24 14:58:42.547	2026-03-24 15:04:41.275
cmn4qpdl000kj87ny19cjx3oj	LLSSPR81A62Z100T	Lleshi	Shpresa	\N	\N	addetto pulizie	\N	f	cmn4qpdh200k387nyahp3rpip	2026-03-24 14:58:42.565	2026-03-24 15:04:41.299
cmn4qpdlv00km87ny5lhhxolu	CLSSFN66E05H501F	Colasanto	Stefano	\N	\N	odontoiatra	\N	f	cmn4qpdli00kk87nyk3c9swox	2026-03-24 14:58:42.596	2026-03-24 14:59:31.178
cmn4qpdmc00ko87nyrw9vgb6g	CLSSRA74D49H501X	Colasanto	Sara	\N	\N	\N	\N	t	cmn4qpdli00kk87nyk3c9swox	2026-03-24 14:58:42.612	2026-03-24 14:59:31.207
cmn4qpdmn00kq87ny9kl9j7t3	PGIFRC76E53H501D	Piga	Federica	\N	\N	\N	\N	t	cmn4qpdli00kk87nyk3c9swox	2026-03-24 14:58:42.624	2026-03-24 14:59:31.238
cmn4qpdmz00ks87ny89b7u6v0	PMPBBR78L51H501M	Pompei	Barbara	\N	\N	\N	\N	t	cmn4qpdli00kk87nyk3c9swox	2026-03-24 14:58:42.636	2026-03-24 14:59:31.274
cmn4qpdnb00ku87nyfoipskpi	CRTMTN99H42H501V	Cortellesi	Martina	\N	\N	\N	\N	t	cmn4qpdli00kk87nyk3c9swox	2026-03-24 14:58:42.648	2026-03-24 14:59:31.306
cmn4qpdnw00kw87ny6iti2ftj	DMCSRA78C68F205Y	De Michelis	Sara	\N	\N	\N	\N	t	cmn4qpdli00kk87nyk3c9swox	2026-03-24 14:58:42.669	2026-03-24 14:59:31.34
cmn4qpdoy00kz87nyr9p2rreb	BNFGPP47D02H269N	Bonifacio	Giuseppe Maria	\N	\N	medico odontoiatra	\N	f	cmn4qpdok00kx87nycjrpj2i4	2026-03-24 14:58:42.706	2026-03-24 15:00:48.607
cmn4qpdpb00l187nyrm00emo4	RTLMNL51T53H501E	Ortolani	Emanuela	\N	\N	medico odontoiatra	\N	f	cmn4qpdok00kx87nycjrpj2i4	2026-03-24 14:58:42.719	2026-03-24 14:59:36.527
cmn4qpdpy00l387ny74bgk6dd	RSPMNG65T51A192Q	Raspa	Maria Angela	\N	\N	ASO	\N	f	cmn4qpdok00kx87nycjrpj2i4	2026-03-24 14:58:42.742	2026-03-24 15:04:41.328
cmn4qpdqe00l587nyc0wbqsqb	RNNCLN83C52H501N	Irianni	Carolina	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpdok00kx87nycjrpj2i4	2026-03-24 14:58:42.759	2026-03-24 15:04:41.35
cmn4qpdr200l887nyn50l9jfc	PCFDRD81A30H501Z	Pacifici	Edoardo	\N	\N	odontoiatra	\N	f	cmn4qpdqq00l687ny92ou2xfd	2026-03-24 14:58:42.782	2026-03-24 14:59:36.558
cmn4qpdsb00lb87nyu7j8xym8	PLLSRA80S43H501C	Pallante	Sara	\N	\N	odontoiatra	\N	f	cmn4qpdrk00l987nypnkmdo51	2026-03-24 14:58:42.827	2026-03-24 14:59:36.585
cmn4qpdsx00ld87ny3nh22t7t	CRGDNL77E68E958W	Cerigioni	Daniela	\N	\N	ASO	\N	f	cmn4qpdrk00l987nypnkmdo51	2026-03-24 14:58:42.849	2026-03-24 15:04:41.382
cmn4qpdtq00lg87nywk0y6i8m	PLMFNC93S06H501A	Palma	Francesco	\N	\N	odontoiatra	\N	f	cmn4qpdt900le87ny8a1jaule	2026-03-24 14:58:42.879	2026-03-24 14:59:36.614
cmn4qpdu300li87ny7fcpmb3b	FBNCHR97T57H501Y	Fabiano	Chiara	\N	\N	ASO	\N	f	cmn4qpdt900le87ny8a1jaule	2026-03-24 14:58:42.891	2026-03-24 15:04:41.408
cmn4qpdux00ll87ny54ns681i	PNLMSM68R24H501O	Panella	Massimo	\N	\N	odontoiatra	\N	f	cmn4qpduf00lj87nyda7ysdin	2026-03-24 14:58:42.922	2026-03-24 15:00:23.301
cmn4qpdva00ln87nyww5tnucz	FNLSRN90R69A123E	Serena	Fanella	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpduf00lj87nyda7ysdin	2026-03-24 14:58:42.934	2026-03-24 15:04:41.441
cmn4qpdw200lq87ny27zra9n1	PNTFRZ61M13H501A	Panti	Fabrizio	\N	\N	medico odontoiatra	\N	f	cmn4qpdvr00lo87nyhl1lz4vd	2026-03-24 14:58:42.963	2026-03-24 14:59:36.678
cmn4qpdwf00ls87nyqjovoiho	BRTLVI81C57H501X	Bertuccioli	Livia	\N	\N	ASO	\N	f	cmn4qpdvr00lo87nyhl1lz4vd	2026-03-24 14:58:42.976	2026-03-24 15:04:41.465
cmn4qpdx300lv87nyma4c30sx	PSQGDU72A05H501J	Pasquantonio	Guido	\N	\N	odontoiatra	\N	f	cmn4qpdwr00lt87nyx6v3efhl	2026-03-24 14:58:43	2026-03-24 15:00:23.344
cmn4qpdxm00lx87nyb7h84010	MKRLBT59C55Z127Z	Makarska	Elzbieta Grazyna	\N	\N	ASO	\N	f	cmn4qpdwr00lt87nyx6v3efhl	2026-03-24 14:58:43.018	2026-03-24 15:04:41.496
cmn4qpdy600lz87ny0153jeqt	BLJGSZ85M41Z127J	Belej	Agnieszka	\N	\N	ASO	\N	f	cmn4qpdwr00lt87nyx6v3efhl	2026-03-24 14:58:43.038	2026-03-24 15:04:41.523
cmn4qpdyh00m187ny40yukrpw	DLCMYN67L50Z216U	Dela Cruz	Mary Ann Vicente	\N	\N	addetto pulizie	\N	f	cmn4qpdwr00lt87nyx6v3efhl	2026-03-24 14:58:43.05	2026-03-24 15:04:41.561
cmn4qpdzc00m487nyw506ksi8	PDTFNC67R44H501G	Pedoto	Francesca	\N	\N	odontoiatra	\N	f	cmn4qpdyz00m287nym9q3ej1a	2026-03-24 14:58:43.08	2026-03-24 14:59:36.749
cmn4qpdzu00m687nyuaucspw8	PRVGRG78T55D972N	Paravani	Giorgia	\N	\N	ASO	\N	f	cmn4qpdyz00m287nym9q3ej1a	2026-03-24 14:58:43.099	2026-03-24 15:04:41.593
cmn4qpe0i00m987nyq7umeduw	PLLMRA69S10H501S	Pellecchia	Mario	\N	\N	odontoiatra	\N	f	cmn4qpe0700m787ny54lakfau	2026-03-24 14:58:43.122	2026-03-24 14:59:36.776
cmn4qpe1600mc87nyt241rf36	PRNRRG77D07A515Q	Perondi	Arrigo	\N	\N	odontoiatra	\N	f	cmn4qpe0u00ma87ny9tn1861a	2026-03-24 14:58:43.147	2026-03-24 15:00:23.372
cmn4qpe1j00me87nymg4nqtpv	CPRDNI73D65A515C	Cipriani	Dina	\N	\N	ASO	\N	f	cmn4qpe0u00ma87ny9tn1861a	2026-03-24 14:58:43.16	2026-03-24 15:04:41.618
cmn4qpe1v00mg87nymd9sbe5f	FLVKRN76C50Z156O	Fialova	Karin	\N	\N	\N	\N	t	cmn4qpe0u00ma87ny9tn1861a	2026-03-24 14:58:43.171	2026-03-24 15:04:41.642
cmn4qpe2n00mi87nyxq8geysb	XXXXXX11X11X134X	Angelini	Rita	\N	\N	ASO	\N	t	cmn4qpe0u00ma87ny9tn1861a	2026-03-24 14:58:43.199	2026-03-24 15:04:41.666
cmn4qpe3c00ml87nyjq6ethkm	PRSGCR74L29H501Y	Persia	Giancarlo	\N	\N	odontoiatra	\N	f	cmn4qpe2z00mj87nyt8n4zd5a	2026-03-24 14:58:43.224	2026-03-24 15:00:23.405
cmn4qpe3q00mn87nyx3b40kle	FLCMHL87P44H501B	Falconieri	Michela	\N	\N	ASO	\N	f	cmn4qpe2z00mj87nyt8n4zd5a	2026-03-24 14:58:43.239	2026-03-24 15:04:41.692
cmn4qpe4o00mq87ny782u260n	PRZFRZ62B27H501H	Peruzzo	Fabrizio	\N	\N	odontoiatra	\N	f	cmn4qpe4a00mo87nyo1hl4137	2026-03-24 14:58:43.273	2026-03-24 14:59:36.874
cmn4qpe5200ms87ny7lpm9gt8	CRCGCR63R29H501U	Caricilli	Giancarlo	\N	\N	amministrativo	\N	f	cmn4qpe4a00mo87nyo1hl4137	2026-03-24 14:58:43.287	2026-03-24 15:04:41.715
cmn4qpe5v00mv87nyo50kyk2g	PRMLSN80E12H501Y	Piermattei	Alessandro	\N	\N	odontoiatra	\N	f	cmn4qpe5i00mt87nylivrdy5n	2026-03-24 14:58:43.315	2026-03-24 15:00:23.452
cmn4qpe6e00mx87nyzn45kege	CVLMTN94B63H501X	Civello	Martina	\N	\N	ASO	\N	f	cmn4qpe5i00mt87nylivrdy5n	2026-03-24 14:58:43.335	2026-03-24 15:04:41.74
cmn4qpe7200mz87nyq32yglsd	CRTLNE94E54H501J	Corti	Elena	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpe5i00mt87nylivrdy5n	2026-03-24 14:58:43.358	2026-03-24 15:04:41.764
cmn4qpe7s00n287nyfaxgb289	PRLGPP78H02B114C	Aprile	Giuseppe	\N	\N	odontoiatra	\N	f	cmn4qpe7f00n087nymq4h2wv2	2026-03-24 14:58:43.384	2026-03-24 15:00:23.491
cmn4qpe8500n487nygcbcp2np	SNGMRS82L68H501S	Sangiovanni	Mariarosa	\N	\N	\N	\N	t	cmn4qpe7f00n087nymq4h2wv2	2026-03-24 14:58:43.398	2026-03-24 15:04:41.789
cmn4qpe8u00n787ny6aci9ysp	VDOSMN88E46H501S	Ovidi	Simona	\N	\N	odontoiatra	\N	f	cmn4qpe8i00n587ny934u9zky	2026-03-24 14:58:43.423	2026-03-24 15:00:23.541
cmn4qpe9e00n987nykkq1f6cq	SVALNI63M52G111W	Savi	Liana	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpe8i00n587ny934u9zky	2026-03-24 14:58:43.443	2026-03-24 15:04:41.817
cmn4qpea700nc87nyviugn1t4	RSTRDN72S53Z100Q	Rustemaj	Rudina	\N	\N	odontoiatra	\N	f	cmn4qpe9r00na87nyi4t1dyhg	2026-03-24 14:58:43.472	2026-03-24 15:00:23.568
cmn4qpeav00ne87ny09kl72r9	PZZBRC98M50E958Y	Pizzuti	Beatrice	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpe9r00na87nyi4t1dyhg	2026-03-24 14:58:43.495	2026-03-24 15:04:41.843
cmn4qpeb700ng87ny7gnc3sxc	XXXXXX11X11X135X	D'orazio	Daniela	\N	\N	ASO	\N	t	cmn4qpe9r00na87nyi4t1dyhg	2026-03-24 14:58:43.507	2026-03-24 15:04:41.868
cmn4qpebv00nj87ny7hh5o4pe	SNTVCN55D23A515J	Santucci	Vincenzo	\N	\N	odontoiatra	\N	f	cmn4qpebi00nh87nyba6f0t4i	2026-03-24 14:58:43.532	2026-03-24 15:00:28.562
cmn4qpecd00nl87nyvfcrnn9d	SNTMCR65L64H501C	Santucci	Maria Cristina	\N	\N	ASO	\N	f	cmn4qpebi00nh87nyba6f0t4i	2026-03-24 14:58:43.55	2026-03-24 15:04:41.893
cmn4qped200no87nydy9bcwad	LGHSFN63B23H501O	Loghi	Stefano	\N	\N	odontoiatra	\N	f	cmn4qpecs00nm87nysstgsfzo	2026-03-24 14:58:43.574	2026-03-24 14:59:37.043
cmn4qpedh00nq87nyovh99wys	CNLLSA97R62H501I	Canali	Alisea	\N	\N	ASO	\N	f	cmn4qpecs00nm87nysstgsfzo	2026-03-24 14:58:43.589	2026-03-24 15:04:41.917
cmn4qpedt00ns87ny8ozrjcwi	LDAMPL86R65F979K	Ladu	Maria Paola	\N	\N	\N	\N	t	cmn4qpecs00nm87nysstgsfzo	2026-03-24 14:58:43.601	2026-03-24 15:04:41.947
cmn4qpeeh00nv87nyfigf6of3	DMRFBA72E21H501E	De Marchi	Fabio	\N	\N	odontoiatra	\N	f	cmn4qpee500nt87nyy3em1w4k	2026-03-24 14:58:43.626	2026-03-24 15:00:23.613
cmn4qpef700ny87nyunrl6drj	TDSGTN63C02B776A	Tedeschi	Gaetano	\N	\N	impiegato	\N	f	cmn4qpeev00nw87nyuc3feh2d	2026-03-24 14:58:43.652	2026-03-24 15:04:41.976
cmn4qpefp00o087ny6sgi5x0w	TDSVNT60D41B776Z	Tedeschi	Vitantonia	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpee500nt87nyy3em1w4k	2026-03-24 14:58:43.669	2026-03-24 15:04:42.01
cmn4qpeg100o287nybtkvtd6e	TDSGLI94C42H501C	Tedeschi	Giulia	\N	\N	odontoiatra	\N	f	cmn4qpeev00nw87nyuc3feh2d	2026-03-24 14:58:43.681	2026-03-24 15:00:23.684
cmn4qpegn00o587nyp31izq2v	PLNMRC60A24H501Z	Paoloni	Marco	\N	\N	legale rappresentante	\N	f	cmn4qpegc00o387nyl4svxrm3	2026-03-24 14:58:43.703	2026-03-24 14:59:37.095
cmn4qpegz00o787nym3b0gp60	GTTRMN97D62H501G	Gatta	Ramona	\N	\N	ASO	\N	f	cmn4qpegc00o387nyl4svxrm3	2026-03-24 14:58:43.715	2026-03-24 15:04:42.044
cmn4qpehg00o987nyrdks3ztu	DGLFNC81R41L719W	Francesca	Di Giulio	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpegc00o387nyl4svxrm3	2026-03-24 14:58:43.732	2026-03-24 15:04:42.083
cmn4qpehu00ob87nyvymqs5x2	RNZFNC88R62L719L	Francesca	Renzi	\N	\N	office manager	\N	f	cmn4qpegc00o387nyl4svxrm3	2026-03-24 14:58:43.746	2026-03-24 15:04:42.114
cmn4qpeih00oe87nybel8mrwe	SNTLSN70D44H501C	Santini	Alessandra	\N	\N	ASO	\N	f	cmn4qpei500oc87nysmv7af3g	2026-03-24 14:58:43.77	2026-03-24 15:04:42.153
cmn4qpej300oh87ny827lno4x	RCCNNI57B18H443T	Ricci	Nino	\N	\N	medico odontoiatra	\N	f	cmn4qpeir00of87nycli4tqi4	2026-03-24 14:58:43.791	2026-03-24 15:00:23.713
cmn4qpeju00ok87ny1ngzvx7y	RCCPLA55L24H501J	Ricci	Paolo	\N	\N	medico odontoiatra	\N	f	cmn4qpejf00oi87ny42qc4p4s	2026-03-24 14:58:43.818	2026-03-24 15:00:23.749
cmn4qpekb00om87nyuaxbvyjp	VCCMRC91B27H501W	Vaccarini	Marco	\N	\N	\N	\N	t	cmn4qpejf00oi87ny42qc4p4s	2026-03-24 14:58:43.836	2026-03-24 14:59:31.522
cmn4qpeks00oo87nyd61np16d	RMRLBT92D50Z611F	Romero Paucar	Lizbeth	\N	\N	\N	\N	t	cmn4qpejf00oi87ny42qc4p4s	2026-03-24 14:58:43.853	2026-03-24 15:04:42.199
cmn4qpel400oq87nya28enn7o	MNTCST90M41B474R	Monteneri	Celeste	\N	\N	aso/segretaria	\N	f	cmn4qpejf00oi87ny42qc4p4s	2026-03-24 14:58:43.864	2026-03-24 15:04:42.222
cmn4qpelg00os87nyve86g94w	XXXXXX11X11X136X	Ansaloni	Elisa	\N	\N	ASO	\N	t	cmn4qpejf00oi87ny42qc4p4s	2026-03-24 14:58:43.877	2026-03-24 15:04:42.246
cmn4qpelt00ou87nys2ksx2s7	CTPMNJ92E44Z611Y	Cutipa Luque	Mariana Janet	\N	\N	ASO	\N	f	cmn4qpejf00oi87ny42qc4p4s	2026-03-24 14:58:43.89	2026-03-24 15:04:42.275
cmn4qpem400ow87ny7fwynf0c	MTKTMN89T46Z254M	Matikashvili	Tamuna	\N	\N	ASO	\N	f	cmn4qpejf00oi87ny42qc4p4s	2026-03-24 14:58:43.9	2026-03-24 15:04:42.32
cmn4qpemh00oy87nyleuozoet	RCCMNL84E61C773Z	Rocchetti	Emanuela	\N	\N	\N	\N	t	cmn4qpejf00oi87ny42qc4p4s	2026-03-24 14:58:43.914	2026-03-24 15:04:42.521
cmn4qpemt00p087ny1inbzln4	GVLNTS90M60E472A	Gavillucci	Anastasia	\N	\N	\N	\N	t	cmn4qpejf00oi87ny42qc4p4s	2026-03-24 14:58:43.926	2026-03-24 14:59:31.584
cmn4qpenr00p387nyfityawy7	RCCVLR73P08H501P	Ricciardi	Valerio	\N	\N	odontoiatra	\N	f	cmn4qpen500p187nyi8bk7m6y	2026-03-24 14:58:43.96	2026-03-24 15:00:23.789
cmn4qpeoo00p687nyxq7vi86r	XXXXXX11X11X137X	Vigil De Quinones Otero	Carlos	\N	\N	odontoiatra	\N	f	cmn4qpeo700p487nykbtpf071	2026-03-24 14:58:43.992	2026-03-24 14:59:37.214
cmn4qpep500p887nylcgd3cho	MRCRMN85A48H501A	Marucchi	Romina	\N	\N	\N	\N	t	cmn4qpeo700p487nykbtpf071	2026-03-24 14:58:44.009	2026-03-24 14:59:31.609
cmn4qpepn00pa87ny66xboofc	CHRMRT83M43Z129C	Chira	Marta	\N	\N	ASO	\N	f	cmn4qpeo700p487nykbtpf071	2026-03-24 14:58:44.027	2026-03-24 15:04:42.56
cmn4qpeqt00pd87nyl3zq8zbi	RGLTNS73T52Z133Y	Rogalla	Tatiana Isabella	\N	\N	odontoiatra	\N	f	cmn4qpeq800pb87nyu4hpt5u3	2026-03-24 14:58:44.07	2026-03-24 14:59:37.239
cmn4qperu00pg87nymwhjig2q	RSSMCL61D12H501L	Rossi	Marcello	\N	\N	medico odontoiatra	\N	f	cmn4qperb00pe87nyfd5qummn	2026-03-24 14:58:44.106	2026-03-24 15:00:23.819
cmn4qpesa00pi87nyy2j3aaqo	RSSRCR73R23H501E	Rossi	Riccardo	\N	\N	odontoiatra	\N	f	cmn4qperb00pe87nyfd5qummn	2026-03-24 14:58:44.122	2026-03-24 15:00:23.857
cmn4qpeso00pk87nykztc06jm	BGLBBR76M52H501V	Biagioli	Barbara	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qperb00pe87nyfd5qummn	2026-03-24 14:58:44.136	2026-03-24 15:04:42.593
cmn4qpet400pm87nyetzhoj16	FBNFNC90T49H501L	Fabiani	Francesca	\N	\N	ASO	\N	f	cmn4qperb00pe87nyfd5qummn	2026-03-24 14:58:44.153	2026-03-24 15:04:42.658
cmn4qpetw00pp87nydo9psirr	DPLGFR60A22H501B	De Paolis	Gianfranco	\N	\N	direttore sanitario	\N	f	cmn4qpetk00pn87nyaftefac0	2026-03-24 14:58:44.181	2026-03-24 14:59:31.632
cmn4qpeue00pr87nyymmfs2cq	XXXXXX11X11X138X	Sellati	Sandro	\N	\N	titolare	\N	t	cmn4qpetk00pn87nyaftefac0	2026-03-24 14:58:44.199	2026-03-24 14:59:07.625
cmn4qpeuu00pt87nyj6eoisnt	GRGRMO61A30A132V	Giorgi	Romeo	\N	\N	titolare	\N	f	cmn4qpetk00pn87nyaftefac0	2026-03-24 14:58:44.215	2026-03-24 14:59:37.308
cmn4qpevc00pv87ny9lxxqpq8	PNRMRN93H62L259V	Panariello	Marina	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpetk00pn87nyaftefac0	2026-03-24 14:58:44.232	2026-03-24 15:04:42.689
cmn4qpevm00px87nyzonwycoo	SLLMTN93H46H501Q	Sellati	Martina	\N	\N	ASO	\N	f	cmn4qpetk00pn87nyaftefac0	2026-03-24 14:58:44.243	2026-03-24 15:04:42.712
cmn4qpevy00pz87nynutssc3k	ZCCGRG91E43A132W	Zaccaria	Giorgia	\N	\N	ASO	\N	f	cmn4qpetk00pn87nyaftefac0	2026-03-24 14:58:44.254	2026-03-24 15:04:42.772
cmn4qpewr00q287nyk5kriswe	RGBGLN73H70L424J	Rugo Barzanai	Giuliana	\N	\N	odontoiatra	\N	f	cmn4qpewb00q087nyt48ahmey	2026-03-24 14:58:44.283	2026-03-24 15:00:23.893
cmn4qpexk00q487ny8hwf95r5	SCRRMN87P54H501D	Scardella	Ramona	\N	\N	\N	\N	t	cmn4qpewb00q087nyt48ahmey	2026-03-24 14:58:44.312	2026-03-24 15:04:42.803
cmn4qpeyh00q787ny9e7ej35y	FDRVNC91A59H501G	Federici	Veronica	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpexw00q587ny7kl0bubh	2026-03-24 14:58:44.346	2026-03-24 15:04:42.842
cmn4qpeyt00q987nyldarw0o8	XXXXXX11X11X139X	Falasca	Rachele	\N	\N	\N	\N	t	cmn4qpexw00q587ny7kl0bubh	2026-03-24 14:58:44.358	2026-03-24 15:04:42.875
cmn4qpezq00qc87nyubisut4t	SBBDVD88H21H501R	Sabbatini	Davide	\N	\N	odontoiatra	\N	f	cmn4qpez600qa87nykhmml9up	2026-03-24 14:58:44.39	2026-03-24 15:00:48.638
cmn4qpf0400qe87nyb6h8mc2m	SBBLCN60H29Z103Z	Sabbatini	Luciano	\N	\N	cso	\N	f	cmn4qpez600qa87nykhmml9up	2026-03-24 14:58:44.405	2026-03-24 15:04:42.91
cmn4qpf0g00qg87ny09d2yru4	SCLVNC89P68H501H	Scial�	Veronica	\N	\N	ASO	\N	f	cmn4qpez600qa87nykhmml9up	2026-03-24 14:58:44.417	2026-03-24 15:04:42.949
cmn4qpf1900qj87ny7a8omfp5	SCCLGU61C29H501Z	Sacco	Luigi	\N	\N	odontoiatra	\N	f	cmn4qpf0r00qh87nywt9yc84z	2026-03-24 14:58:44.445	2026-03-24 14:59:37.401
cmn4qpf1k00ql87nyvmsllipe	MSNSLV77D55H501M	Masina	Silvia	\N	\N	ASO	\N	f	cmn4qpf0r00qh87nywt9yc84z	2026-03-24 14:58:44.457	2026-03-24 15:04:42.987
cmn4qpf1y00qn87nyqr1q0lpo	VRDDNL77B51H501N	Verducci	Daniela	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpf0r00qh87nywt9yc84z	2026-03-24 14:58:44.47	2026-03-24 15:04:43.022
cmn4qpf2q00qq87nyvca5mxa4	SLVCNZ60R68H501S	Salvatori	Cinzia	\N	\N	odontoiatra	\N	f	cmn4qpf2900qo87nyg43wwuq8	2026-03-24 14:58:44.499	2026-03-24 14:59:31.707
cmn4qpf3l00qt87ny1qvjh8xj	PRTMND44P61D211W	Perticaroli	Miranda	\N	\N	legale rappresentante	\N	f	cmn4qpf3200qr87nym8b4yuri	2026-03-24 14:58:44.529	2026-03-24 14:59:37.429
cmn4qpf3x00qv87nywpa2o9v5	PRTMRN60H58H501N	Perticaroli	Marina	\N	\N	socio	\N	f	cmn4qpf3200qr87nym8b4yuri	2026-03-24 14:58:44.542	2026-03-24 14:59:37.453
cmn4qpf4r00qy87nyjsnqv1el	TRCMRC68T08H703P	Turco	Marco	\N	\N	legale rappresentante	\N	f	cmn4qpf4900qw87nyoltpuv78	2026-03-24 14:58:44.571	2026-03-24 14:59:31.756
cmn4qpf5800r087ny1gdw5ujf	KLNSBD79T10Z148O	Kalinovski	Slobodan	\N	\N	direttore sanitario	\N	f	cmn4qpf4900qw87nyoltpuv78	2026-03-24 14:58:44.589	2026-03-24 14:59:31.778
cmn4qpf5p00r287ny2jltp3zr	PLCMRC89E14H501E	Pulcinelli	Marco	\N	\N	ASO	\N	f	cmn4qpf4900qw87nyoltpuv78	2026-03-24 14:58:44.605	2026-03-24 15:04:43.057
cmn4qpf6000r487ny72jad2rr	CCERMN87D62D810C	Ceci	Ramona	\N	\N	ASO	\N	f	cmn4qpf4900qw87nyoltpuv78	2026-03-24 14:58:44.617	2026-03-24 15:04:43.099
cmn4qpf7100r787nycnx79usl	SRZDVD67A22L682H	Sarzi	David Amad�	\N	\N	odontoiatra	\N	f	cmn4qpf6i00r587ny1fd2yl98	2026-03-24 14:58:44.653	2026-03-24 14:59:37.528
cmn4qpf7l00r987ny2e5kncwx	BCCMTN86L63H501E	Buccioni	Martina	\N	\N	ASO	\N	f	cmn4qpf6i00r587ny1fd2yl98	2026-03-24 14:58:44.673	2026-03-24 15:04:43.136
cmn4qpf8c00rc87nywt6od9nv	SBRMSM66B22H501B	Sbraga	Massimo	\N	\N	odontoiatra	\N	f	cmn4qpf7y00ra87nygms5n2ve	2026-03-24 14:58:44.701	2026-03-24 14:59:37.572
cmn4qpf8o00re87nyjwob3fbl	CRBPLA69H64H501N	Carboni	Paola	\N	\N	ASO	\N	f	cmn4qpf7y00ra87nygms5n2ve	2026-03-24 14:58:44.712	2026-03-24 15:04:43.175
cmn4qpf8z00rg87nyastsd922	CHRSNK73B65Z129Z	Chiorpec	Susana Klara	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpf7y00ra87nygms5n2ve	2026-03-24 14:58:44.724	2026-03-24 15:04:43.208
cmn4qpfa800rj87nynocxj0l8	SCNGPP65B15D332G	Scionti	Giuseppe	\N	\N	odontoiatra	\N	f	cmn4qpf9m00rh87nyim5py62z	2026-03-24 14:58:44.768	2026-03-24 14:59:31.874
cmn4qpfb100rm87ny5ouap3ib	SCICLD71T41H501U	Sica	Claudia	\N	\N	odontoiatra	\N	f	cmn4qpfai00rk87nyy51f0l6b	2026-03-24 14:58:44.797	2026-03-24 15:00:48.666
cmn4qpfbo00rp87nygrk434r2	XXXXXX11X11X140X	Silvestro	Giuseppina	\N	\N	odontoiatra	\N	f	cmn4qpfbd00rn87ny7x6l01bw	2026-03-24 14:58:44.82	2026-03-24 14:59:08.031
cmn4qpfc200rr87ny1mvyrhac	XXXXXX11X11X141X	Piras	Pasqualino	\N	\N	odontoiatra	\N	f	cmn4qpfbd00rn87ny7x6l01bw	2026-03-24 14:58:44.835	2026-03-24 14:59:08.043
cmn4qpfce00rt87nyahun5zrx	MTARRT80M63H501W	Amato	Roberta	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpfbd00rn87ny7x6l01bw	2026-03-24 14:58:44.847	2026-03-24 15:04:43.239
cmn4qpfcq00rv87nydg8annsn	RSILNR96P59H501N	Risio	Eleonora	\N	\N	ASO	\N	f	cmn4qpfbd00rn87ny7x6l01bw	2026-03-24 14:58:44.859	2026-03-24 15:04:43.279
cmn4qpfde00ry87ny6c8bu6b6	GLLLCU67A09E958D	Gallenzi	Luca	\N	\N	legale rappresentante	\N	f	cmn4qpfd200rw87nyaph1bhvq	2026-03-24 14:58:44.882	2026-03-24 15:00:23.952
cmn4qpfdo00s087nyy4qx5ke2	SRVRNN77L67A132S	Servadio	Arianna	\N	\N	ASO	\N	f	cmn4qpfd200rw87nyaph1bhvq	2026-03-24 14:58:44.893	2026-03-24 15:04:43.31
cmn4qpfec00s387nyrnpt3i40	RSSCHR93C54I992E	Rossi	Chiara	\N	\N	legale rappresentante	\N	f	cmn4qpfe000s187nyr8qry0es	2026-03-24 14:58:44.916	2026-03-24 14:59:37.701
cmn4qpfeq00s587ny2som67vu	TMSGNN66R52H501G	Tomassini	Gianna	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpfe000s187nyr8qry0es	2026-03-24 14:58:44.93	2026-03-24 15:04:43.347
cmn4qpfff00s887nyd79endhw	SPNLSN68L53H501M	Spinetti	Alessandra	\N	\N	odontoiatra	\N	f	cmn4qpff200s687nym78148kq	2026-03-24 14:58:44.956	2026-03-24 14:59:37.753
cmn4qpffp00sa87nyvbwfslju	DMCLRA64M60H501D	Di Michele	Laura	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpff200s687nym78148kq	2026-03-24 14:58:44.966	2026-03-24 15:04:43.376
cmn4qpfg200sc87nyv4y4risy	XXXXXX11X11X142X	Carrus	Stefania	\N	\N	\N	\N	t	cmn4qpff200s687nym78148kq	2026-03-24 14:58:44.978	2026-03-24 15:04:43.404
cmn4qpfh200sf87ny1ivtdibg	SCRBRN63H03H558A	Scarf�	Bruno	\N	\N	legale rappresentante	\N	f	cmn4qpfgr00sd87nyb1z8xk10	2026-03-24 14:58:45.015	2026-03-24 14:59:08.225
cmn4qpfhf00sh87nym76o20pj	NGLCLD87L28E958J	Angelini	Claudio	\N	\N	direttore sanitario	\N	f	cmn4qpfgr00sd87nyb1z8xk10	2026-03-24 14:58:45.027	2026-03-24 14:59:31.969
cmn4qpfhq00sj87nydsi90qnu	FDLPRZ60A52H501K	Fedeli	Patrizia	\N	\N	ASO	\N	f	cmn4qpfgr00sd87nyb1z8xk10	2026-03-24 14:58:45.039	2026-03-24 15:04:43.438
cmn4qpfiz00sm87ny1zdmolu8	PTRMRP67H67H501R	Pietropaoli	Maria Pia	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpfim00sk87nya4cyt3dn	2026-03-24 14:58:45.084	2026-03-24 15:04:43.463
cmn4qpfje00so87nyyknh12s9	BVNDMR74C53D708A	Bovenzi	Diomira	\N	\N	ASO	\N	f	cmn4qpfim00sk87nya4cyt3dn	2026-03-24 14:58:45.098	2026-03-24 15:04:43.49
cmn4qpfjs00sq87nykv8be4pf	LMWNNA63T55Z127J	Limowska	Anna	\N	\N	ASO	\N	t	cmn4qpfim00sk87nya4cyt3dn	2026-03-24 14:58:45.113	2026-03-24 15:04:43.528
cmn4qpfkf00st87nyonv3j9jz	FNFTNN64A15E204N	Fanfarillo	Tonino	\N	\N	odontoiatra	\N	f	cmn4qpfk300sr87nyr8yt2fl1	2026-03-24 14:58:45.135	2026-03-24 14:59:37.839
cmn4qpfl200sv87ny12hq98p1	FNFSNT75E45H501I	Fanfarillo	Simonetta	\N	\N	ASO	\N	f	cmn4qpfk300sr87nyr8yt2fl1	2026-03-24 14:58:45.158	2026-03-24 15:04:43.561
cmn4qpfle00sx87nysu305ftd	CHRBBR81E56H501D	Chiarlitti	Barbara	\N	\N	ASO	\N	f	cmn4qpfk300sr87nyr8yt2fl1	2026-03-24 14:58:45.171	2026-03-24 15:04:43.598
cmn4qpfls00sz87nyg95r74id	CMSVNC84S56H501R	Camuso	Veronica	\N	\N	ASO	\N	f	cmn4qpfk300sr87nyr8yt2fl1	2026-03-24 14:58:45.185	2026-03-24 15:04:43.633
cmn4qpfm800t187ny3l5hxo3k	BRNLRI94C56D773S	Bernabei	Ilaria	\N	\N	ASO	\N	f	cmn4qpfk300sr87nyr8yt2fl1	2026-03-24 14:58:45.201	2026-03-24 15:04:43.667
cmn4qpfng00t487ny0969j3o2	GLLRSN70D53G734N	Gullone	Rosina	\N	\N	legale rappresentante	\N	f	cmn4qpfmu00t287nyc8qnoav1	2026-03-24 14:58:45.244	2026-03-24 15:00:28.591
cmn4qpfo300t687ny614ihhvs	PDRMRM74B55Z129D	Paduraru	Maria Ramona	\N	\N	addetto pulizie	\N	f	cmn4qpfmu00t287nyc8qnoav1	2026-03-24 14:58:45.267	2026-03-24 15:04:43.715
cmn4qpfp200t987nyc27vqdyw	TRCFNC68T51H501V	Tirocchi	Francesca	\N	\N	odontoiatra	\N	f	cmn4qpfof00t787nylifue82z	2026-03-24 14:58:45.302	2026-03-24 14:59:32.067
cmn4qpfpp00tb87nywp51fk5i	SLVFST85T48A323Q	Silvestri	Fausta	\N	\N	ASO	\N	f	cmn4qpfof00t787nylifue82z	2026-03-24 14:58:45.325	2026-03-24 15:04:43.742
cmn4qpfqb00td87nyh61a0n9h	VLLSNN62M56A341M	Vellitri	Susanna	\N	\N	ASO	\N	f	cmn4qpfof00t787nylifue82z	2026-03-24 14:58:45.347	2026-03-24 15:04:43.768
cmn4qpfr300tg87nyectldh5f	TCCLNS47D27C352B	Tucci	Alfonso	\N	\N	medico odontoiatra	\N	f	cmn4qpfqt00te87nynripi5fx	2026-03-24 14:58:45.375	2026-03-24 14:59:37.894
cmn4qpfrf00ti87ny9z0zz5pu	KSHNLY82A51Z138W	Kashuba	Nataliya	\N	\N	ASO	\N	f	cmn4qpfqt00te87nynripi5fx	2026-03-24 14:58:45.388	2026-03-24 15:04:43.818
cmn4qpfs400tl87ny3nvsxozh	VLIMSM67T04H501L	Viola	Massimo	\N	\N	odontoiatra	\N	f	cmn4qpfrq00tj87ny0qbev2vv	2026-03-24 14:58:45.412	2026-03-24 14:59:32.145
cmn4qpfsh00tn87nyifoslt5i	SLNCMN74S47Z129W	Silion	Carmen	\N	\N	ASO	\N	f	cmn4qpfrq00tj87ny0qbev2vv	2026-03-24 14:58:45.425	2026-03-24 15:04:43.853
cmn4qpfst00tp87nyl758591z	GTTSNT64R52H501G	Gatto	Simonetta	\N	\N	ASO	\N	f	cmn4qpfrq00tj87ny0qbev2vv	2026-03-24 14:58:45.438	2026-03-24 15:04:43.887
cmn4qpft500tr87ny7wqestf0	XXXXXX11X11X143X	Butano	Francesca	\N	\N	ADDETTO ALLA SEGRETERIA	\N	t	cmn4qpfrq00tj87ny0qbev2vv	2026-03-24 14:58:45.45	2026-03-24 15:04:43.916
cmn4qpfub00tu87nyqn1ospue	SZZSRG86R14H501Z	Sozzi	Sergio	\N	\N	odontoiatra	\N	f	cmn4qpftr00ts87ny21tcjp1u	2026-03-24 14:58:45.491	2026-03-24 14:59:37.958
cmn4qpfur00tw87nybu5tx1nb	CSLBBR98L61H501A	Casalino	Barbara	\N	\N	ASO	\N	f	cmn4qpftr00ts87ny21tcjp1u	2026-03-24 14:58:45.507	2026-03-24 15:04:43.946
cmn4qpfv200ty87nygwyi9g07	CBTNAA97D48Z140S	Ciubotaru	Ana	\N	\N	ASO	\N	f	cmn4qpftr00ts87ny21tcjp1u	2026-03-24 14:58:45.518	2026-03-24 15:04:43.98
cmn4qpfvo00u187nyur4665tp	MCCLCU85R58H501H	Mocciaro	Lucia	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpfvd00tz87nym3uf7lir	2026-03-24 14:58:45.54	2026-03-24 15:04:44.031
cmn4qpfvz00u387nycgm83dbp	DMLSNO88M65Z614H	Di Miele Osorio	Sonia	\N	\N	ASO	\N	f	cmn4qpftr00ts87ny21tcjp1u	2026-03-24 14:58:45.552	2026-03-24 15:04:44.054
cmn4qpfwc00u587nyb9ghglgm	\N	Pomante	Sara	\N	\N	ADDETTO ALLA SEGRETERIA	\N	t	cmn4qpftr00ts87ny21tcjp1u	2026-03-24 14:58:45.564	2026-03-24 15:04:44.091
cmn4qpfwy00u887nygmivbx9t	VLPSFN62P05H501R	Volpe	Stefano	\N	\N	medico odontoiatra	\N	f	cmn4qpfwo00u687nya3iavox6	2026-03-24 14:58:45.586	2026-03-24 14:59:32.197
cmn4qpfxa00ua87ny737vgxoi	CVCRKE98E70H501Q	Iacovacci	Erika	\N	\N	ASO	\N	f	cmn4qpfwo00u687nya3iavox6	2026-03-24 14:58:45.598	2026-03-24 15:04:44.127
cmn4qpfxw00ud87nyi50hitov	SGRFNC63S13H501H	Sagarriga Visconti	Francesco	\N	\N	legale rappresentante	\N	f	cmn4qpfxl00ub87ny9242ts4q	2026-03-24 14:58:45.621	2026-03-24 15:00:23.979
cmn4qpfyd00uf87nydnv55fwl	FRNSNO73H55H501V	Francavilla	Sonia	\N	\N	ASO	\N	f	cmn4qpfxl00ub87ny9242ts4q	2026-03-24 14:58:45.638	2026-03-24 15:04:44.158
cmn4qpfza00ui87nyn3jbs2uh	DLLNTN46R03A662O	Della Gatta	Antonio	\N	\N	legale rappresentante	\N	f	cmn4qpfyy00ug87nytcly50up	2026-03-24 14:58:45.671	2026-03-24 15:00:24.005
cmn4qpfzl00uk87nyawvja1oi	PGLCLT99P67H501K	Paglia	Carlotta	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpfyy00ug87nytcly50up	2026-03-24 14:58:45.682	2026-03-24 15:04:44.193
cmn4qpg0800un87nyz49fmt8c	LTRLGU78D19G942L	Altieri	Luigi	\N	\N	legale rappresentante	\N	f	cmn4qpfzx00ul87nywa31usza	2026-03-24 14:58:45.704	2026-03-24 15:00:24.032
cmn4qpg0k00up87nymov9egbc	GLNRRT85M61H501C	Giuliani	Roberta	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpfzx00ul87nywa31usza	2026-03-24 14:58:45.716	2026-03-24 15:04:44.219
cmn4qpg1900us87ny90zslxsa	MLCRRT93H61F112G	Meleca	Roberta	\N	\N	legale rappresentante	\N	f	cmn4qpg0v00uq87nyblbf72pw	2026-03-24 14:58:45.742	2026-03-24 15:00:24.065
cmn4qpg1v00uv87nycm5pfuxq	MTNMCN74R59H501M	Antinori	Monica	\N	\N	ginecologa	\N	f	cmn4qpg1l00ut87nyo7hdy9w0	2026-03-24 14:58:45.763	2026-03-24 15:00:24.093
cmn4qpg2i00uy87nyusmfohr0	CRNLGU62B09F065V	Corinto	Luigi	\N	\N	direttore sanitario	\N	f	cmn4qpg2600uw87ny7rw4azle	2026-03-24 14:58:45.786	2026-03-24 14:59:32.223
cmn4qpg3b00v187nysak46qia	BLLVTR58D01A835A	Bellei	Vittorio	\N	\N	ortopedico	\N	f	cmn4qpg2s00uz87ny6lvehx68	2026-03-24 14:58:45.815	2026-03-24 15:00:24.12
cmn4qpg4g00v487nylbg1fo90	BCCNSI72R56H501D	Boccia	Ines	\N	\N	dermatologa	\N	f	cmn4qpg3v00v287nyx5f79vbw	2026-03-24 14:58:45.857	2026-03-24 14:59:38.141
cmn4qpg5100v687nyf6v1q0do	PNPCLD85A57H501R	Panepinto	Claudia	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpg3v00v287nyx5f79vbw	2026-03-24 14:58:45.877	2026-03-24 15:04:44.255
cmn4qpg5n00v987ny6qeljizt	BRCMRZ70C12H501L	Brecevich	Maurizio	\N	\N	fisioterapista	\N	f	cmn4qpg5c00v787nyk0yzmkvn	2026-03-24 14:58:45.9	2026-03-24 14:59:38.168
cmn4qpg5y00vb87nyewf5rkpl	VLISMN68L68H501F	Viola	Simona	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpg5c00v787nyk0yzmkvn	2026-03-24 14:58:45.91	2026-03-24 15:04:44.279
cmn4qpg6m00ve87ny27czy5ly	CLRLSN81P20H501C	Calori	Alessandro	\N	\N	fisioterapista	\N	f	cmn4qpg6b00vc87nyvuaudjng	2026-03-24 14:58:45.934	2026-03-24 15:00:24.158
cmn4qpg7b00vh87nyly8ghug9	PCFVNC81A45E958S	Pacifici	Veronica	\N	\N	impiegato	\N	f	cmn4qpg6z00vf87nydviyta0l	2026-03-24 14:58:45.96	2026-03-24 15:04:44.33
cmn4qpg8000vk87ny99uxxhcf	CLLLSS86S11H501P	Collalti	Alessio	\N	\N	fisioterapista	\N	f	cmn4qpg7n00vi87nyif386z88	2026-03-24 14:58:45.984	2026-03-24 15:00:24.188
cmn4qpg8j00vm87nyadt9mc92	FRCDNL97M64H501U	Feroci	Daniela	\N	\N	\N	\N	t	cmn4qpg7n00vi87nyif386z88	2026-03-24 14:58:46.003	2026-03-24 15:04:44.365
cmn4qpg9g00vp87ny5ud9fs2s	SBTLSN86M26H501N	Sabatini	Alessandro	\N	\N	legale rappresentante	\N	f	cmn4qpg8y00vn87ny1lcsbnwb	2026-03-24 14:58:46.037	2026-03-24 15:00:24.216
cmn4qpgaf00vs87nyn803q2fg	SNCLNE83D50H501Q	Sancesario	Elena	\N	\N	legale rappresentante	\N	f	cmn4qpg9z00vq87nyhtn9ffnq	2026-03-24 14:58:46.071	2026-03-24 15:00:24.244
cmn4qpgav00vu87nyco2vi1wz	SRRSNT86R53C129I	Sorrentino	Assunta	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpg9z00vq87nyhtn9ffnq	2026-03-24 14:58:46.088	2026-03-24 15:04:44.401
cmn4qpgbh00vx87nyb414gqiu	FRDFPP65R18H501Y	Fordellone	Filippo	\N	\N	odontoiatra	\N	f	cmn4qpgb700vv87nyuu8savb9	2026-03-24 14:58:46.109	2026-03-24 14:59:38.334
cmn4qpgc900w087ny6vbm6gk7	MSTCLR51L53M022T	Mastrovincenzo	Clara	\N	\N	legale rappresentante	\N	f	cmn4qpgbs00vy87ny8hvwvnz3	2026-03-24 14:58:46.137	2026-03-24 15:00:24.27
cmn4qpgcz00w387nyouehuhhz	SNSFNC89S08H501N	Sansovini	Francesco	\N	\N	fisioterapista	\N	f	cmn4qpgcm00w187nyq7q1yaii	2026-03-24 14:58:46.164	2026-03-24 15:00:24.297
cmn4qpgdq00w687nyr0txrfu4	RTTGLC88L29H501X	Rettagliati	Gianluca	\N	\N	fisioterapista	\N	f	cmn4qpgdb00w487nydzd122j0	2026-03-24 14:58:46.19	2026-03-24 15:00:24.331
cmn4qpgeb00w987ny0c2d80y7	FRSMLS79L59F152R	Frassica	Maria Luisa	\N	\N	legale rappresentante	\N	f	cmn4qpge100w787nybrl484jj	2026-03-24 14:58:46.212	2026-03-24 14:59:38.462
cmn4qpgen00wb87nylkbce8rh	GNFMGH84E41H501B	Gianfelici	Margherita	\N	\N	ASO	\N	f	cmn4qpge100w787nybrl484jj	2026-03-24 14:58:46.224	2026-03-24 15:04:44.44
cmn4qpgf600wd87nyxq3w3noz	PRNFRC89H43A269N	Principia	Federica	\N	\N	ASO	\N	f	cmn4qpge100w787nybrl484jj	2026-03-24 14:58:46.243	2026-03-24 15:04:44.473
cmn4qpgfi00wf87ny4vn87f60	MRGGLI89E58H501T	Maraglino	Giulia	\N	\N	ASO	\N	f	cmn4qpge100w787nybrl484jj	2026-03-24 14:58:46.255	2026-03-24 15:04:44.508
cmn4qpgfv00wh87nysdv6yqwz	DLTGLI83T52I992J	D'alterio	Giulia	\N	\N	\N	\N	t	cmn4qpge100w787nybrl484jj	2026-03-24 14:58:46.268	2026-03-24 15:04:44.533
cmn4qpgg600wj87nyt3turc9a	RGGRSL70E45H501C	Ruggiero	Rossella	\N	\N	impiegato	\N	f	cmn4qpge100w787nybrl484jj	2026-03-24 14:58:46.279	2026-03-24 15:04:44.557
cmn4qpggw00wm87nyazbnequ4	LZZRCR68T25H501H	Lazzari	Riccardo	\N	\N	legale rappresentante	\N	f	cmn4qpggk00wk87ny79izuai6	2026-03-24 14:58:46.304	2026-03-24 14:59:38.521
cmn4qpghb00wo87ny08k330bf	RMNFRC88H63H501C	Raimondi	Federica	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpggk00wk87ny79izuai6	2026-03-24 14:58:46.319	2026-03-24 15:04:44.592
cmn4qpgi800wr87ny5zjv4qya	FNIPLA75E06H501A	Fini	Paolo	\N	\N	legale rappresentante	\N	f	cmn4qpghn00wp87nync4w3ep9	2026-03-24 14:58:46.352	2026-03-24 14:59:38.564
cmn4qpgiu00wu87ny7ivs2gpx	LSSCRL57E56H501U	Alessio	Carla	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpgij00ws87nys2tjwxls	2026-03-24 14:58:46.374	2026-03-24 15:04:44.621
cmn4qpgjf00wx87ny2s3gqfik	MLTRLL55A41L331P	Malato	Ornella	\N	\N	legale rappresentante	\N	f	cmn4qpgj400wv87nyjvimsavu	2026-03-24 14:58:46.396	2026-03-24 15:00:48.712
cmn4qpgjq00wz87ny2l6ygh2b	LTTMCR66L42H501V	Latte	Maria Cristina	\N	\N	tecnico di laboratorio	\N	f	cmn4qpgj400wv87nyjvimsavu	2026-03-24 14:58:46.407	2026-03-24 14:59:38.645
cmn4qpgk200x187nyvsqnal5z	DSNCHR83P50D773Q	De Santis	Chiara	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpgj400wv87nyjvimsavu	2026-03-24 14:58:46.419	2026-03-24 15:04:44.646
cmn4qpgkf00x387nyg8zpf0xz	RLJRJN48M67Z118M	Relja	Rajna	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpgj400wv87nyjvimsavu	2026-03-24 14:58:46.431	2026-03-24 15:04:44.674
cmn4qpgl500x687nyxvt6urna	TGLMDA83M04E958L	Taglieri	Amedeo	\N	\N	medico radiologo	\N	f	cmn4qpgks00x487nyd8yu9yqe	2026-03-24 14:58:46.457	2026-03-24 14:59:38.732
cmn4qpglh00x887nyzpkrlibg	NCCSLV91E69H501S	Nucci	Silvia	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpgks00x487nyd8yu9yqe	2026-03-24 14:58:46.47	2026-03-24 15:04:44.709
cmn4qpgls00xa87nyb95frlb0	PCCMRN89D47H501P	Piccolo	Marina	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpgks00x487nyd8yu9yqe	2026-03-24 14:58:46.481	2026-03-24 15:04:44.733
cmn4qpgm400xc87ny4b6awkkj	CRSRNN95H69D972I	Corsetti	Arianna	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpgks00x487nyd8yu9yqe	2026-03-24 14:58:46.493	2026-03-24 15:04:44.769
cmn4qpgmg00xe87nykzdihskj	DLRSMN95M59F061B	Di Lorenzo	Simona	\N	\N	\N	\N	t	cmn4qpgks00x487nyd8yu9yqe	2026-03-24 14:58:46.505	2026-03-24 15:04:44.8
cmn4qpgmw00xg87ny8dfnv7uh	DPTGNS87S53D773I	De Petrillo	Agnese	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpgks00x487nyd8yu9yqe	2026-03-24 14:58:46.52	2026-03-24 15:04:44.83
cmn4qpgnt00xj87nyysmhss5w	MCHLRI78P64D612B	Macherelli	Ilaria	\N	\N	legale rappresentante	\N	f	cmn4qpgnd00xh87nyqiwnb0rn	2026-03-24 14:58:46.554	2026-03-24 15:00:24.392
cmn4qpgoa00xl87nysbbpeffw	HGGPRI87T18A269F	Haag O Agga	Piero	\N	\N	fisioterapista	\N	f	cmn4qpgnd00xh87nyqiwnb0rn	2026-03-24 14:58:46.57	2026-03-24 15:00:24.422
cmn4qpgoy00xn87nykecg4sue	XXXXXX11X11X145X	Cotza	Veronica	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpgnd00xh87nyqiwnb0rn	2026-03-24 14:58:46.594	2026-03-24 15:04:44.856
cmn4qpgpa00xp87nyu901kreo	XXXXXX11X11X146X	Costabile	Silvia	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpgnd00xh87nyqiwnb0rn	2026-03-24 14:58:46.606	2026-03-24 15:04:44.891
cmn4qpgpy00xs87ny4l0glnop	MRSMHL74S05D643G	Miressi	Michele	\N	\N	fisioterapista	\N	f	cmn4qpgpm00xq87nyxlvviy20	2026-03-24 14:58:46.631	2026-03-24 14:59:32.402
cmn4qpgr300xv87ny6fa2us7x	TDRGLC72L10H501E	Teodori	Gianluca	\N	\N	bagnino	\N	f	cmn4qpgql00xt87nyz4664sy6	2026-03-24 14:58:46.671	2026-03-24 15:00:24.459
cmn4qpgrq00xx87ny0t64a85b	XXXXXX11X11X147X	Tino	Simone	\N	\N	fisioterapista	\N	t	cmn4qpgql00xt87nyz4664sy6	2026-03-24 14:58:46.695	2026-03-24 14:59:09.474
cmn4qpgs700xz87nyb7atbntq	XXXXXX11X11X148X	Amici	Cristiana	\N	\N	ADDETTO ALLA SEGRETERIA	\N	t	cmn4qpgql00xt87nyz4664sy6	2026-03-24 14:58:46.711	2026-03-24 15:04:44.927
cmn4qpgsu00y287nymvo10ht6	PCCNNA63R70F839V	Piccirillo	Anna	\N	\N	medico medicina generale	\N	f	cmn4qpgsj00y087ny92zblpr3	2026-03-24 14:58:46.734	2026-03-24 14:59:38.853
cmn4qpgt400y487nyf0w1kair	XXXXXX11X11X149X	Pompili	Alessandra	\N	\N	ADDETTO ALLA SEGRETERIA	\N	t	cmn4qpgsj00y087ny92zblpr3	2026-03-24 14:58:46.745	2026-03-24 15:04:44.954
cmn4qpgts00y787ny8asbd8lx	PCCMRA70M66F839E	Piccirillo	Maria	\N	\N	medico medicina generale	\N	f	cmn4qpgtg00y587nyyo084ul8	2026-03-24 14:58:46.768	2026-03-24 14:59:38.877
cmn4qpgus00ya87ny1bnzc9i2	PCCGNN68P26F839K	Piccirillo	Giovanni	\N	\N	medico medicina generale	\N	f	cmn4qpgub00y887ny1lb24irf	2026-03-24 14:58:46.804	2026-03-24 14:59:38.909
cmn4qpgv800yc87nyr4syiy9n	PLMMRZ88A41H501Z	Palmiotti	Marzia	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpgub00y887ny1lb24irf	2026-03-24 14:58:46.82	2026-03-24 15:04:44.977
cmn4qpgw500yf87nygwwz2528	PCCGPP65A24F839K	Piccirillo	Giuseppe	\N	\N	medico medicina generale	\N	f	cmn4qpgvm00yd87nyit794pny	2026-03-24 14:58:46.854	2026-03-24 14:59:38.959
cmn4qpgwk00yh87nyh3p9jy5u	SCHMGR73L44D969H	Schenone	Maria Grazia	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpgvm00yd87nyit794pny	2026-03-24 14:58:46.868	2026-03-24 15:04:45.004
cmn4qpgx800yk87ny3ba9vkws	PNCNLN73A60G130L	Pisani	Angelina	\N	\N	legale rappresentante	\N	f	cmn4qpgwv00yi87nyrvvwad47	2026-03-24 14:58:46.893	2026-03-24 14:59:38.99
cmn4qpgxp00ym87nya3zbjgis	BNCNGL68P46H501S	Bianco	Angela	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpgwv00yi87nyrvvwad47	2026-03-24 14:58:46.909	2026-03-24 15:04:45.033
cmn4qpgy100yo87nypa5krkme	MMBBBR70D58H501M	Mambrini	Barbara	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpgwv00yi87nyrvvwad47	2026-03-24 14:58:46.922	2026-03-24 15:04:45.063
cmn4qpgyp00yr87nynzynsvay	MGSMRA62A04H501Z	Magistri	Mauro	\N	\N	medico medicina generale/odontoiatra	\N	f	cmn4qpgyd00yp87ny9v1dusg0	2026-03-24 14:58:46.945	2026-03-24 14:59:39.017
cmn4qpgz000yt87nyb4zfqm06	BNGPLA63M54G632W	Benghi	Paola	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpgyd00yp87ny9v1dusg0	2026-03-24 14:58:46.957	2026-03-24 15:04:45.098
cmn4qph0200yw87nya3oztecf	RTLMRZ55D12H118E	Rotili	Maurizio	\N	\N	medico medicina generale	\N	f	cmn4qpgzj00yu87nykk5wio2i	2026-03-24 14:58:46.994	2026-03-24 14:59:39.054
cmn4qph0e00yy87nyjntjfgn4	MGNGPP59P46H501C	Magnanti	Giuseppina	\N	\N	medico medicina generale	\N	f	cmn4qpgij00ws87nys2tjwxls	2026-03-24 14:58:47.006	2026-03-24 14:59:39.086
cmn4qph1000z187ny3hdbh0ue	TRQNGL63D26H501I	Tarquini	Angelo	\N	\N	fisioterapista	\N	f	cmn4qph0p00yz87nybc20whcp	2026-03-24 14:58:47.029	2026-03-24 15:00:24.487
cmn4qph1c00z387nykdljyrca	TRQGRL93L02H501L	Tarquini	Gabriele	\N	\N	amministrativo	\N	f	cmn4qph0p00yz87nybc20whcp	2026-03-24 14:58:47.041	2026-03-24 15:04:45.137
cmn4qph1n00z587nyhb177cj4	PCCLBT64P48B157E	Piccinini	Elisabetta	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qph0p00yz87nybc20whcp	2026-03-24 14:58:47.051	2026-03-24 15:04:45.164
cmn4qph2e00z887ny9wc4tkd2	SNTSLV67E68H501C	Santarelli	Silvia	\N	\N	medico oculista	\N	f	cmn4qph2200z687ny73jooyrm	2026-03-24 14:58:47.079	2026-03-24 15:00:48.745
cmn4qph2q00za87ny0vo4iono	VTLRSO83P51L719A	Vitale	Rosa	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qph2200z687ny73jooyrm	2026-03-24 14:58:47.091	2026-03-24 15:04:45.188
cmn4qph3d00zd87nyjl8ywb59	CCCFRC89E49H501F	Cuocci Rosato	Federica	\N	\N	legale rappresentante	\N	f	cmn4qph3200zb87ny2dtft3y2	2026-03-24 14:58:47.114	2026-03-24 15:00:24.555
cmn4qph4000zg87nykjfya0sk	SBRFNC54R44H501C	Sbriccoli	Franca	\N	\N	medico estetico	\N	f	cmn4qph3o00ze87nywpz3nnf7	2026-03-24 14:58:47.137	2026-03-24 14:59:39.202
cmn4qph4o00zj87nyhoi2duoi	SCTCNT68S44C351B	Sciuto	Chantal	\N	\N	medico dermatologo	\N	f	cmn4qph4c00zh87nytbhcefja	2026-03-24 14:58:47.16	2026-03-24 15:00:24.583
cmn4qph4z00zl87nyy8e5onpc	GGLRRT82L55H501C	Gigli	Roberta	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qph4c00zh87nytbhcefja	2026-03-24 14:58:47.172	2026-03-24 15:04:45.212
cmn4qph5a00zn87nyefi6zc53	DLIMBR91R58H501K	Di Leo	Ambra	\N	\N	\N	\N	t	cmn4qph4c00zh87nytbhcefja	2026-03-24 14:58:47.182	2026-03-24 15:04:45.234
cmn4qph5l00zp87nygqmq8sfb	XXXXXX11X11X150X	Taddei	Federica	\N	\N	\N	\N	t	cmn4qph4c00zh87nytbhcefja	2026-03-24 14:58:47.194	2026-03-24 15:04:45.256
cmn4qph6800zs87ny74rfijyi	TRQRCR74C07H501J	Torquati	Riccardo	\N	\N	fisioterapista	\N	f	cmn4qph5w00zq87nyo99ca0i2	2026-03-24 14:58:47.217	2026-03-24 15:00:24.649
cmn4qph6j00zu87nym7vreoaa	LVRVLR86H06H501W	Olivari	Valerio	\N	\N	\N	\N	t	cmn4qph5w00zq87nyo99ca0i2	2026-03-24 14:58:47.227	2026-03-24 15:04:45.293
cmn4qph6w00zw87nynytnulld	MRCSFN82L47H501U	Marcomeni	Stefania	\N	\N	amministrativo	\N	f	cmn4qph5w00zq87nyo99ca0i2	2026-03-24 14:58:47.24	2026-03-24 15:04:45.329
cmn4qph7900zy87ny2yru1ft8	PSCLNR95E61H501F	Pesce	Eleonora	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qph5w00zq87nyo99ca0i2	2026-03-24 14:58:47.253	2026-03-24 15:04:45.353
cmn4qph7q010087ny9zguvp52	NGSRNN96C62E958Y	Angius	Arianna	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qph5w00zq87nyo99ca0i2	2026-03-24 14:58:47.27	2026-03-24 15:04:45.375
cmn4qph8u010387nylju11zx1	BGLFNC76E58A132X	Biagioli	Francesca	\N	\N	amministrativo	\N	f	cmn4qph84010187nybc7hiq2o	2026-03-24 14:58:47.311	2026-03-24 15:04:45.399
cmn4qph96010587nydsrhk09e	MNSGDI91L45I452E	Manus	Giada	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qph84010187nybc7hiq2o	2026-03-24 14:58:47.322	2026-03-24 15:04:45.426
cmn4qph9h010787nynt5918ec	DRSMNC79E57H501R	Di Resta	Monica	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qph84010187nybc7hiq2o	2026-03-24 14:58:47.333	2026-03-24 15:04:45.448
cmn4qph9t010987nyx938zs0d	RSSVNT82S60H501C	Russo	Valentina	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qph84010187nybc7hiq2o	2026-03-24 14:58:47.345	2026-03-24 15:04:45.477
cmn4qpha9010b87ny84zc7gc1	SLVTZN66L47H501Y	Salvatore	Tiziana	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qph84010187nybc7hiq2o	2026-03-24 14:58:47.361	2026-03-24 15:04:45.514
cmn4qphak010d87nytn87ez09	CNTLRN75E64H501A	Cinti	Lorena	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qph84010187nybc7hiq2o	2026-03-24 14:58:47.372	2026-03-24 15:04:45.543
cmn4qphau010f87nyw4rngixh	QNALTZ86M43H501O	Aquino	Letizia	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qph84010187nybc7hiq2o	2026-03-24 14:58:47.383	2026-03-24 15:04:45.568
cmn4qphb6010h87nyvvnxowl3	XXXXXX11X11X151X	Carucci	Lorenzo	\N	\N	\N	\N	t	cmn4qph84010187nybc7hiq2o	2026-03-24 14:58:47.395	2026-03-24 14:59:10.049
cmn4qphbx010k87nyut3jq4u3	TBRVDN85B46H501X	Tiberi	Virdiana	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qphbi010i87ny0rgb5bvc	2026-03-24 14:58:47.421	2026-03-24 15:04:45.593
cmn4qphca010m87nyrivqvync	LSSLNI93D47H501P	Alessi	Ilenia	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qphbi010i87ny0rgb5bvc	2026-03-24 14:58:47.435	2026-03-24 15:04:45.615
cmn4qphd8010p87nyf9i2f52y	LRDGPP60L22H501U	Ilardo	Giuseppe	\N	\N	legale rappresentante	\N	f	cmn4qphcy010n87ny6ovc4w63	2026-03-24 14:58:47.469	2026-03-24 15:00:24.704
cmn4qphdw010r87nyfd2fj0sa	CPRFRC75T43H501G	Capri	Federica	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qphcy010n87ny6ovc4w63	2026-03-24 14:58:47.492	2026-03-24 15:04:45.641
cmn4qpheg010t87ny3xr39wed	HMDLNE90H62H501K	Ahmadian Fini	Elena	\N	\N	\N	\N	t	cmn4qphcy010n87ny6ovc4w63	2026-03-24 14:58:47.512	2026-03-24 15:04:45.663
cmn4qphey010v87nycaqgthsy	PRYLSY80C70Z138O	Prypkhan	Lesya	\N	\N	\N	\N	t	cmn4qphcy010n87ny6ovc4w63	2026-03-24 14:58:47.53	2026-03-24 15:04:45.687
cmn4qphfh010x87ny2gfy3hm0	TNIFRC95M71H501C	Tino	Federica	\N	\N	\N	\N	t	cmn4qphcy010n87ny6ovc4w63	2026-03-24 14:58:47.549	2026-03-24 15:04:45.712
cmn4qphg5011087nyits9yhno	VNTNZE73L27G878P	Ventucci	Enzo	\N	\N	chirurgo maxillo facciale	\N	f	cmn4qphfu010y87nyr361zexx	2026-03-24 14:58:47.573	2026-03-24 15:00:24.74
cmn4qphgx011387ny7ku7ly4n	XXXXXX11X11X152X	Zimbile	Roberta	\N	\N	\N	\N	t	cmn4qphgi011187nywc25wfw7	2026-03-24 14:58:47.601	2026-03-24 14:59:10.173
cmn4qphh9011587nyhg7ua2gr	XXXXXX11X11X153X	Pizzichillo	Anna	\N	\N	\N	\N	t	cmn4qphgi011187nywc25wfw7	2026-03-24 14:58:47.613	2026-03-24 14:59:10.185
cmn4qphhq011787nyl8issazw	XXXXXX11X11X154X	Celli	Stefania	\N	\N	\N	\N	t	cmn4qphgi011187nywc25wfw7	2026-03-24 14:58:47.63	2026-03-24 14:59:10.208
cmn4qphi3011987nya5kxt7ow	XXXXXX11X11X155X	Doddi	Mirella	\N	\N	\N	\N	t	cmn4qphgi011187nywc25wfw7	2026-03-24 14:58:47.643	2026-03-24 14:59:10.229
cmn4qphiq011b87nypigvvg39	XXXXXX11X11X156X	Granati	Sabrina	\N	\N	\N	\N	t	cmn4qphgi011187nywc25wfw7	2026-03-24 14:58:47.666	2026-03-24 14:59:10.243
cmn4qphj4011d87nygkuwbbav	XXXXXX11X11X157X	Cutr�	Marco	\N	\N	\N	\N	t	cmn4qphgi011187nywc25wfw7	2026-03-24 14:58:47.68	2026-03-24 14:59:10.254
cmn4qphjo011f87nybzyygm68	XXXXXX11X11X158X	Di Stefano	Davide	\N	\N	\N	\N	t	cmn4qphgi011187nywc25wfw7	2026-03-24 14:58:47.701	2026-03-24 14:59:10.279
cmn4qphk1011h87nyvkl714iu	XXXXXX11X11X159X	Moretti	Marco	\N	\N	\N	\N	t	cmn4qphgi011187nywc25wfw7	2026-03-24 14:58:47.713	2026-03-24 14:59:10.301
cmn4qphkc011j87nywb2np53a	XXXXXX11X11X160X	Tudorita	Maxineanu	\N	\N	\N	\N	t	cmn4qphgi011187nywc25wfw7	2026-03-24 14:58:47.724	2026-03-24 14:59:10.326
cmn4qphko011l87ny1fu1obbw	XXXXXX11X11X161X	Del Zio	Riccardo	\N	\N	\N	\N	t	cmn4qphgi011187nywc25wfw7	2026-03-24 14:58:47.736	2026-03-24 14:59:10.339
cmn4qphl9011n87nyzkidbu87	XXXXXX11X11X162X	Celli	Umberto	\N	\N	\N	\N	t	cmn4qphgi011187nywc25wfw7	2026-03-24 14:58:47.757	2026-03-24 14:59:10.352
cmn4qphlj011p87nyi1afb6s3	XXXXXX11X11X163X	Vona	Cinzia	\N	\N	\N	\N	t	cmn4qphgi011187nywc25wfw7	2026-03-24 14:58:47.768	2026-03-24 14:59:10.364
cmn4qphlv011r87ny01vhu9ih	XXXXXX11X11X164X	Pizzichillo	Sabrina	\N	\N	\N	\N	t	cmn4qphgi011187nywc25wfw7	2026-03-24 14:58:47.78	2026-03-24 14:59:10.382
cmn4qphm8011t87ny168vm631	XXXXXX11X11X165X	Tosi	Riccardo	\N	\N	\N	\N	t	cmn4qphgi011187nywc25wfw7	2026-03-24 14:58:47.792	2026-03-24 14:59:10.396
cmn4qphml011v87nyje7ddheu	XXXXXX11X11X166X	Zimbile	Alessandro	\N	\N	\N	\N	t	cmn4qphgi011187nywc25wfw7	2026-03-24 14:58:47.806	2026-03-24 14:59:10.41
cmn4qphn0011x87nyo9fkar2d	XXXXXX11X11X167X	Serafini	Laura	\N	\N	\N	\N	t	cmn4qphgi011187nywc25wfw7	2026-03-24 14:58:47.82	2026-03-24 14:59:10.433
cmn4qphns012087nyqrupqtbl	FNCLBT79H67H501R	Fenocchio	Elisabetta	\N	\N	educatore	\N	f	cmn4qphnb011y87nyjfnr3u4x	2026-03-24 14:58:47.849	2026-03-24 15:00:48.786
cmn4qpho6012287ny4gm2raj4	DMRLSN74T14C351S	Di Marco	Alessandro	\N	\N	educatore	\N	f	cmn4qphnb011y87nyjfnr3u4x	2026-03-24 14:58:47.862	2026-03-24 15:04:45.739
cmn4qphoi012487ny8n204jok	GZZSRA95T65E958P	Guzzo	Sara	\N	\N	educatore	\N	f	cmn4qphnb011y87nyjfnr3u4x	2026-03-24 14:58:47.874	2026-03-24 15:04:45.762
cmn4qphov012687ny7rhasvnd	SPGPML79T44H501D	Spagnuolo	Pamela	\N	\N	educatore	\N	f	cmn4qphnb011y87nyjfnr3u4x	2026-03-24 14:58:47.887	2026-03-24 15:04:45.798
cmn4qphph012987nydmmzao7z	CCLLSS76S70H501L	Cicala	Alessia	\N	\N	\N	\N	t	cmn4qphp6012787nypy54y70q	2026-03-24 14:58:47.909	2026-03-24 15:00:48.825
cmn4qphpt012b87nynu894mwg	ZMBCLD66E30H501U	Zambotto	Claudio	\N	\N	\N	\N	t	cmn4qphp6012787nypy54y70q	2026-03-24 14:58:47.921	2026-03-24 14:59:10.523
cmn4qphq4012d87ny0ta9eol5	CRSLSN94E08H501N	Corsi	Alessandro	\N	\N	\N	\N	t	cmn4qphp6012787nypy54y70q	2026-03-24 14:58:47.933	2026-03-24 14:59:10.544
cmn4qphqg012f87nym7lby55b	CRSMRC62C28H501P	Corsi	Marco	\N	\N	\N	\N	t	cmn4qphp6012787nypy54y70q	2026-03-24 14:58:47.945	2026-03-24 14:59:10.559
cmn4qphr3012i87ny8lomkjrt	BLLNDR70H06H501R	Bellavista	Andrea	\N	\N	dirigente	\N	f	cmn4qphqt012g87nyjfggdfwk	2026-03-24 14:58:47.968	2026-03-24 15:00:24.827
cmn4qphrf012k87ny9xqp6kw8	FBBSVN77B66H501Q	Fabbri	Silvana	\N	\N	receptionist	\N	f	cmn4qphqt012g87nyjfggdfwk	2026-03-24 14:58:47.98	2026-03-24 15:04:45.823
cmn4qphrz012m87nyos9wx4om	LRNMRT85S63H501T	Lorenzatti Vitalini	Marta	\N	\N	estetista	\N	f	cmn4qphqt012g87nyjfggdfwk	2026-03-24 14:58:48	2026-03-24 15:04:45.846
cmn4qphsd012o87ny1fyhled9	LSSCLD91S69H501U	Alessandri	Claudia	\N	\N	estetista	\N	f	cmn4qphqt012g87nyjfggdfwk	2026-03-24 14:58:48.014	2026-03-24 15:04:45.868
cmn4qphsr012q87nyvmqymxr6	XXXXXX11X11X168X	Possidoni	Annarita	\N	\N	\N	\N	t	cmn4qphqt012g87nyjfggdfwk	2026-03-24 14:58:48.027	2026-03-24 14:59:10.651
cmn4qpht5012s87ny1hfeeb3a	XXXXXX11X11X169X	Branchesi	Martina	\N	\N	estetista	\N	t	cmn4qphqt012g87nyjfggdfwk	2026-03-24 14:58:48.041	2026-03-24 14:59:10.666
cmn4qphtj012u87nyxk4pstlp	XXXXXX11X11X170X	Morelli	Sara	\N	\N	estetista	\N	t	cmn4qphqt012g87nyjfggdfwk	2026-03-24 14:58:48.056	2026-03-24 14:59:10.679
cmn4qphtx012w87nyugzwvpmy	XXXXXX11X11X171X	Ebrahem Nansi	Tarek Danial	\N	\N	addetto pulizie	\N	t	cmn4qphqt012g87nyjfggdfwk	2026-03-24 14:58:48.069	2026-03-24 14:59:10.7
cmn4qphuj012z87nyeif1zot9	CHRGRD66C10H501H	Chiarucci	Giufrido	\N	\N	dirigente	\N	f	cmn4qphu8012x87nyltetrcwh	2026-03-24 14:58:48.092	2026-03-24 15:00:48.858
cmn4qphv6013187ny7sxc9npl	RMGFNC51R20I266R	Ramogida	Franco	\N	\N	operaio	\N	f	cmn4qphu8012x87nyltetrcwh	2026-03-24 14:58:48.114	2026-03-24 15:04:45.895
cmn4qphw0013487nynokad4p1	RGGDVD78H05D773E	Ruggeri	David	\N	\N	direttore sanitario	\N	f	cmn4qphvh013287nyvl8pctv1	2026-03-24 14:58:48.144	2026-03-24 15:00:24.863
cmn4qphwa013687nynhrwgjcw	DNGCLD81A67H501E	D'angeli	Claudia	\N	\N	socio lavoratore veterinario	\N	f	cmn4qphvh013287nyvl8pctv1	2026-03-24 14:58:48.155	2026-03-24 15:04:45.922
cmn4qphwp013887nycyp6p2sa	DSNLCU80P14H501D	De Santis	Luca	\N	\N	socio lavoratore veterinario	\N	f	cmn4qphvh013287nyvl8pctv1	2026-03-24 14:58:48.169	2026-03-24 15:04:45.957
cmn4qphx1013a87nyqe8h1kor	DNGFLV79L64H501A	D'angeli	Flavia	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qphvh013287nyvl8pctv1	2026-03-24 14:58:48.181	2026-03-24 15:04:45.981
cmn4qphya013d87ny38haleqy	DLSLRD81E01H501X	Del Signore	Alfredo Maria	\N	\N	\N	\N	t	cmn4qphxo013b87nyr8ejoomv	2026-03-24 14:58:48.227	2026-03-24 15:00:24.9
cmn4qphyt013f87nygzv4kz8l	DLSLDA82T02H501E	Del Signore	Aldo	\N	\N	operaio	\N	f	cmn4qphxo013b87nyr8ejoomv	2026-03-24 14:58:48.245	2026-03-24 15:00:24.926
cmn4qphzb013h87ny69z43upt	CVZGCM79H16F839X	Cavezza	Giacomo	\N	\N	operaio	\N	f	cmn4qphxo013b87nyr8ejoomv	2026-03-24 14:58:48.263	2026-03-24 15:04:29.443
cmn4qphzy013j87nybcuj2iuh	ZRRRND74B07A515X	Zaurrini	Armando	\N	\N	operaio	\N	f	cmn4qphxo013b87nyr8ejoomv	2026-03-24 14:58:48.287	2026-03-24 15:04:46.013
cmn4qpi0q013m87nyu58s2taa	DLCCLD64M01H501L	De Luca	Claudio	\N	\N	odontotecnico	\N	f	cmn4qpi0b013k87nyb17szc52	2026-03-24 14:58:48.314	2026-03-24 15:00:24.953
cmn4qpi11013o87ny1zxpr4o7	PNVDTR72T11Z104Y	Panev	Dimitar Panchev	\N	\N	odontotecnico	\N	f	cmn4qpi0b013k87nyb17szc52	2026-03-24 14:58:48.326	2026-03-24 15:04:29.469
cmn4qpi1o013r87nyue82kxgq	TRNLCU74R01H501G	Tornatore	Luca	\N	\N	amministratore	\N	f	cmn4qpi1d013p87nyn3bawhsv	2026-03-24 14:58:48.348	2026-03-24 15:00:48.894
cmn4qpi1z013t87nyltsagjl8	CMBSLV81A19M082Z	Cambedda	Silvio	\N	\N	impiegato	\N	f	cmn4qpi1d013p87nyn3bawhsv	2026-03-24 14:58:48.36	2026-03-24 15:04:46.042
cmn4qpi2n013w87nyfo4hhp2g	DLAJSC02P68H501P	Dalu	Jessica	\N	\N	odontotecnico	\N	f	cmn4qpi2b013u87nyee2mjo30	2026-03-24 14:58:48.384	2026-03-24 15:04:46.065
cmn4qpi2z013y87ny3s0xcmgx	CNSRCL02B53Z129W	Constantin	Rebeca Elena	\N	\N	odontotecnico	\N	f	cmn4qpi2b013u87nyee2mjo30	2026-03-24 14:58:48.396	2026-03-24 15:04:46.088
cmn4qpi3m014187ny1jij05j0	MZZPGR67T23D086D	Mazzotta	Piergiorgio	\N	\N	amministratore	\N	f	cmn4qpi3b013z87nymfvz2juv	2026-03-24 14:58:48.419	2026-03-24 15:00:28.619
cmn4qpi3z014387nycq5wnf2r	SRNGLG59P20H501J	Serini	Gianluigi	\N	\N	amministratore	\N	f	cmn4qpi3b013z87nymfvz2juv	2026-03-24 14:58:48.431	2026-03-24 14:59:40.498
cmn4qpi4a014587nye0bxmioc	BRTDRN64S54Z401E	Bratti	Adriana	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qpi3b013z87nymfvz2juv	2026-03-24 14:58:48.442	2026-03-24 15:04:46.111
cmn4qpi4l014787ny7esaxydx	CRDBDT59T28H501D	Cordelli	Benedetto	\N	\N	\N	\N	t	cmn4qpi3b013z87nymfvz2juv	2026-03-24 14:58:48.454	2026-03-24 15:04:46.136
cmn4qpi4z014987nyqt88qw7u	CRVMRC75E17H501T	Crovara	Mirco	\N	\N	\N	\N	t	cmn4qpi3b013z87nymfvz2juv	2026-03-24 14:58:48.468	2026-03-24 15:04:46.168
cmn4qpi65014c87nykxl22uki	PRNRNN71L47H501X	Perondi	Arianna	\N	\N	amministratore	\N	t	cmn4qpi5s014a87nyzdwmn58c	2026-03-24 14:58:48.509	2026-03-24 15:00:25.041
cmn4qpi6g014e87nysae854bs	GRVFNC72D45D086J	Gravina	Francesca Maria	\N	\N	farmacista	\N	f	cmn4qpi5s014a87nyzdwmn58c	2026-03-24 14:58:48.52	2026-03-24 15:04:46.191
cmn4qpi73014h87nyblraljn4	PRNLSN41A17A944J	Perondi	Alessandro	\N	\N	farmacista	\N	f	cmn4qpi6r014f87ny6jys4bxb	2026-03-24 14:58:48.543	2026-03-24 14:59:11.088
cmn4qpi7h014j87nys8kltyxd	PTRFRC90B01B563P	Petracca	Federico	\N	\N	farmacista	\N	f	cmn4qpi6r014f87ny6jys4bxb	2026-03-24 14:58:48.557	2026-03-24 14:59:11.103
cmn4qpi7s014l87ny0j07jehr	DPLGPP65D52H282I	Di Paolantonio	Giuseppina	\N	\N	addetto pulizie	\N	f	cmn4qpi6r014f87ny6jys4bxb	2026-03-24 14:58:48.569	2026-03-24 15:04:46.216
cmn4qpi87014n87nyxcjl9343	BRBDNL80S45A515W	Barbone	Daniela	\N	\N	farmacista	\N	f	cmn4qpi6r014f87ny6jys4bxb	2026-03-24 14:58:48.583	2026-03-24 15:04:46.255
cmn4qpi8l014p87nywnpj7ntl	DSDCHR85B52A345W	Desideri	Chiara	\N	\N	commessa	\N	f	cmn4qpi6r014f87ny6jys4bxb	2026-03-24 14:58:48.597	2026-03-24 15:04:46.296
cmn4qpi9e014s87nylx9jwzgz	NDRCLD75M46H501P	Andreozzi	Claudia	\N	\N	amministratore	\N	f	cmn4qpi8y014q87nyqvvcsav2	2026-03-24 14:58:48.626	2026-03-24 15:00:48.921
cmn4qpia2014u87nykuld0maa	NDRRRT79C47H501R	Andreozzi	Roberta	\N	\N	estetista	\N	f	cmn4qpi8y014q87nyqvvcsav2	2026-03-24 14:58:48.651	2026-03-24 15:04:46.34
cmn4qpiam014w87nyx97031fe	PLJNHD83O08Z153X	Pljevljak	Nihad	\N	\N	direttore sanitario	\N	t	cmn4qpfe000s187nyr8qry0es	2026-03-24 14:58:48.67	2026-03-24 14:59:11.178
cmn4qpib1014y87nyx6j6uvxv	SLVBBR71P58H501P	Salvini	Barbara	\N	\N	ADDETTO ALLA SEGRETERIA	\N	f	cmn4qphbi010i87ny0rgb5bvc	2026-03-24 14:58:48.685	2026-03-24 15:04:46.366
cmn4qpibe015087nyz9dw2qbf	DNTSFN99C21H501F	D'introno	Stefano	panichellihsc@gmail.com	\N	\N	\N	t	\N	2026-03-24 14:58:48.698	2026-03-24 14:59:11.208
cmn4qpibw015287nyeqktg3wk	MNTMTN96D60D773D	Monti	Martina	panichellihsc@gmail.com	\N	\N	\N	t	\N	2026-03-24 14:58:48.716	2026-03-24 14:59:11.227
cmn4qpice015487ny6u5iew3o	PNCGLI85H22Z514F	Panichelli	Giulio	panichellihsc@gmail.com	\N	\N	\N	t	\N	2026-03-24 14:58:48.734	2026-03-24 14:59:11.239
cmn4qpicp015687nybm1c2rgd	MTAMRC85C10E958K	Amato	Marco	panichellihsc@gmail.com	\N	\N	\N	t	\N	2026-03-24 14:58:48.745	2026-03-24 14:59:11.252
cmn4qpid2015887nyenlz14ka	MCCMRT80A71G793A	Macchia	Marta	panichellihsc@gmail.com	\N	\N	\N	t	\N	2026-03-24 14:58:48.758	2026-03-24 14:59:11.264
cmn4qpide015a87nytmtdp4ds	CPRSMN70P50H501T	CAPRARA	SIMONA	\N	\N	\N	\N	t	cmn4qpb5j00a687ny72zy244v	2026-03-24 14:58:48.77	2026-03-24 15:04:46.394
cmn4qpidr015c87nydi11x6gi	CRLFRN97H66H501I	Corlito	Floriana	\N	\N	impiegato	\N	f	cmn4qqaqy02b787nyoqi0zfic	2026-03-24 14:58:48.783	2026-03-24 15:04:46.428
cmn4qpie3015e87nywboje0eo	\N	CULBECE	ANA MARIA	\N	\N	ASO	\N	t	cmn4qpftr00ts87ny21tcjp1u	2026-03-24 14:58:48.795	2026-03-24 15:04:46.458
cmn4qpieh015g87ny17sjzk6e	\N	Frustaci	Gloria	\N	\N	ASO	\N	t	cmn4qpb6r00ac87nyikckxo7o	2026-03-24 14:58:48.81	2026-03-24 15:04:48.371
cmn4qpiev015i87nyfex42hze	\N	PICCOLO	CARLOTTA	\N	\N	\N	\N	t	cmn4qpd4g00in87nyqijjgcb7	2026-03-24 14:58:48.824	2026-03-24 15:00:25.12
cmn4qpif7015k87nym8oew8bj	\N	Cucu	Stefania	\N	\N	ADDETTO ALLA SEGRETERIA	\N	t	cmn4qpexw00q587ny7kl0bubh	2026-03-24 14:58:48.836	2026-03-24 15:04:48.525
cmn4qpifj015m87nyz4u11kqj	\N	Valentini	Vincenzo	\N	\N	direttore sanitario	\N	t	cmn4qpge100w787nybrl484jj	2026-03-24 14:58:48.848	2026-03-24 14:59:11.347
cmn4qpifv015o87nytf2cemov	\N	Roberto	Federica	\N	\N	ADDETTO ALLA SEGRETERIA	\N	t	cmn4qph4c00zh87nytbhcefja	2026-03-24 14:58:48.859	2026-03-24 15:04:48.551
cmn4qpig8015q87ny5ile524z	\N	SIBIO	ALESSIA	\N	\N	ASO	\N	t	cmn4qpeir00of87nycli4tqi4	2026-03-24 14:58:48.872	2026-03-24 15:04:46.495
cmn4qpigo015s87nysg7c5dnf	\N	CIANCHI	CHIARA	\N	\N	ASO	\N	t	cmn4qpeir00of87nycli4tqi4	2026-03-24 14:58:48.888	2026-03-24 15:04:46.526
cmn4qpihe015u87nyx16ia132	\N	SEPULVERES	MARIA LETIZIA	\N	\N	ADDETTO ALLA SEGRETERIA	\N	t	cmn4qpeir00of87nycli4tqi4	2026-03-24 14:58:48.914	2026-03-24 15:04:46.551
cmn4qpihw015w87nyr9om4r3c	\N	CAROTENUTO	ANNA	\N	\N	ASO	\N	t	cmn4qpfk300sr87nyr8yt2fl1	2026-03-24 14:58:48.932	2026-03-24 15:04:46.583
cmn4qpiin015z87nyrgh3rif5	\N	CIANI 2	IOLE	\N	\N	\N	\N	t	cmn4qpii7015x87ny4tcyjuma	2026-03-24 14:58:48.96	2026-03-24 14:59:11.442
cmn4qpij0016187ny3c647wvi	\N	AIELLO 2	FRANCESCO	\N	\N	\N	\N	t	cmn4qpii7015x87ny4tcyjuma	2026-03-24 14:58:48.972	2026-03-24 14:59:11.459
cmn4qpije016387ny523u0hz1	\N	PERONDI 2	ARIANNA	\N	\N	\N	\N	t	cmn4qpi6r014f87ny6jys4bxb	2026-03-24 14:58:48.986	2026-03-24 14:59:11.472
cmn4qpijq016587ny2debqrtm	\N	PERONDI 2	ARRIGO	\N	\N	\N	\N	t	cmn4qpi6r014f87ny6jys4bxb	2026-03-24 14:58:48.998	2026-03-24 14:59:11.487
cmn4qpik2016787nyayex585q	\N	FORMICA	SOFIA	\N	\N	ASO	\N	t	cmn4qpe5i00mt87nylivrdy5n	2026-03-24 14:58:49.01	2026-03-24 15:04:46.61
cmn4qpikg016987nyrnzn5tke	\N	SBRICCOLI	PAOLA	\N	\N	odontoiatra	\N	t	cmn4qp99f001p87nyadrr7ote	2026-03-24 14:58:49.024	2026-03-24 15:00:25.068
cmn4qpikr016b87ny0mv55ujk	\N	TONDINI	GIORGIA	\N	\N	direttore sanitario	\N	t	cmn4qp9j1002t87ny8f4ceae1	2026-03-24 14:58:49.036	2026-03-24 15:00:25.096
cmn4qpil4016d87ny6r0r9cx3	\N	MOSCA	FABIO	\N	\N	titolare	\N	t	cmn4qpi0b013k87nyb17szc52	2026-03-24 14:58:49.048	2026-03-24 14:59:11.546
cmn4qpils016f87nyus4oe8y5	\N	GOFFREDO	ADRIANO	\N	\N	odontotecnico	\N	t	cmn4qpi0b013k87nyb17szc52	2026-03-24 14:58:49.073	2026-03-24 15:04:46.645
cmn4qpim7016h87nyt46g2p5a	\N	COSSU	ANDREA	\N	\N	odontotecnico	\N	t	cmn4qpi0b013k87nyb17szc52	2026-03-24 14:58:49.087	2026-03-24 15:04:46.686
cmn4qpimj016j87nyp7kejwif	\N	SANTIMONE	MARCO	\N	\N	odontotecnico	\N	t	cmn4qpi0b013k87nyb17szc52	2026-03-24 14:58:49.099	2026-03-24 15:04:46.722
cmn4qpimt016l87nylsk9l8kl	\N	IGLIOZZI	MARCO	\N	\N	odontotecnico	\N	t	cmn4qpi0b013k87nyb17szc52	2026-03-24 14:58:49.11	2026-03-24 15:04:46.759
cmn4qpin7016n87nykookhis5	\N	SECONDI	LUCIANA	\N	\N	impiegato	\N	t	cmn4qpi0b013k87nyb17szc52	2026-03-24 14:58:49.123	2026-03-24 15:04:46.788
cmn4qpinp016p87nyd8pi1kg2	\N	GOSCILO	SARA	\N	\N	impiegato	\N	t	cmn4qpi0b013k87nyb17szc52	2026-03-24 14:58:49.141	2026-03-24 15:04:46.825
cmn4qpiob016r87nyh4o84prm	\N	TORQUATI 2	RICCARDO	\N	\N	\N	\N	t	cmn4qphbi010i87ny0rgb5bvc	2026-03-24 14:58:49.164	2026-03-24 14:59:11.667
cmn4qpiop016t87nymdor5jrc	\N	TREVISANI	GIADA	\N	\N	direttore sanitario	\N	t	cmn4qphbi010i87ny0rgb5bvc	2026-03-24 14:58:49.177	2026-03-24 14:59:11.68
cmn4qpip9016v87nyy2fqexlr	\N	MASCI	LUCREZIA	\N	\N	ADDETTO ALLA SEGRETERIA	\N	t	cmn4qpdyz00m287nym9q3ej1a	2026-03-24 14:58:49.198	2026-03-24 15:04:46.851
cmn4qpiq0016y87nyt5j4ho2u	\N	ALTIERI 2	VINCENZO	\N	\N	\N	\N	t	cmn4qpipm016w87nysd3pwtp3	2026-03-24 14:58:49.224	2026-03-24 14:59:11.709
cmn4qpiqf017087nyo6z4whay	\N	DE ROSA	PATRIZIA	\N	\N	ASO	\N	t	cmn4qpipm016w87nysd3pwtp3	2026-03-24 14:58:49.239	2026-03-24 15:04:46.89
cmn4qpiqs017287ny4r7rpani	\N	NAVARRA	MAURO	\N	\N	direttore sanitario	\N	t	cmn4qphcy010n87ny6ovc4w63	2026-03-24 14:58:49.252	2026-03-24 14:59:11.735
cmn4qpiri017487ny63vy8e03	\N	PERFETTI	MIRKA	\N	\N	ADDETTO ALLA SEGRETERIA	\N	t	cmn4qphcy010n87ny6ovc4w63	2026-03-24 14:58:49.279	2026-03-24 15:04:46.92
cmn4qpisc017687ny8wn45870	\N	SERAFINI	PATRIZIO	\N	\N	direttore sanitario	\N	t	cmn4qpfxl00ub87ny9242ts4q	2026-03-24 14:58:49.309	2026-03-24 14:59:11.777
cmn4qpiso017887ny74jnxpii	\N	CELESTINI	MARCELLO	\N	\N	direttore sanitario	\N	t	cmn4qpg0v00uq87nyblbf72pw	2026-03-24 14:58:49.32	2026-03-24 14:59:11.792
cmn4qpisz017a87ny1ny7stnf	\N	BORGNA	ANDREA	\N	\N	amministratore	\N	t	cmn4qp9sq004287nyi1hjfbx1	2026-03-24 14:58:49.331	2026-03-24 14:59:11.809
cmn4qpith017c87nylfyh49iu	\N	DI TONNO	LAURA	\N	\N	direttore sanitario	\N	t	cmn4qp9sq004287nyi1hjfbx1	2026-03-24 14:58:49.349	2026-03-24 14:59:11.827
cmn4qpiu0017e87nylhyiej47	\N	PERSIA 2	GIANCARLO	\N	\N	\N	\N	t	cmn4qp9sq004287nyi1hjfbx1	2026-03-24 14:58:49.368	2026-03-24 14:59:11.846
cmn4qpium017h87nyi8vf4z3f	\N	ILARDO	GIUSEPPE	\N	\N	amministratore	\N	t	cmn4qpiub017f87nylqtfrqfe	2026-03-24 14:58:49.391	2026-03-24 15:00:28.653
cmn4qpiva017j87nyu878aibq	\N	CAPERNA	DAMIANO	\N	\N	\N	\N	t	cmn4qpiub017f87nylqtfrqfe	2026-03-24 14:58:49.415	2026-03-24 14:59:11.873
cmn4qpiw0017l87nyq78cdvn6	\N	TINO	FEDERICA	\N	\N	ottico	\N	t	cmn4qpiub017f87nylqtfrqfe	2026-03-24 14:58:49.441	2026-03-24 15:04:46.959
cmn4qpiwd017n87ny4e4jiemj	\N	CAPRI 2	FEDERICA	\N	\N	ADDETTO ALLA SEGRETERIA	\N	t	cmn4qpiub017f87nylqtfrqfe	2026-03-24 14:58:49.453	2026-03-24 15:04:46.994
cmn4qpiwp017p87nyy0dlcj00	\N	D'ANGELO	GIULIA	\N	\N	ADDETTO ALLA SEGRETERIA	\N	t	cmn4qp9le003387ny8s0k5xf3	2026-03-24 14:58:49.465	2026-03-24 15:04:47.023
cmn4qpix2017r87nyv058rull	\N	COCCO	FABIANA	\N	\N	ASO	\N	t	cmn4qp9le003387ny8s0k5xf3	2026-03-24 14:58:49.478	2026-03-24 15:04:47.056
cmn4qpixl017t87nyl26bsl57	\N	ANTINORI	LETIZIA	\N	\N	ASO	\N	t	cmn4qp9le003387ny8s0k5xf3	2026-03-24 14:58:49.497	2026-03-24 15:04:47.088
cmn4qpiym017w87nyod8uuz6l	\N	DI STASIO	MIRKO	\N	\N	impiegato	\N	t	cmn4qpiy8017u87nynfbhwteb	2026-03-24 14:58:49.534	2026-03-24 15:04:47.124
cmn4qpiz0017y87ny7bostjho	\N	ESPOSITO	SILVANA	\N	\N	ASO	\N	t	cmn4qpiy8017u87nynfbhwteb	2026-03-24 14:58:49.548	2026-03-24 15:04:47.165
cmn4qpizk018087ny6y86wvr5	\N	NIFOSI	FRANCESCO MARIA	\N	\N	odontoiatra	\N	t	cmn4qpiy8017u87nynfbhwteb	2026-03-24 14:58:49.568	2026-03-24 14:59:11.985
cmn4qpj0d018287nyit1bxi9h	\N	LOTTI	EDOARDO	\N	\N	impiegato	\N	t	cmn4qpiy8017u87nynfbhwteb	2026-03-24 14:58:49.598	2026-03-24 15:04:47.197
cmn4qpj0o018487nyiickkasd	\N	BERNARDINI	LUCA	\N	\N	ADDETTO ALLA SEGRETERIA	\N	t	cmn4qpiy8017u87nynfbhwteb	2026-03-24 14:58:49.608	2026-03-24 15:04:47.229
cmn4qpj19018787nyhv30yxam	\N	ANNALISA	D'AGOSTINO	\N	\N	ASO	\N	t	cmn4qpj0y018587nyeufe798s	2026-03-24 14:58:49.629	2026-03-24 15:04:47.269
cmn4qpj1n018987ny9oxada7r	\N	IANNARELLA	GIULIA	\N	\N	ASO	\N	t	cmn4qpj0y018587nyeufe798s	2026-03-24 14:58:49.643	2026-03-24 15:04:47.308
cmn4qpj1z018b87ny36u774d7	\N	MARINO	SHARON	\N	\N	ADDETTO ALLA SEGRETERIA	\N	t	cmn4qpj0y018587nyeufe798s	2026-03-24 14:58:49.655	2026-03-24 15:04:47.334
cmn4qpj2c018d87nymfvb3o7m	\N	RIPA	RAMONA	\N	\N	ADDETTO ALLA SEGRETERIA	\N	t	cmn4qpj0y018587nyeufe798s	2026-03-24 14:58:49.668	2026-03-24 15:04:47.368
cmn4qpj36018g87nydj74lwpe	\N	PETRILLI	MOANA	\N	\N	impiegato	\N	t	cmn4qpj2n018e87nytwtv0yt7	2026-03-24 14:58:49.699	2026-03-24 15:04:47.397
cmn4qpj3p018i87nyu96voqjw	\N	DI LIBERTO	MARIA JOSE'	\N	\N	ADDETTO ALLA SEGRETERIA	\N	t	cmn4qpj2n018e87nytwtv0yt7	2026-03-24 14:58:49.718	2026-03-24 15:04:47.432
cmn4qpj45018k87nybqgbupsp	\N	ROSSI	LIDIA	\N	\N	ADDETTO ALLA SEGRETERIA	\N	t	cmn4qpj2n018e87nytwtv0yt7	2026-03-24 14:58:49.733	2026-03-24 15:04:47.459
cmn4qpj4j018m87ny13z8bqqp	\N	VALENTI	NICOLE	\N	\N	ADDETTO ALLA SEGRETERIA	\N	t	cmn4qpj2n018e87nytwtv0yt7	2026-03-24 14:58:49.747	2026-03-24 15:04:47.491
cmn4qpj52018o87nytc7rwrw5	\N	BASCIANI	MARA	\N	\N	ADDETTO ALLA SEGRETERIA	\N	t	cmn4qpj2n018e87nytwtv0yt7	2026-03-24 14:58:49.767	2026-03-24 15:04:47.515
cmn4qpj5u018q87nymddfx7fk	\N	FARRIS	DORANNA	\N	\N	ASO	\N	t	cmn4qpj2n018e87nytwtv0yt7	2026-03-24 14:58:49.795	2026-03-24 15:04:47.539
cmn4qpj6e018s87nycgxtomm0	\N	TEDESCHI	ALESSIA	\N	\N	ASO	\N	t	cmn4qpj2n018e87nytwtv0yt7	2026-03-24 14:58:49.815	2026-03-24 15:04:47.576
cmn4qpj7b018v87nyohw77obk	\N	TUDINI	CRISTINA	\N	\N	ADDETTO ALLA SEGRETERIA	\N	t	cmn4qpj6v018t87nyltv4s543	2026-03-24 14:58:49.847	2026-03-24 15:04:47.601
cmn4qpj7o018x87ny5tgxk4sc	\N	ZERRA	SIMONA	\N	\N	ASO	\N	t	cmn4qpj6v018t87nyltv4s543	2026-03-24 14:58:49.86	2026-03-24 15:04:47.624
cmn4qpj81018z87nyk7kfkt5a	\N	LOMONACO	GABRIELE	\N	\N	ASO	\N	t	cmn4qpj6v018t87nyltv4s543	2026-03-24 14:58:49.873	2026-03-24 15:04:47.66
cmn4qpj8d019187ny9iuk3do1	\N	MARINELLI	ALESSANDRA	\N	\N	ADDETTO ALLA SEGRETERIA	\N	t	cmn4qpj6v018t87nyltv4s543	2026-03-24 14:58:49.885	2026-03-24 15:04:47.691
cmn4qpj9l019687nyslc225jg	\N	LUCIANI	GIORGIA	\N	\N	ASO	\N	t	cmn4qpj8q019287nyluvawf2h	2026-03-24 14:58:49.93	2026-03-24 15:04:47.758
cmn4qpja0019887nytdi8dv2a	\N	DI GIOIA	FRANCESCA	\N	\N	ADDETTO ALLA SEGRETERIA	\N	t	cmn4qpj8q019287nyluvawf2h	2026-03-24 14:58:49.944	2026-03-24 15:04:47.785
cmn4qpjah019a87nytezvi9ds	\N	MUSIU	VERONICA	\N	\N	ADDETTO ALLA SEGRETERIA	\N	t	cmn4qpj8q019287nyluvawf2h	2026-03-24 14:58:49.962	2026-03-24 15:04:47.816
cmn4qpjaz019c87nywrqoshda	\N	SANGUIGNI	SILVIA	\N	\N	ASO	\N	t	cmn4qpj8q019287nyluvawf2h	2026-03-24 14:58:49.979	2026-03-24 15:04:47.849
cmn4qpjbl019e87nyr7zcdf86	\N	AMALFITANI	EMANUELA	\N	\N	ADDETTO ALLA SEGRETERIA	\N	t	cmn4qpj8q019287nyluvawf2h	2026-03-24 14:58:50.002	2026-03-24 15:04:47.881
cmn4qpjc1019g87nyuu1tvsow	\N	D'AMORE	GAIA	\N	\N	ASO	\N	t	cmn4qpj8q019287nyluvawf2h	2026-03-24 14:58:50.017	2026-03-24 15:04:47.916
cmn4qpjco019i87ny8zweqktj	\N	CONSTANTIN	REBECA ELENA	\N	\N	\N	\N	t	cmn4qpi2b013u87nyee2mjo30	2026-03-24 14:58:50.04	2026-03-24 15:04:47.944
cmn4qpjd3019k87ny1j2fz94y	\N	DALU	JESSICA	\N	\N	\N	\N	t	cmn4qpi2b013u87nyee2mjo30	2026-03-24 14:58:50.056	2026-03-24 15:04:47.971
cmn4qpjdg019m87ny8oxhtz91	\N	RAMONI	RACHELE	\N	\N	ASO	\N	t	cmn4qpiy8017u87nynfbhwteb	2026-03-24 14:58:50.069	2026-03-24 15:04:47.994
cmn4qpjdv019o87nysoo7xg1j	\N	ESPOSITO	LORENZO	\N	\N	impiegato	\N	t	cmn4qpiy8017u87nynfbhwteb	2026-03-24 14:58:50.084	2026-03-24 15:04:48.019
cmn4qpjef019q87ny373pg7z0	\N	MAZZANTI	SIMONA	\N	\N	ADDETTO ALLA SEGRETERIA	\N	t	cmn4qpiy8017u87nynfbhwteb	2026-03-24 14:58:50.104	2026-03-24 15:04:48.043
cmn4qpjev019s87nyv1gd7jiy	\N	NATALINI	MARCO	\N	\N	impiegato	\N	t	cmn4qpiy8017u87nynfbhwteb	2026-03-24 14:58:50.119	2026-03-24 15:04:48.072
cmn4qpjf8019u87nywvoatvix	\N	CASTALDO	MARIA PRINCIPIA	\N	\N	impiegato	\N	t	cmn4qpiy8017u87nynfbhwteb	2026-03-24 14:58:50.132	2026-03-24 15:04:48.103
cmn4qpjfo019w87nyl1emeif6	\N	GIOVANNELLI	ADRIANA	\N	\N	impiegato	\N	t	cmn4qpiy8017u87nynfbhwteb	2026-03-24 14:58:50.148	2026-03-24 15:04:48.134
cmn4qpjg0019y87nyz5dkvgza	\N	CIRIANI	MARCO	\N	\N	impiegato	\N	t	cmn4qpiy8017u87nynfbhwteb	2026-03-24 14:58:50.16	2026-03-24 15:04:48.166
cmn4qpjgl01a087nyp09ei1nt	\N	DUGO	ILARIA	\N	\N	impiegato	\N	t	cmn4qpiy8017u87nynfbhwteb	2026-03-24 14:58:50.182	2026-03-24 15:04:48.195
cmn4qpjh401a287nyfxsux493	\N	ELEONORA	ZAPPU	\N	\N	ADDETTO ALLA SEGRETERIA	\N	t	cmn4qpiy8017u87nynfbhwteb	2026-03-24 14:58:50.2	2026-03-24 15:04:48.229
cmn4qpjhh01a487nyeu90yni9	\N	LALA	ENTELA	\N	\N	impiegato	\N	t	cmn4qpiy8017u87nynfbhwteb	2026-03-24 14:58:50.214	2026-03-24 15:04:48.268
cmn4qpjhz01a687nylj4rmtnv	\N	Goffi	Ivano Andrea	\N	\N	impiegato	\N	t	cmn4qpge100w787nybrl484jj	2026-03-24 14:58:50.231	2026-03-24 15:04:48.293
cmn4qpjic01a887nyez43jphx	\N	D'Achille	Silvia	\N	\N	ASO	\N	t	cmn4qpff200s687nym78148kq	2026-03-24 14:58:50.244	2026-03-24 15:04:48.317
cmn4qpjjc01ab87nyc1djrr0z	\N	Massini	Gianluca	\N	\N	odontoiatra	\N	t	cmn4qpjiv01a987nyv70r6rgu	2026-03-24 14:58:50.281	2026-03-24 14:59:40.036
cmn4qpjjp01ad87ny4hd3mv0m	\N	Ferrara	Stefania	\N	\N	impiegato	\N	t	cmn4qpjiv01a987nyv70r6rgu	2026-03-24 14:58:50.294	2026-03-24 15:04:48.348
cmn4qpjk101af87nysrd24dni	\N	Taddei	Carla	\N	\N	legale rappresentante	\N	t	cmn4qp917000m87nyfxr06yy6	2026-03-24 14:58:50.305	2026-03-24 14:59:12.642
cmn4qpjkd01ah87nyc5aehsyj	\N	Coppola	Pietro	\N	\N	direttore sanitario	\N	t	cmn4qp917000m87nyfxr06yy6	2026-03-24 14:58:50.317	2026-03-24 14:59:12.657
cmn4qpjkq01aj87nytctx39tp	\N	Gellini	Massimo	\N	\N	\N	\N	t	cmn4qpbxn00dl87nytb9ojxv9	2026-03-24 14:58:50.331	2026-03-24 14:59:12.675
cmn4qpjl201al87nybim10fye	\N	Maj Dagmara	Barbara	\N	\N	ASO	\N	t	cmn4qpbxn00dl87nytb9ojxv9	2026-03-24 14:58:50.342	2026-03-24 15:04:48.393
cmn4qpjlf01an87nyzj88zple	\N	Gentilini	Flavia	\N	\N	odontoiatra	\N	t	cmn4qpc5800ef87nyqe8uwix1	2026-03-24 14:58:50.355	2026-03-24 14:59:12.709
cmn4qpjlr01ap87nyh52iza4a	\N	Luzi	Antonella	\N	\N	direttore sanitario	\N	t	cmn4qpg9z00vq87nyhtn9ffnq	2026-03-24 14:58:50.367	2026-03-24 14:59:12.723
cmn4qpjme01ar87nyb6s06qur	\N	Mangano	Jessica	\N	\N	\N	\N	t	cmn4qpbgp00bj87ny8dzuxnq1	2026-03-24 14:58:50.39	2026-03-24 15:04:48.417
cmn4qpjmx01at87nyeucob8pk	\N	Di Canio	Martina	\N	\N	ADDETTO ALLA SEGRETERIA	\N	t	cmn4qpgbs00vy87ny8hvwvnz3	2026-03-24 14:58:50.41	2026-03-24 15:04:48.457
cmn4qpjnd01av87nyse4rgv7b	\N	Cerroni	Pamela	\N	\N	ASO	\N	t	cmn4qpcwe00hp87nybw7e95rf	2026-03-24 14:58:50.425	2026-03-24 15:04:48.49
cmn4qpjok01ay87ny63opbkit	\N	Fiori 2	Daniele	\N	\N	\N	\N	t	cmn4qpjo101aw87nyd2selny0	2026-03-24 14:58:50.469	2026-03-24 14:59:12.806
cmn4qpjp101b087nycgmciq7v	\N	Simona 2	Biancucci	\N	\N	\N	\N	t	cmn4qpjo101aw87nyd2selny0	2026-03-24 14:58:50.486	2026-03-24 14:59:12.82
cmn4qpjpg01b287nyi75voxwj	\N	Sommerfeld 2	Joanna Barbara	\N	\N	\N	\N	t	cmn4qpjo101aw87nyd2selny0	2026-03-24 14:58:50.5	2026-03-24 14:59:12.844
cmn4qpjq701b487nyt30ylr8y	\N	Sabatini 2	Alessandro	\N	\N	titolare	\N	t	cmn4qpexw00q587ny7kl0bubh	2026-03-24 14:58:50.528	2026-03-24 14:59:12.863
cmn4qpjrd01b787nysk4h6dmw	\N	Santarelli	Silvia	\N	\N	medico oculista	\N	t	cmn4qpjqs01b587ny4a3s87jg	2026-03-24 14:58:50.57	2026-03-24 14:59:12.887
cmn4qpjrr01b987nyjqc8trcg	\N	Torquati 3	Riccardo	\N	\N	\N	\N	t	cmn4qph84010187nybc7hiq2o	2026-03-24 14:58:50.583	2026-03-24 14:59:12.9
cmn4qpjs801bb87ny2lgc5l09	\N	Olivari 2	Valerio	\N	\N	\N	\N	t	cmn4qph84010187nybc7hiq2o	2026-03-24 14:58:50.6	2026-03-24 14:59:12.913
cmn4qpjsp01bd87ny93awf7l2	\N	Montesi	Valeria	\N	\N	ADDETTO ALLA SEGRETERIA	\N	t	cmn4qph84010187nybc7hiq2o	2026-03-24 14:58:50.618	2026-03-24 15:04:48.574
cmn4qpjt501bf87nyaegdkr9h	\N	Viero	Sara	\N	\N	ASO	\N	t	cmn4qp9fx002g87ny7fek9n3r	2026-03-24 14:58:50.633	2026-03-24 15:04:48.599
cmn4qpjtt01bi87nythoefpy9	\N	Di Bari	Katya	\N	\N	odontoiatra	\N	t	cmn4qpjtg01bg87nyuo47ipeb	2026-03-24 14:58:50.657	2026-03-24 14:59:12.951
cmn4qpju501bk87ny3ocvepui	\N	Cipriano	Carmela	\N	\N	ASO	\N	t	cmn4qpjtg01bg87nyuo47ipeb	2026-03-24 14:58:50.669	2026-03-24 15:04:48.622
cmn4qpjuo01bm87nyf0r2gzel	\N	Salidu	Tamara	\N	\N	ASO	\N	t	cmn4qpjtg01bg87nyuo47ipeb	2026-03-24 14:58:50.688	2026-03-24 15:04:48.643
cmn4qpjv601bo87nyle5pxdre	\N	Leone	Serena	\N	\N	ADDETTO ALLA SEGRETERIA	\N	t	cmn4qpjtg01bg87nyuo47ipeb	2026-03-24 14:58:50.706	2026-03-24 15:04:48.665
cmn4qpjvj01bq87nyporbbo09	\N	Alimonti	Giancarlo	\N	\N	direttore sanitario	\N	t	cmn4qpb4t00a387nyesq05so7	2026-03-24 14:58:50.719	2026-03-24 14:59:13.004
cmn4qpjw601bt87nyevdfm7l1	\N	Benghi 2	Paola	\N	\N	ADDETTO ALLA SEGRETERIA	\N	t	cmn4qpjvt01br87nysou5uqwm	2026-03-24 14:58:50.742	2026-03-24 15:04:48.69
cmn4qpjwi01bv87ny4t5txcbl	\N	Cerbini	Cristina	\N	\N	ASO	\N	t	cmn4qpdax00jg87nyppslibvy	2026-03-24 14:58:50.754	2026-03-24 15:04:48.723
cmn4qpjwv01bx87nyz135inee	\N	Oltea Sogiuc	Silvia	\N	\N	addetta alle pulizie	\N	t	cmn4qpd0k00i787nyzzrmnx6t	2026-03-24 14:58:50.767	2026-03-24 15:04:48.753
cmn4qpjx601bz87nybc47ivzo	\N	Taglieri	Vilfredo	\N	\N	amministratore	\N	t	cmn4qpgks00x487nyd8yu9yqe	2026-03-24 14:58:50.779	2026-03-24 14:59:13.068
cmn4qpjxk01c187nyltd5c6cl	\N	CAPORALE	PIERFRANCESCO	\N	\N	odontoiatra	\N	t	cmn4qpdd300jp87ny25xirjtd	2026-03-24 14:58:50.792	2026-03-24 14:59:13.084
cmn4qpjy301c387nytpew0e55	\N	CAPORALE	WALTER	\N	\N	odontoiatra	\N	t	cmn4qpdd300jp87ny25xirjtd	2026-03-24 14:58:50.811	2026-03-24 14:59:13.1
cmn4qpjyr01c587ny02qx5czl	\N	CUNI	UEDA	\N	\N	ASO	\N	t	cmn4qpbg000bg87ny1dj7tqmn	2026-03-24 14:58:50.835	2026-03-24 15:04:48.784
cmn4qpjzx01c887nycr9da839	\N	BASILE	MARIA PIA	\N	\N	odontoiatra	\N	t	cmn4qpjzk01c687ny7du64l3h	2026-03-24 14:58:50.877	2026-03-24 14:59:32.748
cmn4qpk0b01ca87nyy3ba5ffy	\N	FABRIZI	MARLENE	\N	\N	odontoiatra	\N	t	cmn4qpjzk01c687ny7du64l3h	2026-03-24 14:58:50.892	2026-03-24 14:59:32.775
cmn4qpk0x01cc87nypm6648uc	\N	RIGANELLI	ANNARITA	\N	\N	ADDETTO ALLA SEGRETERIA	\N	t	cmn4qpjzk01c687ny7du64l3h	2026-03-24 14:58:50.914	2026-03-24 15:04:48.819
cmn4qpk1c01ce87ny9y9gvyog	\N	BONERTI	MARTINA	\N	\N	\N	\N	t	cmn4qpjzk01c687ny7du64l3h	2026-03-24 14:58:50.929	2026-03-24 15:04:48.854
cmn4qpk2401ch87nylxcb0ac2	\N	MARINO 2	NICOLE	\N	\N	odontoiatra	\N	t	cmn4qpk1r01cf87nybejpp649	2026-03-24 14:58:50.956	2026-03-24 14:59:13.205
cmn4qpk2g01cj87ny43ei7inc	\N	CORTELLA	VANESSA	\N	\N	ASO	\N	t	cmn4qpk1r01cf87nybejpp649	2026-03-24 14:58:50.968	2026-03-24 15:04:48.883
cmn4qpk2s01cl87nyla0nta81	\N	corlito	FLORIANA	\N	\N	impiegato	\N	t	\N	2026-03-24 14:58:50.981	2026-03-24 14:59:13.236
cmn4qpk3q01co87nypcuwl8sg	\N	BORRELLI	MASCIA	\N	\N	ASO	\N	t	cmn4qpk3d01cm87nyyqu2o7j5	2026-03-24 14:58:51.015	2026-03-24 15:04:48.931
cmn4qpk4301cq87nyximxgysu	\N	BONFA'	SARA	\N	\N	igienista dentale	\N	t	cmn4qpk3d01cm87nyyqu2o7j5	2026-03-24 14:58:51.027	2026-03-24 15:04:48.954
cmn4qpk4f01cs87nyzob3lava	\N	DI LULLO	VANIA	\N	\N	impiegato	\N	t	cmn4qpdfk00jy87nyd0483yy1	2026-03-24 14:58:51.039	2026-03-24 15:04:48.976
cmn4qpk4s01cu87nysb02sbh3	\N	BERTERAME	ELISABETTA	\N	\N	\N	\N	t	cmn4qpdfk00jy87nyd0483yy1	2026-03-24 14:58:51.052	2026-03-24 15:04:49
cmn4qpk5501cw87ny9a21qwnz	\N	QUISHIPE	KATERINE	\N	\N	\N	\N	t	cmn4qpdfk00jy87nyd0483yy1	2026-03-24 14:58:51.065	2026-03-24 15:04:49.022
cmn4qpk5r01cy87nyc98lixdz	\N	FERRANTE	FEDERICA	\N	\N	ASO	\N	t	cmn4qpdfk00jy87nyd0483yy1	2026-03-24 14:58:51.087	2026-03-24 15:04:49.046
cmn4qpk6701d087nyog32d1gc	\N	MARIN	MIRIAM	\N	\N	ASO	\N	t	cmn4qpdfk00jy87nyd0483yy1	2026-03-24 14:58:51.103	2026-03-24 15:04:49.071
cmn4qpk6o01d287nyamxodiz3	\N	MINELLI	CRISTINA	\N	\N	ASO	\N	t	cmn4qpdfk00jy87nyd0483yy1	2026-03-24 14:58:51.12	2026-03-24 15:04:49.094
cmn4qpk7001d487nyo8xax1w5	\N	MAIALE	OLIMPIA	\N	\N	ASO	\N	t	cmn4qpbpl00ci87nyzdmn5msm	2026-03-24 14:58:51.132	2026-03-24 15:04:49.116
cmn4qpk7i01d687nyd1acx163	\N	D'ELIA	FRANCESCA	\N	\N	ASO	\N	t	cmn4qpd1l00ic87ny7xbk8630	2026-03-24 14:58:51.15	2026-03-24 15:04:49.138
cmn4qpk8501d887nyfbg8208l	DSNMGH88L71H501H	De Santis	Margherita	\N	\N	ASO	\N	t	cmn4qpc0800dy87nylew79qol	2026-03-24 14:58:51.173	2026-03-24 15:04:49.183
cmn4qpk8t01db87nyxhxmh3lb	\N	Capogna	Marco	\N	\N	odontoiatra	\N	t	cmn4qpk8h01d987nyulvd6jao	2026-03-24 14:58:51.197	2026-03-24 14:59:40.127
cmn4qpk9401dd87ny7291oy3f	\N	HALALAN	MARYA	\N	\N	ASO	\N	t	cmn4qpk8h01d987nyulvd6jao	2026-03-24 14:58:51.208	2026-03-24 15:04:49.236
cmn4qpk9g01df87ny9x6pvf1c	\N	Tulli	Serena	\N	\N	ASO	\N	t	cmn4qpk8h01d987nyulvd6jao	2026-03-24 14:58:51.22	2026-03-24 15:04:49.264
cmn4qpk9u01dh87nybgyb9xuh	\N	Genco	Eleonora	\N	\N	ADDETTO ALLA SEGRETERIA	\N	t	cmn4qpk8h01d987nyulvd6jao	2026-03-24 14:58:51.234	2026-03-24 15:04:49.287
cmn4qpkan01dk87nyd4b8lcbc	\N	MARCO 2	CAPOGNA	\N	\N	odontoiatra	\N	t	cmn4qpka901di87nyy9xykutt	2026-03-24 14:58:51.263	2026-03-24 14:59:40.161
cmn4qpkb701dm87nyvvaum2t8	\N	D'Amore	Paolo	\N	\N	odontoiatra	\N	t	cmn4qpka901di87nyy9xykutt	2026-03-24 14:58:51.283	2026-03-24 14:59:13.51
cmn4qpkbi01do87nya2a69ory	\N	Curiale	Orsola	\N	\N	ASO	\N	t	cmn4qpka901di87nyy9xykutt	2026-03-24 14:58:51.294	2026-03-24 15:04:49.329
cmn4qpkch01dr87nyp62bhm1x	\N	Palattella	Pierpaolo	\N	\N	odontoiatra	\N	t	cmn4qpkc401dp87nyuwn4scfz	2026-03-24 14:58:51.33	2026-03-24 14:59:13.551
cmn4qpkcu01dt87nyhcfnlgjv	\N	Moldovan	Ramona Loredana	\N	\N	ASO	\N	t	cmn4qpkc401dp87nyuwn4scfz	2026-03-24 14:58:51.342	2026-03-24 15:04:49.371
cmn4qpkdi01dw87nybjp4pige	\N	Savi	Lina	\N	\N	ASO	\N	t	cmn4qpkd501du87nyv850trrc	2026-03-24 14:58:51.366	2026-03-24 15:04:49.4
cmn4qpkea01dz87nyxe6ripo8	\N	Briselda	Daja	\N	\N	ASO	\N	t	cmn4qpkdt01dx87nyadcmy5rp	2026-03-24 14:58:51.394	2026-03-24 15:04:49.424
cmn4qpkem01e187nyweo819sq	\N	Augello	Martina	\N	\N	ASO	\N	t	cmn4qpewb00q087nyt48ahmey	2026-03-24 14:58:51.406	2026-03-24 15:04:49.447
cmn4qpkfc01e387ny0bz9ijnu	\N	Frattaroli	Tiziana	\N	\N	ADDETTO ALLA SEGRETERIA	\N	t	cmn4qpewb00q087nyt48ahmey	2026-03-24 14:58:51.432	2026-03-24 15:04:49.471
cmn4qpkg201e687nyf92b089t	\N	Nasto	Loredana	\N	\N	ASO	\N	t	cmn4qpkfo01e487nyyoe21g8v	2026-03-24 14:58:51.459	2026-03-24 15:04:49.496
cmn4qpkge01e887nyv8h7on83	\N	Linfante	Patrizia	\N	\N	ASO	\N	t	cmn4qpkfo01e487nyyoe21g8v	2026-03-24 14:58:51.47	2026-03-24 15:04:49.522
cmn4qpkgs01ea87nyw2g0kizs	\N	Gentili	Davide	\N	\N	odontoiatra	\N	t	cmn4qpkfo01e487nyyoe21g8v	2026-03-24 14:58:51.484	2026-03-24 14:59:40.184
cmn4qpkh401ec87nyodmt618a	\N	Giustiniani	Cristina	\N	\N	ASO	\N	t	cmn4qpd7o00j387nyiedv8bon	2026-03-24 14:58:51.496	2026-03-24 15:04:49.549
cmn4qpkhg01ee87nyclyy8jvg	\N	Tosoni	Cristiana	\N	\N	ASO	\N	t	cmn4qpkfo01e487nyyoe21g8v	2026-03-24 14:58:51.508	2026-03-24 15:04:49.576
cmn4qpki401eh87nydvrjzapa	\N	Teresini	Roberta	\N	\N	ASO	\N	t	cmn4qpkhr01ef87nybc9bgi6i	2026-03-24 14:58:51.532	2026-03-24 15:04:49.605
cmn4qpkij01ej87nyd4eki0qt	\N	Lovaglio	Dott. Angelo	\N	\N	odontoiatra	\N	t	cmn4qpkhr01ef87nybc9bgi6i	2026-03-24 14:58:51.548	2026-03-24 14:59:40.208
cmn4qpkj301el87nyd7kf2882	\N	Berna	Dott. Norberto	\N	\N	odontoiatra	\N	t	cmn4qpkdt01dx87nyadcmy5rp	2026-03-24 14:58:51.567	2026-03-24 14:59:40.232
cmn4qpkjl01en87nyz8q8v616	\N	Ellera - socio lavoratore	Emanuela	\N	\N	office manager	\N	t	cmn4qpjiv01a987nyv70r6rgu	2026-03-24 14:58:51.585	2026-03-24 14:59:13.776
cmn4qpkjy01ep87nyfn1gl8ab	\N	Massini - socio lavoratore	Chiara	\N	\N	addetta marketing	\N	t	cmn4qpjiv01a987nyv70r6rgu	2026-03-24 14:58:51.599	2026-03-24 14:59:13.796
cmn4qpkkb01er87nychom7mv6	\N	Aureli	Giorgia	\N	\N	ASO	\N	t	cmn4qpjiv01a987nyv70r6rgu	2026-03-24 14:58:51.611	2026-03-24 15:04:49.639
cmn4qpkks01et87nyic2g4wu9	\N	Salustri	Moira	\N	\N	ADDETTO ALLA SEGRETERIA	\N	t	cmn4qpjiv01a987nyv70r6rgu	2026-03-24 14:58:51.628	2026-03-24 15:04:49.673
cmn4qpklk01ew87nyd2cinust	\N	Bottacchiari	Maria Teresa	\N	\N	legale rappresentante	\N	t	cmn4qpkl801eu87nytakzct2g	2026-03-24 14:58:51.656	2026-03-24 14:59:13.844
cmn4qpkly01ey87nyuppsc8v0	\N	Palma	Alessandro	\N	\N	direttore sanitario	\N	t	cmn4qpkl801eu87nytakzct2g	2026-03-24 14:58:51.67	2026-03-24 14:59:32.874
cmn4qpkma01f087nyg9kru7km	\N	Di Re - socio lavoratore	Lamberto	\N	\N	aso/segretaria	\N	t	cmn4qpkl801eu87nytakzct2g	2026-03-24 14:58:51.683	2026-03-24 15:00:28.906
cmn4qpkmo01f287nyv5stw3wh	\N	Marrocco - socio lavoratore	Pietro	\N	\N	aso/segretaria	\N	t	cmn4qpkl801eu87nytakzct2g	2026-03-24 14:58:51.697	2026-03-24 14:59:13.902
cmn4qpkn801f487nyx0dgpr2l	\N	Cafarotti	Maria Grazia	\N	\N	ASO	\N	t	cmn4qpkl801eu87nytakzct2g	2026-03-24 14:58:51.717	2026-03-24 15:04:49.706
cmn4qpknl01f687nytwrtp1pr	\N	Garadia	Moccia	\N	\N	direttore sanitario	\N	t	cmn4qpegc00o387nyl4svxrm3	2026-03-24 14:58:51.729	2026-03-24 14:59:13.935
cmn4qpkny01f887nyjb1g9h9l	\N	Sambucci	Marta	\N	\N	ASO	\N	t	cmn4qpegc00o387nyl4svxrm3	2026-03-24 14:58:51.742	2026-03-24 15:04:49.742
cmn4qpko801fa87ny64rg27c0	\N	Bruschini - tirocinante	Federica	\N	\N	ASO	\N	t	cmn4qpegc00o387nyl4svxrm3	2026-03-24 14:58:51.753	2026-03-24 15:04:49.769
cmn4qpkop01fc87nyx451tp4b	\N	Stefano 2	Loghi	\N	\N	direttore sanitario	\N	t	cmn4qpfmu00t287nyc8qnoav1	2026-03-24 14:58:51.77	2026-03-24 14:59:13.975
cmn4qpkp101fe87ny065qm73c	\N	Leonetti	Alessio	\N	\N	operaio	\N	t	cmn4qpi3b013z87nymfvz2juv	2026-03-24 14:58:51.781	2026-03-24 15:04:49.807
cmn4qpkpl01fg87nyqrz9zykp	\N	Mihail	Marin	\N	\N	operaio	\N	t	cmn4qpi3b013z87nymfvz2juv	2026-03-24 14:58:51.801	2026-03-24 15:04:49.842
cmn4qpkqc01fj87ny18twuzhg	\N	Franchi	Luigi	\N	\N	odontoiatra	\N	t	cmn4qpkq101fh87nynipijhfx	2026-03-24 14:58:51.829	2026-03-24 14:59:40.28
cmn4qpkqo01fl87nyj5ww35i8	\N	De Sanctis	Chiara	\N	\N	ASO	\N	t	cmn4qpkq101fh87nynipijhfx	2026-03-24 14:58:51.84	2026-03-24 15:04:49.883
cmn4qpkr001fn87nyiceb8qmq	\N	Marconi	Francesca	\N	\N	ASO	\N	t	cmn4qpkq101fh87nynipijhfx	2026-03-24 14:58:51.852	2026-03-24 15:04:49.913
cmn4qpkrk01fp87nyngjy8uj9	\N	Cianfrocca	Alessia	\N	\N	ASO	\N	t	cmn4qpkq101fh87nynipijhfx	2026-03-24 14:58:51.872	2026-03-24 15:04:49.94
cmn4qpkrv01fr87nyg5h7vqh1	\N	MANZARI	ROMINA	\N	\N	\N	\N	t	cmn4qpiub017f87nylqtfrqfe	2026-03-24 14:58:51.883	2026-03-24 15:04:49.973
cmn4qpks801ft87nyuhg4qjo1	\N	Mangione	Arianna	\N	\N	ADDETTO ALLA SEGRETERIA	\N	t	cmn4qp9sq004287nyi1hjfbx1	2026-03-24 14:58:51.896	2026-03-24 15:04:50
cmn4qpksp01fv87nyaaoy8dro	\N	Marini	Micol	\N	\N	ASO	\N	t	cmn4qpb1g009r87ny4peqlbuz	2026-03-24 14:58:51.914	2026-03-24 15:04:50.038
cmn4qpktc01fy87ny4p8tpt46	\N	Giorgia	Silvestri	\N	\N	ASO	\N	t	cmn4qpkt001fw87nyp8ag44d6	2026-03-24 14:58:51.936	2026-03-24 15:04:50.064
cmn4qpktn01g087nyxd09pfyr	\N	De Paola	Denise	\N	\N	ASO	\N	t	cmn4qpkt001fw87nyp8ag44d6	2026-03-24 14:58:51.947	2026-03-24 15:04:50.104
cmn4qpktz01g287nyp18a03of	\N	Radicci	Cristiano	\N	\N	odontoiatra	\N	t	cmn4qpkt001fw87nyp8ag44d6	2026-03-24 14:58:51.959	2026-03-24 14:59:40.305
cmn4qpkua01g487ny3jwbn2lh	\N	Ballicu	Marta	\N	\N	ADDETTO ALLA SEGRETERIA	\N	t	cmn4qpc3k00e887ny9lwbzj7u	2026-03-24 14:58:51.971	2026-03-24 15:04:50.146
cmn4qpkun01g687ny1g5sgqh5	\N	Giuliano	Silvia	\N	\N	ASO	\N	t	cmn4qpjzk01c687ny7du64l3h	2026-03-24 14:58:51.983	2026-03-24 15:04:50.17
cmn4qqctu02g687nyw8tadn45	\N	corlito	FLORIANA	\N	\N	impiegato	\N	f	cmn4qqaqy02b787nyoqi0zfic	2026-03-24 14:59:28.242	2026-03-24 15:04:48.905
cmnswk4y800016frksn9mskwq	masmdamsdkmakmmdakm	marias	maria	maria@maria.maria	365899745	aso	\N	f	cmmdjfgx00000kd41ei21e3yl	2026-04-10 12:49:04.016	2026-04-10 12:49:04.016
cmnsy1jdc0002wqzwlzj4mrf8	MACREDOOASK	mariani	maria	marco@mario.it	851795	aso	2026-04-10 00:00:00	f	cmnhbyg430000d5b171ao4nrk	2026-04-10 13:30:35.375	2026-04-10 13:30:35.375
cmnsy2e8v0007wqzwhqyhywe6	MACREDOOASKS	mariani	maria	marco@mario.it	851795	aso	2026-04-10 00:00:00	f	cmnhbyg430000d5b171ao4nrk	2026-04-10 13:31:15.395	2026-04-10 13:31:15.395
cmnwyky7r0002t8a0c5uq9dqb	MTOPOORITJKKSKMSM	P	Melissa	melissafragolina89@gmail.org	36936963969	ASO	2026-04-13 00:00:00	f	cmmdjfgx00000kd41ei21e3yl	2026-04-13 08:56:45.777	2026-04-13 13:23:34.067
cmnxbax220002pj0ta31ipttx	ASMDADPA	Paolani	Poalo	mail@mail	5625632	aso	2026-04-13 00:00:00	t	cmnhbyg430000d5b171ao4nrk	2026-04-13 14:52:52.739	2026-04-13 14:52:52.739
\.


--
-- Data for Name: PersonClient; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PersonClient" (id, "personId", "clientId", "createdAt") FROM stdin;
cmmne6uym0002123hpuuzfcth	cmmndkqij0003g4mojjqz1ael	cmmdjfgx00000kd41ei21e3yl	2026-03-12 11:36:18.233
cmmnf7d8n0002svg0dqtvbj5m	cmmndf4sj0001g4motnfhux74	cmmdjfgx00000kd41ei21e3yl	2026-03-12 12:04:41.538
cmnsy1jrn0004wqzwqt2lx12p	cmnsy1jdc0002wqzwlzj4mrf8	cmnhbyg430000d5b171ao4nrk	2026-04-10 13:30:35.375
cmnsy2ebk0009wqzwof2x4tm8	cmnsy2e8v0007wqzwhqyhywe6	cmnhbyg430000d5b171ao4nrk	2026-04-10 13:31:15.395
cmnx842jq0002gtexise2wqf4	cmnwyky7r0002t8a0c5uq9dqb	cmmdjfgx00000kd41ei21e3yl	2026-04-13 13:23:34.067
cmnxbax510004pj0tje9rs63d	cmnxbax220002pj0ta31ipttx	cmnhbyg430000d5b171ao4nrk	2026-04-13 14:52:52.739
\.


--
-- Data for Name: PersonSite; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PersonSite" (id, "personId", "siteId", "createdAt") FROM stdin;
cmmne6uyn0004123h05k8wo7u	cmmndkqij0003g4mojjqz1ael	cmmdkyf5z0006kd41l6pqnqlc	2026-03-12 11:36:18.233
cmmnf7d8o0004svg0ls2f27j5	cmmndf4sj0001g4motnfhux74	cmmdkyb4k0004kd41pifw2987	2026-03-12 12:04:41.538
cmnx842om0004gtexdekgoyj6	cmnwyky7r0002t8a0c5uq9dqb	cmmdkyf5z0006kd41l6pqnqlc	2026-04-13 13:23:34.067
\.


--
-- Data for Name: PracticeBillingStep; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PracticeBillingStep" (id, "practiceId", "sortOrder", label, "billingType", "triggerStatus", "amountEur", "billingStatus", "invoiceNumber", "invoiceDate", "paidAt", notes, "createdAt", "updatedAt") FROM stdin;
cmnd9ajqh0009yu6kkrne2q8m	cmnd9aiwa0001yu6kw5cwgwrp	4	Saldo	SALDO	CONCLUSO	1000.000000000000000000000000000000	INCASSATA	\N	2026-03-30 10:00:00	2026-03-30 10:00:00	\N	2026-03-30 14:01:12.809	2026-03-31 13:21:40.612
cmnojtppi0009f11h24oerhze	cmnojtpiy0007f11hyffy0jtt	1	Accettazione	ACCETTAZIONE	ACCETTATO	2000.000000000000000000000000000000	FATTURATA	45/2026	2026-04-07 10:00:00	2026-04-08 10:00:00	\N	2026-04-07 11:41:31.109	2026-04-07 11:43:26.543
cmnojtq2g000df11hkocpyc3g	cmnojtpiy0007f11hyffy0jtt	3	Secondo acconto	SECONDO_ACCONTO	INVIATA_REGIONE	1000.000000000000000000000000000000	DA_FATTURARE	\N	\N	\N	\N	2026-04-07 11:41:31.575	2026-04-07 11:43:26.996
cmnojtq8r000ff11hdk8tk132	cmnojtpiy0007f11hyffy0jtt	4	Saldo	SALDO	ISPEZIONE_ASL	1000.000000000000000000000000000000	DA_FATTURARE	\N	\N	\N	\N	2026-04-07 11:41:31.803	2026-04-07 11:43:27.225
cmnojtpw1000bf11hrpxyawzs	cmnojtpiy0007f11hyffy0jtt	2	Primo acconto	PRIMO_ACCONTO	INIZIO_LAVORI	1000.000000000000000000000000000000	FATTURATA	36	2026-04-07 10:00:00	2026-04-07 10:00:00	\N	2026-04-07 11:41:31.345	2026-04-07 11:48:09.194
cmnd9aj5a0003yu6kpo5nw61r	cmnd9aiwa0001yu6kw5cwgwrp	1	Accettazione	ACCETTAZIONE	ACCETTATO	1000.000000000000000000000000000000	INCASSATA	45/2026	2026-03-30 10:00:00	2026-03-30 10:00:00	\N	2026-03-30 14:01:12.047	2026-03-31 13:21:39.922
cmnd9ajct0005yu6k847xmnqm	cmnd9aiwa0001yu6kw5cwgwrp	2	primo acconto	PRIMO_ACCONTO	INIZIO_LAVORI	2000.000000000000000000000000000000	INCASSATA	46/2026	2026-03-30 10:00:00	2026-03-30 10:00:00	\N	2026-03-30 14:01:12.317	2026-03-31 13:21:40.152
cmnd9ajjn0007yu6kdbt3s4k6	cmnd9aiwa0001yu6kw5cwgwrp	3	Secondo acconto	SECONDO_ACCONTO	ISPEZIONE_ASL	1000.000000000000000000000000000000	INCASSATA	\N	2026-03-30 10:00:00	2026-03-30 10:00:00	\N	2026-03-30 14:01:12.564	2026-03-31 13:21:40.382
\.


--
-- Data for Name: ServiceCatalog; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ServiceCatalog" (id, name, "isActive") FROM stdin;
cmmdjfrtl0001kd41d2qrrj9z	LEGIONELLA	t
cmmdjfrtx0002kd419ycosqnv	INVIO REGIONE LAZIO	t
cmmj9uksl000465jcrd26xcik	DVR	t
cmmj9v3hu000765jc4bvdnr4g	RX	t
\.


--
-- Data for Name: TrainingRecord; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."TrainingRecord" (id, "personId", "courseId", "performedAt", "dueDate", status, priority, "priceEur", "alertMonths", "alertMonths2", "certificateDelivered", notes, "createdAt", "updatedAt", fatturata, "fatturataAt") FROM stdin;
cmmnkcy8x0001odgb1n4dpmxa	cmmm4q8w8000510jt4q6d7yq1	cmmnf9h950005svg079sl1sze	2026-03-13 00:00:00	2027-03-13 00:00:00	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-12 14:29:00.129	2026-03-12 14:29:17.718	f	\N
cmn4p2314000c87nyoqgtts27	cmn4p17xs000a87ny512s5np3	cmmnf9h950005svg079sl1sze	2026-03-23 00:00:00	2027-03-23 00:00:00	SVOLTO	MEDIA	\N	2	3	t	\N	2026-03-24 14:12:36.184	2026-03-24 14:12:36.184	f	\N
cmn4qq21s01n787ny7n9i6aob	cmn4qp91l000o87ny6qn4yctp	cmn4qq21401n487nyq9w5bv7g	2019-06-26 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:14.272	2026-03-24 15:04:35.486	f	\N
cmn4qq22e01n987nyavnifbnp	cmn4qp91y000q87nykkvwg8b8	cmn4qq21401n487nyq9w5bv7g	2023-07-18 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:14.295	2026-03-24 15:04:35.511	f	\N
cmn4qq23401nc87ny6gawy7kn	cmn4qp941001087nyli2c8mim	cmn4qq21401n487nyq9w5bv7g	2024-01-08 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:14.32	2026-03-24 15:04:35.537	f	\N
cmn4qq23u01nf87nyg565zgrs	cmn4qp95q001887nycpnq7kd6	cmn4qq21401n487nyq9w5bv7g	2021-07-04 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:14.346	2026-03-24 15:04:35.563	f	\N
cmn4qq24r01ni87nyy0tr9qeu	cmn4qp96u001d87nysvbqii81	cmn4qq21401n487nyq9w5bv7g	2023-12-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:14.379	2026-03-24 15:04:35.595	f	\N
cmn4qq25r01nk87nyjd1r36lh	cmn4qp977001f87nyixdsetam	cmn4qq21401n487nyq9w5bv7g	2021-12-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:14.415	2026-03-24 15:04:35.621	f	\N
cmn4qq26m01nm87nyx7h9s0ds	cmn4qp97n001h87nyp7sgyfec	cmn4qq21401n487nyq9w5bv7g	2019-12-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:14.446	2026-03-24 15:04:35.646	f	\N
cmn4qq27b01np87nyzszdkcxg	cmn4qp98h001k87ny8qp2efgi	cmn4qq21401n487nyq9w5bv7g	2023-12-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:14.471	2026-03-24 15:04:35.671	f	\N
cmn4qq28201nr87nyb4jeuzte	cmn4qp98t001m87nygl6la4af	cmn4qq21401n487nyq9w5bv7g	2023-12-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:14.498	2026-03-24 15:04:35.696	f	\N
cmn4qq28w01nt87ny0ds6znfp	cmn4qp996001o87ny3gywstln	cmn4qq21401n487nyq9w5bv7g	2022-12-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:14.528	2026-03-24 15:04:35.721	f	\N
cmn4qq29m01nw87nyj6jfayx7	cmn4qp9a5001t87nymdzwd5gt	cmn4qq21401n487nyq9w5bv7g	2023-05-28 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:14.555	2026-03-24 15:04:35.746	f	\N
cmn4qq2ab01ny87nycf86ss45	cmn4qp9bp001v87nywnygsaw8	cmn4qq21401n487nyq9w5bv7g	2024-04-02 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:14.579	2026-03-24 15:04:35.772	f	\N
cmn4qq2bk01o087nyslmndpg5	cmn4qp9c2001x87nyigqwoxyf	cmn4qq21401n487nyq9w5bv7g	2024-03-03 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:14.624	2026-03-24 15:04:35.8	f	\N
cmn4qq2ct01o387nyel08gqae	cmn4qp9d9002287nycr6vnw66	cmn4qq21401n487nyq9w5bv7g	2021-09-01 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:14.669	2026-03-24 15:04:35.833	f	\N
cmn4qq2dp01o587nysapfbtn4	cmn4qp9dk002487nywfeou3i7	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:14.702	2026-03-24 15:04:35.858	f	\N
cmn4qq2eo01o787ny4ymqj2zh	cmn4qp9e0002687nywrx35tz1	cmn4qq21401n487nyq9w5bv7g	2023-06-05 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:14.736	2026-03-24 15:04:35.884	f	\N
cmn4qq2fz01oa87nydxx5zzm5	cmn4qp9f0002b87nyl51a4lqw	cmn4qq21401n487nyq9w5bv7g	2023-06-14 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:14.783	2026-03-24 15:04:35.92	f	\N
cmn4qq2h401oc87nyywyffc3c	cmn4qp9fc002d87nyyfl1dfwd	cmn4qq21401n487nyq9w5bv7g	2023-07-18 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:14.825	2026-03-24 15:04:35.955	f	\N
cmn4qq2i401oe87nyjn7dudr1	cmn4qp9fn002f87nybkzagkpn	cmn4qq21401n487nyq9w5bv7g	2023-08-08 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:14.86	2026-03-24 15:04:35.994	f	\N
cmn4qq2j501oh87nyxh51ktux	cmn4qp9gj002k87nyzw8zlm8b	cmn4qq21401n487nyq9w5bv7g	2023-12-27 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:14.898	2026-03-24 15:04:36.024	f	\N
cmn4qq2k101ok87nyeqdij744	cmn4qp9hy002p87nysy6yy4mg	cmn4qq21401n487nyq9w5bv7g	2024-08-27 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:14.929	2026-03-24 15:04:36.062	f	\N
cmn4qq2ku01on87nym5leif2e	cmn4qp9k0002y87nywpxflx7m	cmn4qq21401n487nyq9w5bv7g	2023-09-13 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:14.959	2026-03-24 15:04:36.1	f	\N
cmn4qq2lu01op87ny6xjeg4rt	cmn4qp9kf003087nyw6obkhx6	cmn4qq21401n487nyq9w5bv7g	2023-09-14 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:14.994	2026-03-24 15:04:36.137	f	\N
cmn4qq2n201or87ny7g4srkaq	cmn4qp9l2003287nyfvt55qqu	cmn4qq21401n487nyq9w5bv7g	2023-09-13 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:15.038	2026-03-24 15:04:36.174	f	\N
cmn4qq2o901ou87nydz93zxnv	cmn4qp9n4003b87nyujvurcxf	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:15.082	2026-03-24 15:04:36.202	f	\N
cmn4qq2p501ow87nyu2z2g26m	cmn4qp9ng003d87ny2rkl8q9y	cmn4qq21401n487nyq9w5bv7g	2021-08-23 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:15.113	2026-03-24 15:04:36.24	f	\N
cmn4qq2q501oy87nyeongyr5h	cmn4qp9nx003f87nyj0fcqd5m	cmn4qq21401n487nyq9w5bv7g	2021-08-23 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:15.15	2026-03-24 15:04:36.268	f	\N
cmn4qq2re01p087nyx5369fu1	cmn4qp9o8003h87nyqlty4max	cmn4qq21401n487nyq9w5bv7g	2021-08-23 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:15.194	2026-03-24 15:04:36.313	f	\N
cmn4qq2sk01p287nyygvpjawz	cmn4qp9ok003j87nyx8yygl20	cmn4qq21401n487nyq9w5bv7g	2018-12-21 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:15.236	2026-03-24 15:04:36.344	f	\N
cmn4qq2tu01p487ny8hkvbkf6	cmn4qp9p0003l87nyj3j46n09	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:15.282	2026-03-24 15:04:36.378	f	\N
cmn4qq2uo01p787nypduwm7n4	cmn4qp9q0003q87ny10t81ejk	cmn4qq21401n487nyq9w5bv7g	2023-02-16 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:15.312	2026-03-24 15:04:36.418	f	\N
cmn4qq2vk01pa87nyy0jz6gru	cmn4qp9r0003v87nyygijz1sf	cmn4qq21401n487nyq9w5bv7g	2023-03-05 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:15.344	2026-03-24 15:04:36.454	f	\N
cmn4qq2w801pc87nyaowfdv17	cmn4qp9rg003x87nykpkt1y9b	cmn4qq21401n487nyq9w5bv7g	2024-03-20 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:15.368	2026-03-24 15:04:36.496	f	\N
cmn4qq2x301pe87nymzhp3ho7	cmn4qp9s0003z87ny9r9c3bgp	cmn4qq21401n487nyq9w5bv7g	2024-03-26 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:15.4	2026-03-24 15:04:36.522	f	\N
cmn4qq2xw01pg87ny17b2wq1n	cmn4qp9sg004187nylhp443s5	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:15.429	2026-03-24 15:04:36.554	f	\N
cmn4qq2yv01pj87nycnlq6zbb	cmn4qp9ts004887nyqfw9ac0f	cmn4qq21401n487nyq9w5bv7g	2019-09-15 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:15.463	2026-03-24 15:04:36.59	f	\N
cmn4qq2zu01pl87ny342rpkpe	cmn4qp9u4004a87ny1aok747m	cmn4qq21401n487nyq9w5bv7g	2023-06-15 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:15.498	2026-03-24 15:04:36.625	f	\N
cmn4qq30j01pn87nydgoh2iax	cmn4qp9uj004c87ny8nae3nyd	cmn4qq21401n487nyq9w5bv7g	2023-06-15 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:15.523	2026-03-24 15:04:36.662	f	\N
cmn4qq31l01pp87nyrth912sl	cmn4qp9ux004e87nyfq492uaw	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:15.562	2026-03-24 15:04:36.689	f	\N
cmn4qq32g01ps87nyubt3eo5l	cmn4qp9vx004j87nyr82mawh2	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:15.592	2026-03-24 15:04:36.715	f	\N
cmn4qq33501pu87nyu3klxrbh	cmn4qp9wb004l87nyj6t33ot6	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:15.618	2026-03-24 15:04:36.738	f	\N
cmn4qq34501px87nyxsz7n0ik	cmn4qp9xf004q87nyne5w5oov	cmn4qq21401n487nyq9w5bv7g	2023-06-14 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:15.653	2026-03-24 15:04:36.764	f	\N
cmn4qq34u01pz87nyp5eo516k	cmn4qp9xq004s87nyfujwajh0	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:15.679	2026-03-24 15:04:36.794	f	\N
cmn4qq35n01q287ny7ojzf26d	cmn4qp9yp004x87nys4rpsfvr	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:15.708	2026-03-24 15:04:36.832	f	\N
cmn4qq36d01q587nyoerf3hzj	cmn4qp9zt005287nydzq4xhx6	cmn4qq21401n487nyq9w5bv7g	2020-09-08 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:15.734	2026-03-24 15:04:36.864	f	\N
cmn4qq37301q787nysw4504b4	cmn4qpa0e005487nylbv3aejb	cmn4qq21401n487nyq9w5bv7g	2024-05-02 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:15.759	2026-03-24 15:04:36.89	f	\N
cmn4qq37z01q987ny8p9t4n4p	cmn4qpa0p005687ny7knpckql	cmn4qq21401n487nyq9w5bv7g	2023-06-11 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:15.791	2026-03-24 15:04:36.915	f	\N
cmn4qq39201qb87nyga2k4c8t	cmn4qpa11005887nyel01ymrl	cmn4qq21401n487nyq9w5bv7g	2022-12-14 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:15.83	2026-03-24 15:04:36.941	f	\N
cmn4qq3a101qd87nyviramtu3	cmn4qpa1d005a87nygsxs89rl	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:15.865	2026-03-24 15:04:36.972	f	\N
cmn4qq3ax01qg87nylfn0q51j	cmn4qpa1z005d87nyjt33954a	cmn4qq21401n487nyq9w5bv7g	2022-09-12 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:15.898	2026-03-24 15:04:36.999	f	\N
cmn4qq3bq01qj87nysan0nvs6	cmn4qpa36005i87nyy5uijmmw	cmn4qq21401n487nyq9w5bv7g	2022-10-18 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:15.927	2026-03-24 15:04:37.027	f	\N
cmn4qq3cf01ql87nyf7iu20jz	cmn4qpa3p005k87ny9igekm49	cmn4qq21401n487nyq9w5bv7g	2022-10-18 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:15.952	2026-03-24 15:04:37.058	f	\N
cmn4qq3dk01qo87nyj8cs0u9u	cmn4qpa4p005p87ny4m51rp2w	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:15.992	2026-03-24 15:04:37.085	f	\N
cmn4qq3eb01qr87nyw2ml0gau	cmn4qpa6z006087nylyoonxqt	cmn4qq21401n487nyq9w5bv7g	2025-03-06 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:16.02	2026-03-24 15:04:37.113	f	\N
cmn4qq3f201qu87nyiadizond	cmn4qpa7x006587nyhkh4ahqh	cmn4qq21401n487nyq9w5bv7g	2021-11-25 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:16.047	2026-03-24 15:04:37.145	f	\N
cmn4qq3fw01qx87nyzt5iex0y	cmn4qpa9m006d87nyj5aeltpq	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:16.076	2026-03-24 15:04:37.17	f	\N
cmn4qq3gs01r087nym0p88cv0	cmn4qpaal006i87nylqcg4bs7	cmn4qq21401n487nyq9w5bv7g	2024-09-01 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:16.109	2026-03-24 15:04:37.196	f	\N
cmn4qq3hk01r287nyczllap35	cmn4qpaax006k87nymzo903ui	cmn4qq21401n487nyq9w5bv7g	2024-07-31 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:16.136	2026-03-24 15:04:37.239	f	\N
cmn4qq3i701r487nyw6gxp78a	cmn4qpab9006m87nyzwyneq2h	cmn4qq21401n487nyq9w5bv7g	2020-05-08 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:16.16	2026-03-24 15:04:37.279	f	\N
cmn4qq3iw01r687nye0mpxkda	cmn4qpabp006o87ny47pr3aw8	cmn4qq21401n487nyq9w5bv7g	2020-05-08 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:16.185	2026-03-24 15:04:37.312	f	\N
cmn4qq3jk01r887nywm1dc4sj	cmn4qpac2006q87nywt094qhj	cmn4qq21401n487nyq9w5bv7g	2024-05-12 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:16.208	2026-03-24 15:04:37.35	f	\N
cmn4qq3kh01ra87nyt1qrlviu	cmn4qpack006s87ny5poa1nl6	cmn4qq21401n487nyq9w5bv7g	2020-05-08 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:16.241	2026-03-24 15:04:37.377	f	\N
cmn4qq3l401rc87ny73f77vuk	cmn4qpacy006u87nymhvaus19	cmn4qq21401n487nyq9w5bv7g	2024-05-19 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:16.264	2026-03-24 15:04:37.401	f	\N
cmn4qq3ls01rf87nywnvnxt79	cmn4qpae9006z87ny8bu2je1t	cmn4qq21401n487nyq9w5bv7g	2021-04-27 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:16.288	2026-03-24 15:04:37.428	f	\N
cmn4qq3mi01rh87nywub6ploj	cmn4qpaem007187ny43c7ae3m	cmn4qq21401n487nyq9w5bv7g	2021-04-27 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:16.314	2026-03-24 15:04:37.461	f	\N
cmn4qq3nc01rk87nycyn5e4i7	cmn4qpagw007987nylruol6ip	cmn4qq21401n487nyq9w5bv7g	2023-05-17 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:16.344	2026-03-24 15:04:37.503	f	\N
cmn4qq3o901rn87ny3htt09jx	cmn4qpait007g87nyi8jp0s3i	cmn4qq21401n487nyq9w5bv7g	2023-09-27 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:16.377	2026-03-24 15:04:37.529	f	\N
cmn4qq3ox01rp87nyiulz802t	cmn4qpaj6007i87nyypsu53d2	cmn4qq21401n487nyq9w5bv7g	2023-09-28 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:16.401	2026-03-24 15:04:37.555	f	\N
cmn4qq3pm01rs87nyj7isq7vn	cmn4qpak6007n87nyvrx7ykjo	cmn4qq21401n487nyq9w5bv7g	2021-12-12 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:16.427	2026-03-24 15:04:37.6	f	\N
cmn4qq3qh01rv87nyfnu8gkvx	cmn4qpalf007s87ny9945upvp	cmn4qq21401n487nyq9w5bv7g	2017-01-09 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:16.457	2026-03-24 15:04:37.634	f	\N
cmn4qq3r701ry87nyu5y835ss	cmn4qpamh007x87ny7kypo29y	cmn4qq21401n487nyq9w5bv7g	2024-03-07 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:16.483	2026-03-24 15:04:37.671	f	\N
cmn4qq3rw01s187ny7e3pawaf	cmn4qpaov008887nyfvycvoic	cmn4qq21401n487nyq9w5bv7g	2024-10-08 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:16.508	2026-03-24 15:04:37.696	f	\N
cmn4qq3sl01s487ny4xomfds3	cmn4qpapr008d87nyi76ijqlr	cmn4qq21401n487nyq9w5bv7g	2024-07-31 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:16.533	2026-03-24 15:04:37.732	f	\N
cmn4qq3t901s687nyix6h48rq	cmn4qpaq0008f87nyd529d9be	cmn4qq21401n487nyq9w5bv7g	2024-08-04 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:16.557	2026-03-24 15:04:37.756	f	\N
cmn4qq3ty01s887nycb5fi6or	cmn4qpaq9008h87nyiu56mt0p	cmn4qq21401n487nyq9w5bv7g	2024-07-21 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:16.582	2026-03-24 15:04:37.782	f	\N
cmn4qq3ut01sa87ny24wuy0zi	cmn4qpaqo008j87nydr9hm0d8	cmn4qq21401n487nyq9w5bv7g	2024-07-21 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:16.614	2026-03-24 15:04:37.807	f	\N
cmn4qq3vj01sc87nyae11vg8d	cmn4qpar3008l87ny0kxl5gzq	cmn4qq21401n487nyq9w5bv7g	2024-07-29 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:16.64	2026-03-24 15:04:37.851	f	\N
cmn4qq3wh01sf87nykyd9h3x5	cmn4qpas1008q87nyttyc2nbn	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:16.674	2026-03-24 15:04:37.891	f	\N
cmn4qq3x701sh87ny0mwrev5k	cmn4qpash008s87nyc35ndnyz	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:16.7	2026-03-24 15:04:37.93	f	\N
cmn4qq3xw01sj87nyernf63fw	cmn4qpass008u87ny5iktsdat	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:16.724	2026-03-24 15:04:37.962	f	\N
cmn4qq3yk01sl87nyhbqwedot	cmn4qpat5008w87nye9xrszoi	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:16.748	2026-03-24 15:04:37.99	f	\N
cmn4qq3z701sn87nybs5vjaay	cmn4qpatj008y87nyr58xhn5z	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:16.772	2026-03-24 15:04:38.013	f	\N
cmn4qq3zw01sq87nyv3exinwa	cmn4qpave009687nybdj4awnu	cmn4qq21401n487nyq9w5bv7g	2024-07-04 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:16.796	2026-03-24 15:04:38.048	f	\N
cmn4qq40s01st87nytprkiyba	cmn4qpax2009b87ny9rrxd1gt	cmn4qq21401n487nyq9w5bv7g	2024-03-18 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:16.829	2026-03-24 15:04:38.084	f	\N
cmn4qq42401sv87nyz3bx569n	cmn4qpaxo009d87ny4pwofxmx	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:16.876	2026-03-24 15:04:38.113	f	\N
cmn4qq42z01sy87nyiudfrvqm	cmn4qpaz2009i87nylmv6c09f	cmn4qq21401n487nyq9w5bv7g	2021-06-30 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:16.907	2026-03-24 15:04:38.144	f	\N
cmn4qq44201t087nylpe8pra2	cmn4qpazk009k87nyk96rwnza	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:16.946	2026-03-24 15:04:38.174	f	\N
cmn4qq45001t387nyb6vaoct8	cmn4qpb2h009v87nyawyfx292	cmn4qq21401n487nyq9w5bv7g	2023-06-27 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:16.98	2026-03-24 15:04:38.197	f	\N
cmn4qq45u01t587nyk6aozt31	cmn4qpb2u009x87ny5ogiyz26	cmn4qq21401n487nyq9w5bv7g	2024-04-29 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:17.011	2026-03-24 15:04:38.224	f	\N
cmn4qq47a01t887nydoekfnyb	cmn4qpb4a00a287nykqf7no01	cmn4qq21401n487nyq9w5bv7g	2023-08-10 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:17.063	2026-03-24 15:04:38.252	f	\N
cmn4qq48l01tb87nyu54i8fy6	cmn4qpb7e00ag87nyxzaxdmle	cmn4qq21401n487nyq9w5bv7g	2022-01-11 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:17.109	2026-03-24 15:04:38.281	f	\N
cmn4qq49u01td87nyjzatggt8	cmn4qpb7x00ai87nyf45wfflc	cmn4qq21401n487nyq9w5bv7g	2022-01-12 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:17.154	2026-03-24 15:04:38.305	f	\N
cmn4qq4ar01tf87nyilkgg2l9	cmn4qpb8c00ak87nyb0h7gqay	cmn4qq21401n487nyq9w5bv7g	2021-12-12 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:17.188	2026-03-24 15:04:38.338	f	\N
cmn4qq4br01th87ny22q2v01h	cmn4qpb8v00am87nyfueno4hi	cmn4qq21401n487nyq9w5bv7g	2024-10-03 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:17.224	2026-03-24 15:04:38.379	f	\N
cmn4qq4cj01tk87nybzq19gp8	cmn4qpbbp00ax87nyb13tti6w	cmn4qq21401n487nyq9w5bv7g	2023-07-25 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:17.251	2026-03-24 15:04:38.41	f	\N
cmn4qq4dc01tm87nyzgeblwh7	cmn4qpbca00az87nyxqsbq84h	cmn4qq21401n487nyq9w5bv7g	2023-06-29 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:17.28	2026-03-24 15:04:38.433	f	\N
cmn4qq4ec01to87nydiqtapy2	cmn4qpbct00b187nyh4lptdow	cmn4qq21401n487nyq9w5bv7g	2023-06-04 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:17.316	2026-03-24 15:04:38.455	f	\N
cmn4qq4f001tr87nykihuege1	cmn4qpbfa00bd87nymtzu13gm	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:17.341	2026-03-24 15:04:38.499	f	\N
cmn4qq4fz01tt87nylzja329x	cmn4qpbfm00bf87nyup15wzta	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:17.376	2026-03-24 15:04:38.538	f	\N
cmn4qq4gt01tw87nywsi68hl6	cmn4qpbh500bl87nyckb6dbfz	cmn4qq21401n487nyq9w5bv7g	2023-09-20 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:17.406	2026-03-24 15:04:38.568	f	\N
cmn4qq4hg01ty87ny6eqejltk	cmn4qpbhj00bn87nyk4dil4gg	cmn4qq21401n487nyq9w5bv7g	2021-07-05 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:17.429	2026-03-24 15:04:38.593	f	\N
cmn4qq4i501u087nynokbrfmo	cmn4qpbhx00bp87nyas2ywvj8	cmn4qq21401n487nyq9w5bv7g	2023-12-04 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:17.453	2026-03-24 15:04:38.616	f	\N
cmn4qq4it01u287ny0fgm0aps	cmn4qpbi900br87nyx4ayfj6u	cmn4qq21401n487nyq9w5bv7g	2023-09-20 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:17.477	2026-03-24 15:04:38.645	f	\N
cmn4qq4k701u587nyah2kh0ns	cmn4qpbin00bt87nycigylsvs	cmn4qq21401n487nyq9w5bv7g	2022-09-05 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:17.528	2026-03-24 15:04:38.67	f	\N
cmn4qq4lg01u787ny5iv86woo	cmn4qpbiz00bv87nyhhtoeqgt	cmn4qq21401n487nyq9w5bv7g	2022-09-27 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:17.572	2026-03-24 15:04:38.695	f	\N
cmn4qq4mw01u987nywzlmz21b	cmn4qpbjd00bx87nygkmkwi5a	cmn4qq21401n487nyq9w5bv7g	2022-09-15 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:17.624	2026-03-24 15:04:38.719	f	\N
cmn4qq4o001uc87nyemwyr315	cmn4qpbk800c087nymnsljwto	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:17.664	2026-03-24 15:04:38.754	f	\N
cmn4qq4ph01uf87ny2zeaypop	cmn4qpbms00c887nygkjyqi71	cmn4qq21401n487nyq9w5bv7g	2023-07-18 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:17.718	2026-03-24 15:04:38.782	f	\N
cmn4qq4qo01uh87ny9vk1nmvs	cmn4qpbn900ca87nygg03i5hb	cmn4qq21401n487nyq9w5bv7g	2023-07-18 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:17.76	2026-03-24 15:04:38.81	f	\N
cmn4qq4rj01uk87nyua2qlo4n	cmn4qpboq00cf87nyxp19mxve	cmn4qq21401n487nyq9w5bv7g	2024-11-06 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:17.791	2026-03-24 15:04:38.848	f	\N
cmn4qq4sf01um87nysjo9ayb3	cmn4qpbpa00ch87nym3tekzyq	cmn4qq21401n487nyq9w5bv7g	2024-11-30 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:17.824	2026-03-24 15:04:38.881	f	\N
cmn4qq4tt01up87ny9soh5ze6	cmn4qpbq700cm87nym5mm911j	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:17.873	2026-03-24 15:04:38.919	f	\N
cmn4qq4un01us87ny1xgr8g5l	cmn4qpbry00cu87ny00kff2dq	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:17.904	2026-03-24 15:04:38.952	f	\N
cmn4qq4vk01uv87nyc8mphz60	cmn4qpbt600cz87ny7au5wain	cmn4qq21401n487nyq9w5bv7g	2018-02-28 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:17.936	2026-03-24 15:04:38.98	f	\N
cmn4qq4wq01uy87nywdbgsnmf	cmn4qpbuk00d487nymow3pr2z	cmn4qq21401n487nyq9w5bv7g	2019-04-16 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:17.978	2026-03-24 15:04:39.005	f	\N
cmn4qq4xr01v087ny8mw8k97b	cmn4qpbuw00d687ny54rvn7bq	cmn4qq21401n487nyq9w5bv7g	2024-03-21 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:18.015	2026-03-24 15:04:39.035	f	\N
cmn4qq4yg01v287nyhodoelw8	cmn4qpbv800d887nyicc7e16a	cmn4qq21401n487nyq9w5bv7g	2024-03-21 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:18.04	2026-03-24 15:04:39.059	f	\N
cmn4qq4z601v487nyovy2ez1t	cmn4qpbvm00da87ny239lsa52	cmn4qq21401n487nyq9w5bv7g	2024-03-21 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:18.066	2026-03-24 15:04:39.088	f	\N
cmn4qq4zu01v687nyjqq6j6pz	cmn4qpbvx00dc87nykq4gzq0s	cmn4qq21401n487nyq9w5bv7g	2024-03-21 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:18.091	2026-03-24 15:04:39.114	f	\N
cmn4qq50k01v887nymib61b08	cmn4qpbw900de87nyz109l1l8	cmn4qq21401n487nyq9w5bv7g	2024-03-19 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:18.116	2026-03-24 15:04:39.139	f	\N
cmn4qq51f01va87ny01tk8dtd	cmn4qpbwm00dg87ny2wcluw3m	cmn4qq21401n487nyq9w5bv7g	2024-03-21 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:18.148	2026-03-24 15:04:39.163	f	\N
cmn4qq52401vc87nydgd31ug9	cmn4qpbwx00di87nywvgmhjkw	cmn4qq21401n487nyq9w5bv7g	2024-03-18 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:18.172	2026-03-24 15:04:39.2	f	\N
cmn4qq53001ve87nyurc3b798	cmn4qpbxa00dk87nyj56mfqkl	cmn4qq21401n487nyq9w5bv7g	2024-04-22 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:18.204	2026-03-24 15:04:39.236	f	\N
cmn4qq54501vh87nywjn3ys7o	cmn4qpbym00dr87nyf4r0gaqj	cmn4qq21401n487nyq9w5bv7g	2017-05-11 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:18.246	2026-03-24 15:04:39.264	f	\N
cmn4qq55901vj87nyut3ahfbe	cmn4qpbyy00dt87nyz65g48oa	cmn4qq21401n487nyq9w5bv7g	2017-05-12 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:18.285	2026-03-24 15:04:39.292	f	\N
cmn4qq56501vl87ny212wizld	cmn4qpbzb00dv87nyzyhrw61g	cmn4qq21401n487nyq9w5bv7g	2024-04-15 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:18.317	2026-03-24 15:04:39.323	f	\N
cmn4qq56s01vn87ny1ygndk47	cmn4qpbzn00dx87nyzcq0o6go	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:18.34	2026-03-24 15:04:39.348	f	\N
cmn4qq57h01vq87nyguz1m6ad	cmn4qpc1500e287ny68ge8fb7	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:18.365	2026-03-24 15:04:49.172	f	\N
cmn4qq58a01vt87nypmoklpbv	cmn4qpc2d00e587nyohjzmkic	cmn4qq21401n487nyq9w5bv7g	2024-07-04 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:18.395	2026-03-24 15:04:39.395	f	\N
cmn4qq59h01vv87ny86s2vd1l	cmn4qpc2x00e787ny72bvh60m	cmn4qq21401n487nyq9w5bv7g	2024-07-04 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:18.438	2026-03-24 15:04:39.421	f	\N
cmn4qq5ai01vy87nyrd6q3hj4	cmn4qpc4d00ec87ny94tughqd	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:18.474	2026-03-24 15:04:39.448	f	\N
cmn4qq5bd01w087nye2dmldes	cmn4qpc4s00ee87ny06h5jzu9	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:18.505	2026-03-24 15:04:39.479	f	\N
cmn4qq5dd01w387nycstvc3io	cmn4qpc6f00ej87nyngmbi2ym	cmn4qq21401n487nyq9w5bv7g	2023-03-20 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:18.578	2026-03-24 15:04:39.511	f	\N
cmn4qq5e901w587nycnf6mnt9	cmn4qpc6w00el87nyjno92sb5	cmn4qq21401n487nyq9w5bv7g	2023-06-12 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:18.609	2026-03-24 15:04:39.537	f	\N
cmn4qq5f201w887ny558vxx9z	cmn4qpc8700eq87ny97e130ex	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:18.639	2026-03-24 15:04:39.567	f	\N
cmn4qq5g801wa87nysxl18che	cmn4qpc8i00es87ny2mkig1b3	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:18.681	2026-03-24 15:04:39.601	f	\N
cmn4qq5hj01wd87nyd4qmkub8	cmn4qpc9u00ex87nyn4157kgy	cmn4qq21401n487nyq9w5bv7g	2024-09-08 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:18.728	2026-03-24 15:04:39.624	f	\N
cmn4qq5is01wf87nyqb4avxmq	cmn4qpca700ez87nyouhkg223	cmn4qq21401n487nyq9w5bv7g	2024-05-16 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:18.773	2026-03-24 15:04:39.663	f	\N
cmn4qq5jm01wi87nykrmrs840	cmn4qpcb800f487nygnbla74w	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:18.803	2026-03-24 15:04:39.697	f	\N
cmn4qq5kc01wl87nyobs18nf8	cmn4qpcbu00f787nyj83lsm4i	cmn4qq21401n487nyq9w5bv7g	2021-05-25 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:18.828	2026-03-24 15:04:39.724	f	\N
cmn4qq5l601wn87nyure8opdg	cmn4qpcc600f987nykzqc6g80	cmn4qq21401n487nyq9w5bv7g	2021-06-30 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:18.859	2026-03-24 15:04:39.774	f	\N
cmn4qq5m701wq87ny71arvgyl	cmn4qpce000fh87ny0memgeng	cmn4qq21401n487nyq9w5bv7g	2022-09-21 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:18.895	2026-03-24 15:04:39.819	f	\N
cmn4qq5ne01ws87nyvru5ikia	cmn4qpced00fj87nyml9adkio	cmn4qq21401n487nyq9w5bv7g	2022-09-18 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:18.938	2026-03-24 15:04:39.849	f	\N
cmn4qq5of01wu87nyhwqd8vhm	cmn4qpcey00fl87nyjgm71l22	cmn4qq21401n487nyq9w5bv7g	2023-06-08 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:18.976	2026-03-24 15:04:39.879	f	\N
cmn4qq5pf01wx87ny0g2k1e8i	cmn4qpcg800fs87nyvf6nvwxu	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:19.011	2026-03-24 15:04:39.906	f	\N
cmn4qq5q701wz87ny1y9t0lwx	cmn4qpcgt00fu87nyqve4pwql	cmn4qq21401n487nyq9w5bv7g	2021-01-24 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:19.039	2026-03-24 15:04:39.939	f	\N
cmn4qq5ra01x187nykkikd8hp	cmn4qpchd00fw87nyrwekjbwd	cmn4qq21401n487nyq9w5bv7g	2021-12-11 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:19.079	2026-03-24 15:04:39.978	f	\N
cmn4qq5s901x487ny3uy75br4	cmn4qpcim00g187ny51px34bj	cmn4qq21401n487nyq9w5bv7g	2021-08-10 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:19.113	2026-03-24 15:04:40.015	f	\N
cmn4qq5t001x787ny37so01zt	cmn4qpcjj00g687ny66otbsad	cmn4qq21401n487nyq9w5bv7g	2021-12-12 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:19.141	2026-03-24 15:04:40.05	f	\N
cmn4qq5tq01xa87nyyi894gef	cmn4qpcmf00gh87nym35v3rjq	cmn4qq21401n487nyq9w5bv7g	2023-04-02 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:19.166	2026-03-24 15:04:40.091	f	\N
cmn4qq5uz01xc87ny1ibqlocm	cmn4qpcmp00gj87ny0lpplg5d	cmn4qq21401n487nyq9w5bv7g	2023-03-28 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:19.211	2026-03-24 15:04:40.118	f	\N
cmn4qq5wi01xf87nyg5th43et	cmn4qpcnp00go87ny4xp224gt	cmn4qq21401n487nyq9w5bv7g	2021-03-08 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:19.266	2026-03-24 15:04:40.16	f	\N
cmn4qq5xc01xi87ny16r7jfoa	cmn4qpcp700gv87ny42pu0and	cmn4qq21401n487nyq9w5bv7g	2022-02-02 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:19.296	2026-03-24 15:04:40.196	f	\N
cmn4qq5y001xk87ny2iba0g58	cmn4qpcpj00gx87nyqdjcn77o	cmn4qq21401n487nyq9w5bv7g	2024-08-04 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:19.32	2026-03-24 15:04:40.225	f	\N
cmn4qq5ys01xm87nye8ydzgz4	cmn4qpcpz00gz87ny98glz6lb	cmn4qq21401n487nyq9w5bv7g	2024-08-04 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:19.348	2026-03-24 15:04:40.262	f	\N
cmn4qq5zm01xp87nyoo15b4vo	cmn4qpcst00h987nypz669eoj	cmn4qq21401n487nyq9w5bv7g	2024-12-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:19.379	2026-03-24 15:04:40.289	f	\N
cmn4qq60j01xr87nywcm89tjj	cmn4qpcta00hb87nyi0q15gqn	cmn4qq21401n487nyq9w5bv7g	2024-12-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:19.411	2026-03-24 15:04:40.315	f	\N
cmn4qq61q01xt87ny849eo1dg	cmn4qpcts00hd87nyv2z6pgqz	cmn4qq21401n487nyq9w5bv7g	2024-04-09 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:19.454	2026-03-24 15:04:40.342	f	\N
cmn4qq62z01xv87nylllrz5uv	cmn4qpcuc00hf87nyob4tdgog	cmn4qq21401n487nyq9w5bv7g	2024-03-24 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:19.5	2026-03-24 15:04:40.368	f	\N
cmn4qq64301xy87nyunh2m1b4	cmn4qpcvc00hk87ny8gbdnsrp	cmn4qq21401n487nyq9w5bv7g	2020-09-24 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:19.539	2026-03-24 15:04:40.404	f	\N
cmn4qq64s01y087nygy9witpw	cmn4qpcvp00hm87ny5xsovzzd	cmn4qq21401n487nyq9w5bv7g	2023-06-11 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:19.565	2026-03-24 15:04:40.438	f	\N
cmn4qq65r01y287nyknk8wc1h	cmn4qpcw300ho87ny6i0irx0x	cmn4qq21401n487nyq9w5bv7g	2022-11-20 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:19.599	2026-03-24 15:04:40.462	f	\N
cmn4qq66m01y587nyv3pufh5u	cmn4qpcx300ht87nyzbp6b5m2	cmn4qq21401n487nyq9w5bv7g	2024-08-25 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:19.631	2026-03-24 15:04:40.486	f	\N
cmn4qq67i01y787nyp6qboq6p	cmn4qpcxf00hv87ny3tb9xt30	cmn4qq21401n487nyq9w5bv7g	2024-08-25 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:19.662	2026-03-24 15:04:40.509	f	\N
cmn4qq68b01y987nyxktvf1my	cmn4qpcxq00hx87nyykb3v0pk	cmn4qq21401n487nyq9w5bv7g	2024-08-25 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:19.692	2026-03-24 15:04:40.553	f	\N
cmn4qq69401yb87nydec86m0a	cmn4qpcy500hz87ny77l0atfe	cmn4qq21401n487nyq9w5bv7g	2021-01-24 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:19.72	2026-03-24 15:04:40.586	f	\N
cmn4qq69u01yd87nyld494tba	cmn4qpcyp00i187ny0zeekbzg	cmn4qq21401n487nyq9w5bv7g	2021-09-29 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:19.747	2026-03-24 15:04:40.611	f	\N
cmn4qq6aj01yf87nyzbwct5hz	cmn4qpcz800i387nyk966vqyh	cmn4qq21401n487nyq9w5bv7g	2024-08-25 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:19.772	2026-03-24 15:04:40.635	f	\N
cmn4qq6b801yi87nyyum9lx8t	cmn4qpd1800ib87ny46jiejzt	cmn4qq21401n487nyq9w5bv7g	2023-09-17 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:19.796	2026-03-24 15:04:40.663	f	\N
cmn4qq6c001yl87nycamtx4fa	cmn4qpd2a00ig87nylfecbcgq	cmn4qq21401n487nyq9w5bv7g	2023-12-04 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:19.824	2026-03-24 15:04:40.702	f	\N
cmn4qq6cp01yo87nymgvk8jcl	cmn4qpd5300ir87nym15x07lu	cmn4qq21401n487nyq9w5bv7g	2021-02-16 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:19.849	2026-03-24 15:04:40.738	f	\N
cmn4qq6do01yr87nyaz6lx665	cmn4qpd6100iw87nyd7h836e8	cmn4qq21401n487nyq9w5bv7g	2018-07-15 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:19.884	2026-03-24 15:04:40.77	f	\N
cmn4qq6ee01yt87ny8l03wpsh	cmn4qpd6d00iy87ny20ap4h4s	cmn4qq21401n487nyq9w5bv7g	2018-07-17 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:19.911	2026-03-24 15:04:40.795	f	\N
cmn4qq6fa01yv87ny72yfz2wp	cmn4qpd6t00j087nyluqi1npi	cmn4qq21401n487nyq9w5bv7g	2023-07-18 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:19.942	2026-03-24 15:04:40.819	f	\N
cmn4qq6g401yy87nyal0kib5s	cmn4qpd8s00j787nyqv6huyfe	cmn4qq21401n487nyq9w5bv7g	2018-10-01 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:19.973	2026-03-24 15:04:40.843	f	\N
cmn4qq6gu01z187nyi2cil9g9	cmn4qpd9l00ja87nyfx7yj79v	cmn4qq21401n487nyq9w5bv7g	2024-05-20 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:19.998	2026-03-24 15:04:40.873	f	\N
cmn4qq6hk01z487nyvqixfpwk	cmn4qpdal00jf87nylqh54eda	cmn4qq21401n487nyq9w5bv7g	2024-05-16 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:20.024	2026-03-24 15:04:40.9	f	\N
cmn4qq6il01z787ny8ua0xviq	cmn4qpdbn00jk87nyg39ezu87	cmn4qq21401n487nyq9w5bv7g	2022-03-15 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:20.062	2026-03-24 15:04:40.925	f	\N
cmn4qq6ji01z987nyw1ps2r0f	cmn4qpdc200jm87ny60cq4eus	cmn4qq21401n487nyq9w5bv7g	2019-05-17 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:20.095	2026-03-24 15:04:40.968	f	\N
cmn4qq6k801zb87ny7yeswi8l	cmn4qpdcj00jo87nyhnobjxdt	cmn4qq21401n487nyq9w5bv7g	2024-03-24 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:20.12	2026-03-24 15:04:41.005	f	\N
cmn4qq6l601ze87nyh9z5niiv	cmn4qpddl00jr87nyffarh4ff	cmn4qq21401n487nyq9w5bv7g	2019-09-10 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:20.154	2026-03-24 15:04:41.037	f	\N
cmn4qq6lw01zg87ny8s7y5koc	cmn4qpde400jt87ny1b73etps	cmn4qq21401n487nyq9w5bv7g	2019-09-10 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:20.18	2026-03-24 15:04:41.074	f	\N
cmn4qq6ms01zi87nyquqjofqh	cmn4qpdem00jv87nym5op8aeg	cmn4qq21401n487nyq9w5bv7g	2019-09-10 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:20.212	2026-03-24 15:04:41.113	f	\N
cmn4qq6no01zk87ny8g9l0hi9	cmn4qpdf000jx87ny1lnwzinb	cmn4qq21401n487nyq9w5bv7g	2023-12-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:20.245	2026-03-24 15:04:41.142	f	\N
cmn4qq6om01zn87nyq9e1ya56	cmn4qpdgj00k287nyqe191f7t	cmn4qq21401n487nyq9w5bv7g	2019-04-18 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:20.278	2026-03-24 15:04:41.169	f	\N
cmn4qq6pi01zq87nyt7zooly6	cmn4qpdip00k987nya0djhuq2	cmn4qq21401n487nyq9w5bv7g	2023-07-31 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:20.311	2026-03-24 15:04:41.197	f	\N
cmn4qq6qa01zs87nyh1907bty	cmn4qpdj200kb87nyvvgqisxo	cmn4qq21401n487nyq9w5bv7g	2023-07-31 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:20.339	2026-03-24 15:04:41.22	f	\N
cmn4qq6r201zu87ny9lurk9ez	cmn4qpdjl00kd87ny5ajqfynj	cmn4qq21401n487nyq9w5bv7g	2023-07-18 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:20.366	2026-03-24 15:04:41.237	f	\N
cmn4qq6ry01zw87nyqx91c3k7	cmn4qpdk000kf87ny289yyk1k	cmn4qq21401n487nyq9w5bv7g	2023-06-14 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:20.398	2026-03-24 15:04:41.264	f	\N
cmn4qq6sw01zy87nyry6ndsup	cmn4qpdkj00kh87nyyq0g6ea6	cmn4qq21401n487nyq9w5bv7g	2023-07-26 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:20.432	2026-03-24 15:04:41.287	f	\N
cmn4qq6u6020087nyeb7diivx	cmn4qpdl000kj87ny19cjx3oj	cmn4qq21401n487nyq9w5bv7g	2023-07-17 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:20.478	2026-03-24 15:04:41.312	f	\N
cmn4qq6v1020387nyhbwf9ti5	cmn4qpdpy00l387ny74bgk6dd	cmn4qq21401n487nyq9w5bv7g	2024-04-10 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:20.509	2026-03-24 15:04:41.34	f	\N
cmn4qq6vv020587nyg7586nkf	cmn4qpdqe00l587nyc0wbqsqb	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:20.54	2026-03-24 15:04:41.37	f	\N
cmn4qq6wu020887nylyb4grhx	cmn4qpdsx00ld87ny3nh22t7t	cmn4qq21401n487nyq9w5bv7g	2021-07-18 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:20.574	2026-03-24 15:04:41.394	f	\N
cmn4qq6xm020b87nym95x49j2	cmn4qpdu300li87ny7fcpmb3b	cmn4qq21401n487nyq9w5bv7g	2023-07-18 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:20.602	2026-03-24 15:04:41.427	f	\N
cmn4qq6ye020e87nyggu07nc0	cmn4qpdva00ln87nyww5tnucz	cmn4qq21401n487nyq9w5bv7g	2022-01-23 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:20.63	2026-03-24 15:04:41.452	f	\N
cmn4qq6z3020h87ny3rbpajxd	cmn4qpdwf00ls87nyqjovoiho	cmn4qq21401n487nyq9w5bv7g	2024-05-16 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:20.656	2026-03-24 15:04:41.478	f	\N
cmn4qq6zt020k87nyqrdjm0k2	cmn4qpdxm00lx87nyb7h84010	cmn4qq21401n487nyq9w5bv7g	2021-07-18 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:20.682	2026-03-24 15:04:41.51	f	\N
cmn4qq70i020m87ny9sh66m7h	cmn4qpdy600lz87ny0153jeqt	cmn4qq21401n487nyq9w5bv7g	2021-07-27 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:20.706	2026-03-24 15:04:41.541	f	\N
cmn4qq717020o87nycrosqrbl	cmn4qpdyh00m187ny40yukrpw	cmn4qq21401n487nyq9w5bv7g	2021-08-08 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:20.731	2026-03-24 15:04:41.582	f	\N
cmn4qq72h020r87ny6at26nvx	cmn4qpdzu00m687nyuaucspw8	cmn4qq21401n487nyq9w5bv7g	2024-09-23 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:20.777	2026-03-24 15:04:41.606	f	\N
cmn4qq736020u87nyqwlv6cy7	cmn4qpe1j00me87nymg4nqtpv	cmn4qq21401n487nyq9w5bv7g	2023-04-19 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:20.803	2026-03-24 15:04:41.63	f	\N
cmn4qq744020w87ny32d2y91j	cmn4qpe1v00mg87nymd9sbe5f	cmn4qq21401n487nyq9w5bv7g	2023-04-27 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:20.836	2026-03-24 15:04:41.654	f	\N
cmn4qq74t020y87ny9hc8bx1p	cmn4qpe2n00mi87nyxq8geysb	cmn4qq21401n487nyq9w5bv7g	2023-12-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:20.861	2026-03-24 15:04:41.677	f	\N
cmn4qq75x021187nyv31j49ie	cmn4qpe3q00mn87nyx3b40kle	cmn4qq21401n487nyq9w5bv7g	2023-02-28 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:20.901	2026-03-24 15:04:41.703	f	\N
cmn4qq76r021487nyahe9fedf	cmn4qpe5200ms87ny7lpm9gt8	cmn4qq21401n487nyq9w5bv7g	2024-08-04 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:20.932	2026-03-24 15:04:41.727	f	\N
cmn4qq77p021787nyfuw8ejx6	cmn4qpe6e00mx87nyzn45kege	cmn4qq21401n487nyq9w5bv7g	2023-05-11 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:20.965	2026-03-24 15:04:41.752	f	\N
cmn4qq78h021987nyrftmoli0	cmn4qpe7200mz87nyq32yglsd	cmn4qq21401n487nyq9w5bv7g	2023-09-14 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:20.994	2026-03-24 15:04:41.776	f	\N
cmn4qq79m021c87ny36zn7n1l	cmn4qpe8500n487nygcbcp2np	cmn4qq21401n487nyq9w5bv7g	2022-01-23 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:21.035	2026-03-24 15:04:41.805	f	\N
cmn4qq7ax021f87ny5iexryuv	cmn4qpe9e00n987nykkq1f6cq	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:21.081	2026-03-24 15:04:41.829	f	\N
cmn4qq7by021i87ny42fr0mum	cmn4qpeav00ne87ny09kl72r9	cmn4qq21401n487nyq9w5bv7g	2021-06-06 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:21.118	2026-03-24 15:04:41.856	f	\N
cmn4qq7cu021k87nyia0bawdf	cmn4qpeb700ng87ny7gnc3sxc	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:21.151	2026-03-24 15:04:41.881	f	\N
cmn4qq7e2021n87nykwhc3exd	cmn4qpecd00nl87nyvfcrnn9d	cmn4qq21401n487nyq9w5bv7g	2024-02-27 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:21.195	2026-03-24 15:04:41.905	f	\N
cmn4qq7f6021q87ny5c4adoqw	cmn4qpedh00nq87nyovh99wys	cmn4qq21401n487nyq9w5bv7g	2024-12-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:21.234	2026-03-24 15:04:41.93	f	\N
cmn4qq7fv021s87ny05jgmm2m	cmn4qpedt00ns87ny8ozrjcwi	cmn4qq21401n487nyq9w5bv7g	2024-02-15 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:21.259	2026-03-24 15:04:41.961	f	\N
cmn4qq7h0021v87nyofm35dcu	cmn4qpef700ny87nyunrl6drj	cmn4qq21401n487nyq9w5bv7g	2024-08-04 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:21.3	2026-03-24 15:04:41.989	f	\N
cmn4qq7hr021y87nywhua5z7j	cmn4qpefp00o087ny6sgi5x0w	cmn4qq21401n487nyq9w5bv7g	2024-08-04 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:21.327	2026-03-24 15:04:42.025	f	\N
cmn4qq7ik022187nyka1e879l	cmn4qpegz00o787nym3b0gp60	cmn4qq21401n487nyq9w5bv7g	2023-05-21 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:21.356	2026-03-24 15:04:42.065	f	\N
cmn4qq7jj022387nylcsjsgfc	cmn4qpehg00o987nyrdks3ztu	cmn4qq21401n487nyq9w5bv7g	2024-04-18 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:21.392	2026-03-24 15:04:42.103	f	\N
cmn4qq7kb022587nyrzj2v68i	cmn4qpehu00ob87nyvymqs5x2	cmn4qq21401n487nyq9w5bv7g	2024-04-29 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:21.42	2026-03-24 15:04:42.135	f	\N
cmn4qq7lb022887nywndr606h	cmn4qpeih00oe87nybel8mrwe	cmn4qq21401n487nyq9w5bv7g	2023-02-05 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:21.455	2026-03-24 15:04:42.187	f	\N
cmn4qq7m1022b87nymn7wb54b	cmn4qpeks00oo87nyd61np16d	cmn4qq21401n487nyq9w5bv7g	2022-06-08 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:21.481	2026-03-24 15:04:42.21	f	\N
cmn4qq7mu022d87ny3urx8iul	cmn4qpel400oq87nya28enn7o	cmn4qq21401n487nyq9w5bv7g	2022-06-08 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:21.511	2026-03-24 15:04:42.235	f	\N
cmn4qq7nl022f87ny4zj8w8lp	cmn4qpelg00os87nyve86g94w	cmn4qq21401n487nyq9w5bv7g	2022-09-14 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:21.538	2026-03-24 15:04:42.261	f	\N
cmn4qq7ol022h87nykuqfnqrp	cmn4qpelt00ou87nys2ksx2s7	cmn4qq21401n487nyq9w5bv7g	2024-07-29 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:21.573	2026-03-24 15:04:42.294	f	\N
cmn4qq7pt022j87nyes2yc708	cmn4qpem400ow87ny7fwynf0c	cmn4qq21401n487nyq9w5bv7g	2024-07-21 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:21.617	2026-03-24 15:04:42.485	f	\N
cmn4qq7qr022l87nys90au8l0	cmn4qpemh00oy87nyleuozoet	cmn4qq21401n487nyq9w5bv7g	2024-07-29 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:21.651	2026-03-24 15:04:42.539	f	\N
cmn4qq7sa022o87nyjfa7hjp1	cmn4qpepn00pa87ny66xboofc	cmn4qq21401n487nyq9w5bv7g	2022-03-29 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:21.706	2026-03-24 15:04:42.577	f	\N
cmn4qq7tf022r87ny1d3rgepc	cmn4qpeso00pk87nykztc06jm	cmn4qq21401n487nyq9w5bv7g	2023-05-29 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:21.748	2026-03-24 15:04:42.632	f	\N
cmn4qq7ub022t87nyxr0qqntn	cmn4qpet400pm87nyetzhoj16	cmn4qq21401n487nyq9w5bv7g	2023-05-29 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:21.78	2026-03-24 15:04:42.677	f	\N
cmn4qq7vf022w87nyvemh7wcg	cmn4qpevc00pv87ny9lxxqpq8	cmn4qq21401n487nyq9w5bv7g	2023-06-14 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:21.82	2026-03-24 15:04:42.702	f	\N
cmn4qq7wf022y87ny014gzfij	cmn4qpevm00px87nyzonwycoo	cmn4qq21401n487nyq9w5bv7g	2023-08-08 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:21.855	2026-03-24 15:04:42.747	f	\N
cmn4qq7xf023087nyo7uputpi	cmn4qpevy00pz87nynutssc3k	cmn4qq21401n487nyq9w5bv7g	2023-08-08 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:21.892	2026-03-24 15:04:42.786	f	\N
cmn4qq7yi023387ny3ojb28ib	cmn4qpexk00q487ny8hwf95r5	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:21.931	2026-03-24 15:04:42.816	f	\N
cmn4qq7z8023687nyrtv3nuiu	cmn4qpeyh00q787ny9e7ej35y	cmn4qq21401n487nyq9w5bv7g	2022-09-07 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:21.957	2026-03-24 15:04:42.861	f	\N
cmn4qq80h023887nyn68r5y1q	cmn4qpeyt00q987nyldarw0o8	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:22.002	2026-03-24 15:04:42.891	f	\N
cmn4qq81g023b87nyvjqbxerc	cmn4qpf0400qe87nyb6h8mc2m	cmn4qq21401n487nyq9w5bv7g	2022-01-17 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:22.037	2026-03-24 15:04:42.93	f	\N
cmn4qq827023d87ny31fs8m6d	cmn4qpf0g00qg87ny09d2yru4	cmn4qq21401n487nyq9w5bv7g	2022-01-17 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:22.064	2026-03-24 15:04:42.967	f	\N
cmn4qq82z023g87ny4r65xsqj	cmn4qpf1k00ql87nyvmsllipe	cmn4qq21401n487nyq9w5bv7g	2024-11-26 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:22.091	2026-03-24 15:04:43.007	f	\N
cmn4qq83p023i87nys18rbzm1	cmn4qpf1y00qn87nyqr1q0lpo	cmn4qq21401n487nyq9w5bv7g	2023-01-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:22.118	2026-03-24 15:04:43.042	f	\N
cmn4qq84f023l87ny9k4mamp4	cmn4qpf5p00r287ny2jltp3zr	cmn4qq21401n487nyq9w5bv7g	2023-12-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:22.143	2026-03-24 15:04:43.075	f	\N
cmn4qq85d023n87nyhagw683p	cmn4qpf6000r487ny72jad2rr	cmn4qq21401n487nyq9w5bv7g	2023-12-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:22.178	2026-03-24 15:04:43.113	f	\N
cmn4qq86v023q87nysz62yk80	cmn4qpf7l00r987ny2e5kncwx	cmn4qq21401n487nyq9w5bv7g	2024-02-22 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:22.232	2026-03-24 15:04:43.156	f	\N
cmn4qq87v023t87nylhk6rj5z	cmn4qpf8o00re87nyjwob3fbl	cmn4qq21401n487nyq9w5bv7g	2023-06-14 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:22.268	2026-03-24 15:04:43.195	f	\N
cmn4qq88j023v87nyyoco7fkt	cmn4qpf8z00rg87nyastsd922	cmn4qq21401n487nyq9w5bv7g	2023-07-10 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:22.291	2026-03-24 15:04:43.225	f	\N
cmn4qq89h023y87nyhr8ijl0w	cmn4qpfce00rt87nyahun5zrx	cmn4qq21401n487nyq9w5bv7g	2024-04-23 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:22.325	2026-03-24 15:04:43.25	f	\N
cmn4qq8ak024087ny9pfnrzv9	cmn4qpfcq00rv87nydg8annsn	cmn4qq21401n487nyq9w5bv7g	2023-11-21 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:22.365	2026-03-24 15:04:43.296	f	\N
cmn4qq8bm024387nyodgixu91	cmn4qpfdo00s087nyy4qx5ke2	cmn4qq21401n487nyq9w5bv7g	2022-03-31 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:22.403	2026-03-24 15:04:43.324	f	\N
cmn4qq8cd024687nycx3e6q9k	cmn4qpfeq00s587ny2som67vu	cmn4qq21401n487nyq9w5bv7g	2024-05-29 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:22.429	2026-03-24 15:04:43.364	f	\N
cmn4qq8d1024987ny8ana1kxo	cmn4qpffp00sa87nyvbwfslju	cmn4qq21401n487nyq9w5bv7g	2024-05-14 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:22.454	2026-03-24 15:04:43.392	f	\N
cmn4qq8do024b87nyadwerym2	cmn4qpfg200sc87nyv4y4risy	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:22.476	2026-03-24 15:04:43.418	f	\N
cmn4qq8ed024e87ny7yscl0sy	cmn4qpfhq00sj87nydsi90qnu	cmn4qq21401n487nyq9w5bv7g	2022-06-23 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:22.502	2026-03-24 15:04:43.451	f	\N
cmn4qq8f5024h87nyeikjhlh5	cmn4qpfiz00sm87ny1zdmolu8	cmn4qq21401n487nyq9w5bv7g	2023-11-30 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:22.53	2026-03-24 15:04:43.476	f	\N
cmn4qq8fv024j87nyetnh0x9k	cmn4qpfje00so87nyyknh12s9	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:22.555	2026-03-24 15:04:43.511	f	\N
cmn4qq8gv024l87nyr5d7mk0s	cmn4qpfjs00sq87nykv8be4pf	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:22.591	2026-03-24 15:04:43.546	f	\N
cmn4qq8hr024o87ny7xptvgoc	cmn4qpfl200sv87ny12hq98p1	cmn4qq21401n487nyq9w5bv7g	2022-03-31 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:22.623	2026-03-24 15:04:43.581	f	\N
cmn4qq8ih024q87nygpgclzpx	cmn4qpfle00sx87nysu305ftd	cmn4qq21401n487nyq9w5bv7g	2022-03-31 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:22.65	2026-03-24 15:04:43.618	f	\N
cmn4qq8j5024s87ny627z04w3	cmn4qpfls00sz87nyg95r74id	cmn4qq21401n487nyq9w5bv7g	2022-03-31 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:22.673	2026-03-24 15:04:43.654	f	\N
cmn4qq8jv024u87ny3ziw5p62	cmn4qpfm800t187ny3l5hxo3k	cmn4qq21401n487nyq9w5bv7g	2022-03-08 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:22.7	2026-03-24 15:04:43.688	f	\N
cmn4qq8km024x87nyb8wlwz84	cmn4qpfo300t687ny614ihhvs	cmn4qq21401n487nyq9w5bv7g	2024-08-04 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:22.726	2026-03-24 15:04:43.727	f	\N
cmn4qq8lc025087ny1yveu4zi	cmn4qpfpp00tb87nywp51fk5i	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:22.753	2026-03-24 15:04:43.755	f	\N
cmn4qq8m1025287nynf5usgbt	cmn4qpfqb00td87nyh61a0n9h	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:22.777	2026-03-24 15:04:43.793	f	\N
cmn4qq8mx025587nyqf0xdzzy	cmn4qpfrf00ti87ny9z0zz5pu	cmn4qq21401n487nyq9w5bv7g	2022-04-17 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:22.809	2026-03-24 15:04:43.837	f	\N
cmn4qq8nl025887nybrr6i213	cmn4qpfsh00tn87nyifoslt5i	cmn4qq21401n487nyq9w5bv7g	2019-11-10 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:22.833	2026-03-24 15:04:43.873	f	\N
cmn4qq8ok025a87nyn4y020ba	cmn4qpfst00tp87nyl758591z	cmn4qq21401n487nyq9w5bv7g	2019-11-10 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:22.869	2026-03-24 15:04:43.9	f	\N
cmn4qq8pc025c87nyjozy15tu	cmn4qpft500tr87ny7wqestf0	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:22.896	2026-03-24 15:04:43.933	f	\N
cmn4qq8q5025f87nyroucxkjt	cmn4qpfur00tw87nybu5tx1nb	cmn4qq21401n487nyq9w5bv7g	2023-06-14 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:22.925	2026-03-24 15:04:43.964	f	\N
cmn4qq8qv025h87nypd9a0vyt	cmn4qpfv200ty87nygwyi9g07	cmn4qq21401n487nyq9w5bv7g	2023-06-25 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:22.952	2026-03-24 15:04:44.005	f	\N
cmn4qq8se025k87nyo3xeisi2	cmn4qpfvo00u187nyur4665tp	cmn4qq21401n487nyq9w5bv7g	2020-11-01 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:23.007	2026-03-24 15:04:44.044	f	\N
cmn4qq8t6025m87nyqjo2nsj3	cmn4qpfvz00u387nycgm83dbp	cmn4qq21401n487nyq9w5bv7g	2021-07-06 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:23.034	2026-03-24 15:04:44.075	f	\N
cmn4qq8u6025o87nyv8fu8uhp	cmn4qpfwc00u587nyb9ghglgm	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:23.07	2026-03-24 15:04:44.108	f	\N
cmn4qq8vb025r87nyfackyn1m	cmn4qpfxa00ua87ny737vgxoi	cmn4qq21401n487nyq9w5bv7g	2020-09-07 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:23.111	2026-03-24 15:04:44.139	f	\N
cmn4qq8we025u87nygm7fd564	cmn4qpfyd00uf87nydnv55fwl	cmn4qq21401n487nyq9w5bv7g	2024-07-04 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:23.151	2026-03-24 15:04:44.177	f	\N
cmn4qq8x7025x87nyd43k6w3f	cmn4qpfzl00uk87nyawvja1oi	cmn4qq21401n487nyq9w5bv7g	2024-09-09 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:23.18	2026-03-24 15:04:44.207	f	\N
cmn4qq8xz026087nyanv0h303	cmn4qpg0k00up87nymov9egbc	cmn4qq21401n487nyq9w5bv7g	2024-01-11 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:23.207	2026-03-24 15:04:44.233	f	\N
cmn4qq8yx026387nyu2dqgczb	cmn4qpg5100v687nyf6v1q0do	cmn4qq21401n487nyq9w5bv7g	2024-03-27 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:23.241	2026-03-24 15:04:44.267	f	\N
cmn4qq8zx026687nys33yl6i3	cmn4qpg5y00vb87nyewf5rkpl	cmn4qq21401n487nyq9w5bv7g	2023-03-08 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:23.278	2026-03-24 15:04:44.303	f	\N
cmn4qq90x026987nyf0kgvldg	cmn4qpg7b00vh87nyly8ghug9	cmn4qq21401n487nyq9w5bv7g	2022-07-27 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:23.314	2026-03-24 15:04:44.347	f	\N
cmn4qq91x026c87nycououxz7	cmn4qpg8j00vm87nyadt9mc92	cmn4qq21401n487nyq9w5bv7g	2022-12-06 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:23.35	2026-03-24 15:04:44.381	f	\N
cmn4qq935026f87nyfjua8wct	cmn4qpgav00vu87nyco2vi1wz	cmn4qq21401n487nyq9w5bv7g	2023-07-18 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:23.393	2026-03-24 15:04:44.419	f	\N
cmn4qq93w026i87ny7uw9tgxs	cmn4qpgen00wb87nylkbce8rh	cmn4qq21401n487nyq9w5bv7g	2021-02-03 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:23.42	2026-03-24 15:04:44.452	f	\N
cmn4qq94k026k87nyvu0u3cbo	cmn4qpgf600wd87nyxq3w3noz	cmn4qq21401n487nyq9w5bv7g	2021-02-03 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:23.444	2026-03-24 15:04:44.491	f	\N
cmn4qq95f026m87ny5pmlbr64	cmn4qpgfi00wf87ny4vn87f60	cmn4qq21401n487nyq9w5bv7g	2021-02-03 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:23.475	2026-03-24 15:04:44.52	f	\N
cmn4qq96b026o87nyjpws1kx5	cmn4qpgfv00wh87nysdv6yqwz	cmn4qq21401n487nyq9w5bv7g	2023-11-21 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:23.507	2026-03-24 15:04:44.545	f	\N
cmn4qq976026q87nyb80po8wb	cmn4qpgg600wj87nyt3turc9a	cmn4qq21401n487nyq9w5bv7g	2024-10-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:23.538	2026-03-24 15:04:44.571	f	\N
cmn4qq983026t87nygr9moq96	cmn4qpghb00wo87ny08k330bf	cmn4qq21401n487nyq9w5bv7g	2023-01-16 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:23.571	2026-03-24 15:04:44.61	f	\N
cmn4qq991026w87nyfr9fsqyx	cmn4qpgiu00wu87ny7ivs2gpx	cmn4qq21401n487nyq9w5bv7g	2022-11-17 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:23.605	2026-03-24 15:04:44.634	f	\N
cmn4qq99y026z87nyqb64ki1b	cmn4qpgk200x187nyvsqnal5z	cmn4qq21401n487nyq9w5bv7g	2022-06-05 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:23.638	2026-03-24 15:04:44.662	f	\N
cmn4qq9aw027187ny5w88tcbq	cmn4qpgkf00x387nyg8zpf0xz	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:23.673	2026-03-24 15:04:44.688	f	\N
cmn4qq9bw027487nyn4egdvrl	cmn4qpglh00x887nyzpkrlibg	cmn4qq21401n487nyq9w5bv7g	2020-11-11 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:23.708	2026-03-24 15:04:44.722	f	\N
cmn4qq9cz027687ny4f5w4ma9	cmn4qpgls00xa87nyb95frlb0	cmn4qq21401n487nyq9w5bv7g	2023-07-10 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:23.747	2026-03-24 15:04:44.755	f	\N
cmn4qq9dq027887nyksu4fifq	cmn4qpgm400xc87ny4b6awkkj	cmn4qq21401n487nyq9w5bv7g	2020-04-04 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:23.775	2026-03-24 15:04:44.786	f	\N
cmn4qq9ej027a87nyxu1o3llh	cmn4qpgmg00xe87nykzdihskj	cmn4qq21401n487nyq9w5bv7g	2023-07-18 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:23.803	2026-03-24 15:04:44.818	f	\N
cmn4qq9fc027c87ny2s35srvt	cmn4qpgmw00xg87ny8dfnv7uh	cmn4qq21401n487nyq9w5bv7g	2020-08-03 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:23.832	2026-03-24 15:04:44.842	f	\N
cmn4qq9g9027f87nydersos1x	cmn4qpgoy00xn87nykecg4sue	cmn4qq21401n487nyq9w5bv7g	2022-10-30 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:23.865	2026-03-24 15:04:44.871	f	\N
cmn4qq9hj027h87nym0sud5vr	cmn4qpgpa00xp87nyu901kreo	cmn4qq21401n487nyq9w5bv7g	2022-03-26 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:23.912	2026-03-24 15:04:44.912	f	\N
cmn4qq9il027k87nyfaaqpr6k	cmn4qpgs700xz87nyb7atbntq	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:23.95	2026-03-24 15:04:44.94	f	\N
cmn4qq9jb027n87nyxn6digks	cmn4qpgt400y487nyf0w1kair	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:23.976	2026-03-24 15:04:44.965	f	\N
cmn4qq9k3027q87nyhuzprpvo	cmn4qpgv800yc87nyr4syiy9n	cmn4qq21401n487nyq9w5bv7g	2023-06-14 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:24.003	2026-03-24 15:04:44.991	f	\N
cmn4qq9ku027t87nyp1dbe0yb	cmn4qpgwk00yh87nyh3p9jy5u	cmn4qq21401n487nyq9w5bv7g	2021-01-04 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:24.031	2026-03-24 15:04:45.021	f	\N
cmn4qq9lr027w87nykfkh0j2h	cmn4qpgxp00ym87nya3zbjgis	cmn4qq21401n487nyq9w5bv7g	2022-05-17 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:24.063	2026-03-24 15:04:45.052	f	\N
cmn4qq9mq027y87nyem03na1b	cmn4qpgy100yo87nypa5krkme	cmn4qq21401n487nyq9w5bv7g	2022-05-17 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:24.098	2026-03-24 15:04:45.083	f	\N
cmn4qq9nr028187nykk2w58xr	cmn4qpgz000yt87nyb4zfqm06	cmn4qq21401n487nyq9w5bv7g	2022-07-14 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:24.135	2026-03-24 15:04:45.116	f	\N
cmn4qq9of028487ny9aff7o6w	cmn4qph1c00z387nykdljyrca	cmn4qq21401n487nyq9w5bv7g	2023-01-04 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:24.159	2026-03-24 15:04:45.149	f	\N
cmn4qq9p3028687nyl56gby9g	cmn4qph1n00z587nyhb177cj4	cmn4qq21401n487nyq9w5bv7g	2024-02-06 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:24.184	2026-03-24 15:04:45.176	f	\N
cmn4qq9px028987nyh1cw98md	cmn4qph2q00za87ny0vo4iono	cmn4qq21401n487nyq9w5bv7g	2024-03-05 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:24.214	2026-03-24 15:04:45.201	f	\N
cmn4qq9qy028c87nyfwgvedfh	cmn4qph4z00zl87nyy8e5onpc	cmn4qq21401n487nyq9w5bv7g	2023-08-08 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:24.25	2026-03-24 15:04:45.222	f	\N
cmn4qq9rm028e87nysj84uz3f	cmn4qph5a00zn87nyefi6zc53	cmn4qq21401n487nyq9w5bv7g	2024-08-04 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:24.274	2026-03-24 15:04:45.244	f	\N
cmn4qq9sh028g87nyt68kpvom	cmn4qph5l00zp87nygqmq8sfb	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:24.306	2026-03-24 15:04:45.268	f	\N
cmn4qq9t8028j87nybcbn15e2	cmn4qph6j00zu87nym7vreoaa	cmn4qq21401n487nyq9w5bv7g	2023-10-03 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:24.332	2026-03-24 15:04:45.316	f	\N
cmn4qq9u4028l87nyfmjgfyj6	cmn4qph6w00zw87nynytnulld	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:24.364	2026-03-24 15:04:45.341	f	\N
cmn4qq9v1028n87nyj5ffgwdt	cmn4qph7900zy87ny2yru1ft8	cmn4qq21401n487nyq9w5bv7g	2024-06-16 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:24.397	2026-03-24 15:04:45.365	f	\N
cmn4qq9vy028p87nyta5nf9ee	cmn4qph7q010087ny9zguvp52	cmn4qq21401n487nyq9w5bv7g	2024-06-16 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:24.431	2026-03-24 15:04:45.387	f	\N
cmn4qq9wv028s87ny32a1wlv4	cmn4qph8u010387nylju11zx1	cmn4qq21401n487nyq9w5bv7g	2023-07-26 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:24.464	2026-03-24 15:04:45.41	f	\N
cmn4qq9xm028u87nyk6au9ijv	cmn4qph96010587nydsrhk09e	cmn4qq21401n487nyq9w5bv7g	2023-07-26 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:24.49	2026-03-24 15:04:45.437	f	\N
cmn4qq9yd028w87nywvxiu1vf	cmn4qph9h010787nynt5918ec	cmn4qq21401n487nyq9w5bv7g	2023-07-26 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:24.518	2026-03-24 15:04:45.46	f	\N
cmn4qq9zf028y87nyuwnyifpc	cmn4qph9t010987nyx938zs0d	cmn4qq21401n487nyq9w5bv7g	2023-07-26 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:24.555	2026-03-24 15:04:45.497	f	\N
cmn4qqa09029087nyyazyq0wd	cmn4qpha9010b87ny84zc7gc1	cmn4qq21401n487nyq9w5bv7g	2023-10-26 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:24.585	2026-03-24 15:04:45.532	f	\N
cmn4qqa0y029287nygpfus74c	cmn4qphak010d87nytn87ez09	cmn4qq21401n487nyq9w5bv7g	2023-07-26 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:24.61	2026-03-24 15:04:45.557	f	\N
cmn4qqa1o029487nyj93w2cli	cmn4qphau010f87nyw4rngixh	cmn4qq21401n487nyq9w5bv7g	2023-07-26 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:24.637	2026-03-24 15:04:45.581	f	\N
cmn4qqa2e029787ny6wqb6twk	cmn4qphbx010k87nyut3jq4u3	cmn4qq21401n487nyq9w5bv7g	2023-10-12 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:24.663	2026-03-24 15:04:45.605	f	\N
cmn4qqa32029987nymjao21r6	cmn4qphca010m87nyrivqvync	cmn4qq21401n487nyq9w5bv7g	2020-04-06 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:24.687	2026-03-24 15:04:45.627	f	\N
cmn4qqa40029c87nyyznkekr6	cmn4qphdw010r87nyfd2fj0sa	cmn4qq21401n487nyq9w5bv7g	2022-03-31 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:24.721	2026-03-24 15:04:45.652	f	\N
cmn4qqa4p029e87nyxqfkvxfe	cmn4qpheg010t87ny3xr39wed	cmn4qq21401n487nyq9w5bv7g	2022-03-07 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:24.746	2026-03-24 15:04:45.676	f	\N
cmn4qqa5e029g87nyro9vf1h9	cmn4qphey010v87nycaqgthsy	cmn4qq21401n487nyq9w5bv7g	2022-03-07 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:24.77	2026-03-24 15:04:45.7	f	\N
cmn4qqa62029i87ny3n3yz265	cmn4qphfh010x87ny2gfy3hm0	cmn4qq21401n487nyq9w5bv7g	2022-03-07 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:24.794	2026-03-24 15:04:45.724	f	\N
cmn4qqa76029l87nyttp9ew5m	cmn4qpho6012287ny4gm2raj4	cmn4qq21401n487nyq9w5bv7g	2024-08-26 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:24.835	2026-03-24 15:04:45.751	f	\N
cmn4qqa7w029n87nyn5njpnlk	cmn4qphoi012487ny8n204jok	cmn4qq21401n487nyq9w5bv7g	2024-07-21 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:24.86	2026-03-24 15:04:45.784	f	\N
cmn4qqa8j029p87nycmo0w8y6	cmn4qphov012687ny7rhasvnd	cmn4qq21401n487nyq9w5bv7g	2024-07-21 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:24.884	2026-03-24 15:04:45.81	f	\N
cmn4qqa9m029s87nyweatokdf	cmn4qphrf012k87ny9xqp6kw8	cmn4qq21401n487nyq9w5bv7g	2020-08-23 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:24.923	2026-03-24 15:04:45.835	f	\N
cmn4qqbhm02cz87ny7n6ozb2a	cmn4qpj2c018d87nymfvb3o7m	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:26.506	2026-03-24 15:04:47.38	f	\N
cmn4qqaai029u87ny962krii2	cmn4qphrz012m87nyos9wx4om	cmn4qq21401n487nyq9w5bv7g	2020-08-06 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:24.955	2026-03-24 15:04:45.857	f	\N
cmn4qqabi029w87ny8o5b8ks3	cmn4qphsd012o87ny1fyhled9	cmn4qq21401n487nyq9w5bv7g	2020-09-20 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:24.99	2026-03-24 15:04:45.881	f	\N
cmn4qqacg029z87nyvldh3ar4	cmn4qphv6013187ny7sxc9npl	cmn4qq21401n487nyq9w5bv7g	2022-11-09 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:25.025	2026-03-24 15:04:45.906	f	\N
cmn4qqade02a287ny7oynwapq	cmn4qphwa013687nynhrwgjcw	cmn4qq21401n487nyq9w5bv7g	2022-01-23 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:25.058	2026-03-24 15:04:45.94	f	\N
cmn4qqae102a487nyfzz80rxe	cmn4qphwp013887nycyp6p2sa	cmn4qq21401n487nyq9w5bv7g	2022-01-23 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:25.082	2026-03-24 15:04:45.97	f	\N
cmn4qqaep02a687nyf9g7kgwy	cmn4qphx1013a87nyqe8h1kor	cmn4qq21401n487nyq9w5bv7g	2022-01-23 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:25.106	2026-03-24 15:04:45.994	f	\N
cmn4qqafh02a987nyvw7vcpee	cmn4qphzy013j87nybcuj2iuh	cmn4qq21401n487nyq9w5bv7g	2021-04-08 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:25.134	2026-03-24 15:04:46.029	f	\N
cmn4qqag502ac87nyn880ddnr	cmn4qpi1z013t87nyltsagjl8	cmn4qq21401n487nyq9w5bv7g	2024-04-22 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:25.158	2026-03-24 15:04:46.054	f	\N
cmn4qqagx02af87ny2urjlad2	cmn4qpi2n013w87nyfo4hhp2g	cmn4qq21401n487nyq9w5bv7g	2024-04-29 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:25.185	2026-03-24 15:04:46.077	f	\N
cmn4qqai202ah87nysthkdo0a	cmn4qpi2z013y87ny3s0xcmgx	cmn4qq21401n487nyq9w5bv7g	2024-04-18 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:25.226	2026-03-24 15:04:46.099	f	\N
cmn4qqaj802ak87nytdbg7e31	cmn4qpi4a014587nye0bxmioc	cmn4qq21401n487nyq9w5bv7g	2023-05-30 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:25.268	2026-03-24 15:04:46.123	f	\N
cmn4qqajx02am87nyksnf129r	cmn4qpi4l014787ny7esaxydx	cmn4qq21401n487nyq9w5bv7g	2023-05-30 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:25.293	2026-03-24 15:04:46.154	f	\N
cmn4qqaks02ao87nyl3x890ll	cmn4qpi4z014987nyqt88qw7u	cmn4qq21401n487nyq9w5bv7g	2024-12-04 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:25.325	2026-03-24 15:04:46.18	f	\N
cmn4qqalu02ar87ny5ta2ckqz	cmn4qpi6g014e87nysae854bs	cmn4qq21401n487nyq9w5bv7g	2024-07-21 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:25.363	2026-03-24 15:04:46.203	f	\N
cmn4qqaml02au87nyhq72txcv	cmn4qpi7s014l87ny0j07jehr	cmn4qq21401n487nyq9w5bv7g	2020-09-09 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:25.389	2026-03-24 15:04:46.232	f	\N
cmn4qqan902aw87nyv5gk86f6	cmn4qpi87014n87nyxcjl9343	cmn4qq21401n487nyq9w5bv7g	2023-04-18 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:25.414	2026-03-24 15:04:46.273	f	\N
cmn4qqao102ay87ny1coikxum	cmn4qpi8l014p87nywnpj7ntl	cmn4qq21401n487nyq9w5bv7g	2023-11-16 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:25.441	2026-03-24 15:04:46.321	f	\N
cmn4qqaow02b187nysq3pszyd	cmn4qpia2014u87nykuld0maa	cmn4qq21401n487nyq9w5bv7g	2023-11-20 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:25.472	2026-03-24 15:04:46.354	f	\N
cmn4qqapv02b387nytbnlho2e	cmn4qpib1014y87nyx6j6uvxv	cmn4qq21401n487nyq9w5bv7g	2023-10-15 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:25.507	2026-03-24 15:04:46.382	f	\N
cmn4qqaqm02b687nyo30pbqbo	cmn4qpide015a87nytmtdp4ds	cmn4qq21401n487nyq9w5bv7g	2025-05-14 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:25.535	2026-03-24 15:04:46.407	f	\N
cmn4qqarq02b987nyn3bf4n0t	cmn4qpidr015c87nydi11x6gi	cmn4qq21401n487nyq9w5bv7g	2025-06-03 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:25.574	2026-03-24 15:04:46.445	f	\N
cmn4qqasp02bb87ny618yx7h2	cmn4qpie3015e87nywboje0eo	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:25.609	2026-03-24 15:04:46.475	f	\N
cmn4qqatu02be87nyaj03skoi	cmn4qpig8015q87ny5ile524z	cmn4qq21401n487nyq9w5bv7g	2015-12-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:25.65	2026-03-24 15:04:46.514	f	\N
cmn4qqauu02bg87nyrfwh38ih	cmn4qpigo015s87nysg7c5dnf	cmn4qq21401n487nyq9w5bv7g	2015-12-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:25.686	2026-03-24 15:04:46.537	f	\N
cmn4qqaw202bi87ny7ru4l7cp	cmn4qpihe015u87nyx16ia132	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:25.73	2026-03-24 15:04:46.569	f	\N
cmn4qqax302bk87nyd2t751g0	cmn4qpihw015w87nyr9om4r3c	cmn4qq21401n487nyq9w5bv7g	2024-06-15 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:25.767	2026-03-24 15:04:46.597	f	\N
cmn4qqay402bm87ny8b4fh9kk	cmn4qpik2016787nyayex585q	cmn4qq21401n487nyq9w5bv7g	2024-12-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:25.805	2026-03-24 15:04:46.623	f	\N
cmn4qqayu02bp87nymffiv25a	cmn4qpils016f87nyus4oe8y5	cmn4qq21401n487nyq9w5bv7g	2024-05-31 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:25.83	2026-03-24 15:04:46.662	f	\N
cmn4qqazl02br87nynm3e3tnm	cmn4qpim7016h87nyt46g2p5a	cmn4qq21401n487nyq9w5bv7g	2024-05-31 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:25.857	2026-03-24 15:04:46.7	f	\N
cmn4qqb0z02bt87nyzb6jk68b	cmn4qpimj016j87nyp7kejwif	cmn4qq21401n487nyq9w5bv7g	2024-05-31 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:25.907	2026-03-24 15:04:46.74	f	\N
cmn4qqb1p02bv87nyk8nikgb5	cmn4qpimt016l87nylsk9l8kl	cmn4qq21401n487nyq9w5bv7g	2024-05-31 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:25.933	2026-03-24 15:04:46.772	f	\N
cmn4qqb2g02bx87nyut1dysim	cmn4qpin7016n87nykookhis5	cmn4qq21401n487nyq9w5bv7g	2024-05-31 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:25.96	2026-03-24 15:04:46.801	f	\N
cmn4qqb3h02bz87ny0fnh0s9p	cmn4qpinp016p87nyd8pi1kg2	cmn4qq21401n487nyq9w5bv7g	2024-05-31 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:25.997	2026-03-24 15:04:46.838	f	\N
cmn4qqb4d02c187ny3drdscsw	cmn4qpip9016v87nyy2fqexlr	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:26.029	2026-03-24 15:04:46.877	f	\N
cmn4qqb5302c487nyrdis302z	cmn4qpiqf017087nyo6z4whay	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:26.056	2026-03-24 15:04:46.902	f	\N
cmn4qqb5u02c687nyd3wxono1	cmn4qpiri017487ny63vy8e03	cmn4qq21401n487nyq9w5bv7g	2020-12-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:26.082	2026-03-24 15:04:46.935	f	\N
cmn4qqb6k02c987nygynz0ofy	cmn4qpiw0017l87nyq78cdvn6	cmn4qq21401n487nyq9w5bv7g	2022-02-28 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:26.109	2026-03-24 15:04:46.976	f	\N
cmn4qqb7a02cb87ny7w8bmvve	cmn4qpiwd017n87ny4e4jiemj	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:26.135	2026-03-24 15:04:47.01	f	\N
cmn4qqb7z02cd87nyii1su8lc	cmn4qpiwp017p87nyy0dlcj00	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:26.16	2026-03-24 15:04:47.035	f	\N
cmn4qqb8o02cf87nyckh5dlqm	cmn4qpix2017r87nyv058rull	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:26.185	2026-03-24 15:04:47.067	f	\N
cmn4qqb9l02ch87ny2y3xr4hs	cmn4qpixl017t87nyl26bsl57	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:26.217	2026-03-24 15:04:47.108	f	\N
cmn4qqbas02ck87nyxzkom39g	cmn4qpiym017w87nyod8uuz6l	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:26.26	2026-03-24 15:04:47.145	f	\N
cmn4qqbbw02cm87nyfmlmtpi7	cmn4qpiz0017y87ny7bostjho	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:26.301	2026-03-24 15:04:47.178	f	\N
cmn4qqbcz02co87ny4k389e6o	cmn4qpj0d018287nyit1bxi9h	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:26.339	2026-03-24 15:04:47.217	f	\N
cmn4qqbdn02cq87ny9w69ksg1	cmn4qpj0o018487nyiickkasd	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:26.364	2026-03-24 15:04:47.241	f	\N
cmn4qqbeu02ct87ny4nz32ql4	cmn4qpj19018787nyhv30yxam	cmn4qq21401n487nyq9w5bv7g	2021-12-12 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:26.407	2026-03-24 15:04:47.288	f	\N
cmn4qqbg102cv87nypxk5dskz	cmn4qpj1n018987ny9oxada7r	cmn4qq21401n487nyq9w5bv7g	2021-12-12 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:26.449	2026-03-24 15:04:47.32	f	\N
cmn4qqbgq02cx87ny76s427xp	cmn4qpj1z018b87ny36u774d7	cmn4qq21401n487nyq9w5bv7g	2023-02-28 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:26.475	2026-03-24 15:04:47.35	f	\N
cmn4qqbin02d287nyahada6zb	cmn4qpj36018g87nydj74lwpe	cmn4qq21401n487nyq9w5bv7g	2018-10-09 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:26.544	2026-03-24 15:04:47.414	f	\N
cmn4qqbjr02d487nybm6oacc1	cmn4qpj3p018i87nyu96voqjw	cmn4qq21401n487nyq9w5bv7g	2023-02-16 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:26.584	2026-03-24 15:04:47.446	f	\N
cmn4qqbkl02d687ny5a6dic1z	cmn4qpj45018k87nybqgbupsp	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:26.614	2026-03-24 15:04:47.471	f	\N
cmn4qqbl902d887nyr61xdb7o	cmn4qpj4j018m87ny13z8bqqp	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:26.638	2026-03-24 15:04:47.503	f	\N
cmn4qqbm002da87nytawqtg4o	cmn4qpj52018o87nytc7rwrw5	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:26.664	2026-03-24 15:04:47.527	f	\N
cmn4qqbmt02dc87ny659l84de	cmn4qpj5u018q87nymddfx7fk	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:26.694	2026-03-24 15:04:47.551	f	\N
cmn4qqbno02de87ny4wr4rrt6	cmn4qpj6e018s87nycgxtomm0	cmn4qq21401n487nyq9w5bv7g	2018-10-09 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:26.724	2026-03-24 15:04:47.588	f	\N
cmn4qqbod02dh87nyi064q7sa	cmn4qpj7b018v87nyohw77obk	cmn4qq21401n487nyq9w5bv7g	2023-02-28 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:26.749	2026-03-24 15:04:47.613	f	\N
cmn4qqbp602dj87nyr3oqfzwm	cmn4qpj7o018x87ny5tgxk4sc	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:26.778	2026-03-24 15:04:47.644	f	\N
cmn4qqbqf02dl87nyjjuuurxc	cmn4qpj81018z87nyk7kfkt5a	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:26.824	2026-03-24 15:04:47.676	f	\N
cmn4qqbr802dn87ny96cphgm4	cmn4qpj8d019187ny9iuk3do1	cmn4qq21401n487nyq9w5bv7g	2018-10-09 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:26.853	2026-03-24 15:04:47.712	f	\N
cmn4qqbsc02dq87nyjwzangee	cmn4qpj94019487nycl1bpuah	cmn4qq21401n487nyq9w5bv7g	2018-10-09 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:26.892	2026-03-24 15:04:47.742	f	\N
cmn4qqbtb02ds87ny7vmic5u5	cmn4qpj9l019687nyslc225jg	cmn4qq21401n487nyq9w5bv7g	2018-10-09 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:26.927	2026-03-24 15:04:47.77	f	\N
cmn4qqbu902du87nysacco1v3	cmn4qpja0019887nytdi8dv2a	cmn4qq21401n487nyq9w5bv7g	2023-05-31 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:26.961	2026-03-24 15:04:47.802	f	\N
cmn4qqbv602dw87nyb5keeu5g	cmn4qpjah019a87nytezvi9ds	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:26.994	2026-03-24 15:04:47.832	f	\N
cmn4qqbwd02dy87nyiey3n3bp	cmn4qpjaz019c87nywrqoshda	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:27.038	2026-03-24 15:04:47.86	f	\N
cmn4qqbx502e087nyv4h29uqs	cmn4qpjbl019e87nyr7zcdf86	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:27.066	2026-03-24 15:04:47.897	f	\N
cmn4qqbxy02e287nye4w4k4wb	cmn4qpjc1019g87nyuu1tvsow	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:27.094	2026-03-24 15:04:47.929	f	\N
cmn4qqbz502e487nys1pba27t	cmn4qpjco019i87ny8zweqktj	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:27.138	2026-03-24 15:04:47.959	f	\N
cmn4qqc0602e687nyroo8dytu	cmn4qpjd3019k87ny1j2fz94y	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:27.174	2026-03-24 15:04:47.982	f	\N
cmn4qqc1902e887nysqz8ybec	cmn4qpjdg019m87ny8oxhtz91	cmn4qq21401n487nyq9w5bv7g	2018-10-09 22:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:27.214	2026-03-24 15:04:48.006	f	\N
cmn4qqc2i02ea87ny63fpe9z6	cmn4qpjdv019o87nysoo7xg1j	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:27.258	2026-03-24 15:04:48.03	f	\N
cmn4qqc3702ec87ny9gmpnjfo	cmn4qpjef019q87ny373pg7z0	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:27.284	2026-03-24 15:04:48.055	f	\N
cmn4qqc4702ee87ny6n0q0cq2	cmn4qpjev019s87nyv1gd7jiy	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:27.32	2026-03-24 15:04:48.087	f	\N
cmn4qqc5f02eg87nyx0im5zq7	cmn4qpjf8019u87nywvoatvix	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:27.364	2026-03-24 15:04:48.116	f	\N
cmn4qqc6b02ei87nybq28f1bl	cmn4qpjfo019w87nyl1emeif6	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:27.395	2026-03-24 15:04:48.149	f	\N
cmn4qqc7b02ek87ny1q3hwp9f	cmn4qpjg0019y87nyz5dkvgza	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:27.431	2026-03-24 15:04:48.18	f	\N
cmn4qqc8202em87ny95runle7	cmn4qpjgl01a087nyp09ei1nt	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:27.458	2026-03-24 15:04:48.207	f	\N
cmn4qqc8v02eo87ny3vqf2n91	cmn4qpjh401a287nyfxsux493	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:27.487	2026-03-24 15:04:48.247	f	\N
cmn4qqc9x02eq87nyop1esqxf	cmn4qpjhh01a487nyeu90yni9	cmn4qq21401n487nyq9w5bv7g	2023-12-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:27.525	2026-03-24 15:04:48.281	f	\N
cmn4qqcaw02es87nyzhwo2v4l	cmn4qpjhz01a687nylj4rmtnv	cmn4qq21401n487nyq9w5bv7g	2019-10-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:27.56	2026-03-24 15:04:48.306	f	\N
cmn4qqcbo02eu87nyb0u4yjdo	cmn4qpjic01a887nyez43jphx	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:27.589	2026-03-24 15:04:48.334	f	\N
cmn4qqcci02ex87nykn0v58rg	cmn4qpjjp01ad87ny4hd3mv0m	cmn4qq21401n487nyq9w5bv7g	2024-12-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:27.619	2026-03-24 15:04:48.359	f	\N
cmn4qqcd802ez87ny5wzekm15	cmn4qpieh015g87ny17sjzk6e	cmn4qq21401n487nyq9w5bv7g	2024-12-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:27.645	2026-03-24 15:04:48.383	f	\N
cmn4qqce702f187nytzr9h26p	cmn4qpjl201al87nybim10fye	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:27.679	2026-03-24 15:04:48.406	f	\N
cmn4qqcez02f387nyytj14jwk	cmn4qpjme01ar87nyb6s06qur	cmn4qq21401n487nyq9w5bv7g	2024-12-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:27.707	2026-03-24 15:04:48.438	f	\N
cmn4qqcfn02f687nyxcdlf2kc	cmn4qpjmx01at87nyeucob8pk	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:27.731	2026-03-24 15:04:48.474	f	\N
cmn4qqcgc02f887ny7s5588g3	cmn4qpjnd01av87nyse4rgv7b	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:27.756	2026-03-24 15:04:48.505	f	\N
cmn4qqcgz02fa87nyxo6jznd9	cmn4qpif7015k87nym8oew8bj	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:27.78	2026-03-24 15:04:48.54	f	\N
cmn4qqcho02fc87ny3c4w8co2	cmn4qpifv015o87nytf2cemov	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:27.805	2026-03-24 15:04:48.563	f	\N
cmn4qqcij02fe87nyrnk6ntao	cmn4qpjsp01bd87ny93awf7l2	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:27.835	2026-03-24 15:04:48.586	f	\N
cmn4qqcjk02fg87nymh8isfwn	cmn4qpjt501bf87nyaegdkr9h	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:27.873	2026-03-24 15:04:48.61	f	\N
cmn4qqckn02fj87nyit9bbj1o	cmn4qpju501bk87ny3ocvepui	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:27.911	2026-03-24 15:04:48.632	f	\N
cmn4qqclq02fl87nyz2hd3mmi	cmn4qpjuo01bm87nyf0r2gzel	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:27.95	2026-03-24 15:04:48.655	f	\N
cmn4qqcmj02fn87ny9rwt30lj	cmn4qpjv601bo87nyle5pxdre	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:27.979	2026-03-24 15:04:48.678	f	\N
cmn4qqcnr02fq87nyehs720je	cmn4qpjw601bt87nyevdfm7l1	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:28.023	2026-03-24 15:04:48.71	f	\N
cmn4qqcou02fs87nyicw19u9d	cmn4qpjwi01bv87ny4t5txcbl	cmn4qq21401n487nyq9w5bv7g	2023-12-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:28.062	2026-03-24 15:04:48.735	f	\N
cmn4qqcpn02fu87nyo0tcgahp	cmn4qpjwv01bx87nyz135inee	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:28.092	2026-03-24 15:04:48.767	f	\N
cmn4qqcqr02fw87nydf3w3i40	cmn4qpjyr01c587ny02qx5czl	cmn4qq21401n487nyq9w5bv7g	2020-12-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:28.131	2026-03-24 15:04:48.801	f	\N
cmn4qqcri02fz87nyx6a3vllu	cmn4qpk0x01cc87nypm6648uc	cmn4qq21401n487nyq9w5bv7g	2024-10-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:28.158	2026-03-24 15:04:48.835	f	\N
cmn4qqcsh02g187nyeo4ifk2b	cmn4qpk1c01ce87ny9y9gvyog	cmn4qq21401n487nyq9w5bv7g	2024-12-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:28.194	2026-03-24 15:04:48.87	f	\N
cmn4qqctd02g487ny3h8kitr0	cmn4qpk2g01cj87ny43ei7inc	cmn4qq21401n487nyq9w5bv7g	2023-12-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:28.226	2026-03-24 15:04:48.894	f	\N
cmn4qqcu502g887nymu50mcxk	cmn4qqctu02g687nyw8tadn45	cmn4qq21401n487nyq9w5bv7g	2024-12-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:28.254	2026-03-24 15:04:48.918	f	\N
cmn4qqcv602gb87ny6ae89ezk	cmn4qpk3q01co87nypcuwl8sg	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:28.29	2026-03-24 15:04:48.941	f	\N
cmn4qqcvz02gd87nyobb90l56	cmn4qpk4301cq87nyximxgysu	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:28.319	2026-03-24 15:04:48.964	f	\N
cmn4qqcys02gf87ny3sqaehny	cmn4qpk4f01cs87nyzob3lava	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:28.421	2026-03-24 15:04:48.988	f	\N
cmn4qqd0r02gh87nybcckpivt	cmn4qpk4s01cu87nysb02sbh3	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:28.492	2026-03-24 15:04:49.011	f	\N
cmn4qqd3v02gj87nyox4nhbn3	cmn4qpk5501cw87ny9a21qwnz	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:28.603	2026-03-24 15:04:49.035	f	\N
cmn4qqd4v02gl87nye7oaz7dr	cmn4qpk5r01cy87nyc98lixdz	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:28.64	2026-03-24 15:04:49.059	f	\N
cmn4qqd5n02gn87nystoz4jpv	cmn4qpk6701d087nyog32d1gc	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:28.668	2026-03-24 15:04:49.082	f	\N
cmn4qqd6d02gp87nylcfjp5e2	cmn4qpk6o01d287nyamxodiz3	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:28.693	2026-03-24 15:04:49.105	f	\N
cmn4qqd7302gr87ny3v5gxlss	cmn4qpk7001d487nyo8xax1w5	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:28.72	2026-03-24 15:04:49.128	f	\N
cmn4qqd7v02gt87ny1t1mrecv	cmn4qpk7i01d687nyd1acx163	cmn4qq21401n487nyq9w5bv7g	2019-12-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:28.747	2026-03-24 15:04:49.148	f	\N
cmn4qqdaf02gz87nys9b6vymd	cmn4qp92p000t87nyypaykrcu	cmn4qqd9q02gw87nycctz7zf2	2021-05-27 22:00:00	2023-05-27 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:28.839	2026-03-24 14:59:28.839	f	\N
cmn4qqdb402h187ny2ptrbagl	cmn4qp931000v87ny0ench9ck	cmn4qqd9q02gw87nycctz7zf2	2021-05-27 22:00:00	2023-05-27 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:28.864	2026-03-24 14:59:28.864	f	\N
cmn4qqdcx02h487ny6jupncec	cmn4qp95e001687ny0kfk06na	cmn4qqd9q02gw87nycctz7zf2	2021-04-01 22:00:00	2023-04-01 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:28.929	2026-03-24 14:59:28.929	f	\N
cmn4qqdfp02h787nyj9y9v292	cmn4qp9lr003587nyssmcaog0	cmn4qqd9q02gw87nycctz7zf2	2022-05-20 22:00:00	2024-05-20 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:29.029	2026-03-24 14:59:29.029	f	\N
cmn4qqdjd02h987nydl8p095w	cmn4qp9m2003787nyjafujqym	cmn4qqd9q02gw87nycctz7zf2	2022-05-20 22:00:00	2024-05-20 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:29.161	2026-03-24 14:59:29.161	f	\N
cmn4qqdkk02hb87nyacdop4kq	cmn4qp9ms003987nydn44fl2m	cmn4qqd9q02gw87nycctz7zf2	2022-05-20 22:00:00	2024-05-20 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:29.204	2026-03-24 14:59:29.204	f	\N
cmn4qqdle02hd87nyt6d94jpo	cmn4qp9n4003b87nyujvurcxf	cmn4qqd9q02gw87nycctz7zf2	2022-04-27 22:00:00	2024-04-27 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:29.234	2026-03-24 14:59:29.234	f	\N
cmn4qqdm802hf87nyg3lstxk9	cmn4qp9o8003h87nyqlty4max	cmn4qqd9q02gw87nycctz7zf2	2022-05-20 22:00:00	2024-05-20 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:29.264	2026-03-24 14:59:29.264	f	\N
cmn4qqdn902hh87nyckby5hke	cmn4qp9ok003j87nyx8yygl20	cmn4qqd9q02gw87nycctz7zf2	2019-02-07 23:00:00	2021-02-07 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:29.301	2026-03-24 14:59:29.301	f	\N
cmn4qqdoh02hk87nyjtn9zpss	cmn4qp9t2004487ny299wr82s	cmn4qqd9q02gw87nycctz7zf2	2022-04-01 22:00:00	2024-04-01 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:29.345	2026-03-24 14:59:29.345	f	\N
cmn4qqdpi02hm87ny04chqbdi	cmn4qp9ts004887nyqfw9ac0f	cmn4qqd9q02gw87nycctz7zf2	2024-12-31 23:00:00	2026-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:29.383	2026-03-24 14:59:29.383	f	\N
cmn4qqdq902ho87nyb1815irh	cmn4qp9u4004a87ny1aok747m	cmn4qqd9q02gw87nycctz7zf2	2024-12-31 23:00:00	2026-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:29.409	2026-03-24 14:59:29.409	f	\N
cmn4qqdrc02hr87nyo7hh41nf	cmn4qp9ye004v87nyudlegi71	cmn4qqd9q02gw87nycctz7zf2	2023-10-12 22:00:00	2025-10-12 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:29.449	2026-03-24 14:59:29.449	f	\N
cmn4qqdst02hu87nycds6lmaw	cmn4qp9zb005087nyk6g5jocp	cmn4qqd9q02gw87nycctz7zf2	2023-09-28 22:00:00	2025-09-28 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:29.501	2026-03-24 14:59:29.501	f	\N
cmn4qqdto02hx87ny2137c5pi	cmn4qpa2n005g87nyf8gz82dw	cmn4qqd9q02gw87nycctz7zf2	2024-09-29 22:00:00	2026-09-29 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:29.532	2026-03-24 14:59:29.532	f	\N
cmn4qqdum02hz87ny9yz2wwf9	cmn4qpa36005i87nyy5uijmmw	cmn4qqd9q02gw87nycctz7zf2	2022-11-25 23:00:00	2024-11-25 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:29.567	2026-03-24 14:59:29.567	f	\N
cmn4qqdvc02i187nywvle4w85	cmn4qpa3p005k87ny9igekm49	cmn4qqd9q02gw87nycctz7zf2	2022-11-25 23:00:00	2024-11-25 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:29.593	2026-03-24 14:59:29.593	f	\N
cmn4qqdwd02i387nybgh4cuz9	cmn4qpa41005m87nyl4gkch2t	cmn4qqd9q02gw87nycctz7zf2	2022-11-25 23:00:00	2024-11-25 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:29.63	2026-03-24 14:59:29.63	f	\N
cmn4qqdxe02i687nyaizu6ney	cmn4qpa6n005y87ny2213r4ob	cmn4qqd9q02gw87nycctz7zf2	2023-10-12 22:00:00	2025-10-12 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:29.666	2026-03-24 14:59:29.666	f	\N
cmn4qqdya02i987nyacznmmxg	cmn4qpa8k006887nyq7vy9y4c	cmn4qqd9q02gw87nycctz7zf2	2024-09-29 22:00:00	2026-09-29 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:29.699	2026-03-24 14:59:29.699	f	\N
cmn4qqdz502ic87ny1gg6wbyx	cmn4qpaa9006g87nylpzkqmqi	cmn4qqd9q02gw87nycctz7zf2	2024-04-18 22:00:00	2026-04-18 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:29.73	2026-03-24 14:59:29.73	f	\N
cmn4qqe0002ie87nycr5gsyrm	cmn4qpaax006k87nymzo903ui	cmn4qqd9q02gw87nycctz7zf2	2021-12-17 23:00:00	2023-12-17 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:29.76	2026-03-24 14:59:29.76	f	\N
cmn4qqe1702ig87nyvun2jtld	cmn4qpab9006m87nyzwyneq2h	cmn4qqd9q02gw87nycctz7zf2	2024-02-15 23:00:00	2026-02-15 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:29.803	2026-03-24 14:59:29.803	f	\N
cmn4qqe2k02ii87nya8mngk43	cmn4qpabp006o87ny47pr3aw8	cmn4qqd9q02gw87nycctz7zf2	2024-02-15 23:00:00	2026-02-15 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:29.853	2026-03-24 14:59:29.853	f	\N
cmn4qqe3g02il87nyc3qag0gb	cmn4qpaih007e87nye67o6nz1	cmn4qqd9q02gw87nycctz7zf2	2023-10-12 22:00:00	2025-10-12 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:29.885	2026-03-24 14:59:29.885	f	\N
cmn4qqe4a02io87nyd1uy2p22	cmn4qpal4007q87nyfwmssfio	cmn4qqd9q02gw87nycctz7zf2	2023-06-04 22:00:00	2025-06-04 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:29.914	2026-03-24 14:59:29.914	f	\N
cmn4qqe5i02iq87nyq6muod46	cmn4qpalf007s87ny9945upvp	cmn4qqd9q02gw87nycctz7zf2	2023-06-04 22:00:00	2025-06-04 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:29.959	2026-03-24 14:59:29.959	f	\N
cmn4qqe6v02it87nykpm0ytrw	cmn4qpan5008087nyz5l557eg	cmn4qqd9q02gw87nycctz7zf2	2021-04-01 22:00:00	2023-04-01 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:30.007	2026-03-24 14:59:30.007	f	\N
cmn4qqe8802iw87ny136n9bj9	cmn4qpanv008387nyx4cm98mw	cmn4qqd9q02gw87nycctz7zf2	2024-06-20 22:00:00	2026-06-20 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:30.056	2026-03-24 14:59:30.056	f	\N
cmn4qqe9602iz87nyofrnrkd2	cmn4qpapr008d87nyi76ijqlr	cmn4qqd9q02gw87nycctz7zf2	2022-09-09 22:00:00	2024-09-09 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:30.09	2026-03-24 14:59:30.09	f	\N
cmn4qqeag02j187nygl9yrtpy	cmn4qpaq9008h87nyiu56mt0p	cmn4qqd9q02gw87nycctz7zf2	2022-09-09 22:00:00	2024-09-09 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:30.137	2026-03-24 14:59:30.137	f	\N
cmn4qqeba02j487nyg97293tu	cmn4qparq008o87nyrn97a5hp	cmn4qqd9q02gw87nycctz7zf2	2023-09-28 22:00:00	2025-09-28 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:30.166	2026-03-24 14:59:30.166	f	\N
cmn4qqeby02j687nyvi0ul9ue	cmn4qpas1008q87nyttyc2nbn	cmn4qqd9q02gw87nycctz7zf2	2023-09-28 22:00:00	2025-09-28 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:30.191	2026-03-24 14:59:30.191	f	\N
cmn4qqecw02j887nyhzt01bha	cmn4qpash008s87nyc35ndnyz	cmn4qqd9q02gw87nycctz7zf2	2023-09-28 22:00:00	2025-09-28 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:30.225	2026-03-24 14:59:30.225	f	\N
cmn4qqedy02ja87nyhe4fv6t9	cmn4qpass008u87ny5iktsdat	cmn4qqd9q02gw87nycctz7zf2	2023-09-28 22:00:00	2025-09-28 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:30.262	2026-03-24 14:59:30.262	f	\N
cmn4qqeeo02jc87nyb9wfp8mq	cmn4qpat5008w87nye9xrszoi	cmn4qqd9q02gw87nycctz7zf2	2023-09-28 22:00:00	2025-09-28 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:30.288	2026-03-24 14:59:30.288	f	\N
cmn4qqefj02je87ny1bn30n0j	cmn4qpatj008y87nyr58xhn5z	cmn4qqd9q02gw87nycctz7zf2	2023-09-28 22:00:00	2025-09-28 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:30.319	2026-03-24 14:59:30.319	f	\N
cmn4qqegj02jh87nyw0qv8pj3	cmn4qpauf009187nyr0b9usoe	cmn4qqd9q02gw87nycctz7zf2	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:30.355	2026-03-24 14:59:30.355	f	\N
cmn4qqehg02jk87ny4nr2dtq4	cmn4qpb0w009q87nyifjvvlyf	cmn4qqd9q02gw87nycctz7zf2	2022-05-27 22:00:00	2024-05-27 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:30.388	2026-03-24 14:59:30.388	f	\N
cmn4qqei602jn87nyvo7okpz5	cmn4qpbb400av87nyi5q08hhc	cmn4qqd9q02gw87nycctz7zf2	2025-12-01 23:00:00	2027-12-01 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:30.415	2026-03-24 14:59:30.415	f	\N
cmn4qqeiy02jq87nyv0270xl8	cmn4qpbdy00b687nyt9f1ue3m	cmn4qqd9q02gw87nycctz7zf2	2022-01-12 23:00:00	2024-01-12 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:30.442	2026-03-24 14:59:30.442	f	\N
cmn4qqek202jt87nywmodxauz	cmn4qpbgb00bi87nysrr8rrzx	cmn4qqd9q02gw87nycctz7zf2	2022-10-07 22:00:00	2024-10-07 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:30.482	2026-03-24 14:59:30.482	f	\N
cmn4qqel002jw87nyof4sivs7	cmn4qpbo000cd87nyk1xgze4e	cmn4qqd9q02gw87nycctz7zf2	2024-10-31 23:00:00	2026-10-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:30.517	2026-03-24 14:59:30.517	f	\N
cmn4qqem102jz87nyqk4v8los	cmn4qpbxz00dn87nyd82glffq	cmn4qqd9q02gw87nycctz7zf2	2021-11-04 23:00:00	2023-11-04 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:30.554	2026-03-24 14:59:30.554	f	\N
cmn4qqemp02k187nyv6ak0tzu	cmn4qpbya00dp87nybjh31i8u	cmn4qqd9q02gw87nycctz7zf2	2024-04-18 22:00:00	2026-04-18 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:30.578	2026-03-24 14:59:30.578	f	\N
cmn4qqenu02k487nyxmfjheja	cmn4qpc7l00eo87nyiq0lo2tp	cmn4qqd9q02gw87nycctz7zf2	2008-04-18 22:00:00	2010-04-18 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:30.618	2026-03-24 14:59:30.618	f	\N
cmn4qqeoq02k687ny7ygklfuw	cmn4qpc8i00es87ny2mkig1b3	cmn4qqd9q02gw87nycctz7zf2	2008-04-18 22:00:00	2010-04-18 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:30.651	2026-03-24 14:59:30.651	f	\N
cmn4qqepo02k987ny8qp3mde2	cmn4qpc9u00ex87nyn4157kgy	cmn4qqd9q02gw87nycctz7zf2	2020-11-20 23:00:00	2022-11-20 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:30.684	2026-03-24 14:59:30.684	f	\N
cmn4qqeqq02kc87nyf787m00o	cmn4qpcaw00f287ny2eb08rya	cmn4qqd9q02gw87nycctz7zf2	2024-06-20 22:00:00	2026-06-20 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:30.723	2026-03-24 14:59:30.723	f	\N
cmn4qqern02ke87nyw4tedle4	cmn4qpcb800f487nygnbla74w	cmn4qqd9q02gw87nycctz7zf2	2024-06-20 22:00:00	2026-06-20 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:30.755	2026-03-24 14:59:30.755	f	\N
cmn4qqesq02kh87nyzenncozh	cmn4qpcg800fs87nyvf6nvwxu	cmn4qqd9q02gw87nycctz7zf2	2020-11-20 23:00:00	2022-11-20 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:30.794	2026-03-24 14:59:30.794	f	\N
cmn4qqeto02kk87ny03f11r0n	cmn4qpcwq00hr87ny0srulaw7	cmn4qqd9q02gw87nycctz7zf2	2023-05-19 22:00:00	2025-05-19 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:30.828	2026-03-24 14:59:30.828	f	\N
cmn4qqeub02km87nyqybtj0ly	cmn4qpcx300ht87nyzbp6b5m2	cmn4qqd9q02gw87nycctz7zf2	2022-11-25 23:00:00	2024-11-25 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:30.852	2026-03-24 14:59:30.852	f	\N
cmn4qqevd02kp87nyuz50ckl9	cmn4qpd0800i687nyiyv8sa2f	cmn4qqd9q02gw87nycctz7zf2	2022-03-11 23:00:00	2024-03-11 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:30.89	2026-03-24 14:59:30.89	f	\N
cmn4qqew102ks87nyol5d234a	cmn4qpd0w00i987nypjmk45sv	cmn4qqd9q02gw87nycctz7zf2	2023-03-28 22:00:00	2025-03-28 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:30.914	2026-03-24 14:59:30.914	f	\N
cmn4qqewt02ku87nyrnf97c4h	cmn4qpd1800ib87ny46jiejzt	cmn4qqd9q02gw87nycctz7zf2	2024-10-17 22:00:00	2026-10-17 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:30.942	2026-03-24 14:59:30.942	f	\N
cmn4qqexk02kx87nychzjdwlr	cmn4qpd1w00ie87ny1vun5taq	cmn4qqd9q02gw87nycctz7zf2	2024-04-18 22:00:00	2026-04-18 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:30.969	2026-03-24 14:59:30.969	f	\N
cmn4qqeyb02l087nyp96ocmjm	cmn4qpd4s00ip87ny62o8562r	cmn4qqd9q02gw87nycctz7zf2	2021-12-17 23:00:00	2023-12-17 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:30.995	2026-03-24 14:59:30.995	f	\N
cmn4qqez402l387ny2bcg3kts	cmn4qpd5r00iu87nygb1utvl4	cmn4qqd9q02gw87nycctz7zf2	2023-09-28 22:00:00	2025-09-28 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:31.024	2026-03-24 14:59:31.024	f	\N
cmn4qqezx02l687ny1iok2els	cmn4qpdbn00jk87nyg39ezu87	cmn4qqd9q02gw87nycctz7zf2	2023-06-09 22:00:00	2025-06-09 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:31.054	2026-03-24 14:59:31.054	f	\N
cmn4qqf1302l987nyqtakmolu	cmn4qpdem00jv87nym5op8aeg	cmn4qqd9q02gw87nycctz7zf2	2020-12-31 23:00:00	2022-12-31 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:31.096	2026-03-24 14:59:31.096	f	\N
cmn4qqf2302lc87nycyfkvzox	cmn4qpdg100k087nyutuz2vts	cmn4qqd9q02gw87nycctz7zf2	2021-11-04 23:00:00	2023-11-04 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:31.131	2026-03-24 14:59:31.131	f	\N
cmn4qqf3002lf87nyeoypdefs	cmn4qpdi200k787nyqfkr8ukt	cmn4qqd9q02gw87nycctz7zf2	2023-11-30 23:00:00	2025-11-30 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:31.165	2026-03-24 14:59:31.165	f	\N
cmn4qqf3t02li87ny0dmxfp6b	cmn4qpdlv00km87ny5lhhxolu	cmn4qqd9q02gw87nycctz7zf2	2022-04-01 22:00:00	2024-04-01 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:31.193	2026-03-24 14:59:31.193	f	\N
cmn4qqf4l02lk87ny4e9nf5n7	cmn4qpdmc00ko87nyrw9vgb6g	cmn4qqd9q02gw87nycctz7zf2	2022-04-01 22:00:00	2024-04-01 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:31.221	2026-03-24 14:59:31.221	f	\N
cmn4qqf5k02lm87nym45o9qbz	cmn4qpdmn00kq87ny9kl9j7t3	cmn4qqd9q02gw87nycctz7zf2	2022-04-01 22:00:00	2024-04-01 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:31.256	2026-03-24 14:59:31.256	f	\N
cmn4qqf6h02lo87ny7asjl8ok	cmn4qpdmz00ks87ny89b7u6v0	cmn4qqd9q02gw87nycctz7zf2	2022-04-01 22:00:00	2024-04-01 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:31.29	2026-03-24 14:59:31.29	f	\N
cmn4qqf7g02lq87nyqft7vvq0	cmn4qpdnb00ku87nyfoipskpi	cmn4qqd9q02gw87nycctz7zf2	2022-04-01 22:00:00	2024-04-01 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:31.324	2026-03-24 14:59:31.324	f	\N
cmn4qqf8802ls87nyxy2oqpdh	cmn4qpdnw00kw87ny6iti2ftj	cmn4qqd9q02gw87nycctz7zf2	2022-04-01 22:00:00	2024-04-01 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:31.352	2026-03-24 14:59:31.352	f	\N
cmn4qqf9a02lv87ny81v81f0a	cmn4qpdtq00lg87nywk0y6i8m	cmn4qqd9q02gw87nycctz7zf2	2024-10-31 23:00:00	2026-10-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:31.391	2026-03-24 14:59:31.391	f	\N
cmn4qqfa802ly87nyx9ta4g0s	cmn4qpdzc00m487nyw506ksi8	cmn4qqd9q02gw87nycctz7zf2	2022-05-23 22:00:00	2024-05-23 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:31.424	2026-03-24 14:59:31.424	f	\N
cmn4qqfaw02m187nyazzpbx3x	cmn4qpe3c00ml87nyjq6ethkm	cmn4qqd9q02gw87nycctz7zf2	2022-04-01 22:00:00	2024-04-01 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:31.449	2026-03-24 14:59:31.449	f	\N
cmn4qqfbm02m487nytiv0hpzr	cmn4qpe5v00mv87nyo50kyk2g	cmn4qqd9q02gw87nycctz7zf2	2023-05-19 22:00:00	2025-05-19 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:31.475	2026-03-24 14:59:31.475	f	\N
cmn4qqfcl02m787nyilf7247r	cmn4qpegz00o787nym3b0gp60	cmn4qqd9q02gw87nycctz7zf2	2023-05-19 22:00:00	2025-05-19 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:31.51	2026-03-24 14:59:31.51	f	\N
cmn4qqfda02ma87nylox1atsb	cmn4qpekb00om87nyuaxbvyjp	cmn4qqd9q02gw87nycctz7zf2	2024-06-20 22:00:00	2026-06-20 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:31.534	2026-03-24 14:59:31.534	f	\N
cmn4qqfec02mc87ny8mxg2wzl	cmn4qpemh00oy87nyleuozoet	cmn4qqd9q02gw87nycctz7zf2	2024-06-20 22:00:00	2026-06-20 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:31.572	2026-03-24 14:59:31.572	f	\N
cmn4qqfez02me87nynqa2x1g4	cmn4qpemt00p087ny1inbzln4	cmn4qqd9q02gw87nycctz7zf2	2024-06-20 22:00:00	2026-06-20 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:31.596	2026-03-24 14:59:31.596	f	\N
cmn4qqffn02mh87ny0q3k9bub	cmn4qpep500p887nylcgd3cho	cmn4qqd9q02gw87nycctz7zf2	2024-04-18 22:00:00	2026-04-18 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:31.62	2026-03-24 14:59:31.62	f	\N
cmn4qqfgb02mk87nysr6gvfdd	cmn4qpetw00pp87nydo9psirr	cmn4qqd9q02gw87nycctz7zf2	2023-09-28 22:00:00	2025-09-28 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:31.643	2026-03-24 14:59:31.643	f	\N
cmn4qqfgz02mn87ny88ezjqu5	cmn4qpewr00q287nyk5kriswe	cmn4qqd9q02gw87nycctz7zf2	2022-10-07 22:00:00	2024-10-07 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:31.668	2026-03-24 14:59:31.668	f	\N
cmn4qqfhq02mq87nyqw4xgcdc	cmn4qpf1900qj87ny7a8omfp5	cmn4qqd9q02gw87nycctz7zf2	2025-09-23 22:00:00	2027-09-23 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:31.695	2026-03-24 14:59:31.695	f	\N
cmn4qqfid02mt87ny7hmuxtmo	cmn4qpf2q00qq87nyvca5mxa4	cmn4qqd9q02gw87nycctz7zf2	2024-06-20 22:00:00	2026-06-20 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:31.717	2026-03-24 14:59:31.717	f	\N
cmn4qqfj302mw87ny0cfu9axa	cmn4qpf3x00qv87nywpa2o9v5	cmn4qqd9q02gw87nycctz7zf2	2023-09-28 22:00:00	2025-09-28 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:31.743	2026-03-24 14:59:31.743	f	\N
cmn4qqfjq02mz87nync5toily	cmn4qpf4r00qy87nyjsnqv1el	cmn4qqd9q02gw87nycctz7zf2	2024-11-30 23:00:00	2026-11-30 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:31.767	2026-03-24 14:59:31.767	f	\N
cmn4qqfkf02n187nyv1yb69ql	cmn4qpf5800r087ny1gdw5ujf	cmn4qqd9q02gw87nycctz7zf2	2024-11-30 23:00:00	2026-11-30 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:31.791	2026-03-24 14:59:31.791	f	\N
cmn4qqfl202n387nyc1bxsmeq	cmn4qpf5p00r287ny2jltp3zr	cmn4qqd9q02gw87nycctz7zf2	2024-11-30 23:00:00	2026-11-30 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:31.815	2026-03-24 14:59:31.815	f	\N
cmn4qqflo02n587nymcjhn0xd	cmn4qpf6000r487ny72jad2rr	cmn4qqd9q02gw87nycctz7zf2	2023-12-31 23:00:00	2025-12-31 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:31.837	2026-03-24 14:59:31.837	f	\N
cmn4qqfme02n887ny7e3uec9l	cmn4qpf8c00rc87nywt6od9nv	cmn4qqd9q02gw87nycctz7zf2	2023-10-12 22:00:00	2025-10-12 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:31.863	2026-03-24 14:59:31.863	f	\N
cmn4qqfn202nb87nyk1ncbeab	cmn4qpfa800rj87nynocxj0l8	cmn4qqd9q02gw87nycctz7zf2	2024-02-15 23:00:00	2026-02-15 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:31.887	2026-03-24 14:59:31.887	f	\N
cmn4qqfo302ne87nybedlr6u5	cmn4qpfb100rm87ny5ouap3ib	cmn4qqd9q02gw87nycctz7zf2	2022-11-25 23:00:00	2024-11-25 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:31.924	2026-03-24 14:59:31.924	f	\N
cmn4qqfoy02nh87nypv63qsxj	cmn4qpfff00s887nyd79endhw	cmn4qqd9q02gw87nycctz7zf2	2024-04-18 22:00:00	2026-04-18 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:31.954	2026-03-24 14:59:31.954	f	\N
cmn4qqfpv02nk87nyx1wh0xae	cmn4qpfhf00sh87nym76o20pj	cmn4qqd9q02gw87nycctz7zf2	2024-06-20 22:00:00	2026-06-20 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:31.988	2026-03-24 14:59:31.988	f	\N
cmn4qqfqx02nn87ny6bv2ux0g	cmn4qpfiz00sm87ny1zdmolu8	cmn4qqd9q02gw87nycctz7zf2	2023-09-28 22:00:00	2025-09-28 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:32.025	2026-03-24 14:59:32.025	f	\N
cmn4qqfro02nq87ny7s6u1y13	cmn4qpfkf00st87nyonv3j9jz	cmn4qqd9q02gw87nycctz7zf2	2023-08-09 22:00:00	2025-08-09 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:32.052	2026-03-24 14:59:32.052	f	\N
cmn4qqfsf02nt87ny9e0oh6mt	cmn4qpfp200t987nyc27vqdyw	cmn4qqd9q02gw87nycctz7zf2	2024-04-18 22:00:00	2026-04-18 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:32.079	2026-03-24 14:59:32.079	f	\N
cmn4qqft702nv87nybzsmg9s0	cmn4qpfpp00tb87nywp51fk5i	cmn4qqd9q02gw87nycctz7zf2	2024-04-18 22:00:00	2026-04-18 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:32.107	2026-03-24 14:59:32.107	f	\N
cmn4qqftw02nx87nyrvoayes8	cmn4qpfqb00td87nyh61a0n9h	cmn4qqd9q02gw87nycctz7zf2	2024-04-18 22:00:00	2026-04-18 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:32.132	2026-03-24 14:59:32.132	f	\N
cmn4qqfun02o087nyo8dvo6cg	cmn4qpfs400tl87ny3nvsxozh	cmn4qqd9q02gw87nycctz7zf2	2022-05-27 22:00:00	2024-05-27 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:32.159	2026-03-24 14:59:32.159	f	\N
cmn4qqfvd02o387nyp0kiolku	cmn4qpfub00tu87nyqn1ospue	cmn4qqd9q02gw87nycctz7zf2	2022-05-27 22:00:00	2024-05-27 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:32.185	2026-03-24 14:59:32.185	f	\N
cmn4qqfw102o687nyky9f1xcj	cmn4qpfwy00u887nygmivbx9t	cmn4qqd9q02gw87nycctz7zf2	2023-10-12 22:00:00	2025-10-12 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:32.209	2026-03-24 14:59:32.209	f	\N
cmn4qqfwr02o987nyknxm1xaf	cmn4qpg2i00uy87nyusmfohr0	cmn4qqd9q02gw87nycctz7zf2	2024-09-20 22:00:00	2026-09-20 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:32.236	2026-03-24 14:59:32.236	f	\N
cmn4qqfxs02oc87nyrv8g822a	cmn4qpg5n00v987ny6qeljizt	cmn4qqd9q02gw87nycctz7zf2	2024-02-15 23:00:00	2026-02-15 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:32.272	2026-03-24 14:59:32.272	f	\N
cmn4qqfyk02of87nyz7vhwviv	cmn4qpg7b00vh87nyly8ghug9	cmn4qqd9q02gw87nycctz7zf2	2022-10-07 22:00:00	2024-10-07 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:32.3	2026-03-24 14:59:32.3	f	\N
cmn4qqfzc02oi87nyfzpw9p6y	cmn4qpgfi00wf87ny4vn87f60	cmn4qqd9q02gw87nycctz7zf2	2024-04-18 22:00:00	2026-04-18 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:32.329	2026-03-24 14:59:32.329	f	\N
cmn4qqg0k02ol87ny8jyqw92r	cmn4qpggw00wm87nyazbnequ4	cmn4qqd9q02gw87nycctz7zf2	2021-12-17 23:00:00	2023-12-17 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:32.372	2026-03-24 14:59:32.372	f	\N
cmn4qqg1r02oo87nyep1a8tx6	cmn4qpgpy00xs87ny4l0glnop	cmn4qqd9q02gw87nycctz7zf2	2024-02-15 23:00:00	2026-02-15 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:32.416	2026-03-24 14:59:32.416	f	\N
cmn4qqg2l02or87nyme0i723k	cmn4qph2e00z887ny9wc4tkd2	cmn4qqd9q02gw87nycctz7zf2	2024-04-18 22:00:00	2026-04-18 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:32.445	2026-03-24 14:59:32.445	f	\N
cmn4qqg3d02ou87nyle14rhmm	cmn4qph4o00zj87nyhoi2duoi	cmn4qqd9q02gw87nycctz7zf2	2024-02-15 23:00:00	2026-02-15 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:32.473	2026-03-24 14:59:32.473	f	\N
cmn4qqg4902ox87nydqqhlat1	cmn4qpiym017w87nyod8uuz6l	cmn4qqd9q02gw87nycctz7zf2	2024-06-20 22:00:00	2026-06-20 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:32.505	2026-03-24 14:59:32.505	f	\N
cmn4qqg5502p087nybnsangku	cmn4qpj19018787nyhv30yxam	cmn4qqd9q02gw87nycctz7zf2	2023-06-14 22:00:00	2025-06-14 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:32.538	2026-03-24 14:59:32.538	f	\N
cmn4qqg6l02p387nyez8g8fqc	cmn4qpj6e018s87nycgxtomm0	cmn4qqd9q02gw87nycctz7zf2	2023-06-04 22:00:00	2025-06-04 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:32.59	2026-03-24 14:59:32.59	f	\N
cmn4qqg7902p687ny4oax78bl	cmn4qpj8d019187ny9iuk3do1	cmn4qqd9q02gw87nycctz7zf2	2023-06-04 22:00:00	2025-06-04 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:32.614	2026-03-24 14:59:32.614	f	\N
cmn4qqg8902p987ny1vch9fa4	cmn4qpj9l019687nyslc225jg	cmn4qqd9q02gw87nycctz7zf2	2024-07-14 22:00:00	2026-07-14 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:32.649	2026-03-24 14:59:32.649	f	\N
cmn4qqg8x02pb87nyim0zlqjv	cmn4qpjaz019c87nywrqoshda	cmn4qqd9q02gw87nycctz7zf2	2024-06-20 22:00:00	2026-06-20 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:32.673	2026-03-24 14:59:32.673	f	\N
cmn4qqg9s02pd87nyzrhgxpvb	cmn4qpjdg019m87ny8oxhtz91	cmn4qqd9q02gw87nycctz7zf2	2024-06-20 22:00:00	2026-06-20 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:32.704	2026-03-24 14:59:32.704	f	\N
cmn4qqgak02pg87nyc78ryf6m	cmn4qpjjp01ad87ny4hd3mv0m	cmn4qqd9q02gw87nycctz7zf2	2024-12-31 23:00:00	2026-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:32.732	2026-03-24 14:59:32.732	f	\N
cmn4qqgbc02pj87nyi46in8va	cmn4qpjzx01c887nycr9da839	cmn4qqd9q02gw87nycctz7zf2	2023-12-31 23:00:00	2025-12-31 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:32.76	2026-03-24 14:59:32.76	f	\N
cmn4qqgce02pl87nyhczp0sll	cmn4qpk0b01ca87nyy3ba5ffy	cmn4qqd9q02gw87nycctz7zf2	2023-12-31 23:00:00	2025-12-31 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:32.798	2026-03-24 14:59:32.798	f	\N
cmn4qqgd502po87nyuvc8uhyz	cmn4qpkgs01ea87nyw2g0kizs	cmn4qqd9q02gw87nycctz7zf2	2025-01-31 23:00:00	2027-01-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:32.826	2026-03-24 14:59:32.826	f	\N
cmn4qqgdv02pq87nyc3gg3z9q	cmn4qpkkb01er87nychom7mv6	cmn4qqd9q02gw87nycctz7zf2	2024-12-31 23:00:00	2026-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:32.851	2026-03-24 14:59:32.851	f	\N
cmn4qqgeu02pt87nytrgcbn73	cmn4qpkly01ey87nyuppsc8v0	cmn4qqd9q02gw87nycctz7zf2	2022-12-31 23:00:00	2024-12-31 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:32.886	2026-03-24 14:59:32.886	f	\N
cmn4qqgfq02pv87nydwvei6sv	cmn4qpkma01f087nyg9kru7km	cmn4qqd9q02gw87nycctz7zf2	2022-12-31 23:00:00	2024-12-31 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:32.918	2026-03-24 14:59:32.918	f	\N
cmn4qqggi02py87nykxzkl7ff	cmn4qpkqc01fj87ny18twuzhg	cmn4qqd9q02gw87nycctz7zf2	2024-12-31 23:00:00	2026-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:32.946	2026-03-24 14:59:32.946	f	\N
cmn4qqgiw02q287nycqxh2gux	cmn4qpdva00ln87nyww5tnucz	cmn4qqgi502pz87ny8xgpoguj	2021-11-22 23:00:00	2023-11-22 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:33.032	2026-03-24 14:59:33.032	f	\N
cmn4qqgl702q687ny5qsjob5j	cmn4qp91l000o87ny6qn4yctp	cmn4qqgkh02q387nypgux5wod	2021-11-17 23:00:00	2026-11-17 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:33.115	2026-03-24 14:59:33.115	f	\N
cmn4qqgm102q987nyhgqit5bl	cmn4qp93m000y87ny362upgqu	cmn4qqgkh02q387nypgux5wod	2024-03-03 23:00:00	2029-03-03 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:33.146	2026-03-24 14:59:33.146	f	\N
cmn4qqgmt02qc87nycmjrwzmn	cmn4qp94o001387nyc6m1bl0s	cmn4qqgkh02q387nypgux5wod	2019-09-08 22:00:00	2024-09-08 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:33.174	2026-03-24 14:59:33.174	f	\N
cmn4qqgnq02qf87nyi9uldrds	cmn4qp95e001687ny0kfk06na	cmn4qqgkh02q387nypgux5wod	2021-06-06 22:00:00	2026-06-06 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:33.207	2026-03-24 14:59:33.207	f	\N
cmn4qqgom02qi87ny44q05ue3	cmn4qp96g001b87nyht0q510x	cmn4qqgkh02q387nypgux5wod	2025-09-08 22:00:00	2030-09-08 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:33.238	2026-03-24 14:59:33.238	f	\N
cmn4qqgpd02qk87ny1tf7vf8b	cmn4qp96u001d87nysvbqii81	cmn4qqgkh02q387nypgux5wod	2022-12-31 23:00:00	2027-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:33.266	2026-03-24 14:59:33.266	f	\N
cmn4qqgqf02qn87nyrcy8kxtq	cmn4qp98t001m87nygl6la4af	cmn4qqgkh02q387nypgux5wod	2023-12-31 23:00:00	2028-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:33.304	2026-03-24 14:59:33.304	f	\N
cmn4qqgr502qq87nyj5tjk5qe	cmn4qp99s001r87nycrddgoh5	cmn4qqgkh02q387nypgux5wod	2024-03-06 23:00:00	2029-03-06 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:33.329	2026-03-24 14:59:33.329	f	\N
cmn4qqgry02qt87ny5y66sxks	cmn4qp9en002987ny4v6bn5d2	cmn4qqgkh02q387nypgux5wod	2023-06-21 22:00:00	2028-06-21 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:33.358	2026-03-24 14:59:33.358	f	\N
cmn4qqgt102qw87nyjsn5s9lo	cmn4qp9g8002i87nyii2j6giy	cmn4qqgkh02q387nypgux5wod	2023-12-04 23:00:00	2028-12-04 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:33.397	2026-03-24 14:59:33.397	f	\N
cmn4qqgu402qz87ny7a8syehq	cmn4qp9hb002n87ny4ilytfco	cmn4qqgkh02q387nypgux5wod	2024-06-11 22:00:00	2029-06-11 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:33.437	2026-03-24 14:59:33.437	f	\N
cmn4qqguv02r287ny26cwrsv9	cmn4qp9ip002s87ny78kckxvx	cmn4qqgkh02q387nypgux5wod	2023-12-04 23:00:00	2028-12-04 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:33.463	2026-03-24 14:59:33.463	f	\N
cmn4qqgw102r587nyqbaukoqs	cmn4qp9jd002v87nyrypxotne	cmn4qqgkh02q387nypgux5wod	2024-10-03 22:00:00	2029-10-03 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:33.506	2026-03-24 14:59:33.506	f	\N
cmn4qqgwv02r887nygidtg8ck	cmn4qp9lr003587nyssmcaog0	cmn4qqgkh02q387nypgux5wod	2021-11-10 23:00:00	2026-11-10 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:33.535	2026-03-24 14:59:33.535	f	\N
cmn4qqgxx02ra87nyf9yr9y3j	cmn4qp9m2003787nyjafujqym	cmn4qqgkh02q387nypgux5wod	2021-11-10 23:00:00	2026-11-10 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:33.574	2026-03-24 14:59:33.574	f	\N
cmn4qqgyv02rc87nyfgvgi3fb	cmn4qp9ms003987nydn44fl2m	cmn4qqgkh02q387nypgux5wod	2021-11-10 23:00:00	2026-11-10 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:33.608	2026-03-24 14:59:33.608	f	\N
cmn4qqgzs02re87nyezfpfkkr	cmn4qp9n4003b87nyujvurcxf	cmn4qqgkh02q387nypgux5wod	2022-02-09 23:00:00	2027-02-09 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:33.641	2026-03-24 14:59:33.641	f	\N
cmn4qqh0j02rh87nyew12bdzp	cmn4qp9pp003o87nyhl3hizde	cmn4qqgkh02q387nypgux5wod	2023-04-19 22:00:00	2028-04-19 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:33.668	2026-03-24 14:59:33.668	f	\N
cmn4qqh1a02rk87nylh5oabqs	cmn4qp9qp003t87nykm2lm1x7	cmn4qqgkh02q387nypgux5wod	2023-02-24 23:00:00	2028-02-24 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:33.695	2026-03-24 14:59:33.695	f	\N
cmn4qqh2102rn87ny74yqt9uy	cmn4qp9t2004487ny299wr82s	cmn4qqgkh02q387nypgux5wod	2021-10-03 22:00:00	2026-10-03 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:33.721	2026-03-24 14:59:33.721	f	\N
cmn4qqh2r02rp87nyy0xcjjp8	cmn4qp9te004687nylycsdwal	cmn4qqgkh02q387nypgux5wod	2019-09-17 22:00:00	2024-09-17 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:33.748	2026-03-24 14:59:33.748	f	\N
cmn4qqh3j02rr87nyzum4xzv2	cmn4qp9ux004e87nyfq492uaw	cmn4qqgkh02q387nypgux5wod	2024-12-31 23:00:00	2029-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:33.776	2026-03-24 14:59:33.776	f	\N
cmn4qqh4e02ru87ny8s39jn70	cmn4qp9x4004o87nya68kgixf	cmn4qqgkh02q387nypgux5wod	2024-03-06 23:00:00	2029-03-06 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:33.806	2026-03-24 14:59:33.806	f	\N
cmn4qqh5702rx87ny87z7bao5	cmn4qp9zb005087nyk6g5jocp	cmn4qqgkh02q387nypgux5wod	2024-10-17 22:00:00	2029-10-17 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:33.835	2026-03-24 14:59:33.835	f	\N
cmn4qqh6302rz87nytifky10n	cmn4qp9zt005287nydzq4xhx6	cmn4qqgkh02q387nypgux5wod	2024-10-20 22:00:00	2029-10-20 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:33.868	2026-03-24 14:59:33.868	f	\N
cmn4qqh6x02s287nyq498cfxc	cmn4qpa1z005d87nyjt33954a	cmn4qqgkh02q387nypgux5wod	2022-05-29 22:00:00	2027-05-29 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:33.898	2026-03-24 14:59:33.898	f	\N
cmn4qqh7n02s587nydwb8e0ky	cmn4qpa2n005g87nyf8gz82dw	cmn4qqgkh02q387nypgux5wod	2021-12-31 23:00:00	2026-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:33.923	2026-03-24 14:59:33.923	f	\N
cmn4qqh8d02s887nyamnjxa7l	cmn4qpa5c005s87nyzz8nvx8e	cmn4qqgkh02q387nypgux5wod	2022-05-29 22:00:00	2027-05-29 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:33.95	2026-03-24 14:59:33.95	f	\N
cmn4qqh9702sb87nykhwkpczo	cmn4qpa6n005y87ny2213r4ob	cmn4qqgkh02q387nypgux5wod	2024-03-06 23:00:00	2029-03-06 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:33.979	2026-03-24 14:59:33.979	f	\N
cmn4qqhah02se87nyxkwyv1f6	cmn4qpa7m006387ny5bqlywfc	cmn4qqgkh02q387nypgux5wod	2021-11-04 23:00:00	2026-11-04 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:34.025	2026-03-24 14:59:34.025	f	\N
cmn4qqhb902sh87nyu1f1t4j8	cmn4qpa99006b87nygpb565ik	cmn4qqgkh02q387nypgux5wod	2018-12-27 23:00:00	2023-12-27 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:34.053	2026-03-24 14:59:34.053	f	\N
cmn4qqhby02sk87nynicl0jva	cmn4qpaa9006g87nylpzkqmqi	cmn4qqgkh02q387nypgux5wod	2023-04-19 22:00:00	2028-04-19 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:34.079	2026-03-24 14:59:34.079	f	\N
cmn4qqhcv02sm87nyp7du3hmq	cmn4qpab9006m87nyzwyneq2h	cmn4qqgkh02q387nypgux5wod	2024-06-26 22:00:00	2029-06-26 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:34.112	2026-03-24 14:59:34.112	f	\N
cmn4qqhdu02so87nyik1fuhtd	cmn4qpabp006o87ny47pr3aw8	cmn4qqgkh02q387nypgux5wod	2024-06-26 22:00:00	2029-06-26 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:34.146	2026-03-24 14:59:34.146	f	\N
cmn4qqheo02sr87ny96kjlnq8	cmn4qpadw006x87nyzd6h82hd	cmn4qqgkh02q387nypgux5wod	2023-09-27 22:00:00	2028-09-27 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:34.177	2026-03-24 14:59:34.177	f	\N
cmn4qqhfe02su87ny4qczwn44	cmn4qpagk007787nyc2en7buu	cmn4qqgkh02q387nypgux5wod	2023-03-13 23:00:00	2028-03-13 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:34.202	2026-03-24 14:59:34.202	f	\N
cmn4qqhg502sx87nyh822zfp4	cmn4qpaih007e87nye67o6nz1	cmn4qqgkh02q387nypgux5wod	2021-04-15 22:00:00	2026-04-15 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:34.23	2026-03-24 14:59:34.23	f	\N
cmn4qqhh702t087nyn3yznlrs	cmn4qpaju007l87nyxa5xuwqy	cmn4qqgkh02q387nypgux5wod	2024-12-03 23:00:00	2029-12-03 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:34.267	2026-03-24 14:59:34.267	f	\N
cmn4qqhhx02t387ny7vy1mh5m	cmn4qpal4007q87nyfwmssfio	cmn4qqgkh02q387nypgux5wod	2024-06-26 22:00:00	2029-06-26 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:34.293	2026-03-24 14:59:34.293	f	\N
cmn4qqhj002t687nytkhp0zwg	cmn4qpam6007v87nymqs4c757	cmn4qqgkh02q387nypgux5wod	2024-06-11 22:00:00	2029-06-11 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:34.332	2026-03-24 14:59:34.332	f	\N
cmn4qqhjs02t987nyll221dyu	cmn4qpaok008687nyhsgzl8ez	cmn4qqgkh02q387nypgux5wod	2024-10-24 22:00:00	2029-10-24 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:34.361	2026-03-24 14:59:34.361	f	\N
cmn4qqhko02tc87ny2j6nxgee	cmn4qpapi008b87ny0e4jwt11	cmn4qqgkh02q387nypgux5wod	2024-10-20 22:00:00	2029-10-20 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:34.392	2026-03-24 14:59:34.392	f	\N
cmn4qqhlq02tf87ny6k2c2eg2	cmn4qpauf009187nyr0b9usoe	cmn4qqgkh02q387nypgux5wod	2024-07-02 22:00:00	2029-07-02 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:34.43	2026-03-24 14:59:34.43	f	\N
cmn4qqhmp02ti87nykz0ta4wq	cmn4qpav3009487nycyrkhlhj	cmn4qqgkh02q387nypgux5wod	2022-07-25 22:00:00	2027-07-25 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:34.466	2026-03-24 14:59:34.466	f	\N
cmn4qqhnj02tl87nycrj8gy4f	cmn4qpayr009g87nyaismegky	cmn4qqgkh02q387nypgux5wod	2021-04-15 22:00:00	2026-04-15 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:34.495	2026-03-24 14:59:34.495	f	\N
cmn4qqhoa02to87nyexp00lr2	cmn4qpb07009n87nyicktmogk	cmn4qqgkh02q387nypgux5wod	2024-03-03 23:00:00	2029-03-03 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:34.523	2026-03-24 14:59:34.523	f	\N
cmn4qqhpn02tr87nym5fgwx7w	cmn4qpb20009t87nyle9vppgm	cmn4qqgkh02q387nypgux5wod	2023-04-19 22:00:00	2028-04-19 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:34.572	2026-03-24 14:59:34.572	f	\N
cmn4qqhqt02tu87nyrja73f5g	cmn4qpb3o00a087ny1r2qzlf6	cmn4qqgkh02q387nypgux5wod	2022-10-07 22:00:00	2027-10-07 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:34.614	2026-03-24 14:59:34.614	f	\N
cmn4qqhs102tx87nygruewhhw	cmn4qpb5500a587nysh48mhuo	cmn4qqgkh02q387nypgux5wod	2023-09-27 22:00:00	2028-09-27 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:34.657	2026-03-24 14:59:34.657	f	\N
cmn4qqht402u087ny0ivda8jw	cmn4qpb6g00ab87nyfiqqsix3	cmn4qqgkh02q387nypgux5wod	2016-11-19 23:00:00	2021-11-19 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:34.697	2026-03-24 14:59:34.697	f	\N
cmn4qqhtz02u387nyg5pkubf9	cmn4qpb7200ae87ny9tedvq9y	cmn4qqgkh02q387nypgux5wod	2021-12-05 23:00:00	2026-12-05 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:34.727	2026-03-24 14:59:34.727	f	\N
cmn4qqhun02u687ny7s7hguu5	cmn4qpb9n00ap87nysgwmmjtc	cmn4qqgkh02q387nypgux5wod	2024-03-03 23:00:00	2029-03-03 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:34.751	2026-03-24 14:59:34.751	f	\N
cmn4qqhvd02u987ny3ldkr9q1	cmn4qpbaa00as87nyr6995hxn	cmn4qqgkh02q387nypgux5wod	2021-12-05 23:00:00	2026-12-05 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:34.777	2026-03-24 14:59:34.777	f	\N
cmn4qqhw302uc87nypw7s4t8y	cmn4qpbb400av87nyi5q08hhc	cmn4qqgkh02q387nypgux5wod	2023-06-21 22:00:00	2028-06-21 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:34.803	2026-03-24 14:59:34.803	f	\N
cmn4qqhwu02uf87nyfj9bgffi	cmn4qpbdi00b487nywa43bbv7	cmn4qqgkh02q387nypgux5wod	2023-12-04 23:00:00	2028-12-04 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:34.83	2026-03-24 14:59:34.83	f	\N
cmn4qqhxk02ui87nyzpsm1ppi	cmn4qpbex00bb87ny3txbvfb6	cmn4qqgkh02q387nypgux5wod	2023-09-27 22:00:00	2028-09-27 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:34.856	2026-03-24 14:59:34.856	f	\N
cmn4qqhyc02ul87nyfw0n6rsh	cmn4qpbgb00bi87nysrr8rrzx	cmn4qqgkh02q387nypgux5wod	2021-06-06 22:00:00	2026-06-06 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:34.885	2026-03-24 14:59:34.885	f	\N
cmn4qqhza02uo87ny7zyuf0ls	cmn4qpbh500bl87nyckb6dbfz	cmn4qqgkh02q387nypgux5wod	2022-12-31 23:00:00	2027-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:34.918	2026-03-24 14:59:34.918	f	\N
cmn4qqi0202uq87ny24eyxxrm	cmn4qpbhj00bn87nyk4dil4gg	cmn4qqgkh02q387nypgux5wod	2023-10-18 22:00:00	2028-10-18 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:34.946	2026-03-24 14:59:34.946	f	\N
cmn4qqi1e02us87ny3quxnm3g	cmn4qpbin00bt87nycigylsvs	cmn4qqgkh02q387nypgux5wod	2017-10-29 23:00:00	2022-10-29 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:34.994	2026-03-24 14:59:34.994	f	\N
cmn4qqi2e02uv87nyhudis8kn	cmn4qpblj00c387ny64mbzh0o	cmn4qqgkh02q387nypgux5wod	2019-04-07 22:00:00	2024-04-07 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:35.03	2026-03-24 14:59:35.03	f	\N
cmn4qqi3c02uy87nyldf0x0g2	cmn4qpbm800c687ny1qgfmq7l	cmn4qqgkh02q387nypgux5wod	2023-07-16 22:00:00	2028-07-16 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:35.064	2026-03-24 14:59:35.064	f	\N
cmn4qqi4502v187ny9i9f6r7b	cmn4qpbo000cd87nyk1xgze4e	cmn4qqgkh02q387nypgux5wod	2022-08-01 22:00:00	2027-08-01 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:35.093	2026-03-24 14:59:35.093	f	\N
cmn4qqi4s02v487ny6s49y33o	cmn4qpbpw00ck87ny4o52k5dh	cmn4qqgkh02q387nypgux5wod	2024-12-31 23:00:00	2029-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:35.117	2026-03-24 14:59:35.117	f	\N
cmn4qqi5h02v787nyxtw2lyyx	cmn4qpbqz00cp87ny0ai7m58l	cmn4qqgkh02q387nypgux5wod	2018-05-29 22:00:00	2023-05-29 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:35.142	2026-03-24 14:59:35.142	f	\N
cmn4qqi6702va87nygrp4jdq5	cmn4qpbst00cx87nyha0bf428	cmn4qqgkh02q387nypgux5wod	2023-12-31 23:00:00	2028-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:35.168	2026-03-24 14:59:35.168	f	\N
cmn4qqi7302vd87nyaw61fiuj	cmn4qpbu300d287nyb0sirec5	cmn4qqgkh02q387nypgux5wod	2024-03-06 23:00:00	2029-03-06 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:35.199	2026-03-24 14:59:35.199	f	\N
cmn4qqi8702vf87nyqwozrhea	cmn4qpbuk00d487nymow3pr2z	cmn4qqgkh02q387nypgux5wod	2024-03-06 23:00:00	2029-03-06 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:35.239	2026-03-24 14:59:35.239	f	\N
cmn4qqi8w02vi87nyhkzlod2a	cmn4qpbxz00dn87nyd82glffq	cmn4qqgkh02q387nypgux5wod	2020-04-05 22:00:00	2025-04-05 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:35.264	2026-03-24 14:59:35.264	f	\N
cmn4qqi9r02vk87nyvwdozvld	cmn4qpbyy00dt87nyz65g48oa	cmn4qqgkh02q387nypgux5wod	2020-04-05 22:00:00	2025-04-05 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:35.295	2026-03-24 14:59:35.295	f	\N
cmn4qqias02vn87nyb1qivcj8	cmn4qpc0m00e087nyoz6t8l1p	cmn4qqgkh02q387nypgux5wod	2024-06-11 22:00:00	2029-06-11 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:35.332	2026-03-24 14:59:35.332	f	\N
cmn4qqibr02vq87ny3uvwlal8	cmn4qpc3v00ea87nynovo1ahu	cmn4qqgkh02q387nypgux5wod	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:35.367	2026-03-24 14:59:35.367	f	\N
cmn4qqicq02vt87nyrt1u7aak	cmn4qpc5t00eh87nybthfr51j	cmn4qqgkh02q387nypgux5wod	2025-02-05 23:00:00	2030-02-05 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:35.402	2026-03-24 14:59:35.402	f	\N
cmn4qqidw02vw87ny0jr0h3fv	cmn4qpc7l00eo87nyiq0lo2tp	cmn4qqgkh02q387nypgux5wod	2023-03-13 23:00:00	2028-03-13 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:35.445	2026-03-24 14:59:35.445	f	\N
cmn4qqifk02vz87nyqb73okpn	cmn4qpc9a00ev87nyn4rh77xm	cmn4qqgkh02q387nypgux5wod	2024-03-03 23:00:00	2029-03-03 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:35.504	2026-03-24 14:59:35.504	f	\N
cmn4qqigg02w187nyz4qkewmk	cmn4qpc9u00ex87nyn4157kgy	cmn4qqgkh02q387nypgux5wod	2020-11-20 23:00:00	2025-11-20 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:35.536	2026-03-24 14:59:35.536	f	\N
cmn4qqihd02w487nyneo1t231	cmn4qpcd100fc87nywevy5bwm	cmn4qqgkh02q387nypgux5wod	2019-04-07 22:00:00	2024-04-07 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:35.57	2026-03-24 14:59:35.57	f	\N
cmn4qqii502w787nyhjwykp98	cmn4qpcdp00ff87ny0ivsw28o	cmn4qqgkh02q387nypgux5wod	2022-11-20 23:00:00	2027-11-20 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:35.597	2026-03-24 14:59:35.597	f	\N
cmn4qqiix02wa87nykldbe0x8	cmn4qpcg800fs87nyvf6nvwxu	cmn4qqgkh02q387nypgux5wod	2020-11-20 23:00:00	2025-11-20 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:35.625	2026-03-24 14:59:35.625	f	\N
cmn4qqijk02wd87nyrs5fe1tf	cmn4qpcia00fz87ny1zw4btd9	cmn4qqgkh02q387nypgux5wod	2023-07-16 22:00:00	2028-07-16 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:35.648	2026-03-24 14:59:35.648	f	\N
cmn4qqika02wg87nyrq8h63pz	cmn4qpcj700g487ny99ijxonx	cmn4qqgkh02q387nypgux5wod	2021-12-05 23:00:00	2026-12-05 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:35.674	2026-03-24 14:59:35.674	f	\N
cmn4qqilc02wj87nyag2un10q	cmn4qpck800g987nyeuiptwg9	cmn4qqgkh02q387nypgux5wod	2019-09-08 22:00:00	2024-09-08 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:35.713	2026-03-24 14:59:35.713	f	\N
cmn4qqim702wm87nyx0gdt46i	cmn4qpcky00gc87nyssd881h3	cmn4qqgkh02q387nypgux5wod	2022-11-20 23:00:00	2027-11-20 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:35.743	2026-03-24 14:59:35.743	f	\N
cmn4qqinm02wp87nyf0w6f3f8	cmn4qpclx00gf87ny2ccozdwr	cmn4qqgkh02q387nypgux5wod	2021-04-15 22:00:00	2026-04-15 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:35.794	2026-03-24 14:59:35.794	f	\N
cmn4qqion02ws87nyom8fijmd	cmn4qpcnd00gm87nymq1wfmbq	cmn4qqgkh02q387nypgux5wod	2019-07-02 22:00:00	2024-07-02 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:35.831	2026-03-24 14:59:35.831	f	\N
cmn4qqipi02wv87nywovzaeiw	cmn4qpcog00gr87nyat6ydhu2	cmn4qqgkh02q387nypgux5wod	2023-12-04 23:00:00	2028-12-04 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:35.862	2026-03-24 14:59:35.862	f	\N
cmn4qqiq302wx87nynbeoelkl	cmn4qpcov00gt87nyr5xypc48	cmn4qqgkh02q387nypgux5wod	2024-03-03 23:00:00	2029-03-03 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:35.884	2026-03-24 14:59:35.884	f	\N
cmn4qqiqt02x087ny4g8zalnd	cmn4qpcqx00h287nyppkm56mz	cmn4qqgkh02q387nypgux5wod	2023-07-16 22:00:00	2028-07-16 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:35.909	2026-03-24 14:59:35.909	f	\N
cmn4qqirj02x287nygstr75up	cmn4qpcr900h487nyyz89h075	cmn4qqgkh02q387nypgux5wod	2023-07-16 22:00:00	2028-07-16 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:35.935	2026-03-24 14:59:35.935	f	\N
cmn4qqis702x587nyry7n62f6	cmn4qpcs900h787nyndmz64pv	cmn4qqgkh02q387nypgux5wod	2022-07-25 22:00:00	2027-07-25 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:35.959	2026-03-24 14:59:35.959	f	\N
cmn4qqisw02x887nyxtaatt1c	cmn4qpcv100hi87nymrxrak8l	cmn4qqgkh02q387nypgux5wod	2021-06-06 22:00:00	2026-06-06 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:35.985	2026-03-24 14:59:35.985	f	\N
cmn4qqitl02xb87ny8xffwdjr	cmn4qpcwq00hr87ny0srulaw7	cmn4qqgkh02q387nypgux5wod	2023-10-18 22:00:00	2028-10-18 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:36.009	2026-03-24 14:59:36.009	f	\N
cmn4qqiun02xe87ny7ddcvugf	cmn4qpd0800i687nyiyv8sa2f	cmn4qqgkh02q387nypgux5wod	2023-07-16 22:00:00	2028-07-16 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:36.047	2026-03-24 14:59:36.047	f	\N
cmn4qqivb02xh87nykv8678re	cmn4qpd0w00i987nypjmk45sv	cmn4qqgkh02q387nypgux5wod	2023-03-13 23:00:00	2028-03-13 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:36.071	2026-03-24 14:59:36.071	f	\N
cmn4qqiwg02xk87nylcfy9jzf	cmn4qpd1w00ie87ny1vun5taq	cmn4qqgkh02q387nypgux5wod	2023-09-27 22:00:00	2028-09-27 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:36.113	2026-03-24 14:59:36.113	f	\N
cmn4qqixc02xn87nyskklxpuz	cmn4qpd2y00ij87nylngfwy83	cmn4qqgkh02q387nypgux5wod	2019-04-07 22:00:00	2024-04-07 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:36.144	2026-03-24 14:59:36.144	f	\N
cmn4qqiy302xq87nyudrjd61v	cmn4qpd4500im87nybcvwjbfj	cmn4qqgkh02q387nypgux5wod	2023-03-13 23:00:00	2028-03-13 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:36.171	2026-03-24 14:59:36.171	f	\N
cmn4qqiyu02xt87nynvhgt06l	cmn4qpd4s00ip87ny62o8562r	cmn4qqgkh02q387nypgux5wod	2021-04-15 22:00:00	2026-04-15 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:36.198	2026-03-24 14:59:36.198	f	\N
cmn4qqizn02xw87nyhbncfb14	cmn4qpd5r00iu87nygb1utvl4	cmn4qqgkh02q387nypgux5wod	2021-04-15 22:00:00	2026-04-15 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:36.227	2026-03-24 14:59:36.227	f	\N
cmn4qqj0e02xz87nyfktti6g4	cmn4qpd8400j587nyyw0oaqgs	cmn4qqgkh02q387nypgux5wod	2024-09-30 22:00:00	2029-09-30 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:36.255	2026-03-24 14:59:36.255	f	\N
cmn4qqj1602y287nyg0igyljl	cmn4qpda700jd87nyrixgq9jx	cmn4qqgkh02q387nypgux5wod	2023-10-18 22:00:00	2028-10-18 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:36.282	2026-03-24 14:59:36.282	f	\N
cmn4qqj2702y587nyk9b5e2l8	cmn4qpdba00ji87ny22iozvdr	cmn4qqgkh02q387nypgux5wod	2023-07-16 22:00:00	2028-07-16 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:36.319	2026-03-24 14:59:36.319	f	\N
cmn4qqj3a02y887nyxrw0vxr6	cmn4qpddl00jr87nyffarh4ff	cmn4qqgkh02q387nypgux5wod	2024-09-10 22:00:00	2029-09-10 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:36.358	2026-03-24 14:59:36.358	f	\N
cmn4qqj4q02ya87nyao1okr2m	cmn4qpde400jt87ny1b73etps	cmn4qqgkh02q387nypgux5wod	2024-09-10 22:00:00	2029-09-10 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:36.41	2026-03-24 14:59:36.41	f	\N
cmn4qqj5p02yd87nyu58srk65	cmn4qpdg100k087nyutuz2vts	cmn4qqgkh02q387nypgux5wod	2019-10-01 22:00:00	2024-10-01 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:36.445	2026-03-24 14:59:36.445	f	\N
cmn4qqj6i02yg87nypy4695ck	cmn4qpdhi00k587nyua4ns2y4	cmn4qqgkh02q387nypgux5wod	2023-02-27 23:00:00	2028-02-27 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:36.474	2026-03-24 14:59:36.474	f	\N
cmn4qqj7j02yi87nythwracr4	cmn4qpdi200k787nyqfkr8ukt	cmn4qqgkh02q387nypgux5wod	2023-02-27 23:00:00	2028-02-27 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:36.512	2026-03-24 14:59:36.512	f	\N
cmn4qqj8e02yl87ny50his6t7	cmn4qpdpb00l187nyrm00emo4	cmn4qqgkh02q387nypgux5wod	2023-03-13 23:00:00	2028-03-13 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:36.543	2026-03-24 14:59:36.543	f	\N
cmn4qqj9602yo87nyrhaaqf4v	cmn4qpdr200l887nyn50l9jfc	cmn4qqgkh02q387nypgux5wod	2024-06-11 22:00:00	2029-06-11 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:36.571	2026-03-24 14:59:36.571	f	\N
cmn4qqj9x02yr87nyycumkjqy	cmn4qpdsb00lb87nyu7j8xym8	cmn4qqgkh02q387nypgux5wod	2024-06-26 22:00:00	2029-06-26 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:36.597	2026-03-24 14:59:36.597	f	\N
cmn4qqjaw02yu87ny1g4bptpm	cmn4qpdtq00lg87nywk0y6i8m	cmn4qqgkh02q387nypgux5wod	2023-07-16 22:00:00	2028-07-16 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:36.632	2026-03-24 14:59:36.632	f	\N
cmn4qqjbs02yx87nybj8sw2sd	cmn4qpdux00ll87ny54ns681i	cmn4qqgkh02q387nypgux5wod	2021-04-15 22:00:00	2026-04-15 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:36.665	2026-03-24 14:59:36.665	f	\N
cmn4qqjcj02z087nym21a6a4i	cmn4qpdw200lq87ny27zra9n1	cmn4qqgkh02q387nypgux5wod	2024-06-26 22:00:00	2029-06-26 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:36.691	2026-03-24 14:59:36.691	f	\N
cmn4qqjdr02z387nyz5xrh41j	cmn4qpdx300lv87nyma4c30sx	cmn4qqgkh02q387nypgux5wod	2021-07-18 22:00:00	2026-07-18 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:36.736	2026-03-24 14:59:36.736	f	\N
cmn4qqjei02z687ny19jy86bh	cmn4qpdzc00m487nyw506ksi8	cmn4qqgkh02q387nypgux5wod	2021-12-05 23:00:00	2026-12-05 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:36.762	2026-03-24 14:59:36.762	f	\N
cmn4qqjf802z987nyoqzekhw7	cmn4qpe0i00m987nyq7umeduw	cmn4qqgkh02q387nypgux5wod	2018-12-27 23:00:00	2023-12-27 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:36.789	2026-03-24 14:59:36.789	f	\N
cmn4qqjg102zc87ny2ceevkbc	cmn4qpe1600mc87nyt241rf36	cmn4qqgkh02q387nypgux5wod	2022-08-01 22:00:00	2027-08-01 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:36.817	2026-03-24 14:59:36.817	f	\N
cmn4qqjgw02zf87nyaq3pv7cs	cmn4qpe3c00ml87nyjq6ethkm	cmn4qqgkh02q387nypgux5wod	2021-10-13 22:00:00	2026-10-13 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:36.849	2026-03-24 14:59:36.849	f	\N
cmn4qqjhy02zi87nym00adgq2	cmn4qpe4o00mq87ny782u260n	cmn4qqgkh02q387nypgux5wod	2024-09-30 22:00:00	2029-09-30 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:36.887	2026-03-24 14:59:36.887	f	\N
cmn4qqjio02zl87nysiudi4ye	cmn4qpe5v00mv87nyo50kyk2g	cmn4qqgkh02q387nypgux5wod	2023-04-19 22:00:00	2028-04-19 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:36.912	2026-03-24 14:59:36.912	f	\N
cmn4qqjjf02zo87nycr3xupk2	cmn4qpe7s00n287nyfaxgb289	cmn4qqgkh02q387nypgux5wod	2021-12-05 23:00:00	2026-12-05 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:36.94	2026-03-24 14:59:36.94	f	\N
cmn4qqjk502zr87nywrmups5n	cmn4qpe8u00n787ny6aci9ysp	cmn4qqgkh02q387nypgux5wod	2022-05-29 22:00:00	2027-05-29 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:36.965	2026-03-24 14:59:36.965	f	\N
cmn4qqjkv02zu87nykvxocsbh	cmn4qpea700nc87nyviugn1t4	cmn4qqgkh02q387nypgux5wod	2021-04-15 22:00:00	2026-04-15 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:36.992	2026-03-24 14:59:36.992	f	\N
cmn4qqjlt02zx87ny4r8reh2p	cmn4qpebv00nj87ny7hh5o4pe	cmn4qqgkh02q387nypgux5wod	2023-10-18 22:00:00	2028-10-18 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:37.025	2026-03-24 14:59:37.025	f	\N
cmn4qqjmq030087nyc8gworxf	cmn4qped200no87nydy9bcwad	cmn4qqgkh02q387nypgux5wod	2023-10-18 22:00:00	2028-10-18 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:37.058	2026-03-24 14:59:37.058	f	\N
cmn4qqjne030387nydlg5r1fs	cmn4qpeg100o287nybtkvtd6e	cmn4qqgkh02q387nypgux5wod	2023-03-13 23:00:00	2028-03-13 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:37.082	2026-03-24 14:59:37.082	f	\N
cmn4qqjo2030687nymgk3jw3m	cmn4qpegn00o587nyp31izq2v	cmn4qqgkh02q387nypgux5wod	2023-04-19 22:00:00	2028-04-19 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:37.106	2026-03-24 14:59:37.106	f	\N
cmn4qqjor030987nyxhnpw5zw	cmn4qpej300oh87ny827lno4x	cmn4qqgkh02q387nypgux5wod	2021-06-06 22:00:00	2026-06-06 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:37.131	2026-03-24 14:59:37.131	f	\N
cmn4qqjpt030c87nyboq2rzlc	cmn4qpeju00ok87ny1ngzvx7y	cmn4qqgkh02q387nypgux5wod	2019-12-03 23:00:00	2024-12-03 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:37.17	2026-03-24 14:59:37.17	f	\N
cmn4qqjqo030f87nyquaj5gp0	cmn4qpenr00p387nyfityawy7	cmn4qqgkh02q387nypgux5wod	2019-04-07 22:00:00	2024-04-07 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:37.201	2026-03-24 14:59:37.201	f	\N
cmn4qqjrc030i87ny2oxyshe6	cmn4qpeoo00p687nyxq7vi86r	cmn4qqgkh02q387nypgux5wod	2024-12-31 23:00:00	2029-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:37.224	2026-03-24 14:59:37.224	f	\N
cmn4qqjs3030l87nydofe9ykr	cmn4qpeqt00pd87nyl3zq8zbi	cmn4qqgkh02q387nypgux5wod	2024-06-11 22:00:00	2029-06-11 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:37.251	2026-03-24 14:59:37.251	f	\N
cmn4qqjtb030o87nynqpxnvrh	cmn4qperu00pg87nymwhjig2q	cmn4qqgkh02q387nypgux5wod	2024-03-06 23:00:00	2029-03-06 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:37.295	2026-03-24 14:59:37.295	f	\N
cmn4qqju0030r87nyi0h00a0h	cmn4qpeuu00pt87nyj6eoisnt	cmn4qqgkh02q387nypgux5wod	2023-06-21 22:00:00	2028-06-21 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:37.321	2026-03-24 14:59:37.321	f	\N
cmn4qqjuu030u87ny8h0k6x8w	cmn4qpewr00q287nyk5kriswe	cmn4qqgkh02q387nypgux5wod	2021-04-15 22:00:00	2026-04-15 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:37.351	2026-03-24 14:59:37.351	f	\N
cmn4qqjvm030x87nys0clyyu3	cmn4qpezq00qc87nyubisut4t	cmn4qqgkh02q387nypgux5wod	2022-05-29 22:00:00	2027-05-29 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:37.379	2026-03-24 14:59:37.379	f	\N
cmn4qqjwm031087ny6te9og0z	cmn4qpf1900qj87ny7a8omfp5	cmn4qqgkh02q387nypgux5wod	2023-03-27 22:00:00	2028-03-27 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:37.414	2026-03-24 14:59:37.414	f	\N
cmn4qqjxc031387nybyocd7di	cmn4qpf3l00qt87ny1qvjh8xj	cmn4qqgkh02q387nypgux5wod	2023-07-16 22:00:00	2028-07-16 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:37.441	2026-03-24 14:59:37.441	f	\N
cmn4qqjy2031587nylzkipn04	cmn4qpf3x00qv87nywpa2o9v5	cmn4qqgkh02q387nypgux5wod	2023-06-21 22:00:00	2028-06-21 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:37.467	2026-03-24 14:59:37.467	f	\N
cmn4qqjz8031887ny9x05i82j	cmn4qpf5p00r287ny2jltp3zr	cmn4qqgkh02q387nypgux5wod	2024-09-30 22:00:00	2029-09-30 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:37.508	2026-03-24 14:59:37.508	f	\N
cmn4qqk0c031b87ny4th1qq13	cmn4qpf7100r787nycnx79usl	cmn4qqgkh02q387nypgux5wod	2024-03-03 23:00:00	2029-03-03 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:37.548	2026-03-24 14:59:37.548	f	\N
cmn4qqk1e031e87nykm1b64o2	cmn4qpf8c00rc87nywt6od9nv	cmn4qqgkh02q387nypgux5wod	2023-06-21 22:00:00	2028-06-21 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:37.587	2026-03-24 14:59:37.587	f	\N
cmn4qqk2m031h87nyzpj3gsa7	cmn4qpfb100rm87ny5ouap3ib	cmn4qqgkh02q387nypgux5wod	2019-12-03 23:00:00	2024-12-03 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:37.63	2026-03-24 14:59:37.63	f	\N
cmn4qqk3e031k87nyxbcrm5g3	cmn4qpfce00rt87nyahun5zrx	cmn4qqgkh02q387nypgux5wod	2024-02-20 23:00:00	2029-02-20 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:37.658	2026-03-24 14:59:37.658	f	\N
cmn4qqk47031n87nypfuz3ggr	cmn4qpfde00ry87ny6c8bu6b6	cmn4qqgkh02q387nypgux5wod	2022-05-31 22:00:00	2027-05-31 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:37.687	2026-03-24 14:59:37.687	f	\N
cmn4qqk4x031q87ny3iqerpjh	cmn4qpfec00s387nyrnpt3i40	cmn4qqgkh02q387nypgux5wod	2024-06-26 22:00:00	2029-06-26 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:37.713	2026-03-24 14:59:37.713	f	\N
cmn4qqk5n031s87ny1wnww9pg	cmn4qpfeq00s587ny2som67vu	cmn4qqgkh02q387nypgux5wod	2024-06-26 22:00:00	2029-06-26 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:37.739	2026-03-24 14:59:37.739	f	\N
cmn4qqk6e031v87ny0qlqxgt8	cmn4qpfff00s887nyd79endhw	cmn4qqgkh02q387nypgux5wod	2023-09-27 22:00:00	2028-09-27 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:37.766	2026-03-24 14:59:37.766	f	\N
cmn4qqk74031y87nyhbna905e	cmn4qpfhq00sj87nydsi90qnu	cmn4qqgkh02q387nypgux5wod	2022-07-25 22:00:00	2027-07-25 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:37.792	2026-03-24 14:59:37.792	f	\N
cmn4qqk80032187nyl2vo0tky	cmn4qpfje00so87nyyknh12s9	cmn4qqgkh02q387nypgux5wod	2023-12-04 23:00:00	2028-12-04 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:37.824	2026-03-24 14:59:37.824	f	\N
cmn4qqk8t032487nyxtelv9y2	cmn4qpfkf00st87nyonv3j9jz	cmn4qqgkh02q387nypgux5wod	2023-04-19 22:00:00	2028-04-19 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:37.853	2026-03-24 14:59:37.853	f	\N
cmn4qqk9j032787ny2w7mk1go	cmn4qpfng00t487ny0969j3o2	cmn4qqgkh02q387nypgux5wod	2021-10-03 22:00:00	2026-10-03 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:37.88	2026-03-24 14:59:37.88	f	\N
cmn4qqkab032a87ny4sm1vdvr	cmn4qpfr300tg87nyectldh5f	cmn4qqgkh02q387nypgux5wod	2022-04-28 22:00:00	2027-04-28 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:37.907	2026-03-24 14:59:37.907	f	\N
cmn4qqkb3032d87nywc166xm9	cmn4qpfsh00tn87nyifoslt5i	cmn4qqgkh02q387nypgux5wod	2019-11-10 23:00:00	2024-11-10 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:37.935	2026-03-24 14:59:37.935	f	\N
cmn4qqkc4032g87nyo9x1wk51	cmn4qpfub00tu87nyqn1ospue	cmn4qqgkh02q387nypgux5wod	2023-06-21 22:00:00	2028-06-21 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:37.972	2026-03-24 14:59:37.972	f	\N
cmn4qqkd4032j87nyxujwuw0g	cmn4qpfxw00ud87nyi50hitov	cmn4qqgkh02q387nypgux5wod	2022-07-25 22:00:00	2027-07-25 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:38.008	2026-03-24 14:59:38.008	f	\N
cmn4qqkdz032m87nyndjrs0ks	cmn4qpfza00ui87nyn3jbs2uh	cmn4qqgkh02q387nypgux5wod	2023-09-27 22:00:00	2028-09-27 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:38.039	2026-03-24 14:59:38.039	f	\N
cmn4qqket032p87nywa9h4plb	cmn4qpg0800un87nyz49fmt8c	cmn4qqgkh02q387nypgux5wod	2023-09-27 22:00:00	2028-09-27 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:38.069	2026-03-24 14:59:38.069	f	\N
cmn4qqkfn032s87nydxu4ewfj	cmn4qpg1900us87ny90zslxsa	cmn4qqgkh02q387nypgux5wod	2022-05-29 22:00:00	2027-05-29 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:38.099	2026-03-24 14:59:38.099	f	\N
cmn4qqkgf032v87nyzn6rmzqx	cmn4qpg1v00uv87nycm5pfuxq	cmn4qqgkh02q387nypgux5wod	2022-05-31 22:00:00	2027-05-31 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:38.127	2026-03-24 14:59:38.127	f	\N
cmn4qqkh6032y87ny89v3n9vg	cmn4qpg4g00v487nylbg1fo90	cmn4qqgkh02q387nypgux5wod	2023-03-13 23:00:00	2028-03-13 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:38.155	2026-03-24 14:59:38.155	f	\N
cmn4qqkhw033187nyloc59rhd	cmn4qpg5n00v987ny6qeljizt	cmn4qqgkh02q387nypgux5wod	2023-03-13 23:00:00	2028-03-13 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:38.18	2026-03-24 14:59:38.18	f	\N
cmn4qqkio033487nyok7lww8u	cmn4qpg6m00ve87ny27czy5ly	cmn4qqgkh02q387nypgux5wod	2021-10-03 22:00:00	2026-10-03 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:38.208	2026-03-24 14:59:38.208	f	\N
cmn4qqkjm033787ny38h36ic0	cmn4qpg7b00vh87nyly8ghug9	cmn4qqgkh02q387nypgux5wod	2022-05-29 22:00:00	2027-05-29 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:38.243	2026-03-24 14:59:38.243	f	\N
cmn4qqkkc033a87ny6f5d8yxt	cmn4qpg8000vk87ny99uxxhcf	cmn4qqgkh02q387nypgux5wod	2020-11-26 23:00:00	2025-11-26 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:38.269	2026-03-24 14:59:38.269	f	\N
cmn4qqkl2033d87ny6pv89evx	cmn4qpg9g00vp87ny5ud9fs2s	cmn4qqgkh02q387nypgux5wod	2020-11-26 23:00:00	2025-11-26 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:38.295	2026-03-24 14:59:38.295	f	\N
cmn4qqklt033g87nypyxv0pwt	cmn4qpgaf00vs87nyn803q2fg	cmn4qqgkh02q387nypgux5wod	2023-09-27 22:00:00	2028-09-27 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:38.322	2026-03-24 14:59:38.322	f	\N
cmn4qqkmi033j87nysqp6zy6y	cmn4qpgbh00vx87nyb414gqiu	cmn4qqgkh02q387nypgux5wod	2024-12-03 23:00:00	2029-12-03 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:38.347	2026-03-24 14:59:38.347	f	\N
cmn4qqkn9033m87nyyplcfz48	cmn4qpgc900w087ny6vbm6gk7	cmn4qqgkh02q387nypgux5wod	2024-06-11 22:00:00	2029-06-11 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:38.373	2026-03-24 14:59:38.373	f	\N
cmn4qqkof033p87nymsxyhpqr	cmn4qpgcz00w387nyouehuhhz	cmn4qqgkh02q387nypgux5wod	2024-03-06 23:00:00	2029-03-06 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:38.415	2026-03-24 14:59:38.415	f	\N
cmn4qqkpd033s87ny6hys7sta	cmn4qpgdq00w687nyr0txrfu4	cmn4qqgkh02q387nypgux5wod	2024-03-06 23:00:00	2029-03-06 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:38.45	2026-03-24 14:59:38.45	f	\N
cmn4qqkq0033v87nycfi43zxd	cmn4qpgeb00w987ny0c2d80y7	cmn4qqgkh02q387nypgux5wod	2024-03-03 23:00:00	2029-03-03 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:38.472	2026-03-24 14:59:38.472	f	\N
cmn4qqkqs033x87nyolyubk9w	cmn4qpgfv00wh87nysdv6yqwz	cmn4qqgkh02q387nypgux5wod	2024-03-27 23:00:00	2029-03-27 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:38.5	2026-03-24 14:59:38.5	f	\N
cmn4qqkrq034087nyevf7riba	cmn4qpggw00wm87nyazbnequ4	cmn4qqgkh02q387nypgux5wod	2021-12-05 23:00:00	2026-12-05 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:38.534	2026-03-24 14:59:38.534	f	\N
cmn4qqkt5034387nyk1nu4psw	cmn4qpgi800wr87ny5zjv4qya	cmn4qqgkh02q387nypgux5wod	2023-12-04 23:00:00	2028-12-04 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:38.586	2026-03-24 14:59:38.586	f	\N
cmn4qqku2034687nyb1cpr8sq	cmn4qpgjf00wx87ny2s3gqfik	cmn4qqgkh02q387nypgux5wod	2024-06-26 22:00:00	2029-06-26 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:38.618	2026-03-24 14:59:38.618	f	\N
cmn4qqkv7034887ny5wpu41qc	cmn4qpgjq00wz87ny2l6ygh2b	cmn4qqgkh02q387nypgux5wod	2024-06-26 22:00:00	2029-06-26 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:38.659	2026-03-24 14:59:38.659	f	\N
cmn4qqkwb034a87nyj6aok32h	cmn4qpgkf00x387nyg8zpf0xz	cmn4qqgkh02q387nypgux5wod	2024-06-26 22:00:00	2029-06-26 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:38.699	2026-03-24 14:59:38.699	f	\N
cmn4qqkxo034d87nyqbkd1xzd	cmn4qpgl500x687nyxvt6urna	cmn4qqgkh02q387nypgux5wod	2023-07-16 22:00:00	2028-07-16 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:38.748	2026-03-24 14:59:38.748	f	\N
cmn4qqkym034f87ny3krmbjrx	cmn4qpglh00x887nyzpkrlibg	cmn4qqgkh02q387nypgux5wod	2021-02-07 23:00:00	2026-02-07 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:38.783	2026-03-24 14:59:38.783	f	\N
cmn4qqkzh034i87nyh6h8eb20	cmn4qpgoa00xl87nysbbpeffw	cmn4qqgkh02q387nypgux5wod	2024-06-11 22:00:00	2029-06-11 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:38.814	2026-03-24 14:59:38.814	f	\N
cmn4qqkzz034l87nyut11yxws	cmn4qpgr300xv87ny6fa2us7x	cmn4qqgkh02q387nypgux5wod	2019-07-02 22:00:00	2024-07-02 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:38.832	2026-03-24 14:59:38.832	f	\N
cmn4qql0w034o87ny4urmhsod	cmn4qpgsu00y287nymvo10ht6	cmn4qqgkh02q387nypgux5wod	2023-04-19 22:00:00	2028-04-19 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:38.864	2026-03-24 14:59:38.864	f	\N
cmn4qql1l034r87nyc3svilqu	cmn4qpgts00y787ny8asbd8lx	cmn4qqgkh02q387nypgux5wod	2023-04-19 22:00:00	2028-04-19 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:38.889	2026-03-24 14:59:38.889	f	\N
cmn4qql2t034u87ny6n3g4v97	cmn4qpgus00ya87ny1bnzc9i2	cmn4qqgkh02q387nypgux5wod	2023-04-19 22:00:00	2028-04-19 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:38.933	2026-03-24 14:59:38.933	f	\N
cmn4qql3w034x87nysqlh6iua	cmn4qpgw500yf87nygwwz2528	cmn4qqgkh02q387nypgux5wod	2023-04-19 22:00:00	2028-04-19 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:38.973	2026-03-24 14:59:38.973	f	\N
cmn4qql4r035087nyjgfzz84x	cmn4qpgx800yk87ny3ba9vkws	cmn4qqgkh02q387nypgux5wod	2022-05-31 22:00:00	2027-05-31 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:39.003	2026-03-24 14:59:39.003	f	\N
cmn4qql5r035387nygfazlpb2	cmn4qpgyp00yr87nynzynsvay	cmn4qqgkh02q387nypgux5wod	2022-07-25 22:00:00	2027-07-25 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:39.039	2026-03-24 14:59:39.039	f	\N
cmn4qql6l035687nypt4zg2yg	cmn4qph0200yw87nya3oztecf	cmn4qqgkh02q387nypgux5wod	2022-05-29 22:00:00	2027-05-29 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:39.069	2026-03-24 14:59:39.069	f	\N
cmn4qql7j035987nyo2eeovew	cmn4qph0e00yy87nyjntjfgn4	cmn4qqgkh02q387nypgux5wod	2022-05-29 22:00:00	2027-05-29 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:39.104	2026-03-24 14:59:39.104	f	\N
cmn4qql8c035c87ny82thvkfg	cmn4qph1000z187ny3hdbh0ue	cmn4qqgkh02q387nypgux5wod	2020-04-05 22:00:00	2025-04-05 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:39.132	2026-03-24 14:59:39.132	f	\N
cmn4qql93035f87nycs6rqrsz	cmn4qph2e00z887ny9wc4tkd2	cmn4qqgkh02q387nypgux5wod	2024-03-03 23:00:00	2029-03-03 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:39.159	2026-03-24 14:59:39.159	f	\N
cmn4qql9t035i87nyvimy39oq	cmn4qph3d00zd87nyjl8ywb59	cmn4qqgkh02q387nypgux5wod	2024-06-11 22:00:00	2029-06-11 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:39.186	2026-03-24 14:59:39.186	f	\N
cmn4qqlat035l87nynno4igcb	cmn4qph4000zg87nykjfya0sk	cmn4qqgkh02q387nypgux5wod	2024-10-20 22:00:00	2029-10-20 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:39.222	2026-03-24 14:59:39.222	f	\N
cmn4qqlbo035o87nyb6phi1ka	cmn4qph4o00zj87nyhoi2duoi	cmn4qqgkh02q387nypgux5wod	2021-07-18 22:00:00	2026-07-18 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:39.252	2026-03-24 14:59:39.252	f	\N
cmn4qqlce035q87nyaa2qik66	cmn4qph4z00zl87nyy8e5onpc	cmn4qqgkh02q387nypgux5wod	2023-07-16 22:00:00	2028-07-16 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:39.279	2026-03-24 14:59:39.279	f	\N
cmn4qqld3035t87ny08n7tns3	cmn4qph6800zs87ny74rfijyi	cmn4qqgkh02q387nypgux5wod	2024-03-06 23:00:00	2029-03-06 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:39.304	2026-03-24 14:59:39.304	f	\N
cmn4qqldw035v87nyjxmanevc	cmn4qph6w00zw87nynytnulld	cmn4qqgkh02q387nypgux5wod	2020-04-05 22:00:00	2025-04-05 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:39.333	2026-03-24 14:59:39.333	f	\N
cmn4qqles035y87nyeixyv2ej	cmn4qphbx010k87nyut3jq4u3	cmn4qqgkh02q387nypgux5wod	2021-06-06 22:00:00	2026-06-06 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:39.364	2026-03-24 14:59:39.364	f	\N
cmn4qqlfj036187nycxzoiq4s	cmn4qphd8010p87nyf9i2f52y	cmn4qqgkh02q387nypgux5wod	2022-07-25 22:00:00	2027-07-25 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:39.391	2026-03-24 14:59:39.391	f	\N
cmn4qqlga036487ny5eslfb3t	cmn4qphg5011087nyits9yhno	cmn4qqgkh02q387nypgux5wod	2022-05-29 22:00:00	2027-05-29 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:39.418	2026-03-24 14:59:39.418	f	\N
cmn4qqlh4036787ny1tte6qww	cmn4qphns012087nyqrupqtbl	cmn4qqgkh02q387nypgux5wod	2024-06-11 22:00:00	2029-06-11 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:39.448	2026-03-24 14:59:39.448	f	\N
cmn4qqlhv036a87nygoo1ing1	cmn4qphph012987nydmmzao7z	cmn4qqgkh02q387nypgux5wod	2022-11-20 23:00:00	2027-11-20 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:39.475	2026-03-24 14:59:39.475	f	\N
cmn4qqlil036d87nyi364wlec	cmn4qphr3012i87ny8lomkjrt	cmn4qqgkh02q387nypgux5wod	2020-11-26 23:00:00	2025-11-26 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:39.502	2026-03-24 14:59:39.502	f	\N
cmn4qqljh036g87nyetdibksp	cmn4qphw0013487nynokad4p1	cmn4qqgkh02q387nypgux5wod	2021-07-18 22:00:00	2026-07-18 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:39.534	2026-03-24 14:59:39.534	f	\N
cmn4qqlkl036i87nyf0z6zned	cmn4qphwa013687nynhrwgjcw	cmn4qqgkh02q387nypgux5wod	2021-07-18 22:00:00	2026-07-18 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:39.573	2026-03-24 14:59:39.573	f	\N
cmn4qqlli036l87nyye791ems	cmn4qpi0q013m87nyu58s2taa	cmn4qqgkh02q387nypgux5wod	2021-10-03 22:00:00	2026-10-03 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:39.606	2026-03-24 14:59:39.606	f	\N
cmn4qqlmh036o87ny4oystfxu	cmn4qpi2n013w87nyfo4hhp2g	cmn4qqgkh02q387nypgux5wod	2024-03-03 23:00:00	2029-03-03 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:39.642	2026-03-24 14:59:39.642	f	\N
cmn4qqln7036r87nytaal7xqj	cmn4qpi65014c87nykxl22uki	cmn4qqgkh02q387nypgux5wod	2022-08-01 22:00:00	2027-08-01 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:39.668	2026-03-24 14:59:39.668	f	\N
cmn4qqlo1036u87ny0ma2buwt	cmn4qpi9e014s87nylx9jwzgz	cmn4qqgkh02q387nypgux5wod	2023-12-04 23:00:00	2028-12-04 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:39.697	2026-03-24 14:59:39.697	f	\N
cmn4qqlor036w87ny3ovacp63	cmn4qpib1014y87nyx6j6uvxv	cmn4qqgkh02q387nypgux5wod	2021-06-06 22:00:00	2026-06-06 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:39.723	2026-03-24 14:59:39.723	f	\N
cmn4qqlph036z87ny9xld740e	cmn4qpium017h87nyi8vf4z3f	cmn4qqgkh02q387nypgux5wod	2022-06-30 22:00:00	2027-06-30 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:39.749	2026-03-24 14:59:39.749	f	\N
cmn4qqlq5037287nyaztq2eld	cmn4qpiym017w87nyod8uuz6l	cmn4qqgkh02q387nypgux5wod	2024-05-31 22:00:00	2029-05-31 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:39.773	2026-03-24 14:59:39.773	f	\N
cmn4qqlqr037587nybr2hw639	cmn4qpj1n018987ny9oxada7r	cmn4qqgkh02q387nypgux5wod	2021-12-05 23:00:00	2026-12-05 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:39.795	2026-03-24 14:59:39.795	f	\N
cmn4qqlrf037787ny8us2up4y	cmn4qpj1z018b87ny36u774d7	cmn4qqgkh02q387nypgux5wod	2021-12-05 23:00:00	2026-12-05 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:39.819	2026-03-24 14:59:39.819	f	\N
cmn4qqls9037a87nyqudmnvl1	cmn4qpj6e018s87nycgxtomm0	cmn4qqgkh02q387nypgux5wod	2021-06-06 22:00:00	2026-06-06 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:39.849	2026-03-24 14:59:39.849	f	\N
cmn4qqlsz037d87nyhap2il3u	cmn4qpj7o018x87ny5tgxk4sc	cmn4qqgkh02q387nypgux5wod	2023-09-27 22:00:00	2028-09-27 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:39.875	2026-03-24 14:59:39.875	f	\N
cmn4qqlto037f87nyaw5x11hg	cmn4qpj8d019187ny9iuk3do1	cmn4qqgkh02q387nypgux5wod	2021-06-06 22:00:00	2026-06-06 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:39.9	2026-03-24 14:59:39.9	f	\N
cmn4qqluo037i87nyss0llo06	cmn4qpjaz019c87nywrqoshda	cmn4qqgkh02q387nypgux5wod	2024-06-11 22:00:00	2029-06-11 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:39.936	2026-03-24 14:59:39.936	f	\N
cmn4qqlvt037k87ny9asw4sqh	cmn4qpjdg019m87ny8oxhtz91	cmn4qqgkh02q387nypgux5wod	2023-09-27 22:00:00	2028-09-27 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:39.977	2026-03-24 14:59:39.977	f	\N
cmn4qqlwz037m87nyh3qerwvy	cmn4qpjhh01a487nyeu90yni9	cmn4qqgkh02q387nypgux5wod	2024-05-31 22:00:00	2029-05-31 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:40.019	2026-03-24 14:59:40.019	f	\N
cmn4qqlxr037p87nyk3vq40d5	cmn4qpjjc01ab87nyc1djrr0z	cmn4qqgkh02q387nypgux5wod	2025-04-30 22:00:00	2030-04-30 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:40.048	2026-03-24 14:59:40.048	f	\N
cmn4qqlys037s87ny4jn18yf0	cmn4qqctu02g687nyw8tadn45	cmn4qqgkh02q387nypgux5wod	2024-12-31 23:00:00	2029-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:40.084	2026-03-24 14:59:40.084	f	\N
cmn4qqlzn037v87ny24ketqui	cmn4qpk4301cq87nyximxgysu	cmn4qqgkh02q387nypgux5wod	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:40.115	2026-03-24 14:59:40.115	f	\N
cmn4qqm0a037y87nyvk6quxlr	cmn4qpk8t01db87nyxhxmh3lb	cmn4qqgkh02q387nypgux5wod	2024-12-31 23:00:00	2029-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:40.138	2026-03-24 14:59:40.138	f	\N
cmn4qqm17038187ny3bpcyghu	cmn4qpkan01dk87nyd4b8lcbc	cmn4qqgkh02q387nypgux5wod	2024-12-31 23:00:00	2029-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:40.172	2026-03-24 14:59:40.172	f	\N
cmn4qqm1u038487ny6hdino8x	cmn4qpkgs01ea87nyw2g0kizs	cmn4qqgkh02q387nypgux5wod	2024-12-31 23:00:00	2029-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:40.195	2026-03-24 14:59:40.195	f	\N
cmn4qqm2j038787ny84hkmmtk	cmn4qpkij01ej87nyd4eki0qt	cmn4qqgkh02q387nypgux5wod	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:40.219	2026-03-24 14:59:40.219	f	\N
cmn4qqm38038a87nym56j7b6m	cmn4qpkj301el87nyd7kf2882	cmn4qqgkh02q387nypgux5wod	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:40.244	2026-03-24 14:59:40.244	f	\N
cmn4qqm3v038d87nyx4sv4lrt	cmn4qpkma01f087nyg9kru7km	cmn4qqgkh02q387nypgux5wod	2023-12-31 23:00:00	2028-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:40.267	2026-03-24 14:59:40.267	f	\N
cmn4qqm4l038g87nya8g7couk	cmn4qpkqc01fj87ny18twuzhg	cmn4qqgkh02q387nypgux5wod	2024-12-31 23:00:00	2029-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:40.293	2026-03-24 14:59:40.293	f	\N
cmn4qqm59038j87nyepo3kosz	cmn4qpktz01g287nyp18a03of	cmn4qqgkh02q387nypgux5wod	2024-12-31 23:00:00	2029-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:40.317	2026-03-24 14:59:40.317	f	\N
cmn4qqm7s038n87nynsr1dt5x	cmn4qphuj012z87nyeif1zot9	cmn4qqm6t038k87nylzfz3s1c	2022-11-09 23:00:00	2027-11-09 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:40.409	2026-03-24 14:59:40.409	f	\N
cmn4qqm8l038q87nyywoxqmm4	cmn4qphya013d87ny38haleqy	cmn4qqm6t038k87nylzfz3s1c	2022-03-20 23:00:00	2027-03-20 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:40.437	2026-03-24 14:59:40.437	f	\N
cmn4qqm9a038t87nyrawdfgpd	cmn4qpi1z013t87nyltsagjl8	cmn4qqm6t038k87nylzfz3s1c	2024-06-20 22:00:00	2029-06-20 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:40.462	2026-03-24 14:59:40.462	f	\N
cmn4qqm9y038w87nydahn32ux	cmn4qpi3m014187ny1jij05j0	cmn4qqm6t038k87nylzfz3s1c	2024-03-06 23:00:00	2029-03-06 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:40.487	2026-03-24 14:59:40.487	f	\N
cmn4qqmam038y87nyxwox5l20	cmn4qpi3z014387nycq5wnf2r	cmn4qqm6t038k87nylzfz3s1c	2024-03-06 23:00:00	2029-03-06 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:40.51	2026-03-24 14:59:40.51	f	\N
cmn4qqmba039187nyg18w856r	cmn4qpk2g01cj87ny43ei7inc	cmn4qqm6t038k87nylzfz3s1c	2022-12-31 23:00:00	2027-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 14:59:40.534	2026-03-24 14:59:40.534	f	\N
cmn4qrip0039587nyugwka2wj	cmn4qp93m000y87ny362upgqu	cmn4qrio0039287nykv6spwnb	2022-03-07 23:00:00	2025-03-07 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:22.501	2026-03-24 15:00:22.501	f	\N
cmn4qripy039887nynr5rt56k	cmn4qp99s001r87nycrddgoh5	cmn4qrio0039287nykv6spwnb	2021-11-02 23:00:00	2024-11-02 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:22.534	2026-03-24 15:00:22.534	f	\N
cmn4qriqw039b87nyxagohsac	cmn4qp9ok003j87nyx8yygl20	cmn4qrio0039287nykv6spwnb	2019-01-17 23:00:00	2022-01-17 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:22.568	2026-03-24 15:00:22.568	f	\N
cmn4qrirm039e87ny5ggdnktw	cmn4qp9t2004487ny299wr82s	cmn4qrio0039287nykv6spwnb	2021-10-17 22:00:00	2024-10-17 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:22.594	2026-03-24 15:00:22.594	f	\N
cmn4qrisg039h87nyd8bhn74p	cmn4qp9zb005087nyk6g5jocp	cmn4qrio0039287nykv6spwnb	2021-10-17 22:00:00	2024-10-17 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:22.624	2026-03-24 15:00:22.624	f	\N
cmn4qrit9039k87nyd9jd7977	cmn4qpa5c005s87nyzz8nvx8e	cmn4qrio0039287nykv6spwnb	2022-04-14 22:00:00	2025-04-14 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:22.653	2026-03-24 15:00:22.653	f	\N
cmn4qriu7039n87nylf00e1oo	cmn4qpaax006k87nymzo903ui	cmn4qrio0039287nykv6spwnb	2023-06-27 22:00:00	2026-06-27 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:22.687	2026-03-24 15:00:22.687	f	\N
cmn4qriv4039q87nyzhemw9nm	cmn4qpam6007v87nymqs4c757	cmn4qrio0039287nykv6spwnb	2024-07-08 22:00:00	2027-07-08 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:22.72	2026-03-24 15:00:22.72	f	\N
cmn4qrivv039t87nyr2vdm77u	cmn4qpanv008387nyx4cm98mw	cmn4qrio0039287nykv6spwnb	2024-07-08 22:00:00	2027-07-08 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:22.747	2026-03-24 15:00:22.747	f	\N
cmn4qriwm039w87nyo4b4xceu	cmn4qpayr009g87nyaismegky	cmn4qrio0039287nykv6spwnb	2019-04-08 22:00:00	2022-04-08 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:22.775	2026-03-24 15:00:22.775	f	\N
cmn4qrixe039z87nyn0ou15wb	cmn4qpb20009t87nyle9vppgm	cmn4qrio0039287nykv6spwnb	2023-03-14 23:00:00	2026-03-14 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:22.802	2026-03-24 15:00:22.802	f	\N
cmn4qriy403a287nyizrffqxw	cmn4qpbin00bt87nycigylsvs	cmn4qrio0039287nykv6spwnb	2015-12-31 23:00:00	2018-12-31 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:22.829	2026-03-24 15:00:22.829	f	\N
cmn4qriyy03a587ny65payd6t	cmn4qpc7l00eo87nyiq0lo2tp	cmn4qrio0039287nykv6spwnb	2024-03-07 23:00:00	2027-03-07 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:22.858	2026-03-24 15:00:22.858	f	\N
cmn4qrizp03a887nya687odvu	cmn4qpcj700g487ny99ijxonx	cmn4qrio0039287nykv6spwnb	2022-01-10 23:00:00	2025-01-10 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:22.886	2026-03-24 15:00:22.886	f	\N
cmn4qrj0q03ab87nyz2olo17l	cmn4qpcky00gc87nyssd881h3	cmn4qrio0039287nykv6spwnb	2023-03-07 23:00:00	2026-03-07 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:22.922	2026-03-24 15:00:22.922	f	\N
cmn4qrj1h03ae87nyutnsf1sr	cmn4qpclx00gf87ny2ccozdwr	cmn4qrio0039287nykv6spwnb	2021-04-08 22:00:00	2024-04-08 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:22.949	2026-03-24 15:00:22.949	f	\N
cmn4qrj2e03ah87ny4pvccstg	cmn4qpcnd00gm87nymq1wfmbq	cmn4qrio0039287nykv6spwnb	2019-12-03 23:00:00	2022-12-03 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:22.982	2026-03-24 15:00:22.982	f	\N
cmn4qrj3j03ak87ny8gkuf9zb	cmn4qpcog00gr87nyat6ydhu2	cmn4qrio0039287nykv6spwnb	2023-11-02 23:00:00	2026-11-02 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:23.023	2026-03-24 15:00:23.023	f	\N
cmn4qrj4e03an87ny2x8heb6s	cmn4qpcs900h787nyndmz64pv	cmn4qrio0039287nykv6spwnb	2020-04-14 22:00:00	2023-04-14 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:23.054	2026-03-24 15:00:23.054	f	\N
cmn4qrj5703ap87nyte9foxj0	cmn4qpcst00h987nypz669eoj	cmn4qrio0039287nykv6spwnb	2022-04-10 22:00:00	2025-04-10 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:23.083	2026-03-24 15:00:23.083	f	\N
cmn4qrj5x03ar87nyawggakxw	cmn4qpcta00hb87nyi0q15gqn	cmn4qrio0039287nykv6spwnb	2022-04-10 22:00:00	2025-04-10 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:23.109	2026-03-24 15:00:23.109	f	\N
cmn4qrj7303au87ny5g1f3pdp	cmn4qpcv100hi87nymrxrak8l	cmn4qrio0039287nykv6spwnb	2021-07-07 22:00:00	2024-07-07 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:23.152	2026-03-24 15:00:23.152	f	\N
cmn4qrj8403ax87nyr6oqcc3k	cmn4qpd0800i687nyiyv8sa2f	cmn4qrio0039287nykv6spwnb	2020-11-17 23:00:00	2023-11-17 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:23.188	2026-03-24 15:00:23.188	f	\N
cmn4qrj9203b087nyyzi21zup	cmn4qpd2y00ij87nylngfwy83	cmn4qrio0039287nykv6spwnb	2023-02-28 23:00:00	2026-02-28 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:23.222	2026-03-24 15:00:23.222	f	\N
cmn4qrj9v03b387nysd8se4bq	cmn4qpd4500im87nybcvwjbfj	cmn4qrio0039287nykv6spwnb	2023-03-07 23:00:00	2026-03-07 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:23.251	2026-03-24 15:00:23.251	f	\N
cmn4qrjat03b687nyhb0dikrj	cmn4qpd5r00iu87nygb1utvl4	cmn4qrio0039287nykv6spwnb	2024-07-14 22:00:00	2027-07-14 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:23.285	2026-03-24 15:00:23.285	f	\N
cmn4qrjbo03b987ny7k4ka9nf	cmn4qpdux00ll87ny54ns681i	cmn4qrio0039287nykv6spwnb	2021-04-08 22:00:00	2024-04-08 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:23.316	2026-03-24 15:00:23.316	f	\N
cmn4qrjcu03bc87nydfsehh8f	cmn4qpdx300lv87nyma4c30sx	cmn4qrio0039287nykv6spwnb	2021-07-07 22:00:00	2024-07-07 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:23.358	2026-03-24 15:00:23.358	f	\N
cmn4qrjdo03bf87nylevks620	cmn4qpe1600mc87nyt241rf36	cmn4qrio0039287nykv6spwnb	2023-02-27 23:00:00	2026-02-27 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:23.389	2026-03-24 15:00:23.389	f	\N
cmn4qrjeu03bi87nytib20hkg	cmn4qpe3c00ml87nyjq6ethkm	cmn4qrio0039287nykv6spwnb	2021-10-17 22:00:00	2024-10-17 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:23.43	2026-03-24 15:00:23.43	f	\N
cmn4qrjft03bl87nykskv06vb	cmn4qpe5v00mv87nyo50kyk2g	cmn4qrio0039287nykv6spwnb	2023-03-07 23:00:00	2026-03-07 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:23.465	2026-03-24 15:00:23.465	f	\N
cmn4qrjh203bo87nylz67r6zl	cmn4qpe7s00n287nyfaxgb289	cmn4qrio0039287nykv6spwnb	2022-05-09 22:00:00	2025-05-09 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:23.51	2026-03-24 15:00:23.51	f	\N
cmn4qrjia03br87nypif1miz0	cmn4qpe8u00n787ny6aci9ysp	cmn4qrio0039287nykv6spwnb	2022-04-13 22:00:00	2025-04-13 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:23.554	2026-03-24 15:00:23.554	f	\N
cmn4qrjj603bu87ny44zbam36	cmn4qpea700nc87nyviugn1t4	cmn4qrio0039287nykv6spwnb	2021-04-08 22:00:00	2024-04-08 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:23.586	2026-03-24 15:00:23.586	f	\N
cmn4qrjkj03bx87ny4msqq2dr	cmn4qpeeh00nv87nyfigf6of3	cmn4qrio0039287nykv6spwnb	2024-07-14 22:00:00	2027-07-14 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:23.635	2026-03-24 15:00:23.635	f	\N
cmn4qrjlf03c087nyab9fww43	cmn4qpef700ny87nyunrl6drj	cmn4qrio0039287nykv6spwnb	2024-07-14 22:00:00	2027-07-14 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:23.668	2026-03-24 15:00:23.668	f	\N
cmn4qrjm803c287nyfnqetdmv	cmn4qpeg100o287nybtkvtd6e	cmn4qrio0039287nykv6spwnb	2023-03-07 23:00:00	2026-03-07 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:23.697	2026-03-24 15:00:23.697	f	\N
cmn4qrjn703c587nyatrjpvrm	cmn4qpej300oh87ny827lno4x	cmn4qrio0039287nykv6spwnb	2021-07-07 22:00:00	2024-07-07 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:23.731	2026-03-24 15:00:23.731	f	\N
cmn4qrjoa03c887nyfs6ro017	cmn4qpeju00ok87ny1ngzvx7y	cmn4qrio0039287nykv6spwnb	2020-11-17 23:00:00	2023-11-17 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:23.77	2026-03-24 15:00:23.77	f	\N
cmn4qrjpa03cb87nycc45v3o5	cmn4qpenr00p387nyfityawy7	cmn4qrio0039287nykv6spwnb	2019-04-09 22:00:00	2022-04-09 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:23.806	2026-03-24 15:00:23.806	f	\N
cmn4qrjq003ce87ny0heyhvih	cmn4qperu00pg87nymwhjig2q	cmn4qrio0039287nykv6spwnb	2024-03-07 23:00:00	2027-03-07 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:23.833	2026-03-24 15:00:23.833	f	\N
cmn4qrjr403cg87nyeht1ngcy	cmn4qpesa00pi87nyy2j3aaqo	cmn4qrio0039287nykv6spwnb	2024-03-07 23:00:00	2027-03-07 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:23.872	2026-03-24 15:00:23.872	f	\N
cmn4qrjs103cj87nyhxsu450e	cmn4qpewr00q287nyk5kriswe	cmn4qrio0039287nykv6spwnb	2021-04-08 22:00:00	2024-04-08 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:23.906	2026-03-24 15:00:23.906	f	\N
cmn4qrjsw03cm87nyeiz6q50z	cmn4qpezq00qc87nyubisut4t	cmn4qrio0039287nykv6spwnb	2021-01-09 23:00:00	2024-01-09 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:23.936	2026-03-24 15:00:23.936	f	\N
cmn4qrjto03cp87nyw6beyd0x	cmn4qpfde00ry87ny6c8bu6b6	cmn4qrio0039287nykv6spwnb	2022-05-09 22:00:00	2025-05-09 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:23.965	2026-03-24 15:00:23.965	f	\N
cmn4qrjuf03cs87nybx70qq1l	cmn4qpfxw00ud87nyi50hitov	cmn4qrio0039287nykv6spwnb	2022-05-10 22:00:00	2025-05-10 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:23.991	2026-03-24 15:00:23.991	f	\N
cmn4qrjv503cv87nyk59sldvc	cmn4qpfza00ui87nyn3jbs2uh	cmn4qrio0039287nykv6spwnb	2023-11-02 23:00:00	2026-11-02 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:24.018	2026-03-24 15:00:24.018	f	\N
cmn4qrjw203cy87nyrplkhurb	cmn4qpg0800un87nyz49fmt8c	cmn4qrio0039287nykv6spwnb	2023-11-02 23:00:00	2026-11-02 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:24.05	2026-03-24 15:00:24.05	f	\N
cmn4qrjwv03d187nyo4r23d0q	cmn4qpg1900us87ny90zslxsa	cmn4qrio0039287nykv6spwnb	2022-04-14 22:00:00	2025-04-14 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:24.079	2026-03-24 15:00:24.079	f	\N
cmn4qrjxl03d487nyvl4rpu73	cmn4qpg1v00uv87nycm5pfuxq	cmn4qrio0039287nykv6spwnb	2021-04-08 22:00:00	2024-04-08 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:24.105	2026-03-24 15:00:24.105	f	\N
cmn4qrjyi03d787nywk2o958c	cmn4qpg3b00v187nysak46qia	cmn4qrio0039287nykv6spwnb	2019-12-03 23:00:00	2022-12-03 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:24.139	2026-03-24 15:00:24.139	f	\N
cmn4qrjzf03da87nys71ed8uz	cmn4qpg6m00ve87ny27czy5ly	cmn4qrio0039287nykv6spwnb	2021-10-17 22:00:00	2024-10-17 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:24.172	2026-03-24 15:00:24.172	f	\N
cmn4qrk0903dd87nyemini251	cmn4qpg8000vk87ny99uxxhcf	cmn4qrio0039287nykv6spwnb	2024-07-14 22:00:00	2027-07-14 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:24.201	2026-03-24 15:00:24.201	f	\N
cmn4qrk1103dg87nykgh58sfh	cmn4qpg9g00vp87ny5ud9fs2s	cmn4qrio0039287nykv6spwnb	2024-03-07 23:00:00	2027-03-07 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:24.229	2026-03-24 15:00:24.229	f	\N
cmn4qrk1t03dj87nygbukrvjq	cmn4qpgaf00vs87nyn803q2fg	cmn4qrio0039287nykv6spwnb	2023-11-02 23:00:00	2026-11-02 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:24.257	2026-03-24 15:00:24.257	f	\N
cmn4qrk2j03dm87nyy1ldmsax	cmn4qpgc900w087ny6vbm6gk7	cmn4qrio0039287nykv6spwnb	2021-11-19 23:00:00	2024-11-19 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:24.283	2026-03-24 15:00:24.283	f	\N
cmn4qrk3a03dp87ny6qlyxkdx	cmn4qpgcz00w387nyouehuhhz	cmn4qrio0039287nykv6spwnb	2024-03-07 23:00:00	2027-03-07 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:24.31	2026-03-24 15:00:24.31	f	\N
cmn4qrk4603ds87nydjtxfhu2	cmn4qpgdq00w687nyr0txrfu4	cmn4qrio0039287nykv6spwnb	2024-03-07 23:00:00	2027-03-07 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:24.343	2026-03-24 15:00:24.343	f	\N
cmn4qrk5603dv87nytnvzxdc7	cmn4qpglh00x887nyzpkrlibg	cmn4qrio0039287nykv6spwnb	2021-11-02 23:00:00	2024-11-02 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:24.378	2026-03-24 15:00:24.378	f	\N
cmn4qrk5w03dy87nydcj4wj97	cmn4qpgnt00xj87nyysmhss5w	cmn4qrio0039287nykv6spwnb	2024-07-08 22:00:00	2027-07-08 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:24.405	2026-03-24 15:00:24.405	f	\N
cmn4qrk7003e087nyrkp8j6wt	cmn4qpgoa00xl87nysbbpeffw	cmn4qrio0039287nykv6spwnb	2024-07-14 22:00:00	2027-07-14 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:24.445	2026-03-24 15:00:24.445	f	\N
cmn4qrk7s03e387nyjxc2gcj9	cmn4qpgr300xv87ny6fa2us7x	cmn4qrio0039287nykv6spwnb	2019-12-03 23:00:00	2022-12-03 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:24.473	2026-03-24 15:00:24.473	f	\N
cmn4qrk8r03e687nyizxbfsy3	cmn4qph1000z187ny3hdbh0ue	cmn4qrio0039287nykv6spwnb	2023-02-27 23:00:00	2026-02-27 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:24.507	2026-03-24 15:00:24.507	f	\N
cmn4qrk9q03e987nymaqpuugi	cmn4qph2e00z887ny9wc4tkd2	cmn4qrio0039287nykv6spwnb	2024-07-14 22:00:00	2027-07-14 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:24.542	2026-03-24 15:00:24.542	f	\N
cmn4qrkag03ec87ny0wuzn9oc	cmn4qph3d00zd87nyjl8ywb59	cmn4qrio0039287nykv6spwnb	2024-07-08 22:00:00	2027-07-08 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:24.569	2026-03-24 15:00:24.569	f	\N
cmn4qrkb803ef87nyggy8pdwb	cmn4qph4o00zj87nyhoi2duoi	cmn4qrio0039287nykv6spwnb	2024-07-14 22:00:00	2027-07-14 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:24.596	2026-03-24 15:00:24.596	f	\N
cmn4qrkca03eh87nyzk2wgnfh	cmn4qph5a00zn87nyefi6zc53	cmn4qrio0039287nykv6spwnb	2024-07-08 22:00:00	2027-07-08 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:24.635	2026-03-24 15:00:24.635	f	\N
cmn4qrkd203ek87ny1cb1h6pe	cmn4qph6800zs87ny74rfijyi	cmn4qrio0039287nykv6spwnb	2024-07-14 22:00:00	2027-07-14 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:24.662	2026-03-24 15:00:24.662	f	\N
cmn4qrkdt03em87ny48hafie6	cmn4qph6w00zw87nynytnulld	cmn4qrio0039287nykv6spwnb	2021-04-08 22:00:00	2024-04-08 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:24.689	2026-03-24 15:00:24.689	f	\N
cmn4qrket03ep87nysqcglhl0	cmn4qphd8010p87nyf9i2f52y	cmn4qrio0039287nykv6spwnb	2022-04-14 22:00:00	2025-04-14 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:24.725	2026-03-24 15:00:24.725	f	\N
cmn4qrkfm03es87nybmq55vdm	cmn4qphg5011087nyits9yhno	cmn4qrio0039287nykv6spwnb	2022-04-14 22:00:00	2025-04-14 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:24.754	2026-03-24 15:00:24.754	f	\N
cmn4qrkge03ev87ny923uhm3b	cmn4qphns012087nyqrupqtbl	cmn4qrio0039287nykv6spwnb	2024-07-08 22:00:00	2027-07-08 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:24.782	2026-03-24 15:00:24.782	f	\N
cmn4qrkh503ey87ny931vf87o	cmn4qphph012987nydmmzao7z	cmn4qrio0039287nykv6spwnb	2023-03-07 23:00:00	2026-03-07 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:24.809	2026-03-24 15:00:24.809	f	\N
cmn4qrki003f187nyg1b7t3w8	cmn4qphr3012i87ny8lomkjrt	cmn4qrio0039287nykv6spwnb	2020-11-17 23:00:00	2023-11-17 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:24.84	2026-03-24 15:00:24.84	f	\N
cmn4qrkj903f487nymhw841ud	cmn4qphw0013487nynokad4p1	cmn4qrio0039287nykv6spwnb	2021-07-07 22:00:00	2024-07-07 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:24.886	2026-03-24 15:00:24.886	f	\N
cmn4qrkk103f787ny3gfb5v8s	cmn4qphya013d87ny38haleqy	cmn4qrio0039287nykv6spwnb	2021-10-17 22:00:00	2024-10-17 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:24.913	2026-03-24 15:00:24.913	f	\N
cmn4qrkkr03f987nyet6lyer7	cmn4qphyt013f87nygzv4kz8l	cmn4qrio0039287nykv6spwnb	2021-04-08 22:00:00	2024-04-08 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:24.939	2026-03-24 15:00:24.939	f	\N
cmn4qrklh03fc87nymudz0xa4	cmn4qpi0q013m87nyu58s2taa	cmn4qrio0039287nykv6spwnb	2018-02-19 23:00:00	2021-02-19 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:24.966	2026-03-24 15:00:24.966	f	\N
cmn4qrkma03ff87nyv4bnkic2	cmn4qpi1z013t87nyltsagjl8	cmn4qrio0039287nykv6spwnb	2024-07-08 22:00:00	2027-07-08 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:24.994	2026-03-24 15:00:24.994	f	\N
cmn4qrkn803fi87nyeyusqx87	cmn4qpi2n013w87nyfo4hhp2g	cmn4qrio0039287nykv6spwnb	2024-03-07 23:00:00	2027-03-07 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:25.028	2026-03-24 15:00:25.028	f	\N
cmn4qrkny03fl87ny50v9akj4	cmn4qpi65014c87nykxl22uki	cmn4qrio0039287nykv6spwnb	2023-02-27 23:00:00	2026-02-27 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:25.055	2026-03-24 15:00:25.055	f	\N
cmn4qrkoo03fn87ny6qwogbkf	cmn4qpikg016987nyrnzn5tke	cmn4qrio0039287nykv6spwnb	2024-12-31 23:00:00	2027-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:25.081	2026-03-24 15:00:25.081	f	\N
cmn4qrkpf03fq87nyf5ds1pei	cmn4qpikr016b87ny0mv55ujk	cmn4qrio0039287nykv6spwnb	2024-12-31 23:00:00	2027-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:25.107	2026-03-24 15:00:25.107	f	\N
cmn4qrkq403ft87nyxksmhzvv	cmn4qpiev015i87nyfex42hze	cmn4qrio0039287nykv6spwnb	2024-12-31 23:00:00	2027-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:25.132	2026-03-24 15:00:25.132	f	\N
cmn4qrkqu03fw87nyuqa9hk8r	cmn4qpiym017w87nyod8uuz6l	cmn4qrio0039287nykv6spwnb	2024-05-31 22:00:00	2027-05-31 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:25.158	2026-03-24 15:00:25.158	f	\N
cmn4qrkro03fz87nysz5ud5f1	cmn4qpj19018787nyhv30yxam	cmn4qrio0039287nykv6spwnb	2021-05-31 22:00:00	2024-05-31 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:25.189	2026-03-24 15:00:25.189	f	\N
cmn4qrkss03g287ny1iolmram	cmn4qpj6e018s87nycgxtomm0	cmn4qrio0039287nykv6spwnb	2025-06-12 22:00:00	2028-06-12 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:25.228	2026-03-24 15:00:25.228	f	\N
cmn4qrn4o03g687ny89w81bxx	cmn4qp91l000o87ny6qn4yctp	cmn4qrn3t03g387nyryrujue2	2021-10-31 23:00:00	2024-10-31 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:28.248	2026-03-24 15:00:28.248	f	\N
cmn4qrn5g03g987nyszmtrwkr	cmn4qp96g001b87nyht0q510x	cmn4qrn3t03g387nyryrujue2	2020-12-31 23:00:00	2023-12-31 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:28.277	2026-03-24 15:00:28.277	f	\N
cmn4qrn6e03gc87nysd2tdnxe	cmn4qpa7m006387ny5bqlywfc	cmn4qrn3t03g387nyryrujue2	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:28.31	2026-03-24 15:00:28.31	f	\N
cmn4qrn7i03gf87ny5mkghmpf	cmn4qpaal006i87nylqcg4bs7	cmn4qrn3t03g387nyryrujue2	2023-05-31 22:00:00	2026-05-31 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:28.35	2026-03-24 15:00:28.35	f	\N
cmn4qrn8803gh87nym3l2lj9x	cmn4qpab9006m87nyzwyneq2h	cmn4qrn3t03g387nyryrujue2	2023-05-31 22:00:00	2026-05-31 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:28.377	2026-03-24 15:00:28.377	f	\N
cmn4qrn9c03gj87nys0582si1	cmn4qpabp006o87ny47pr3aw8	cmn4qrn3t03g387nyryrujue2	2023-05-31 22:00:00	2026-05-31 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:28.416	2026-03-24 15:00:28.416	f	\N
cmn4qrnac03gm87nyfwp5wd30	cmn4qpaok008687nyhsgzl8ez	cmn4qrn3t03g387nyryrujue2	2024-12-31 23:00:00	2027-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:28.452	2026-03-24 15:00:28.452	f	\N
cmn4qrnbd03gp87nyp27je639	cmn4qpbb400av87nyi5q08hhc	cmn4qrn3t03g387nyryrujue2	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:28.49	2026-03-24 15:00:28.49	f	\N
cmn4qrnc303gs87nynnxcvaqo	cmn4qpc3v00ea87nynovo1ahu	cmn4qrn3t03g387nyryrujue2	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:28.515	2026-03-24 15:00:28.515	f	\N
cmn4qrncx03gv87nynyhtmnle	cmn4qpd8400j587nyyw0oaqgs	cmn4qrn3t03g387nyryrujue2	2024-08-31 22:00:00	2027-08-31 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:28.545	2026-03-24 15:00:28.545	f	\N
cmn4qrndq03gy87nyawqaj5as	cmn4qpebv00nj87ny7hh5o4pe	cmn4qrn3t03g387nyryrujue2	2020-12-31 23:00:00	2023-12-31 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:28.574	2026-03-24 15:00:28.574	f	\N
cmn4qrnej03h187nygmlnm4u8	cmn4qpfng00t487ny0969j3o2	cmn4qrn3t03g387nyryrujue2	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:28.604	2026-03-24 15:00:28.604	f	\N
cmn4qrnfb03h487ny1he2gzc0	cmn4qpi3m014187ny1jij05j0	cmn4qrn3t03g387nyryrujue2	2022-12-31 23:00:00	2025-12-31 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:28.631	2026-03-24 15:00:28.631	f	\N
cmn4qrngc03h787nyboqc8hhi	cmn4qpium017h87nyi8vf4z3f	cmn4qrn3t03g387nyryrujue2	2021-12-31 23:00:00	2024-12-31 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:28.668	2026-03-24 15:00:28.668	f	\N
cmn4qrnhb03ha87nyfmdcsvwv	cmn4qpj8d019187ny9iuk3do1	cmn4qrn3t03g387nyryrujue2	2025-06-12 22:00:00	2028-06-12 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:28.704	2026-03-24 15:00:28.704	f	\N
cmn4qrnig03hd87ny30ttbgw7	cmn4qpjfo019w87nyl1emeif6	cmn4qrn3t03g387nyryrujue2	2025-06-12 22:00:00	2028-06-12 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:28.744	2026-03-24 15:00:28.744	f	\N
cmn4qrnjc03hf87nyrtk0ih9m	cmn4qpjhh01a487nyeu90yni9	cmn4qrn3t03g387nyryrujue2	2024-05-31 22:00:00	2027-05-31 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:28.776	2026-03-24 15:00:28.776	f	\N
cmn4qrnkh03hi87nyiemyld5d	cmn4qpjjp01ad87ny4hd3mv0m	cmn4qrn3t03g387nyryrujue2	2024-12-31 23:00:00	2027-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:28.817	2026-03-24 15:00:28.817	f	\N
cmn4qrnlf03hl87ny71kw9a9y	cmn4qpk2g01cj87ny43ei7inc	cmn4qrn3t03g387nyryrujue2	2022-12-31 23:00:00	2025-12-31 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:28.851	2026-03-24 15:00:28.851	f	\N
cmn4qrnm603hn87ny8hj03lxv	cmn4qpkkb01er87nychom7mv6	cmn4qrn3t03g387nyryrujue2	2024-12-31 23:00:00	2027-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:28.879	2026-03-24 15:00:28.879	f	\N
cmn4qrnnf03hq87nykgadrcpo	cmn4qpkma01f087nyg9kru7km	cmn4qrn3t03g387nyryrujue2	2024-12-31 23:00:00	2027-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:28.923	2026-03-24 15:00:28.923	f	\N
cmn4qrv0t03hu87nyd4vp1u8b	cmn4qp91l000o87ny6qn4yctp	cmn4qrv0103hr87nyeu4qm7tr	2023-07-24 22:00:00	2028-07-24 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:38.477	2026-03-24 15:00:38.477	f	\N
cmn4qrv1x03hx87nyl15bzg0c	cmn4qp941001087nyli2c8mim	cmn4qrv0103hr87nyeu4qm7tr	2024-04-03 22:00:00	2029-04-03 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:38.517	2026-03-24 15:00:38.517	f	\N
cmn4qrv2y03i087nyl1kz7y0t	cmn4qp95q001887nycpnq7kd6	cmn4qrv0103hr87nyeu4qm7tr	2021-07-04 22:00:00	2026-07-04 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:38.555	2026-03-24 15:00:38.555	f	\N
cmn4qrv3o03i387nyvy9hsvr3	cmn4qp977001f87nyixdsetam	cmn4qrv0103hr87nyeu4qm7tr	2023-12-31 23:00:00	2028-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:38.581	2026-03-24 15:00:38.581	f	\N
cmn4qrv4h03i687nyijqei1un	cmn4qp98h001k87ny8qp2efgi	cmn4qrv0103hr87nyeu4qm7tr	2023-12-31 23:00:00	2028-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:38.609	2026-03-24 15:00:38.609	f	\N
cmn4qrv5903i987nyqd4t2sy0	cmn4qp9a5001t87nymdzwd5gt	cmn4qrv0103hr87nyeu4qm7tr	2023-12-05 23:00:00	2028-12-05 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:38.637	2026-03-24 15:00:38.637	f	\N
cmn4qrv6a03ic87nylcajehiy	cmn4qp9d9002287nycr6vnw66	cmn4qrv0103hr87nyeu4qm7tr	2021-09-01 22:00:00	2026-09-01 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:38.674	2026-03-24 15:00:38.674	f	\N
cmn4qrv7203if87nyhlnxapmo	cmn4qp9f0002b87nyl51a4lqw	cmn4qrv0103hr87nyeu4qm7tr	2023-06-14 22:00:00	2028-06-14 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:38.702	2026-03-24 15:00:38.702	f	\N
cmn4qrv7t03ii87nyuni42bse	cmn4qp9hy002p87nysy6yy4mg	cmn4qrv0103hr87nyeu4qm7tr	2024-08-27 22:00:00	2029-08-27 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:38.729	2026-03-24 15:00:38.729	f	\N
cmn4qrv8q03il87nyhbnyagvm	cmn4qp9k0002y87nywpxflx7m	cmn4qrv0103hr87nyeu4qm7tr	2023-07-18 22:00:00	2028-07-18 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:38.763	2026-03-24 15:00:38.763	f	\N
cmn4qrv9j03io87ny9wv1udln	cmn4qp9ng003d87ny2rkl8q9y	cmn4qrv0103hr87nyeu4qm7tr	2021-11-22 23:00:00	2026-11-22 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:38.792	2026-03-24 15:00:38.792	f	\N
cmn4qrva903ir87nydlbidiuz	cmn4qp9q0003q87ny10t81ejk	cmn4qrv0103hr87nyeu4qm7tr	2023-02-15 23:00:00	2028-02-15 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:38.817	2026-03-24 15:00:38.817	f	\N
cmn4qrvbe03iu87nyajx47oac	cmn4qp9ts004887nyqfw9ac0f	cmn4qrv0103hr87nyeu4qm7tr	2022-06-12 22:00:00	2027-06-12 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:38.858	2026-03-24 15:00:38.858	f	\N
cmn4qsami03xq87nyo3w843f7	cmn4qpcb800f487nygnbla74w	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:58.698	2026-03-24 15:00:58.698	f	\N
cmn4qrvch03ix87nyzcqbyae1	cmn4qp9xf004q87nyne5w5oov	cmn4qrv0103hr87nyeu4qm7tr	2023-06-14 22:00:00	2028-06-14 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:38.897	2026-03-24 15:00:38.897	f	\N
cmn4qrvda03j087ny2uw3mzyb	cmn4qp9yp004x87nys4rpsfvr	cmn4qrv0103hr87nyeu4qm7tr	2021-03-21 23:00:00	2026-03-21 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:38.926	2026-03-24 15:00:38.926	f	\N
cmn4qrveg03j387nybbd9ekhq	cmn4qp9zt005287nydzq4xhx6	cmn4qrv0103hr87nyeu4qm7tr	2020-09-08 22:00:00	2025-09-08 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:38.968	2026-03-24 15:00:38.968	f	\N
cmn4qrvfp03j687nylnlhtz18	cmn4qpa1z005d87nyjt33954a	cmn4qrv0103hr87nyeu4qm7tr	2022-09-12 22:00:00	2027-09-12 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:39.013	2026-03-24 15:00:39.013	f	\N
cmn4qrvgp03j987nyrb4wef0r	cmn4qpa36005i87nyy5uijmmw	cmn4qrv0103hr87nyeu4qm7tr	2023-09-24 22:00:00	2028-09-24 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:39.05	2026-03-24 15:00:39.05	f	\N
cmn4qrvhk03jc87nygstlh95q	cmn4qpa4p005p87ny4m51rp2w	cmn4qrv0103hr87nyeu4qm7tr	2023-10-29 23:00:00	2028-10-29 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:39.08	2026-03-24 15:00:39.08	f	\N
cmn4qrvia03jf87nyuws21zuv	cmn4qpa5y005v87nybtbid9fu	cmn4qrv0103hr87nyeu4qm7tr	2021-11-28 23:00:00	2026-11-28 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:39.106	2026-03-24 15:00:39.106	f	\N
cmn4qrvjb03ji87nyz7ld26ym	cmn4qpack006s87ny5poa1nl6	cmn4qrv0103hr87nyeu4qm7tr	2020-11-04 23:00:00	2025-11-04 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:39.143	2026-03-24 15:00:39.143	f	\N
cmn4qrvk203jl87nytwhtmb4i	cmn4qpae9006z87ny8bu2je1t	cmn4qrv0103hr87nyeu4qm7tr	2023-09-25 22:00:00	2028-09-25 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:39.171	2026-03-24 15:00:39.171	f	\N
cmn4qrvkv03jo87nymd5ti7wv	cmn4qpagw007987nylruol6ip	cmn4qrv0103hr87nyeu4qm7tr	2023-05-17 22:00:00	2028-05-17 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:39.2	2026-03-24 15:00:39.2	f	\N
cmn4qrvlu03jr87nymnnh7kyv	cmn4qpait007g87nyi8jp0s3i	cmn4qrv0103hr87nyeu4qm7tr	2018-04-29 22:00:00	2023-04-29 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:39.234	2026-03-24 15:00:39.234	f	\N
cmn4qrvmt03ju87ny4ihdwau1	cmn4qpak6007n87nyvrx7ykjo	cmn4qrv0103hr87nyeu4qm7tr	2021-12-12 23:00:00	2026-12-12 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:39.269	2026-03-24 15:00:39.269	f	\N
cmn4qrvnw03jx87ny3uxs5a86	cmn4qpapr008d87nyi76ijqlr	cmn4qrv0103hr87nyeu4qm7tr	2015-05-28 22:00:00	2020-05-28 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:39.309	2026-03-24 15:00:39.309	f	\N
cmn4qrvon03k087nybgm6tzzr	cmn4qpax2009b87ny9rrxd1gt	cmn4qrv0103hr87nyeu4qm7tr	2022-12-19 23:00:00	2027-12-19 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:39.336	2026-03-24 15:00:39.336	f	\N
cmn4qrvpf03k387nyrvwq4bor	cmn4qpaz2009i87nylmv6c09f	cmn4qrv0103hr87nyeu4qm7tr	2024-01-01 23:00:00	2029-01-01 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:39.363	2026-03-24 15:00:39.363	f	\N
cmn4qrvq903k687nymyctlcm9	cmn4qpb2h009v87nyawyfx292	cmn4qrv0103hr87nyeu4qm7tr	2023-06-27 22:00:00	2028-06-27 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:39.393	2026-03-24 15:00:39.393	f	\N
cmn4qrvr903k987ny9a3npmb0	cmn4qpb4a00a287nykqf7no01	cmn4qrv0103hr87nyeu4qm7tr	2018-02-07 23:00:00	2023-02-07 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:39.429	2026-03-24 15:00:39.429	f	\N
cmn4qrvs703kc87ny216wjz6m	cmn4qpb7e00ag87nyxzaxdmle	cmn4qrv0103hr87nyeu4qm7tr	2021-11-22 23:00:00	2026-11-22 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:39.464	2026-03-24 15:00:39.464	f	\N
cmn4qrvtc03kf87nyty2sv9p1	cmn4qpbea00b887nydtrxxybq	cmn4qrv0103hr87nyeu4qm7tr	2024-07-29 22:00:00	2029-07-29 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:39.504	2026-03-24 15:00:39.504	f	\N
cmn4qrvu403ki87nyxp63u4wd	cmn4qpbh500bl87nyckb6dbfz	cmn4qrv0103hr87nyeu4qm7tr	2020-10-12 22:00:00	2025-10-12 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:39.532	2026-03-24 15:00:39.532	f	\N
cmn4qrvuw03kl87ny1ngtqq0r	cmn4qpbiz00bv87nyhhtoeqgt	cmn4qrv0103hr87nyeu4qm7tr	2022-09-21 22:00:00	2027-09-21 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:39.56	2026-03-24 15:00:39.56	f	\N
cmn4qrvvu03ko87nydjazo0xq	cmn4qpbk800c087nymnsljwto	cmn4qrv0103hr87nyeu4qm7tr	2022-07-03 22:00:00	2027-07-03 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:39.594	2026-03-24 15:00:39.594	f	\N
cmn4qrvwl03kr87nys44bpxjx	cmn4qpbms00c887nygkjyqi71	cmn4qrv0103hr87nyeu4qm7tr	2023-07-18 22:00:00	2028-07-18 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:39.622	2026-03-24 15:00:39.622	f	\N
cmn4qrvxe03ku87ny1j9b2dy5	cmn4qpbpa00ch87nym3tekzyq	cmn4qrv0103hr87nyeu4qm7tr	2024-11-06 23:00:00	2029-11-06 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:39.65	2026-03-24 15:00:39.65	f	\N
cmn4qrvy803kx87nymvz19dtz	cmn4qpbry00cu87ny00kff2dq	cmn4qrv0103hr87nyeu4qm7tr	2022-04-19 22:00:00	2027-04-19 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:39.68	2026-03-24 15:00:39.68	f	\N
cmn4qrvyz03l087nyiyvdotjv	cmn4qpbt600cz87ny7au5wain	cmn4qrv0103hr87nyeu4qm7tr	2018-02-28 23:00:00	2023-02-28 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:39.707	2026-03-24 15:00:39.707	f	\N
cmn4qrvzy03l387nyw4ljdrp9	cmn4qpbuk00d487nymow3pr2z	cmn4qrv0103hr87nyeu4qm7tr	2019-04-16 22:00:00	2024-04-16 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:39.743	2026-03-24 15:00:39.743	f	\N
cmn4qrw1903l687ny859yg5t9	cmn4qpbym00dr87nyf4r0gaqj	cmn4qrv0103hr87nyeu4qm7tr	2017-03-16 23:00:00	2022-03-16 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:39.79	2026-03-24 15:00:39.79	f	\N
cmn4qrw2b03l987nyue5esaj2	cmn4qpc1500e287ny68ge8fb7	cmn4qrv0103hr87nyeu4qm7tr	2024-07-21 22:00:00	2029-07-21 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:39.827	2026-03-24 15:00:39.827	f	\N
cmn4qrw3903lc87nyj0fesshv	cmn4qpc6f00ej87nyngmbi2ym	cmn4qrv0103hr87nyeu4qm7tr	2023-03-05 23:00:00	2028-03-05 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:39.861	2026-03-24 15:00:39.861	f	\N
cmn4qrw4603lf87nywh8err6y	cmn4qpca700ez87nyouhkg223	cmn4qrv0103hr87nyeu4qm7tr	2024-05-16 22:00:00	2029-05-16 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:39.894	2026-03-24 15:00:39.894	f	\N
cmn4qrw4z03li87ny3iszpinv	cmn4qpcbu00f787nyj83lsm4i	cmn4qrv0103hr87nyeu4qm7tr	2021-05-25 22:00:00	2026-05-25 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:39.923	2026-03-24 15:00:39.923	f	\N
cmn4qrw5q03ll87nypgsly4mk	cmn4qpce000fh87ny0memgeng	cmn4qrv0103hr87nyeu4qm7tr	2022-09-21 22:00:00	2027-09-21 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:39.951	2026-03-24 15:00:39.951	f	\N
cmn4qrw6i03lo87ny3corqlc3	cmn4qpcmf00gh87nym35v3rjq	cmn4qrv0103hr87nyeu4qm7tr	2023-04-02 22:00:00	2028-04-02 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:39.979	2026-03-24 15:00:39.979	f	\N
cmn4qrw7a03lr87nyxjiao1my	cmn4qpcnp00go87ny4xp224gt	cmn4qrv0103hr87nyeu4qm7tr	2021-03-08 23:00:00	2026-03-08 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:40.006	2026-03-24 15:00:40.006	f	\N
cmn4qrw8d03lu87nyzvdk04rs	cmn4qpcp700gv87ny42pu0and	cmn4qrv0103hr87nyeu4qm7tr	2024-06-16 22:00:00	2029-06-16 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:40.046	2026-03-24 15:00:40.046	f	\N
cmn4qrw9703lx87nyn72okp4f	cmn4qpcst00h987nypz669eoj	cmn4qrv0103hr87nyeu4qm7tr	2024-04-09 22:00:00	2029-04-09 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:40.076	2026-03-24 15:00:40.076	f	\N
cmn4qrwa303m087nyqgdvb8p2	cmn4qpcvc00hk87ny8gbdnsrp	cmn4qrv0103hr87nyeu4qm7tr	2020-09-24 22:00:00	2025-09-24 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:40.107	2026-03-24 15:00:40.107	f	\N
cmn4qrwat03m387nyosxuffvo	cmn4qpcx300ht87nyzbp6b5m2	cmn4qrv0103hr87nyeu4qm7tr	2021-09-15 22:00:00	2026-09-15 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:40.133	2026-03-24 15:00:40.133	f	\N
cmn4qrwbl03m687nyshvhugw1	cmn4qpd1800ib87ny46jiejzt	cmn4qrv0103hr87nyeu4qm7tr	2018-07-03 22:00:00	2023-07-03 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:40.162	2026-03-24 15:00:40.162	f	\N
cmn4qrwcb03m987nyc9gcbqqc	cmn4qpd2a00ig87nylfecbcgq	cmn4qrv0103hr87nyeu4qm7tr	2023-12-04 23:00:00	2028-12-04 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:40.188	2026-03-24 15:00:40.188	f	\N
cmn4qrwd703mc87nyb48twad2	cmn4qpd5300ir87nym15x07lu	cmn4qrv0103hr87nyeu4qm7tr	2021-02-16 23:00:00	2026-02-16 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:40.219	2026-03-24 15:00:40.219	f	\N
cmn4qrwdx03mf87nyiild7ko7	cmn4qpd6100iw87nyd7h836e8	cmn4qrv0103hr87nyeu4qm7tr	2022-10-13 22:00:00	2027-10-13 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:40.245	2026-03-24 15:00:40.245	f	\N
cmn4qrwes03mi87nyo1utgk40	cmn4qpd8s00j787nyqv6huyfe	cmn4qrv0103hr87nyeu4qm7tr	2024-09-30 22:00:00	2029-09-30 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:40.276	2026-03-24 15:00:40.276	f	\N
cmn4qrwfk03ml87ny7vw86qkk	cmn4qpdbn00jk87nyg39ezu87	cmn4qrv0103hr87nyeu4qm7tr	2024-03-18 23:00:00	2029-03-18 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:40.305	2026-03-24 15:00:40.305	f	\N
cmn4qrwgb03mo87nyt1mgow5d	cmn4qpdgj00k287nyqe191f7t	cmn4qrv0103hr87nyeu4qm7tr	2019-03-03 23:00:00	2024-03-03 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:40.331	2026-03-24 15:00:40.331	f	\N
cmn4qrwh203mr87ny1dms15it	cmn4qpdjl00kd87ny5ajqfynj	cmn4qrv0103hr87nyeu4qm7tr	2023-06-14 22:00:00	2028-06-14 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:40.359	2026-03-24 15:00:40.359	f	\N
cmn4qrwhy03mu87nyfwoz7t0u	cmn4qpdpy00l387ny74bgk6dd	cmn4qrv0103hr87nyeu4qm7tr	2024-04-10 22:00:00	2029-04-10 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:40.391	2026-03-24 15:00:40.391	f	\N
cmn4qrwis03mx87ny6b73fgyt	cmn4qpdsx00ld87ny3nh22t7t	cmn4qrv0103hr87nyeu4qm7tr	2021-07-18 22:00:00	2026-07-18 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:40.42	2026-03-24 15:00:40.42	f	\N
cmn4qrwjj03n087nyu7xtc43m	cmn4qpdu300li87ny7fcpmb3b	cmn4qrv0103hr87nyeu4qm7tr	2023-10-22 22:00:00	2028-10-22 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:40.448	2026-03-24 15:00:40.448	f	\N
cmn4qrwkr03n387nyt9nmiavs	cmn4qpdwf00ls87nyqjovoiho	cmn4qrv0103hr87nyeu4qm7tr	2017-01-09 23:00:00	2022-01-09 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:40.491	2026-03-24 15:00:40.491	f	\N
cmn4qrwlk03n687nyv6qs7yc5	cmn4qpdxm00lx87nyb7h84010	cmn4qrv0103hr87nyeu4qm7tr	2021-07-18 22:00:00	2026-07-18 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:40.52	2026-03-24 15:00:40.52	f	\N
cmn4qrwma03n987nymgvxl33m	cmn4qpdzu00m687nyuaucspw8	cmn4qrv0103hr87nyeu4qm7tr	2023-06-14 22:00:00	2028-06-14 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:40.547	2026-03-24 15:00:40.547	f	\N
cmn4qrwnb03nc87nyqkqugy9y	cmn4qpe1j00me87nymg4nqtpv	cmn4qrv0103hr87nyeu4qm7tr	2023-04-25 22:00:00	2028-04-25 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:40.584	2026-03-24 15:00:40.584	f	\N
cmn4qrwoh03nf87nyaey6jyb2	cmn4qpe3q00mn87nyx3b40kle	cmn4qrv0103hr87nyeu4qm7tr	2023-02-28 23:00:00	2028-02-29 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:40.625	2026-03-24 15:00:40.625	f	\N
cmn4qrwpi03ni87nyk7epuw7j	cmn4qpe6e00mx87nyzn45kege	cmn4qrv0103hr87nyeu4qm7tr	2023-05-11 22:00:00	2028-05-11 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:40.662	2026-03-24 15:00:40.662	f	\N
cmn4qrwqp03nl87nyvmsqf7q8	cmn4qpe8500n487nygcbcp2np	cmn4qrv0103hr87nyeu4qm7tr	2022-01-20 23:00:00	2027-01-20 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:40.705	2026-03-24 15:00:40.705	f	\N
cmn4qrwrp03no87ny7ear88x3	cmn4qpe9e00n987nykkq1f6cq	cmn4qrv0103hr87nyeu4qm7tr	2018-05-31 22:00:00	2023-05-31 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:40.742	2026-03-24 15:00:40.742	f	\N
cmn4qrwsk03nr87nyw6m76rom	cmn4qpeav00ne87ny09kl72r9	cmn4qrv0103hr87nyeu4qm7tr	2021-06-06 22:00:00	2026-06-06 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:40.772	2026-03-24 15:00:40.772	f	\N
cmn4qrwtg03nu87nyffd8x560	cmn4qpef700ny87nyunrl6drj	cmn4qrv0103hr87nyeu4qm7tr	2024-08-25 22:00:00	2029-08-25 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:40.804	2026-03-24 15:00:40.804	f	\N
cmn4qrwuj03nx87nyjbce6aok	cmn4qpegz00o787nym3b0gp60	cmn4qrv0103hr87nyeu4qm7tr	2023-05-21 22:00:00	2028-05-21 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:40.844	2026-03-24 15:00:40.844	f	\N
cmn4qrwvm03o087ny86slp07k	cmn4qpeih00oe87nybel8mrwe	cmn4qrv0103hr87nyeu4qm7tr	2023-02-05 23:00:00	2028-02-05 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:40.883	2026-03-24 15:00:40.883	f	\N
cmn4qrwwh03o387ny3jyspo4m	cmn4qpeks00oo87nyd61np16d	cmn4qrv0103hr87nyeu4qm7tr	2022-06-12 22:00:00	2027-06-12 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:40.914	2026-03-24 15:00:40.914	f	\N
cmn4qrwxe03o687nykei1v1c3	cmn4qpepn00pa87ny66xboofc	cmn4qrv0103hr87nyeu4qm7tr	2022-03-29 22:00:00	2027-03-29 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:40.947	2026-03-24 15:00:40.947	f	\N
cmn4qrwyf03o987nyuy1z8yxk	cmn4qpeso00pk87nykztc06jm	cmn4qrv0103hr87nyeu4qm7tr	2023-05-29 22:00:00	2028-05-29 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:40.984	2026-03-24 15:00:40.984	f	\N
cmn4qrwz903oc87ny4jywvbwr	cmn4qpevc00pv87ny9lxxqpq8	cmn4qrv0103hr87nyeu4qm7tr	2023-06-14 22:00:00	2028-06-14 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:41.013	2026-03-24 15:00:41.013	f	\N
cmn4qrx0i03of87nydmlebonl	cmn4qpeyh00q787ny9e7ej35y	cmn4qrv0103hr87nyeu4qm7tr	2022-09-07 22:00:00	2027-09-07 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:41.058	2026-03-24 15:00:41.058	f	\N
cmn4qrx1n03oi87nybqkmgx2q	cmn4qpf0400qe87nyb6h8mc2m	cmn4qrv0103hr87nyeu4qm7tr	2022-01-20 23:00:00	2027-01-20 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:41.099	2026-03-24 15:00:41.099	f	\N
cmn4qrx2g03ol87nyoqlhfnwh	cmn4qpf5p00r287ny2jltp3zr	cmn4qrv0103hr87nyeu4qm7tr	2023-12-31 23:00:00	2028-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:41.129	2026-03-24 15:00:41.129	f	\N
cmn4qrx3803oo87nype5bnd55	cmn4qpf7l00r987ny2e5kncwx	cmn4qrv0103hr87nyeu4qm7tr	2024-02-22 23:00:00	2029-02-22 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:41.157	2026-03-24 15:00:41.157	f	\N
cmn4qrx4003or87ny67i589zl	cmn4qpf8o00re87nyjwob3fbl	cmn4qrv0103hr87nyeu4qm7tr	2023-06-14 22:00:00	2028-06-14 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:41.184	2026-03-24 15:00:41.184	f	\N
cmn4qrx4r03ou87nyvs9yro9o	cmn4qpfce00rt87nyahun5zrx	cmn4qrv0103hr87nyeu4qm7tr	2024-07-31 22:00:00	2029-07-31 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:41.212	2026-03-24 15:00:41.212	f	\N
cmn4qrx5k03ox87nyb4o8gsoh	cmn4qpfdo00s087nyy4qx5ke2	cmn4qrv0103hr87nyeu4qm7tr	2022-03-03 23:00:00	2027-03-03 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:41.24	2026-03-24 15:00:41.24	f	\N
cmn4qrx6i03p087nyxf0a9kfk	cmn4qpffp00sa87nyvbwfslju	cmn4qrv0103hr87nyeu4qm7tr	2024-05-14 22:00:00	2029-05-14 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:41.275	2026-03-24 15:00:41.275	f	\N
cmn4qrx7a03p387nyzat2y7te	cmn4qpfhq00sj87nydsi90qnu	cmn4qrv0103hr87nyeu4qm7tr	2022-06-23 22:00:00	2027-06-23 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:41.302	2026-03-24 15:00:41.302	f	\N
cmn4qrx8003p687ny73g81nr3	cmn4qpfl200sv87ny12hq98p1	cmn4qrv0103hr87nyeu4qm7tr	2022-03-03 23:00:00	2027-03-03 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:41.328	2026-03-24 15:00:41.328	f	\N
cmn4qrx8r03p987nyc6xto2x4	cmn4qpfrf00ti87ny9z0zz5pu	cmn4qrv0103hr87nyeu4qm7tr	2022-04-18 22:00:00	2027-04-18 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:41.355	2026-03-24 15:00:41.355	f	\N
cmn4qrx9r03pc87ny9tniq4b7	cmn4qpfsh00tn87nyifoslt5i	cmn4qrv0103hr87nyeu4qm7tr	2022-08-10 22:00:00	2027-08-10 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:41.391	2026-03-24 15:00:41.391	f	\N
cmn4qrxaw03pf87ny29zunja7	cmn4qpfur00tw87nybu5tx1nb	cmn4qrv0103hr87nyeu4qm7tr	2023-06-14 22:00:00	2028-06-14 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:41.432	2026-03-24 15:00:41.432	f	\N
cmn4qrxbp03pi87ny34eaekki	cmn4qpfxa00ua87ny737vgxoi	cmn4qrv0103hr87nyeu4qm7tr	2023-08-27 22:00:00	2028-08-27 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:41.461	2026-03-24 15:00:41.461	f	\N
cmn4qrxcu03pl87ny1vwqq6nm	cmn4qpfyd00uf87nydnv55fwl	cmn4qrv0103hr87nyeu4qm7tr	2013-12-05 23:00:00	2018-12-05 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:41.503	2026-03-24 15:00:41.503	f	\N
cmn4qrxe103po87nymuos8u3e	cmn4qpg0k00up87nymov9egbc	cmn4qrv0103hr87nyeu4qm7tr	2024-01-11 23:00:00	2029-01-11 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:41.545	2026-03-24 15:00:41.545	f	\N
cmn4qrxf103pr87nyp0r86xso	cmn4qpg5100v687nyf6v1q0do	cmn4qrv0103hr87nyeu4qm7tr	2024-03-27 23:00:00	2029-03-27 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:41.582	2026-03-24 15:00:41.582	f	\N
cmn4qrxfv03pu87nyq2amhqmq	cmn4qpg5y00vb87nyewf5rkpl	cmn4qrv0103hr87nyeu4qm7tr	2023-03-08 23:00:00	2028-03-08 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:41.612	2026-03-24 15:00:41.612	f	\N
cmn4qrxgt03px87nywkq7zfmp	cmn4qpg7b00vh87nyly8ghug9	cmn4qrv0103hr87nyeu4qm7tr	2022-07-27 22:00:00	2027-07-27 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:41.646	2026-03-24 15:00:41.646	f	\N
cmn4qrxhk03q087nyk5w4lspa	cmn4qpg8j00vm87nyadt9mc92	cmn4qrv0103hr87nyeu4qm7tr	2022-12-06 23:00:00	2027-12-06 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:41.672	2026-03-24 15:00:41.672	f	\N
cmn4qrxib03q387nyb35fmr5i	cmn4qpgav00vu87nyco2vi1wz	cmn4qrv0103hr87nyeu4qm7tr	2023-07-18 22:00:00	2028-07-18 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:41.699	2026-03-24 15:00:41.699	f	\N
cmn4qrxja03q687nybf24b48n	cmn4qpgen00wb87nylkbce8rh	cmn4qrv0103hr87nyeu4qm7tr	2020-10-14 22:00:00	2025-10-14 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:41.735	2026-03-24 15:00:41.735	f	\N
cmn4qrxkf03q987nymlrlqfsh	cmn4qpghb00wo87ny08k330bf	cmn4qrv0103hr87nyeu4qm7tr	2023-01-16 23:00:00	2028-01-16 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:41.775	2026-03-24 15:00:41.775	f	\N
cmn4qrxlc03qc87nyhekdaiad	cmn4qpgiu00wu87ny7ivs2gpx	cmn4qrv0103hr87nyeu4qm7tr	2022-11-17 23:00:00	2027-11-17 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:41.809	2026-03-24 15:00:41.809	f	\N
cmn4qrxm603qf87ny5gki5hvx	cmn4qpgkf00x387nyg8zpf0xz	cmn4qrv0103hr87nyeu4qm7tr	2023-02-23 23:00:00	2028-02-23 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:41.839	2026-03-24 15:00:41.839	f	\N
cmn4qrxmz03qi87ny0yal2nbc	cmn4qpgls00xa87nyb95frlb0	cmn4qrv0103hr87nyeu4qm7tr	2021-05-26 22:00:00	2026-05-26 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:41.868	2026-03-24 15:00:41.868	f	\N
cmn4qrxnr03ql87ny9i9tf3t9	cmn4qpgv800yc87nyr4syiy9n	cmn4qrv0103hr87nyeu4qm7tr	2023-06-14 22:00:00	2028-06-14 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:41.895	2026-03-24 15:00:41.895	f	\N
cmn4qrxoo03qo87nyiha39hcx	cmn4qpgxp00ym87nya3zbjgis	cmn4qrv0103hr87nyeu4qm7tr	2022-06-23 22:00:00	2027-06-23 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:41.929	2026-03-24 15:00:41.929	f	\N
cmn4qrxph03qr87nyjaocww6p	cmn4qpgz000yt87nyb4zfqm06	cmn4qrv0103hr87nyeu4qm7tr	2022-07-14 22:00:00	2027-07-14 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:41.957	2026-03-24 15:00:41.957	f	\N
cmn4qrxqb03qu87ny8k25s3u6	cmn4qph1c00z387nykdljyrca	cmn4qrv0103hr87nyeu4qm7tr	2020-09-24 22:00:00	2025-09-24 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:41.988	2026-03-24 15:00:41.988	f	\N
cmn4qrxrj03qx87nyyw1d2o61	cmn4qph4z00zl87nyy8e5onpc	cmn4qrv0103hr87nyeu4qm7tr	2017-07-16 22:00:00	2022-07-16 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:42.032	2026-03-24 15:00:42.032	f	\N
cmn4qrxsc03r087nyq3g4cnzz	cmn4qph6j00zu87nym7vreoaa	cmn4qrv0103hr87nyeu4qm7tr	2020-09-17 22:00:00	2025-09-17 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:42.06	2026-03-24 15:00:42.06	f	\N
cmn4qrxt403r387nycwvhnnuz	cmn4qph8u010387nylju11zx1	cmn4qrv0103hr87nyeu4qm7tr	2022-05-12 22:00:00	2027-05-12 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:42.089	2026-03-24 15:00:42.089	f	\N
cmn4qrxtx03r687nynkyh5tgy	cmn4qphdw010r87nyfd2fj0sa	cmn4qrv0103hr87nyeu4qm7tr	2016-12-19 23:00:00	2021-12-19 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:42.117	2026-03-24 15:00:42.117	f	\N
cmn4qrxun03r987nyf0xluo11	cmn4qpho6012287ny4gm2raj4	cmn4qrv0103hr87nyeu4qm7tr	2024-08-26 22:00:00	2029-08-26 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:42.144	2026-03-24 15:00:42.144	f	\N
cmn4qrxvf03rc87nyd1rqjr9t	cmn4qphrf012k87ny9xqp6kw8	cmn4qrv0103hr87nyeu4qm7tr	2020-08-25 22:00:00	2025-08-25 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:42.171	2026-03-24 15:00:42.171	f	\N
cmn4qrxwk03rf87ny1vcu08wh	cmn4qphx1013a87nyqe8h1kor	cmn4qrv0103hr87nyeu4qm7tr	2022-01-20 23:00:00	2027-01-20 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:42.213	2026-03-24 15:00:42.213	f	\N
cmn4qrxxt03ri87nyrih6peds	cmn4qphzb013h87ny69z43upt	cmn4qrv0103hr87nyeu4qm7tr	2021-04-29 22:00:00	2026-04-29 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:42.257	2026-03-24 15:00:42.257	f	\N
cmn4qrxyx03rl87nynw8rfys4	cmn4qpi11013o87ny1zxpr4o7	cmn4qrv0103hr87nyeu4qm7tr	2021-02-17 23:00:00	2026-02-17 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:42.297	2026-03-24 15:00:42.297	f	\N
cmn4qrxzt03ro87nyj9npnpo1	cmn4qpi1z013t87nyltsagjl8	cmn4qrv0103hr87nyeu4qm7tr	2021-02-10 23:00:00	2026-02-10 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:42.329	2026-03-24 15:00:42.329	f	\N
cmn4qry0v03rr87nyj42ou4hr	cmn4qpi2n013w87nyfo4hhp2g	cmn4qrv0103hr87nyeu4qm7tr	2024-04-29 22:00:00	2029-04-29 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:42.367	2026-03-24 15:00:42.367	f	\N
cmn4qry1n03ru87ny3c1fbf7v	cmn4qpi4a014587nye0bxmioc	cmn4qrv0103hr87nyeu4qm7tr	2023-05-29 22:00:00	2028-05-29 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:42.396	2026-03-24 15:00:42.396	f	\N
cmn4qry2g03rx87nyy88b4n18	cmn4qpib1014y87nyx6j6uvxv	cmn4qrv0103hr87nyeu4qm7tr	2024-07-29 22:00:00	2029-07-29 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:42.424	2026-03-24 15:00:42.424	f	\N
cmn4qry3903s087nytoub87jk	cmn4qpk2g01cj87ny43ei7inc	cmn4qrv0103hr87nyeu4qm7tr	2022-12-31 23:00:00	2027-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:42.453	2026-03-24 15:00:42.453	f	\N
cmn4qry3x03s387nyls1p4k8k	cmn4qpk4301cq87nyximxgysu	cmn4qrv0103hr87nyeu4qm7tr	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:42.478	2026-03-24 15:00:42.478	f	\N
cmn4qry4n03s687ny0dzet9cn	cmn4qpkge01e887nyv8h7on83	cmn4qrv0103hr87nyeu4qm7tr	2023-12-31 23:00:00	2028-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:42.503	2026-03-24 15:00:42.503	f	\N
cmn4qry5u03s987nycaelwhcx	cmn4qpkn801f487nyx0dgpr2l	cmn4qrv0103hr87nyeu4qm7tr	2022-12-31 23:00:00	2027-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:42.547	2026-03-24 15:00:42.547	f	\N
cmn4qry6x03sc87ny5bha1hzo	cmn4qpkqo01fl87nyj5ww35i8	cmn4qrv0103hr87nyeu4qm7tr	2024-12-31 23:00:00	2029-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:42.586	2026-03-24 15:00:42.586	f	\N
cmn4qry7o03sf87ny02f019jr	cmn4qpktc01fy87ny4p8tpt46	cmn4qrv0103hr87nyeu4qm7tr	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:42.613	2026-03-24 15:00:42.613	f	\N
cmn4qs2im03sj87nywbnqka63	cmn4qp95e001687ny0kfk06na	cmn4qs2ho03sg87nycc7l5g7q	2021-06-30 22:00:00	2026-06-30 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:48.191	2026-03-24 15:00:48.191	f	\N
cmn4qs2jd03sm87nywm9fc9g5	cmn4qp9g8002i87nyii2j6giy	cmn4qs2ho03sg87nycc7l5g7q	2024-01-14 23:00:00	2029-01-14 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:48.218	2026-03-24 15:00:48.218	f	\N
cmn4qs2kc03sp87ny5rbkm2qr	cmn4qp9ye004v87nyudlegi71	cmn4qs2ho03sg87nycc7l5g7q	2018-05-29 22:00:00	2023-05-29 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:48.253	2026-03-24 15:00:48.253	f	\N
cmn4qs2l503ss87nydmb7tgta	cmn4qpam6007v87nymqs4c757	cmn4qs2ho03sg87nycc7l5g7q	2021-10-01 22:00:00	2026-10-01 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:48.281	2026-03-24 15:00:48.281	f	\N
cmn4qs2lz03sv87nyo6p5h9ll	cmn4qpanv008387nyx4cm98mw	cmn4qs2ho03sg87nycc7l5g7q	2022-04-28 22:00:00	2027-04-28 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:48.312	2026-03-24 15:00:48.312	f	\N
cmn4qs2mw03sy87ny0wsk6b81	cmn4qpapi008b87ny0e4jwt11	cmn4qs2ho03sg87nycc7l5g7q	2024-08-05 22:00:00	2029-08-05 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:48.345	2026-03-24 15:00:48.345	f	\N
cmn4qs2np03t187ny2cwzhcsi	cmn4qpb5u00a887ny5aitfzd4	cmn4qs2ho03sg87nycc7l5g7q	2024-05-28 22:00:00	2029-05-28 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:48.374	2026-03-24 15:00:48.374	f	\N
cmn4qs2og03t487nyurvdm99z	cmn4qpbex00bb87ny3txbvfb6	cmn4qs2ho03sg87nycc7l5g7q	2023-08-28 22:00:00	2028-08-28 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:48.4	2026-03-24 15:00:48.4	f	\N
cmn4qs2pa03t787ny4i3hts9l	cmn4qpbro00cs87ny8nf5az05	cmn4qs2ho03sg87nycc7l5g7q	2018-05-29 22:00:00	2023-05-29 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:48.43	2026-03-24 15:00:48.43	f	\N
cmn4qs2q703ta87nyuon2pzyc	cmn4qpbu300d287nyb0sirec5	cmn4qs2ho03sg87nycc7l5g7q	2024-02-25 23:00:00	2029-02-25 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:48.463	2026-03-24 15:00:48.463	f	\N
cmn4qs2r103td87nykn8iyp1a	cmn4qpc3v00ea87nynovo1ahu	cmn4qs2ho03sg87nycc7l5g7q	2022-10-18 22:00:00	2027-10-18 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:48.494	2026-03-24 15:00:48.494	f	\N
cmn4qs2rz03tg87ny8cqb6xfa	cmn4qpc7l00eo87nyiq0lo2tp	cmn4qs2ho03sg87nycc7l5g7q	2023-06-29 22:00:00	2028-06-29 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:48.528	2026-03-24 15:00:48.528	f	\N
cmn4qs2sp03tj87nymmu8lwlv	cmn4qpcfw00fq87nyk4n2v239	cmn4qs2ho03sg87nycc7l5g7q	2020-12-20 23:00:00	2025-12-20 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:48.554	2026-03-24 15:00:48.554	f	\N
cmn4qs2to03tm87ny0jkpg1e8	cmn4qpd0w00i987nypjmk45sv	cmn4qs2ho03sg87nycc7l5g7q	2023-09-17 22:00:00	2028-09-17 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:48.588	2026-03-24 15:00:48.588	f	\N
cmn4qs2uj03tp87nyttmznjpg	cmn4qpdoy00kz87nyr9p2rreb	cmn4qs2ho03sg87nycc7l5g7q	2023-03-19 23:00:00	2028-03-19 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:48.619	2026-03-24 15:00:48.619	f	\N
cmn4qs2vf03ts87nyqppbqd9f	cmn4qpezq00qc87nyubisut4t	cmn4qs2ho03sg87nycc7l5g7q	2022-01-16 23:00:00	2027-01-16 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:48.651	2026-03-24 15:00:48.651	f	\N
cmn4qs2wf03tv87ny3htda53m	cmn4qpfb100rm87ny5ouap3ib	cmn4qs2ho03sg87nycc7l5g7q	2021-11-15 23:00:00	2026-11-15 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:48.687	2026-03-24 15:00:48.687	f	\N
cmn4qs2xm03ty87nyn6jogzij	cmn4qpgjf00wx87ny2s3gqfik	cmn4qs2ho03sg87nycc7l5g7q	2023-03-27 22:00:00	2028-03-27 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:48.73	2026-03-24 15:00:48.73	f	\N
cmn4qs2yh03u187nyjzfi2c1h	cmn4qph2e00z887ny9wc4tkd2	cmn4qs2ho03sg87nycc7l5g7q	2024-02-25 23:00:00	2029-02-25 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:48.762	2026-03-24 15:00:48.762	f	\N
cmn4qs2zr03u487nymt2goilr	cmn4qphns012087nyqrupqtbl	cmn4qs2ho03sg87nycc7l5g7q	2024-05-30 22:00:00	2029-05-30 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:48.807	2026-03-24 15:00:48.807	f	\N
cmn4qs30s03u787nyex4a1yh5	cmn4qphph012987nydmmzao7z	cmn4qs2ho03sg87nycc7l5g7q	2024-09-16 22:00:00	2029-09-16 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:48.844	2026-03-24 15:00:48.844	f	\N
cmn4qs31r03ua87ny4oeo05ut	cmn4qphuj012z87nyeif1zot9	cmn4qs2ho03sg87nycc7l5g7q	2022-11-17 23:00:00	2027-11-17 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:48.879	2026-03-24 15:00:48.879	f	\N
cmn4qs32i03ud87nyy5il5mg4	cmn4qpi1o013r87nyue82kxgq	cmn4qs2ho03sg87nycc7l5g7q	2024-05-28 22:00:00	2029-05-28 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:48.907	2026-03-24 15:00:48.907	f	\N
cmn4qs33g03ug87nyhd2m2qjv	cmn4qpi9e014s87nylx9jwzgz	cmn4qs2ho03sg87nycc7l5g7q	2023-11-19 23:00:00	2028-11-19 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:48.941	2026-03-24 15:00:48.941	f	\N
cmn4qs9mf03uk87ny8xz7h0e9	cmn4qp91l000o87ny6qn4yctp	cmn4qs9lb03uh87nyhspbzsfm	2024-12-31 23:00:00	2029-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:57.4	2026-03-24 15:00:57.4	f	\N
cmn4qs9na03un87nyqfo9t3np	cmn4qp941001087nyli2c8mim	cmn4qs9lb03uh87nyhspbzsfm	2024-01-08 23:00:00	2029-01-08 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:57.431	2026-03-24 15:00:57.431	f	\N
cmn4qs9oe03uq87ny9jmyy6w7	cmn4qp977001f87nyixdsetam	cmn4qs9lb03uh87nyhspbzsfm	2021-12-31 23:00:00	2026-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:57.471	2026-03-24 15:00:57.471	f	\N
cmn4qs9pd03ut87nyk96ro5ve	cmn4qp9a5001t87nymdzwd5gt	cmn4qs9lb03uh87nyhspbzsfm	2023-05-28 22:00:00	2028-05-28 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:57.506	2026-03-24 15:00:57.506	f	\N
cmn4qs9q503uw87ny3ng01bio	cmn4qp9fn002f87nybkzagkpn	cmn4qs9lb03uh87nyhspbzsfm	2023-08-08 22:00:00	2028-08-08 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:57.534	2026-03-24 15:00:57.534	f	\N
cmn4qs9r503uz87nyptqxbo4l	cmn4qp9k0002y87nywpxflx7m	cmn4qs9lb03uh87nyhspbzsfm	2023-09-13 22:00:00	2028-09-13 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:57.569	2026-03-24 15:00:57.569	f	\N
cmn4qs9rv03v187nyfbm2cfej	cmn4qp9kf003087nyw6obkhx6	cmn4qs9lb03uh87nyhspbzsfm	2023-09-14 22:00:00	2028-09-14 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:57.595	2026-03-24 15:00:57.595	f	\N
cmn4qs9sl03v387nyta99ip31	cmn4qp9l2003287nyfvt55qqu	cmn4qs9lb03uh87nyhspbzsfm	2023-09-13 22:00:00	2028-09-13 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:57.621	2026-03-24 15:00:57.621	f	\N
cmn4qs9tc03v687nyc2nmevgz	cmn4qp9ng003d87ny2rkl8q9y	cmn4qs9lb03uh87nyhspbzsfm	2021-08-23 22:00:00	2026-08-23 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:57.649	2026-03-24 15:00:57.649	f	\N
cmn4qs9u403v887ny90tywjga	cmn4qp9nx003f87nyj0fcqd5m	cmn4qs9lb03uh87nyhspbzsfm	2021-08-23 22:00:00	2026-08-23 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:57.676	2026-03-24 15:00:57.676	f	\N
cmn4qs9vh03vb87ny2934n5gj	cmn4qp9r0003v87nyygijz1sf	cmn4qs9lb03uh87nyhspbzsfm	2023-03-13 23:00:00	2028-03-13 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:57.726	2026-03-24 15:00:57.726	f	\N
cmn4qs9wa03ve87ny0x3wrkwm	cmn4qp9ts004887nyqfw9ac0f	cmn4qs9lb03uh87nyhspbzsfm	2019-09-15 22:00:00	2024-09-15 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:57.754	2026-03-24 15:00:57.754	f	\N
cmn4qs9x403vh87ny7kmgq24a	cmn4qp9xq004s87nyfujwajh0	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:57.785	2026-03-24 15:00:57.785	f	\N
cmn4qs9xv03vk87ny4a11gf7d	cmn4qpa0e005487nylbv3aejb	cmn4qs9lb03uh87nyhspbzsfm	2024-05-02 22:00:00	2029-05-02 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:57.811	2026-03-24 15:00:57.811	f	\N
cmn4qs9yr03vm87nyv4q56v8z	cmn4qpa11005887nyel01ymrl	cmn4qs9lb03uh87nyhspbzsfm	2022-12-14 23:00:00	2027-12-14 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:57.844	2026-03-24 15:00:57.844	f	\N
cmn4qs9zp03vp87nypobo68x0	cmn4qpa4p005p87ny4m51rp2w	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:57.877	2026-03-24 15:00:57.877	f	\N
cmn4qsa0h03vs87nyf9uwld2r	cmn4qpa6z006087nylyoonxqt	cmn4qs9lb03uh87nyhspbzsfm	2024-12-31 23:00:00	2029-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:57.905	2026-03-24 15:00:57.905	f	\N
cmn4qsa1903vv87ny3o3j2pi8	cmn4qpa7x006587nyhkh4ahqh	cmn4qs9lb03uh87nyhspbzsfm	2021-11-25 23:00:00	2026-11-25 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:57.933	2026-03-24 15:00:57.933	f	\N
cmn4qsa2703vy87nyufvt0aqa	cmn4qpack006s87ny5poa1nl6	cmn4qs9lb03uh87nyhspbzsfm	2020-05-08 22:00:00	2025-05-08 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:57.968	2026-03-24 15:00:57.968	f	\N
cmn4qsa3d03w187nyk6uocfg7	cmn4qpait007g87nyi8jp0s3i	cmn4qs9lb03uh87nyhspbzsfm	2023-09-27 22:00:00	2028-09-27 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:58.009	2026-03-24 15:00:58.009	f	\N
cmn4qsa4d03w487nyjqzb3qgo	cmn4qpar3008l87ny0kxl5gzq	cmn4qs9lb03uh87nyhspbzsfm	2024-07-29 22:00:00	2029-07-29 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:58.046	2026-03-24 15:00:58.046	f	\N
cmn4qsa5503w787ny2sg6j82k	cmn4qpat5008w87nye9xrszoi	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:58.073	2026-03-24 15:00:58.073	f	\N
cmn4qsa5w03w987nyvju81kl5	cmn4qpatj008y87nyr58xhn5z	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:58.101	2026-03-24 15:00:58.101	f	\N
cmn4qsa6n03wc87nyhf0ndfy3	cmn4qpb7x00ai87nyf45wfflc	cmn4qs9lb03uh87nyhspbzsfm	2022-01-12 23:00:00	2027-01-12 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:58.127	2026-03-24 15:00:58.127	f	\N
cmn4qsa7d03we87nyzrbn56lf	cmn4qpb8v00am87nyfueno4hi	cmn4qs9lb03uh87nyhspbzsfm	2024-10-03 22:00:00	2029-10-03 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:58.153	2026-03-24 15:00:58.153	f	\N
cmn4qsa8c03wh87nyayor03ew	cmn4qpbbp00ax87nyb13tti6w	cmn4qs9lb03uh87nyhspbzsfm	2023-07-25 22:00:00	2028-07-25 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:58.189	2026-03-24 15:00:58.189	f	\N
cmn4qsa9203wj87ny9mhm9sq0	cmn4qpbca00az87nyxqsbq84h	cmn4qs9lb03uh87nyhspbzsfm	2023-06-29 22:00:00	2028-06-29 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:58.214	2026-03-24 15:00:58.214	f	\N
cmn4qsa9s03wm87nyheruft2b	cmn4qpbfm00bf87nyup15wzta	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:58.24	2026-03-24 15:00:58.24	f	\N
cmn4qsaai03wp87nywnp5bh1q	cmn4qpbi900br87nyx4ayfj6u	cmn4qs9lb03uh87nyhspbzsfm	2023-09-20 22:00:00	2028-09-20 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:58.267	2026-03-24 15:00:58.267	f	\N
cmn4qsabj03ws87nyn8d2hs4k	cmn4qpbiz00bv87nyhhtoeqgt	cmn4qs9lb03uh87nyhspbzsfm	2022-09-27 22:00:00	2027-09-27 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:58.303	2026-03-24 15:00:58.303	f	\N
cmn4qsacl03wu87ny2rc1jw9c	cmn4qpbjd00bx87nygkmkwi5a	cmn4qs9lb03uh87nyhspbzsfm	2022-09-15 22:00:00	2027-09-15 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:58.341	2026-03-24 15:00:58.341	f	\N
cmn4qsadk03wx87nytt9d76r0	cmn4qpboq00cf87nyxp19mxve	cmn4qs9lb03uh87nyhspbzsfm	2024-11-06 23:00:00	2029-11-06 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:58.377	2026-03-24 15:00:58.377	f	\N
cmn4qsaeh03x087nyq0rmbtgx	cmn4qpbuk00d487nymow3pr2z	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:58.41	2026-03-24 15:00:58.41	f	\N
cmn4qsaf803x287ny3bb5y8a9	cmn4qpbuw00d687ny54rvn7bq	cmn4qs9lb03uh87nyhspbzsfm	2024-03-21 23:00:00	2029-03-21 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:58.437	2026-03-24 15:00:58.437	f	\N
cmn4qsag403x487nyp3mopyqn	cmn4qpbv800d887nyicc7e16a	cmn4qs9lb03uh87nyhspbzsfm	2024-03-21 23:00:00	2029-03-21 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:58.469	2026-03-24 15:00:58.469	f	\N
cmn4qsah103x787nyeup3etpi	cmn4qpbym00dr87nyf4r0gaqj	cmn4qs9lb03uh87nyhspbzsfm	2017-05-11 22:00:00	2022-05-11 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:58.501	2026-03-24 15:00:58.501	f	\N
cmn4qsahu03x987nye6by3phs	cmn4qpbzb00dv87nyzyhrw61g	cmn4qs9lb03uh87nyhspbzsfm	2024-04-15 22:00:00	2029-04-15 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:58.531	2026-03-24 15:00:58.531	f	\N
cmn4qsaim03xc87nymobluilg	cmn4qpc1500e287ny68ge8fb7	cmn4qs9lb03uh87nyhspbzsfm	2021-07-18 22:00:00	2026-07-18 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:58.558	2026-03-24 15:00:58.558	f	\N
cmn4qsajc03xf87ny41xy7ikw	cmn4qpc2d00e587nyohjzmkic	cmn4qs9lb03uh87nyhspbzsfm	2024-07-04 22:00:00	2029-07-04 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:58.585	2026-03-24 15:00:58.585	f	\N
cmn4qsak403xh87nycr6xuuub	cmn4qpc2x00e787ny72bvh60m	cmn4qs9lb03uh87nyhspbzsfm	2024-07-04 22:00:00	2029-07-04 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:58.612	2026-03-24 15:00:58.612	f	\N
cmn4qsaky03xk87nyh4jw3gx8	cmn4qpc4s00ee87ny06h5jzu9	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:58.643	2026-03-24 15:00:58.643	f	\N
cmn4qsalr03xn87ny6f42se00	cmn4qpca700ez87nyouhkg223	cmn4qs9lb03uh87nyhspbzsfm	2024-04-10 22:00:00	2029-04-10 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:58.672	2026-03-24 15:00:58.672	f	\N
cmn4qsang03xt87ny52xqp9o6	cmn4qpce000fh87ny0memgeng	cmn4qs9lb03uh87nyhspbzsfm	2022-09-15 22:00:00	2027-09-15 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:58.732	2026-03-24 15:00:58.732	f	\N
cmn4qsaoa03xw87nyvqp69cbv	cmn4qpcgt00fu87nyqve4pwql	cmn4qs9lb03uh87nyhspbzsfm	2021-01-24 23:00:00	2026-01-24 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:58.762	2026-03-24 15:00:58.762	f	\N
cmn4qsap103xz87ny5uz1vmue	cmn4qpcpj00gx87nyqdjcn77o	cmn4qs9lb03uh87nyhspbzsfm	2024-08-04 22:00:00	2029-08-04 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:58.789	2026-03-24 15:00:58.789	f	\N
cmn4qsapp03y187nyb70cbqmr	cmn4qpcpz00gz87ny98glz6lb	cmn4qs9lb03uh87nyhspbzsfm	2024-08-04 22:00:00	2029-08-04 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:58.814	2026-03-24 15:00:58.814	f	\N
cmn4qsaqf03y487nyva3jb8hf	cmn4qpcst00h987nypz669eoj	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	FORMAZIONE FINANZIATA: REPERIRE ATTESTAT	2026-03-24 15:00:58.839	2026-03-24 15:00:58.839	f	\N
cmn4qsar503y687nys5mtfggq	cmn4qpcta00hb87nyi0q15gqn	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	FORMAZIONE FINANZIATA: REPERIRE ATTESTATI	2026-03-24 15:00:58.865	2026-03-24 15:00:58.865	f	\N
cmn4qsarw03y987nysgt5xtwi	cmn4qpcvp00hm87ny5xsovzzd	cmn4qs9lb03uh87nyhspbzsfm	2023-06-11 22:00:00	2028-06-11 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:58.893	2026-03-24 15:00:58.893	f	\N
cmn4qsasn03yc87nyylje1inq	cmn4qpcxf00hv87ny3tb9xt30	cmn4qs9lb03uh87nyhspbzsfm	2024-08-25 22:00:00	2029-08-25 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:58.919	2026-03-24 15:00:58.919	f	\N
cmn4qsate03ye87nyscw4zubb	cmn4qpcyp00i187ny0zeekbzg	cmn4qs9lb03uh87nyhspbzsfm	2021-09-29 22:00:00	2026-09-29 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:58.946	2026-03-24 15:00:58.946	f	\N
cmn4qsauo03yh87ny54qxjmus	cmn4qpd2a00ig87nylfecbcgq	cmn4qs9lb03uh87nyhspbzsfm	2023-12-04 23:00:00	2028-12-04 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:58.992	2026-03-24 15:00:58.992	f	\N
cmn4qsavi03yk87ny8me6zknv	cmn4qpd6100iw87nyd7h836e8	cmn4qs9lb03uh87nyhspbzsfm	2018-07-15 22:00:00	2023-07-15 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:59.022	2026-03-24 15:00:59.022	f	\N
cmn4qsawg03yn87nyxhw17461	cmn4qpde400jt87ny1b73etps	cmn4qs9lb03uh87nyhspbzsfm	2024-09-10 22:00:00	2029-09-10 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:59.057	2026-03-24 15:00:59.057	f	\N
cmn4qsaxb03yp87nybc8etw29	cmn4qpdem00jv87nym5op8aeg	cmn4qs9lb03uh87nyhspbzsfm	2019-09-10 22:00:00	2024-09-10 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:59.088	2026-03-24 15:00:59.088	f	\N
cmn4qsay803yr87nyutq0p46k	cmn4qpdf000jx87ny1lnwzinb	cmn4qs9lb03uh87nyhspbzsfm	2023-12-31 23:00:00	2028-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:59.12	2026-03-24 15:00:59.12	f	\N
cmn4qsaz603yu87ny2xgx1r1s	cmn4qpdgj00k287nyqe191f7t	cmn4qs9lb03uh87nyhspbzsfm	2019-04-18 22:00:00	2024-04-18 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:59.155	2026-03-24 15:00:59.155	f	\N
cmn4qsazz03yx87nyfp2jp7qj	cmn4qpdjl00kd87ny5ajqfynj	cmn4qs9lb03uh87nyhspbzsfm	2023-07-18 22:00:00	2028-07-18 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:59.184	2026-03-24 15:00:59.184	f	\N
cmn4qsb0s03yz87nyfbirtfwk	cmn4qpdl000kj87ny19cjx3oj	cmn4qs9lb03uh87nyhspbzsfm	2023-07-17 22:00:00	2028-07-17 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:59.213	2026-03-24 15:00:59.213	f	\N
cmn4qsb1n03z287ny0qwumlc7	cmn4qpdqe00l587nyc0wbqsqb	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:59.244	2026-03-24 15:00:59.244	f	\N
cmn4qsb2o03z587nyjee7ffcv	cmn4qpdva00ln87nyww5tnucz	cmn4qs9lb03uh87nyhspbzsfm	2022-01-23 23:00:00	2027-01-23 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:59.28	2026-03-24 15:00:59.28	f	\N
cmn4qsb3d03z887nyq4jjhub6	cmn4qpdyh00m187ny40yukrpw	cmn4qs9lb03uh87nyhspbzsfm	2021-08-08 22:00:00	2026-08-08 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:59.305	2026-03-24 15:00:59.305	f	\N
cmn4qsb4c03zb87nyapsks5sd	cmn4qpe5200ms87ny7lpm9gt8	cmn4qs9lb03uh87nyhspbzsfm	2024-08-04 22:00:00	2029-08-04 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:59.34	2026-03-24 15:00:59.34	f	\N
cmn4qsb5803ze87nym2kf5ehy	cmn4qpe7200mz87nyq32yglsd	cmn4qs9lb03uh87nyhspbzsfm	2023-09-14 22:00:00	2028-09-14 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:59.372	2026-03-24 15:00:59.372	f	\N
cmn4qsb5w03zh87nylwi7hrw7	cmn4qpe8500n487nygcbcp2np	cmn4qs9lb03uh87nyhspbzsfm	2022-01-23 23:00:00	2027-01-23 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:59.396	2026-03-24 15:00:59.396	f	\N
cmn4qsb6n03zk87nyx9qhbrw7	cmn4qpe9e00n987nykkq1f6cq	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:59.424	2026-03-24 15:00:59.424	f	\N
cmn4qsb7n03zn87nyouq4hove	cmn4qpeav00ne87ny09kl72r9	cmn4qs9lb03uh87nyhspbzsfm	2021-05-27 22:00:00	2026-05-27 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:59.46	2026-03-24 15:00:59.46	f	\N
cmn4qsb8k03zq87nysdxtddtz	cmn4qpef700ny87nyunrl6drj	cmn4qs9lb03uh87nyhspbzsfm	2024-08-04 22:00:00	2029-08-04 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:59.492	2026-03-24 15:00:59.492	f	\N
cmn4qsb9b03zt87nyld2ge0ne	cmn4qpefp00o087ny6sgi5x0w	cmn4qs9lb03uh87nyhspbzsfm	2024-08-04 22:00:00	2029-08-04 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:59.52	2026-03-24 15:00:59.52	f	\N
cmn4qsba503zw87nyl6mria7a	cmn4qpehg00o987nyrdks3ztu	cmn4qs9lb03uh87nyhspbzsfm	2024-04-18 22:00:00	2029-04-18 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:59.549	2026-03-24 15:00:59.549	f	\N
cmn4qsbaz03zy87ny3a40h269	cmn4qpehu00ob87nyvymqs5x2	cmn4qs9lb03uh87nyhspbzsfm	2024-04-29 22:00:00	2029-04-29 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:59.58	2026-03-24 15:00:59.58	f	\N
cmn4qsbbr040187nyn0bt994w	cmn4qpeso00pk87nykztc06jm	cmn4qs9lb03uh87nyhspbzsfm	2023-05-29 22:00:00	2028-05-29 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:59.607	2026-03-24 15:00:59.607	f	\N
cmn4qsbcy040487ny50ellevv	cmn4qpevc00pv87ny9lxxqpq8	cmn4qs9lb03uh87nyhspbzsfm	2023-08-07 22:00:00	2028-08-07 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:59.65	2026-03-24 15:00:59.65	f	\N
cmn4qsbe0040787nym6ihsu0o	cmn4qpeyh00q787ny9e7ej35y	cmn4qs9lb03uh87nyhspbzsfm	2022-07-05 22:00:00	2027-07-05 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:59.688	2026-03-24 15:00:59.688	f	\N
cmn4qsbf0040987nyelx5vwuc	cmn4qpeyt00q987nyldarw0o8	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:59.725	2026-03-24 15:00:59.725	f	\N
cmn4qsbgg040c87ny9dajbl8d	cmn4qpf1y00qn87nyqr1q0lpo	cmn4qs9lb03uh87nyhspbzsfm	2023-01-31 23:00:00	2028-01-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:59.777	2026-03-24 15:00:59.777	f	\N
cmn4qsbh9040f87nyqkzj42i7	cmn4qpf8z00rg87nyastsd922	cmn4qs9lb03uh87nyhspbzsfm	2023-07-10 22:00:00	2028-07-10 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:59.805	2026-03-24 15:00:59.805	f	\N
cmn4qsbie040i87ny3pmxhmm1	cmn4qpfce00rt87nyahun5zrx	cmn4qs9lb03uh87nyhspbzsfm	2024-04-23 22:00:00	2029-04-23 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:59.846	2026-03-24 15:00:59.846	f	\N
cmn4qsbj6040l87ny4mpddnxl	cmn4qpfeq00s587ny2som67vu	cmn4qs9lb03uh87nyhspbzsfm	2024-06-26 22:00:00	2029-06-26 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:59.874	2026-03-24 15:00:59.874	f	\N
cmn4qsbjy040o87nym6mvjr7a	cmn4qpffp00sa87nyvbwfslju	cmn4qs9lb03uh87nyhspbzsfm	2024-05-14 22:00:00	2029-05-14 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:59.902	2026-03-24 15:00:59.902	f	\N
cmn4qsbkp040r87ny36l8e9kz	cmn4qpfiz00sm87ny1zdmolu8	cmn4qs9lb03uh87nyhspbzsfm	2023-11-30 23:00:00	2028-11-30 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:59.93	2026-03-24 15:00:59.93	f	\N
cmn4qsblj040u87ny8iyqeu7m	cmn4qpfo300t687ny614ihhvs	cmn4qs9lb03uh87nyhspbzsfm	2024-08-04 22:00:00	2029-08-04 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:59.959	2026-03-24 15:00:59.959	f	\N
cmn4qsbmj040x87ny7c09ns03	cmn4qpft500tr87ny7wqestf0	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:00:59.996	2026-03-24 15:00:59.996	f	\N
cmn4qsbnv041087nyw7i88puq	cmn4qpfvo00u187nyur4665tp	cmn4qs9lb03uh87nyhspbzsfm	2020-11-01 23:00:00	2025-11-01 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:00.043	2026-03-24 15:01:00.043	f	\N
cmn4qsbot041387nyjqvz0aaa	cmn4qpfwc00u587nyb9ghglgm	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:00.078	2026-03-24 15:01:00.078	f	\N
cmn4qsbpy041687ny27n58b71	cmn4qpfzl00uk87nyawvja1oi	cmn4qs9lb03uh87nyhspbzsfm	2024-09-09 22:00:00	2029-09-09 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:00.118	2026-03-24 15:01:00.118	f	\N
cmn4qsbr0041987nypmpadjhg	cmn4qpg0k00up87nymov9egbc	cmn4qs9lb03uh87nyhspbzsfm	2024-02-14 23:00:00	2029-02-14 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:00.157	2026-03-24 15:01:00.157	f	\N
cmn4qsbs1041c87nye2ejnv6f	cmn4qpg5100v687nyf6v1q0do	cmn4qs9lb03uh87nyhspbzsfm	2023-07-23 22:00:00	2028-07-23 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:00.194	2026-03-24 15:01:00.194	f	\N
cmn4qsbt0041f87nykmhm0l1m	cmn4qpg5y00vb87nyewf5rkpl	cmn4qs9lb03uh87nyhspbzsfm	2023-01-29 23:00:00	2028-01-29 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:00.229	2026-03-24 15:01:00.229	f	\N
cmn4qsbtv041i87nyna8j5tq3	cmn4qpg7b00vh87nyly8ghug9	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:00.259	2026-03-24 15:01:00.259	f	\N
cmn4qsbul041l87ny9tfms34p	cmn4qpg8j00vm87nyadt9mc92	cmn4qs9lb03uh87nyhspbzsfm	2022-11-16 23:00:00	2027-11-16 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:00.286	2026-03-24 15:01:00.286	f	\N
cmn4qsbvn041o87nytn2tuv83	cmn4qpgav00vu87nyco2vi1wz	cmn4qs9lb03uh87nyhspbzsfm	2023-07-18 22:00:00	2028-07-18 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:00.323	2026-03-24 15:01:00.323	f	\N
cmn4qsbx2041r87ny1rja00nn	cmn4qpgfv00wh87nysdv6yqwz	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:00.374	2026-03-24 15:01:00.374	f	\N
cmn4qsbxu041t87nyxr6xkhp8	cmn4qpgg600wj87nyt3turc9a	cmn4qs9lb03uh87nyhspbzsfm	2024-10-31 23:00:00	2029-10-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:00.402	2026-03-24 15:01:00.402	f	\N
cmn4qsbyk041w87nyln9hr6bo	cmn4qpghb00wo87ny08k330bf	cmn4qs9lb03uh87nyhspbzsfm	2023-10-24 22:00:00	2028-10-24 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:00.428	2026-03-24 15:01:00.428	f	\N
cmn4qsbzb041z87nyebah4ltu	cmn4qpgiu00wu87ny7ivs2gpx	cmn4qs9lb03uh87nyhspbzsfm	2022-11-16 23:00:00	2027-11-16 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:00.456	2026-03-24 15:01:00.456	f	\N
cmn4qsc08042287nyv01mr2l6	cmn4qpgk200x187nyvsqnal5z	cmn4qs9lb03uh87nyhspbzsfm	2022-06-05 22:00:00	2027-06-05 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:00.489	2026-03-24 15:01:00.489	f	\N
cmn4qsc12042487nyip19d8sx	cmn4qpgkf00x387nyg8zpf0xz	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:00.518	2026-03-24 15:01:00.518	f	\N
cmn4qsc1v042787ny3wefp8x2	cmn4qpglh00x887nyzpkrlibg	cmn4qs9lb03uh87nyhspbzsfm	2025-11-11 23:00:00	2030-11-11 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:00.547	2026-03-24 15:01:00.547	f	\N
cmn4qsc2o042987nysa6lgsgy	cmn4qpgls00xa87nyb95frlb0	cmn4qs9lb03uh87nyhspbzsfm	2023-07-10 22:00:00	2028-07-10 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:00.576	2026-03-24 15:01:00.576	f	\N
cmn4qsc3i042b87nytl2lyjb0	cmn4qpgm400xc87ny4b6awkkj	cmn4qs9lb03uh87nyhspbzsfm	2025-04-24 22:00:00	2030-04-24 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:00.606	2026-03-24 15:01:00.606	f	\N
cmn4qsc49042d87nyxg46yuw0	cmn4qpgmw00xg87ny8dfnv7uh	cmn4qs9lb03uh87nyhspbzsfm	2025-11-05 23:00:00	2030-11-05 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:00.634	2026-03-24 15:01:00.634	f	\N
cmn4qsc5c042g87nygx1frvw4	cmn4qpgoy00xn87nykecg4sue	cmn4qs9lb03uh87nyhspbzsfm	2022-10-30 23:00:00	2027-10-30 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:00.673	2026-03-24 15:01:00.673	f	\N
cmn4qsc62042i87nyh8jrpnhi	cmn4qpgpa00xp87nyu901kreo	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:00.698	2026-03-24 15:01:00.698	f	\N
cmn4qsc6u042l87nyovzj1mkl	cmn4qpgs700xz87nyb7atbntq	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:00.726	2026-03-24 15:01:00.726	f	\N
cmn4qsc7k042o87nybvcxr5d1	cmn4qpgt400y487nyf0w1kair	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:00.753	2026-03-24 15:01:00.753	f	\N
cmn4qsc8o042r87ny5x0srt2v	cmn4qpgv800yc87nyr4syiy9n	cmn4qs9lb03uh87nyhspbzsfm	2023-07-11 22:00:00	2028-07-11 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:00.792	2026-03-24 15:01:00.792	f	\N
cmn4qsc9i042u87nyrwqmp73h	cmn4qpgwk00yh87nyh3p9jy5u	cmn4qs9lb03uh87nyhspbzsfm	2024-10-23 22:00:00	2029-10-23 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:00.823	2026-03-24 15:01:00.823	f	\N
cmn4qscaj042x87nycperimpy	cmn4qpgxp00ym87nya3zbjgis	cmn4qs9lb03uh87nyhspbzsfm	2022-05-17 22:00:00	2027-05-17 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:00.859	2026-03-24 15:01:00.859	f	\N
cmn4qscb7042z87nyqofnpd94	cmn4qpgy100yo87nypa5krkme	cmn4qs9lb03uh87nyhspbzsfm	2022-05-17 22:00:00	2027-05-17 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:00.883	2026-03-24 15:01:00.883	f	\N
cmn4qscbz043287nyqvwstnfx	cmn4qpgz000yt87nyb4zfqm06	cmn4qs9lb03uh87nyhspbzsfm	2022-07-13 22:00:00	2027-07-13 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:00.912	2026-03-24 15:01:00.912	f	\N
cmn4qsccr043587nycmktwpax	cmn4qph1c00z387nykdljyrca	cmn4qs9lb03uh87nyhspbzsfm	2023-01-04 23:00:00	2028-01-04 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:00.94	2026-03-24 15:01:00.94	f	\N
cmn4qscdt043787nydvelbiiy	cmn4qph1n00z587nyhb177cj4	cmn4qs9lb03uh87nyhspbzsfm	2024-02-06 23:00:00	2029-02-06 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:00.977	2026-03-24 15:01:00.977	f	\N
cmn4qsceu043a87nyn6lt8b6b	cmn4qph2q00za87ny0vo4iono	cmn4qs9lb03uh87nyhspbzsfm	2024-03-05 23:00:00	2029-03-05 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:01.014	2026-03-24 15:01:01.014	f	\N
cmn4qscfr043d87nyqmek5vvf	cmn4qph4z00zl87nyy8e5onpc	cmn4qs9lb03uh87nyhspbzsfm	2023-08-08 22:00:00	2028-08-08 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:01.047	2026-03-24 15:01:01.047	f	\N
cmn4qscgg043f87nyvtqp718v	cmn4qph5a00zn87nyefi6zc53	cmn4qs9lb03uh87nyhspbzsfm	2024-08-04 22:00:00	2029-08-04 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:01.072	2026-03-24 15:01:01.072	f	\N
cmn4qschj043h87nya7h0f2nj	cmn4qph5l00zp87nygqmq8sfb	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:01.111	2026-03-24 15:01:01.111	f	\N
cmn4qscio043k87nyt2ayg228	cmn4qph6j00zu87nym7vreoaa	cmn4qs9lb03uh87nyhspbzsfm	2023-10-03 22:00:00	2028-10-03 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:01.153	2026-03-24 15:01:01.153	f	\N
cmn4qscjt043m87nyitmn4hb6	cmn4qph6w00zw87nynytnulld	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:01.194	2026-03-24 15:01:01.194	f	\N
cmn4qsckp043o87nyl9q3toot	cmn4qph7900zy87ny2yru1ft8	cmn4qs9lb03uh87nyhspbzsfm	2024-06-16 22:00:00	2029-06-16 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:01.225	2026-03-24 15:01:01.225	f	\N
cmn4qsclf043q87ny8uppvqgu	cmn4qph7q010087ny9zguvp52	cmn4qs9lb03uh87nyhspbzsfm	2024-06-16 22:00:00	2029-06-16 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:01.251	2026-03-24 15:01:01.251	f	\N
cmn4qscm6043t87nymuie7jvb	cmn4qph8u010387nylju11zx1	cmn4qs9lb03uh87nyhspbzsfm	2023-07-26 22:00:00	2028-07-26 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:01.279	2026-03-24 15:01:01.279	f	\N
cmn4qscmx043v87nyfqvgkv97	cmn4qph96010587nydsrhk09e	cmn4qs9lb03uh87nyhspbzsfm	2023-07-26 22:00:00	2028-07-26 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:01.305	2026-03-24 15:01:01.305	f	\N
cmn4qscnp043x87nyg23b8tkx	cmn4qph9h010787nynt5918ec	cmn4qs9lb03uh87nyhspbzsfm	2023-07-26 22:00:00	2028-07-26 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:01.333	2026-03-24 15:01:01.333	f	\N
cmn4qscor043z87ny9sfcy1en	cmn4qph9t010987nyx938zs0d	cmn4qs9lb03uh87nyhspbzsfm	2023-07-26 22:00:00	2028-07-26 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:01.371	2026-03-24 15:01:01.371	f	\N
cmn4qscpg044187nyinqcju9h	cmn4qpha9010b87ny84zc7gc1	cmn4qs9lb03uh87nyhspbzsfm	2023-10-26 22:00:00	2028-10-26 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:01.396	2026-03-24 15:01:01.396	f	\N
cmn4qscqs044387nyt7ecdtnv	cmn4qphak010d87nytn87ez09	cmn4qs9lb03uh87nyhspbzsfm	2023-07-26 22:00:00	2028-07-26 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:01.444	2026-03-24 15:01:01.444	f	\N
cmn4qscrn044587ny1wps0poj	cmn4qphau010f87nyw4rngixh	cmn4qs9lb03uh87nyhspbzsfm	2023-07-26 22:00:00	2028-07-26 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:01.475	2026-03-24 15:01:01.475	f	\N
cmn4qscsy044887nynwur583l	cmn4qphbx010k87nyut3jq4u3	cmn4qs9lb03uh87nyhspbzsfm	2023-10-12 22:00:00	2028-10-12 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:01.522	2026-03-24 15:01:01.522	f	\N
cmn4qsctz044a87nymtwram1l	cmn4qphca010m87nyrivqvync	cmn4qs9lb03uh87nyhspbzsfm	2020-04-06 22:00:00	2025-04-06 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:01.559	2026-03-24 15:01:01.559	f	\N
cmn4qscv0044d87nyqww09kwd	cmn4qphdw010r87nyfd2fj0sa	cmn4qs9lb03uh87nyhspbzsfm	2022-03-31 22:00:00	2027-03-31 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:01.596	2026-03-24 15:01:01.596	f	\N
cmn4qscvu044f87nytxprmjlu	cmn4qpheg010t87ny3xr39wed	cmn4qs9lb03uh87nyhspbzsfm	2022-03-07 23:00:00	2027-03-07 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:01.627	2026-03-24 15:01:01.627	f	\N
cmn4qscwo044h87ny76dp5fne	cmn4qphey010v87nycaqgthsy	cmn4qs9lb03uh87nyhspbzsfm	2022-03-07 23:00:00	2027-03-07 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:01.656	2026-03-24 15:01:01.656	f	\N
cmn4qscxc044j87nykr4mb6w2	cmn4qphfh010x87ny2gfy3hm0	cmn4qs9lb03uh87nyhspbzsfm	2022-03-07 23:00:00	2027-03-07 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:01.68	2026-03-24 15:01:01.68	f	\N
cmn4qscyb044m87nykfq30j71	cmn4qpho6012287ny4gm2raj4	cmn4qs9lb03uh87nyhspbzsfm	2024-08-26 22:00:00	2029-08-26 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:01.715	2026-03-24 15:01:01.715	f	\N
cmn4qscyy044o87nyggivab1e	cmn4qphoi012487ny8n204jok	cmn4qs9lb03uh87nyhspbzsfm	2024-07-21 22:00:00	2029-07-21 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:01.739	2026-03-24 15:01:01.739	f	\N
cmn4qsczu044q87nyfax8eo17	cmn4qphov012687ny7rhasvnd	cmn4qs9lb03uh87nyhspbzsfm	2024-07-21 22:00:00	2029-07-21 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:01.77	2026-03-24 15:01:01.77	f	\N
cmn4qsd0q044t87nyxiqfrcvq	cmn4qphrf012k87ny9xqp6kw8	cmn4qs9lb03uh87nyhspbzsfm	2020-08-23 22:00:00	2025-08-23 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:01.802	2026-03-24 15:01:01.802	f	\N
cmn4qsd1m044v87nys45cvbrm	cmn4qphrz012m87nyos9wx4om	cmn4qs9lb03uh87nyhspbzsfm	2020-08-06 22:00:00	2025-08-06 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:01.835	2026-03-24 15:01:01.835	f	\N
cmn4qsd2w044x87nyq3p51a75	cmn4qphsd012o87ny1fyhled9	cmn4qs9lb03uh87nyhspbzsfm	2020-09-20 22:00:00	2025-09-20 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:01.88	2026-03-24 15:01:01.88	f	\N
cmn4qsd3w045087nyd9wo5dgd	cmn4qphwa013687nynhrwgjcw	cmn4qs9lb03uh87nyhspbzsfm	2022-01-23 23:00:00	2027-01-23 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:01.916	2026-03-24 15:01:01.916	f	\N
cmn4qsd4p045287nydq3kiipe	cmn4qphwp013887nycyp6p2sa	cmn4qs9lb03uh87nyhspbzsfm	2022-01-23 23:00:00	2027-01-23 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:01.945	2026-03-24 15:01:01.945	f	\N
cmn4qsd5g045487nynhoj7nzi	cmn4qphx1013a87nyqe8h1kor	cmn4qs9lb03uh87nyhspbzsfm	2022-01-23 23:00:00	2027-01-23 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:01.973	2026-03-24 15:01:01.973	f	\N
cmn4qsd6a045787nyqgqwgvo9	cmn4qpi1z013t87nyltsagjl8	cmn4qs9lb03uh87nyhspbzsfm	2024-04-22 22:00:00	2029-04-22 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:02.003	2026-03-24 15:01:02.003	f	\N
cmn4qsd78045a87ny0d86klk4	cmn4qpi4a014587nye0bxmioc	cmn4qs9lb03uh87nyhspbzsfm	2023-05-30 22:00:00	2028-05-30 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:02.037	2026-03-24 15:01:02.037	f	\N
cmn4qsd81045d87nyh7vbv7vv	cmn4qpi6g014e87nysae854bs	cmn4qs9lb03uh87nyhspbzsfm	2024-07-21 22:00:00	2029-07-21 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:02.065	2026-03-24 15:01:02.065	f	\N
cmn4qsd8t045g87nyo9k6y3og	cmn4qpi7s014l87ny0j07jehr	cmn4qs9lb03uh87nyhspbzsfm	2020-09-09 22:00:00	2025-09-09 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:02.094	2026-03-24 15:01:02.094	f	\N
cmn4qsd9j045i87nycd86okxb	cmn4qpi87014n87nyxcjl9343	cmn4qs9lb03uh87nyhspbzsfm	2023-04-18 22:00:00	2028-04-18 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:02.12	2026-03-24 15:01:02.12	f	\N
cmn4qsdab045k87nyk7xgy74b	cmn4qpi8l014p87nywnpj7ntl	cmn4qs9lb03uh87nyhspbzsfm	2023-11-16 23:00:00	2028-11-16 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:02.147	2026-03-24 15:01:02.147	f	\N
cmn4qsdbf045n87nysk7d9smp	cmn4qpia2014u87nykuld0maa	cmn4qs9lb03uh87nyhspbzsfm	2023-11-20 23:00:00	2028-11-20 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:02.187	2026-03-24 15:01:02.187	f	\N
cmn4qsdca045p87nyvmqr9aw4	cmn4qpib1014y87nyx6j6uvxv	cmn4qs9lb03uh87nyhspbzsfm	2023-10-15 22:00:00	2028-10-15 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:02.218	2026-03-24 15:01:02.218	f	\N
cmn4qsdd2045s87ny1mp0nx9q	cmn4qpidr015c87nydi11x6gi	cmn4qs9lb03uh87nyhspbzsfm	2025-06-03 22:00:00	2030-06-03 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:02.246	2026-03-24 15:01:02.246	f	\N
cmn4qsddu045v87nyvs7xgvo8	cmn4qpihe015u87nyx16ia132	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:02.274	2026-03-24 15:01:02.274	f	\N
cmn4qsdel045y87ny1seslzgq	cmn4qpin7016n87nykookhis5	cmn4qs9lb03uh87nyhspbzsfm	2024-05-31 22:00:00	2029-05-31 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:02.302	2026-03-24 15:01:02.302	f	\N
cmn4qsdfg046087ny8adq8i4r	cmn4qpinp016p87nyd8pi1kg2	cmn4qs9lb03uh87nyhspbzsfm	2024-05-31 22:00:00	2029-05-31 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:02.332	2026-03-24 15:01:02.332	f	\N
cmn4qsdgd046387ny0ud9nqyk	cmn4qpip9016v87nyy2fqexlr	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:02.366	2026-03-24 15:01:02.366	f	\N
cmn4qsdhm046587ny1zljkgrn	cmn4qpiri017487ny63vy8e03	cmn4qs9lb03uh87nyhspbzsfm	2020-12-31 23:00:00	2025-12-31 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:02.411	2026-03-24 15:01:02.411	f	\N
cmn4qsdij046887nyt3nsdtby	cmn4qpiw0017l87nyq78cdvn6	cmn4qs9lb03uh87nyhspbzsfm	2022-02-28 23:00:00	2027-02-28 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:02.444	2026-03-24 15:01:02.444	f	\N
cmn4qsdjb046a87nyksoeausz	cmn4qpiwd017n87ny4e4jiemj	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:02.471	2026-03-24 15:01:02.471	f	\N
cmn4qsdka046c87ny639pjplz	cmn4qpiwp017p87nyy0dlcj00	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:02.506	2026-03-24 15:01:02.506	f	\N
cmn4qsdld046f87nyqijskpyh	cmn4qpiym017w87nyod8uuz6l	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:02.545	2026-03-24 15:01:02.545	f	\N
cmn4qsdm5046h87nysq9n87cc	cmn4qpj0d018287nyit1bxi9h	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:02.574	2026-03-24 15:01:02.574	f	\N
cmn4qsdmz046j87nyul4to6z3	cmn4qpj0o018487nyiickkasd	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:02.604	2026-03-24 15:01:02.604	f	\N
cmn4qsdnq046m87nymqlyekso	cmn4qpj1z018b87ny36u774d7	cmn4qs9lb03uh87nyhspbzsfm	2023-02-28 23:00:00	2028-02-29 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:02.63	2026-03-24 15:01:02.63	f	\N
cmn4qsdof046o87nyekq2h1m9	cmn4qpj2c018d87nymfvb3o7m	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:02.656	2026-03-24 15:01:02.656	f	\N
cmn4qsdp5046r87nyyzlgx548	cmn4qpj36018g87nydj74lwpe	cmn4qs9lb03uh87nyhspbzsfm	2018-10-09 22:00:00	2023-10-09 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:02.681	2026-03-24 15:01:02.681	f	\N
cmn4qsdpv046t87nylkcnfcx0	cmn4qpj3p018i87nyu96voqjw	cmn4qs9lb03uh87nyhspbzsfm	2023-02-16 23:00:00	2028-02-16 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:02.708	2026-03-24 15:01:02.708	f	\N
cmn4qsdqj046v87ny7qc2r5c2	cmn4qpj45018k87nybqgbupsp	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:02.732	2026-03-24 15:01:02.732	f	\N
cmn4qsdr8046x87ny50n0i40z	cmn4qpj4j018m87ny13z8bqqp	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:02.756	2026-03-24 15:01:02.756	f	\N
cmn4qsdry046z87nyybbnbvrr	cmn4qpj52018o87nytc7rwrw5	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:02.782	2026-03-24 15:01:02.782	f	\N
cmn4qsdso047287nyzxern11u	cmn4qpj7b018v87nyohw77obk	cmn4qs9lb03uh87nyhspbzsfm	2023-02-28 23:00:00	2028-02-29 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:02.809	2026-03-24 15:01:02.809	f	\N
cmn4qsdth047487nythy118kl	cmn4qpj8d019187ny9iuk3do1	cmn4qs9lb03uh87nyhspbzsfm	2018-10-09 22:00:00	2023-10-09 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:02.837	2026-03-24 15:01:02.837	f	\N
cmn4qsduc047787nynwzwxdab	cmn4qpj94019487nycl1bpuah	cmn4qs9lb03uh87nyhspbzsfm	2018-10-09 22:00:00	2023-10-09 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:02.868	2026-03-24 15:01:02.868	f	\N
cmn4qsdv0047987nymtb2nwrv	cmn4qpja0019887nytdi8dv2a	cmn4qs9lb03uh87nyhspbzsfm	2023-05-31 22:00:00	2028-05-31 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:02.892	2026-03-24 15:01:02.892	f	\N
cmn4qsdvq047b87ny528ge558	cmn4qpjah019a87nytezvi9ds	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:02.918	2026-03-24 15:01:02.918	f	\N
cmn4qsdwg047d87nysfb3obrd	cmn4qpjbl019e87nyr7zcdf86	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:02.945	2026-03-24 15:01:02.945	f	\N
cmn4qsdx8047g87ny1ifg3xr6	cmn4qpjco019i87ny8zweqktj	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:02.972	2026-03-24 15:01:02.972	f	\N
cmn4qsdxy047i87nyfh9ovuy8	cmn4qpjd3019k87ny1j2fz94y	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:02.999	2026-03-24 15:01:02.999	f	\N
cmn4qsdyz047k87nyaoobjsz7	cmn4qpjdv019o87nysoo7xg1j	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:03.035	2026-03-24 15:01:03.035	f	\N
cmn4qsdzq047m87nyocclon7r	cmn4qpjef019q87ny373pg7z0	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:03.062	2026-03-24 15:01:03.062	f	\N
cmn4qse0k047o87nycm7rnjt0	cmn4qpjev019s87nyv1gd7jiy	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:03.092	2026-03-24 15:01:03.092	f	\N
cmn4qse1v047q87nyrie3idrp	cmn4qpjf8019u87nywvoatvix	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:03.14	2026-03-24 15:01:03.14	f	\N
cmn4qse2o047s87ny45retwke	cmn4qpjfo019w87nyl1emeif6	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:03.168	2026-03-24 15:01:03.168	f	\N
cmn4qse3q047u87nysj2db1n0	cmn4qpjg0019y87nyz5dkvgza	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:03.206	2026-03-24 15:01:03.206	f	\N
cmn4qse4g047w87nyz7t2ti9y	cmn4qpjgl01a087nyp09ei1nt	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:03.233	2026-03-24 15:01:03.233	f	\N
cmn4qse5d047y87nycaawp6on	cmn4qpjh401a287nyfxsux493	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:03.265	2026-03-24 15:01:03.265	f	\N
cmn4qse6c048087nyfuzvl460	cmn4qpjhh01a487nyeu90yni9	cmn4qs9lb03uh87nyhspbzsfm	2023-12-31 23:00:00	2028-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:03.3	2026-03-24 15:01:03.3	f	\N
cmn4qse72048287nyi25viq78	cmn4qpjhz01a687nylj4rmtnv	cmn4qs9lb03uh87nyhspbzsfm	2019-10-31 23:00:00	2024-10-31 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:03.327	2026-03-24 15:01:03.327	f	\N
cmn4qse7w048587nydat4l94w	cmn4qpjjp01ad87ny4hd3mv0m	cmn4qs9lb03uh87nyhspbzsfm	2025-12-31 23:00:00	2030-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:03.356	2026-03-24 15:01:03.356	f	\N
cmn4qse8q048887nybyan69qf	cmn4qpjmx01at87nyeucob8pk	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:03.387	2026-03-24 15:01:03.387	f	\N
cmn4qse9n048a87nyu9zuqp5m	cmn4qpif7015k87nym8oew8bj	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:03.419	2026-03-24 15:01:03.419	f	\N
cmn4qseai048c87nyxyo4pylf	cmn4qpifv015o87nytf2cemov	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:03.45	2026-03-24 15:01:03.45	f	\N
cmn4qseb8048e87nyik8bctaf	cmn4qpjsp01bd87ny93awf7l2	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:03.476	2026-03-24 15:01:03.476	f	\N
cmn4qsebz048h87ny69lrf9n4	cmn4qpjv601bo87nyle5pxdre	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:03.503	2026-03-24 15:01:03.503	f	\N
cmn4qsect048k87ny50r248bb	cmn4qpjw601bt87nyevdfm7l1	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:03.533	2026-03-24 15:01:03.533	f	\N
cmn4qsedm048n87ny1jzam10j	cmn4qpjwv01bx87nyz135inee	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:03.562	2026-03-24 15:01:03.562	f	\N
cmn4qseem048q87ny6lu6hxo0	cmn4qpk0x01cc87nypm6648uc	cmn4qs9lb03uh87nyhspbzsfm	2024-10-31 23:00:00	2029-10-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:03.598	2026-03-24 15:01:03.598	f	\N
cmn4qsefi048s87nyma0vg5if	cmn4qqctu02g687nyw8tadn45	cmn4qs9lb03uh87nyhspbzsfm	2024-12-31 23:00:00	2029-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:03.63	2026-03-24 15:01:03.63	f	\N
cmn4qseg7048u87nyk32hjxx8	cmn4qpk4f01cs87nyzob3lava	cmn4qs9lb03uh87nyhspbzsfm	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:03.655	2026-03-24 15:01:03.655	f	\N
cmn4qsek9049387nyi47o7mry	cmn4qpkpl01fg87nyqrz9zykp	cmn4qseic048x87nyetridc8x	2021-03-31 22:00:00	2026-03-31 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:03.801	2026-03-24 15:01:03.801	f	\N
cmn4qsmdr049787nyy03ysev8	cmn4qp91y000q87nykkvwg8b8	cmn4qsmcx049487ny8rnte9sw	2023-07-18 22:00:00	2028-07-18 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:13.936	2026-03-24 15:04:23.413	f	\N
cmn4qsmeq049a87nyqtzvo32y	cmn4qp95q001887nycpnq7kd6	cmn4qsmcx049487ny8rnte9sw	2021-06-30 22:00:00	2026-06-30 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:13.971	2026-03-24 15:04:23.449	f	\N
cmn4qsmfh049d87ny9hc3fe51	cmn4qp96u001d87nysvbqii81	cmn4qsmcx049487ny8rnte9sw	2023-12-31 23:00:00	2028-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:13.997	2026-03-24 15:04:23.485	f	\N
cmn4qsmgl049f87ny85z5spa3	cmn4qp97n001h87nyp7sgyfec	cmn4qsmcx049487ny8rnte9sw	2019-12-31 23:00:00	2024-12-31 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:14.038	2026-03-24 15:04:23.517	f	\N
cmn4qsmhj049i87nynjw69rj6	cmn4qp98t001m87nygl6la4af	cmn4qsmcx049487ny8rnte9sw	2023-12-31 23:00:00	2028-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:14.072	2026-03-24 15:04:23.549	f	\N
cmn4qsmib049k87nyprjcty82	cmn4qp996001o87ny3gywstln	cmn4qsmcx049487ny8rnte9sw	2022-12-31 23:00:00	2027-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:14.099	2026-03-24 15:04:23.584	f	\N
cmn4qsmj5049n87nypupywgwl	cmn4qp9bp001v87nywnygsaw8	cmn4qsmcx049487ny8rnte9sw	2024-02-18 23:00:00	2029-02-18 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:14.129	2026-03-24 15:04:23.626	f	\N
cmn4qsmk3049p87nytpn9jpdz	cmn4qp9c2001x87nyigqwoxyf	cmn4qsmcx049487ny8rnte9sw	2024-02-18 23:00:00	2029-02-18 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:14.163	2026-03-24 15:04:23.655	f	\N
cmn4qsmkx049s87nyk7kez8sw	cmn4qp9d9002287nycr6vnw66	cmn4qsmcx049487ny8rnte9sw	2021-10-10 22:00:00	2026-10-10 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:14.193	2026-03-24 15:04:23.686	f	\N
cmn4qsmlt049u87nyisp19hzv	cmn4qp9dk002487nywfeou3i7	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:14.225	2026-03-24 15:04:23.71	f	\N
cmn4qsmmj049w87nydxsqpv3n	cmn4qp9e0002687nywrx35tz1	cmn4qsmcx049487ny8rnte9sw	2023-06-05 22:00:00	2028-06-05 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:14.251	2026-03-24 15:04:23.742	f	\N
cmn4qsmna049z87nyj56ncnos	cmn4qp9f0002b87nyl51a4lqw	cmn4qsmcx049487ny8rnte9sw	2023-06-25 22:00:00	2028-06-25 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:14.279	2026-03-24 15:04:23.771	f	\N
cmn4qsmo704a187ny7e0gb48r	cmn4qp9fc002d87nyyfl1dfwd	cmn4qsmcx049487ny8rnte9sw	2023-07-18 22:00:00	2028-07-18 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:14.312	2026-03-24 15:04:23.799	f	\N
cmn4qsmp404a487nyq3bzo1uv	cmn4qp9gj002k87nyzw8zlm8b	cmn4qsmcx049487ny8rnte9sw	2023-12-27 23:00:00	2028-12-27 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:14.345	2026-03-24 15:04:23.832	f	\N
cmn4qsmq204a787nyc0c82qoe	cmn4qp9hy002p87nysy6yy4mg	cmn4qsmcx049487ny8rnte9sw	2024-06-17 22:00:00	2029-06-17 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:14.378	2026-03-24 15:04:23.866	f	\N
cmn4qsmr204aa87nyj9ubhwdi	cmn4qp9n4003b87nyujvurcxf	cmn4qsmcx049487ny8rnte9sw	2021-09-20 22:00:00	2026-09-20 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:14.415	2026-03-24 15:04:23.899	f	\N
cmn4qsmsb04ac87nylnm36aso	cmn4qp9o8003h87nyqlty4max	cmn4qsmcx049487ny8rnte9sw	2021-08-23 22:00:00	2026-08-23 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:14.46	2026-03-24 15:04:23.94	f	\N
cmn4qsmt804ae87ny4hy74s6t	cmn4qp9ok003j87nyx8yygl20	cmn4qsmcx049487ny8rnte9sw	2018-12-21 23:00:00	2023-12-21 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:14.492	2026-03-24 15:04:23.978	f	\N
cmn4qsmty04ah87nysftj7f7k	cmn4qp9q0003q87ny10t81ejk	cmn4qsmcx049487ny8rnte9sw	2021-11-25 23:00:00	2026-11-25 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:14.518	2026-03-24 15:04:24.002	f	\N
cmn4qsmv404ak87ny885v3mz5	cmn4qp9r0003v87nyygijz1sf	cmn4qsmcx049487ny8rnte9sw	2023-03-13 23:00:00	2028-03-13 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:14.56	2026-03-24 15:04:24.027	f	\N
cmn4qsmvt04am87nytd18tphf	cmn4qp9rg003x87nykpkt1y9b	cmn4qsmcx049487ny8rnte9sw	2024-03-25 23:00:00	2029-03-25 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:14.586	2026-03-24 15:04:24.064	f	\N
cmn4qsmwy04ao87nyltdmzvsm	cmn4qp9s0003z87ny9r9c3bgp	cmn4qsmcx049487ny8rnte9sw	2024-03-26 23:00:00	2029-03-26 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:14.626	2026-03-24 15:04:24.098	f	\N
cmn4qsmxx04aq87nytjy19vth	cmn4qp9sg004187nylhp443s5	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:14.661	2026-03-24 15:04:24.138	f	\N
cmn4qsmyu04at87nyvmfsafmu	cmn4qp9u4004a87ny1aok747m	cmn4qsmcx049487ny8rnte9sw	2023-06-25 22:00:00	2028-06-25 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:14.694	2026-03-24 15:04:24.175	f	\N
cmn4qsmzl04av87nyulkny4qa	cmn4qp9uj004c87ny8nae3nyd	cmn4qsmcx049487ny8rnte9sw	2023-06-25 22:00:00	2028-06-25 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:14.721	2026-03-24 15:04:24.202	f	\N
cmn4qsn0j04ax87ny7ru6gz7w	cmn4qp9ux004e87nyfq492uaw	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:14.755	2026-03-24 15:04:24.232	f	\N
cmn4qsn1m04b087nybadm81pu	cmn4qp9vx004j87nyr82mawh2	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:14.795	2026-03-24 15:04:24.256	f	\N
cmn4qsn2q04b287ny2jrfkvyw	cmn4qp9wb004l87nyj6t33ot6	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:14.835	2026-03-24 15:04:24.278	f	\N
cmn4qsn3n04b587nyegjvmkst	cmn4qp9xf004q87nyne5w5oov	cmn4qsmcx049487ny8rnte9sw	2023-04-25 22:00:00	2028-04-25 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:14.868	2026-03-24 15:04:24.303	f	\N
cmn4qsn4t04b887nyc6zv9ov6	cmn4qp9yp004x87nys4rpsfvr	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:14.909	2026-03-24 15:04:24.328	f	\N
cmn4qsn5s04bb87nyynpjyw1n	cmn4qp9zt005287nydzq4xhx6	cmn4qsmcx049487ny8rnte9sw	2021-06-30 22:00:00	2026-06-30 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:14.945	2026-03-24 15:04:24.365	f	\N
cmn4qsn6k04bd87nydevy6ate	cmn4qpa0p005687ny7knpckql	cmn4qsmcx049487ny8rnte9sw	2023-06-25 22:00:00	2028-06-25 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:14.973	2026-03-24 15:04:24.397	f	\N
cmn4qsn7b04bf87nynnwjvgtz	cmn4qpa1d005a87nygsxs89rl	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:14.999	2026-03-24 15:04:24.434	f	\N
cmn4qsn8204bi87nyon5je23r	cmn4qpa1z005d87nyjt33954a	cmn4qsmcx049487ny8rnte9sw	2022-05-22 22:00:00	2027-05-22 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:15.026	2026-03-24 15:04:24.462	f	\N
cmn4qsn8z04bl87nyep5obvvp	cmn4qpa36005i87nyy5uijmmw	cmn4qsmcx049487ny8rnte9sw	2022-11-13 23:00:00	2027-11-13 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:15.06	2026-03-24 15:04:24.487	f	\N
cmn4qsn9p04bn87nyy9ljzmc6	cmn4qpa3p005k87ny9igekm49	cmn4qsmcx049487ny8rnte9sw	2022-11-13 23:00:00	2027-11-13 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:15.085	2026-03-24 15:04:24.512	f	\N
cmn4qsnag04bq87nywv4pxbye	cmn4qpa9m006d87nyj5aeltpq	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:15.113	2026-03-24 15:04:24.541	f	\N
cmn4qsnb804bt87ny827rbxgg	cmn4qpaal006i87nylqcg4bs7	cmn4qsmcx049487ny8rnte9sw	2024-09-01 22:00:00	2029-09-01 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:15.14	2026-03-24 15:04:24.571	f	\N
cmn4qsnby04bv87ny0vg4l16i	cmn4qpaax006k87nymzo903ui	cmn4qsmcx049487ny8rnte9sw	2024-07-31 22:00:00	2029-07-31 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:15.167	2026-03-24 15:04:24.601	f	\N
cmn4qsncv04bx87nyo9woacc4	cmn4qpab9006m87nyzwyneq2h	cmn4qsmcx049487ny8rnte9sw	2020-05-08 22:00:00	2025-05-08 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:15.199	2026-03-24 15:04:24.638	f	\N
cmn4qsndm04bz87nyn5uyrlfj	cmn4qpabp006o87ny47pr3aw8	cmn4qsmcx049487ny8rnte9sw	2020-05-08 22:00:00	2025-05-08 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:15.226	2026-03-24 15:04:24.667	f	\N
cmn4qsner04c187nyfez4qagf	cmn4qpac2006q87nywt094qhj	cmn4qsmcx049487ny8rnte9sw	2024-05-12 22:00:00	2029-05-12 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:15.267	2026-03-24 15:04:24.699	f	\N
cmn4qsnfk04c387nys5mqw5l9	cmn4qpacy006u87nymhvaus19	cmn4qsmcx049487ny8rnte9sw	2024-05-19 22:00:00	2029-05-19 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:15.296	2026-03-24 15:04:24.735	f	\N
cmn4qsnge04c687nygr1sgece	cmn4qpae9006z87ny8bu2je1t	cmn4qsmcx049487ny8rnte9sw	2021-04-27 22:00:00	2026-04-27 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:15.326	2026-03-24 15:04:24.773	f	\N
cmn4qsnhg04c887nyzx7s2wfo	cmn4qpaem007187ny43c7ae3m	cmn4qsmcx049487ny8rnte9sw	2021-04-27 22:00:00	2026-04-27 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:15.365	2026-03-24 15:04:24.805	f	\N
cmn4qsnig04cb87nyqz49ggf8	cmn4qpagw007987nylruol6ip	cmn4qsmcx049487ny8rnte9sw	2023-05-17 22:00:00	2028-05-17 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:15.401	2026-03-24 15:04:24.831	f	\N
cmn4qsnjj04ce87nyhtx38rpi	cmn4qpaj6007i87nyypsu53d2	cmn4qsmcx049487ny8rnte9sw	2023-09-28 22:00:00	2028-09-28 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:15.439	2026-03-24 15:04:24.855	f	\N
cmn4qsnkc04ch87nyu9j1i9nt	cmn4qpak6007n87nyvrx7ykjo	cmn4qsmcx049487ny8rnte9sw	2021-10-10 22:00:00	2026-10-10 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:15.468	2026-03-24 15:04:24.884	f	\N
cmn4qsnlj04ck87nyu9a7gn1a	cmn4qpalf007s87ny9945upvp	cmn4qsmcx049487ny8rnte9sw	2017-01-09 23:00:00	2022-01-09 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:15.511	2026-03-24 15:04:24.911	f	\N
cmn4qsnmw04cn87ny69g4kh0o	cmn4qpamh007x87ny7kypo29y	cmn4qsmcx049487ny8rnte9sw	2024-03-07 23:00:00	2029-03-07 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:15.56	2026-03-24 15:04:24.936	f	\N
cmn4qsnnm04cq87nyury34d0v	cmn4qpaov008887nyfvycvoic	cmn4qsmcx049487ny8rnte9sw	2024-10-07 22:00:00	2029-10-07 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:15.587	2026-03-24 15:04:24.971	f	\N
cmn4qsnoi04ct87nyxigpekvs	cmn4qpapr008d87nyi76ijqlr	cmn4qsmcx049487ny8rnte9sw	2024-07-31 22:00:00	2029-07-31 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:15.619	2026-03-24 15:04:25.005	f	\N
cmn4qsnpg04cv87nyvqrih72x	cmn4qpaq0008f87nyd529d9be	cmn4qsmcx049487ny8rnte9sw	2024-08-04 22:00:00	2029-08-04 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:15.652	2026-03-24 15:04:25.03	f	\N
cmn4qsnqb04cx87nywry3km07	cmn4qpaq9008h87nyiu56mt0p	cmn4qsmcx049487ny8rnte9sw	2024-07-21 22:00:00	2029-07-21 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:15.684	2026-03-24 15:04:25.071	f	\N
cmn4qsnr504cz87nyiq47jlts	cmn4qpaqo008j87nydr9hm0d8	cmn4qsmcx049487ny8rnte9sw	2024-07-31 22:00:00	2029-07-31 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:15.714	2026-03-24 15:04:25.112	f	\N
cmn4qsnru04d287nygtznlsoa	cmn4qpas1008q87nyttyc2nbn	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:15.739	2026-03-24 15:04:25.149	f	\N
cmn4qsnsw04d487nyqrc9m3ws	cmn4qpash008s87nyc35ndnyz	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:15.776	2026-03-24 15:04:25.187	f	\N
cmn4qsntr04d687nyed5wufb3	cmn4qpass008u87ny5iktsdat	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:15.807	2026-03-24 15:04:25.213	f	\N
cmn4qsnuh04d987nyk3jqhd3a	cmn4qpave009687nybdj4awnu	cmn4qsmcx049487ny8rnte9sw	2024-07-04 22:00:00	2029-07-04 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:15.833	2026-03-24 15:04:25.238	f	\N
cmn4qsnv904dc87ny820m4exg	cmn4qpax2009b87ny9rrxd1gt	cmn4qsmcx049487ny8rnte9sw	2024-03-18 23:00:00	2029-03-18 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:15.861	2026-03-24 15:04:25.264	f	\N
cmn4qsnvz04de87nyx2siaw7u	cmn4qpaxo009d87ny4pwofxmx	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:15.888	2026-03-24 15:04:25.293	f	\N
cmn4qsnwu04dh87nye5z04kl3	cmn4qpaz2009i87nylmv6c09f	cmn4qsmcx049487ny8rnte9sw	2021-06-30 22:00:00	2026-06-30 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:15.918	2026-03-24 15:04:25.33	f	\N
cmn4qsnxt04dj87ny9rcfg6s2	cmn4qpazk009k87nyk96rwnza	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:15.953	2026-03-24 15:04:25.355	f	\N
cmn4qsnz004dm87nye06omqax	cmn4qpb2h009v87nyawyfx292	cmn4qsmcx049487ny8rnte9sw	2023-04-25 22:00:00	2028-04-25 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:15.996	2026-03-24 15:04:25.381	f	\N
cmn4qsnzt04do87nyu2gv921f	cmn4qpb2u009x87ny5ogiyz26	cmn4qsmcx049487ny8rnte9sw	2024-03-25 23:00:00	2029-03-25 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:16.025	2026-03-24 15:04:25.408	f	\N
cmn4qso1004dr87nyyfv3z5xc	cmn4qpb4a00a287nykqf7no01	cmn4qsmcx049487ny8rnte9sw	2023-08-10 22:00:00	2028-08-10 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:16.068	2026-03-24 15:04:25.432	f	\N
cmn4qso1t04du87ny7gg52zkn	cmn4qpb7e00ag87nyxzaxdmle	cmn4qsmcx049487ny8rnte9sw	2022-01-11 23:00:00	2027-01-11 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:16.098	2026-03-24 15:04:25.467	f	\N
cmn4qso2n04dw87nyr3an9dmc	cmn4qpb8c00ak87nyb0h7gqay	cmn4qsmcx049487ny8rnte9sw	2021-12-12 23:00:00	2026-12-12 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:16.127	2026-03-24 15:04:25.491	f	\N
cmn4qso3e04dz87nye0m6kgvn	cmn4qpbct00b187nyh4lptdow	cmn4qsmcx049487ny8rnte9sw	2023-06-25 22:00:00	2028-06-25 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:16.155	2026-03-24 15:04:25.521	f	\N
cmn4qso4i04e287ny33lwhgbh	cmn4qpbfa00bd87nymtzu13gm	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:16.195	2026-03-24 15:04:25.552	f	\N
cmn4qso5a04e587ny85xyshmn	cmn4qpbh500bl87nyckb6dbfz	cmn4qsmcx049487ny8rnte9sw	2023-09-20 22:00:00	2028-09-20 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:16.222	2026-03-24 15:04:25.579	f	\N
cmn4qso6604e787nyg97zxbqm	cmn4qpbhj00bn87nyk4dil4gg	cmn4qsmcx049487ny8rnte9sw	2021-06-30 22:00:00	2026-06-30 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:16.254	2026-03-24 15:04:25.612	f	\N
cmn4qso6x04e987nyg0e2uanb	cmn4qpbhx00bp87nyas2ywvj8	cmn4qsmcx049487ny8rnte9sw	2023-12-04 23:00:00	2028-12-04 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:16.282	2026-03-24 15:04:25.638	f	\N
cmn4qso8004ec87nyfaogg69t	cmn4qpbin00bt87nycigylsvs	cmn4qsmcx049487ny8rnte9sw	2022-09-05 22:00:00	2027-09-05 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:16.32	2026-03-24 15:04:25.68	f	\N
cmn4qso9604ef87ny72mc139o	cmn4qpbk800c087nymnsljwto	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:16.362	2026-03-24 15:04:25.709	f	\N
cmn4qsoa204ei87ny33xn792z	cmn4qpbms00c887nygkjyqi71	cmn4qsmcx049487ny8rnte9sw	2023-07-18 22:00:00	2028-07-18 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:16.394	2026-03-24 15:04:25.746	f	\N
cmn4qsoay04ek87ny03yyark3	cmn4qpbn900ca87nygg03i5hb	cmn4qsmcx049487ny8rnte9sw	2023-07-18 22:00:00	2028-07-18 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:16.426	2026-03-24 15:04:25.774	f	\N
cmn4qsobp04en87nyiqnhexsb	cmn4qpbpa00ch87nym3tekzyq	cmn4qsmcx049487ny8rnte9sw	2024-11-30 23:00:00	2029-11-30 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:16.453	2026-03-24 15:04:25.803	f	\N
cmn4qsoce04eq87nyvll7xfqv	cmn4qpbq700cm87nym5mm911j	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:16.478	2026-03-24 15:04:25.83	f	\N
cmn4qsod204et87nyksmd5vq7	cmn4qpbry00cu87ny00kff2dq	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:16.503	2026-03-24 15:04:25.855	f	\N
cmn4qsoe304ew87ny1tvbufol	cmn4qpbt600cz87ny7au5wain	cmn4qsmcx049487ny8rnte9sw	2021-06-30 22:00:00	2026-06-30 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:16.539	2026-03-24 15:04:25.901	f	\N
cmn4qsoey04ez87nyznk07c6s	cmn4qpbuw00d687ny54rvn7bq	cmn4qsmcx049487ny8rnte9sw	2024-03-21 23:00:00	2029-03-21 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:16.571	2026-03-24 15:04:25.937	f	\N
cmn4qsofs04f187ny2q7klt9m	cmn4qpbvm00da87ny239lsa52	cmn4qsmcx049487ny8rnte9sw	2024-03-21 23:00:00	2029-03-21 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:16.601	2026-03-24 15:04:25.973	f	\N
cmn4qsogt04f387nyutg7yxl1	cmn4qpbvx00dc87nykq4gzq0s	cmn4qsmcx049487ny8rnte9sw	2024-03-21 23:00:00	2029-03-21 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:16.638	2026-03-24 15:04:26.008	f	\N
cmn4qsohy04f587nytiv1ctkc	cmn4qpbw900de87nyz109l1l8	cmn4qsmcx049487ny8rnte9sw	2024-03-19 23:00:00	2029-03-19 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:16.679	2026-03-24 15:04:26.04	f	\N
cmn4qsoio04f787ny5wiw4jzj	cmn4qpbwm00dg87ny2wcluw3m	cmn4qsmcx049487ny8rnte9sw	2024-03-21 23:00:00	2029-03-21 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:16.705	2026-03-24 15:04:26.065	f	\N
cmn4qsojh04f987nyb078btyh	cmn4qpbwx00di87nywvgmhjkw	cmn4qsmcx049487ny8rnte9sw	2024-03-25 23:00:00	2029-03-25 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:16.734	2026-03-24 15:04:26.096	f	\N
cmn4qsokg04fb87nyf8xymo1y	cmn4qpbxa00dk87nyj56mfqkl	cmn4qsmcx049487ny8rnte9sw	2024-06-17 22:00:00	2029-06-17 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:16.768	2026-03-24 15:04:26.131	f	\N
cmn4qsolb04fe87nyfcvasdxk	cmn4qpbyy00dt87nyz65g48oa	cmn4qsmcx049487ny8rnte9sw	2017-05-12 22:00:00	2022-05-12 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:16.8	2026-03-24 15:04:26.155	f	\N
cmn4qsomf04fg87nyklblx635	cmn4qpbzn00dx87nyzcq0o6go	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:16.839	2026-03-24 15:04:26.182	f	\N
cmn4qsoni04fj87nyh9dcm3xz	cmn4qpc2d00e587nyohjzmkic	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:16.878	2026-03-24 15:04:26.207	f	\N
cmn4qsook04fm87nyy8ecy5nl	cmn4qpc2x00e787ny72bvh60m	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:16.917	2026-03-24 15:04:26.239	f	\N
cmn4qsopn04fp87nye5fk9bnu	cmn4qpc4d00ec87ny94tughqd	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:16.955	2026-03-24 15:04:26.275	f	\N
cmn4qsoqu04fs87nyg7ltp4ww	cmn4qpc6f00ej87nyngmbi2ym	cmn4qsmcx049487ny8rnte9sw	2023-03-20 23:00:00	2028-03-20 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:16.998	2026-03-24 15:04:26.316	f	\N
cmn4qsorv04fu87ny2d17lvlj	cmn4qpc6w00el87nyjno92sb5	cmn4qsmcx049487ny8rnte9sw	2023-06-25 22:00:00	2028-06-25 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:17.036	2026-03-24 15:04:26.351	f	\N
cmn4qsosn04fx87ny2d6cix3d	cmn4qpc8700eq87ny97e130ex	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:17.063	2026-03-24 15:04:26.386	f	\N
cmn4qsote04fz87nybjp7vfu8	cmn4qpc8i00es87ny2mkig1b3	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:17.091	2026-03-24 15:04:26.416	f	\N
cmn4qsou604g287nyvf7p74i4	cmn4qpc9u00ex87nyn4157kgy	cmn4qsmcx049487ny8rnte9sw	2024-02-18 23:00:00	2029-02-18 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:17.119	2026-03-24 15:04:26.467	f	\N
cmn4qsouy04g587nycaa3do7w	cmn4qpcbu00f787nyj83lsm4i	cmn4qsmcx049487ny8rnte9sw	2021-06-30 22:00:00	2026-06-30 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:17.146	2026-03-24 15:04:26.493	f	\N
cmn4qsovp04g787nykdm1a56y	cmn4qpcc600f987nykzqc6g80	cmn4qsmcx049487ny8rnte9sw	2021-06-30 22:00:00	2026-06-30 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:17.173	2026-03-24 15:04:26.533	f	\N
cmn4qsowh04ga87nyl62qzob3	cmn4qpced00fj87nyml9adkio	cmn4qsmcx049487ny8rnte9sw	2022-04-25 22:00:00	2027-04-25 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:17.201	2026-03-24 15:04:26.572	f	\N
cmn4qsoxo04gc87nyu3wahli3	cmn4qpcey00fl87nyjgm71l22	cmn4qsmcx049487ny8rnte9sw	2023-06-25 22:00:00	2028-06-25 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:17.244	2026-03-24 15:04:26.595	f	\N
cmn4qsoyc04gf87nye3zid2w9	cmn4qpcg800fs87nyvf6nvwxu	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:17.269	2026-03-24 15:04:26.622	f	\N
cmn4qsoz504gh87nynhp0cexx	cmn4qpchd00fw87nyrwekjbwd	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:17.297	2026-03-24 15:04:26.657	f	\N
cmn4qsozw04gk87nyajhszsn2	cmn4qpcim00g187ny51px34bj	cmn4qsmcx049487ny8rnte9sw	2021-10-10 22:00:00	2026-10-10 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:17.324	2026-03-24 15:04:26.699	f	\N
cmn4qsp0l04gn87nydc0u6elu	cmn4qpcjj00g687ny66otbsad	cmn4qsmcx049487ny8rnte9sw	2021-12-12 23:00:00	2026-12-12 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:17.35	2026-03-24 15:04:26.729	f	\N
cmn4qsp1o04gq87nyual3qj70	cmn4qpcmf00gh87nym35v3rjq	cmn4qsmcx049487ny8rnte9sw	2023-04-25 22:00:00	2028-04-25 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:17.388	2026-03-24 15:04:26.758	f	\N
cmn4qsp2e04gs87nysz044civ	cmn4qpcmp00gj87ny0lpplg5d	cmn4qsmcx049487ny8rnte9sw	2023-04-25 22:00:00	2028-04-25 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:17.414	2026-03-24 15:04:26.795	f	\N
cmn4qsp3e04gv87nyc1dm1cgv	cmn4qpcnp00go87ny4xp224gt	cmn4qsmcx049487ny8rnte9sw	2021-06-30 22:00:00	2026-06-30 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:17.45	2026-03-24 15:04:26.825	f	\N
cmn4qsp4604gy87nyexuqu1rb	cmn4qpcp700gv87ny42pu0and	cmn4qsmcx049487ny8rnte9sw	2022-02-03 23:00:00	2027-02-03 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:17.478	2026-03-24 15:04:26.851	f	\N
cmn4qsp5004h187nygcq6vitm	cmn4qpcts00hd87nyv2z6pgqz	cmn4qsmcx049487ny8rnte9sw	2024-03-25 23:00:00	2029-03-25 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:17.508	2026-03-24 15:04:26.882	f	\N
cmn4qsp5q04h387ny4chddssn	cmn4qpcuc00hf87nyob4tdgog	cmn4qsmcx049487ny8rnte9sw	2024-03-25 23:00:00	2029-03-25 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:17.535	2026-03-24 15:04:26.918	f	\N
cmn4qsp7204h687nyiyzbcnrx	cmn4qpcvc00hk87ny8gbdnsrp	cmn4qsmcx049487ny8rnte9sw	2021-06-30 22:00:00	2026-06-30 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:17.583	2026-03-24 15:04:26.942	f	\N
cmn4qsp8504h887nygml2ztev	cmn4qpcw300ho87ny6i0irx0x	cmn4qsmcx049487ny8rnte9sw	2022-11-20 23:00:00	2027-11-20 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:17.621	2026-03-24 15:04:26.978	f	\N
cmn4qsp8x04hb87nyaaeoih1w	cmn4qpcx300ht87nyzbp6b5m2	cmn4qsmcx049487ny8rnte9sw	2024-08-25 22:00:00	2029-08-25 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:17.649	2026-03-24 15:04:27.011	f	\N
cmn4qsp9r04hd87nymekbmcts	cmn4qpcxq00hx87nyykb3v0pk	cmn4qsmcx049487ny8rnte9sw	2024-08-25 22:00:00	2029-08-25 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:17.68	2026-03-24 15:04:27.035	f	\N
cmn4qspb104hf87nyk2372u5y	cmn4qpcy500hz87ny77l0atfe	cmn4qsmcx049487ny8rnte9sw	2021-01-24 23:00:00	2026-01-24 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:17.725	2026-03-24 15:04:27.059	f	\N
cmn4qspc504hh87nycjnd7ed1	cmn4qpcz800i387nyk966vqyh	cmn4qsmcx049487ny8rnte9sw	2024-07-31 22:00:00	2029-07-31 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:17.766	2026-03-24 15:04:27.09	f	\N
cmn4qspcx04hk87ny50kzyac9	cmn4qpd1800ib87ny46jiejzt	cmn4qsmcx049487ny8rnte9sw	2023-09-17 22:00:00	2028-09-17 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:17.794	2026-03-24 15:04:27.114	f	\N
cmn4qspdx04hn87nyxsvblhma	cmn4qpd5300ir87nym15x07lu	cmn4qsmcx049487ny8rnte9sw	2021-06-30 22:00:00	2026-06-30 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:17.83	2026-03-24 15:04:27.155	f	\N
cmn4qspf104hq87nyapetyfke	cmn4qpd6d00iy87ny20ap4h4s	cmn4qsmcx049487ny8rnte9sw	2021-06-30 22:00:00	2026-06-30 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:17.869	2026-03-24 15:04:27.182	f	\N
cmn4qspfr04hs87ny1zooj5l6	cmn4qpd6t00j087nyluqi1npi	cmn4qsmcx049487ny8rnte9sw	2023-07-18 22:00:00	2028-07-18 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:17.895	2026-03-24 15:04:27.212	f	\N
cmn4qspgr04hv87ny14cjn0o5	cmn4qpd8s00j787nyqv6huyfe	cmn4qsmcx049487ny8rnte9sw	2021-06-30 22:00:00	2026-06-30 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:17.932	2026-03-24 15:04:27.25	f	\N
cmn4qspht04hy87nynjg094iz	cmn4qpd9l00ja87nyfx7yj79v	cmn4qsmcx049487ny8rnte9sw	2024-06-17 22:00:00	2029-06-17 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:17.969	2026-03-24 15:04:27.279	f	\N
cmn4qspio04i187nydf7akwd1	cmn4qpdal00jf87nylqh54eda	cmn4qsmcx049487ny8rnte9sw	2024-05-16 22:00:00	2029-05-16 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:18.001	2026-03-24 15:04:27.306	f	\N
cmn4qspjp04i487ny0rep8rc1	cmn4qpdbn00jk87nyg39ezu87	cmn4qsmcx049487ny8rnte9sw	2022-03-15 23:00:00	2027-03-15 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:18.038	2026-03-24 15:04:27.346	f	\N
cmn4qspkp04i687nyxpix9n3u	cmn4qpdc200jm87ny60cq4eus	cmn4qsmcx049487ny8rnte9sw	2023-10-03 22:00:00	2028-10-03 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:18.074	2026-03-24 15:04:27.375	f	\N
cmn4qspls04i887nynt3kjhu7	cmn4qpdcj00jo87nyhnobjxdt	cmn4qsmcx049487ny8rnte9sw	2024-03-25 23:00:00	2029-03-25 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:18.113	2026-03-24 15:04:27.399	f	\N
cmn4qspmo04ib87ny0c81sg9y	cmn4qpddl00jr87nyffarh4ff	cmn4qsmcx049487ny8rnte9sw	2024-09-10 22:00:00	2029-09-10 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:18.145	2026-03-24 15:04:27.423	f	\N
cmn4qspne04ie87ny4rzz0cm5	cmn4qpdip00k987nya0djhuq2	cmn4qsmcx049487ny8rnte9sw	2023-07-31 22:00:00	2028-07-31 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:18.17	2026-03-24 15:04:27.46	f	\N
cmn4qspos04ig87ny9ogavowd	cmn4qpdj200kb87nyvvgqisxo	cmn4qsmcx049487ny8rnte9sw	2023-07-31 22:00:00	2028-07-31 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:18.22	2026-03-24 15:04:27.494	f	\N
cmn4qspps04ii87nya5pckpkh	cmn4qpdk000kf87ny289yyk1k	cmn4qsmcx049487ny8rnte9sw	2023-06-25 22:00:00	2028-06-25 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:18.256	2026-03-24 15:04:27.526	f	\N
cmn4qspqu04ik87ny5lyimk48	cmn4qpdkj00kh87nyyq0g6ea6	cmn4qsmcx049487ny8rnte9sw	2023-07-26 22:00:00	2028-07-26 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:18.294	2026-03-24 15:04:27.552	f	\N
cmn4qsps604in87nyjvkb25xc	cmn4qpdpy00l387ny74bgk6dd	cmn4qsmcx049487ny8rnte9sw	2024-04-10 22:00:00	2029-04-10 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:18.342	2026-03-24 15:04:27.575	f	\N
cmn4qspsv04iq87nye7vyt9s9	cmn4qpdsx00ld87ny3nh22t7t	cmn4qsmcx049487ny8rnte9sw	2021-06-30 22:00:00	2026-06-30 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:18.367	2026-03-24 15:04:27.607	f	\N
cmn4qspto04it87nyakmkasb0	cmn4qpdu300li87ny7fcpmb3b	cmn4qsmcx049487ny8rnte9sw	2023-07-18 22:00:00	2028-07-18 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:18.396	2026-03-24 15:04:27.632	f	\N
cmn4qspuf04iw87ny93jd6t59	cmn4qpdwf00ls87nyqjovoiho	cmn4qsmcx049487ny8rnte9sw	2024-05-16 22:00:00	2029-05-16 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:18.423	2026-03-24 15:04:27.655	f	\N
cmn4qspv604iz87ny9b27h1us	cmn4qpdxm00lx87nyb7h84010	cmn4qsmcx049487ny8rnte9sw	2021-07-28 22:00:00	2026-07-28 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:18.451	2026-03-24 15:04:27.68	f	\N
cmn4qspwg04j187nymglw4k1p	cmn4qpdy600lz87ny0153jeqt	cmn4qsmcx049487ny8rnte9sw	2021-07-27 22:00:00	2026-07-27 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:18.496	2026-03-24 15:04:27.704	f	\N
cmn4qspx804j487nyeouhhcst	cmn4qpdzu00m687nyuaucspw8	cmn4qsmcx049487ny8rnte9sw	2024-09-23 22:00:00	2029-09-23 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:18.524	2026-03-24 15:04:27.738	f	\N
cmn4qspy004j787nyp7fupk7w	cmn4qpe1j00me87nymg4nqtpv	cmn4qsmcx049487ny8rnte9sw	2023-04-19 22:00:00	2028-04-19 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:18.553	2026-03-24 15:04:27.771	f	\N
cmn4qspyv04j987nyz0fzxroi	cmn4qpe1v00mg87nymd9sbe5f	cmn4qsmcx049487ny8rnte9sw	2023-04-25 22:00:00	2028-04-25 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:18.584	2026-03-24 15:04:27.819	f	\N
cmn4qsq0704jb87ny9ly7en6p	cmn4qpe2n00mi87nyxq8geysb	cmn4qsmcx049487ny8rnte9sw	2023-12-31 23:00:00	2028-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:18.631	2026-03-24 15:04:27.847	f	\N
cmn4qsq0x04je87nyrujsujvw	cmn4qpe3q00mn87nyx3b40kle	cmn4qsmcx049487ny8rnte9sw	2022-11-13 23:00:00	2027-11-13 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:18.657	2026-03-24 15:04:27.872	f	\N
cmn4qsq1w04jh87nyo8iyxnxn	cmn4qpe6e00mx87nyzn45kege	cmn4qsmcx049487ny8rnte9sw	2023-04-25 22:00:00	2028-04-25 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:18.692	2026-03-24 15:04:27.896	f	\N
cmn4qsq2w04jk87nyey5gvc34	cmn4qpeb700ng87ny7gnc3sxc	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:18.728	2026-03-24 15:04:27.922	f	\N
cmn4qsq3t04jn87ny0jd8sfjo	cmn4qpecd00nl87nyvfcrnn9d	cmn4qsmcx049487ny8rnte9sw	2024-03-17 23:00:00	2029-03-17 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:18.761	2026-03-24 15:04:27.947	f	\N
cmn4qsq5204jq87nymsdslrda	cmn4qpedh00nq87nyovh99wys	cmn4qsmcx049487ny8rnte9sw	2024-12-31 23:00:00	2029-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:18.807	2026-03-24 15:04:27.987	f	\N
cmn4qsq5w04js87nycvuwu2kc	cmn4qpedt00ns87ny8ozrjcwi	cmn4qsmcx049487ny8rnte9sw	2024-02-18 23:00:00	2029-02-18 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:18.837	2026-03-24 15:04:28.014	f	\N
cmn4qsq6s04jv87ny1o59aruh	cmn4qpegz00o787nym3b0gp60	cmn4qsmcx049487ny8rnte9sw	2023-04-25 22:00:00	2028-04-25 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:18.868	2026-03-24 15:04:28.042	f	\N
cmn4qsq7q04jy87nya3ssduj0	cmn4qpeih00oe87nybel8mrwe	cmn4qsmcx049487ny8rnte9sw	2022-05-22 22:00:00	2027-05-22 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:18.902	2026-03-24 15:04:28.069	f	\N
cmn4qsq8g04k187nyz5c6czrc	cmn4qpeks00oo87nyd61np16d	cmn4qsmcx049487ny8rnte9sw	2022-06-08 22:00:00	2027-06-08 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:18.928	2026-03-24 15:04:28.099	f	\N
cmn4qsq9b04k387nyex39frtd	cmn4qpel400oq87nya28enn7o	cmn4qsmcx049487ny8rnte9sw	2022-06-08 22:00:00	2027-06-08 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:18.959	2026-03-24 15:04:28.124	f	\N
cmn4qsqa304k587nyh9ukj9il	cmn4qpelg00os87nyve86g94w	cmn4qsmcx049487ny8rnte9sw	2022-09-14 22:00:00	2027-09-14 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:18.988	2026-03-24 15:04:28.163	f	\N
cmn4qsqav04k787nygdmzkhj0	cmn4qpelt00ou87nys2ksx2s7	cmn4qsmcx049487ny8rnte9sw	2024-07-31 22:00:00	2029-07-31 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:19.015	2026-03-24 15:04:28.186	f	\N
cmn4qsqbo04k987nyc886m14n	cmn4qpem400ow87ny7fwynf0c	cmn4qsmcx049487ny8rnte9sw	2024-07-31 22:00:00	2029-07-31 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:19.044	2026-03-24 15:04:28.211	f	\N
cmn4qsqck04kb87ny8twpgaoh	cmn4qpemh00oy87nyleuozoet	cmn4qsmcx049487ny8rnte9sw	2024-07-31 22:00:00	2029-07-31 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:19.076	2026-03-24 15:04:28.239	f	\N
cmn4qsqdm04ke87nyjt8ypfzm	cmn4qpepn00pa87ny66xboofc	cmn4qsmcx049487ny8rnte9sw	2022-05-22 22:00:00	2027-05-22 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:19.114	2026-03-24 15:04:28.279	f	\N
cmn4qsqeb04kh87nye2k01f9b	cmn4qpet400pm87nyetzhoj16	cmn4qsmcx049487ny8rnte9sw	2023-05-29 22:00:00	2028-05-29 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:19.14	2026-03-24 15:04:28.313	f	\N
cmn4qsqf204kk87nycqrnzsjr	cmn4qpevm00px87nyzonwycoo	cmn4qsmcx049487ny8rnte9sw	2023-06-25 22:00:00	2028-06-25 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:19.166	2026-03-24 15:04:28.347	f	\N
cmn4qsqft04km87nyfsltf02z	cmn4qpevy00pz87nynutssc3k	cmn4qsmcx049487ny8rnte9sw	2023-06-25 22:00:00	2028-06-25 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:19.193	2026-03-24 15:04:28.379	f	\N
cmn4qsqgi04kp87nyvoxvhqx8	cmn4qpexk00q487ny8hwf95r5	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:19.219	2026-03-24 15:04:28.404	f	\N
cmn4qsqhs04ks87nypnpp7t86	cmn4qpf0400qe87nyb6h8mc2m	cmn4qsmcx049487ny8rnte9sw	2022-01-17 23:00:00	2027-01-17 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:19.264	2026-03-24 15:04:28.435	f	\N
cmn4qsqiv04ku87ny1ahgw6z4	cmn4qpf0g00qg87ny09d2yru4	cmn4qsmcx049487ny8rnte9sw	2022-01-17 23:00:00	2027-01-17 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:19.304	2026-03-24 15:04:28.471	f	\N
cmn4qsqjt04kx87ny75fzpwi9	cmn4qpf1k00ql87nyvmsllipe	cmn4qsmcx049487ny8rnte9sw	2024-11-26 23:00:00	2029-11-26 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:19.337	2026-03-24 15:04:28.497	f	\N
cmn4qsqkj04l087ny8ycauh38	cmn4qpf5p00r287ny2jltp3zr	cmn4qsmcx049487ny8rnte9sw	2023-12-31 23:00:00	2028-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:19.363	2026-03-24 15:04:28.523	f	\N
cmn4qsqli04l287ny8tlqd0k4	cmn4qpf6000r487ny72jad2rr	cmn4qsmcx049487ny8rnte9sw	2023-12-31 23:00:00	2028-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:19.399	2026-03-24 15:04:28.547	f	\N
cmn4qsqma04l587ny4o894uig	cmn4qpf7l00r987ny2e5kncwx	cmn4qsmcx049487ny8rnte9sw	2024-02-18 23:00:00	2029-02-18 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:19.427	2026-03-24 15:04:28.578	f	\N
cmn4qsqna04l887nyzvgcv964	cmn4qpf8o00re87nyjwob3fbl	cmn4qsmcx049487ny8rnte9sw	2023-06-25 22:00:00	2028-06-25 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:19.462	2026-03-24 15:04:28.606	f	\N
cmn4qsqoa04lb87nyd4nih7a2	cmn4qpfcq00rv87nydg8annsn	cmn4qsmcx049487ny8rnte9sw	2023-11-21 23:00:00	2028-11-21 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:19.498	2026-03-24 15:04:28.63	f	\N
cmn4qsqpd04le87nyztg85q17	cmn4qpfdo00s087nyy4qx5ke2	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:19.537	2026-03-24 15:04:28.656	f	\N
cmn4qsqq204lh87nyivgkygf3	cmn4qpfg200sc87nyv4y4risy	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:19.563	2026-03-24 15:04:28.681	f	\N
cmn4qsqqt04lk87nyentip371	cmn4qpfhq00sj87nydsi90qnu	cmn4qsmcx049487ny8rnte9sw	2022-07-06 22:00:00	2027-07-06 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:19.589	2026-03-24 15:04:28.713	f	\N
cmn4qsqrk04ln87nyb91s4dnt	cmn4qpfje00so87nyyknh12s9	cmn4qsmcx049487ny8rnte9sw	2023-10-03 22:00:00	2028-10-03 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:19.616	2026-03-24 15:04:28.754	f	\N
cmn4qsqsj04lp87nyf7uj8opb	cmn4qpfjs00sq87nykv8be4pf	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:19.651	2026-03-24 15:04:28.781	f	\N
cmn4qsqto04ls87ny7rvbmgd6	cmn4qpfl200sv87ny12hq98p1	cmn4qsmcx049487ny8rnte9sw	2022-03-31 22:00:00	2027-03-31 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:19.693	2026-03-24 15:04:28.809	f	\N
cmn4qsquk04lu87ny82h7xejn	cmn4qpfle00sx87nysu305ftd	cmn4qsmcx049487ny8rnte9sw	2022-03-31 22:00:00	2027-03-31 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:19.725	2026-03-24 15:04:28.854	f	\N
cmn4qsqvh04lw87nykwcuv4kh	cmn4qpfls00sz87nyg95r74id	cmn4qsmcx049487ny8rnte9sw	2022-03-31 22:00:00	2027-03-31 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:19.757	2026-03-24 15:04:28.894	f	\N
cmn4qsqwc04ly87ny3c5k7pj2	cmn4qpfm800t187ny3l5hxo3k	cmn4qsmcx049487ny8rnte9sw	2022-03-08 23:00:00	2027-03-08 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:19.788	2026-03-24 15:04:28.92	f	\N
cmn4qsqx104m187ny14ouihoo	cmn4qpfpp00tb87nywp51fk5i	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:19.814	2026-03-24 15:04:28.949	f	\N
cmn4qsqxs04m387nysfwqnimi	cmn4qpfqb00td87nyh61a0n9h	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:19.84	2026-03-24 15:04:28.98	f	\N
cmn4qsqyj04m687nyuckeof77	cmn4qpfrf00ti87ny9z0zz5pu	cmn4qsmcx049487ny8rnte9sw	2022-04-17 22:00:00	2027-04-17 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:19.867	2026-03-24 15:04:29.007	f	\N
cmn4qsqzd04m987nycz6osq99	cmn4qpfsh00tn87nyifoslt5i	cmn4qsmcx049487ny8rnte9sw	2019-11-10 23:00:00	2024-11-10 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:19.898	2026-03-24 15:04:29.035	f	\N
cmn4qsr0i04mb87nyapbxm3rx	cmn4qpfst00tp87nyl758591z	cmn4qsmcx049487ny8rnte9sw	2019-11-10 23:00:00	2024-11-10 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:19.938	2026-03-24 15:04:29.062	f	\N
cmn4qsr1904me87ny8gywf4lr	cmn4qpfur00tw87nybu5tx1nb	cmn4qsmcx049487ny8rnte9sw	2023-06-25 22:00:00	2028-06-25 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:19.966	2026-03-24 15:04:29.097	f	\N
cmn4qsr2504mg87nyv588xvmj	cmn4qpfv200ty87nygwyi9g07	cmn4qsmcx049487ny8rnte9sw	2023-06-25 22:00:00	2028-06-25 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:19.998	2026-03-24 15:04:29.121	f	\N
cmn4qsr3904mi87nyinzy41cd	cmn4qpfvz00u387nycgm83dbp	cmn4qsmcx049487ny8rnte9sw	2021-07-06 22:00:00	2026-07-06 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:20.038	2026-03-24 15:04:29.155	f	\N
cmn4qsr3z04ml87nyqhb86s3a	cmn4qpfxa00ua87ny737vgxoi	cmn4qsmcx049487ny8rnte9sw	2020-09-07 22:00:00	2025-09-07 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:20.063	2026-03-24 15:04:29.19	f	\N
cmn4qsr4q04mo87nyq91luxdc	cmn4qpfyd00uf87nydnv55fwl	cmn4qsmcx049487ny8rnte9sw	2024-07-04 22:00:00	2029-07-04 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:20.09	2026-03-24 15:04:29.221	f	\N
cmn4qsr5i04mr87ny0txhad3w	cmn4qpgen00wb87nylkbce8rh	cmn4qsmcx049487ny8rnte9sw	2021-02-03 23:00:00	2026-02-03 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:20.118	2026-03-24 15:04:29.245	f	\N
cmn4qsr6a04mt87nyga2r2kzo	cmn4qpgf600wd87nyxq3w3noz	cmn4qsmcx049487ny8rnte9sw	2021-02-03 23:00:00	2026-02-03 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:20.147	2026-03-24 15:04:29.274	f	\N
cmn4qsr7a04mv87nyies0uu59	cmn4qpgfi00wf87ny4vn87f60	cmn4qsmcx049487ny8rnte9sw	2021-02-03 23:00:00	2026-02-03 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:20.182	2026-03-24 15:04:29.297	f	\N
cmn4qsr8d04mx87nymkbx4kil	cmn4qpgfv00wh87nysdv6yqwz	cmn4qsmcx049487ny8rnte9sw	2024-02-20 23:00:00	2029-02-20 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:20.222	2026-03-24 15:04:29.328	f	\N
cmn4qsr9704n087ny9twr52ch	cmn4qpgmg00xe87nykzdihskj	cmn4qsmcx049487ny8rnte9sw	2023-07-18 22:00:00	2028-07-18 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:20.252	2026-03-24 15:04:29.372	f	\N
cmn4qsra004n387ny4w3kjuws	cmn4qpgpa00xp87nyu901kreo	cmn4qsmcx049487ny8rnte9sw	2022-03-26 23:00:00	2027-03-26 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:20.28	2026-03-24 15:04:29.402	f	\N
cmn4qsrax04n687nyju45169v	cmn4qphv6013187ny7sxc9npl	cmn4qsmcx049487ny8rnte9sw	2022-11-13 23:00:00	2027-11-13 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:20.313	2026-03-24 15:04:29.428	f	\N
cmn4qsrbv04n987ny0pa72u6d	cmn4qphzb013h87ny69z43upt	cmn4qsmcx049487ny8rnte9sw	2021-02-24 23:00:00	2026-02-24 23:00:00	IN_SCADENZA	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:20.348	2026-03-24 15:04:29.456	f	\N
cmn4qsrcp04nc87nycjc9zg13	cmn4qpi11013o87ny1zxpr4o7	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:20.377	2026-03-24 15:04:29.481	f	\N
cmn4qsrdu04nf87nyyqpfe4jw	cmn4qpi2n013w87nyfo4hhp2g	cmn4qsmcx049487ny8rnte9sw	2024-02-18 23:00:00	2029-02-18 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:20.418	2026-03-24 15:04:29.514	f	\N
cmn4qsrek04nh87nyqbdyaes6	cmn4qpi2z013y87ny3s0xcmgx	cmn4qsmcx049487ny8rnte9sw	2024-02-18 23:00:00	2029-02-18 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:20.444	2026-03-24 15:04:29.544	f	\N
cmn4qsrfl04nk87nyaz8lp7ld	cmn4qpi4l014787ny7esaxydx	cmn4qsmcx049487ny8rnte9sw	2023-05-30 22:00:00	2028-05-30 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:20.482	2026-03-24 15:04:29.576	f	\N
cmn4qsrgf04nm87nymr5eod4g	cmn4qpi4z014987nyqt88qw7u	cmn4qsmcx049487ny8rnte9sw	2024-12-04 23:00:00	2029-12-04 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:20.511	2026-03-24 15:04:29.605	f	\N
cmn4qsrh604no87ny104wzssp	cmn4qpie3015e87nywboje0eo	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:20.539	2026-03-24 15:04:29.638	f	\N
cmn4qsri704nr87nybku52mzl	cmn4qpig8015q87ny5ile524z	cmn4qsmcx049487ny8rnte9sw	2015-12-31 23:00:00	2020-12-31 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:20.575	2026-03-24 15:04:29.678	f	\N
cmn4qsriy04nt87nywy1d1itm	cmn4qpigo015s87nysg7c5dnf	cmn4qsmcx049487ny8rnte9sw	2015-12-31 23:00:00	2020-12-31 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:20.603	2026-03-24 15:04:29.72	f	\N
cmn4qsrjp04nv87nyycf9se1v	cmn4qpihw015w87nyr9om4r3c	cmn4qsmcx049487ny8rnte9sw	2024-06-15 22:00:00	2029-06-15 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:20.629	2026-03-24 15:04:29.745	f	\N
cmn4qsrkk04nx87ny6yhwojfi	cmn4qpik2016787nyayex585q	cmn4qsmcx049487ny8rnte9sw	2024-12-31 23:00:00	2029-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:20.661	2026-03-24 15:04:29.772	f	\N
cmn4qsrll04nz87ny4x5s8cfy	cmn4qpils016f87nyus4oe8y5	cmn4qsmcx049487ny8rnte9sw	2024-05-31 22:00:00	2029-05-31 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:20.697	2026-03-24 15:04:29.814	f	\N
cmn4qsrmd04o187nyjhph4xh5	cmn4qpim7016h87nyt46g2p5a	cmn4qsmcx049487ny8rnte9sw	2024-05-31 22:00:00	2029-05-31 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:20.725	2026-03-24 15:04:29.839	f	\N
cmn4qsrn404o387nyqxkv1xan	cmn4qpimj016j87nyp7kejwif	cmn4qsmcx049487ny8rnte9sw	2024-05-31 22:00:00	2029-05-31 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:20.752	2026-03-24 15:04:29.882	f	\N
cmn4qsro004o587nyt6srzu9x	cmn4qpimt016l87nylsk9l8kl	cmn4qsmcx049487ny8rnte9sw	2024-05-31 22:00:00	2029-05-31 22:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:20.784	2026-03-24 15:04:29.905	f	\N
cmn4qsroq04o887nyv6aivpy3	cmn4qpiqf017087nyo6z4whay	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:20.811	2026-03-24 15:04:29.941	f	\N
cmn4qsrph04oa87nykzrsnjh0	cmn4qpix2017r87nyv058rull	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:20.838	2026-03-24 15:04:29.969	f	\N
cmn4qsrq904oc87nyonf24tmu	cmn4qpixl017t87nyl26bsl57	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:20.866	2026-03-24 15:04:29.999	f	\N
cmn4qsrr104of87ny01bcxsq0	cmn4qpiz0017y87ny7bostjho	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:20.894	2026-03-24 15:04:30.024	f	\N
cmn4qsrrs04oi87nyqb0z7ah5	cmn4qpj19018787nyhv30yxam	cmn4qsmcx049487ny8rnte9sw	2021-12-12 23:00:00	2026-12-12 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:20.921	2026-03-24 15:04:30.047	f	\N
cmn4qsrsk04ok87nyuhvbqmay	cmn4qpj1n018987ny9oxada7r	cmn4qsmcx049487ny8rnte9sw	2021-12-12 23:00:00	2026-12-12 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:20.948	2026-03-24 15:04:30.071	f	\N
cmn4qsrte04on87nycnhnfytm	cmn4qpj5u018q87nymddfx7fk	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:20.979	2026-03-24 15:04:30.108	f	\N
cmn4qsru404op87nyca3y1fco	cmn4qpj6e018s87nycgxtomm0	cmn4qsmcx049487ny8rnte9sw	2018-10-09 22:00:00	2023-10-09 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:21.005	2026-03-24 15:04:30.14	f	\N
cmn4qsrv204os87ny2hde0zm1	cmn4qpj7o018x87ny5tgxk4sc	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:21.038	2026-03-24 15:04:30.171	f	\N
cmn4qsrvu04ou87nyqocryr51	cmn4qpj81018z87nyk7kfkt5a	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:21.067	2026-03-24 15:04:30.2	f	\N
cmn4qsrws04ox87ny0mnkp9mo	cmn4qpj9l019687nyslc225jg	cmn4qsmcx049487ny8rnte9sw	2018-10-09 22:00:00	2023-10-09 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:21.1	2026-03-24 15:04:30.235	f	\N
cmn4qsrxq04oz87ny3vrtjqz8	cmn4qpjaz019c87nywrqoshda	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:21.135	2026-03-24 15:04:30.258	f	\N
cmn4qsryh04p187ny7qbee8st	cmn4qpjc1019g87nyuu1tvsow	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:21.162	2026-03-24 15:04:30.282	f	\N
cmn4qsrz704p387nychgkw0yy	cmn4qpjdg019m87ny8oxhtz91	cmn4qsmcx049487ny8rnte9sw	2018-10-09 22:00:00	2023-10-09 22:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:21.187	2026-03-24 15:04:30.31	f	\N
cmn4qsrzw04p587nygq0fvw5l	cmn4qpjic01a887nyez43jphx	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:21.212	2026-03-24 15:04:30.337	f	\N
cmn4qss0o04p787nygdxltsp5	cmn4qpieh015g87ny17sjzk6e	cmn4qsmcx049487ny8rnte9sw	2024-12-31 23:00:00	2029-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:21.241	2026-03-24 15:04:30.377	f	\N
cmn4qss1d04p987nyvre4ao86	cmn4qpjl201al87nybim10fye	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:21.265	2026-03-24 15:04:30.401	f	\N
cmn4qss2504pb87nyt1rrtqlo	cmn4qpjme01ar87nyb6s06qur	cmn4qsmcx049487ny8rnte9sw	2024-12-31 23:00:00	2029-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:21.293	2026-03-24 15:04:30.424	f	\N
cmn4qss2z04pd87ny71olrnyb	cmn4qpjnd01av87nyse4rgv7b	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:21.323	2026-03-24 15:04:30.46	f	\N
cmn4qss3u04pf87nyzuurhj9m	cmn4qpjt501bf87nyaegdkr9h	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:21.354	2026-03-24 15:04:30.497	f	\N
cmn4qss4o04pi87nyt9lr791m	cmn4qpju501bk87ny3ocvepui	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:21.384	2026-03-24 15:04:30.525	f	\N
cmn4qss5g04pk87nyjfcawwum	cmn4qpjuo01bm87nyf0r2gzel	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:21.413	2026-03-24 15:04:30.549	f	\N
cmn4qss6l04pm87ny8dut06rg	cmn4qpjwi01bv87ny4t5txcbl	cmn4qsmcx049487ny8rnte9sw	2023-12-31 23:00:00	2028-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:21.454	2026-03-24 15:04:30.574	f	\N
cmn4qss7n04po87nyqqxggve6	cmn4qpjyr01c587ny02qx5czl	cmn4qsmcx049487ny8rnte9sw	2020-12-31 23:00:00	2025-12-31 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:21.491	2026-03-24 15:04:30.619	f	\N
cmn4qss8f04pr87ny8tblaubf	cmn4qpk1c01ce87ny9y9gvyog	cmn4qsmcx049487ny8rnte9sw	2024-12-31 23:00:00	2029-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:21.519	2026-03-24 15:04:30.65	f	\N
cmn4qss9904pu87nywi25t8sr	cmn4qpk2g01cj87ny43ei7inc	cmn4qsmcx049487ny8rnte9sw	2023-12-31 23:00:00	2028-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:21.55	2026-03-24 15:04:30.684	f	\N
cmn4qssa904px87nyc5ccd3e6	cmn4qpk3q01co87nypcuwl8sg	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:21.585	2026-03-24 15:04:30.71	f	\N
cmn4qssb304pz87ny2zaxrlbk	cmn4qpk4301cq87nyximxgysu	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:21.616	2026-03-24 15:04:30.739	f	\N
cmn4qssc704q287nykipy8f4x	cmn4qpk4s01cu87nysb02sbh3	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:21.655	2026-03-24 15:04:30.766	f	\N
cmn4qsscz04q487nyjewlshoo	cmn4qpk5501cw87ny9a21qwnz	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:21.684	2026-03-24 15:04:30.801	f	\N
cmn4qssdq04q687ny5yq1emt0	cmn4qpk5r01cy87nyc98lixdz	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:21.71	2026-03-24 15:04:30.839	f	\N
cmn4qssen04q887nyg6jubncj	cmn4qpk6701d087nyog32d1gc	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:21.743	2026-03-24 15:04:30.876	f	\N
cmn4qssfa04qa87nyf2rn116h	cmn4qpk6o01d287nyamxodiz3	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:21.766	2026-03-24 15:04:30.912	f	\N
cmn4qssga04qc87nyuac4bmrg	cmn4qpk7001d487nyo8xax1w5	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:21.803	2026-03-24 15:04:30.953	f	\N
cmn4qssh204qf87nyfwulj9s2	cmn4qpk7i01d687nyd1acx163	cmn4qsmcx049487ny8rnte9sw	2019-12-31 23:00:00	2024-12-31 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:21.831	2026-03-24 15:04:30.984	f	\N
cmn4qsshs04qh87nymv4vo2m7	cmn4qpk8501d887nyfbg8208l	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:21.857	2026-03-24 15:04:31.022	f	\N
cmn4qssil04qk87nydku8x8b2	cmn4qpk9401dd87ny7291oy3f	cmn4qsmcx049487ny8rnte9sw	2024-12-31 23:00:00	2029-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:21.886	2026-03-24 15:04:31.056	f	\N
cmn4qssjc04qm87nybm6pw1ux	cmn4qpk9g01df87ny9x6pvf1c	cmn4qsmcx049487ny8rnte9sw	2024-12-31 23:00:00	2029-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:21.912	2026-03-24 15:04:31.085	f	\N
cmn4qssk504qp87nybvz6qh6j	cmn4qpkbi01do87nya2a69ory	cmn4qsmcx049487ny8rnte9sw	2024-12-31 23:00:00	2029-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:21.941	2026-03-24 15:04:31.115	f	\N
cmn4qssky04qs87nyheubldjr	cmn4qpkcu01dt87nyhcfnlgjv	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:21.97	2026-03-24 15:04:31.145	f	\N
cmn4qsslt04qv87ny0b4drvlr	cmn4qpkdi01dw87nybjp4pige	cmn4qsmcx049487ny8rnte9sw	2025-10-31 23:00:00	2030-10-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:22.001	2026-03-24 15:04:31.174	f	\N
cmn4qssmk04qy87nyt212sf1r	cmn4qpkea01dz87nyxe6ripo8	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:22.028	2026-03-24 15:04:31.203	f	\N
cmn4qssnc04r087ny9wi6zxxq	cmn4qpkem01e187nyweo819sq	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:22.056	2026-03-24 15:04:31.228	f	\N
cmn4qsso704r387nyqlkqoye9	cmn4qpkg201e687nyf92b089t	cmn4qsmcx049487ny8rnte9sw	2025-02-28 23:00:00	2030-02-28 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:22.087	2026-03-24 15:04:31.253	f	\N
cmn4qssp304r587ny5snlxr2v	cmn4qpkge01e887nyv8h7on83	cmn4qsmcx049487ny8rnte9sw	2017-12-31 23:00:00	2022-12-31 23:00:00	SCADUTO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:22.12	2026-03-24 15:04:31.278	f	\N
cmn4qssq204r787nyno8aylly	cmn4qpkh401ec87nyodmt618a	cmn4qsmcx049487ny8rnte9sw	2025-12-31 23:00:00	2030-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:22.154	2026-03-24 15:04:31.303	f	\N
cmn4qssqw04r987nyei3a4oao	cmn4qpkhg01ee87nyclyy8jvg	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:22.185	2026-03-24 15:04:31.336	f	\N
cmn4qssrn04rc87nyqbotbwwk	cmn4qpki401eh87nydvrjzapa	cmn4qsmcx049487ny8rnte9sw	2026-01-31 23:00:00	2031-01-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:22.212	2026-03-24 15:04:31.373	f	\N
cmn4qsssf04rf87ny14x7dajd	cmn4qpkkb01er87nychom7mv6	cmn4qsmcx049487ny8rnte9sw	2025-12-31 23:00:00	2030-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:22.239	2026-03-24 15:04:31.404	f	\N
cmn4qsst704ri87ny57q1k899	cmn4qpkn801f487nyx0dgpr2l	cmn4qsmcx049487ny8rnte9sw	2022-12-31 23:00:00	2027-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:22.267	2026-03-24 15:04:31.437	f	\N
cmn4qssu004rk87ny338q55ux	cmn4qpkny01f887nyjb1g9h9l	cmn4qsmcx049487ny8rnte9sw	2025-12-31 23:00:00	2030-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:22.297	2026-03-24 15:04:31.464	f	\N
cmn4qssut04rm87nyumqrpd97	cmn4qpko801fa87ny64rg27c0	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:22.326	2026-03-24 15:04:31.5	f	\N
cmn4qssvq04ro87nyir2qqb8s	cmn4qpkp101fe87ny065qm73c	cmn4qsmcx049487ny8rnte9sw	2024-12-31 23:00:00	2029-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:22.358	2026-03-24 15:04:31.536	f	\N
cmn4qsswm04rr87nyptjmvd6z	cmn4qpkqo01fl87nyj5ww35i8	cmn4qsmcx049487ny8rnte9sw	2024-12-31 23:00:00	2029-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:22.39	2026-03-24 15:04:31.573	f	\N
cmn4qssxp04rt87ny60rojkup	cmn4qpkr001fn87nyiceb8qmq	cmn4qsmcx049487ny8rnte9sw	2024-12-31 23:00:00	2029-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:22.429	2026-03-24 15:04:31.597	f	\N
cmn4qssye04rv87nyhf7wpfop	cmn4qpkrk01fp87nyngjy8uj9	cmn4qsmcx049487ny8rnte9sw	2025-12-31 23:00:00	2030-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:22.454	2026-03-24 15:04:31.624	f	\N
cmn4qsszb04rx87nyyjw1wdrk	cmn4qpksp01fv87nyaaoy8dro	cmn4qsmcx049487ny8rnte9sw	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:22.487	2026-03-24 15:04:31.651	f	\N
cmn4qst0704s087ny1211k1iv	cmn4qpktc01fy87ny4p8tpt46	cmn4qsmcx049487ny8rnte9sw	2024-12-31 23:00:00	2029-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:22.519	2026-03-24 15:04:31.679	f	\N
cmn4qst0x04s287nylcpq3d9k	cmn4qpktn01g087nyxd09pfyr	cmn4qsmcx049487ny8rnte9sw	2024-12-31 23:00:00	2029-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:22.546	2026-03-24 15:04:31.705	f	\N
cmn4qst1o04s487nyy5ntpkds	cmn4qpkun01g687ny1g5sgqh5	cmn4qsmcx049487ny8rnte9sw	2025-12-31 23:00:00	2030-12-31 23:00:00	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:01:22.572	2026-03-24 15:04:31.731	f	\N
cmn4qx8hf051987ny8awnieyg	cmn4qpk8501d887nyfbg8208l	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:04:49.203	2026-03-24 15:04:49.203	f	\N
cmn4qx8iq051c87nyvnighioi	cmn4qpk9401dd87ny7291oy3f	cmn4qq21401n487nyq9w5bv7g	2024-12-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:04:49.251	2026-03-24 15:04:49.251	f	\N
cmn4qx8je051e87ny0b53vh6r	cmn4qpk9g01df87ny9x6pvf1c	cmn4qq21401n487nyq9w5bv7g	2024-12-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:04:49.275	2026-03-24 15:04:49.275	f	\N
cmn4qx8k9051g87nyfceqc2u3	cmn4qpk9u01dh87nybgyb9xuh	cmn4qq21401n487nyq9w5bv7g	2024-12-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:04:49.306	2026-03-24 15:04:49.306	f	\N
cmn4qx8lh051j87nyyfdq2mxr	cmn4qpkbi01do87nya2a69ory	cmn4qq21401n487nyq9w5bv7g	2024-12-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:04:49.349	2026-03-24 15:04:49.349	f	\N
cmn4qx8mh051m87ny0n9t1a4d	cmn4qpkcu01dt87nyhcfnlgjv	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:04:49.385	2026-03-24 15:04:49.385	f	\N
cmn4qx8n7051p87nybxfxwwxo	cmn4qpkdi01dw87nybjp4pige	cmn4qq21401n487nyq9w5bv7g	2023-12-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:04:49.412	2026-03-24 15:04:49.412	f	\N
cmn4qx8nv051s87ny2wi1j9il	cmn4qpkea01dz87nyxe6ripo8	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:04:49.436	2026-03-24 15:04:49.436	f	\N
cmn4qx8oi051u87nyoc1qj2ah	cmn4qpkem01e187nyweo819sq	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:04:49.459	2026-03-24 15:04:49.459	f	\N
cmn4qx8p6051w87nyzp1ev159	cmn4qpkfc01e387ny0bz9ijnu	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:04:49.483	2026-03-24 15:04:49.483	f	\N
cmn4qx8pv051z87nyw6hg2ns8	cmn4qpkg201e687nyf92b089t	cmn4qq21401n487nyq9w5bv7g	2025-02-28 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:04:49.508	2026-03-24 15:04:49.508	f	\N
cmn4qx8ql052187nystwuilwq	cmn4qpkge01e887nyv8h7on83	cmn4qq21401n487nyq9w5bv7g	2017-12-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:04:49.534	2026-03-24 15:04:49.534	f	\N
cmn4qx8rb052387ny2f0m085p	cmn4qpkh401ec87nyodmt618a	cmn4qq21401n487nyq9w5bv7g	2025-12-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:04:49.56	2026-03-24 15:04:49.56	f	\N
cmn4qx8s4052587nyb8rlzsfb	cmn4qpkhg01ee87nyclyy8jvg	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:04:49.588	2026-03-24 15:04:49.588	f	\N
cmn4qx8sw052887nyrakz2siy	cmn4qpki401eh87nydvrjzapa	cmn4qq21401n487nyq9w5bv7g	2026-01-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:04:49.617	2026-03-24 15:04:49.617	f	\N
cmn4qx8tt052a87nyugoc758o	cmn4qpkkb01er87nychom7mv6	cmn4qq21401n487nyq9w5bv7g	2025-12-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:04:49.65	2026-03-24 15:04:49.65	f	\N
cmn4qx8v1052c87nyfez3brlq	cmn4qpkks01et87nyic2g4wu9	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:04:49.693	2026-03-24 15:04:49.693	f	\N
cmn4qx8vw052f87nyld95y7qo	cmn4qpkn801f487nyx0dgpr2l	cmn4qq21401n487nyq9w5bv7g	2022-12-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:04:49.724	2026-03-24 15:04:49.724	f	\N
cmn4qx8wp052h87nyqute3ox5	cmn4qpkny01f887nyjb1g9h9l	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:04:49.754	2026-03-24 15:04:49.754	f	\N
cmn4qx8xm052j87nyx03ydjc6	cmn4qpko801fa87ny64rg27c0	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:04:49.787	2026-03-24 15:04:49.787	f	\N
cmn4qx8yk052l87ny1om4apfn	cmn4qpkp101fe87ny065qm73c	cmn4qq21401n487nyq9w5bv7g	2024-12-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:04:49.82	2026-03-24 15:04:49.82	f	\N
cmn4qx8zp052n87nyn8ros6bl	cmn4qpkpl01fg87nyqrz9zykp	cmn4qq21401n487nyq9w5bv7g	2020-12-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:04:49.862	2026-03-24 15:04:49.862	f	\N
cmn4qx90n052q87ny50zcveth	cmn4qpkqo01fl87nyj5ww35i8	cmn4qq21401n487nyq9w5bv7g	2024-12-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:04:49.896	2026-03-24 15:04:49.896	f	\N
cmn4qx91h052s87ny80u9sw6v	cmn4qpkr001fn87nyiceb8qmq	cmn4qq21401n487nyq9w5bv7g	2024-12-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:04:49.925	2026-03-24 15:04:49.925	f	\N
cmn4qx927052u87nyufkx4oed	cmn4qpkrk01fp87nyngjy8uj9	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:04:49.952	2026-03-24 15:04:49.952	f	\N
cmn4qx935052w87nyrxmhitj0	cmn4qpkrv01fr87nyg5h7vqh1	cmn4qq21401n487nyq9w5bv7g	2021-12-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:04:49.985	2026-03-24 15:04:49.985	f	\N
cmn4qx940052y87ny3bzhvll6	cmn4qpks801ft87nyuhg4qjo1	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:04:50.017	2026-03-24 15:04:50.017	f	\N
cmn4qx94y053087nyns3ua2sd	cmn4qpksp01fv87nyaaoy8dro	cmn4qq21401n487nyq9w5bv7g	\N	\N	DA_FARE	MEDIA	\N	2	3	f	\N	2026-03-24 15:04:50.051	2026-03-24 15:04:50.051	f	\N
cmn4qx95v053387nyrth084iz	cmn4qpktc01fy87ny4p8tpt46	cmn4qq21401n487nyq9w5bv7g	2024-12-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:04:50.083	2026-03-24 15:04:50.083	f	\N
cmn4qx96r053587ny0zu702qk	cmn4qpktn01g087nyxd09pfyr	cmn4qq21401n487nyq9w5bv7g	2024-12-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:04:50.116	2026-03-24 15:04:50.116	f	\N
cmn4qx97y053787ny0w405z3a	cmn4qpkua01g487ny3jwbn2lh	cmn4qq21401n487nyq9w5bv7g	2018-12-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:04:50.158	2026-03-24 15:04:50.158	f	\N
cmn4qx98l053987nyyp23a7oy	cmn4qpkun01g687ny1g5sgqh5	cmn4qq21401n487nyq9w5bv7g	2025-12-31 23:00:00	\N	VALIDO	MEDIA	\N	2	3	f	\N	2026-03-24 15:04:50.182	2026-03-24 15:04:50.182	f	\N
cmneqed0y0001115rrihjs1dx	cmmndf4sj0001g4motnfhux74	cmn4qqgkh02q387nypgux5wod	2026-03-30 10:00:00	2027-03-30 10:00:00	SVOLTO	MEDIA	\N	2	3	f	\N	2026-03-31 14:47:50.386	2026-03-31 14:47:50.386	f	\N
cmneqfguu0003115rh4ka01i7	cmmndkqij0003g4mojjqz1ael	cmn4qqgkh02q387nypgux5wod	2026-04-01 10:00:00	\N	DA_FARE	MEDIA	350.000000000000000000000000000000	2	3	f	\N	2026-03-31 14:48:42.007	2026-04-02 10:20:23.781	f	\N
cmmnf9h9k0007svg09hwbmy7c	cmmndf4sj0001g4motnfhux74	cmmnf9h950005svg079sl1sze	2026-03-12 11:00:00	2027-03-12 11:00:00	SVOLTO	BASSA	250.000000000000000000000000000000	2	3	f	\N	2026-03-12 12:06:20.072	2026-04-02 10:21:05.938	t	2026-04-02 10:00:00
cmn4qsej3049087nyq80vicar	cmn4qphzy013j87nybcuj2iuh	cmn4qseic048x87nyetridc8x	2021-04-08 10:00:00	2026-04-08 10:00:00	SVOLTO	MEDIA	150.000000000000000000000000000000	2	3	t	\N	2026-03-24 15:01:03.76	2026-04-07 11:28:09.284	t	2026-04-07 10:00:00
cmnwylnvy0008t8a0y68q5t3j	cmnwyky7r0002t8a0c5uq9dqb	cmn4qqgkh02q387nypgux5wod	2026-04-12 10:00:00	\N	DA_FARE	MEDIA	350.000000000000000000000000000000	2	3	f	\N	2026-04-13 08:57:19.15	2026-04-13 08:57:19.15	f	\N
cmnwym74d000at8a0qdnwf10y	cmnwyky7r0002t8a0c5uq9dqb	cmn4qqd9q02gw87nycctz7zf2	2026-04-12 10:00:00	2027-04-12 10:00:00	SVOLTO	MEDIA	250.000000000000000000000000000000	2	3	t	\N	2026-04-13 08:57:44.078	2026-04-13 08:57:44.078	t	2026-04-13 10:00:00
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."User" (id, email, password, name, role, "createdAt") FROM stdin;
cmmp3o4fn0000m5bcowtxvwle	admin	scrypt$c7cdcd9503d718c0a3334b92eb310d63$864fe0ee433f047c2f6cf3eaef7a8195a659ccb64868031a80691a1eafecd8244c4fd1fa588524562e8aac2e9157a1982efeb65bbd622988b03ba9f4da760f9d	Marco	admin	2026-03-13 16:17:20.244
cmnd2nhc20000od1pexva5ulm	marcgest	scrypt$88baec57368992d23f912a02801edaad$220e594eb0740cc381df8703d353492620aa3af079e2732f46746795ce220eee9250485a804d5793ef16dad231f38ef5f88e161186d380043184b6ae68edcccc	marco amato	admin	2026-03-30 10:55:18.818
cmnd3164a0000ll5c7zbzivh1	flogest	scrypt$b759fcf42f11c7fc29ed729fe2b07f35$99d0aa2736fc76c7cfaf9355a524e688ad3b8775e7b303b91b2eccf1fe054aab2ba1b919841fcc40b02c3bc3b8975c40c97cb675ac74fce59b973f836b0ab571	Floriana	staff	2026-03-30 11:05:57.493
cmnd333jl0001ll5ccx6slr8x	ingest	scrypt$bdf8c1358a66b266b33dcf91ea4c089b$cdde2d1fe4416e44474b6bd820e93702f911d2a4d5349b23e8c12060ff3f803e27dc3035d5c9d2f8bc9de3f331c00d29e4542495a9eecec089712c78bb27dc13	Domiziano	ingegnere_clinico	2026-03-30 11:07:27.467
\.


--
-- Data for Name: WorkReport; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."WorkReport" (id, ym, "clientId", "serviceId", "siteId", "amountEur", "workedAt", notes, "createdAt", "updatedAt") FROM stdin;
cmmm4sxdk000810jtgevyrfti	2026-03	cmmjawsgx0000h56epujvz067	cmmj9uksl000465jcrd26xcik	\N	350.000000000000000000000000000000	2026-03-11 14:25:45.464	\N	2026-03-11 14:25:45.462	2026-03-11 14:25:45.462
cmmurwy460014jrkek4ip4h0g	2026-03	cmmf0m8j80002kwqkcyzviolg	cmmj9v3hu000765jc4bvdnr4g	cmmj9s76m000165jcai75ekxs	350.000000000000000000000000000000	2026-03-17 15:34:53.621	\N	2026-03-17 15:34:53.619	2026-03-17 15:34:53.619
cmmurxxql0017jrkevf8rm8dk	2026-03	cmmjawsgx0000h56epujvz067	cmmj9v3hu000765jc4bvdnr4g	cmmktln9k0001mhl9ttxkwoo0	350.000000000000000000000000000000	2026-03-17 15:35:39.789	\N	2026-03-17 15:35:39.788	2026-03-17 15:35:39.788
cmmuryc43001ajrkec7uvj89k	2026-03	cmmdjfgx00000kd41ei21e3yl	cmmj9v3hu000765jc4bvdnr4g	cmmdkyjzj0008kd41jnxpilts	350.000000000000000000000000000000	2026-03-17 15:35:58.419	\N	2026-03-17 15:35:58.418	2026-03-17 15:35:58.418
cmmyxqy6v00024lbq1hh0x4c1	2026-03	cmmjawsgx0000h56epujvz067	cmmj9v3hu000765jc4bvdnr4g	cmmktln9k0001mhl9ttxkwoo0	350.000000000000000000000000000000	2026-03-20 13:29:16.182	\N	2026-03-20 13:29:16.18	2026-03-20 13:29:16.18
cmn4pl3er000h87nylspqj7vm	2026-03	cmn4ow97s000087nynvwbazw9	cmmj9uksl000465jcrd26xcik	cmn4oz5k7000487ny9ths0563	250.000000000000000000000000000000	2026-03-24 14:27:23.138	\N	2026-03-24 14:27:23.136	2026-03-24 14:27:23.136
cmn5vvyy9053j87nyh6kwxh7m	2026-03	cmn3dffdp0000yfuydsiupw6i	cmmj9uksl000465jcrd26xcik	cmn3diwk20006yfuyn0ig9g3v	350.000000000000000000000000000000	2026-03-25 10:11:34.448	\N	2026-03-25 10:11:34.446	2026-03-25 10:11:34.446
cmn5vzvpb053m87ny9v1asilf	2026-03	cmmf0m8j80002kwqkcyzviolg	cmmj9v3hu000765jc4bvdnr4g	cmmj9s76m000165jcai75ekxs	350.000000000000000000000000000000	2026-03-25 10:14:36.862	\N	2026-03-25 10:14:36.861	2026-03-25 10:14:36.861
cmn5w6rb7053o87nyufo5otdc	2026-03	cmn3dffdp0000yfuydsiupw6i	\N	cmn3diwk20006yfuyn0ig9g3v	400.000000000000000000000000000000	2026-03-23 00:00:00	[VSE_CHECK:cmn3ef4yh00013tbw6yfnyk9j] • VSE • PIERFERDINANDOLO GUGLIELMONI • ANAGNINA	2026-03-25 10:19:57.764	2026-03-25 10:19:57.764
cmnojoa7d0005f11hfbd1d62t	2026-04	cmmdjfgx00000kd41ei21e3yl	\N	cmmdkyf5z0006kd41l6pqnqlc	300.000000000000000000000000000000	2026-04-07 00:00:00	[VSE_CHECK:cmmdnxemq0001pwgfaw3ytrwn] • VSE • marco amato • marco g	2026-04-07 11:37:17.737	2026-04-07 11:37:17.737
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2026-03-25 10:59:20
20211116045059	2026-03-25 10:59:20
20211116050929	2026-03-25 10:59:20
20211116051442	2026-03-25 10:59:20
20211116212300	2026-03-25 10:59:20
20211116213355	2026-03-25 10:59:20
20211116213934	2026-03-25 10:59:20
20211116214523	2026-03-25 10:59:20
20211122062447	2026-03-25 10:59:20
20211124070109	2026-03-25 10:59:20
20211202204204	2026-03-25 10:59:20
20211202204605	2026-03-25 10:59:20
20211210212804	2026-03-25 10:59:20
20211228014915	2026-03-25 10:59:20
20220107221237	2026-03-25 10:59:20
20220228202821	2026-03-25 10:59:21
20220312004840	2026-03-25 10:59:21
20220603231003	2026-03-25 10:59:21
20220603232444	2026-03-25 10:59:21
20220615214548	2026-03-25 10:59:21
20220712093339	2026-03-25 10:59:21
20220908172859	2026-03-25 10:59:21
20220916233421	2026-03-25 10:59:21
20230119133233	2026-03-25 10:59:21
20230128025114	2026-03-25 10:59:21
20230128025212	2026-03-25 10:59:21
20230227211149	2026-03-25 10:59:21
20230228184745	2026-03-25 10:59:21
20230308225145	2026-03-25 10:59:21
20230328144023	2026-03-25 10:59:21
20231018144023	2026-03-25 10:59:21
20231204144023	2026-03-25 10:59:21
20231204144024	2026-03-25 10:59:21
20231204144025	2026-03-25 10:59:21
20240108234812	2026-03-25 10:59:21
20240109165339	2026-03-25 10:59:21
20240227174441	2026-03-25 10:59:21
20240311171622	2026-03-25 10:59:21
20240321100241	2026-03-25 10:59:21
20240401105812	2026-03-25 10:59:21
20240418121054	2026-03-25 10:59:21
20240523004032	2026-03-25 10:59:21
20240618124746	2026-03-25 10:59:21
20240801235015	2026-03-25 10:59:21
20240805133720	2026-03-25 10:59:21
20240827160934	2026-03-25 10:59:21
20240919163303	2026-03-25 10:59:21
20240919163305	2026-03-25 10:59:21
20241019105805	2026-03-25 10:59:21
20241030150047	2026-03-25 10:59:21
20241108114728	2026-03-25 10:59:21
20241121104152	2026-03-25 10:59:21
20241130184212	2026-03-25 10:59:21
20241220035512	2026-03-25 10:59:21
20241220123912	2026-03-25 10:59:21
20241224161212	2026-03-25 10:59:21
20250107150512	2026-03-25 10:59:21
20250110162412	2026-03-25 10:59:21
20250123174212	2026-03-25 10:59:21
20250128220012	2026-03-25 10:59:21
20250506224012	2026-03-25 10:59:21
20250523164012	2026-03-25 10:59:21
20250714121412	2026-03-25 10:59:21
20250905041441	2026-03-25 10:59:21
20251103001201	2026-03-25 10:59:21
20251120212548	2026-03-25 10:59:21
20251120215549	2026-03-25 10:59:21
20260218120000	2026-03-25 10:59:21
20260326120000	2026-04-15 09:55:34
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at, action_filter) FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id, type) FROM stdin;
\.


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.buckets_analytics (name, type, format, created_at, updated_at, id, deleted_at) FROM stdin;
\.


--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.buckets_vectors (id, type, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2026-03-25 10:59:20.642315
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2026-03-25 10:59:20.702617
2	storage-schema	f6a1fa2c93cbcd16d4e487b362e45fca157a8dbd	2026-03-25 10:59:20.706434
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2026-03-25 10:59:20.763961
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2026-03-25 10:59:20.801979
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2026-03-25 10:59:20.807275
6	change-column-name-in-get-size	ded78e2f1b5d7e616117897e6443a925965b30d2	2026-03-25 10:59:20.816744
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2026-03-25 10:59:20.827055
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2026-03-25 10:59:20.830569
9	fix-search-function	af597a1b590c70519b464a4ab3be54490712796b	2026-03-25 10:59:20.834339
10	search-files-search-function	b595f05e92f7e91211af1bbfe9c6a13bb3391e16	2026-03-25 10:59:20.838125
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2026-03-25 10:59:20.851317
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2026-03-25 10:59:20.857277
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2026-03-25 10:59:20.862704
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2026-03-25 10:59:20.866505
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2026-03-25 10:59:20.898493
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2026-03-25 10:59:20.902718
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2026-03-25 10:59:20.9226
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2026-03-25 10:59:20.926676
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2026-03-25 10:59:20.935116
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2026-03-25 10:59:20.939095
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2026-03-25 10:59:20.945724
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2026-03-25 10:59:20.961443
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2026-03-25 10:59:20.97079
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2026-03-25 10:59:20.975859
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2026-03-25 10:59:20.980052
26	objects-prefixes	215cabcb7f78121892a5a2037a09fedf9a1ae322	2026-03-25 10:59:20.983612
27	search-v2	859ba38092ac96eb3964d83bf53ccc0b141663a6	2026-03-25 10:59:20.987001
28	object-bucket-name-sorting	c73a2b5b5d4041e39705814fd3a1b95502d38ce4	2026-03-25 10:59:20.990933
29	create-prefixes	ad2c1207f76703d11a9f9007f821620017a66c21	2026-03-25 10:59:20.994152
30	update-object-levels	2be814ff05c8252fdfdc7cfb4b7f5c7e17f0bed6	2026-03-25 10:59:20.998003
31	objects-level-index	b40367c14c3440ec75f19bbce2d71e914ddd3da0	2026-03-25 10:59:21.001471
32	backward-compatible-index-on-objects	e0c37182b0f7aee3efd823298fb3c76f1042c0f7	2026-03-25 10:59:21.004852
33	backward-compatible-index-on-prefixes	b480e99ed951e0900f033ec4eb34b5bdcb4e3d49	2026-03-25 10:59:21.008451
34	optimize-search-function-v1	ca80a3dc7bfef894df17108785ce29a7fc8ee456	2026-03-25 10:59:21.011606
35	add-insert-trigger-prefixes	458fe0ffd07ec53f5e3ce9df51bfdf4861929ccc	2026-03-25 10:59:21.015081
36	optimise-existing-functions	6ae5fca6af5c55abe95369cd4f93985d1814ca8f	2026-03-25 10:59:21.018426
37	add-bucket-name-length-trigger	3944135b4e3e8b22d6d4cbb568fe3b0b51df15c1	2026-03-25 10:59:21.021761
38	iceberg-catalog-flag-on-buckets	02716b81ceec9705aed84aa1501657095b32e5c5	2026-03-25 10:59:21.026041
39	add-search-v2-sort-support	6706c5f2928846abee18461279799ad12b279b78	2026-03-25 10:59:21.042028
40	fix-prefix-race-conditions-optimized	7ad69982ae2d372b21f48fc4829ae9752c518f6b	2026-03-25 10:59:21.045315
41	add-object-level-update-trigger	07fcf1a22165849b7a029deed059ffcde08d1ae0	2026-03-25 10:59:21.048588
42	rollback-prefix-triggers	771479077764adc09e2ea2043eb627503c034cd4	2026-03-25 10:59:21.051894
43	fix-object-level	84b35d6caca9d937478ad8a797491f38b8c2979f	2026-03-25 10:59:21.055067
44	vector-bucket-type	99c20c0ffd52bb1ff1f32fb992f3b351e3ef8fb3	2026-03-25 10:59:21.058217
45	vector-buckets	049e27196d77a7cb76497a85afae669d8b230953	2026-03-25 10:59:21.062007
46	buckets-objects-grants	fedeb96d60fefd8e02ab3ded9fbde05632f84aed	2026-03-25 10:59:21.072253
47	iceberg-table-metadata	649df56855c24d8b36dd4cc1aeb8251aa9ad42c2	2026-03-25 10:59:21.076311
48	iceberg-catalog-ids	e0e8b460c609b9999ccd0df9ad14294613eed939	2026-03-25 10:59:21.079842
49	buckets-objects-grants-postgres	072b1195d0d5a2f888af6b2302a1938dd94b8b3d	2026-03-25 10:59:21.119987
50	search-v2-optimised	6323ac4f850aa14e7387eb32102869578b5bd478	2026-03-25 10:59:21.124522
51	index-backward-compatible-search	2ee395d433f76e38bcd3856debaf6e0e5b674011	2026-03-25 10:59:21.154542
52	drop-not-used-indexes-and-functions	5cc44c8696749ac11dd0dc37f2a3802075f3a171	2026-03-25 10:59:21.155859
53	drop-index-lower-name	d0cb18777d9e2a98ebe0bc5cc7a42e57ebe41854	2026-03-25 10:59:21.189419
54	drop-index-object-level	6289e048b1472da17c31a7eba1ded625a6457e67	2026-03-25 10:59:21.191523
55	prevent-direct-deletes	262a4798d5e0f2e7c8970232e03ce8be695d5819	2026-03-25 10:59:21.193114
56	fix-optimized-search-function	cb58526ebc23048049fd5bf2fd148d18b04a2073	2026-03-25 10:59:21.197173
57	s3-multipart-uploads-metadata	f127886e00d1b374fadbc7c6b31e09336aad5287	2026-04-15 09:55:37.891377
58	operation-ergonomics	00ca5d483b3fe0d522133d9002ccc5df98365120	2026-04-15 09:55:37.955462
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata, metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.vector_indexes (id, name, bucket_id, data_type, dimension, distance_metric, metadata_configuration, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: -
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: -
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 1, false);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: -
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: custom_oauth_providers custom_oauth_providers_identifier_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_identifier_key UNIQUE (identifier);


--
-- Name: custom_oauth_providers custom_oauth_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_code_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_code_key UNIQUE (authorization_code);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_id_key UNIQUE (authorization_id);


--
-- Name: oauth_authorizations oauth_authorizations_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_pkey PRIMARY KEY (id);


--
-- Name: oauth_client_states oauth_client_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_client_states
    ADD CONSTRAINT oauth_client_states_pkey PRIMARY KEY (id);


--
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_user_client_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_client_unique UNIQUE (user_id, client_id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: webauthn_challenges webauthn_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.webauthn_challenges
    ADD CONSTRAINT webauthn_challenges_pkey PRIMARY KEY (id);


--
-- Name: webauthn_credentials webauthn_credentials_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.webauthn_credentials
    ADD CONSTRAINT webauthn_credentials_pkey PRIMARY KEY (id);


--
-- Name: ClientContactMarketingList ClientContactMarketingList_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ClientContactMarketingList"
    ADD CONSTRAINT "ClientContactMarketingList_pkey" PRIMARY KEY (id);


--
-- Name: ClientContact ClientContact_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ClientContact"
    ADD CONSTRAINT "ClientContact_pkey" PRIMARY KEY (id);


--
-- Name: ClientPractice ClientPractice_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ClientPractice"
    ADD CONSTRAINT "ClientPractice_pkey" PRIMARY KEY (id);


--
-- Name: ClientService ClientService_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ClientService"
    ADD CONSTRAINT "ClientService_pkey" PRIMARY KEY (id);


--
-- Name: ClientSite ClientSite_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ClientSite"
    ADD CONSTRAINT "ClientSite_pkey" PRIMARY KEY (id);


--
-- Name: Client Client_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Client"
    ADD CONSTRAINT "Client_pkey" PRIMARY KEY (id);


--
-- Name: ClinicalEngineeringCheck ClinicalEngineeringCheck_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ClinicalEngineeringCheck"
    ADD CONSTRAINT "ClinicalEngineeringCheck_pkey" PRIMARY KEY (id);


--
-- Name: CourseCatalog CourseCatalog_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CourseCatalog"
    ADD CONSTRAINT "CourseCatalog_pkey" PRIMARY KEY (id);


--
-- Name: MapPlanItem MapPlanItem_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MapPlanItem"
    ADD CONSTRAINT "MapPlanItem_pkey" PRIMARY KEY (id);


--
-- Name: MarketingList MarketingList_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MarketingList"
    ADD CONSTRAINT "MarketingList_pkey" PRIMARY KEY (id);


--
-- Name: PersonClient PersonClient_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PersonClient"
    ADD CONSTRAINT "PersonClient_pkey" PRIMARY KEY (id);


--
-- Name: PersonSite PersonSite_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PersonSite"
    ADD CONSTRAINT "PersonSite_pkey" PRIMARY KEY (id);


--
-- Name: Person Person_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Person"
    ADD CONSTRAINT "Person_pkey" PRIMARY KEY (id);


--
-- Name: PracticeBillingStep PracticeBillingStep_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PracticeBillingStep"
    ADD CONSTRAINT "PracticeBillingStep_pkey" PRIMARY KEY (id);


--
-- Name: ServiceCatalog ServiceCatalog_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ServiceCatalog"
    ADD CONSTRAINT "ServiceCatalog_pkey" PRIMARY KEY (id);


--
-- Name: TrainingRecord TrainingRecord_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TrainingRecord"
    ADD CONSTRAINT "TrainingRecord_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: WorkReport WorkReport_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."WorkReport"
    ADD CONSTRAINT "WorkReport_pkey" PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.buckets_analytics
    ADD CONSTRAINT buckets_analytics_pkey PRIMARY KEY (id);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: buckets_vectors buckets_vectors_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.buckets_vectors
    ADD CONSTRAINT buckets_vectors_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: vector_indexes vector_indexes_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_pkey PRIMARY KEY (id);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: custom_oauth_providers_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX custom_oauth_providers_created_at_idx ON auth.custom_oauth_providers USING btree (created_at);


--
-- Name: custom_oauth_providers_enabled_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX custom_oauth_providers_enabled_idx ON auth.custom_oauth_providers USING btree (enabled);


--
-- Name: custom_oauth_providers_identifier_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX custom_oauth_providers_identifier_idx ON auth.custom_oauth_providers USING btree (identifier);


--
-- Name: custom_oauth_providers_provider_type_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX custom_oauth_providers_provider_type_idx ON auth.custom_oauth_providers USING btree (provider_type);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_oauth_client_states_created_at; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_oauth_client_states_created_at ON auth.oauth_client_states USING btree (created_at);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: oauth_auth_pending_exp_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_auth_pending_exp_idx ON auth.oauth_authorizations USING btree (expires_at) WHERE (status = 'pending'::auth.oauth_authorization_status);


--
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_clients_deleted_at_idx ON auth.oauth_clients USING btree (deleted_at);


--
-- Name: oauth_consents_active_client_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_consents_active_client_idx ON auth.oauth_consents USING btree (client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_active_user_client_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_consents_active_user_client_idx ON auth.oauth_consents USING btree (user_id, client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_user_order_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_consents_user_order_idx ON auth.oauth_consents USING btree (user_id, granted_at DESC);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_oauth_client_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_oauth_client_id_idx ON auth.sessions USING btree (oauth_client_id);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sso_providers_resource_id_pattern_idx ON auth.sso_providers USING btree (resource_id text_pattern_ops);


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: webauthn_challenges_expires_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX webauthn_challenges_expires_at_idx ON auth.webauthn_challenges USING btree (expires_at);


--
-- Name: webauthn_challenges_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX webauthn_challenges_user_id_idx ON auth.webauthn_challenges USING btree (user_id);


--
-- Name: webauthn_credentials_credential_id_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX webauthn_credentials_credential_id_key ON auth.webauthn_credentials USING btree (credential_id);


--
-- Name: webauthn_credentials_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX webauthn_credentials_user_id_idx ON auth.webauthn_credentials USING btree (user_id);


--
-- Name: ClientContactMarketingList_clientContactId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ClientContactMarketingList_clientContactId_idx" ON public."ClientContactMarketingList" USING btree ("clientContactId");


--
-- Name: ClientContactMarketingList_clientContactId_marketingListId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "ClientContactMarketingList_clientContactId_marketingListId_key" ON public."ClientContactMarketingList" USING btree ("clientContactId", "marketingListId");


--
-- Name: ClientContactMarketingList_marketingListId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ClientContactMarketingList_marketingListId_idx" ON public."ClientContactMarketingList" USING btree ("marketingListId");


--
-- Name: ClientContact_clientId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ClientContact_clientId_idx" ON public."ClientContact" USING btree ("clientId");


--
-- Name: ClientContact_marketingList_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ClientContact_marketingList_idx" ON public."ClientContact" USING btree ("marketingList");


--
-- Name: ClientContact_role_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ClientContact_role_idx" ON public."ClientContact" USING btree (role);


--
-- Name: ClientPractice_apertureStatus_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ClientPractice_apertureStatus_idx" ON public."ClientPractice" USING btree ("apertureStatus");


--
-- Name: ClientPractice_clientId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ClientPractice_clientId_idx" ON public."ClientPractice" USING btree ("clientId");


--
-- Name: ClientPractice_fatturataAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ClientPractice_fatturataAt_idx" ON public."ClientPractice" USING btree ("fatturataAt");


--
-- Name: ClientPractice_fatturata_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ClientPractice_fatturata_idx" ON public."ClientPractice" USING btree (fatturata);


--
-- Name: ClientPractice_inApertureList_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ClientPractice_inApertureList_idx" ON public."ClientPractice" USING btree ("inApertureList");


--
-- Name: ClientPractice_practiceDate_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ClientPractice_practiceDate_idx" ON public."ClientPractice" USING btree ("practiceDate");


--
-- Name: ClientPractice_startYear_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ClientPractice_startYear_idx" ON public."ClientPractice" USING btree ("startYear");


--
-- Name: ClientService_clientId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ClientService_clientId_idx" ON public."ClientService" USING btree ("clientId");


--
-- Name: ClientService_dueDate_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ClientService_dueDate_idx" ON public."ClientService" USING btree ("dueDate");


--
-- Name: ClientService_referenteName_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ClientService_referenteName_idx" ON public."ClientService" USING btree ("referenteName");


--
-- Name: ClientService_siteId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ClientService_siteId_idx" ON public."ClientService" USING btree ("siteId");


--
-- Name: ClientService_source_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ClientService_source_idx" ON public."ClientService" USING btree (source);


--
-- Name: ClientSite_clientId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ClientSite_clientId_idx" ON public."ClientSite" USING btree ("clientId");


--
-- Name: ClientSite_clientId_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "ClientSite_clientId_name_key" ON public."ClientSite" USING btree ("clientId", name);


--
-- Name: Client_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Client_name_key" ON public."Client" USING btree (name);


--
-- Name: ClinicalEngineeringCheck_clientId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ClinicalEngineeringCheck_clientId_idx" ON public."ClinicalEngineeringCheck" USING btree ("clientId");


--
-- Name: ClinicalEngineeringCheck_dataAppuntamentoPreso_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ClinicalEngineeringCheck_dataAppuntamentoPreso_idx" ON public."ClinicalEngineeringCheck" USING btree ("dataAppuntamentoPreso");


--
-- Name: ClinicalEngineeringCheck_dataProssimoAppuntamento_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ClinicalEngineeringCheck_dataProssimoAppuntamento_idx" ON public."ClinicalEngineeringCheck" USING btree ("dataProssimoAppuntamento");


--
-- Name: ClinicalEngineeringCheck_fatturataAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ClinicalEngineeringCheck_fatturataAt_idx" ON public."ClinicalEngineeringCheck" USING btree ("fatturataAt");


--
-- Name: ClinicalEngineeringCheck_siteId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ClinicalEngineeringCheck_siteId_idx" ON public."ClinicalEngineeringCheck" USING btree ("siteId");


--
-- Name: ClinicalEngineeringCheck_tecnicoFatturatoAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ClinicalEngineeringCheck_tecnicoFatturatoAt_idx" ON public."ClinicalEngineeringCheck" USING btree ("tecnicoFatturatoAt");


--
-- Name: CourseCatalog_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "CourseCatalog_name_key" ON public."CourseCatalog" USING btree (name);


--
-- Name: MapPlanItem_clientId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "MapPlanItem_clientId_idx" ON public."MapPlanItem" USING btree ("clientId");


--
-- Name: MapPlanItem_plannedDate_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "MapPlanItem_plannedDate_idx" ON public."MapPlanItem" USING btree ("plannedDate");


--
-- Name: MapPlanItem_plannedDay_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "MapPlanItem_plannedDay_idx" ON public."MapPlanItem" USING btree ("plannedDay");


--
-- Name: MapPlanItem_siteId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "MapPlanItem_siteId_idx" ON public."MapPlanItem" USING btree ("siteId");


--
-- Name: MapPlanItem_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "MapPlanItem_status_idx" ON public."MapPlanItem" USING btree (status);


--
-- Name: MapPlanItem_ym_clientServiceId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "MapPlanItem_ym_clientServiceId_key" ON public."MapPlanItem" USING btree (ym, "clientServiceId");


--
-- Name: MapPlanItem_ym_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "MapPlanItem_ym_idx" ON public."MapPlanItem" USING btree (ym);


--
-- Name: MarketingList_isActive_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "MarketingList_isActive_idx" ON public."MarketingList" USING btree ("isActive");


--
-- Name: MarketingList_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "MarketingList_name_idx" ON public."MarketingList" USING btree (name);


--
-- Name: MarketingList_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "MarketingList_name_key" ON public."MarketingList" USING btree (name);


--
-- Name: MarketingList_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "MarketingList_slug_idx" ON public."MarketingList" USING btree (slug);


--
-- Name: MarketingList_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "MarketingList_slug_key" ON public."MarketingList" USING btree (slug);


--
-- Name: PersonClient_clientId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "PersonClient_clientId_idx" ON public."PersonClient" USING btree ("clientId");


--
-- Name: PersonClient_personId_clientId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "PersonClient_personId_clientId_key" ON public."PersonClient" USING btree ("personId", "clientId");


--
-- Name: PersonClient_personId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "PersonClient_personId_idx" ON public."PersonClient" USING btree ("personId");


--
-- Name: PersonSite_personId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "PersonSite_personId_idx" ON public."PersonSite" USING btree ("personId");


--
-- Name: PersonSite_personId_siteId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "PersonSite_personId_siteId_key" ON public."PersonSite" USING btree ("personId", "siteId");


--
-- Name: PersonSite_siteId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "PersonSite_siteId_idx" ON public."PersonSite" USING btree ("siteId");


--
-- Name: Person_fiscalCode_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Person_fiscalCode_key" ON public."Person" USING btree ("fiscalCode");


--
-- Name: Person_lastName_firstName_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Person_lastName_firstName_idx" ON public."Person" USING btree ("lastName", "firstName");


--
-- Name: PracticeBillingStep_billingStatus_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "PracticeBillingStep_billingStatus_idx" ON public."PracticeBillingStep" USING btree ("billingStatus");


--
-- Name: PracticeBillingStep_billingType_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "PracticeBillingStep_billingType_idx" ON public."PracticeBillingStep" USING btree ("billingType");


--
-- Name: PracticeBillingStep_invoiceDate_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "PracticeBillingStep_invoiceDate_idx" ON public."PracticeBillingStep" USING btree ("invoiceDate");


--
-- Name: PracticeBillingStep_paidAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "PracticeBillingStep_paidAt_idx" ON public."PracticeBillingStep" USING btree ("paidAt");


--
-- Name: PracticeBillingStep_practiceId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "PracticeBillingStep_practiceId_idx" ON public."PracticeBillingStep" USING btree ("practiceId");


--
-- Name: PracticeBillingStep_sortOrder_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "PracticeBillingStep_sortOrder_idx" ON public."PracticeBillingStep" USING btree ("sortOrder");


--
-- Name: PracticeBillingStep_triggerStatus_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "PracticeBillingStep_triggerStatus_idx" ON public."PracticeBillingStep" USING btree ("triggerStatus");


--
-- Name: ServiceCatalog_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "ServiceCatalog_name_key" ON public."ServiceCatalog" USING btree (name);


--
-- Name: TrainingRecord_dueDate_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "TrainingRecord_dueDate_idx" ON public."TrainingRecord" USING btree ("dueDate");


--
-- Name: TrainingRecord_fatturataAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "TrainingRecord_fatturataAt_idx" ON public."TrainingRecord" USING btree ("fatturataAt");


--
-- Name: TrainingRecord_fatturata_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "TrainingRecord_fatturata_idx" ON public."TrainingRecord" USING btree (fatturata);


--
-- Name: TrainingRecord_personId_courseId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "TrainingRecord_personId_courseId_key" ON public."TrainingRecord" USING btree ("personId", "courseId");


--
-- Name: TrainingRecord_personId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "TrainingRecord_personId_idx" ON public."TrainingRecord" USING btree ("personId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: WorkReport_clientId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "WorkReport_clientId_idx" ON public."WorkReport" USING btree ("clientId");


--
-- Name: WorkReport_serviceId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "WorkReport_serviceId_idx" ON public."WorkReport" USING btree ("serviceId");


--
-- Name: WorkReport_siteId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "WorkReport_siteId_idx" ON public."WorkReport" USING btree ("siteId");


--
-- Name: WorkReport_workedAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "WorkReport_workedAt_idx" ON public."WorkReport" USING btree ("workedAt");


--
-- Name: WorkReport_ym_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "WorkReport_ym_idx" ON public."WorkReport" USING btree (ym);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: messages_inserted_at_topic_index; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX messages_inserted_at_topic_index ON ONLY realtime.messages USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: subscription_subscription_id_entity_filters_action_filter_key; Type: INDEX; Schema: realtime; Owner: -
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_action_filter_key ON realtime.subscription USING btree (subscription_id, entity, filters, action_filter);


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: buckets_analytics_unique_name_idx; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX buckets_analytics_unique_name_idx ON storage.buckets_analytics USING btree (name) WHERE (deleted_at IS NULL);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: idx_objects_bucket_id_name_lower; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_objects_bucket_id_name_lower ON storage.objects USING btree (bucket_id, lower(name) COLLATE "C");


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: vector_indexes_name_bucket_id_idx; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX vector_indexes_name_bucket_id_idx ON storage.vector_indexes USING btree (name, bucket_id);


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: -
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();


--
-- Name: buckets protect_buckets_delete; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER protect_buckets_delete BEFORE DELETE ON storage.buckets FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


--
-- Name: objects protect_objects_delete; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER protect_objects_delete BEFORE DELETE ON storage.objects FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_oauth_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_oauth_client_id_fkey FOREIGN KEY (oauth_client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: webauthn_challenges webauthn_challenges_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.webauthn_challenges
    ADD CONSTRAINT webauthn_challenges_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: webauthn_credentials webauthn_credentials_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.webauthn_credentials
    ADD CONSTRAINT webauthn_credentials_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: ClientContactMarketingList ClientContactMarketingList_clientContactId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ClientContactMarketingList"
    ADD CONSTRAINT "ClientContactMarketingList_clientContactId_fkey" FOREIGN KEY ("clientContactId") REFERENCES public."ClientContact"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ClientContactMarketingList ClientContactMarketingList_marketingListId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ClientContactMarketingList"
    ADD CONSTRAINT "ClientContactMarketingList_marketingListId_fkey" FOREIGN KEY ("marketingListId") REFERENCES public."MarketingList"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ClientContact ClientContact_clientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ClientContact"
    ADD CONSTRAINT "ClientContact_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES public."Client"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ClientPractice ClientPractice_clientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ClientPractice"
    ADD CONSTRAINT "ClientPractice_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES public."Client"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ClientService ClientService_clientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ClientService"
    ADD CONSTRAINT "ClientService_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES public."Client"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ClientService ClientService_serviceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ClientService"
    ADD CONSTRAINT "ClientService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES public."ServiceCatalog"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ClientService ClientService_siteId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ClientService"
    ADD CONSTRAINT "ClientService_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES public."ClientSite"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ClientSite ClientSite_clientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ClientSite"
    ADD CONSTRAINT "ClientSite_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES public."Client"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ClinicalEngineeringCheck ClinicalEngineeringCheck_clientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ClinicalEngineeringCheck"
    ADD CONSTRAINT "ClinicalEngineeringCheck_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES public."Client"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ClinicalEngineeringCheck ClinicalEngineeringCheck_siteId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ClinicalEngineeringCheck"
    ADD CONSTRAINT "ClinicalEngineeringCheck_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES public."ClientSite"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: MapPlanItem MapPlanItem_clientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MapPlanItem"
    ADD CONSTRAINT "MapPlanItem_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES public."Client"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MapPlanItem MapPlanItem_clientServiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MapPlanItem"
    ADD CONSTRAINT "MapPlanItem_clientServiceId_fkey" FOREIGN KEY ("clientServiceId") REFERENCES public."ClientService"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MapPlanItem MapPlanItem_siteId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MapPlanItem"
    ADD CONSTRAINT "MapPlanItem_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES public."ClientSite"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PersonClient PersonClient_clientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PersonClient"
    ADD CONSTRAINT "PersonClient_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES public."Client"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PersonClient PersonClient_personId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PersonClient"
    ADD CONSTRAINT "PersonClient_personId_fkey" FOREIGN KEY ("personId") REFERENCES public."Person"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PersonSite PersonSite_personId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PersonSite"
    ADD CONSTRAINT "PersonSite_personId_fkey" FOREIGN KEY ("personId") REFERENCES public."Person"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PersonSite PersonSite_siteId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PersonSite"
    ADD CONSTRAINT "PersonSite_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES public."ClientSite"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Person Person_clientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Person"
    ADD CONSTRAINT "Person_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES public."Client"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PracticeBillingStep PracticeBillingStep_practiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PracticeBillingStep"
    ADD CONSTRAINT "PracticeBillingStep_practiceId_fkey" FOREIGN KEY ("practiceId") REFERENCES public."ClientPractice"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TrainingRecord TrainingRecord_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TrainingRecord"
    ADD CONSTRAINT "TrainingRecord_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."CourseCatalog"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TrainingRecord TrainingRecord_personId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TrainingRecord"
    ADD CONSTRAINT "TrainingRecord_personId_fkey" FOREIGN KEY ("personId") REFERENCES public."Person"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: WorkReport WorkReport_clientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."WorkReport"
    ADD CONSTRAINT "WorkReport_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES public."Client"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: WorkReport WorkReport_serviceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."WorkReport"
    ADD CONSTRAINT "WorkReport_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES public."ServiceCatalog"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: WorkReport WorkReport_siteId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."WorkReport"
    ADD CONSTRAINT "WorkReport_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES public."ClientSite"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: vector_indexes vector_indexes_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets_vectors(id);


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: Client; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public."Client" ENABLE ROW LEVEL SECURITY;

--
-- Name: ClientContact; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public."ClientContact" ENABLE ROW LEVEL SECURITY;

--
-- Name: ClientPractice; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public."ClientPractice" ENABLE ROW LEVEL SECURITY;

--
-- Name: ClientService; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public."ClientService" ENABLE ROW LEVEL SECURITY;

--
-- Name: ClientSite; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public."ClientSite" ENABLE ROW LEVEL SECURITY;

--
-- Name: ClinicalEngineeringCheck; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public."ClinicalEngineeringCheck" ENABLE ROW LEVEL SECURITY;

--
-- Name: CourseCatalog; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public."CourseCatalog" ENABLE ROW LEVEL SECURITY;

--
-- Name: MapPlanItem; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public."MapPlanItem" ENABLE ROW LEVEL SECURITY;

--
-- Name: Person; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public."Person" ENABLE ROW LEVEL SECURITY;

--
-- Name: PersonClient; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public."PersonClient" ENABLE ROW LEVEL SECURITY;

--
-- Name: PersonSite; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public."PersonSite" ENABLE ROW LEVEL SECURITY;

--
-- Name: PracticeBillingStep; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public."PracticeBillingStep" ENABLE ROW LEVEL SECURITY;

--
-- Name: ServiceCatalog; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public."ServiceCatalog" ENABLE ROW LEVEL SECURITY;

--
-- Name: TrainingRecord; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public."TrainingRecord" ENABLE ROW LEVEL SECURITY;

--
-- Name: User; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;

--
-- Name: WorkReport; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public."WorkReport" ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: -
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.buckets_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_vectors; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.buckets_vectors ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: vector_indexes; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.vector_indexes ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: -
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


--
-- PostgreSQL database dump complete
--

\unrestrict iIg1H075YYbbsmPBNfUZS6zDbQV0X5b8O4TRlsS1kvO9LHPYehMqrzE5PXYHjSv

