import { supabase } from './supabase'

export async function signUp(email: string, password: string, userData: any) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) throw error

  if (data.user) {
    // Sign in the user to establish session for RLS
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) throw signInError

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        email,
        full_name: userData.name,
        phone: userData.phone,
        date_of_birth: userData.dateOfBirth,
        gender: userData.gender,
        medical_history: userData.medicalHistory,
      })

    if (profileError) throw profileError
  }

  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

export async function signUpDoctor(email: string, password: string, doctorData: any) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) throw error

  if (data.user) {
    // Create profile with doctor role
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        email,
        full_name: doctorData.name,
        phone: doctorData.phone,
        role: 'doctor',
      })

    if (profileError) throw profileError

    // Create doctor application
    const { error: applicationError } = await supabase
      .from('doctor_applications')
      .insert({
        user_id: data.user.id,
        license_number: doctorData.licenseNumber,
        specialization: doctorData.specialization,
        experience_years: doctorData.experienceYears,
        documents: doctorData.documents || [],
        status: 'pending',
      })

    if (applicationError) throw applicationError

    // Create doctor record (unverified)
    const { error: doctorError } = await supabase
      .from('doctors')
      .insert({
        id: data.user.id,
        license_number: doctorData.licenseNumber,
        specialization: doctorData.specialization,
        experience_years: doctorData.experienceYears,
        qualifications: doctorData.qualifications || [],
        languages: doctorData.languages || [],
        consultation_fee: doctorData.consultationFee,
        location: doctorData.location,
        address: doctorData.address,
        phone: doctorData.phone,
        email: email,
        bio: doctorData.bio || '',
        availability: doctorData.availability || {},
        is_verified: false,
      })

    if (doctorError) throw doctorError
  }

  return data
}

export async function getCurrentUserRole() {
  const user = await getCurrentUser()
  if (!user) return null

  const profile = await getProfile(user.id)
  return profile?.role || 'user'
}

export async function getDoctorProfile(doctorId: string) {
  const { data, error } = await supabase
    .from('doctors')
    .select('*, profiles(*)')
    .eq('id', doctorId)
    .single()

  if (error) throw error
  return data
}

export async function isDoctorVerified(doctorId: string) {
  const { data, error } = await supabase
    .from('doctors')
    .select('is_verified')
    .eq('id', doctorId)
    .single()

  if (error) return false
  return data?.is_verified || false
}