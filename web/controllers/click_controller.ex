defmodule Hackathon.ClickController do
  alias Hackathon.Repo
  alias Hackathon.Click
  use Hackathon.Web, :controller

  def index(conn, params) do
    index_clicks(conn, false)
  end

  def index_ignored(conn, params) do
    index_clicks(conn, true)
  end

  def index_clicks(conn, is_ignored) do
    query = from c in Click,
              where: c.ignored == ^is_ignored,
              where: c.archived == false,
              order_by: [desc: :is_bookmarklet],
              order_by: c.updated_at,
              select: c
    clicks = Repo.all(query) |> Enum.map(fn(el) -> Map.drop(el, [:__meta__, :__struct__]) end)
    json conn, clicks
  end

  def show(conn, params) do
    id = params["id"]
    click = Hackathon.Repo.get_by(Hackathon.Click, id: id)
    |> Map.drop [:__meta__, :__struct__]

    json conn, click
  end

  def ignore(conn, params) do
    click_id = params["click_id"]

    model = Repo.get_by Click, id: click_id
    model = %Click{ model | ignored: true }

    Repo.update model
    json conn, %{success: true}
  end

  def unignore(conn, params) do
    click_id = params["click_id"]

    model = Repo.get_by Click, id: click_id
    model = %Click{ model | ignored: false }

    Repo.update model
    json conn, %{success: true}
  end

  def wtf(conn, _) do
    text conn, "ok"
  end

  def click(conn, params) do
    spawn __MODULE__, :process_click, [params]
    json conn, %{success: true}
  end

  def process_click(params) do
    cid = params["cid"]
    nfa_id = params["nfa_id"]
    is_bookmarklet = params["bookmarklet"]
    url = params["url"]
    payload = params["payload"]

    insert_click(cid, nfa_id, url, is_bookmarklet, payload)
  end

  defp insert_click(cid, nfa_id, url, is_bookmarklet, payload) do
    spawn Hackathon.InsertHarvestedClickInteractor, :call, [cid, nfa_id, url, is_bookmarklet, payload]
  end

end
