defmodule Hackathon.ClickController do
  use Hackathon.Web, :controller

  def click(conn, params) do
    cid = params["cid"]
    nfa_id = params["nfa_id"]
    url = params["url"]
    payload = params["payload"]

    insert_click(cid, nfa_id, url, payload)

    json conn, %{success: true}
  end

  defp insert_click(cid, nfa_id, url, payload) do
    {:ok, click} = Hackathon.HarvestClickInteractor.call(cid, nfa_id, url, payload)
  end

end
