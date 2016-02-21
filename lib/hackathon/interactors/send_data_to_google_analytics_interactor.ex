defmodule Hackathon.SendDataToGoogleAnalyticsInteractor do
  require Logger
  def call(v, ec, ea, el, ev, cid, tid) do
    body = gen_body(v, ec, ea, el, ev, cid, tid)
    HTTPotion.post "https://www.google-analytics.com/collect", [body: body, headers: ["User-Agent": "Hackathon Elixir"]]
  end

  def gen_body(v, ec, ea, el, ev, cid, tid) do
    Logger.info "v=#{v}&ec=#{ec}&ea=#{ea}&el=#{el}&ev=#{ev}&cid=#{cid}&tid=#{tid}&t=event"
    "v=#{v}&ec=#{ec}&ea=#{ea}&el=#{el}&ev=#{ev}&cid=#{cid}&tid=#{tid}&t=event"
  end
end
