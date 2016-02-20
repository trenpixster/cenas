defmodule Hackathon.RuleController do
  use Hackathon.Web, :controller
  alias Hackathon.Repo
  alias Hackathon.Rule

  def create(conn, params) do
    title = params["title"]
    trigger = params["trigger"]
    action = params["action"]
    nfa_id = params["nfa_id"]

    model = %Rule{nfa_id: nfa_id, trigger: trigger, action: action}
    Repo.insert model

    json conn, (model |> Map.drop [:__meta__, :__struct__])
  end

  def index(conn, params) do
    rules = Repo.all(Rule)
    |> Enum.map(fn (el) -> Map.drop el, [:__meta__, :__struct__] end)

    json conn, rules
  end

end
