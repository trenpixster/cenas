defmodule Hackathon.RuleController do
  use Hackathon.Web, :controller
  alias Hackathon.Repo
  alias Hackathon.Rule
  alias Hackathon.Click

  def create(conn, params) do
    title = params["title"]
    trigger = params["trigger"]
    action = params["action"]
    nfa_id = params["nfa_id"]
    click_id = params["click_id"]

    rule = %Rule{nfa_id: nfa_id, trigger: trigger, action: action, title: title, click_id: click_id}
    Repo.insert rule

    click = Repo.get_by Click, id: click_id
    Repo.update %Click{click | archived: true}

    json conn, (rule |> Map.drop [:__meta__, :__struct__])
  end

  def update(conn, params) do
    title = params["title"]
    trigger = params["trigger"]
    action = params["action"]
    rule_id = params["rule_id"]
    rule = Repo.get_by Rule, id: rule_id

    Repo.update %Rule{rule | trigger: trigger, action: action, title: title}

    json conn, (rule |> Map.drop [:__meta__, :__struct__])
  end

  def delete(conn, params) do
    rule_id = params["rule_id"]
    rule = Repo.get_by Rule, id: rule_id

    click_id = rule.click_id
    click = Repo.get_by Click, id: click_id

    Repo.delete rule
    Repo.update %Click{click | archived: false}

    json conn, %{success: true}
  end

  def index(conn, _) do
    rules = Repo.all(Rule)
    |> Enum.map(fn (el) -> Map.drop el, [:__meta__, :__struct__] end)

    json conn, rules
  end

  def show(conn, params) do
    rule_id = params["rule_id"]
    rule = Repo.get_by(Rule, id: rule_id)
    |> Map.drop [:__meta__, :__struct__]

    json conn, rule
  end

end
