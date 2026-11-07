CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    plan_tier VARCHAR(50) DEFAULT 'enterprise',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) DEFAULT 'analyst',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE data_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(50) NOT NULL,
    connection_config JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    sync_status VARCHAR(50) DEFAULT 'idle',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE datasets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    source_id UUID REFERENCES data_sources(id) ON DELETE SET NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    schema_definition JSONB NOT NULL,
    row_count BIGINT DEFAULT 0,
    storage_table_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dashboards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100) DEFAULT 'Executive',
    is_default BOOLEAN DEFAULT FALSE,
    layout_config JSONB DEFAULT '[]'::jsonb,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE widgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dashboard_id UUID REFERENCES dashboards(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    widget_type VARCHAR(50) NOT NULL,
    dataset_id UUID REFERENCES datasets(id) ON DELETE SET NULL,
    query_config JSONB NOT NULL,
    visual_config JSONB NOT NULL,
    refresh_interval_sec INT DEFAULT 300,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE kpi_definitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    key_code VARCHAR(50) NOT NULL,
    formula_expression TEXT,
    target_value NUMERIC(15, 2),
    warning_threshold NUMERIC(15, 2),
    critical_threshold NUMERIC(15, 2),
    unit VARCHAR(20) DEFAULT '$',
    higher_is_better BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE business_metrics_daily (
    id BIGSERIAL PRIMARY KEY,
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL,
    channel VARCHAR(100) NOT NULL,
    region VARCHAR(50) NOT NULL,
    customer_tier VARCHAR(50) NOT NULL,
    gross_revenue NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    net_revenue NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    cogs NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    marketing_spend NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    new_customers INT NOT NULL DEFAULT 0,
    active_customers INT NOT NULL DEFAULT 0,
    churned_customers INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_business_metrics_lookup
ON business_metrics_daily (org_id, metric_date, channel, region);

CREATE TABLE scheduled_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    dashboard_id UUID REFERENCES dashboards(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    frequency VARCHAR(50) DEFAULT 'weekly',
    recipients TEXT[] NOT NULL,
    export_format VARCHAR(20) DEFAULT 'pdf',
    is_active BOOLEAN DEFAULT TRUE,
    last_generated_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE VIEW view_monthly_kpi_summary AS
SELECT
    org_id,
    DATE_TRUNC('month', metric_date)::DATE as report_month,
    SUM(gross_revenue) as total_gross_revenue,
    SUM(net_revenue) as total_net_revenue,
    SUM(marketing_spend) as total_marketing_spend,
    SUM(new_customers) as total_new_customers,
    SUM(churned_customers) as total_churned_customers,
    CASE
        WHEN SUM(new_customers) > 0 THEN ROUND(SUM(marketing_spend) / SUM(new_customers), 2)
        ELSE 0.00
    END as avg_cac,
    CASE
        WHEN SUM(gross_revenue) > 0 THEN ROUND(((SUM(gross_revenue) - SUM(cogs)) / SUM(gross_revenue)) * 100, 2)
        ELSE 0.00
    END as gross_margin_percentage
FROM business_metrics_daily
GROUP BY org_id, DATE_TRUNC('month', metric_date);
