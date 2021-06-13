const { createClient } = require("@supabase/supabase-js")
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_KEY
)

module.exports = (req, res) => {
  const {
    query: { name },
  } = req
  // set timeout to wait for all previous request is done
  setTimeout(async () => {
    const { data, error } = await supabase
      .from("realtime")
      .update({
        online: false,
      })
      .match({
        name,
      })

    res.json(data)
  }, 500)
}
