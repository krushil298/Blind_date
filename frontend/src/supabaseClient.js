import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ykomelcnfzpvtgbpbjbe.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlrb21lbGNuZnpwdnRnYnBiamJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3MDU4NjAsImV4cCI6MjA4OTI4MTg2MH0.fm1FMM0cIuFBaWSbpjokRhajDcOQOkH0SKsfY4L7Vko'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
