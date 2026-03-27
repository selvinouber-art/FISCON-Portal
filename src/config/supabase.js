import { createClient } from '@supabase/supabase-js'

const URL = import.meta.env.VITE_SUPABASE_URL
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(URL, KEY)

export async function buscarPorCodigo(codigo) {
  const { data, error } = await supabase
    .from('records')
    .select('*')
    .eq('codigo_acesso', codigo.toLowerCase().trim())
    .maybeSingle()
  if (error) throw error
  return data
}

export async function buscarDefesaDoRegistro(recordId) {
  const { data, error } = await supabase
    .from('defesas')
    .select('*')
    .eq('record_id', recordId)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function buscarSolicitacaoProrrogacao(recordId) {
  const { data, error } = await supabase
    .from('prorrogacoes')
    .select('*')
    .eq('record_id', recordId)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function registrarAcesso(recordId, codigo) {
  try {
    await supabase.from('acessos_portal').insert({
      id: `acesso-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
      record_id: recordId,
      codigo_acesso: codigo,
      acessado_em: new Date().toISOString(),
      ip: 'anonimo',
    })
  } catch { /* silencioso */ }
}

export async function registrarCiencia(recordId, codigo) {
  try {
    await supabase.from('records')
      .update({ ciencia_em: new Date().toISOString() })
      .eq('id', recordId)
  } catch { /* silencioso */ }
}

export async function enviarDefesa(dados) {
  const { data, error } = await supabase
    .from('defesas')
    .insert(dados)
    .select()
  if (error) throw error
  return data?.[0]
}

export async function enviarProrrogacao(dados) {
  const { data, error } = await supabase
    .from('prorrogacoes')
    .insert(dados)
    .select()
  if (error) throw error
  return data?.[0]
}

export async function uploadAnexo(arquivo, recordId, index) {
  const ext  = arquivo.name.split('.').pop()
  const path = `defesas/${recordId}_${index}_${Date.now()}.${ext}`
  const { data, error } = await supabase.storage
    .from('fiscon-fotos')
    .upload(path, arquivo, { upsert: true })
  if (error) throw error
  const { data: urlData } = supabase.storage.from('fiscon-fotos').getPublicUrl(path)
  return urlData.publicUrl
}

export async function buscarHistoricoRegistro(recordId) {
  const { data, error } = await supabase
    .from('historico_registros')
    .select('*')
    .eq('record_id', recordId)
    .order('created_at', { ascending: true })
  if (error) return []
  return data || []
}
