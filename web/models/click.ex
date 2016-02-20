defmodule Hackathon.Click do
  use Hackathon.Web, :model

  @primary_key {:id, :binary_id, autogenerate: true}
  schema "click" do
    field :cid, :string
    field :nfa_id, :string
    field :payload, :map
    field :url, :string

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
end
