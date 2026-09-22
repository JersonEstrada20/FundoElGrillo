/**
 * Cliente Supabase — reemplazo drop-in de base44Client
 * Mantiene la misma API que el SDK de Base44 para que los componentes no cambien.
 *
 * Instalar: npm install @supabase/supabase-js
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'fundo-el-grillo-auth',
  },
});

// ============================================================
// Helper: convertir sort de Base44 a Supabase
// "order" → { column: "order", ascending: true }
// "-created_date" → { column: "created_date", ascending: false }
// ============================================================
function parseSort(sort) {
  if (!sort) return null;
  const desc = sort.startsWith('-');
  const column = desc ? sort.slice(1) : sort;
  return { column, ascending: !desc };
}

// ============================================================
// Helper: convertir query filter de Base44 a Supabase
// { status: "active", cabin: "Boldo" } → .eq("status", "active").eq("cabin", "Boldo")
// { age: { $gte: 18 } } → .gte("age", 18)
// { $or: [...] } → .or(...)
// ============================================================
function applyFilter(query, filter) {
  if (!filter) return query;
  for (const [key, value] of Object.entries(filter)) {
    if (key === '$or') {
      const orStr = value.map((cond) => {
        return Object.entries(cond).map(([k, v]) => {
          if (typeof v === 'object' && v !== null) {
            const op = Object.keys(v)[0];
            return `${k}.${op}.${v[op]}`;
          }
          return `${k}.eq.${v}`;
        }).join(',');
      }).join(',');
      query = query.or(orStr);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      for (const [op, val] of Object.entries(value)) {
        switch (op) {
          case '$gte': query = query.gte(key, val); break;
          case '$gt': query = query.gt(key, val); break;
          case '$lte': query = query.lte(key, val); break;
          case '$lt': query = query.lt(key, val); break;
          case '$ne': query = query.neq(key, val); break;
          case '$in': query = query.in(key, val); break;
        }
      }
    } else {
      query = query.eq(key, value);
    }
  }
  return query;
}

// ============================================================
// Factory de entidades
// ============================================================
function createEntity(tableName, entityName) {
  return {
    async list(sort, limit) {
      let q = supabase.from(tableName).select('*');
      const s = parseSort(sort);
      if (s) q = q.order(s.column, { ascending: s.ascending });
      if (limit) q = q.limit(limit);
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    },

    async filter(filter, sort, limit) {
      let q = supabase.from(tableName).select('*');
      q = applyFilter(q, filter);
      const s = parseSort(sort);
      if (s) q = q.order(s.column, { ascending: s.ascending });
      if (limit) q = q.limit(limit);
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    },

    async get(id) {
      const { data, error } = await supabase.from(tableName).select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    },

    async create(record) {
      const { data, error } = await supabase.from(tableName).insert(record).select().single();
      if (error) throw error;
      return data;
    },

    async bulkCreate(records) {
      const { data, error } = await supabase.from(tableName).insert(records).select();
      if (error) throw error;
      return data || [];
    },

    async update(id, updates) {
      const { data, error } = await supabase.from(tableName).update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },

    async bulkUpdate(items) {
      const results = [];
      for (const item of items) {
        const { id, ...updates } = item;
        const { data, error } = await supabase.from(tableName).update(updates).eq('id', id).select().single();
        if (error) throw error;
        results.push(data);
      }
      return results;
    },

    async updateMany(filter, update) {
      // MongoDB-style operators: $set, $inc, etc.
      const updates = {};
      if (update.$set) Object.assign(updates, update.$set);
      if (update.$inc) {
        for (const [k, v] of Object.entries(update.$inc)) {
          // Supabase no tiene $inc directo; hay que leer y actualizar
        }
      }
      let q = supabase.from(tableName).update(updates);
      q = applyFilter(q, filter);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },

    async delete(id) {
      const { error } = await supabase.from(tableName).delete().eq('id', id);
      if (error) throw error;
    },

    async deleteMany(filter) {
      let q = supabase.from(tableName).delete();
      q = applyFilter(q, filter);
      const { error } = await q;
      if (error) throw error;
    },

    subscribe(callback) {
      const channel = supabase
        .channel(`${tableName}-changes`)
        .on('postgres_changes', { event: '*', schema: 'public', table: tableName }, (payload) => {
          const event = {
            type: payload.eventType === 'INSERT' ? 'create'
              : payload.eventType === 'UPDATE' ? 'update'
              : payload.eventType === 'DELETE' ? 'delete' : 'update',
            data: payload.new || payload.old,
            id: (payload.new || payload.old)?.id,
          };
          callback(event);
        })
        .subscribe();
      return () => supabase.removeChannel(channel);
    },

    schema() {
      // Retorna un schema simplificado para JsonSchemaForm
      return { type: 'object', properties: {}, required: [] };
    },
  };
}

// ============================================================
// Cliente base44 compatible
// ============================================================
export const base44 = {
  entities: {
    Cabin: createEntity('cabin', 'Cabin'),
    BookingRequest: createEntity('booking_request', 'BookingRequest'),
    VisitorEntry: createEntity('visitor_entry', 'VisitorEntry'),
    User: createEntity('profiles', 'User'),
  },

  auth: {
    async me() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      return {
        id: user.id,
        email: user.email,
        full_name: profile?.full_name || user.user_metadata?.full_name || '',
        role: profile?.role || 'user',
        ...profile,
      };
    },

    async isAuthenticated() {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session;
    },

    async loginViaEmailPassword(email, password) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    },

    async loginWithProvider(provider, fromUrl) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: fromUrl || window.location.origin },
      });
      if (error) throw error;
      return data;
    },

    async register({ email, password, full_name }) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name } },
      });
      if (error) throw error;
      return data;
    },

    async verifyOtp({ email, otpCode }) {
      const { data, error } = await supabase.auth.verifyOtp({ email, token: otpCode, type: 'email' });
      if (error) throw error;
      return data;
    },

    async resendOtp(email) {
      const { error } = await supabase.auth.resend({ type: 'signup', email });
      if (error) throw error;
    },

    async resetPasswordRequest(email) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
    },

    async resetPassword({ resetToken, newPassword }) {
      // Supabase usa el token de la URL automáticamente
      const { data, error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      return data;
    },

    async updateMe(data) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      const { data: profile, error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id)
        .select()
        .single();
      if (error) throw error;
      return profile;
    },

    logout(redirectUrl) {
      supabase.auth.signOut().then(() => {
        if (redirectUrl) window.location.href = redirectUrl;
        else window.location.href = '/login';
      });
    },

    redirectToLogin(nextUrl) {
      window.location.href = `/login?returnTo=${encodeURIComponent(nextUrl || window.location.href)}`;
    },
  },

  users: {
    async inviteUser(email, role) {
      // Requiere service role key → llamar edge function
      const { data, error } = await supabase.functions.invoke('inviteUser', {
        body: { email, role },
      });
      if (error) throw error;
      return data;
    },
  },

  integrations: {
    Core: {
      async UploadPublicFile({ file }) {
        const ext = file.name?.split('.').pop() || 'jpg';
        const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { data, error } = await supabase.storage
          .from('public')
          .upload(path, file, { upsert: false });
        if (error) throw error;
        const { data: urlData } = supabase.storage.from('public').getPublicUrl(path);
        return { file_url: urlData.publicUrl };
      },

      async UploadPrivateFile({ file }) {
        const ext = file.name?.split('.').pop() || 'jpg';
        const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { data, error } = await supabase.storage
          .from('private')
          .upload(path, file, { upsert: false });
        if (error) throw error;
        return { file_uri: path };
      },

      async CreateFileSignedUrl({ file_uri, expires_in = 300 }) {
        const { data, error } = await supabase.storage
          .from('private')
          .createSignedUrl(file_uri, expires_in);
        if (error) throw error;
        return { signed_url: data.signedUrl };
      },

      async SendEmail({ to, subject, body, text, html, attachments }) {
        const { data, error } = await supabase.functions.invoke('sendEmail', {
          body: { to, subject, text: text || body, html, attachments },
        });
        if (error) throw error;
        return data;
      },
    },
  },

  functions: {
    async invoke(name, payload) {
      const { data, error } = await supabase.functions.invoke(name, { body: payload });
      if (error) throw error;
      return data;
    },
  },

  analytics: {
    track({ eventName, properties }) {
      // Opcional: integrar con PostHog, Plausible, etc.
      console.log('[analytics]', eventName, properties);
    },
  },

  app: {
    async getPublicSettings() {
      // No hay equivalente directo; retornar null
      return null;
    },
  },

  asServiceRole: {
    // Para edge functions — usa service role key
    entities: createEntity('', ''), // se sobrescribe en edge functions
  },
};