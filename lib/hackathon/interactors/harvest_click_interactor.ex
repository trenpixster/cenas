defmodule Hackathon.HarvestClickInteractor do
  alias Hackathon.Repo
  alias Hackathon.Click
  def call(cid, nfa_id, url, payload) do
    Repo.insert %Click{cid: cid, nfa_id: nfa_id, url: url, payload: payload}
  end
end