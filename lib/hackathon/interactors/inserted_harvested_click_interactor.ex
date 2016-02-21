defmodule Hackathon.InsertHarvestedClickInteractor do
  alias Hackathon.Repo
  alias Hackathon.Click
  alias Hackathon.FindMatchingClick
  alias Hackathon.AddClickEvent

  def call(cid, nfa_id, url, payload) do
    FindMatchingClick.call(url, payload["target"])
    |> consume_click(cid, nfa_id, url, payload)
  end

  def consume_click({true, model}, cid, nfa_id, url, payload) do
    model
    |> Click.add_click_event(cid)
    |> Repo.update
  end

  def consume_click({false, unicorn}, cid, nfa_id, url, payload) do
    model = %Click{
      nfa_id: nfa_id,
      url: url,
      cid: cid,
      ignored: false,
      archived: false,
      unicorn: unicorn,
      payload: payload,
      events: []
    } |> Click.add_click_event(cid)
    Repo.insert model
  end
end
