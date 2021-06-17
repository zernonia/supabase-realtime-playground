const { createClient } = require("@supabase/supabase-js")
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_KEY
)

module.exports = (req, res) => {
  const {
    query: { id },
  } = req
  // set timeout to wait for all previous request is done
  setTimeout(async () => {
    const { data, error } = await supabase
      .from("realtime_user")
      .update({
        online: false,
      })
      .match({
        id,
      })

    res.json(data)
  }, 500)
}
