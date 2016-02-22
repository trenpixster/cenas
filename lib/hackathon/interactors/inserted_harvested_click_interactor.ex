defmodule Hackathon.InsertHarvestedClickInteractor do
  alias Hackathon.Repo
  alias Hackathon.Click
  alias Hackathon.FindMatchingClick

  def call(cid, nfa_id, url, is_bookmarklet, payload) do
    model = FindMatchingClick.call(url, payload["target"])
    |> consume_click(cid, nfa_id, url, is_bookmarklet, payload)
  end

  def consume_click({true, model}, cid, _, _, _, _) do
    model
    |> Click.add_click_event(cid)
    |> Repo.update
  end

  def consume_click({false, unicorn}, cid, nfa_id, url, is_bookmarklet, payload) do
    %Click{
      nfa_id: nfa_id,
      url: url,
      cid: cid,
      ignored: false,
      is_bookmarklet: is_bookmarklet,
      archived: false,
      unicorn: unicorn,
      payload: payload,
      events: []
    }
    |> Click.add_click_event(cid)
    |> Repo.insert
  end
end
