defmodule Hackathon.Click do
  use Hackathon.Web, :model

  @primary_key {:id, :binary_id, autogenerate: true}
  schema "click" do
    field :unicorn, :string
    field :url, :string
    field :events, {:array, :map}
    field :nfa_id, :string
    field :payload, :map
    timestamps
  end

  @required_fields ~w(cid nfa_id payload)
  @optional_fields ~w()

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
  end

  def unicornify(url, target) do
    :crypto.hash(:sha, url <> target) |> Base.encode16
  end

  def add_click_event(model, cid) do
    %{ model | events: [%{cid: cid, timestamp: Ecto.DateTime.to_string(Ecto.DateTime.utc)}] ++ model.events }
  end
end
