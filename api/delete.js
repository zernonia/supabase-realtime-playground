const apiurl = process.env.VITE_SUPABASE_URL
const apikey = process.env.VITE_SUPABASE_KEY

const { createClient } = require("@supabase/supabase-js")
const supabase = createClient(apiurl, apikey)

module.exports = (req, res) => {
  const {
    query: { name },
  } = req
  // fetch(`${apiurl}/rest/v1/realtime?name=in.%28${sessionId}%29`, {
  //   method: "DELETE",
  //   keepalive: true,
  //   headers: {
  //     apikey,
  //     Authorization: `Bearer ${apikey}`,
  //   },
  // })
  supabase.from("realtime").delete().match({
    name: name,
  })

  res.send("done")
}
