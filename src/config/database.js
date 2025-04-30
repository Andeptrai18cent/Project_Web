const {createClient} = require('@supabase/supabase-js')
require("dotenv").config()

const supabaseUrl = process.env.supabase_url
const supabaseKey = process.env.supabase_api_key

const connection = createClient(supabaseUrl, supabaseKey)

module.exports = connection