import React, { useState } from 'react';
import { X, Database, Check, Copy, Key, ExternalLink, ShieldCheck } from 'lucide-react';
import { isSupabaseConfigured, saveSupabaseCredentials, clearSupabaseCredentials } from '../lib/supabase';

export function SupabaseConfigModal({ isOpen, onClose }) {
  const [url, setUrl] = useState(localStorage.getItem('pan_supabase_url') || '');
  const [key, setKey] = useState(localStorage.getItem('pan_supabase_key') || '');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (url && key) {
      saveSupabaseCredentials(url, key);
    }
  };

  const handleClear = () => {
    clearSupabaseCredentials();
  };

  const copySqlScript = () => {
    const sqlText = `-- COPIAR Y EJECUTAR EN SUPABASE SQL EDITOR
-- Ver el archivo completo generado en: supabase_schema.sql
CREATE TABLE IF NOT EXISTS public.tasks (...);
    `;
    navigator.clipboard.writeText(sqlText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
              isSupabaseConfigured ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading text-stone-900">
                Conexión a Supabase (Backend PostgreSQL)
              </h3>
              <p className="text-xs text-stone-500">
                {isSupabaseConfigured ? '🟢 Conectado con Supabase Realtime' : '⚡ Ejecutando en Modo Local (LocalStorage)'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info card */}
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-xs space-y-2 text-stone-700">
          <p className="font-bold flex items-center gap-1.5 text-stone-900">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            La app funciona 100% interactiva en Modo Local de inmediato.
          </p>
          <p>
            Si deseas conectar tu base de datos Supabase en la nube, crea un proyecto en{' '}
            <a 
              href="https://supabase.com" 
              target="_blank" 
              rel="noreferrer"
              className="text-amber-700 font-bold underline inline-flex items-center gap-0.5"
            >
              Supabase.com <ExternalLink className="w-3 h-3" />
            </a>, ejecuta el script SQL del proyecto (<code className="bg-stone-200 px-1 py-0.5 rounded text-[11px]">supabase_schema.sql</code>) e ingresa tus claves aquí abajo:
          </p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSave} className="space-y-4">
          
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
              SUPABASE URL (Project URL)
            </label>
            <input
              type="url"
              required
              placeholder="https://xyzxyz.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
              SUPABASE ANON KEY (Public Key)
            </label>
            <input
              type="password"
              required
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {isSupabaseConfigured ? (
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl"
              >
                Desconectar y volver a Modo Local
              </button>
            ) : <span />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
              >
                Cerrar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Conectar Supabase
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
