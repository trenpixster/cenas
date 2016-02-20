defmodule Hackathon.ClickController do
  alias Hackathon.Repo
  alias Hackathon.Click
  use Hackathon.Web, :controller

  def index(conn, params) do
    clicks = Repo.all(Click) |> Enum.map(fn(el) -> Map.drop(el, [:__meta__, :__struct__]) end)
    json conn, clicks
  end

  def click(conn, params) do
    cid = params["cid"]
    nfa_id = params["nfa_id"]
    url = params["url"]
    payload = params["payload"]

    insert_click(cid, nfa_id, url, payload)

    json conn, %{success: true}
  end

  defp insert_click(cid, nfa_id, url, payload) do
    {:ok, click} = Hackathon.InsertHarvestedClickInteractor.call(cid, nfa_id, url, payload)
  end

end
