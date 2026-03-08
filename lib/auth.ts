import { supabase } from "./supabase"

type UserRole = "user" | "doctor" | "admin"

type PatientSignUpData = {
  name: string
  age?: string | number
  gender?: string
  phone?: string
  medicalHistory?: string
}

type DoctorSignUpData = {
  name: string
  phone?: string
  licenseNumber: string
  specialization: string
  experienceYears?: number
  documents?: unknown[]
  qualifications?: string[]
  languages?: string[]
  consultationFee?: number
  location?: string
  address?: string
  bio?: string
  availability?: Record<string, unknown>
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

async function upsertProfile(profile: {
  id: string
  email: string
  full_name?: string | null
  phone?: string | null
  role?: UserRole
  gender?: string | null
  age?: number | null
  medical_history?: string | null
}) {
  const { error } = await supabase.from("profiles").upsert(profile, { onConflict: "id" })
  if (error) throw error
}

export async function signUp(email: string, password: string, userData: PatientSignUpData) {
  const normalizedEmail = normalizeEmail(email)
  const numericAge = userData.age ? Number(userData.age) : null

  const { data, error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      data: {
        full_name: userData.name,
        phone: userData.phone ?? null,
        role: "user",
      },
    },
  })

  if (error) throw error

  let hasWritableSession = Boolean(data.session)
  if (!hasWritableSession) {
    const { data: signInData } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    })
    hasWritableSession = Boolean(signInData?.session)
  }

  if (data.user && hasWritableSession) {
    await upsertProfile({
      id: data.user.id,
      email: normalizedEmail,
      full_name: userData.name,
      phone: userData.phone ?? null,
      role: "user",
      gender: userData.gender ?? null,
      age: Number.isFinite(numericAge) ? numericAge : null,
      medical_history: userData.medicalHistory ?? null,
    })
  }

  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: normalizeEmail(email),
    password,
  })

  if (error) throw error

  if (data.user) {
    await upsertProfile({
      id: data.user.id,
      email: data.user.email ?? normalizeEmail(email),
      full_name: (data.user.user_metadata?.full_name as string | undefined) ?? null,
      phone: (data.user.user_metadata?.phone as string | undefined) ?? null,
      role: (data.user.user_metadata?.role as UserRole | undefined) ?? "user",
    })
  }

  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle()
  if (error) throw error
  return data
}

export async function signUpDoctor(email: string, password: string, doctorData: DoctorSignUpData) {
  const normalizedEmail = normalizeEmail(email)

  const { data, error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      data: {
        full_name: doctorData.name,
        phone: doctorData.phone ?? null,
        role: "doctor",
      },
    },
  })

  if (error) throw error

  let hasWritableSession = Boolean(data.session)
  if (!hasWritableSession) {
    const { data: signInData } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    })
    hasWritableSession = Boolean(signInData?.session)
  }

  if (!hasWritableSession) {
    throw new Error("Email verification is pending. Verify your email first, then log in and complete doctor signup.")
  }

  if (data.user) {
    await upsertProfile({
      id: data.user.id,
      email: normalizedEmail,
      full_name: doctorData.name,
      phone: doctorData.phone ?? null,
      role: "doctor",
    })

    const { error: doctorError } = await supabase.from("doctors").upsert(
      {
        id: data.user.id,
        license_number: doctorData.licenseNumber,
        specialization: doctorData.specialization,
        experience_years: doctorData.experienceYears ?? 0,
        qualifications: doctorData.qualifications ?? [],
        languages: doctorData.languages ?? [],
        consultation_fee: doctorData.consultationFee ?? 0,
        location: doctorData.location ?? null,
        address: doctorData.address ?? null,
        phone: doctorData.phone ?? null,
        email: normalizedEmail,
        bio: doctorData.bio ?? "",
        availability: doctorData.availability ?? {},
        is_verified: false,
      },
      { onConflict: "id" },
    )

    if (doctorError) throw doctorError

    const { error: applicationError } = await supabase.from("doctor_applications").insert(
      {
        user_id: data.user.id,
        doctor_id: data.user.id,
        license_number: doctorData.licenseNumber,
        specialization: doctorData.specialization,
        experience_years: doctorData.experienceYears ?? 0,
        documents: doctorData.documents ?? [],
        status: "pending",
      },
    )

    if (applicationError) throw applicationError
  }

  return data
}

export async function getCurrentUserRole() {
  const user = await getCurrentUser()
  if (!user) return null

  const profile = await getProfile(user.id)
  if (profile?.role) return profile.role

  const fallbackRole = (user.user_metadata?.role as UserRole | undefined) ?? "user"
  if (user.email) {
    await upsertProfile({
      id: user.id,
      email: user.email,
      full_name: (user.user_metadata?.full_name as string | undefined) ?? null,
      phone: (user.user_metadata?.phone as string | undefined) ?? null,
      role: fallbackRole,
    })
  }

  return fallbackRole
}

export async function getDoctorProfile(doctorId: string) {
  const { data, error } = await supabase.from("doctors").select("*, profiles(*)").eq("id", doctorId).maybeSingle()
  if (error) throw error
  return data
}

export async function isDoctorVerified(doctorId: string) {
  const { data, error } = await supabase.from("doctors").select("is_verified").eq("id", doctorId).maybeSingle()
  if (error) return false
  return Boolean(data?.is_verified)
}
