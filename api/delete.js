const apiurl = process.env.VITE_SUPABASE_URL
const apikey = process.env.VITE_SUPABASE_KEY

module.exports = (req, res) => {
  fetch(`${apiurl}/rest/v1/realtime?name=in.%28${sessionId}%29`, {
    method: "DELETE",
    keepalive: true,
    headers: {
      apikey,
      Authorization: `Bearer ${apikey}`,
    },
  })

  res.send("done")
}
