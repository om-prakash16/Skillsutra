-- CMS Taxonomy Table
CREATE TABLE IF NOT EXISTS cms_taxonomy (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL, -- e.g., CATEGORY, TAG
    parent_id UUID REFERENCES cms_taxonomy(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- CMS Pages Table
CREATE TABLE IF NOT EXISTS cms_pages (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL, -- e.g., DRAFT, PUBLISHED
    meta_title VARCHAR(255),
    meta_description TEXT,
    content_blocks JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- CMS Articles Table (Blogs/News)
CREATE TABLE IF NOT EXISTS cms_articles (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE,
    author_id UUID REFERENCES users(id),
    cover_image_url TEXT,
    seo_metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- CMS Article Taxonomy (Many-to-Many)
CREATE TABLE IF NOT EXISTS cms_article_taxonomy (
    article_id UUID REFERENCES cms_articles(id) ON DELETE CASCADE,
    taxonomy_id UUID REFERENCES cms_taxonomy(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, taxonomy_id)
);

-- CMS Banners Table (Global Announcements)
CREATE TABLE IF NOT EXISTS cms_banners (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- e.g., ANNOUNCEMENT, WARNING
    is_active BOOLEAN DEFAULT FALSE,
    link_url TEXT,
    placement VARCHAR(50) NOT NULL, -- e.g., GLOBAL_TOP, DASHBOARD
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
