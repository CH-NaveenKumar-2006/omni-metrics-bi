INSERT INTO organizations (id, name, slug)
VALUES ('b47a9821-39d2-43cf-8302-3f112e4b0001', 'Acme Technologies', 'acme-tech')
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, org_id, email, password_hash, full_name, role)
VALUES (
    'a11a22b3-44c5-66d7-88e9-001122334455',
    'b47a9821-39d2-43cf-8302-3f112e4b0001',
    'admin@acme.io',
    '$2b$12$e80yq8K1r1OQfV90iQo9/e4L.qH7Z.X9zL30fF.q3R39Zf41J2s1K',
    'Operations Lead',
    'admin'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO dashboards (id, org_id, title, description, category, is_default)
VALUES (
    'd1111111-2222-3333-4444-555555555555',
    'b47a9821-39d2-43cf-8302-3f112e4b0001',
    'Executive Revenue Overview',
    'Tracking ARR, MRR, unit economics, and pipeline conversion.',
    'Executive',
    TRUE
)
ON CONFLICT (id) DO NOTHING;
