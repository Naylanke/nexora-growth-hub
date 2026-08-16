
CREATE TYPE public.app_role AS ENUM ('user','reseller','admin');
CREATE TYPE public.order_status AS ENUM ('pending','processing','in_progress','completed','partial','cancelled','failed');
CREATE TYPE public.txn_type AS ENUM ('deposit','order','refund','referral','adjustment');
CREATE TYPE public.payment_status AS ENUM ('pending','completed','failed','cancelled');
CREATE TYPE public.ticket_status AS ENUM ('open','pending','answered','closed');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  username TEXT UNIQUE,
  balance NUMERIC(14,4) NOT NULL DEFAULT 0 CHECK (balance >= 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  referral_earnings NUMERIC(14,4) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "own roles read" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

CREATE TABLE public.service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.service_categories TO anon, authenticated;
GRANT ALL ON public.service_categories TO service_role;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories public read" ON public.service_categories FOR SELECT TO anon, authenticated USING (is_active);
CREATE POLICY "categories admin write" ON public.service_categories FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_service_id TEXT,
  provider TEXT NOT NULL DEFAULT 'default',
  category_id UUID REFERENCES public.service_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  service_type TEXT NOT NULL DEFAULT 'Default',
  provider_rate NUMERIC(14,4) NOT NULL DEFAULT 0,
  rate NUMERIC(14,4) NOT NULL DEFAULT 0,
  markup_percent NUMERIC(6,2) NOT NULL DEFAULT 30,
  min_quantity INT NOT NULL DEFAULT 1,
  max_quantity INT NOT NULL DEFAULT 100000,
  avg_delivery_time TEXT,
  refill BOOLEAN NOT NULL DEFAULT false,
  cancel BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  orders_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (provider, provider_service_id)
);
GRANT SELECT ON public.services TO anon, authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "services public read" ON public.services FOR SELECT TO anon, authenticated USING (is_active);
CREATE POLICY "services admin write" ON public.services FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE INDEX services_category_idx ON public.services(category_id);
CREATE INDEX services_featured_idx ON public.services(is_featured) WHERE is_active;

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  provider_order_id TEXT,
  service_name TEXT NOT NULL,
  category TEXT,
  link TEXT NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  charge NUMERIC(14,4) NOT NULL CHECK (charge >= 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  status public.order_status NOT NULL DEFAULT 'pending',
  provider_status TEXT,
  start_count INT,
  remains INT,
  refunded BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders own read" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "orders admin write" ON public.orders FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE INDEX orders_user_idx ON public.orders(user_id, created_at DESC);

CREATE TABLE public.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type public.txn_type NOT NULL,
  amount NUMERIC(14,4) NOT NULL,
  balance_after NUMERIC(14,4) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  reference_id UUID,
  description TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.wallet_transactions TO authenticated;
GRANT ALL ON public.wallet_transactions TO service_role;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "txn own read" ON public.wallet_transactions FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE INDEX txn_user_idx ON public.wallet_transactions(user_id, created_at DESC);

CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC(14,4) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  provider TEXT NOT NULL DEFAULT 'manual',
  provider_txn_id TEXT,
  status public.payment_status NOT NULL DEFAULT 'pending',
  credited BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (provider, provider_txn_id)
);
GRANT SELECT ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "payments own read" ON public.payments FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  kind TEXT NOT NULL DEFAULT 'system',
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notif own read" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "notif own update" ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  status public.ticket_status NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.support_tickets TO authenticated;
GRANT ALL ON public.support_tickets TO service_role;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tickets own read" ON public.support_tickets FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "tickets own insert" ON public.support_tickets FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "tickets own update" ON public.support_tickets FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin')) WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

CREATE TABLE public.support_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_staff BOOLEAN NOT NULL DEFAULT false,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.support_messages TO authenticated;
GRANT ALL ON public.support_messages TO service_role;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "messages read" ON public.support_messages FOR SELECT TO authenticated USING (
  public.has_role(auth.uid(),'admin') OR EXISTS (SELECT 1 FROM public.support_tickets t WHERE t.id = ticket_id AND t.user_id = auth.uid())
);
CREATE POLICY "messages insert" ON public.support_messages FOR INSERT TO authenticated WITH CHECK (
  auth.uid() = user_id AND (public.has_role(auth.uid(),'admin') OR EXISTS (SELECT 1 FROM public.support_tickets t WHERE t.id = ticket_id AND t.user_id = auth.uid()))
);

CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.announcements TO anon, authenticated;
GRANT ALL ON public.announcements TO service_role;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "announcements public read" ON public.announcements FOR SELECT TO anon, authenticated USING (is_published);
CREATE POLICY "announcements admin" ON public.announcements FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  reason TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audit admin read" ON public.audit_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  key_hash TEXT NOT NULL,
  key_prefix TEXT NOT NULL,
  label TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.api_keys TO authenticated;
GRANT ALL ON public.api_keys TO service_role;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "api keys own read" ON public.api_keys FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.provider_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  kind TEXT NOT NULL,
  ok BOOLEAN NOT NULL DEFAULT true,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.provider_sync_logs TO authenticated;
GRANT ALL ON public.provider_sync_logs TO service_role;
ALTER TABLE public.provider_sync_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sync logs admin read" ON public.provider_sync_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER services_updated BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER orders_updated BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER payments_updated BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER tickets_updated BEFORE UPDATE ON public.support_tickets FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE base_username TEXT;
BEGIN
  base_username := lower(regexp_replace(coalesce(NEW.raw_user_meta_data->>'username', split_part(NEW.email,'@',1)), '[^a-z0-9_]', '', 'g'));
  INSERT INTO public.profiles (id, email, full_name, username, referral_code)
  VALUES (
    NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name',
    base_username || '_' || substr(replace(NEW.id::text,'-',''),1,4),
    upper(substr(replace(NEW.id::text,'-',''),1,8))
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user') ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.apply_wallet_change(
  _user_id UUID, _amount NUMERIC, _type public.txn_type, _description TEXT DEFAULT NULL,
  _reference_id UUID DEFAULT NULL, _created_by UUID DEFAULT NULL
) RETURNS NUMERIC LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE new_balance NUMERIC;
BEGIN
  UPDATE public.profiles SET balance = balance + _amount WHERE id = _user_id RETURNING balance INTO new_balance;
  IF new_balance IS NULL THEN RAISE EXCEPTION 'profile not found'; END IF;
  INSERT INTO public.wallet_transactions (user_id, type, amount, balance_after, reference_id, description, created_by)
  VALUES (_user_id, _type, _amount, new_balance, _reference_id, _description, _created_by);
  RETURN new_balance;
END; $$;
REVOKE ALL ON FUNCTION public.apply_wallet_change(UUID,NUMERIC,public.txn_type,TEXT,UUID,UUID) FROM public, anon, authenticated;

INSERT INTO public.service_categories (name, slug, icon, sort_order) VALUES
 ('Instagram','instagram','instagram',1),
 ('TikTok','tiktok','music',2),
 ('YouTube','youtube','youtube',3),
 ('X (Twitter)','x','twitter',4),
 ('Facebook','facebook','facebook',5),
 ('Telegram','telegram','send',6);

INSERT INTO public.services (provider_service_id, category_id, name, description, provider_rate, rate, min_quantity, max_quantity, avg_delivery_time, refill, is_featured)
SELECT '1001', id, 'Instagram Followers — High Quality', 'Real-looking profiles, gradual delivery, low drop rate.', 0.90, 1.20, 100, 100000, '0-1 hour', true, true FROM public.service_categories WHERE slug='instagram';
INSERT INTO public.services (provider_service_id, category_id, name, description, provider_rate, rate, min_quantity, max_quantity, avg_delivery_time, is_featured)
SELECT '1002', id, 'Instagram Likes — Instant', 'Instant start likes for posts and reels.', 0.20, 0.30, 50, 50000, '0-15 minutes', true FROM public.service_categories WHERE slug='instagram';
INSERT INTO public.services (provider_service_id, category_id, name, description, provider_rate, rate, min_quantity, max_quantity, avg_delivery_time, is_featured)
SELECT '2001', id, 'TikTok Views — Fast', 'High retention views delivered fast.', 0.03, 0.05, 1000, 1000000, '0-30 minutes', true FROM public.service_categories WHERE slug='tiktok';
INSERT INTO public.services (provider_service_id, category_id, name, description, provider_rate, rate, min_quantity, max_quantity, avg_delivery_time, refill, is_featured)
SELECT '2002', id, 'TikTok Followers', 'Stable followers with refill guarantee.', 1.40, 1.90, 100, 50000, '1-3 hours', true, true FROM public.service_categories WHERE slug='tiktok';
INSERT INTO public.services (provider_service_id, category_id, name, description, provider_rate, rate, min_quantity, max_quantity, avg_delivery_time, is_featured)
SELECT '3001', id, 'YouTube Views — Monetizable', 'Safe, ad-friendly watch time.', 1.80, 2.40, 500, 500000, '6-12 hours', true FROM public.service_categories WHERE slug='youtube';
INSERT INTO public.services (provider_service_id, category_id, name, description, provider_rate, rate, min_quantity, max_quantity, avg_delivery_time)
SELECT '3002', id, 'YouTube Subscribers', 'Gradual subscriber growth.', 8.00, 10.50, 50, 10000, '12-24 hours' FROM public.service_categories WHERE slug='youtube';
INSERT INTO public.services (provider_service_id, category_id, name, description, provider_rate, rate, min_quantity, max_quantity, avg_delivery_time)
SELECT '4001', id, 'X Followers', 'Quality followers for X profiles.', 3.10, 4.20, 100, 20000, '1-6 hours' FROM public.service_categories WHERE slug='x';
INSERT INTO public.services (provider_service_id, category_id, name, description, provider_rate, rate, min_quantity, max_quantity, avg_delivery_time)
SELECT '5001', id, 'Facebook Page Likes', 'Page likes from active accounts.', 2.20, 2.90, 100, 50000, '2-8 hours' FROM public.service_categories WHERE slug='facebook';
INSERT INTO public.services (provider_service_id, category_id, name, description, provider_rate, rate, min_quantity, max_quantity, avg_delivery_time)
SELECT '6001', id, 'Telegram Channel Members', 'Members for public channels.', 1.10, 1.60, 100, 100000, '1-4 hours' FROM public.service_categories WHERE slug='telegram';
