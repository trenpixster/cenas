defmodule Hackathon.InsertHarvestedClickInteractor do
  alias Hackathon.Repo
  alias Hackathon.Click
  alias Hackathon.FindMatchingClick
  alias Hackathon.AddClickEvent

  def call(cid, nfa_id, url, is_bookmarklet, payload) do
    IO.puts "InsertHarvestedClickInteractor spawned!"
    model = FindMatchingClick.call(url, payload["target"])
    |> consume_click(cid, nfa_id, url, is_bookmarklet, payload)

    IO.puts "spawning MatchRulesInteractor"
    spawn Hackathon.MatchRulesInteractor, :call, [model, cid]
  end

  def consume_click({true, model}, cid, nfa_id, url, is_bookmarklet, payload) do
    IO.puts "consume_click true"
    {:ok, model} = model
    |> Click.add_click_event(cid)
    |> Repo.update
    model
  end

  def consume_click({false, unicorn}, cid, nfa_id, url, is_bookmarklet, payload) do
    IO.puts "consume_click false"
    model = %Click{
      nfa_id: nfa_id,
      url: url,
      cid: cid,
      ignored: false,
      is_bookmarklet: is_bookmarklet,
      archived: false,
      unicorn: unicorn,
      payload: payload,
      events: []
    } |> Click.add_click_event(cid)
    Repo.insert model
    model
  end
end
