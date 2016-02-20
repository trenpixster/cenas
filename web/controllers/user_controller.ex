defmodule Hackathon.UserController do
  use Hackathon.Web, :controller
  alias Hackathon.Repo
  alias Hackathon.User

  def default_user(conn, params) do
    case get_user do
      nil -> create_user(conn)
      _   -> true
    end
    json conn, get_user_json
  end

  def update_tid(conn, params) do
    tid = params["tid"]
    model = get_user
    model = %User{model | tid: tid}
    Repo.update model

    json conn, %{success: true}
  end

  defp get_user do
    Repo.get_by User, email: "default@example.com"
  end

  defp get_user_json do
    get_user |> Map.drop [:__meta__, :__struct__]
  end

  defp create_user(conn) do
    user = %User{
      email: "default@example.com",
      hash: "lolx",
      tid: "UA-57696322-2",
      username: "Rhino Soldier"
    }
    {:ok, model } = Repo.insert user
  end

end
